/**
 * Scraper for Neuroscape TCG card data from null-legion.app
 *
 * The site is a Rails + Hotwire/Turbo app. Individual card pages (/cards/:id)
 * return 406 unless requested with `Accept: text/vnd.turbo-stream.html`, and even
 * then only show a card image modal with no stats.
 *
 * Strategy:
 * 1. Scrape all 9 listing pages (sorted by ID) to get card id, name, imageUrl
 * 2. Make filtered requests by type, faction, cost, and requirement to determine
 *    each card's attributes via set membership
 * 3. Output JSON with all data we can extract
 *
 * Usage:
 *   npx tsx scripts/scrape.ts
 */

import * as https from "https";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://null-legion.app";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

interface ScrapedCard {
  id: number;
  name: string;
  imageUrl: string;
  type: string | null;
  subtype: string | null;
  faction: string | null;
  requirement: string | null;
  cost: number | null;
}

// ---------- HTTP helper ----------

function fetchPage(urlPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const req = https.get(
      url,
      {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent": USER_AGENT,
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url.toString()}`));
          res.resume();
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        res.on("error", reject);
      }
    );
    req.on("error", reject);
  });
}

// ---------- Parsers ----------

function parseCardList(html: string): { id: number; name: string; imageUrl: string }[] {
  const cards: { id: number; name: string; imageUrl: string }[] = [];
  const regex = /href="\/cards\/(\d+)".*?alt="([^"]+)".*?src="([^"]+)"/gs;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    cards.push({
      id: parseInt(match[1], 10),
      name: match[2],
      imageUrl: match[3],
    });
  }
  return cards;
}

function parseCardIds(html: string): Set<number> {
  const ids = new Set<number>();
  const regex = /href="\/cards\/(\d+)"/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    ids.add(parseInt(match[1], 10));
  }
  return ids;
}

// ---------- Delay ----------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- Main ----------

async function main() {
  console.log("=== Neuroscape Card Scraper ===\n");

  // Step 1: Get all cards from all pages
  console.log("Step 1: Fetching all card listing pages...");
  const allCards: Map<number, ScrapedCard> = new Map();

  for (let page = 1; page <= 9; page++) {
    try {
      const html = await fetchPage(`/cards?sort=id&page=${page}`);
      const cards = parseCardList(html);
      for (const c of cards) {
        allCards.set(c.id, {
          ...c,
          type: null,
          subtype: null,
          faction: null,
          requirement: null,
          cost: null,
        });
      }
      console.log(`  Page ${page}: ${cards.length} cards (total: ${allCards.size})`);
      await delay(300);
    } catch (err) {
      console.error(`  Page ${page} failed:`, err);
    }
  }

  console.log(`\nTotal cards scraped: ${allCards.size}\n`);

  // Step 2: Determine card types by filtering
  console.log("Step 2: Determining card types...");
  const types = ["character", "gear", "mainframe", "program"];

  for (const type of types) {
    try {
      // Fetch all pages for this type filter
      let page = 1;
      let foundAny = true;
      const idsForType = new Set<number>();

      while (foundAny) {
        const html = await fetchPage(`/cards?sort=id&type%5B%5D=${type}&page=${page}`);
        const ids = parseCardIds(html);
        if (ids.size === 0) {
          foundAny = false;
        } else {
          for (const id of ids) idsForType.add(id);
          // Check if there's a next page
          const hasNextPage = html.includes(`page=${page + 1}`);
          if (!hasNextPage) foundAny = false;
          page++;
        }
        await delay(300);
      }

      for (const id of idsForType) {
        const card = allCards.get(id);
        if (card) card.type = type;
      }
      console.log(`  ${type}: ${idsForType.size} cards`);
    } catch (err) {
      console.error(`  Type ${type} failed:`, err);
    }
  }

  // Step 2b: Determine gear subtypes
  console.log("\nStep 2b: Determining gear subtypes...");
  const gearSubtypes = ["cyberware", "tether", "weapon"];

  for (const subtype of gearSubtypes) {
    try {
      let page = 1;
      let foundAny = true;
      const idsForSubtype = new Set<number>();

      while (foundAny) {
        const html = await fetchPage(
          `/cards?sort=id&type%5B%5D=gear&gear_subtype%5B%5D=${subtype}&page=${page}`
        );
        const ids = parseCardIds(html);
        if (ids.size === 0) {
          foundAny = false;
        } else {
          for (const id of ids) idsForSubtype.add(id);
          const hasNextPage = html.includes(`page=${page + 1}`);
          if (!hasNextPage) foundAny = false;
          page++;
        }
        await delay(300);
      }

      for (const id of idsForSubtype) {
        const card = allCards.get(id);
        if (card) card.subtype = subtype;
      }
      console.log(`  gear/${subtype}: ${idsForSubtype.size} cards`);
    } catch (err) {
      console.error(`  Gear subtype ${subtype} failed:`, err);
    }
  }

  // Step 2c: Determine program subtypes
  console.log("\nStep 2c: Determining program subtypes...");
  const programSubtypes = ["environment", "protocol", "script"];

  for (const subtype of programSubtypes) {
    try {
      let page = 1;
      let foundAny = true;
      const idsForSubtype = new Set<number>();

      while (foundAny) {
        const html = await fetchPage(
          `/cards?sort=id&type%5B%5D=program&program_subtype%5B%5D=${subtype}&page=${page}`
        );
        const ids = parseCardIds(html);
        if (ids.size === 0) {
          foundAny = false;
        } else {
          for (const id of ids) idsForSubtype.add(id);
          const hasNextPage = html.includes(`page=${page + 1}`);
          if (!hasNextPage) foundAny = false;
          page++;
        }
        await delay(300);
      }

      for (const id of idsForSubtype) {
        const card = allCards.get(id);
        if (card) card.subtype = subtype;
      }
      console.log(`  program/${subtype}: ${idsForSubtype.size} cards`);
    } catch (err) {
      console.error(`  Program subtype ${subtype} failed:`, err);
    }
  }

  // Step 3: Determine factions
  console.log("\nStep 3: Determining factions...");
  const factions = [
    "ai", "anarchist", "animal", "corpo", "cybernetic", "dustrunner",
    "gambler", "hacker", "mech", "mystic", "nanobot", "raver",
    "robot", "thrasher", "wonderland",
  ];

  for (const faction of factions) {
    try {
      let page = 1;
      let foundAny = true;
      const idsForFaction = new Set<number>();

      while (foundAny) {
        const html = await fetchPage(`/cards?sort=id&faction%5B%5D=${faction}&page=${page}`);
        const ids = parseCardIds(html);
        if (ids.size === 0) {
          foundAny = false;
        } else {
          for (const id of ids) idsForFaction.add(id);
          const hasNextPage = html.includes(`page=${page + 1}`);
          if (!hasNextPage) foundAny = false;
          page++;
        }
        await delay(300);
      }

      for (const id of idsForFaction) {
        const card = allCards.get(id);
        if (card) card.faction = faction;
      }
      console.log(`  ${faction}: ${idsForFaction.size} cards`);
    } catch (err) {
      console.error(`  Faction ${faction} failed:`, err);
    }
  }

  // Step 4: Determine costs
  console.log("\nStep 4: Determining costs...");
  const costs = ["0", "1", "2", "3", "4", "5", "6+"];

  for (const cost of costs) {
    try {
      let page = 1;
      let foundAny = true;
      const idsForCost = new Set<number>();

      while (foundAny) {
        const encodedCost = encodeURIComponent(cost);
        const html = await fetchPage(`/cards?sort=id&cost%5B%5D=${encodedCost}&page=${page}`);
        const ids = parseCardIds(html);
        if (ids.size === 0) {
          foundAny = false;
        } else {
          for (const id of ids) idsForCost.add(id);
          const hasNextPage = html.includes(`page=${page + 1}`);
          if (!hasNextPage) foundAny = false;
          page++;
        }
        await delay(300);
      }

      const costValue = cost === "6+" ? 6 : parseInt(cost, 10);
      for (const id of idsForCost) {
        const card = allCards.get(id);
        if (card) card.cost = costValue;
      }
      console.log(`  cost ${cost}: ${idsForCost.size} cards`);
    } catch (err) {
      console.error(`  Cost ${cost} failed:`, err);
    }
  }

  // Step 5: Determine requirements
  console.log("\nStep 5: Determining requirements...");
  const requirements = [
    "ai", "anarchist", "animal", "corpo", "cybernetic", "dustrunner",
    "gambler", "hacker", "mech", "mystic", "nanobot", "raver",
    "robot", "thrasher", "wonderland",
  ];

  for (const req of requirements) {
    try {
      let page = 1;
      let foundAny = true;
      const idsForReq = new Set<number>();

      while (foundAny) {
        const html = await fetchPage(`/cards?sort=id&requirement=${req}&page=${page}`);
        const ids = parseCardIds(html);
        if (ids.size === 0) {
          foundAny = false;
        } else {
          for (const id of ids) idsForReq.add(id);
          const hasNextPage = html.includes(`page=${page + 1}`);
          if (!hasNextPage) foundAny = false;
          page++;
        }
        await delay(300);
      }

      for (const id of idsForReq) {
        const card = allCards.get(id);
        if (card) card.requirement = req;
      }
      if (idsForReq.size > 0) {
        console.log(`  requirement ${req}: ${idsForReq.size} cards`);
      }
    } catch (err) {
      console.error(`  Requirement ${req} failed:`, err);
    }
  }

  // Step 6: Output results
  console.log("\n=== Results ===\n");

  const result = Array.from(allCards.values()).sort((a, b) => a.id - b.id);

  // Stats
  const withType = result.filter((c) => c.type !== null).length;
  const withFaction = result.filter((c) => c.faction !== null).length;
  const withCost = result.filter((c) => c.cost !== null).length;
  const withReq = result.filter((c) => c.requirement !== null).length;

  console.log(`Total cards: ${result.length}`);
  console.log(`Cards with type: ${withType}`);
  console.log(`Cards with faction: ${withFaction}`);
  console.log(`Cards with cost: ${withCost}`);
  console.log(`Cards with requirement: ${withReq}`);
  console.log(`Cards with subtype: ${result.filter((c) => c.subtype !== null).length}`);

  // Write JSON output
  const outputPath = path.resolve(__dirname, "../src/lib/card-data.json");
  const outputData = result.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    subtype: c.subtype,
    faction: c.faction,
    requirement: c.requirement,
    cost: c.cost,
    imageUrl: `${BASE_URL}${c.imageUrl}`,
  }));

  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
  console.log(`\nCard data written to: ${outputPath}`);
}

main().catch(console.error);

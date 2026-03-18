import type { Card, CardFilter, SortOption, SortField, Rarity } from "./types.js";
import { RARITIES } from "./types.js";

const RARITY_ORDER: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  quantum_rare: 3,
  sourcecode: 4,
};

/**
 * In-memory card database with search, filter, and sort.
 */
export class CardDatabase {
  private cards: Map<string, Card> = new Map();

  /** Load cards into the database. Replaces any existing card with the same ID. */
  load(cards: Card[]): void {
    for (const card of cards) {
      this.cards.set(card.id, card);
    }
  }

  /** Remove all cards from the database. */
  clear(): void {
    this.cards.clear();
  }

  /** Get a card by its unique ID. */
  getById(id: string): Card | undefined {
    return this.cards.get(id);
  }

  /** Get all cards as an array. */
  getAll(): Card[] {
    return Array.from(this.cards.values());
  }

  /** Total number of cards in the database. */
  get size(): number {
    return this.cards.size;
  }

  /** Search and filter cards. */
  search(filter: CardFilter = {}, sort?: SortOption): Card[] {
    let results = this.getAll();

    // Name (case-insensitive substring match)
    if (filter.name) {
      const q = filter.name.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(q));
    }

    // Card types
    if (filter.types && filter.types.length > 0) {
      const set = new Set(filter.types);
      results = results.filter((c) => set.has(c.type));
    }

    // Factions
    if (filter.factions && filter.factions.length > 0) {
      const set = new Set(filter.factions);
      results = results.filter((c) => c.faction && set.has(c.faction));
    }

    // Rarities
    if (filter.rarities && filter.rarities.length > 0) {
      const set = new Set(filter.rarities);
      results = results.filter((c) => set.has(c.rarity));
    }

    // Sets
    if (filter.sets && filter.sets.length > 0) {
      const set = new Set(filter.sets);
      results = results.filter((c) => set.has(c.set));
    }

    // Keywords
    if (filter.keywords && filter.keywords.length > 0) {
      const set = new Set(filter.keywords);
      results = results.filter((c) => c.keywords.some((k) => set.has(k)));
    }

    // Numeric range filters
    if (filter.minCost != null) results = results.filter((c) => (c.stats.cost ?? 0) >= filter.minCost!);
    if (filter.maxCost != null) results = results.filter((c) => (c.stats.cost ?? 0) <= filter.maxCost!);
    if (filter.minPower != null) results = results.filter((c) => (c.stats.power ?? 0) >= filter.minPower!);
    if (filter.maxPower != null) results = results.filter((c) => (c.stats.power ?? 0) <= filter.maxPower!);
    if (filter.minDefense != null) results = results.filter((c) => (c.stats.defense ?? 0) >= filter.minDefense!);
    if (filter.maxDefense != null) results = results.filter((c) => (c.stats.defense ?? 0) <= filter.maxDefense!);
    if (filter.minHealth != null) results = results.filter((c) => (c.stats.health ?? 0) >= filter.minHealth!);
    if (filter.maxHealth != null) results = results.filter((c) => (c.stats.health ?? 0) <= filter.maxHealth!);

    // Sort
    if (sort) {
      results = this.sortCards(results, sort);
    }

    return results;
  }

  private sortCards(cards: Card[], { field, direction }: SortOption): Card[] {
    const dir = direction === "asc" ? 1 : -1;
    return [...cards].sort((a, b) => {
      const va = this.getSortValue(a, field);
      const vb = this.getSortValue(b, field);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }

  private getSortValue(card: Card, field: SortField): string | number {
    switch (field) {
      case "name":
        return card.name.toLowerCase();
      case "cost":
        return card.stats.cost ?? 0;
      case "power":
        return card.stats.power ?? 0;
      case "defense":
        return card.stats.defense ?? 0;
      case "health":
        return card.stats.health ?? 0;
      case "rarity":
        return RARITY_ORDER[card.rarity];
      case "cardNumber":
        return card.cardNumber ?? 0;
    }
  }

  /** Get all unique factions present in the database. */
  getFactions(): string[] {
    const factions = new Set<string>();
    for (const card of this.cards.values()) {
      if (card.faction) factions.add(card.faction);
    }
    return Array.from(factions);
  }

  /** Get all unique keywords present in the database. */
  getKeywords(): string[] {
    const keywords = new Set<string>();
    for (const card of this.cards.values()) {
      for (const kw of card.keywords) {
        keywords.add(kw);
      }
    }
    return Array.from(keywords);
  }

  /** Get card counts grouped by a field. */
  countBy(field: "type" | "faction" | "rarity" | "set"): Map<string, number> {
    const counts = new Map<string, number>();
    for (const card of this.cards.values()) {
      let key: string;
      switch (field) {
        case "type":
          key = card.type;
          break;
        case "faction":
          key = card.faction ?? "neutral";
          break;
        case "rarity":
          key = card.rarity;
          break;
        case "set":
          key = card.set;
          break;
      }
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }
}

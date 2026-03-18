import type { Card, Collection, CollectionEntry, CardFilter } from "./types.js";
import type { CardDatabase } from "./card-db.js";

/**
 * Manages a player's card collection — tracks owned cards, quantities, conditions, and foils.
 */
export class CollectionManager {
  private entries: Map<string, CollectionEntry[]> = new Map();

  constructor(private db: CardDatabase) {}

  /** Load a saved collection. */
  load(collection: Collection): void {
    this.entries.clear();
    for (const entry of collection.entries) {
      const list = this.entries.get(entry.cardId) ?? [];
      list.push({ ...entry });
      this.entries.set(entry.cardId, list);
    }
  }

  /** Export the collection as a serializable object. */
  export(): Collection {
    const entries: CollectionEntry[] = [];
    for (const list of this.entries.values()) {
      entries.push(...list);
    }
    return { entries };
  }

  /** Add copies of a card to the collection. */
  add(
    cardId: string,
    quantity: number = 1,
    options?: { condition?: CollectionEntry["condition"]; foil?: boolean },
  ): void {
    const list = this.entries.get(cardId) ?? [];
    const condition = options?.condition ?? "near_mint";
    const foil = options?.foil ?? false;

    // Try to merge with an existing entry of the same condition+foil
    const existing = list.find((e) => e.condition === condition && e.foil === foil);
    if (existing) {
      existing.quantity += quantity;
    } else {
      list.push({ cardId, quantity, condition, foil });
    }

    this.entries.set(cardId, list);
  }

  /** Remove copies of a card from the collection. Returns the number actually removed. */
  remove(cardId: string, quantity: number = 1): number {
    const list = this.entries.get(cardId);
    if (!list) return 0;

    let removed = 0;
    for (let i = list.length - 1; i >= 0 && removed < quantity; i--) {
      const entry = list[i]!;
      const take = Math.min(entry.quantity, quantity - removed);
      entry.quantity -= take;
      removed += take;
      if (entry.quantity <= 0) {
        list.splice(i, 1);
      }
    }

    if (list.length === 0) {
      this.entries.delete(cardId);
    }

    return removed;
  }

  /** Get total copies of a specific card. */
  getQuantity(cardId: string): number {
    const list = this.entries.get(cardId);
    if (!list) return 0;
    return list.reduce((sum, e) => sum + e.quantity, 0);
  }

  /** Get all entries for a specific card. */
  getEntries(cardId: string): CollectionEntry[] {
    return this.entries.get(cardId) ?? [];
  }

  /** Get all unique card IDs in the collection. */
  getUniqueCardIds(): string[] {
    return Array.from(this.entries.keys());
  }

  /** Get total number of unique cards. */
  getUniqueCount(): number {
    return this.entries.size;
  }

  /** Get total number of cards (counting all copies). */
  getTotalCount(): number {
    let total = 0;
    for (const list of this.entries.values()) {
      for (const entry of list) {
        total += entry.quantity;
      }
    }
    return total;
  }

  /** Check if the collection has at least `quantity` copies of a card. */
  has(cardId: string, quantity: number = 1): boolean {
    return this.getQuantity(cardId) >= quantity;
  }

  /** Get cards in the collection matching a filter, with resolved Card data. */
  search(filter: CardFilter = {}): Array<{ card: Card; entries: CollectionEntry[] }> {
    const matchingCards = this.db.search(filter);
    const matchingIds = new Set(matchingCards.map((c) => c.id));

    const results: Array<{ card: Card; entries: CollectionEntry[] }> = [];
    for (const [cardId, entries] of this.entries) {
      if (!matchingIds.has(cardId)) continue;
      const card = this.db.getById(cardId);
      if (card) {
        results.push({ card, entries });
      }
    }
    return results;
  }

  /** Get collection stats broken down by rarity. */
  getStatsByRarity(): Map<string, { unique: number; total: number }> {
    const stats = new Map<string, { unique: number; total: number }>();

    for (const [cardId, list] of this.entries) {
      const card = this.db.getById(cardId);
      if (!card) continue;

      const existing = stats.get(card.rarity) ?? { unique: 0, total: 0 };
      existing.unique += 1;
      existing.total += list.reduce((sum, e) => sum + e.quantity, 0);
      stats.set(card.rarity, existing);
    }

    return stats;
  }

  /** Get collection stats broken down by faction. */
  getStatsByFaction(): Map<string, { unique: number; total: number }> {
    const stats = new Map<string, { unique: number; total: number }>();

    for (const [cardId, list] of this.entries) {
      const card = this.db.getById(cardId);
      if (!card) continue;

      const faction = card.faction ?? "neutral";
      const existing = stats.get(faction) ?? { unique: 0, total: 0 };
      existing.unique += 1;
      existing.total += list.reduce((sum, e) => sum + e.quantity, 0);
      stats.set(faction, existing);
    }

    return stats;
  }

  /** Get completion percentage (unique cards owned / total cards in database). */
  getCompletionRate(): number {
    const totalInDb = this.db.size;
    if (totalInDb === 0) return 0;
    return this.getUniqueCount() / totalInDb;
  }

  /** Find cards in the database that are NOT in the collection. */
  getMissingCards(filter?: CardFilter): Card[] {
    const allCards = filter ? this.db.search(filter) : this.db.getAll();
    return allCards.filter((card) => !this.entries.has(card.id));
  }

  /** Check if a deck can be built from this collection (has enough copies of every card). */
  canBuildDeck(entries: Array<{ cardId: string; quantity: number }>): {
    canBuild: boolean;
    missing: Array<{ cardId: string; needed: number; have: number }>;
  } {
    const missing: Array<{ cardId: string; needed: number; have: number }> = [];

    for (const entry of entries) {
      const have = this.getQuantity(entry.cardId);
      if (have < entry.quantity) {
        missing.push({ cardId: entry.cardId, needed: entry.quantity, have });
      }
    }

    return { canBuild: missing.length === 0, missing };
  }
}

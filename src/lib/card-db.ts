import type { Card, CardFilter, SortOption, SortField } from "./types";

export class CardDatabase {
  private cards: Map<number, Card> = new Map();

  load(cards: Card[]): void {
    for (const card of cards) {
      this.cards.set(card.id, card);
    }
  }

  getById(id: number): Card | undefined {
    return this.cards.get(id);
  }

  getAll(): Card[] {
    return Array.from(this.cards.values());
  }

  get size(): number {
    return this.cards.size;
  }

  search(filter: CardFilter = {}, sort?: SortOption): Card[] {
    let results = this.getAll();

    if (filter.name) {
      const q = filter.name.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (filter.types && filter.types.length > 0) {
      const set = new Set(filter.types);
      results = results.filter((c) => set.has(c.type));
    }

    if (filter.subtypes && filter.subtypes.length > 0) {
      const set = new Set(filter.subtypes);
      results = results.filter((c) => c.subtype && set.has(c.subtype));
    }

    if (filter.factions && filter.factions.length > 0) {
      const set = new Set(filter.factions);
      results = results.filter((c) => {
        if (c.faction === null) return set.has("neutral");
        return set.has(c.faction);
      });
    }

    if (filter.minCost != null) results = results.filter((c) => c.cost >= filter.minCost!);
    if (filter.maxCost != null) results = results.filter((c) => c.cost <= filter.maxCost!);

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
        return card.cost;
      case "type":
        return card.type;
      case "faction":
        return card.faction ?? "zzz";
    }
  }

  countBy(field: "type" | "faction" | "subtype"): Map<string, number> {
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
        case "subtype":
          key = card.subtype ?? "none";
          break;
      }
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }
}

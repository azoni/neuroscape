import type { Deck, DeckEntry, DeckValidationError, DeckValidationResult } from "./types";
import { DECK_RULES } from "./types";
import type { CardDatabase } from "./card-db";

export class DeckBuilder {
  private deck: Deck;

  constructor(
    private db: CardDatabase,
    name: string = "Untitled Deck",
    id?: string,
  ) {
    this.deck = {
      id: id ?? crypto.randomUUID(),
      name,
      mainframeId: null,
      cyberdeck: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static fromDeck(db: CardDatabase, deck: Deck): DeckBuilder {
    const builder = new DeckBuilder(db, deck.name, deck.id);
    builder.deck = { ...deck };
    return builder;
  }

  setMainframe(cardId: number): this {
    this.deck.mainframeId = cardId;
    this.touch();
    return this;
  }

  addToCyberdeck(cardId: number, quantity: number = 1): this {
    this.addToList(this.deck.cyberdeck, cardId, quantity);
    this.touch();
    return this;
  }

  removeFromCyberdeck(cardId: number, quantity?: number): this {
    this.removeFromList(this.deck.cyberdeck, cardId, quantity);
    this.touch();
    return this;
  }

  setName(name: string): this {
    this.deck.name = name;
    this.touch();
    return this;
  }

  getDeck(): Deck {
    return { ...this.deck };
  }

  getCyberdeckSize(): number {
    return this.deck.cyberdeck.reduce((sum, e) => sum + e.quantity, 0);
  }

  validate(): DeckValidationResult {
    const errors: DeckValidationError[] = [];

    if (this.deck.mainframeId == null) {
      errors.push({ code: "NO_MAINFRAME", message: "Deck must have a mainframe card" });
    } else {
      const mf = this.db.getById(this.deck.mainframeId);
      if (!mf) {
        errors.push({ code: "CARD_NOT_FOUND", message: `Mainframe card not found: ${this.deck.mainframeId}`, cardId: this.deck.mainframeId });
      }
    }

    const cyberdeckSize = this.getCyberdeckSize();
    if (cyberdeckSize < DECK_RULES.CYBERDECK_MIN) {
      errors.push({ code: "CYBERDECK_TOO_SMALL", message: `Cyberdeck has ${cyberdeckSize} cards, minimum is ${DECK_RULES.CYBERDECK_MIN}` });
    }
    if (cyberdeckSize > DECK_RULES.CYBERDECK_MAX) {
      errors.push({ code: "CYBERDECK_TOO_LARGE", message: `Cyberdeck has ${cyberdeckSize} cards, maximum is ${DECK_RULES.CYBERDECK_MAX}` });
    }

    for (const entry of this.deck.cyberdeck) {
      if (entry.quantity > DECK_RULES.MAX_COPIES_PER_CARD) {
        errors.push({
          code: "TOO_MANY_COPIES",
          message: `Card ${entry.cardId}: ${entry.quantity} copies exceeds max of ${DECK_RULES.MAX_COPIES_PER_CARD}`,
          cardId: entry.cardId,
        });
      }

      const card = this.db.getById(entry.cardId);
      if (!card) {
        errors.push({ code: "CARD_NOT_FOUND", message: `Card not found: ${entry.cardId}`, cardId: entry.cardId });
      } else if (card.type === "mainframe") {
        errors.push({ code: "MAINFRAME_IN_CYBERDECK", message: `Mainframe card ${entry.cardId} cannot be in cyberdeck`, cardId: entry.cardId });
      }
    }

    return { valid: errors.length === 0, errors };
  }

  getFactionBreakdown(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const entry of this.deck.cyberdeck) {
      const card = this.db.getById(entry.cardId);
      const faction = card?.faction ?? "neutral";
      counts.set(faction, (counts.get(faction) ?? 0) + entry.quantity);
    }
    return counts;
  }

  getTypeBreakdown(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const entry of this.deck.cyberdeck) {
      const card = this.db.getById(entry.cardId);
      if (card) {
        counts.set(card.type, (counts.get(card.type) ?? 0) + entry.quantity);
      }
    }
    return counts;
  }

  getAverageCost(): number {
    let totalCost = 0;
    let totalCards = 0;
    for (const entry of this.deck.cyberdeck) {
      const card = this.db.getById(entry.cardId);
      if (card) {
        totalCost += card.cost * entry.quantity;
        totalCards += entry.quantity;
      }
    }
    return totalCards > 0 ? totalCost / totalCards : 0;
  }

  private addToList(list: DeckEntry[], cardId: number, quantity: number): void {
    const existing = list.find((e) => e.cardId === cardId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      list.push({ cardId, quantity });
    }
  }

  private removeFromList(list: DeckEntry[], cardId: number, quantity?: number): void {
    const idx = list.findIndex((e) => e.cardId === cardId);
    if (idx === -1) return;

    if (quantity == null) {
      list.splice(idx, 1);
    } else {
      list[idx]!.quantity -= quantity;
      if (list[idx]!.quantity <= 0) {
        list.splice(idx, 1);
      }
    }
  }

  private touch(): void {
    this.deck.updatedAt = new Date().toISOString();
  }
}

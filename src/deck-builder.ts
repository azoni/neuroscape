import type { Card, Deck, DeckEntry, DeckValidationError, DeckValidationResult } from "./types.js";
import { DECK_RULES } from "./types.js";
import type { CardDatabase } from "./card-db.js";

/**
 * Deck builder with full validation against Neuroscape TCG rules.
 *
 * Rules:
 * - 1 Mainframe card
 * - Cyberdeck: 50–255 non-RAM cards, max 4 copies of any card
 * - RAM deck: exactly 25 cards, max 5 special RAM
 */
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
      mainframeId: "",
      cyberdeck: [],
      ramDeck: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /** Load an existing deck for editing. */
  static fromDeck(db: CardDatabase, deck: Deck): DeckBuilder {
    const builder = new DeckBuilder(db, deck.name, deck.id);
    builder.deck = { ...deck };
    return builder;
  }

  /** Set the mainframe card. */
  setMainframe(cardId: string): this {
    this.deck.mainframeId = cardId;
    this.touch();
    return this;
  }

  /** Add cards to the cyberdeck. */
  addToCyberdeck(cardId: string, quantity: number = 1): this {
    this.addToList(this.deck.cyberdeck, cardId, quantity);
    this.touch();
    return this;
  }

  /** Remove cards from the cyberdeck. */
  removeFromCyberdeck(cardId: string, quantity?: number): this {
    this.removeFromList(this.deck.cyberdeck, cardId, quantity);
    this.touch();
    return this;
  }

  /** Add cards to the RAM deck. */
  addToRamDeck(cardId: string, quantity: number = 1): this {
    this.addToList(this.deck.ramDeck, cardId, quantity);
    this.touch();
    return this;
  }

  /** Remove cards from the RAM deck. */
  removeFromRamDeck(cardId: string, quantity?: number): this {
    this.removeFromList(this.deck.ramDeck, cardId, quantity);
    this.touch();
    return this;
  }

  /** Set deck name. */
  setName(name: string): this {
    this.deck.name = name;
    this.touch();
    return this;
  }

  /** Get the current deck snapshot. */
  getDeck(): Deck {
    return { ...this.deck };
  }

  /** Total number of cards in the cyberdeck. */
  getCyberdeckSize(): number {
    return this.deck.cyberdeck.reduce((sum, e) => sum + e.quantity, 0);
  }

  /** Total number of cards in the RAM deck. */
  getRamDeckSize(): number {
    return this.deck.ramDeck.reduce((sum, e) => sum + e.quantity, 0);
  }

  /** Validate the deck against Neuroscape rules. */
  validate(): DeckValidationResult {
    const errors: DeckValidationError[] = [];

    // Mainframe check
    if (!this.deck.mainframeId) {
      errors.push({ code: "NO_MAINFRAME", message: "Deck must have a mainframe card" });
    } else {
      const mf = this.db.getById(this.deck.mainframeId);
      if (!mf) {
        errors.push({ code: "CARD_NOT_FOUND", message: `Mainframe card not found: ${this.deck.mainframeId}`, cardId: this.deck.mainframeId });
      }
    }

    // Cyberdeck size
    const cyberdeckSize = this.getCyberdeckSize();
    if (cyberdeckSize < DECK_RULES.CYBERDECK_MIN) {
      errors.push({ code: "CYBERDECK_TOO_SMALL", message: `Cyberdeck has ${cyberdeckSize} cards, minimum is ${DECK_RULES.CYBERDECK_MIN}` });
    }
    if (cyberdeckSize > DECK_RULES.CYBERDECK_MAX) {
      errors.push({ code: "CYBERDECK_TOO_LARGE", message: `Cyberdeck has ${cyberdeckSize} cards, maximum is ${DECK_RULES.CYBERDECK_MAX}` });
    }

    // RAM deck size
    const ramSize = this.getRamDeckSize();
    if (ramSize !== DECK_RULES.RAM_DECK_SIZE) {
      errors.push({ code: "RAM_DECK_WRONG_SIZE", message: `RAM deck has ${ramSize} cards, must be exactly ${DECK_RULES.RAM_DECK_SIZE}` });
    }

    // Max copies per card (cyberdeck)
    for (const entry of this.deck.cyberdeck) {
      if (entry.quantity > DECK_RULES.MAX_COPIES_PER_CARD) {
        errors.push({
          code: "TOO_MANY_COPIES",
          message: `${entry.cardId}: ${entry.quantity} copies exceeds max of ${DECK_RULES.MAX_COPIES_PER_CARD}`,
          cardId: entry.cardId,
        });
      }

      // Ensure no RAM cards in cyberdeck
      const card = this.db.getById(entry.cardId);
      if (!card) {
        errors.push({ code: "CARD_NOT_FOUND", message: `Card not found: ${entry.cardId}`, cardId: entry.cardId });
      } else if (card.type === "ram") {
        errors.push({ code: "RAM_IN_CYBERDECK", message: `RAM card ${entry.cardId} cannot be in cyberdeck`, cardId: entry.cardId });
      }
    }

    // RAM deck validation
    let specialRamCount = 0;
    for (const entry of this.deck.ramDeck) {
      const card = this.db.getById(entry.cardId);
      if (!card) {
        errors.push({ code: "CARD_NOT_FOUND", message: `Card not found: ${entry.cardId}`, cardId: entry.cardId });
      } else if (card.type !== "ram") {
        errors.push({ code: "NON_RAM_IN_RAM_DECK", message: `Non-RAM card ${entry.cardId} cannot be in RAM deck`, cardId: entry.cardId });
      } else if (card.ramSubtype === "special") {
        specialRamCount += entry.quantity;
      }
    }

    if (specialRamCount > DECK_RULES.MAX_SPECIAL_RAM) {
      errors.push({
        code: "TOO_MANY_SPECIAL_RAM",
        message: `RAM deck has ${specialRamCount} special RAM cards, max is ${DECK_RULES.MAX_SPECIAL_RAM}`,
      });
    }

    return { valid: errors.length === 0, errors };
  }

  /** Get faction breakdown of the cyberdeck. */
  getFactionBreakdown(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const entry of this.deck.cyberdeck) {
      const card = this.db.getById(entry.cardId);
      const faction = card?.faction ?? "neutral";
      counts.set(faction, (counts.get(faction) ?? 0) + entry.quantity);
    }
    return counts;
  }

  /** Get type breakdown of the cyberdeck. */
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

  /** Get average RAM cost of the cyberdeck. */
  getAverageCost(): number {
    let totalCost = 0;
    let totalCards = 0;
    for (const entry of this.deck.cyberdeck) {
      const card = this.db.getById(entry.cardId);
      if (card?.stats.cost != null) {
        totalCost += card.stats.cost * entry.quantity;
        totalCards += entry.quantity;
      }
    }
    return totalCards > 0 ? totalCost / totalCards : 0;
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private addToList(list: DeckEntry[], cardId: string, quantity: number): void {
    const existing = list.find((e) => e.cardId === cardId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      list.push({ cardId, quantity });
    }
  }

  private removeFromList(list: DeckEntry[], cardId: string, quantity?: number): void {
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
    this.deck.updatedAt = new Date();
  }
}

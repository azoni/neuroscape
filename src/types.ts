// ─── Factions ────────────────────────────────────────────────────────────────

export type Faction =
  | "hacker"
  | "cybernetic"
  | "corpo"
  | "dustrunner"
  | "mystic"
  | "thrasher";

export const FACTIONS: readonly Faction[] = [
  "hacker",
  "cybernetic",
  "corpo",
  "dustrunner",
  "mystic",
  "thrasher",
] as const;

// ─── Rarities ────────────────────────────────────────────────────────────────

export type Rarity = "common" | "uncommon" | "rare" | "quantum_rare" | "sourcecode";

export const RARITIES: readonly Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "quantum_rare",
  "sourcecode",
] as const;

// ─── Card Types ──────────────────────────────────────────────────────────────

export type CardType =
  | "character"
  | "program"
  | "gear"
  | "environment"
  | "mainframe"
  | "trojan"
  | "cyberware"
  | "drug"
  | "protocol"
  | "tarot"
  | "ram";

export type ProgramSubtype = "script" | "virus";
export type RamSubtype = "basic" | "special";

export const CARD_TYPES: readonly CardType[] = [
  "character",
  "program",
  "gear",
  "environment",
  "mainframe",
  "trojan",
  "cyberware",
  "drug",
  "protocol",
  "tarot",
  "ram",
] as const;

// ─── Keywords ────────────────────────────────────────────────────────────────

export type Keyword =
  | "overrun"
  | "swift"
  | "counter"
  | "legendary"
  | "passive"
  | "activated"
  | "triggered";

// ─── Card Sets ───────────────────────────────────────────────────────────────

export type CardSet = "genesis" | "genesis_unlimited";

export const CARD_SETS: readonly CardSet[] = [
  "genesis",
  "genesis_unlimited",
] as const;

// ─── Card Definition ─────────────────────────────────────────────────────────

export interface CardStats {
  /** RAM cost to play this card */
  cost?: number;
  /** Attack/power value */
  power?: number;
  /** Defense value */
  defense?: number;
  /** Health (for characters) */
  health?: number;
  /** Number of gear ports (for characters) */
  gearPorts?: number;
}

export interface Card {
  /** Unique card identifier (e.g. "GEN-001") */
  id: string;
  /** Display name */
  name: string;
  /** Card type */
  type: CardType;
  /** Program subtype, if applicable */
  programSubtype?: ProgramSubtype;
  /** RAM subtype, if applicable */
  ramSubtype?: RamSubtype;
  /** Faction affiliation (undefined for neutral cards) */
  faction?: Faction;
  /** Card rarity */
  rarity: Rarity;
  /** Card set */
  set: CardSet;
  /** Numeric stats */
  stats: CardStats;
  /** Keywords on this card */
  keywords: Keyword[];
  /** Card ability text */
  abilityText?: string;
  /** Flavor text */
  flavorText?: string;
  /** URL or path to card image */
  imageUrl?: string;
  /** Card number within the set */
  cardNumber?: number;
}

// ─── Deck ────────────────────────────────────────────────────────────────────

export interface DeckEntry {
  /** Card ID */
  cardId: string;
  /** Number of copies */
  quantity: number;
}

export interface Deck {
  /** Unique deck ID */
  id: string;
  /** Deck name */
  name: string;
  /** Mainframe card ID */
  mainframeId: string;
  /** Cyberdeck cards (50–255 non-RAM cards) */
  cyberdeck: DeckEntry[];
  /** RAM deck (25 cards: max 5 special RAM) */
  ramDeck: DeckEntry[];
  /** When this deck was created */
  createdAt: Date;
  /** When this deck was last modified */
  updatedAt: Date;
}

// ─── Deck Validation ─────────────────────────────────────────────────────────

export interface DeckValidationError {
  code:
    | "NO_MAINFRAME"
    | "CYBERDECK_TOO_SMALL"
    | "CYBERDECK_TOO_LARGE"
    | "RAM_DECK_WRONG_SIZE"
    | "TOO_MANY_COPIES"
    | "TOO_MANY_SPECIAL_RAM"
    | "CARD_NOT_FOUND"
    | "RAM_IN_CYBERDECK"
    | "NON_RAM_IN_RAM_DECK";
  message: string;
  cardId?: string;
}

export interface DeckValidationResult {
  valid: boolean;
  errors: DeckValidationError[];
}

// ─── Collection ──────────────────────────────────────────────────────────────

export interface CollectionEntry {
  /** Card ID */
  cardId: string;
  /** Number of copies owned */
  quantity: number;
  /** Optional condition/notes */
  condition?: "mint" | "near_mint" | "lightly_played" | "moderately_played" | "heavily_played" | "damaged";
  /** Is this card foil/alternate art */
  foil?: boolean;
}

export interface Collection {
  /** All owned cards */
  entries: CollectionEntry[];
}

// ─── Search / Filter ─────────────────────────────────────────────────────────

export interface CardFilter {
  name?: string;
  types?: CardType[];
  factions?: Faction[];
  rarities?: Rarity[];
  sets?: CardSet[];
  keywords?: Keyword[];
  minCost?: number;
  maxCost?: number;
  minPower?: number;
  maxPower?: number;
  minDefense?: number;
  maxDefense?: number;
  minHealth?: number;
  maxHealth?: number;
}

export type SortField = "name" | "cost" | "power" | "defense" | "health" | "rarity" | "cardNumber";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

// ─── Deck Building Rules (constants) ─────────────────────────────────────────

export const DECK_RULES = {
  CYBERDECK_MIN: 50,
  CYBERDECK_MAX: 255,
  RAM_DECK_SIZE: 25,
  MAX_COPIES_PER_CARD: 4,
  MAX_SPECIAL_RAM: 5,
  MAX_LEGENDARY_IN_PLAY: 1,
} as const;

// ─── Game Constants ──────────────────────────────────────────────────────────

export const GAME_CONSTANTS = {
  STARTING_BIOFRAME_HEALTH: 20,
  STARTING_MAINFRAME_HEALTH: 20,
} as const;

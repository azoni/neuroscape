// ─── Factions ────────────────────────────────────────────────────────────────

export type Faction =
  | "ai"
  | "corpo"
  | "cybernetic"
  | "dustrunner"
  | "gambler"
  | "hacker"
  | "mech"
  | "mystic"
  | "nanobot"
  | "raver"
  | "robot"
  | "thrasher"
  | "wonderland";

export const FACTIONS: readonly Faction[] = [
  "ai",
  "corpo",
  "cybernetic",
  "dustrunner",
  "gambler",
  "hacker",
  "mech",
  "mystic",
  "nanobot",
  "raver",
  "robot",
  "thrasher",
  "wonderland",
] as const;

// ─── Card Types ──────────────────────────────────────────────────────────────

export type CardType = "character" | "gear" | "mainframe" | "program";

export type GearSubtype = "cyberware" | "tether" | "weapon";
export type ProgramSubtype = "environment" | "protocol" | "script";
export type CardSubtype = GearSubtype | ProgramSubtype;

export const CARD_TYPES: readonly CardType[] = [
  "character",
  "gear",
  "mainframe",
  "program",
] as const;

export const GEAR_SUBTYPES: readonly GearSubtype[] = ["cyberware", "tether", "weapon"] as const;
export const PROGRAM_SUBTYPES: readonly ProgramSubtype[] = ["environment", "protocol", "script"] as const;

// ─── Card Sets ───────────────────────────────────────────────────────────────

export type CardSet = "genesis" | "genesis_unlimited";

export const CARD_SETS: readonly CardSet[] = [
  "genesis",
  "genesis_unlimited",
] as const;

// ─── Card Definition ─────────────────────────────────────────────────────────

export interface Card {
  /** Unique card ID (numeric from database) */
  id: number;
  /** Display name */
  name: string;
  /** Card type */
  type: CardType;
  /** Subtype (gear or program subtype) */
  subtype: CardSubtype | null;
  /** Faction affiliation (null for neutral cards) */
  faction: Faction | null;
  /** Faction requirement to play */
  requirement: Faction | null;
  /** RAM cost */
  cost: number;
  /** URL to card image */
  imageUrl: string;
}

// ─── Deck ────────────────────────────────────────────────────────────────────

export interface DeckEntry {
  /** Card ID */
  cardId: number;
  /** Number of copies */
  quantity: number;
}

export interface Deck {
  /** Unique deck ID */
  id: string;
  /** Deck name */
  name: string;
  /** Mainframe card ID */
  mainframeId: number | null;
  /** Cyberdeck cards (non-mainframe cards) */
  cyberdeck: DeckEntry[];
  /** When this deck was created */
  createdAt: string;
  /** When this deck was last modified */
  updatedAt: string;
}

// ─── Deck Validation ─────────────────────────────────────────────────────────

export interface DeckValidationError {
  code:
    | "NO_MAINFRAME"
    | "CYBERDECK_TOO_SMALL"
    | "CYBERDECK_TOO_LARGE"
    | "TOO_MANY_COPIES"
    | "CARD_NOT_FOUND"
    | "MAINFRAME_IN_CYBERDECK";
  message: string;
  cardId?: number;
}

export interface DeckValidationResult {
  valid: boolean;
  errors: DeckValidationError[];
}

// ─── Search / Filter ─────────────────────────────────────────────────────────

export interface CardFilter {
  name?: string;
  types?: CardType[];
  subtypes?: CardSubtype[];
  factions?: (Faction | "neutral")[];
  minCost?: number;
  maxCost?: number;
}

export type SortField = "name" | "cost" | "type" | "faction";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

// ─── Deck Building Rules (constants) ─────────────────────────────────────────

export const DECK_RULES = {
  CYBERDECK_MIN: 50,
  CYBERDECK_MAX: 255,
  MAX_COPIES_PER_CARD: 4,
} as const;

// ─── Game Constants ──────────────────────────────────────────────────────────

export const GAME_CONSTANTS = {
  STARTING_BIOFRAME_HEALTH: 20,
  STARTING_MAINFRAME_HEALTH: 20,
} as const;

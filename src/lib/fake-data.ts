// Fake data for demo — replace with real data from API/database

export interface MatchRecord {
  id: string;
  date: string;
  myFaction: string;
  opponentFaction: string;
  opponent: string;
  result: "W" | "L" | "D";
  format: string;
  eventType: string;
  venue: string;
  winCondition?: string;
}

export interface PlayerStats {
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: { type: "W" | "L"; count: number };
  longestWinStreak: number;
  longestLossStreak: number;
  elo: number;
  powerLevel: number;
}

export interface FactionStat {
  faction: string;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface OpponentStat {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  lastPlayed: string;
}

export interface EventStat {
  name: string;
  date: string;
  format: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  placement?: string;
}

export interface VenueStat {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface TrendPoint {
  date: string;
  winRate: number;
  matches: number;
}

export interface MetaEntry {
  faction: string;
  playRate: number;
  winRate: number;
  top8s: number;
  matches: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  value: number | string;
  tier: "grandmaster" | "diamond" | "gold" | "silver" | "bronze" | "iron";
}

export interface FeedEvent {
  id: string;
  username: string;
  avatar: string;
  type: "match_import" | "achievement" | "placement" | "game";
  message: string;
  timestamp: string;
}

export interface GameResult {
  name: string;
  played: boolean;
  score?: number;
  maxScore?: number;
  time?: string;
}

// ── Fake player profile ──────────────────────────────────────────────────────

export const PLAYER = {
  username: "cipher_zero",
  displayName: "Cipher Zero",
  avatar: "",
  bio: "Hacker main. Angel City local. Top 8 at Genesis Invitational.",
  joinedDate: "2025-11-15",
  socialLinks: { twitter: "cipher_zero", discord: "cipher#0001" },
};

// ── Fake stats ───────────────────────────────────────────────────────────────

export const OVERALL_STATS: PlayerStats = {
  matches: 347,
  wins: 203,
  losses: 128,
  draws: 16,
  winRate: 58.5,
  currentStreak: { type: "W", count: 4 },
  longestWinStreak: 11,
  longestLossStreak: 5,
  elo: 1847,
  powerLevel: 76,
};

export const TOURNAMENT_STATS = {
  r1WinRate: 72.3,
  eventCount: 42,
  championWins: 3,
  finalistFinishes: 7,
  top4s: 12,
  top8s: 18,
  bestWinStreak: 11,
  undSwiss: 5,
  submarines: 2,
  consecutiveTop8s: 4,
  top8Rate: 42.9,
};

// ── Recent form (last 20 matches) ────────────────────────────────────────────

export const RECENT_FORM: ("W" | "L" | "D")[] = [
  "W", "W", "L", "W", "W", "W", "L", "D", "W", "L",
  "W", "W", "W", "L", "W", "D", "L", "W", "W", "W",
];

// ── Match history ────────────────────────────────────────────────────────────

const OPPONENTS = ["Nex_Runner", "GlassJaw", "ByteStorm", "Proxy_Prime", "VoidKing", "IronCladX", "NeonDrift", "ShadowOps", "DustDevil", "ChromeHeart", "WildCard", "CircuitBrk", "DataGhost", "Null_Ref", "QuantumFlux"];
const FACTIONS = ["hacker", "cybernetic", "corpo", "dustrunner", "mystic", "thrasher", "ai", "mech", "raver", "robot", "gambler", "wonderland", "nanobot"];
const FORMATS = ["Standard", "Blitz", "Draft", "Sealed"];
const EVENT_TYPES = ["Armory", "Skirmish", "Battle Hardened", "Invitational", "Nationals", "Casual"];
const VENUES = ["Neon Arcade LGS", "Angel City Games", "The Grid Hub", "Cyber Crypt", "Mainframe Comics", "Digital Dojo"];
const WIN_CONDITIONS = ["bioframe", "mainframe", "concession", "time"];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateMatches(): MatchRecord[] {
  const rand = seededRandom(42);
  const matches: MatchRecord[] = [];
  const startDate = new Date("2025-12-01");

  for (let i = 0; i < 347; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i * 0.3));
    const r = rand();
    const result: "W" | "L" | "D" = r < 0.585 ? "W" : r < 0.955 ? "L" : "D";

    matches.push({
      id: `m-${i}`,
      date: date.toISOString().split("T")[0]!,
      myFaction: FACTIONS[Math.floor(rand() * 5)]!, // mostly top 5
      opponentFaction: FACTIONS[Math.floor(rand() * FACTIONS.length)]!,
      opponent: OPPONENTS[Math.floor(rand() * OPPONENTS.length)]!,
      result,
      format: FORMATS[Math.floor(rand() * FORMATS.length)]!,
      eventType: EVENT_TYPES[Math.floor(rand() * EVENT_TYPES.length)]!,
      venue: VENUES[Math.floor(rand() * VENUES.length)]!,
      winCondition: result !== "D" ? WIN_CONDITIONS[Math.floor(rand() * WIN_CONDITIONS.length)] : undefined,
    });
  }

  return matches.reverse(); // newest first
}

export const MATCHES = generateMatches();

// ── Faction stats ────────────────────────────────────────────────────────────

export const FACTION_STATS: FactionStat[] = [
  { faction: "hacker", matches: 142, wins: 89, losses: 47, draws: 6, winRate: 62.7 },
  { faction: "cybernetic", matches: 78, wins: 44, losses: 30, draws: 4, winRate: 56.4 },
  { faction: "corpo", matches: 52, wins: 31, losses: 19, draws: 2, winRate: 59.6 },
  { faction: "dustrunner", matches: 38, wins: 20, losses: 16, draws: 2, winRate: 52.6 },
  { faction: "mystic", matches: 25, wins: 13, losses: 11, draws: 1, winRate: 52.0 },
  { faction: "thrasher", matches: 12, wins: 6, losses: 5, draws: 1, winRate: 50.0 },
];

// ── Opponent stats ───────────────────────────────────────────────────────────

export const OPPONENT_STATS: OpponentStat[] = OPPONENTS.map((name, i) => {
  const matches = 35 - i * 2;
  const wr = 45 + Math.floor(Math.sin(i * 1.5) * 20);
  const wins = Math.round(matches * wr / 100);
  return {
    name,
    matches,
    wins,
    losses: matches - wins,
    winRate: wr,
    lastPlayed: `2026-03-${String(17 - i).padStart(2, "0")}`,
  };
}).filter(o => o.matches > 0);

// ── Event stats ──────────────────────────────────────────────────────────────

export const EVENT_STATS: EventStat[] = [
  { name: "Genesis Invitational", date: "2026-03-10", format: "Standard", matches: 8, wins: 6, losses: 2, winRate: 75.0, placement: "Top 4" },
  { name: "Angel City Armory #12", date: "2026-03-07", format: "Standard", matches: 5, wins: 4, losses: 1, winRate: 80.0, placement: "Champion" },
  { name: "Neon District Skirmish", date: "2026-03-01", format: "Blitz", matches: 6, wins: 3, losses: 3, winRate: 50.0 },
  { name: "The Grid Open", date: "2026-02-22", format: "Standard", matches: 7, wins: 5, losses: 2, winRate: 71.4, placement: "Top 8" },
  { name: "Cyber Crypt Draft Night", date: "2026-02-15", format: "Draft", matches: 4, wins: 3, losses: 1, winRate: 75.0, placement: "Finalist" },
  { name: "Battle Hardened: Neo Tokyo", date: "2026-02-08", format: "Standard", matches: 9, wins: 6, losses: 3, winRate: 66.7, placement: "Top 8" },
  { name: "Angel City Armory #11", date: "2026-02-01", format: "Standard", matches: 5, wins: 5, losses: 0, winRate: 100.0, placement: "Champion" },
  { name: "Mainframe Monthly", date: "2026-01-25", format: "Blitz", matches: 5, wins: 2, losses: 3, winRate: 40.0 },
  { name: "Digital Dojo Sealed", date: "2026-01-18", format: "Sealed", matches: 6, wins: 4, losses: 2, winRate: 66.7, placement: "Top 4" },
  { name: "Angel City Armory #10", date: "2026-01-11", format: "Standard", matches: 5, wins: 3, losses: 2, winRate: 60.0 },
];

// ── Venue stats ──────────────────────────────────────────────────────────────

export const VENUE_STATS: VenueStat[] = VENUES.map((name, i) => {
  const matches = [87, 72, 58, 52, 44, 34][i]!;
  const wr = [61.2, 57.8, 55.4, 63.1, 50.0, 58.8][i]!;
  const wins = Math.round(matches * wr / 100);
  return { name, matches, wins, losses: matches - wins, winRate: wr };
});

// ── Trend data (weekly) ──────────────────────────────────────────────────────

export const TREND_DATA: TrendPoint[] = Array.from({ length: 16 }, (_, i) => {
  const d = new Date("2025-12-01");
  d.setDate(d.getDate() + i * 7);
  return {
    date: d.toISOString().split("T")[0]!,
    winRate: 50 + Math.sin(i * 0.5) * 12 + Math.random() * 6,
    matches: 15 + Math.floor(Math.random() * 15),
  };
});

// ── Meta data ────────────────────────────────────────────────────────────────

export const META_DATA: MetaEntry[] = [
  { faction: "hacker", playRate: 18.2, winRate: 54.3, top8s: 28, matches: 4820 },
  { faction: "cybernetic", playRate: 15.7, winRate: 52.1, top8s: 22, matches: 4160 },
  { faction: "corpo", playRate: 13.4, winRate: 51.8, top8s: 19, matches: 3550 },
  { faction: "dustrunner", playRate: 11.2, winRate: 49.7, top8s: 14, matches: 2960 },
  { faction: "mystic", playRate: 9.8, winRate: 53.6, top8s: 16, matches: 2590 },
  { faction: "thrasher", playRate: 8.5, winRate: 48.2, top8s: 10, matches: 2250 },
  { faction: "ai", playRate: 5.1, winRate: 50.5, top8s: 7, matches: 1350 },
  { faction: "mech", playRate: 4.8, winRate: 47.9, top8s: 5, matches: 1270 },
  { faction: "raver", playRate: 3.9, winRate: 46.1, top8s: 4, matches: 1030 },
  { faction: "robot", playRate: 3.2, winRate: 49.0, top8s: 3, matches: 850 },
  { faction: "gambler", playRate: 2.5, winRate: 44.7, top8s: 2, matches: 660 },
  { faction: "wonderland", playRate: 2.0, winRate: 51.2, top8s: 3, matches: 530 },
  { faction: "nanobot", playRate: 1.7, winRate: 45.3, top8s: 1, matches: 450 },
];

// ── Leaderboard ──────────────────────────────────────────────────────────────

function makeLB(names: string[], values: (number | string)[]): LeaderboardEntry[] {
  const tiers: LeaderboardEntry["tier"][] = ["grandmaster", "diamond", "diamond", "gold", "gold", "gold", "silver", "silver", "bronze", "bronze"];
  return names.map((username, i) => ({
    rank: i + 1,
    username,
    value: values[i]!,
    tier: tiers[i] ?? "iron",
  }));
}

export const LEADERBOARD_CATEGORIES = {
  elo: {
    label: "ELO Rating",
    data: makeLB(
      ["ProxyStar", "Cipher Zero", "ByteStorm", "NeonDrift", "GlassJaw", "IronCladX", "VoidKing", "DustDevil", "ChromeHeart", "Null_Ref"],
      [2150, 1847, 1823, 1798, 1765, 1742, 1720, 1695, 1680, 1655],
    ),
  },
  winRate: {
    label: "Win Rate (100+)",
    data: makeLB(
      ["WildCard", "ProxyStar", "Cipher Zero", "NeonDrift", "ByteStorm", "ChromeHeart", "GlassJaw", "ShadowOps", "DataGhost", "QuantumFlux"],
      ["64.2%", "62.8%", "58.5%", "57.1%", "55.9%", "54.3%", "53.7%", "52.1%", "51.8%", "50.5%"],
    ),
  },
  matches: {
    label: "Most Matches",
    data: makeLB(
      ["ByteStorm", "GlassJaw", "Cipher Zero", "NeonDrift", "ShadowOps", "VoidKing", "ProxyStar", "IronCladX", "DustDevil", "Null_Ref"],
      [512, 489, 347, 331, 298, 276, 265, 243, 231, 218],
    ),
  },
  top8s: {
    label: "Top 8 Finishes",
    data: makeLB(
      ["ProxyStar", "Cipher Zero", "NeonDrift", "ByteStorm", "GlassJaw", "VoidKing", "IronCladX", "WildCard", "ShadowOps", "ChromeHeart"],
      [24, 18, 15, 14, 12, 11, 10, 9, 8, 7],
    ),
  },
  streak: {
    label: "Best Win Streak",
    data: makeLB(
      ["WildCard", "ProxyStar", "Cipher Zero", "NeonDrift", "ByteStorm", "GlassJaw", "ChromeHeart", "ShadowOps", "VoidKing", "DustDevil"],
      [16, 14, 11, 10, 9, 9, 8, 8, 7, 7],
    ),
  },
  powerLevel: {
    label: "Power Level",
    data: makeLB(
      ["ProxyStar", "Cipher Zero", "ByteStorm", "NeonDrift", "WildCard", "GlassJaw", "IronCladX", "VoidKing", "ChromeHeart", "ShadowOps"],
      [89, 76, 74, 71, 68, 65, 62, 59, 57, 54],
    ),
  },
};

// ── Community feed ───────────────────────────────────────────────────────────

export const FEED_EVENTS: FeedEvent[] = [
  { id: "f1", username: "Cipher Zero", avatar: "", type: "match_import", message: "imported 5 matches from Angel City Armory #12", timestamp: "2h ago" },
  { id: "f2", username: "ByteStorm", avatar: "", type: "placement", message: "placed Top 8 at Genesis Invitational", timestamp: "4h ago" },
  { id: "f3", username: "NeonDrift", avatar: "", type: "achievement", message: "unlocked \"Century\" — 100 matches played", timestamp: "6h ago" },
  { id: "f4", username: "GlassJaw", avatar: "", type: "game", message: "scored 8/9 on today's NeuroGrid puzzle", timestamp: "8h ago" },
  { id: "f5", username: "VoidKing", avatar: "", type: "match_import", message: "imported 3 matches from Cyber Crypt Draft Night", timestamp: "12h ago" },
  { id: "f6", username: "ProxyStar", avatar: "", type: "placement", message: "won Angel City Armory #12 — Champion!", timestamp: "1d ago" },
  { id: "f7", username: "ShadowOps", avatar: "", type: "achievement", message: "unlocked \"Faction Master\" — 50 wins with Hacker", timestamp: "1d ago" },
  { id: "f8", username: "IronCladX", avatar: "", type: "game", message: "completed today's Crossword in 3:42", timestamp: "1d ago" },
  { id: "f9", username: "DustDevil", avatar: "", type: "match_import", message: "imported 7 matches from Battle Hardened: Neo Tokyo", timestamp: "2d ago" },
  { id: "f10", username: "ChromeHeart", avatar: "", type: "placement", message: "placed Top 4 at Neon District Skirmish", timestamp: "2d ago" },
];

// ── Daily games ──────────────────────────────────────────────────────────────

export const DAILY_GAMES: GameResult[] = [
  { name: "NeuroGrid", played: true, score: 7, maxScore: 9, time: "2:34" },
  { name: "Crossword", played: true, score: 12, maxScore: 15, time: "4:12" },
  { name: "Connections", played: false },
  { name: "Faction Guesser", played: true, score: 1, maxScore: 1, time: "0:45" },
  { name: "Matchup Mania", played: false },
  { name: "Timeline", played: true, score: 4, maxScore: 5 },
  { name: "Trivia", played: false },
  { name: "Rampage", played: true, score: 24, maxScore: 30 },
  { name: "Knockout", played: false },
  { name: "Brawl", played: false },
  { name: "Combo Chain", played: true, score: 18, maxScore: 25 },
  { name: "Memory Grid", played: false },
];

// ── Matchup matrix (faction vs faction win rates) ────────────────────────────

export const MATCHUP_MATRIX: Record<string, Record<string, number>> = {
  hacker: { cybernetic: 52, corpo: 55, dustrunner: 48, mystic: 58, thrasher: 61 },
  cybernetic: { hacker: 48, corpo: 53, dustrunner: 56, mystic: 45, thrasher: 54 },
  corpo: { hacker: 45, cybernetic: 47, dustrunner: 52, mystic: 50, thrasher: 57 },
  dustrunner: { hacker: 52, cybernetic: 44, corpo: 48, mystic: 55, thrasher: 49 },
  mystic: { hacker: 42, cybernetic: 55, corpo: 50, dustrunner: 45, thrasher: 53 },
  thrasher: { hacker: 39, cybernetic: 46, corpo: 43, dustrunner: 51, mystic: 47 },
};

// ── Format breakdown ─────────────────────────────────────────────────────────

export const FORMAT_BREAKDOWN = [
  { format: "Standard", matches: 198, winRate: 60.1, percentage: 57.1 },
  { format: "Blitz", matches: 82, winRate: 54.9, percentage: 23.6 },
  { format: "Draft", matches: 42, winRate: 57.1, percentage: 12.1 },
  { format: "Sealed", matches: 25, winRate: 52.0, percentage: 7.2 },
];

export const EVENT_TYPE_BREAKDOWN = [
  { type: "Armory", matches: 115, winRate: 61.7, percentage: 33.1 },
  { type: "Skirmish", matches: 78, winRate: 55.1, percentage: 22.5 },
  { type: "Battle Hardened", matches: 52, winRate: 57.7, percentage: 15.0 },
  { type: "Invitational", matches: 38, winRate: 63.2, percentage: 10.9 },
  { type: "Casual", matches: 64, winRate: 54.7, percentage: 18.5 },
];

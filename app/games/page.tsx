"use client";

import { DAILY_GAMES } from "@/src/lib/fake-data";
import type { GameResult } from "@/src/lib/fake-data";

const GAME_CATEGORIES: { label: string; type: string; games: string[] }[] = [
  { label: "Puzzles", type: "puzzles", games: ["NeuroGrid", "Crossword", "Connections"] },
  { label: "Knowledge", type: "knowledge", games: ["Faction Guesser", "Matchup Mania", "Timeline", "Trivia"] },
  { label: "Action", type: "action", games: ["Rampage", "Knockout", "Brawl"] },
  { label: "Combo", type: "combo", games: ["Combo Chain", "Memory Grid"] },
];

function getGameByName(name: string): GameResult | undefined {
  return DAILY_GAMES.find((g) => g.name === name);
}

function todayString() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function GamesPage() {
  const gamesPlayed = DAILY_GAMES.filter((g) => g.played).length;
  const totalGames = DAILY_GAMES.length;
  const completionRate = Math.round((gamesPlayed / totalGames) * 100);

  // Best game by score percentage
  const playedGames = DAILY_GAMES.filter(
    (g) => g.played && g.score != null && g.maxScore != null && g.maxScore > 0
  );
  const bestGame = playedGames.length > 0
    ? playedGames.reduce((best, g) => {
        const bestPct = (best.score! / best.maxScore!) * 100;
        const gPct = (g.score! / g.maxScore!) * 100;
        return gPct > bestPct ? g : best;
      })
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-gray-100"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Daily Games
        </h1>
        <p className="mt-1 text-sm text-muted">{todayString()}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {GAME_CATEGORIES.map((category) => (
            <div key={category.type}>
              {/* Section Header */}
              <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-3 flex items-center gap-2">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    category.type === "puzzles"
                      ? "bg-neon-cyan"
                      : category.type === "knowledge"
                        ? "bg-neon-magenta"
                        : category.type === "action"
                          ? "bg-neon-orange"
                          : "bg-neon-yellow"
                  }`}
                />
                {category.label}
              </h2>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.games.map((gameName) => {
                  const game = getGameByName(gameName);
                  if (!game) return null;

                  const scorePct =
                    game.played && game.score != null && game.maxScore
                      ? Math.round((game.score / game.maxScore) * 100)
                      : null;

                  return (
                    <div
                      key={game.name}
                      className="rounded-xl border border-border bg-surface p-5 card-glow"
                    >
                      {/* Game Name + Status */}
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-gray-100">
                          {game.name}
                        </h3>
                        {game.played ? (
                          <span className="flex items-center gap-1 text-xs text-neon-green">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Played
                          </span>
                        ) : (
                          <span className="text-xs text-dim">Not played</span>
                        )}
                      </div>

                      {/* Score / Play Button */}
                      <div className="mt-3">
                        {game.played && game.score != null && game.maxScore != null ? (
                          <div>
                            <p className="text-2xl font-bold font-mono text-gray-100">
                              {game.score}
                              <span className="text-sm text-dim">/{game.maxScore}</span>
                            </p>
                            {game.time && (
                              <p className="text-xs text-muted mt-1">
                                Time: {game.time}
                              </p>
                            )}
                            {scorePct !== null && (
                              <div className="mt-2 h-1.5 rounded-full bg-dark-700 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    scorePct >= 80
                                      ? "bg-neon-green"
                                      : scorePct >= 50
                                        ? "bg-neon-cyan"
                                        : "bg-neon-orange"
                                  }`}
                                  style={{ width: `${scorePct}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <button className="mt-1 px-4 py-1.5 rounded-lg border border-neon-cyan/50 text-neon-cyan text-sm font-medium hover:bg-neon-cyan/10 transition-colors">
                            Play
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="rounded-xl border border-border bg-surface p-5 sticky top-6 space-y-5">
            <h2 className="text-xs font-medium uppercase tracking-wider text-dim">
              Today&apos;s Stats
            </h2>

            {/* Games Played */}
            <div>
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">
                Games Played
              </p>
              <p className="text-2xl font-bold font-mono text-gray-100">
                {gamesPlayed}
                <span className="text-sm text-dim">/{totalGames}</span>
              </p>
              <div className="mt-1.5 h-1.5 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon-cyan transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Completion Rate */}
            <div>
              <p className="text-[11px] text-muted uppercase tracking-wider mb-1">
                Completion Rate
              </p>
              <p className="text-2xl font-bold font-mono text-neon-cyan">
                {completionRate}%
              </p>
            </div>

            {/* Best Game */}
            {bestGame && (
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider mb-1">
                  Best Game
                </p>
                <p className="text-sm font-bold text-gray-100">{bestGame.name}</p>
                <p className="text-lg font-bold font-mono text-neon-green">
                  {Math.round((bestGame.score! / bestGame.maxScore!) * 100)}%
                </p>
                <p className="text-[11px] text-dim">
                  {bestGame.score}/{bestGame.maxScore}
                  {bestGame.time ? ` in ${bestGame.time}` : ""}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

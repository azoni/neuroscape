"use client";

import { WinRateRing } from "@/src/components/ui/WinRateRing";
import { StatCard } from "@/src/components/ui/StatCard";
import { TOURNAMENT_STATS } from "@/src/lib/fake-data";

const stats = [
  { label: "Events Played", value: TOURNAMENT_STATS.eventCount },
  { label: "Champion Wins", value: TOURNAMENT_STATS.championWins, color: "text-neon-yellow" },
  { label: "Finalist", value: TOURNAMENT_STATS.finalistFinishes },
  { label: "Top 4", value: TOURNAMENT_STATS.top4s },
  { label: "Top 8", value: TOURNAMENT_STATS.top8s },
  { label: "Top 8 Rate", value: `${TOURNAMENT_STATS.top8Rate}%`, color: "text-neon-cyan" },
  { label: "Best Win Streak", value: TOURNAMENT_STATS.bestWinStreak, color: "text-neon-green" },
  { label: "Undefeated Swiss", value: TOURNAMENT_STATS.undSwiss },
  { label: "Submarines", value: TOURNAMENT_STATS.submarines },
  { label: "Consecutive Top 8s", value: TOURNAMENT_STATS.consecutiveTop8s, color: "text-neon-magenta" },
];

export default function TournamentStatsPage() {
  return (
    <div className="space-y-8">
      <h1
        className="text-2xl font-bold text-foreground"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Tournament Stats
      </h1>

      {/* R1 Win Rate Ring */}
      <div className="flex flex-col items-center rounded-xl border border-border bg-surface/50 p-8">
        <WinRateRing
          value={TOURNAMENT_STATS.r1WinRate}
          size={160}
          label="R1 Win Rate"
        />
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            color={s.color}
          />
        ))}
      </div>
    </div>
  );
}

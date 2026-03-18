"use client";

import { WinRateRing } from "@/src/components/ui/WinRateRing";
import { StatCard } from "@/src/components/ui/StatCard";
import { RecentForm } from "@/src/components/ui/RecentForm";
import { DataTable } from "@/src/components/ui/DataTable";
import { FactionBadge } from "@/src/components/ui/FactionBadge";
import {
  OVERALL_STATS,
  TOURNAMENT_STATS,
  RECENT_FORM,
  MATCHES,
  OPPONENT_STATS,
  FACTION_STATS,
  VENUE_STATS,
} from "@/src/lib/fake-data";

const RESULT_COLORS: Record<string, string> = {
  W: "text-neon-green",
  L: "text-red-400",
  D: "text-yellow-400",
};

const latestMatches = MATCHES.slice(0, 10).map((m) => ({
  date: m.date,
  myFaction: <FactionBadge faction={m.myFaction} />,
  opponent: <span className="font-medium text-gray-100">{m.opponent}</span>,
  oppFaction: <FactionBadge faction={m.opponentFaction} />,
  result: (
    <span className={`font-bold font-mono ${RESULT_COLORS[m.result]}`}>
      {m.result}
    </span>
  ),
  format: m.format,
}));

const matchColumns = [
  { key: "date", label: "Date" },
  { key: "myFaction", label: "My Faction" },
  { key: "opponent", label: "Opponent" },
  { key: "oppFaction", label: "Opp Faction" },
  { key: "result", label: "Result", align: "center" as const },
  { key: "format", label: "Format" },
];

// Derive insights
const nemesis = [...OPPONENT_STATS].sort((a, b) => a.winRate - b.winRate)[0]!;
const bestMatchup = [...FACTION_STATS].sort((a, b) => b.winRate - a.winRate)[0]!;
const mostPlayed = [...OPPONENT_STATS].sort((a, b) => b.matches - a.matches)[0]!;
const hotVenue = [...VENUE_STATS].sort((a, b) => b.winRate - a.winRate)[0]!;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Your competitive overview at a glance
        </p>
      </div>

      {/* Overall Stats Card */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-5">
          Overall Performance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
          <div className="col-span-2 md:col-span-1 flex justify-center">
            <WinRateRing value={OVERALL_STATS.winRate} size={120} label="Win Rate" />
          </div>
          <div className="text-center">
            <p className="text-xs text-dim uppercase tracking-wider mb-1">Record</p>
            <p className="text-2xl font-bold font-mono text-gray-100">
              <span className="text-neon-green">{OVERALL_STATS.wins}</span>
              <span className="text-dim">-</span>
              <span className="text-red-400">{OVERALL_STATS.losses}</span>
              <span className="text-dim">-</span>
              <span className="text-yellow-400">{OVERALL_STATS.draws}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-dim uppercase tracking-wider mb-1">Total Matches</p>
            <p className="text-2xl font-bold font-mono text-gray-100">
              {OVERALL_STATS.matches}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-dim uppercase tracking-wider mb-1">ELO Rating</p>
            <p className="text-2xl font-bold font-mono text-neon-cyan">
              {OVERALL_STATS.elo}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-dim uppercase tracking-wider mb-1">Current Streak</p>
            <p className="text-2xl font-bold font-mono text-neon-green">
              {OVERALL_STATS.currentStreak.type}{OVERALL_STATS.currentStreak.count}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Form */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-4">
          Recent Form — Last 20 Matches
        </h2>
        <RecentForm results={RECENT_FORM} />
        <p className="mt-2 text-[11px] text-muted">
          {RECENT_FORM.filter((r) => r === "W").length}W -{" "}
          {RECENT_FORM.filter((r) => r === "L").length}L -{" "}
          {RECENT_FORM.filter((r) => r === "D").length}D in last 20
        </p>
      </div>

      {/* Tournament Stats Card */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-5">
          Tournament Stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <MiniStat label="R1 Win Rate" value={`${TOURNAMENT_STATS.r1WinRate}%`} color="text-neon-cyan" />
          <MiniStat label="Events Played" value={TOURNAMENT_STATS.eventCount} />
          <MiniStat label="Top 8s" value={TOURNAMENT_STATS.top8s} color="text-neon-yellow" />
          <MiniStat label="Top 4s" value={TOURNAMENT_STATS.top4s} color="text-neon-magenta" />
          <MiniStat label="Finalist" value={TOURNAMENT_STATS.finalistFinishes} color="text-neon-cyan" />
          <MiniStat label="Champion" value={TOURNAMENT_STATS.championWins} color="text-neon-green" />
          <MiniStat label="Best Streak" value={TOURNAMENT_STATS.bestWinStreak} />
          <MiniStat label="Undefeated Swiss" value={TOURNAMENT_STATS.undSwiss} color="text-neon-green" />
          <MiniStat label="Top 8 Rate" value={`${TOURNAMENT_STATS.top8Rate}%`} color="text-neon-cyan" />
          <MiniStat label="Consec. Top 8s" value={TOURNAMENT_STATS.consecutiveTop8s} />
        </div>
      </div>

      {/* Latest Matches */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-1">Latest Matches</h2>
        <p className="text-xs text-muted mb-4">Your most recent 10 recorded matches</p>
        <DataTable columns={matchColumns} data={latestMatches} />
      </div>

      {/* Dashboard Insights */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-1">Insights</h2>
        <p className="text-xs text-muted mb-4">Quick intel from your match history</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightCard
            label="Nemesis"
            value={nemesis.name}
            detail={`${nemesis.winRate}% WR across ${nemesis.matches} matches`}
            accentColor="text-red-400"
          />
          <InsightCard
            label="Best Matchup"
            value={bestMatchup.faction}
            detail={`${bestMatchup.winRate}% WR across ${bestMatchup.matches} matches`}
            accentColor="text-neon-green"
          />
          <InsightCard
            label="Most Played"
            value={mostPlayed.name}
            detail={`${mostPlayed.matches} matches — ${mostPlayed.winRate}% WR`}
            accentColor="text-neon-cyan"
          />
          <InsightCard
            label="Hot Venue"
            value={hotVenue.name}
            detail={`${hotVenue.winRate}% WR across ${hotVenue.matches} matches`}
            accentColor="text-neon-magenta"
          />
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-dark-800/40 p-3 text-center">
      <p className="text-[10px] font-medium text-dim uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-xl font-bold font-mono ${color ?? "text-gray-100"}`}>
        {value}
      </p>
    </div>
  );
}

function InsightCard({
  label,
  value,
  detail,
  accentColor,
}: {
  label: string;
  value: string;
  detail: string;
  accentColor: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-[10px] font-medium text-dim uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className={`text-lg font-bold capitalize ${accentColor}`}>{value}</p>
      <p className="mt-1 text-[11px] text-muted">{detail}</p>
    </div>
  );
}

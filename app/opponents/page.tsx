"use client";

import { DataTable } from "@/src/components/ui/DataTable";
import { OPPONENT_STATS } from "@/src/lib/fake-data";

function winRateColor(wr: number): string {
  if (wr >= 60) return "text-neon-green";
  if (wr >= 50) return "text-neon-cyan";
  if (wr >= 40) return "text-yellow-400";
  return "text-red-400";
}

function barColor(wr: number): string {
  if (wr >= 60) return "bg-neon-green";
  if (wr >= 50) return "bg-neon-cyan";
  if (wr >= 40) return "bg-yellow-400";
  return "bg-red-400";
}

const sorted = [...OPPONENT_STATS].sort((a, b) => b.matches - a.matches);

const columns = [
  { key: "opponent", label: "Opponent" },
  { key: "matches", label: "Matches", align: "center" as const },
  { key: "record", label: "Record", align: "center" as const },
  { key: "winRate", label: "Win Rate" },
  { key: "lastPlayed", label: "Last Played" },
];

const tableData = sorted.map((o) => ({
  opponent: <span className="font-medium text-gray-100">{o.name}</span>,
  matches: <span className="font-mono">{o.matches}</span>,
  record: (
    <span className="font-mono">
      <span className="text-neon-green">{o.wins}</span>
      <span className="text-dim">-</span>
      <span className="text-red-400">{o.losses}</span>
    </span>
  ),
  winRate: (
    <div className="flex items-center gap-3 min-w-[160px]">
      <span className={`font-bold font-mono text-sm w-12 ${winRateColor(o.winRate)}`}>
        {o.winRate}%
      </span>
      <div className="flex-1 h-2 rounded-full bg-dark-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor(o.winRate)} transition-all duration-500`}
          style={{ width: `${o.winRate}%` }}
        />
      </div>
    </div>
  ),
  lastPlayed: <span className="text-muted">{o.lastPlayed}</span>,
}));

export default function OpponentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Opponents</h1>
        <p className="mt-1 text-sm text-muted">
          Head-to-head records against {OPPONENT_STATS.length} opponents
        </p>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}

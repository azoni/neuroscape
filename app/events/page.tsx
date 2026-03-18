"use client";

import { DataTable } from "@/src/components/ui/DataTable";
import { EVENT_STATS } from "@/src/lib/fake-data";

const PLACEMENT_COLORS: Record<string, string> = {
  Champion: "bg-neon-green/15 text-neon-green border-neon-green/30",
  Finalist: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
  "Top 4": "bg-neon-magenta/15 text-neon-magenta border-neon-magenta/30",
  "Top 8": "bg-neon-yellow/15 text-neon-yellow border-neon-yellow/30",
};

function winRateColor(wr: number): string {
  if (wr >= 70) return "text-neon-green";
  if (wr >= 55) return "text-neon-cyan";
  if (wr >= 45) return "text-yellow-400";
  return "text-red-400";
}

const columns = [
  { key: "name", label: "Event" },
  { key: "date", label: "Date" },
  { key: "format", label: "Format" },
  { key: "record", label: "Record", align: "center" as const },
  { key: "winRate", label: "Win Rate", align: "center" as const },
  { key: "placement", label: "Placement", align: "center" as const },
];

const tableData = EVENT_STATS.map((e) => ({
  name: <span className="font-medium text-gray-100">{e.name}</span>,
  date: e.date,
  format: e.format,
  record: (
    <span className="font-mono">
      <span className="text-neon-green">{e.wins}</span>
      <span className="text-dim">-</span>
      <span className="text-red-400">{e.losses}</span>
    </span>
  ),
  winRate: (
    <span className={`font-bold font-mono ${winRateColor(e.winRate)}`}>
      {e.winRate}%
    </span>
  ),
  placement: e.placement ? (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
        PLACEMENT_COLORS[e.placement] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30"
      }`}
    >
      {e.placement}
    </span>
  ) : (
    <span className="text-dim">—</span>
  ),
}));

export default function EventsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Events</h1>
        <p className="mt-1 text-sm text-muted">
          Tournament and event history — {EVENT_STATS.length} events recorded
        </p>
      </div>

      {/* Summary strip */}
      <div className="flex flex-wrap gap-6">
        <SummaryItem
          label="Champion"
          value={EVENT_STATS.filter((e) => e.placement === "Champion").length}
          color="text-neon-green"
        />
        <SummaryItem
          label="Finalist"
          value={EVENT_STATS.filter((e) => e.placement === "Finalist").length}
          color="text-neon-cyan"
        />
        <SummaryItem
          label="Top 4"
          value={EVENT_STATS.filter((e) => e.placement === "Top 4").length}
          color="text-neon-magenta"
        />
        <SummaryItem
          label="Top 8"
          value={EVENT_STATS.filter((e) => e.placement === "Top 8").length}
          color="text-neon-yellow"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}

function SummaryItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
      <span className="text-xs text-dim uppercase tracking-wider">{label}</span>
    </div>
  );
}

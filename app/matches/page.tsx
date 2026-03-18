"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/src/components/ui/DataTable";
import { FactionBadge } from "@/src/components/ui/FactionBadge";
import { MATCHES } from "@/src/lib/fake-data";

const RESULT_COLORS: Record<string, string> = {
  W: "text-neon-green",
  L: "text-red-400",
  D: "text-yellow-400",
};

const ALL_FORMATS = ["All", "Standard", "Blitz", "Draft", "Sealed"];
const ALL_EVENT_TYPES = ["All", "Armory", "Skirmish", "Battle Hardened", "Invitational", "Nationals", "Casual"];
const ALL_FACTIONS = ["All", "hacker", "cybernetic", "corpo", "dustrunner", "mystic", "thrasher", "ai", "mech", "raver", "robot", "gambler", "wonderland", "nanobot"];

const PAGE_SIZE = 20;

const columns = [
  { key: "date", label: "Date" },
  { key: "myFaction", label: "My Faction" },
  { key: "opponent", label: "Opponent" },
  { key: "oppFaction", label: "Opp Faction" },
  { key: "result", label: "Result", align: "center" as const },
  { key: "format", label: "Format" },
  { key: "eventType", label: "Event" },
  { key: "venue", label: "Venue" },
];

export default function MatchesPage() {
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [factionFilter, setFactionFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return MATCHES.filter((m) => {
      if (search && !m.opponent.toLowerCase().includes(search.toLowerCase())) return false;
      if (formatFilter !== "All" && m.format !== formatFilter) return false;
      if (eventFilter !== "All" && m.eventType !== eventFilter) return false;
      if (factionFilter !== "All" && m.myFaction !== factionFilter) return false;
      return true;
    });
  }, [search, formatFilter, eventFilter, factionFilter]);

  const tableData = filtered.slice(0, visibleCount).map((m) => ({
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
    eventType: m.eventType,
    venue: <span className="text-muted">{m.venue}</span>,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Match History</h1>
        <p className="mt-1 text-sm text-muted">
          Full record of all {MATCHES.length} matches
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search opponent..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
          className="rounded-lg border border-border bg-dark-800 px-3 py-2 text-sm text-gray-100 placeholder:text-dim focus:outline-none focus:border-neon-cyan/50 w-56"
        />
        <select
          value={formatFilter}
          onChange={(e) => { setFormatFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
          className="rounded-lg border border-border bg-dark-800 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-neon-cyan/50"
        >
          {ALL_FORMATS.map((f) => (
            <option key={f} value={f}>{f === "All" ? "All Formats" : f}</option>
          ))}
        </select>
        <select
          value={eventFilter}
          onChange={(e) => { setEventFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
          className="rounded-lg border border-border bg-dark-800 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-neon-cyan/50"
        >
          {ALL_EVENT_TYPES.map((e) => (
            <option key={e} value={e}>{e === "All" ? "All Events" : e}</option>
          ))}
        </select>
        <select
          value={factionFilter}
          onChange={(e) => { setFactionFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
          className="rounded-lg border border-border bg-dark-800 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-neon-cyan/50 capitalize"
        >
          {ALL_FACTIONS.map((f) => (
            <option key={f} value={f} className="capitalize">
              {f === "All" ? "All Factions" : f}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-dim">
        Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} matches
      </p>

      {/* Table */}
      <DataTable columns={columns} data={tableData} />

      {/* Show More */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-6 py-2.5 text-sm font-medium text-neon-cyan transition-all hover:bg-neon-cyan/10 hover:border-neon-cyan/50"
          >
            Show More ({Math.min(PAGE_SIZE, filtered.length - visibleCount)} more)
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { FactionBadge } from "@/src/components/ui/FactionBadge";
import { META_DATA, MATCHUP_MATRIX } from "@/src/lib/fake-data";

const FACTION_COLORS: Record<string, string> = {
  hacker: "#39ff14",
  cybernetic: "#00f0ff",
  corpo: "#fbbf24",
  dustrunner: "#ff6b35",
  mystic: "#a855f7",
  thrasher: "#ef4444",
  ai: "#3b82f6",
  mech: "#94a3b8",
  raver: "#ec4899",
  robot: "#71717a",
  gambler: "#eab308",
  wonderland: "#d946ef",
  nanobot: "#14b8a6",
};

const tooltipStyle = {
  contentStyle: {
    background: "#13131d",
    border: "1px solid #2a2a3e",
    borderRadius: 8,
  },
};

// Sort META_DATA by playRate desc for tier list
const sortedByPlayRate = [...META_DATA].sort((a, b) => b.playRate - a.playRate);
const sortedByWinRate = [...META_DATA].sort((a, b) => b.winRate - a.winRate);

const matrixFactions = Object.keys(MATCHUP_MATRIX);

function winRateColor(wr: number) {
  if (wr > 52) return "text-green-400";
  if (wr < 48) return "text-red-400";
  return "text-white";
}

function cellBg(val: number) {
  if (val > 55) return "bg-green-500/20 text-green-300";
  if (val < 45) return "bg-red-500/20 text-red-300";
  return "bg-dark-700 text-muted";
}

export default function MetaPage() {
  return (
    <div className="space-y-8">
      <h1
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Meta Analysis
      </h1>

      {/* Section 1: Faction Tier List */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2
          className="mb-4 text-lg font-semibold text-white"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Faction Tier List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="pb-3 pr-4 font-medium">Rank</th>
                <th className="pb-3 pr-4 font-medium">Faction</th>
                <th className="pb-3 pr-4 font-medium text-right">Play Rate %</th>
                <th className="pb-3 pr-4 font-medium text-right">Win Rate %</th>
                <th className="pb-3 pr-4 font-medium text-right">Top 8s</th>
                <th className="pb-3 font-medium text-right">Total Matches</th>
              </tr>
            </thead>
            <tbody>
              {sortedByPlayRate.map((entry, i) => (
                <tr
                  key={entry.faction}
                  className="border-b border-border/50 transition-colors hover:bg-surface-hover"
                >
                  <td className="py-3 pr-4 font-mono text-dim">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <FactionBadge faction={entry.faction} size="md" />
                  </td>
                  <td className="py-3 pr-4 text-right font-mono">
                    {entry.playRate.toFixed(1)}%
                  </td>
                  <td
                    className={`py-3 pr-4 text-right font-mono font-semibold ${winRateColor(entry.winRate)}`}
                  >
                    {entry.winRate.toFixed(1)}%
                  </td>
                  <td className="py-3 pr-4 text-right font-mono">{entry.top8s}</td>
                  <td className="py-3 text-right font-mono">
                    {entry.matches.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Usage Distribution (Pie) */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2
          className="mb-4 text-lg font-semibold text-white"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Usage Distribution
        </h2>
        <div className="flex flex-col items-center lg:flex-row lg:justify-center lg:gap-8">
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={sortedByPlayRate}
                dataKey="playRate"
                nameKey="faction"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                stroke="none"
              >
                {sortedByPlayRate.map((entry) => (
                  <Cell
                    key={entry.faction}
                    fill={FACTION_COLORS[entry.faction] ?? "#555"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle.contentStyle}
                formatter={(value) => [`${value}%`, "Play Rate"]}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value: string) => {
                  const entry = sortedByPlayRate.find((e) => e.faction === value);
                  return (
                    <span className="text-sm capitalize text-gray-300">
                      {value} — {entry?.playRate}%
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Section 3: Win Rate Comparison (Horizontal Bar) */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2
          className="mb-4 text-lg font-semibold text-white"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Win Rate Comparison
        </h2>
        <ResponsiveContainer width="100%" height={460}>
          <BarChart
            data={sortedByWinRate}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" horizontal={false} />
            <XAxis
              type="number"
              domain={[40, 60]}
              tick={{ fill: "#7a7a99", fontSize: 12 }}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="faction"
              tick={{ fill: "#d0d0e0", fontSize: 12 }}
              tickFormatter={(v: string) => v.charAt(0).toUpperCase() + v.slice(1)}
              width={75}
            />
            <Tooltip
              contentStyle={tooltipStyle.contentStyle}
              formatter={(value) => [`${value}%`, "Win Rate"]}
              labelFormatter={(label) =>
                String(label).charAt(0).toUpperCase() + String(label).slice(1)
              }
            />
            <ReferenceLine x={50} stroke="#7a7a99" strokeDasharray="6 4" />
            <Bar dataKey="winRate" radius={[0, 4, 4, 0]}>
              {sortedByWinRate.map((entry) => (
                <Cell
                  key={entry.faction}
                  fill={FACTION_COLORS[entry.faction] ?? "#555"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Section 4: Matchup Matrix */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2
          className="mb-4 text-lg font-semibold text-white"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Matchup Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left text-muted font-medium">vs</th>
                {matrixFactions.map((f) => (
                  <th
                    key={f}
                    className="p-2 text-center text-muted font-medium capitalize"
                  >
                    {f}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixFactions.map((rowFaction) => (
                <tr key={rowFaction} className="border-t border-border/50">
                  <td className="p-2 font-medium capitalize text-gray-200">
                    {rowFaction}
                  </td>
                  {matrixFactions.map((colFaction) => {
                    if (rowFaction === colFaction) {
                      return (
                        <td
                          key={colFaction}
                          className="p-2 text-center text-dim bg-dark-800"
                        >
                          —
                        </td>
                      );
                    }
                    const val = MATCHUP_MATRIX[rowFaction]?.[colFaction];
                    if (val == null) {
                      return (
                        <td
                          key={colFaction}
                          className="p-2 text-center text-dim bg-dark-800"
                        >
                          —
                        </td>
                      );
                    }
                    return (
                      <td
                        key={colFaction}
                        className={`p-2 text-center font-mono text-sm ${cellBg(val)}`}
                      >
                        {val}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

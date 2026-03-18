"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TREND_DATA,
  FORMAT_BREAKDOWN,
  EVENT_TYPE_BREAKDOWN,
  FACTION_STATS,
  VENUE_STATS,
} from "@/src/lib/fake-data";

const COLORS = {
  cyan: "#00f0ff",
  magenta: "#ff00e5",
  green: "#39ff14",
  yellow: "#ffe600",
  orange: "#ff6b35",
};

const FORMAT_COLORS = [COLORS.cyan, COLORS.magenta, COLORS.green, COLORS.yellow];
const EVENT_COLORS = [COLORS.cyan, COLORS.magenta, COLORS.green, COLORS.yellow, COLORS.orange];

const tooltipStyle = {
  contentStyle: {
    background: "#13131d",
    border: "1px solid #2a2a3e",
    borderRadius: 8,
  },
  labelStyle: { color: "#7a7a99" },
};

const axisProps = {
  tick: { fill: "#7a7a99", fontSize: 12 },
  axisLine: { stroke: "#2a2a3e" },
  tickLine: false as const,
};

const factionsSorted = [...FACTION_STATS].sort((a, b) => b.matches - a.matches);

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold text-foreground"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Trends
      </h1>

      {/* Section 1: Win Rate Over Time */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">
          Win Rate Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="winRateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.2} />
                <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="date" {...axisProps} />
            <YAxis domain={[30, 80]} {...axisProps} unit="%" />
            <Tooltip
              {...tooltipStyle}
              formatter={(value) => [`${Number(value).toFixed(1)}%`, "Win Rate"]}
            />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke={COLORS.cyan}
              strokeWidth={2}
              fill="url(#winRateGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* Section 2: Format Breakdown */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">
          Format Breakdown
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={FORMAT_BREAKDOWN}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2a2a3e"
              horizontal={false}
            />
            <XAxis type="number" {...axisProps} />
            <YAxis
              type="category"
              dataKey="format"
              width={80}
              {...axisProps}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => {
                if (name === "matches") return [value, "Matches"];
                return [`${value}%`, "Win Rate"];
              }}
            />
            <Bar dataKey="matches" name="matches" radius={[0, 4, 4, 0]}>
              {FORMAT_BREAKDOWN.map((_, i) => (
                <Cell key={i} fill={FORMAT_COLORS[i % FORMAT_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FORMAT_BREAKDOWN.map((f, i) => (
            <div
              key={f.format}
              className="rounded-lg border border-border bg-dark-800/60 px-3 py-2 text-center"
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: FORMAT_COLORS[i] }}
              >
                {f.format}
              </div>
              <div className="mt-0.5 text-sm font-mono text-gray-100">
                {f.winRate}% WR
              </div>
              <div className="text-[11px] text-muted">
                {f.percentage}% of games
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Event Type Breakdown */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">
          Event Type Breakdown
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={EVENT_TYPE_BREAKDOWN}
              dataKey="matches"
              nameKey="type"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              strokeWidth={0}
            >
              {EVENT_TYPE_BREAKDOWN.map((_, i) => (
                <Cell
                  key={i}
                  fill={EVENT_COLORS[i % EVENT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => [
                `${value} matches`,
                name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ color: "#7a7a99", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Section 4: Faction Performance */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">
          Faction Performance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={factionsSorted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="faction" {...axisProps} />
            <YAxis yAxisId="left" {...axisProps} />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              {...axisProps}
              unit="%"
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => {
                if (name === "winRate") return [`${value}%`, "Win Rate"];
                return [value, "Matches"];
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="matches"
              name="matches"
              fill={COLORS.cyan}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="winRate"
              name="winRate"
              fill={COLORS.magenta}
              radius={[4, 4, 0, 0]}
            />
            <Legend
              wrapperStyle={{ color: "#7a7a99", fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Section 5: Venue Stats */}
      <section className="rounded-xl border border-border bg-surface/50 p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-100">
          Venue Stats
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                <th className="pb-2 pr-4">Venue</th>
                <th className="pb-2 pr-4 text-right">Matches</th>
                <th className="pb-2 pr-4 text-right">Record</th>
                <th className="pb-2 text-right">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {VENUE_STATS.map((v) => (
                <tr
                  key={v.name}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="py-2.5 pr-4 font-medium text-gray-100">
                    {v.name}
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono text-dim">
                    {v.matches}
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono text-dim">
                    {v.wins}-{v.losses}
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    <span
                      className={
                        v.winRate >= 60
                          ? "text-neon-green"
                          : v.winRate >= 55
                            ? "text-neon-cyan"
                            : "text-dim"
                      }
                    >
                      {v.winRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

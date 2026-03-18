"use client";

import { useState } from "react";
import { TabNav } from "@/src/components/ui/TabNav";
import { LEADERBOARD_CATEGORIES } from "@/src/lib/fake-data";

const CATEGORY_TABS = Object.entries(LEADERBOARD_CATEGORIES).map(([id, cat]) => ({
  id,
  label: cat.label,
}));

const TIER_COLORS: Record<string, { dot: string; border: string; bg: string }> = {
  grandmaster: {
    dot: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500",
    border: "border-yellow-400/60 shadow-[0_0_8px_rgba(250,204,21,0.3)]",
    bg: "bg-yellow-500/5",
  },
  diamond: {
    dot: "bg-cyan-400",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/5",
  },
  gold: {
    dot: "bg-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
  },
  silver: {
    dot: "bg-gray-400",
    border: "border-gray-500/30",
    bg: "bg-gray-500/5",
  },
  bronze: {
    dot: "bg-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
  },
  iron: {
    dot: "bg-zinc-400",
    border: "border-zinc-500/30",
    bg: "bg-zinc-500/5",
  },
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState(CATEGORY_TABS[0]!.id);
  const category =
    LEADERBOARD_CATEGORIES[activeTab as keyof typeof LEADERBOARD_CATEGORIES];

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        Rankings
      </h1>

      <div className="rounded-xl border border-border bg-surface/50 overflow-hidden">
        <TabNav tabs={CATEGORY_TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-5 space-y-3">
          {category.data.map((entry) => {
            const tier = TIER_COLORS[entry.tier] ?? TIER_COLORS.iron!;
            const isFirst = entry.rank === 1;
            const isCurrentPlayer = entry.username === "Cipher Zero";

            return (
              <div
                key={entry.rank}
                className={`
                  flex items-center gap-4 rounded-lg border px-4 py-3
                  transition-all duration-200 hover:bg-surface-hover hover:border-border-hover
                  ${
                    isCurrentPlayer
                      ? "border-neon-cyan/50 bg-neon-cyan/5 shadow-[0_0_12px_rgba(0,240,255,0.08)]"
                      : isFirst
                        ? `${tier.border} ${tier.bg} shadow-[0_0_16px_rgba(250,204,21,0.12)]`
                        : `border-border/60 bg-surface/30`
                  }
                `}
              >
                {/* Rank */}
                <span
                  className={`
                    w-8 text-center font-mono font-bold
                    ${isFirst ? "text-xl text-amber-300" : "text-base text-dim"}
                  `}
                >
                  {entry.rank}
                </span>

                {/* Tier dot */}
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${tier.dot}`}
                />

                {/* Username */}
                <span
                  className={`
                    flex-1 font-medium
                    ${
                      isCurrentPlayer
                        ? "text-neon-cyan"
                        : isFirst
                          ? "text-amber-200 text-lg"
                          : "text-gray-200"
                    }
                  `}
                >
                  {entry.username}
                  {isCurrentPlayer && (
                    <span className="ml-2 text-xs text-neon-cyan/60">(you)</span>
                  )}
                </span>

                {/* Value */}
                <span
                  className={`
                    font-mono font-semibold
                    ${
                      isFirst
                        ? "text-lg text-amber-300"
                        : isCurrentPlayer
                          ? "text-neon-cyan"
                          : "text-gray-300"
                    }
                  `}
                >
                  {entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

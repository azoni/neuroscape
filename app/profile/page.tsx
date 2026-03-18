"use client";

import { WinRateRing } from "@/src/components/ui/WinRateRing";
import { RecentForm } from "@/src/components/ui/RecentForm";
import { StatCard } from "@/src/components/ui/StatCard";
import { FactionBadge } from "@/src/components/ui/FactionBadge";
import {
  PLAYER,
  OVERALL_STATS,
  FACTION_STATS,
  TOURNAMENT_STATS,
  RECENT_FORM,
} from "@/src/lib/fake-data";

const ACHIEVEMENTS = [
  { name: "Century", description: "Play 100 matches", rarity: "common" as const, icon: "C" },
  { name: "Faction Master", description: "50 wins with one faction", rarity: "uncommon" as const, icon: "F" },
  { name: "Hot Streak (10)", description: "Win 10 matches in a row", rarity: "rare" as const, icon: "H" },
  { name: "Top 8 Club", description: "Finish Top 8 at an event", rarity: "epic" as const, icon: "T" },
  { name: "Draft Expert", description: "Win 3 draft events", rarity: "rare" as const, icon: "D" },
  { name: "Venue Regular", description: "Play at 5 different venues", rarity: "legendary" as const, icon: "V" },
];

const RARITY_COLORS: Record<string, string> = {
  common: "border-gray-500/40 text-gray-400 bg-gray-500/10",
  uncommon: "border-green-500/40 text-green-400 bg-green-500/10",
  rare: "border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10",
  epic: "border-neon-magenta/40 text-neon-magenta bg-neon-magenta/10",
  legendary: "border-neon-yellow/40 text-neon-yellow bg-neon-yellow/10",
};

const RARITY_ICON_BG: Record<string, string> = {
  common: "bg-gray-500/20 text-gray-400",
  uncommon: "bg-green-500/20 text-green-400",
  rare: "bg-neon-cyan/20 text-neon-cyan",
  epic: "bg-neon-magenta/20 text-neon-magenta",
  legendary: "bg-neon-yellow/20 text-neon-yellow",
};

export default function ProfilePage() {
  const totalFactionMatches = FACTION_STATS.reduce((s, f) => s + f.matches, 0);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-cyan/15 text-neon-cyan text-2xl font-bold shrink-0">
            {PLAYER.displayName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1
              className="text-2xl font-bold text-gray-100"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              {PLAYER.displayName}
            </h1>
            <p className="text-sm text-muted">@{PLAYER.username}</p>
            <p className="mt-2 text-sm text-gray-300">{PLAYER.bio}</p>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
              {PLAYER.socialLinks.twitter && (
                <span className="text-xs text-dim flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {PLAYER.socialLinks.twitter}
                </span>
              )}
              {PLAYER.socialLinks.discord && (
                <span className="text-xs text-dim flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  {PLAYER.socialLinks.discord}
                </span>
              )}
            </div>

            <p className="mt-2 text-[11px] text-dim">
              Joined {new Date(PLAYER.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-5">
          Stats Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
          <div className="col-span-2 md:col-span-1 flex justify-center">
            <WinRateRing value={OVERALL_STATS.winRate} size={100} label="Win Rate" />
          </div>
          <StatCard
            label="Record"
            value={`${OVERALL_STATS.wins}W - ${OVERALL_STATS.losses}L - ${OVERALL_STATS.draws}D`}
          />
          <StatCard
            label="ELO"
            value={OVERALL_STATS.elo}
            color="text-neon-cyan"
          />
          <StatCard
            label="Power Level"
            value={OVERALL_STATS.powerLevel}
            color="text-neon-magenta"
          />
          <StatCard
            label="Current Streak"
            value={`${OVERALL_STATS.currentStreak.type}${OVERALL_STATS.currentStreak.count}`}
            color="text-neon-green"
          />
          <StatCard
            label="Events"
            value={TOURNAMENT_STATS.eventCount}
          />
        </div>
      </div>

      {/* Faction Breakdown */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-5">
          Faction Breakdown
        </h2>
        <div className="space-y-3">
          {FACTION_STATS.map((fs) => {
            const pct = totalFactionMatches > 0 ? (fs.matches / totalFactionMatches) * 100 : 0;
            return (
              <div key={fs.faction} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <FactionBadge faction={fs.faction} size="md" />
                </div>
                <div className="flex-1">
                  <div className="h-3 rounded-full bg-dark-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-neon-cyan/60 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-300 w-16 text-right">
                  {fs.matches} matches
                </span>
                <span className="text-xs font-mono text-neon-green w-14 text-right">
                  {fs.winRate}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Form */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-4">
          Recent Form -- Last 20 Matches
        </h2>
        <RecentForm results={RECENT_FORM} />
        <p className="mt-2 text-[11px] text-muted">
          {RECENT_FORM.filter((r) => r === "W").length}W -{" "}
          {RECENT_FORM.filter((r) => r === "L").length}L -{" "}
          {RECENT_FORM.filter((r) => r === "D").length}D in last 20
        </p>
      </div>

      {/* Tournament Highlights */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-5">
          Tournament Highlights
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-neon-yellow/30 bg-neon-yellow/5 p-4 text-center">
            <p className="text-3xl font-bold font-mono text-neon-yellow">
              {TOURNAMENT_STATS.championWins}
            </p>
            <p className="text-xs text-dim uppercase tracking-wider mt-1">Champion</p>
          </div>
          <div className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-4 text-center">
            <p className="text-3xl font-bold font-mono text-neon-cyan">
              {TOURNAMENT_STATS.finalistFinishes}
            </p>
            <p className="text-xs text-dim uppercase tracking-wider mt-1">Finalist</p>
          </div>
          <div className="rounded-lg border border-neon-magenta/30 bg-neon-magenta/5 p-4 text-center">
            <p className="text-3xl font-bold font-mono text-neon-magenta">
              {TOURNAMENT_STATS.top4s}
            </p>
            <p className="text-xs text-dim uppercase tracking-wider mt-1">Top 4</p>
          </div>
          <div className="rounded-lg border border-neon-green/30 bg-neon-green/5 p-4 text-center">
            <p className="text-3xl font-bold font-mono text-neon-green">
              {TOURNAMENT_STATS.top8s}
            </p>
            <p className="text-xs text-dim uppercase tracking-wider mt-1">Top 8</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-5">
          Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.name}
              className={`rounded-lg border p-4 ${RARITY_COLORS[ach.rarity]}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${RARITY_ICON_BG[ach.rarity]}`}
                >
                  {ach.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{ach.name}</p>
                  <p className="text-[11px] text-muted">{ach.description}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5 opacity-70">
                    {ach.rarity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

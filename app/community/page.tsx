"use client";

import { useState } from "react";
import { FEED_EVENTS, LEADERBOARD_CATEGORIES } from "@/src/lib/fake-data";
import type { FeedEvent } from "@/src/lib/fake-data";

const TABS = ["All", "Matches", "Placements", "Games", "Achievements"] as const;

const TAB_TO_TYPE: Record<string, FeedEvent["type"] | null> = {
  All: null,
  Matches: "match_import",
  Placements: "placement",
  Games: "game",
  Achievements: "achievement",
};

const TYPE_DOT_COLOR: Record<FeedEvent["type"], string> = {
  match_import: "bg-neon-cyan",
  placement: "bg-neon-green",
  achievement: "bg-neon-magenta",
  game: "bg-neon-yellow",
};

const AVATAR_COLORS = [
  "bg-neon-cyan/20 text-neon-cyan",
  "bg-neon-magenta/20 text-neon-magenta",
  "bg-neon-green/20 text-neon-green",
  "bg-neon-yellow/20 text-neon-yellow",
  "bg-neon-orange/20 text-neon-orange",
];

function getAvatarColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredEvents = TAB_TO_TYPE[activeTab]
    ? FEED_EVENTS.filter((e) => e.type === TAB_TO_TYPE[activeTab])
    : FEED_EVENTS;

  const top5Elo = LEADERBOARD_CATEGORIES.elo.data.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-gray-100"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          Community
        </h1>
        <p className="mt-1 text-sm text-muted">Activity Feed</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Feed */}
        <div className="flex-1 space-y-4">
          {/* Tab Filters */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40"
                    : "bg-surface border border-border text-muted hover:text-gray-100 hover:border-border-hover"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Feed List */}
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const isChampion =
                event.type === "placement" &&
                event.message.toLowerCase().includes("champion");

              return (
                <div
                  key={event.id}
                  className={`rounded-lg border p-4 ${
                    isChampion
                      ? "border-neon-yellow/50 bg-surface"
                      : "border-border bg-surface"
                  }`}
                >
                  {/* Top row: avatar + username + timestamp */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${getAvatarColor(event.username)}`}
                    >
                      {event.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Username + type dot */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-bold text-gray-100 truncate">
                        {event.username}
                      </span>
                      <span
                        className={`inline-block h-2 w-2 rounded-full shrink-0 ${TYPE_DOT_COLOR[event.type]}`}
                        title={event.type.replace("_", " ")}
                      />
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-dim whitespace-nowrap">
                      {event.timestamp}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="mt-2 text-sm text-gray-300 pl-12">
                    {event.message}
                  </p>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="rounded-lg border border-border bg-surface p-8 text-center text-muted text-sm">
                No activity in this category yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar — Top Players */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="rounded-xl border border-border bg-surface p-5 sticky top-6">
            <h2 className="text-xs font-medium uppercase tracking-wider text-dim mb-4">
              Top Players
            </h2>
            <p className="text-[11px] text-muted mb-3">
              {LEADERBOARD_CATEGORIES.elo.label}
            </p>
            <div className="space-y-3">
              {top5Elo.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      entry.rank === 1
                        ? "bg-neon-yellow/15 text-neon-yellow"
                        : entry.rank === 2
                          ? "bg-gray-400/15 text-gray-400"
                          : entry.rank === 3
                            ? "bg-neon-orange/15 text-neon-orange"
                            : "bg-dark-700 text-dim"
                    }`}
                  >
                    {entry.rank}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-100 truncate">
                    {entry.username}
                  </span>
                  <span className="text-sm font-mono text-neon-cyan">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

const FACTION_COLORS: Record<string, string> = {
  ai: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  corpo: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  cybernetic: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  dustrunner: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  gambler: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  hacker: "bg-green-500/15 text-green-400 border-green-500/30",
  mech: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  mystic: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  nanobot: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  raver: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  robot: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  thrasher: "bg-red-500/15 text-red-400 border-red-500/30",
  wonderland: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30",
  neutral: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const SIZE_CLASSES: Record<string, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

interface FactionBadgeProps {
  faction: string;
  size?: "sm" | "md";
}

export function FactionBadge({ faction, size = "sm" }: FactionBadgeProps) {
  const key = faction.toLowerCase();
  const colorClass = FACTION_COLORS[key] ?? FACTION_COLORS.neutral;
  const sizeClass = SIZE_CLASSES[size];

  return (
    <span
      className={`inline-block rounded-full border font-medium capitalize ${colorClass} ${sizeClass}`}
    >
      {faction}
    </span>
  );
}

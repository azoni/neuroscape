"use client";

import type { Card } from "@/src/lib/types";
import { useState } from "react";

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

function CardImage({ card, className }: { card: Card; className?: string }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`flex items-center justify-center bg-dark-700 text-dim text-xs ${className}`}>
        {card.name}
      </div>
    );
  }

  return (
    <img
      src={card.imageUrl}
      alt={card.name}
      className={`object-cover card-img-inner transition-transform duration-300 ${className}`}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}

export function CardTile({
  card,
  onClick,
  overlay,
  compact,
}: {
  card: Card;
  onClick?: () => void;
  overlay?: React.ReactNode;
  compact?: boolean;
}) {
  const factionClass = FACTION_COLORS[card.faction ?? "neutral"] ?? FACTION_COLORS.neutral;

  return (
    <div
      className="card-glow card-img-zoom group relative overflow-hidden rounded-lg border border-border bg-surface cursor-pointer"
      onClick={onClick}
    >
      {/* Card image */}
      <div className="overflow-hidden">
        <CardImage card={card} className="aspect-[5/7] w-full" />
      </div>

      {/* Card info */}
      {!compact && (
        <div className="p-2.5">
          <h3 className="text-sm font-semibold truncate text-gray-100">{card.name}</h3>
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${factionClass}`}>
              {card.faction ?? "neutral"}
            </span>
            <span className="text-[10px] text-dim capitalize">{card.subtype ?? card.type}</span>
            <span className="ml-auto text-[10px] font-mono text-neon-cyan stat-number">{card.cost} RAM</span>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      {overlay && (
        <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="bg-gradient-to-t from-dark-950 via-dark-950/95 to-transparent px-3 pb-3 pt-8">
            {overlay}
          </div>
        </div>
      )}

      {/* Quantity badge (for deck builder) */}
    </div>
  );
}

export function CardListItem({
  card,
  onClick,
  right,
}: {
  card: Card;
  onClick?: () => void;
  right?: React.ReactNode;
}) {
  const factionClass = FACTION_COLORS[card.faction ?? "neutral"] ?? FACTION_COLORS.neutral;

  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 cursor-pointer hover:bg-surface-hover hover:border-border-hover transition-all duration-200"
      onClick={onClick}
    >
      <div className="h-10 w-7 rounded overflow-hidden shrink-0">
        <CardImage card={card} className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium truncate">{card.name}</h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`rounded-full border px-1.5 py-px text-[9px] font-medium capitalize ${factionClass}`}>
            {card.faction ?? "neutral"}
          </span>
          <span className="text-[9px] text-dim capitalize">{card.subtype ?? card.type}</span>
        </div>
      </div>
      <span className="text-xs font-mono text-neon-cyan stat-number shrink-0">{card.cost}</span>
      {right}
    </div>
  );
}

type ViewMode = "grid" | "list";

export function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => onChange("grid")}
        className={`px-3 py-1.5 text-xs transition-colors ${mode === "grid" ? "bg-neon-cyan/10 text-neon-cyan" : "text-dim hover:text-muted"}`}
        title="Grid view"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      </button>
      <button
        onClick={() => onChange("list")}
        className={`px-3 py-1.5 text-xs transition-colors ${mode === "list" ? "bg-neon-cyan/10 text-neon-cyan" : "text-dim hover:text-muted"}`}
        title="List view"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="14" height="2.5" rx="0.5" />
          <rect x="1" y="6.75" width="14" height="2.5" rx="0.5" />
          <rect x="1" y="11.5" width="14" height="2.5" rx="0.5" />
        </svg>
      </button>
    </div>
  );
}

export function CardGrid({
  cards,
  onCardClick,
  renderOverlay,
  viewMode = "grid",
  renderRight,
}: {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  renderOverlay?: (card: Card) => React.ReactNode;
  renderRight?: (card: Card) => React.ReactNode;
  viewMode?: ViewMode;
}) {
  if (viewMode === "list") {
    return (
      <div className="space-y-1.5">
        {cards.map((card) => (
          <CardListItem
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card)}
            right={renderRight?.(card)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
          overlay={renderOverlay?.(card)}
        />
      ))}
    </div>
  );
}

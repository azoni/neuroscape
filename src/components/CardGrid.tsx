"use client";

import type { Card } from "@/src/lib/types";
import { useState } from "react";

const FACTION_COLORS: Record<string, string> = {
  ai: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  corpo: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  cybernetic: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  dustrunner: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  gambler: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  hacker: "bg-green-500/20 text-green-300 border-green-500/40",
  mech: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  mystic: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  nanobot: "bg-teal-500/20 text-teal-300 border-teal-500/40",
  raver: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  robot: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
  thrasher: "bg-red-500/20 text-red-300 border-red-500/40",
  wonderland: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
  neutral: "bg-gray-500/20 text-gray-300 border-gray-500/40",
};

function CardImage({ card }: { card: Card }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="flex aspect-[5/7] w-full items-center justify-center bg-dark-700 text-gray-500 text-xs">
        No Image
      </div>
    );
  }

  return (
    <img
      src={card.imageUrl}
      alt={card.name}
      className="aspect-[5/7] w-full object-cover"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}

export function CardTile({
  card,
  onClick,
  action,
}: {
  card: Card;
  onClick?: () => void;
  action?: React.ReactNode;
}) {
  const factionClass = FACTION_COLORS[card.faction ?? "neutral"] ?? FACTION_COLORS.neutral;

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-dark-600 bg-dark-800 transition-all hover:border-dark-500 hover:shadow-lg hover:shadow-neon-cyan/5 cursor-pointer"
      onClick={onClick}
    >
      <CardImage card={card} />
      <div className="p-2">
        <h3 className="text-sm font-semibold truncate">{card.name}</h3>
        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${factionClass}`}>
            {card.faction ?? "neutral"}
          </span>
          <span className="text-[10px] text-gray-500 capitalize">{card.subtype ?? card.type}</span>
          <span className="ml-auto text-[10px] font-mono text-neon-cyan">{card.cost} RAM</span>
        </div>
      </div>
      {action && (
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform group-hover:translate-y-0 bg-dark-900/90 p-2">
          {action}
        </div>
      )}
    </div>
  );
}

export function CardGrid({
  cards,
  onCardClick,
  renderAction,
}: {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  renderAction?: (card: Card) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
          action={renderAction?.(card)}
        />
      ))}
    </div>
  );
}

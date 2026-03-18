"use client";

import type { Card } from "@/src/lib/types";
import { useState } from "react";

export function CardModal({
  card,
  onClose,
}: {
  card: Card;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full rounded-xl border border-dark-600 bg-dark-800 overflow-hidden shadow-2xl shadow-neon-cyan/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-dark-900/80 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
        >
          &times;
        </button>

        {!imgError ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="aspect-[5/7] w-full bg-dark-700 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}

        <div className="p-4 space-y-2">
          <h2 className="text-lg font-bold">{card.name}</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-2.5 py-1 text-neon-cyan capitalize">
              {card.subtype ?? card.type}
            </span>
            {card.faction && (
              <span className="rounded-full border border-neon-magenta/40 bg-neon-magenta/10 px-2.5 py-1 text-neon-magenta capitalize">
                {card.faction}
              </span>
            )}
            {card.requirement && (
              <span className="rounded-full border border-neon-yellow/40 bg-neon-yellow/10 px-2.5 py-1 text-neon-yellow capitalize">
                Requires: {card.requirement}
              </span>
            )}
            <span className="rounded-full border border-dark-500 bg-dark-700 px-2.5 py-1 text-gray-300 font-mono">
              {card.cost} RAM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

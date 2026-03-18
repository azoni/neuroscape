"use client";

import type { Card } from "@/src/lib/types";
import { useEffect, useState } from "react";

export function CardModal({
  card,
  onClose,
  onAddToDeck,
}: {
  card: Card;
  onClose: () => void;
  onAddToDeck?: (card: Card) => void;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full rounded-2xl border border-border bg-dark-800 overflow-hidden shadow-2xl shadow-neon-cyan/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-dark-950/60 backdrop-blur-sm text-dim hover:text-white flex items-center justify-center transition-all duration-200 hover:bg-dark-950/80"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        {!imgError ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="aspect-[5/7] w-full bg-dark-700 flex items-center justify-center text-dim">
            No Image Available
          </div>
        )}

        {/* Info */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-100">{card.name}</h2>
            <span className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-1 text-sm font-mono text-neon-cyan stat-number shrink-0">
              {card.cost} RAM
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted capitalize font-medium">
              {card.subtype ?? card.type}
            </span>
            {card.faction && (
              <span className="rounded-full border border-neon-magenta/30 bg-neon-magenta/10 px-3 py-1 text-neon-magenta capitalize font-medium">
                {card.faction}
              </span>
            )}
            {card.requirement && (
              <span className="rounded-full border border-neon-yellow/30 bg-neon-yellow/10 px-3 py-1 text-neon-yellow capitalize font-medium">
                Req: {card.requirement}
              </span>
            )}
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="h-1.5 w-1.5 rotate-45 bg-neon-cyan/30" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Actions */}
          {onAddToDeck && (
            <button
              onClick={() => onAddToDeck(card)}
              className="w-full rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 py-2.5 text-sm font-medium text-neon-cyan transition-all duration-200 hover:bg-neon-cyan/10 hover:border-neon-cyan/50"
            >
              Add to Deck
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

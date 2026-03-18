"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/src/lib/store";
import { loadDecks, deleteDeck } from "@/src/lib/deck-storage";
import type { Deck, Card } from "@/src/lib/types";

function DeckCard({ deck, onDelete }: { deck: Deck; onDelete: () => void }) {
  const mainframe = deck.mainframeId != null ? db.getById(deck.mainframeId) : null;
  const cyberdeckSize = deck.cyberdeck.reduce((s, e) => s + e.quantity, 0);

  // Faction breakdown
  const factionCounts = new Map<string, number>();
  for (const entry of deck.cyberdeck) {
    const card = db.getById(entry.cardId);
    const f = card?.faction ?? "neutral";
    factionCounts.set(f, (factionCounts.get(f) ?? 0) + entry.quantity);
  }

  // Top 3 factions
  const topFactions = Array.from(factionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Average cost
  let totalCost = 0;
  let totalCards = 0;
  for (const entry of deck.cyberdeck) {
    const card = db.getById(entry.cardId);
    if (card) {
      totalCost += card.cost * entry.quantity;
      totalCards += entry.quantity;
    }
  }
  const avgCost = totalCards > 0 ? (totalCost / totalCards).toFixed(1) : "—";

  // Preview images (first 4 cards)
  const previewCards: Card[] = [];
  for (const entry of deck.cyberdeck) {
    if (previewCards.length >= 4) break;
    const card = db.getById(entry.cardId);
    if (card) previewCards.push(card);
  }

  const dateStr = new Date(deck.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="card-glow rounded-xl border border-border bg-surface overflow-hidden">
      {/* Card preview strip */}
      <div className="flex h-24 overflow-hidden">
        {previewCards.length > 0 ? (
          previewCards.map((card) => (
            <div key={card.id} className="flex-1 overflow-hidden">
              <img src={card.imageUrl} alt="" className="h-full w-full object-cover object-top opacity-60" />
            </div>
          ))
        ) : (
          <div className="flex-1 bg-dark-700" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-gray-100">{deck.name}</h3>
            {mainframe && (
              <p className="text-xs text-dim mt-0.5">{mainframe.name}</p>
            )}
          </div>
          <span className="text-[10px] text-dim">{dateStr}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div>
            <span className="text-lg font-bold text-neon-cyan stat-number">{cyberdeckSize}</span>
            <span className="text-[10px] text-dim ml-1">cards</span>
          </div>
          <div>
            <span className="text-lg font-bold text-neon-magenta stat-number">{avgCost}</span>
            <span className="text-[10px] text-dim ml-1">avg cost</span>
          </div>
        </div>

        {/* Factions */}
        {topFactions.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {topFactions.map(([faction, count]) => (
              <span key={faction} className="rounded-full border border-border bg-dark-800 px-2 py-0.5 text-[10px] text-muted capitalize">
                {faction} ({count})
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <Link
            href={`/decks?load=${deck.id}`}
            className="flex-1 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 py-1.5 text-center text-xs font-medium text-neon-cyan transition-all hover:bg-neon-cyan/10"
          >
            Edit
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this deck?")) onDelete();
            }}
            className="rounded-lg border border-border bg-surface py-1.5 px-3 text-xs text-dim hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    setDecks(loadDecks());
  }, []);

  const handleDelete = (id: string) => {
    deleteDeck(id);
    setDecks(loadDecks());
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">My Decks</h1>
          <p className="text-sm text-dim mt-1">{decks.length} saved deck{decks.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/decks"
          className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-5 py-2 text-sm font-medium text-neon-cyan transition-all hover:bg-neon-cyan/10 hover:border-neon-cyan/50"
        >
          + New Deck
        </Link>
      </div>

      {decks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onDelete={() => handleDelete(deck.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-xl border border-border bg-surface/30">
          <div className="text-4xl mb-3 opacity-20">&#x2694;</div>
          <p className="text-muted font-medium">No decks yet</p>
          <p className="text-xs text-dim mt-1 mb-4">Build your first cyberdeck</p>
          <Link
            href="/decks"
            className="inline-block rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-6 py-2.5 text-sm font-medium text-neon-cyan transition-all hover:bg-neon-cyan/10"
          >
            Deck Builder
          </Link>
        </div>
      )}
    </div>
  );
}

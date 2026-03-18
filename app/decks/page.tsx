"use client";

import { useState, useMemo, useCallback } from "react";
import { db } from "@/src/lib/store";
import { DeckBuilder } from "@/src/lib/deck-builder";
import type { Card, CardFilter, Deck, DeckEntry } from "@/src/lib/types";
import { DECK_RULES } from "@/src/lib/types";
import { CardGrid } from "@/src/components/CardGrid";
import { CardFilters } from "@/src/components/CardFilters";

function DeckSidebar({
  deck,
  onRemoveCard,
  onClear,
  validation,
}: {
  deck: Deck;
  onRemoveCard: (cardId: number) => void;
  onClear: () => void;
  validation: { valid: boolean; errors: Array<{ message: string }> };
}) {
  const mainframe = deck.mainframeId != null ? db.getById(deck.mainframeId) : null;
  const cyberdeckSize = deck.cyberdeck.reduce((s, e) => s + e.quantity, 0);

  const cyberdeckCards = deck.cyberdeck
    .map((entry) => ({ card: db.getById(entry.cardId), entry }))
    .filter((x): x is { card: Card; entry: DeckEntry } => x.card != null)
    .sort((a, b) => a.card.name.localeCompare(b.card.name));

  // Faction breakdown
  const factionCounts = new Map<string, number>();
  for (const { card, entry } of cyberdeckCards) {
    const f = card.faction ?? "neutral";
    factionCounts.set(f, (factionCounts.get(f) ?? 0) + entry.quantity);
  }

  // Average cost
  let totalCost = 0;
  let totalCards = 0;
  for (const { card, entry } of cyberdeckCards) {
    totalCost += card.cost * entry.quantity;
    totalCards += entry.quantity;
  }
  const avgCost = totalCards > 0 ? (totalCost / totalCards).toFixed(1) : "0";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Cyberdeck</h2>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Mainframe */}
      <div className="mb-3 rounded-lg border border-dark-600 bg-dark-800 p-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Mainframe</span>
        {mainframe ? (
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-medium">{mainframe.name}</span>
            <button
              onClick={() => onRemoveCard(-1)}
              className="text-xs text-gray-500 hover:text-red-400"
            >
              &times;
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-500 mt-1">Select a mainframe card</p>
        )}
      </div>

      {/* Stats */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-dark-600 bg-dark-800 py-1.5">
          <div className="text-lg font-bold text-neon-cyan">{cyberdeckSize}</div>
          <div className="text-[10px] text-gray-500">Cards</div>
        </div>
        <div className="rounded-lg border border-dark-600 bg-dark-800 py-1.5">
          <div className="text-lg font-bold text-neon-magenta">{avgCost}</div>
          <div className="text-[10px] text-gray-500">Avg Cost</div>
        </div>
        <div className="rounded-lg border border-dark-600 bg-dark-800 py-1.5">
          <div className={`text-lg font-bold ${cyberdeckSize >= DECK_RULES.CYBERDECK_MIN ? "text-neon-green" : "text-red-400"}`}>
            {DECK_RULES.CYBERDECK_MIN}
          </div>
          <div className="text-[10px] text-gray-500">Min</div>
        </div>
      </div>

      {/* Faction breakdown */}
      {factionCounts.size > 0 && (
        <div className="mb-3 space-y-1">
          {Array.from(factionCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([faction, count]) => (
              <div key={faction} className="flex items-center gap-2">
                <div
                  className="h-1.5 rounded-full bg-neon-cyan/60"
                  style={{ width: `${(count / cyberdeckSize) * 100}%`, minWidth: 4 }}
                />
                <span className="text-[10px] text-gray-400 capitalize whitespace-nowrap">
                  {faction} ({count})
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Validation */}
      {!validation.valid && (
        <div className="mb-3 space-y-1">
          {validation.errors.map((err, i) => (
            <p key={i} className="text-[10px] text-red-400">{err.message}</p>
          ))}
        </div>
      )}

      {/* Card list */}
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {cyberdeckCards.map(({ card, entry }) => (
          <div
            key={card.id}
            className="flex items-center justify-between rounded px-2 py-1 hover:bg-dark-700 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono text-neon-cyan w-4 text-right">{entry.quantity}x</span>
              <span className="text-xs truncate">{card.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500">{card.cost}</span>
              <button
                onClick={() => onRemoveCard(card.id)}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                &minus;
              </button>
            </div>
          </div>
        ))}
        {cyberdeckCards.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-4">
            Add cards from the browser
          </p>
        )}
      </div>
    </div>
  );
}

export default function DecksPage() {
  const [filter, setFilter] = useState<CardFilter>({});
  const [deck, setDeck] = useState<Deck>({
    id: crypto.randomUUID(),
    name: "New Deck",
    mainframeId: null,
    cyberdeck: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const results = useMemo(
    () => db.search(filter, { field: "name", direction: "asc" }),
    [filter],
  );

  const validation = useMemo(() => {
    const builder = DeckBuilder.fromDeck(db, deck);
    return builder.validate();
  }, [deck]);

  const addCard = useCallback((card: Card) => {
    setDeck((prev) => {
      if (card.type === "mainframe") {
        return { ...prev, mainframeId: card.id, updatedAt: new Date().toISOString() };
      }
      const existing = prev.cyberdeck.find((e) => e.cardId === card.id);
      if (existing && existing.quantity >= DECK_RULES.MAX_COPIES_PER_CARD) return prev;
      const cyberdeck = existing
        ? prev.cyberdeck.map((e) =>
            e.cardId === card.id ? { ...e, quantity: e.quantity + 1 } : e,
          )
        : [...prev.cyberdeck, { cardId: card.id, quantity: 1 }];
      return { ...prev, cyberdeck, updatedAt: new Date().toISOString() };
    });
  }, []);

  const removeCard = useCallback((cardId: number) => {
    setDeck((prev) => {
      if (cardId === -1) {
        return { ...prev, mainframeId: null, updatedAt: new Date().toISOString() };
      }
      const cyberdeck = prev.cyberdeck
        .map((e) => (e.cardId === cardId ? { ...e, quantity: e.quantity - 1 } : e))
        .filter((e) => e.quantity > 0);
      return { ...prev, cyberdeck, updatedAt: new Date().toISOString() };
    });
  }, []);

  const clearDeck = useCallback(() => {
    setDeck((prev) => ({
      ...prev,
      mainframeId: null,
      cyberdeck: [],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const getCardQuantityInDeck = useCallback(
    (cardId: number) => {
      const entry = deck.cyberdeck.find((e) => e.cardId === cardId);
      return entry?.quantity ?? 0;
    },
    [deck.cyberdeck],
  );

  return (
    <div className="flex gap-6 min-h-[calc(100vh-120px)]">
      {/* Card browser */}
      <div className="flex-1 min-w-0">
        <h1 className="mb-6 text-2xl font-bold">Deck Builder</h1>
        <CardFilters filter={filter} onChange={setFilter} totalResults={results.length} />
        <CardGrid
          cards={results}
          onCardClick={addCard}
          renderAction={(card) => {
            const qty = card.type === "mainframe"
              ? (deck.mainframeId === card.id ? 1 : 0)
              : getCardQuantityInDeck(card.id);
            return (
              <div className="flex items-center justify-between">
                <span className="text-xs text-neon-green">+ Add</span>
                {qty > 0 && (
                  <span className="text-xs font-mono text-neon-cyan">{qty}x</span>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Deck sidebar */}
      <div className="w-72 shrink-0 sticky top-20 h-[calc(100vh-120px)] rounded-xl border border-dark-600 bg-dark-800/50 p-4 overflow-hidden">
        <DeckSidebar
          deck={deck}
          onRemoveCard={removeCard}
          onClear={clearDeck}
          validation={validation}
        />
      </div>
    </div>
  );
}

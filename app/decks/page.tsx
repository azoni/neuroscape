"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { db } from "@/src/lib/store";
import { DeckBuilder } from "@/src/lib/deck-builder";
import { saveDeck, getDeck } from "@/src/lib/deck-storage";
import { useSearchParams } from "next/navigation";
import type { Card, CardFilter, Deck, DeckEntry } from "@/src/lib/types";
import { DECK_RULES } from "@/src/lib/types";
import { CardGrid, ViewToggle } from "@/src/components/CardGrid";
import { CardFilters } from "@/src/components/CardFilters";
import { CostCurve } from "@/src/components/CostCurve";

function StatBox({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="rounded-lg border border-border bg-dark-800 py-2 px-2 text-center">
      <div className={`text-lg font-bold stat-number ${color ?? "text-gray-100"}`}>{value}</div>
      <div className="text-[9px] text-dim uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}

const FACTION_DOT_COLORS: Record<string, string> = {
  ai: "bg-blue-400",
  corpo: "bg-amber-400",
  cybernetic: "bg-sky-400",
  dustrunner: "bg-orange-400",
  gambler: "bg-yellow-400",
  hacker: "bg-green-400",
  mech: "bg-slate-400",
  mystic: "bg-purple-400",
  nanobot: "bg-teal-400",
  raver: "bg-pink-400",
  robot: "bg-zinc-400",
  thrasher: "bg-red-400",
  wonderland: "bg-fuchsia-400",
  neutral: "bg-gray-400",
};

function DeckSidebar({
  deck,
  onRemoveCard,
  onClear,
  onSave,
  onNameChange,
  validation,
  saved,
}: {
  deck: Deck;
  onRemoveCard: (cardId: number) => void;
  onClear: () => void;
  onSave: () => void;
  onNameChange: (name: string) => void;
  validation: { valid: boolean; errors: Array<{ message: string }> };
  saved: boolean;
}) {
  const mainframe = deck.mainframeId != null ? db.getById(deck.mainframeId) : null;
  const cyberdeckSize = deck.cyberdeck.reduce((s, e) => s + e.quantity, 0);

  const cyberdeckCards = deck.cyberdeck
    .map((entry) => ({ card: db.getById(entry.cardId), entry }))
    .filter((x): x is { card: Card; entry: DeckEntry } => x.card != null)
    .sort((a, b) => a.card.cost - b.card.cost || a.card.name.localeCompare(b.card.name));

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
  const avgCost = totalCards > 0 ? (totalCost / totalCards).toFixed(1) : "—";

  return (
    <div className="flex flex-col h-full">
      {/* Deck name */}
      <input
        type="text"
        value={deck.name}
        onChange={(e) => onNameChange(e.target.value)}
        className="mb-3 bg-transparent text-lg font-bold text-gray-100 outline-none border-b border-transparent focus:border-neon-cyan/30 transition-colors w-full"
        placeholder="Deck name..."
      />

      {/* Mainframe */}
      <div className="mb-3 rounded-lg border border-border bg-dark-800 p-2.5">
        <div className="text-[9px] text-dim uppercase tracking-wider mb-1">Mainframe</div>
        {mainframe ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-4 rounded overflow-hidden shrink-0 bg-dark-700">
                <img src={mainframe.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <span className="text-sm font-medium truncate">{mainframe.name}</span>
            </div>
            <button
              onClick={() => onRemoveCard(-1)}
              className="text-dim hover:text-red-400 transition-colors p-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <p className="text-xs text-dim">Click a mainframe card to set</p>
        )}
      </div>

      {/* Stats row */}
      <div className="mb-3 grid grid-cols-3 gap-1.5">
        <StatBox
          value={cyberdeckSize}
          label="Cards"
          color="text-neon-cyan"
        />
        <StatBox
          value={avgCost}
          label="Avg Cost"
          color="text-neon-magenta"
        />
        <StatBox
          value={`${DECK_RULES.CYBERDECK_MIN}`}
          label="Min"
          color={cyberdeckSize >= DECK_RULES.CYBERDECK_MIN ? "text-neon-green" : "text-red-400"}
        />
      </div>

      {/* Cost curve */}
      {cyberdeckSize > 0 && (
        <div className="mb-3 rounded-lg border border-border bg-dark-800 p-2.5">
          <div className="text-[9px] text-dim uppercase tracking-wider mb-2">Mana Curve</div>
          <CostCurve entries={deck.cyberdeck} />
        </div>
      )}

      {/* Faction breakdown */}
      {factionCounts.size > 0 && (
        <div className="mb-3 rounded-lg border border-border bg-dark-800 p-2.5">
          <div className="text-[9px] text-dim uppercase tracking-wider mb-2">Factions</div>
          <div className="space-y-1.5">
            {Array.from(factionCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([faction, count]) => (
                <div key={faction} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${FACTION_DOT_COLORS[faction] ?? "bg-gray-400"}`} />
                  <div className="flex-1 h-1.5 rounded-full bg-dark-600 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-neon-cyan/50 transition-all duration-300"
                      style={{ width: `${(count / cyberdeckSize) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-dim capitalize w-16 truncate">{faction}</span>
                  <span className="text-[10px] text-muted stat-number w-4 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Validation errors */}
      {!validation.valid && cyberdeckSize > 0 && (
        <div className="mb-3 space-y-1 rounded-lg border border-red-500/20 bg-red-500/5 p-2.5">
          {validation.errors.slice(0, 3).map((err, i) => (
            <p key={i} className="text-[10px] text-red-400">{err.message}</p>
          ))}
        </div>
      )}

      {/* Card list */}
      <div className="flex-1 overflow-y-auto space-y-px min-h-0">
        {cyberdeckCards.map(({ card, entry }) => (
          <div
            key={card.id}
            className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-surface-hover transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono text-neon-cyan w-5 text-right stat-number">{entry.quantity}x</span>
              <span className="text-xs truncate text-gray-200">{card.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-dim font-mono stat-number">{card.cost}</span>
              <button
                onClick={() => onRemoveCard(card.id)}
                className="text-dim hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
              </button>
            </div>
          </div>
        ))}
        {cyberdeckCards.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-xs text-dim">Click cards to add them</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2 border-t border-border pt-3">
        <button
          onClick={onSave}
          disabled={cyberdeckSize === 0}
          className="flex-1 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 py-2 text-xs font-medium text-neon-cyan transition-all duration-200 hover:bg-neon-cyan/10 hover:border-neon-cyan/50 disabled:opacity-30 disabled:pointer-events-none"
        >
          {saved ? "Saved!" : "Save Deck"}
        </button>
        <button
          onClick={onClear}
          className="rounded-lg border border-border bg-surface py-2 px-3 text-xs text-dim hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function createEmptyDeck(): Deck {
  return {
    id: crypto.randomUUID(),
    name: "New Deck",
    mainframeId: null,
    cyberdeck: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function DecksPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-dim">Loading...</div>}>
      <DecksPageInner />
    </Suspense>
  );
}

function DecksPageInner() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<CardFilter>({});
  const [deck, setDeck] = useState<Deck>(createEmptyDeck);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [saved, setSaved] = useState(false);

  // Load deck from URL param
  useEffect(() => {
    const loadId = searchParams.get("load");
    if (loadId) {
      const existing = getDeck(loadId);
      if (existing) setDeck(existing);
    }
  }, [searchParams]);

  const results = useMemo(
    () => db.search(filter, { field: "name", direction: "asc" }),
    [filter],
  );

  const validation = useMemo(() => {
    const builder = DeckBuilder.fromDeck(db, deck);
    return builder.validate();
  }, [deck]);

  const addCard = useCallback((card: Card) => {
    setSaved(false);
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
    setSaved(false);
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
    setSaved(false);
    setDeck(createEmptyDeck());
  }, []);

  const handleSave = useCallback(() => {
    saveDeck(deck);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [deck]);

  const handleNameChange = useCallback((name: string) => {
    setSaved(false);
    setDeck((prev) => ({ ...prev, name, updatedAt: new Date().toISOString() }));
  }, []);

  const getCardQuantityInDeck = useCallback(
    (cardId: number) => {
      if (deck.mainframeId === cardId) return 1;
      const entry = deck.cyberdeck.find((e) => e.cardId === cardId);
      return entry?.quantity ?? 0;
    },
    [deck.cyberdeck, deck.mainframeId],
  );

  return (
    <div className="flex gap-5 min-h-[calc(100vh-140px)]">
      {/* Card browser */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Deck Builder</h1>
          <p className="text-sm text-dim mt-1">Click cards to add them to your deck</p>
        </div>
        <CardFilters
          filter={filter}
          onChange={setFilter}
          totalResults={results.length}
          totalCards={db.size}
          rightSlot={<ViewToggle mode={viewMode} onChange={setViewMode} />}
        />
        <CardGrid
          cards={results}
          onCardClick={addCard}
          viewMode={viewMode}
          renderOverlay={(card) => {
            const qty = getCardQuantityInDeck(card.id);
            return (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neon-green">+ Add to deck</span>
                {qty > 0 && (
                  <span className="text-xs font-mono text-neon-cyan stat-number px-1.5 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/20">
                    {qty}x
                  </span>
                )}
              </div>
            );
          }}
          renderRight={(card) => {
            const qty = getCardQuantityInDeck(card.id);
            return qty > 0 ? (
              <span className="text-xs font-mono text-neon-cyan stat-number ml-2 px-1.5 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/20">
                {qty}x
              </span>
            ) : null;
          }}
        />
      </div>

      {/* Deck sidebar */}
      <div className="w-72 shrink-0 sticky top-16 h-[calc(100vh-100px)] rounded-xl border border-border bg-surface/80 backdrop-blur-sm p-4 overflow-hidden flex flex-col">
        <DeckSidebar
          deck={deck}
          onRemoveCard={removeCard}
          onClear={clearDeck}
          onSave={handleSave}
          onNameChange={handleNameChange}
          validation={validation}
          saved={saved}
        />
      </div>
    </div>
  );
}

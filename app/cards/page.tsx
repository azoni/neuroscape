"use client";

import { useState, useMemo } from "react";
import { db } from "@/src/lib/store";
import type { Card, CardFilter } from "@/src/lib/types";
import { CardGrid, ViewToggle } from "@/src/components/CardGrid";
import { CardFilters } from "@/src/components/CardFilters";
import { CardModal } from "@/src/components/CardModal";

export default function CardsPage() {
  const [filter, setFilter] = useState<CardFilter>({});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const results = useMemo(
    () => db.search(filter, { field: "name", direction: "asc" }),
    [filter],
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Card Database</h1>
        <p className="text-sm text-dim mt-1">Browse all {db.size} Genesis cards</p>
      </div>
      <CardFilters
        filter={filter}
        onChange={setFilter}
        totalResults={results.length}
        totalCards={db.size}
        rightSlot={<ViewToggle mode={viewMode} onChange={setViewMode} />}
      />
      {results.length > 0 ? (
        <CardGrid cards={results} onCardClick={setSelectedCard} viewMode={viewMode} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted">No cards found</p>
          <p className="text-xs text-dim mt-1">Try adjusting your filters</p>
        </div>
      )}
      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}

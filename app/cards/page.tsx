"use client";

import { useState, useMemo } from "react";
import { db } from "@/src/lib/store";
import type { Card, CardFilter } from "@/src/lib/types";
import { CardGrid } from "@/src/components/CardGrid";
import { CardFilters } from "@/src/components/CardFilters";
import { CardModal } from "@/src/components/CardModal";

export default function CardsPage() {
  const [filter, setFilter] = useState<CardFilter>({});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const results = useMemo(
    () => db.search(filter, { field: "name", direction: "asc" }),
    [filter],
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Card Database</h1>
      <CardFilters filter={filter} onChange={setFilter} totalResults={results.length} />
      <CardGrid cards={results} onCardClick={setSelectedCard} />
      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}

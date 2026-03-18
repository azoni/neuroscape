"use client";

import type { Card, DeckEntry } from "@/src/lib/types";
import { db } from "@/src/lib/store";

export function CostCurve({ entries }: { entries: DeckEntry[] }) {
  // Count cards at each cost
  const costCounts: number[] = [0, 0, 0, 0, 0, 0, 0]; // 0-6+

  for (const entry of entries) {
    const card = db.getById(entry.cardId);
    if (!card) continue;
    const bucket = Math.min(card.cost, 6);
    costCounts[bucket] += entry.quantity;
  }

  const maxCount = Math.max(...costCounts, 1);

  return (
    <div className="flex items-end gap-1 h-16">
      {costCounts.map((count, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-[9px] text-dim stat-number">{count || ""}</span>
          <div className="w-full relative" style={{ height: "100%" }}>
            <div
              className="w-full rounded-t bg-gradient-to-t from-neon-cyan/40 to-neon-cyan/20 border border-neon-cyan/20 border-b-0 cost-bar"
              style={{ height: `${maxCount > 0 ? (count / maxCount) * 40 : 0}px` }}
            />
          </div>
          <span className="text-[9px] text-dim font-mono">{i === 6 ? "6+" : i}</span>
        </div>
      ))}
    </div>
  );
}

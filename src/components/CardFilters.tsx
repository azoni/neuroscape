"use client";

import { FACTIONS, CARD_TYPES } from "@/src/lib/types";
import type { CardFilter, CardType, Faction } from "@/src/lib/types";

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-all ${
        active
          ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan"
          : "border-dark-500 bg-dark-700 text-gray-400 hover:border-dark-500 hover:text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

export function CardFilters({
  filter,
  onChange,
  totalResults,
}: {
  filter: CardFilter;
  onChange: (filter: CardFilter) => void;
  totalResults: number;
}) {
  const toggleType = (type: CardType) => {
    const current = filter.types ?? [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ ...filter, types: next.length > 0 ? next : undefined });
  };

  const toggleFaction = (faction: Faction | "neutral") => {
    const current = filter.factions ?? [];
    const next = current.includes(faction)
      ? current.filter((f) => f !== faction)
      : [...current, faction];
    onChange({ ...filter, factions: next.length > 0 ? next : undefined });
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search cards..."
          value={filter.name ?? ""}
          onChange={(e) => onChange({ ...filter, name: e.target.value || undefined })}
          className="flex-1 rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-neon-cyan/50 transition-colors"
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {totalResults} cards
        </span>
      </div>

      {/* Cost range */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 w-8">Cost:</span>
        {[0, 1, 2, 3, 4, 5, 6].map((cost) => (
          <button
            key={cost}
            onClick={() => {
              if (filter.minCost === cost && filter.maxCost === cost) {
                onChange({ ...filter, minCost: undefined, maxCost: undefined });
              } else {
                onChange({ ...filter, minCost: cost, maxCost: cost === 6 ? undefined : cost });
              }
            }}
            className={`h-8 w-8 rounded-md border text-xs font-mono transition-all ${
              filter.minCost === cost
                ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan"
                : "border-dark-500 bg-dark-700 text-gray-400 hover:text-gray-300"
            }`}
          >
            {cost === 6 ? "6+" : cost}
          </button>
        ))}
      </div>

      {/* Types */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 w-8">Type:</span>
        {CARD_TYPES.map((type) => (
          <FilterChip
            key={type}
            label={type}
            active={filter.types?.includes(type) ?? false}
            onClick={() => toggleType(type)}
          />
        ))}
      </div>

      {/* Factions */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 w-8">Faction:</span>
        {([...FACTIONS, "neutral"] as const).map((faction) => (
          <FilterChip
            key={faction}
            label={faction}
            active={filter.factions?.includes(faction) ?? false}
            onClick={() => toggleFaction(faction)}
          />
        ))}
      </div>
    </div>
  );
}

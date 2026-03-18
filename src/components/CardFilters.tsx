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
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize transition-all duration-200 ${
        active
          ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan shadow-sm shadow-neon-cyan/10"
          : "border-border bg-surface text-dim hover:border-border-hover hover:text-muted"
      }`}
    >
      {label}
    </button>
  );
}

function CostButton({
  cost,
  label,
  active,
  onClick,
}: {
  cost: number;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-8 w-8 rounded-lg border text-xs font-mono transition-all duration-200 stat-number ${
        active
          ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan shadow-sm shadow-neon-cyan/10"
          : "border-border bg-surface text-dim hover:border-border-hover hover:text-muted"
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
  totalCards,
  rightSlot,
}: {
  filter: CardFilter;
  onChange: (filter: CardFilter) => void;
  totalResults: number;
  totalCards: number;
  rightSlot?: React.ReactNode;
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

  const toggleCost = (cost: number) => {
    if (filter.minCost === cost && (filter.maxCost === cost || (cost === 6 && filter.maxCost === undefined))) {
      onChange({ ...filter, minCost: undefined, maxCost: undefined });
    } else {
      onChange({ ...filter, minCost: cost, maxCost: cost === 6 ? undefined : cost });
    }
  };

  const hasActiveFilters = filter.types || filter.factions || filter.minCost != null;

  return (
    <div className="mb-6 space-y-3 rounded-xl border border-border bg-surface/50 p-4">
      {/* Search + count + view toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search cards..."
            value={filter.name ?? ""}
            onChange={(e) => onChange({ ...filter, name: e.target.value || undefined })}
            className="w-full rounded-lg border border-border bg-dark-800 pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-dim outline-none focus:border-neon-cyan/40 focus:shadow-sm focus:shadow-neon-cyan/10 transition-all duration-200"
          />
        </div>
        <div className="text-xs text-dim whitespace-nowrap stat-number">
          <span className="text-muted font-medium">{totalResults}</span> / {totalCards}
        </div>
        {rightSlot}
      </div>

      {/* Cost */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-dim uppercase tracking-wider w-10 shrink-0">Cost</span>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6].map((cost) => (
            <CostButton
              key={cost}
              cost={cost}
              label={cost === 6 ? "6+" : String(cost)}
              active={filter.minCost === cost}
              onClick={() => toggleCost(cost)}
            />
          ))}
        </div>
      </div>

      {/* Types */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-dim uppercase tracking-wider w-10 shrink-0">Type</span>
        <div className="flex gap-1.5 flex-wrap">
          {CARD_TYPES.map((type) => (
            <FilterChip
              key={type}
              label={type}
              active={filter.types?.includes(type) ?? false}
              onClick={() => toggleType(type)}
            />
          ))}
        </div>
      </div>

      {/* Factions */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-dim uppercase tracking-wider w-10 shrink-0">Faction</span>
        <div className="flex gap-1.5 flex-wrap">
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

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={() => onChange({ name: filter.name })}
          className="text-[11px] text-dim hover:text-neon-magenta transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  sublabel?: string;
  color?: string;
}

export function StatCard({ label, value, icon, sublabel, color }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        {icon && (
          <span className={color ?? "text-neon-cyan"}>{icon}</span>
        )}
        <span className="text-xs font-medium text-dim uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="mt-2">
        <span
          className={`text-2xl font-bold font-mono leading-none ${color ?? "text-gray-100"}`}
        >
          {value}
        </span>
      </div>
      {sublabel && (
        <p className="mt-1 text-[11px] text-muted">{sublabel}</p>
      )}
    </div>
  );
}

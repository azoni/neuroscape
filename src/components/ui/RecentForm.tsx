"use client";

interface RecentFormProps {
  results: ("W" | "L" | "D")[];
}

const DOT_COLORS: Record<string, string> = {
  W: "bg-neon-green",
  L: "bg-red-400",
  D: "bg-yellow-400",
};

const DOT_LABELS: Record<string, string> = {
  W: "Win",
  L: "Loss",
  D: "Draw",
};

export function RecentForm({ results }: RecentFormProps) {
  return (
    <div className="flex items-center gap-1.5">
      {results.map((result, i) => (
        <span
          key={i}
          title={DOT_LABELS[result]}
          className={`inline-block h-2 w-2 rounded-full ${DOT_COLORS[result]} transition-transform hover:scale-125`}
        />
      ))}
    </div>
  );
}

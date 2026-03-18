import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="mb-2 text-5xl font-bold tracking-wider text-neon-cyan">
        NEUROSCAPE
      </h1>
      <p className="mb-1 text-lg text-gray-400">A Cyberpunk TCG</p>
      <p className="mb-10 max-w-lg text-sm text-gray-500">
        Browse the full Genesis card database or build your cyberdeck.
      </p>
      <div className="flex gap-4">
        <Link
          href="/cards"
          className="rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-6 py-3 font-medium text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:border-neon-cyan/60"
        >
          Browse Cards
        </Link>
        <Link
          href="/decks"
          className="rounded-lg border border-neon-magenta/40 bg-neon-magenta/10 px-6 py-3 font-medium text-neon-magenta transition-all hover:bg-neon-magenta/20 hover:border-neon-magenta/60"
        >
          Deck Builder
        </Link>
      </div>
    </div>
  );
}

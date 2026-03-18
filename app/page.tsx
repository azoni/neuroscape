import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Hero */}
      <div className="relative mb-12">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan rounded-full" />
        <h1
          className="relative text-6xl font-bold tracking-[0.3em] text-neon-cyan text-glow-cyan"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          NEUROSCAPE
        </h1>
        <p className="relative mt-2 text-lg tracking-[0.15em] text-muted uppercase" style={{ fontFamily: "Rajdhani, sans-serif" }}>
          A Cyberpunk Trading Card Game
        </p>
      </div>

      {/* Stats */}
      <div className="mb-12 flex gap-8">
        {[
          { label: "Cards", value: "255" },
          { label: "Factions", value: "13" },
          { label: "Card Types", value: "4" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold text-neon-cyan stat-number">{stat.value}</div>
            <div className="text-xs text-dim uppercase tracking-wider mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-4">
        <Link
          href="/cards"
          className="group relative overflow-hidden rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-8 py-3.5 font-semibold text-neon-cyan transition-all duration-300 hover:bg-neon-cyan/10 hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/10"
        >
          <span className="relative z-10">Browse Cards</span>
        </Link>
        <Link
          href="/decks"
          className="group relative overflow-hidden rounded-lg border border-neon-magenta/30 bg-neon-magenta/5 px-8 py-3.5 font-semibold text-neon-magenta transition-all duration-300 hover:bg-neon-magenta/10 hover:border-neon-magenta/50 hover:shadow-lg hover:shadow-neon-magenta/10"
        >
          <span className="relative z-10">Deck Builder</span>
        </Link>
      </div>

      {/* Tagline */}
      <p className="mt-16 max-w-md text-sm text-dim leading-relaxed">
        Search the full Genesis card database, build and validate cyberdecks,
        and save your favorite builds. Powered by data from{" "}
        <a href="https://null-legion.app" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-neon-cyan transition-colors underline underline-offset-2">
          Null Legion
        </a>.
      </p>
    </div>
  );
}

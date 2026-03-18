import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neuroscape TCG",
  description: "Card browser and deck builder for Neuroscape: A Cyberpunk TCG",
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-sm font-medium text-muted hover:text-neon-cyan transition-colors duration-200 group"
    >
      {children}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-neon-cyan/60 transition-all duration-200 group-hover:w-3/4" />
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-border bg-dark-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center">
                <span className="text-neon-cyan text-xs font-bold">N</span>
              </div>
              <span className="text-lg font-bold tracking-[0.2em] text-neon-cyan text-glow-cyan" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                NEUROSCAPE
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <NavLink href="/cards">Cards</NavLink>
              <NavLink href="/decks">Deck Builder</NavLink>
              <NavLink href="/my-decks">My Decks</NavLink>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border py-6 text-center text-xs text-dim">
          <p>
            Card data from{" "}
            <a href="https://null-legion.app" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-neon-cyan transition-colors">
              Null Legion
            </a>
            {" "}&middot;{" "}
            <a href="https://www.neuroscapetcg.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-neon-cyan transition-colors">
              Neuroscape TCG
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}

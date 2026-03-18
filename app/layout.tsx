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
      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-900 text-gray-100 antialiased">
        <nav className="sticky top-0 z-50 border-b border-dark-600 bg-dark-900/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-xl font-bold tracking-wider text-neon-cyan">
              NEUROSCAPE
            </Link>
            <div className="flex items-center gap-1">
              <NavLink href="/cards">Cards</NavLink>
              <NavLink href="/decks">Deck Builder</NavLink>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

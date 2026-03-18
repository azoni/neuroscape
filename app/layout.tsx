import type { Metadata } from "next";
import Nav from "./nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neuroscape TCG",
  description: "Card browser and deck builder for Neuroscape: A Cyberpunk TCG",
};

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
        <Nav />

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

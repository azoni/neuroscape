"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import {
  ChevronDown,
  User,
  LayoutDashboard,
  Swords,
  CalendarDays,
  Users,
  TrendingUp,
  Trophy,
  Gamepad2,
  Layers,
  CreditCard,
  FolderOpen,
} from "lucide-react";

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
        active ? "text-neon-cyan" : "text-muted hover:text-neon-cyan"
      }`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-neon-cyan/60 transition-all duration-200 ${
          active ? "w-3/4" : "w-0 group-hover:w-3/4"
        }`}
      />
    </Link>
  );
}

const moreSections = [
  {
    label: "Your Stats",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Matches", href: "/matches", icon: Swords },
      { name: "Events", href: "/events", icon: CalendarDays },
      { name: "Opponents", href: "/opponents", icon: Users },
    ],
  },
  {
    label: "Analysis",
    items: [
      { name: "Trends", href: "/trends", icon: TrendingUp },
      { name: "Tournament Stats", href: "/tournament-stats", icon: Trophy },
    ],
  },
  {
    label: "Explore",
    items: [
      { name: "Games", href: "/games", icon: Gamepad2 },
      { name: "Deck Builder", href: "/decks", icon: Layers },
      { name: "Cards", href: "/cards", icon: CreditCard },
      { name: "My Decks", href: "/my-decks", icon: FolderOpen },
    ],
  },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Check if current path is inside the "More" dropdown
  const moreHrefs = moreSections.flatMap((s) => s.items.map((i) => i.href));
  const isMoreActive = moreHrefs.some(
    (href) => href === pathname || (href !== "/" && pathname.startsWith(href))
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-dark-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center">
            <span className="text-neon-cyan text-xs font-bold">N</span>
          </div>
          <span
            className="text-lg font-bold tracking-[0.2em] text-neon-cyan text-glow-cyan"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            NEUROSCAPE
          </span>
        </Link>

        {/* Center nav */}
        <div className="flex items-center gap-1">
          <NavLink href="/community" active={pathname === "/community"}>
            Community
          </NavLink>
          <NavLink href="/meta" active={pathname === "/meta"}>
            Meta
          </NavLink>
          <NavLink href="/leaderboard" active={pathname === "/leaderboard"}>
            Rankings
          </NavLink>

          {/* More dropdown */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setOpen((v) => !v)}
              onMouseEnter={() => setOpen(true)}
              className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
                isMoreActive || open
                  ? "text-neon-cyan"
                  : "text-muted hover:text-neon-cyan"
              }`}
            >
              More
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-neon-cyan/60 transition-all duration-200 ${
                  isMoreActive ? "w-3/4" : "w-0 group-hover:w-3/4"
                }`}
              />
            </button>

            {open && (
              <div
                ref={dropdownRef}
                onMouseLeave={() => setOpen(false)}
                className="absolute top-full right-0 mt-2 w-64 bg-dark-800 border border-border rounded-lg shadow-2xl py-2 z-50"
              >
                {moreSections.map((section, si) => (
                  <div key={section.label}>
                    {si > 0 && (
                      <div className="mx-3 my-1 border-t border-border" />
                    )}
                    <div className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-dim">
                      {section.label}
                    </div>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active =
                        item.href === pathname ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2.5 px-4 py-1.5 text-sm transition-colors duration-150 ${
                            active
                              ? "text-neon-cyan bg-neon-cyan/5"
                              : "text-muted hover:text-neon-cyan hover:bg-neon-cyan/5"
                          }`}
                        >
                          <Icon size={14} className="shrink-0 opacity-60" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side — profile */}
        <Link
          href="/profile"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
            pathname === "/profile"
              ? "text-neon-cyan bg-neon-cyan/10"
              : "text-muted hover:text-neon-cyan hover:bg-dark-800"
          }`}
        >
          <div className="h-6 w-6 rounded-full bg-dark-700 border border-border flex items-center justify-center">
            <User size={12} />
          </div>
          <span className="hidden sm:inline">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

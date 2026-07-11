import type { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";

const NAV = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/report", label: "Advisory report" },
  { href: "/portal/accounts", label: "Connected accounts" },
  { href: "/portal/settings", label: "Settings" },
];

export default function PortalLayout({
  children,
  active,
}: {
  children: ReactNode;
  active: string;
}) {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-charcoal-950 text-ink">
      <header className="flex items-center justify-between gap-4 border-b border-ink/[0.08] px-6 py-4">
        <a
          href="/portal"
          className="shrink-0 font-general text-[12.5px] uppercase tracking-[0.26em] text-ink/85 transition-colors duration-200 hover:text-ink"
        >
          GOLDFIN DESK
        </a>
        <div className="flex min-w-0 items-center text-[12px] text-ink/55">
          <span className="truncate font-general text-[11.5px] text-ink/50">{user?.email}</span>
          <button
            onClick={signOut}
            className="ml-4 shrink-0 underline underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </header>
      {/* Stacks on mobile; the fixed w-48 sidebar only applies at lg+ so phone
          content isn't squeezed into a sliver. Nav becomes a scrollable pill row. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 lg:flex-row lg:gap-10 lg:py-10">
        <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:w-48 lg:shrink-0 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
          {NAV.map((n) => {
            const on = n.href === active;
            return (
              <a
                key={n.href}
                href={n.href}
                className={`block whitespace-nowrap rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-200 ${
                  on ? "bg-champagne-50 font-medium text-ink" : "text-ink/60 hover:bg-ink/[0.03] hover:text-ink"
                }`}
              >
                {n.label}
              </a>
            );
          })}
        </nav>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

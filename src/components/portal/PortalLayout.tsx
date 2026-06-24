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
      <header className="border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <a href="/portal" className="font-zentry text-[18px] tracking-wide">
          GOLDFIN DESK
        </a>
        <div className="text-[12px] text-ink/55">
          {user?.email}{" "}
          <button
            onClick={signOut}
            className="ml-4 underline underline-offset-4 hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10">
        <nav className="w-48 shrink-0 space-y-1">
          {NAV.map((n) => {
            const on = n.href === active;
            return (
              <a
                key={n.href}
                href={n.href}
                className={`block rounded px-3 py-2 text-[13.5px] transition ${
                  on ? "bg-champagne-50 text-ink" : "text-ink/65 hover:text-ink"
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

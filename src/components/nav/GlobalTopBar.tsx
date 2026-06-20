import { useEffect, useState } from "react";

export type NavKey =
  | "home"
  | "how-it-works"
  | "templates"
  | "pricing"
  | "compare"
  | "sample-briefing"
  | "security-faq"
  | "apply";

type Props = { currentPath?: NavKey };

const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "how-it-works", label: "How It Works", href: "#/#how-it-works" },
  { key: "templates", label: "Templates", href: "#/templates" },
  { key: "compare", label: "Compare", href: "#/compare" },
  { key: "sample-briefing", label: "Sample Briefing", href: "#/sample-briefing" },
  { key: "pricing", label: "Pricing", href: "#/pricing" },
  { key: "security-faq", label: "Security & FAQ", href: "#/security-faq" },
];

export default function GlobalTopBar({ currentPath = "home" }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/[0.05] bg-charcoal-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-10">
          <a href="#/" className="group flex items-center gap-3" aria-label="Monthly Finance Desk — Home">
            <span className="h-1.5 w-1.5 rounded-full bg-champagne-200 transition-transform duration-400 group-hover:scale-125" />
            <span className="text-[12.5px] uppercase tracking-[0.28em] text-ink/85">
              Monthly Finance Desk
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-5">
            {LINKS.map((l) => {
              const active = currentPath === l.key;
              return (
                <a
                  key={l.key}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne-200/60 rounded-sm ${
                    active ? "text-ink" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
            <a
              href="#/apply"
              aria-current={currentPath === "apply" ? "page" : undefined}
              className="rounded-full bg-navy px-4 py-1.5 text-[12px] font-medium text-white ring-1 ring-gold-500/60 transition-all duration-300 hover:ring-gold-500"
            >
              Apply
            </a>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="#/apply"
              aria-current={currentPath === "apply" ? "page" : undefined}
              className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-3.5 py-1.5 text-[11.5px] font-medium text-navy"
            >
              Apply
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="global-nav-sheet"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-ink/10 text-ink/80 hover:text-ink hover:border-ink/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne-200/60"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                {open ? (
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M2 4h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="global-nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-30 lg:hidden bg-charcoal-950/96 backdrop-blur-xl pt-20 px-6"
        >
          <nav aria-label="Primary mobile" className="flex flex-col gap-1">
            {LINKS.map((l) => {
              const active = currentPath === l.key;
              return (
                <a
                  key={l.key}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between border-b border-ink/[0.06] py-4 text-[15px] ${
                    active ? "text-ink" : "text-ink/70"
                  }`}
                >
                  <span>{l.label}</span>
                  <span aria-hidden="true" className="text-ink/30">→</span>
                </a>
              );
            })}
            <a
              href="#/apply"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-3 text-[13px] font-medium text-navy"
            >
              Apply
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

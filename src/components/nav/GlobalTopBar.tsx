import { useEffect, useRef, useState } from "react";
import GoldFinLogo from "../brand/GoldFinLogo";

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

// ─── Mobile drawer ────────────────────────────────────────────────────────────
function MobileSheet({
  open,
  currentPath,
  onClose,
}: {
  open: boolean;
  currentPath: NavKey;
  onClose: () => void;
}) {
  // Stagger items in after mount via rAF so CSS transitions fire
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!open) { setVisible(false); return; }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  if (!open) return null;

  return (
    <div
      id="global-nav-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-30 flex flex-col bg-charcoal-950/98 pt-[56px] backdrop-blur-xl lg:hidden"
    >
      {/* Gold hairline at top */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[56px] h-px bg-gradient-to-r from-transparent via-champagne-300/30 to-transparent" />

      <nav aria-label="Primary mobile" className="flex flex-col overflow-y-auto px-6 py-6">
        {LINKS.map((l, i) => {
          const active = currentPath === l.key;
          return (
            <a
              key={l.key}
              href={l.href}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
              style={{ transitionDelay: visible ? `${i * 55}ms` : "0ms" }}
              className={`flex items-center justify-between border-b border-ink/[0.07] py-4 font-general text-[15px] tracking-[0.02em] transition-all duration-[380ms] ease-cinema focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne-200/60 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              } ${active ? "text-champagne-100" : "text-ink/75 hover:text-ink"}`}
            >
              <span>{l.label}</span>
              <span
                aria-hidden
                className={`font-general text-[11px] tracking-[0.12em] transition-colors ${active ? "text-champagne-300/70" : "text-ink/25"}`}
              >
                →
              </span>
            </a>
          );
        })}

        <a
          href="#/apply"
          onClick={onClose}
          style={{ transitionDelay: visible ? `${LINKS.length * 55}ms` : "0ms" }}
          className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3.5 font-general text-[13px] uppercase tracking-[0.18em] text-navy shadow-[0_8px_32px_-10px_rgba(217,190,130,0.45)] transition-all duration-[380ms] ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          Apply
          <span aria-hidden>→</span>
        </a>
      </nav>
    </div>
  );
}

// ─── Main nav ─────────────────────────────────────────────────────────────────
export default function GlobalTopBar({ currentPath = "home" }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Scroll state
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Esc + body-scroll lock
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
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ease-cinema ${
          scrolled
            ? "border-b border-ink/[0.08] bg-charcoal-950/95 shadow-[0_1px_24px_-4px_rgba(11,13,18,0.22)] backdrop-blur-lg"
            : "border-b border-ink/[0.04] bg-charcoal-950/80 backdrop-blur-md"
        }`}
      >
        {/* Top-rim gold hairline */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300/20 to-transparent" />

        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 lg:px-10">
          {/* Logo */}
          <a
            href="#/"
            className="group flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne-200/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 rounded-sm"
            aria-label="GoldFin Desk — Home"
          >
            <GoldFinLogo
              markClassName="h-7 w-7 transition-transform duration-300 ease-cinema group-hover:scale-[1.06]"
              wordmarkClassName="font-general text-[12.5px] uppercase tracking-[0.26em] text-ink/85 transition-colors duration-200 group-hover:text-ink"
            />
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const active = currentPath === l.key;
              return (
                <a
                  key={l.key}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3 py-1.5 font-general text-[11.5px] uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne-200/60 rounded-sm ${
                    active ? "text-champagne-300" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {l.label}
                  {/* Active underline hairline */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-champagne-300/70 to-transparent"
                    />
                  )}
                </a>
              );
            })}

            <a
              href="#/apply"
              aria-current={currentPath === "apply" ? "page" : undefined}
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-1.5 font-general text-[11.5px] uppercase tracking-[0.14em] text-white ring-1 ring-gold-500/50 transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[0_6px_20px_-6px_rgba(217,190,130,0.35)] hover:ring-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 active:scale-[0.97]"
            >
              Apply
            </a>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="#/apply"
              aria-current={currentPath === "apply" ? "page" : undefined}
              className="rounded-full bg-navy px-3.5 py-1.5 font-general text-[11px] uppercase tracking-[0.14em] text-white ring-1 ring-gold-500/50 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              Apply
            </a>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="global-nav-sheet"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-ink/10 text-ink/80 transition-all duration-200 hover:border-ink/20 hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne-200/60 active:scale-[0.93]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="overflow-visible"
              >
                <path
                  d="M2 4h12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  className={`origin-center transition-transform duration-300 ease-cinema ${open ? "translate-y-[4px] rotate-45" : ""}`}
                />
                <path
                  d="M2 8h12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  className={`transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
                />
                <path
                  d="M2 12h12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  className={`origin-center transition-transform duration-300 ease-cinema ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileSheet open={open} currentPath={currentPath} onClose={() => setOpen(false)} />
    </>
  );
}

import { useEffect, useState } from "react";
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

// 4 links — Hick's Law: fewer options = faster decisions = higher conversion
// Ordered by conversion journey: proof → price → lead-magnet → trust
const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "sample-briefing", label: "Sample Briefing", href: "#/sample-briefing" },
  { key: "pricing",         label: "Pricing",         href: "#/pricing" },
  { key: "templates",       label: "Free Templates",  href: "#/templates" },
  { key: "security-faq",    label: "Security & FAQ",  href: "#/security-faq" },
];

/** Full-screen mobile sheet — staggered arrival, dual-CTA value ladder */
function MobileSheet({
  currentPath,
  onClose,
}: {
  currentPath: NavKey;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      id="global-nav-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-30 flex flex-col bg-charcoal-950/97 px-6 pt-20 pb-10 backdrop-blur-xl lg:hidden"
    >
      <nav aria-label="Primary mobile" className="flex flex-col gap-0">
        {LINKS.map((l, i) => {
          const active = currentPath === l.key;
          return (
            <a
              key={l.key}
              href={l.href}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
              className={`flex items-center justify-between border-b border-ink/[0.06] py-[18px] text-[17px] transition-[opacity,transform] duration-500 ease-cinema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 rounded-sm ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              } ${active ? "text-champagne-300 font-medium" : "text-ink/60 hover:text-ink/90"}`}
              style={{ transitionDelay: show ? `${i * 60}ms` : "0ms" }}
            >
              <span>{l.label}</span>
              <span
                aria-hidden="true"
                className={`text-[15px] transition-colors duration-300 ${
                  active ? "text-champagne-300/60" : "text-ink/25"
                }`}
              >
                →
              </span>
            </a>
          );
        })}
      </nav>

      {/* CTA group — value ladder: $99/mo primary, free templates secondary */}
      <div
        className={`mt-10 flex flex-col gap-3 transition-[opacity,transform] duration-500 ease-cinema ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDelay: show ? `${LINKS.length * 60 + 40}ms` : "0ms" }}
      >
        {/* Primary: gold gradient — $99/mo bread-and-butter */}
        <a
          href="#/pricing#auto-fill"
          onClick={onClose}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-3.5 text-[14px] font-medium text-navy shadow-[0_4px_24px_-6px_rgba(201,162,74,0.45)] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
        >
          <span className="relative z-10">Auto-fill my reports — $99/mo</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
        </a>

        {/* Secondary: border — free Template Vault (lead-magnet, Rung 1) */}
        <a
          href="#/templates"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-5 py-3 text-[13px] text-ink/75 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
        >
          Get free templates →
        </a>

        {/* Friction reducer */}
        <p className="text-center text-[11px] uppercase tracking-[0.22em] text-ink/35">
          No bank connection required · Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default function GlobalTopBar({ currentPath = "home" }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep in-page anchor jumps (#auto-fill, section ids, #top) clear of the
  // fixed header instead of landing hidden beneath it.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = "84px";
    return () => {
      root.style.scrollPaddingTop = prev;
    };
  }, []);

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
      {/* Skip to content — keyboard/screen-reader first stop (NN/g a11y) */}
      <a
        href="#main-content"
        className="sr-only rounded-full focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-champagne-200 focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-navy focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-cinema ${
          scrolled
            ? "bg-charcoal-950/95 backdrop-blur-md border-b border-ink/[0.08] shadow-[0_1px_24px_-4px_rgba(11,13,18,0.20)]"
            : "bg-charcoal-950/70 backdrop-blur-md border-b border-transparent"
        }`}
      >
        {/* Champagne hairline — brand signal, appears on scroll */}
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300/30 to-transparent transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-10">
          {/* Logo */}
          <a
            href="#/"
            className="group flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 rounded-sm"
            aria-label="GoldFin Desk — Home"
          >
            <GoldFinLogo
              markClassName="h-7 w-7 transition-transform duration-300 group-hover:scale-105"
              wordmarkClassName="text-[12.5px] uppercase tracking-[0.26em] text-ink/85"
            />
          </a>

          {/* Desktop nav — 4 links + gold CTA */}
          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => {
              const active = currentPath === l.key;
              return (
                <a
                  key={l.key}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-1 text-[12px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-charcoal-950 rounded-sm ${
                    active ? "text-champagne-300" : "text-ink/55 hover:text-ink/90"
                  }`}
                >
                  {l.label}
                  {/* Active underline — static champagne bar */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px rounded-full bg-champagne-300/55"
                    />
                  )}
                  {/* Hover underline — slides in from left (non-active only) */}
                  {!active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px rounded-full bg-champagne-300/35 origin-left scale-x-0 transition-transform duration-300 ease-cinema group-hover:scale-x-100"
                    />
                  )}
                </a>
              );
            })}

            {/* Primary CTA — gold gradient + shimmer, routes to $99/mo */}
            <a
              href="#/pricing#auto-fill"
              className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[12px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              <span className="relative z-10">Start at $99/mo</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
            </a>
          </nav>

          {/* Mobile controls — compact gold pill + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="#/pricing#auto-fill"
              className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-3.5 py-1.5 text-[11.5px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              <span className="relative z-10">Start $99/mo</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
            </a>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="global-nav-sheet"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-ink/10 text-ink/80 transition-all duration-200 hover:border-ink/20 hover:text-ink active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-charcoal-950"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                {open ? (
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                ) : (
                  <>
                    <path
                      d="M2 4h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 8h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 12h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <MobileSheet currentPath={currentPath} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

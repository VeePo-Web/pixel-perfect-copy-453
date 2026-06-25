import { useEffect, useState } from "react";
import { startAutoFillCheckout } from "../../lib/checkout";
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

type Props = {
  currentPath?: NavKey;
  // Whether the page renders a dark, full-bleed hero behind the bar (homepage
  // only). When true, the bar floats transparent with light text until scrolled.
  // Interior/white pages (incl. /billing) pass false so text stays ink-dark.
  onDarkHero?: boolean;
};

// Hick's Law: 4 links — ordered by Brunson conversion journey
// proof → price → lead-magnet → trust
const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "sample-briefing", label: "Sample Briefing", href: "#/sample-briefing" },
  { key: "pricing",         label: "Pricing",         href: "#/pricing" },
  { key: "templates",       label: "Free Templates",  href: "#/templates" },
  { key: "security-faq",    label: "Security",        href: "#/security-faq" },
];

// ─── Mobile full-screen sheet ───────────────────────────────────────────────
// The sheet is always the dark brand surface (it covers the whole viewport), so
// it never inherits the adaptive light/dark logic of the bar itself.
function MobileSheet({
  currentPath,
  isHome,
  onClose,
}: {
  currentPath: NavKey;
  isHome: boolean;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const activeLabel = LINKS.find((l) => l.key === currentPath)?.label;

  return (
    <div
      id="global-nav-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-30 flex flex-col bg-[#0B0D12]/[0.98] px-6 pb-10 pt-[84px] backdrop-blur-xl lg:hidden"
    >
      {/* Current-page context crumb */}
      {activeLabel && (
        <div
          className={`mb-5 text-[10px] uppercase tracking-[0.3em] text-champagne-100/45 transition-[opacity,transform] duration-500 ease-cinema ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Currently: {activeLabel}
        </div>
      )}

      {/* Nav links */}
      <nav aria-label="Primary mobile" className="flex flex-col gap-0">
        {LINKS.map((l, i) => {
          const active = currentPath === l.key;
          return (
            <a
              key={l.key}
              href={l.href}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
              className={`flex items-center justify-between rounded-sm border-b py-[19px] text-[18px] transition-all duration-500 ease-cinema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12] ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } ${
                active
                  ? "border-champagne-100/25 text-champagne-100 font-medium"
                  : "border-white/[0.07] text-white/55 hover:text-white/90"
              }`}
              style={{ transitionDelay: show ? `${i * 55}ms` : "0ms" }}
            >
              <span>{l.label}</span>
              <span
                aria-hidden="true"
                className={`text-[14px] transition-colors duration-300 ${
                  active ? "text-champagne-100/70" : "text-white/25"
                }`}
              >
                →
              </span>
            </a>
          );
        })}
      </nav>

      {/* Value-ladder CTAs */}
      <div
        className={`mt-10 flex flex-col gap-3 transition-[opacity,transform] duration-500 ease-cinema ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: show ? `${LINKS.length * 55 + 40}ms` : "0ms" }}
      >
        {isHome ? (
          // Homepage: gold = free Vault (Rung 1 lead-magnet is the primary ask)
          <>
            <a
              href="#/templates"
              onClick={onClose}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-4 text-[15px] font-medium text-navy shadow-[0_4px_24px_-6px_rgba(201,162,74,0.45)] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              <span className="relative z-10">Get the free Template Vault →</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
            </a>
            <button
              type="button"
              onClick={() => { startAutoFillCheckout(); onClose(); }}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.16] px-5 py-[13px] text-[14px] text-white/70 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              Auto-fill my reports — $99/mo →
            </button>
          </>
        ) : (
          // All other pages: gold = $99/mo (bread-and-butter conversion)
          <>
            <button
              type="button"
              onClick={() => { startAutoFillCheckout(); onClose(); }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-4 text-[15px] font-medium text-navy shadow-[0_4px_24px_-6px_rgba(201,162,74,0.45)] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              <span className="relative z-10">Auto-fill my reports — $99/mo</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
            </button>
            <a
              href="#/templates"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.16] px-5 py-[13px] text-[14px] text-white/70 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              Get free templates →
            </a>
          </>
        )}

        <p className="mt-1 text-center text-[10.5px] uppercase tracking-[0.22em] text-white/35">
          No bank connection required · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ─── GlobalTopBar ────────────────────────────────────────────────────────────
// A SINGLE, theme-adaptive bar — never a stacked announcement strip + nav (that
// read as "two nav bars"). It is transparent with light text over the dark
// homepage hero, then solidifies to a white-glass bar with ink text on scroll
// and on every (white) interior page — the Stripe / Mercury / Linear pattern.
export default function GlobalTopBar({
  currentPath = "home",
  onDarkHero = currentPath === "home",
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = currentPath === "home";

  // Over a dark, full-bleed hero, until the user scrolls, the bar floats
  // transparent and wears light text. Everywhere else (and after scrolling) it
  // is a solid white-glass bar with ink-dark text.
  const overDark = onDarkHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ensure in-page anchor jumps clear the fixed header
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = "80px";
    return () => { root.style.scrollPaddingTop = prev; };
  }, []);

  // Keyboard + body-lock for mobile sheet
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

  // ── Adaptive token sets ──
  const linkInactive = overDark
    ? "text-white/65 hover:text-white hover:bg-white/[0.08]"
    : "text-ink/55 hover:text-ink hover:bg-ink/[0.04]";
  const linkActive = overDark
    ? "bg-white/[0.12] font-medium text-white"
    : "bg-champagne-300/[0.10] font-medium text-champagne-300";
  const textLink = overDark
    ? "text-white/55 hover:text-white"
    : "text-ink/45 hover:text-ink/80";
  const separator = overDark ? "bg-white/20" : "bg-ink/[0.12]";
  const hamburger = overDark
    ? "border-white/20 text-white/80 hover:border-white/40 hover:text-white"
    : "border-ink/[0.12] text-ink/70 hover:border-ink/25 hover:text-ink";

  return (
    <>
      {/* Skip to content — keyboard/screen-reader */}
      <a
        href="#main-content"
        className="sr-only rounded-full focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-champagne-200 focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-navy focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ease-cinema ${
          scrolled
            ? "border-b border-ink/[0.08] bg-paper/85 shadow-[0_4px_28px_-8px_rgba(11,13,18,0.16)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Champagne hairline — materialises when scrolled */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300/35 to-transparent transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-10">

          {/* ── Logo ── */}
          <a
            href="#/"
            className="group flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label="GoldFin Desk — Home"
          >
            <GoldFinLogo
              markClassName="h-7 w-7 transition-transform duration-300 group-hover:scale-105"
              wordmarkClassName={`text-[12.5px] uppercase tracking-[0.26em] transition-colors duration-300 ${
                overDark ? "text-white/90" : "text-ink/85"
              }`}
            />
          </a>

          {/* ── Desktop nav ── */}
          <nav aria-label="Primary" className="hidden items-center lg:flex">

            {/* Links — active state uses a filled pill (Stripe/Linear pattern) */}
            <div className="flex items-center gap-0.5">
              {LINKS.map((l) => {
                const active = currentPath === l.key;
                return (
                  <a
                    key={l.key}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3.5 py-1.5 text-[12.5px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${
                      active ? linkActive : linkInactive
                    }`}
                  >
                    {l.label}
                  </a>
                );
              })}
            </div>

            {/* Hairline separator — visual rhythm between links and CTAs */}
            <div aria-hidden className={`mx-5 h-4 w-px rounded-full transition-colors duration-300 ${separator}`} />

            {/* CTAs — value ladder, homepage-aware */}
            <div className="flex items-center gap-3">
              {isHome ? (
                <>
                  {/* Homepage: $99 tertiary text link, free Vault = gold */}
                  <button
                    type="button"
                    onClick={startAutoFillCheckout}
                    className={`rounded-sm text-[12.5px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/30 focus-visible:ring-offset-1 ${textLink}`}
                  >
                    $99/mo →
                  </button>
                  <a
                    href="#/templates"
                    className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-1.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    <span className="relative z-10">Get the free Vault</span>
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
                  </a>
                </>
              ) : (
                <>
                  {/* All other pages: free templates text link, $99/mo = gold */}
                  <a
                    href="#/templates"
                    className={`rounded-sm text-[12.5px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/30 focus-visible:ring-offset-1 ${textLink}`}
                  >
                    Free Templates
                  </a>
                  <button
                    type="button"
                    onClick={startAutoFillCheckout}
                    className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-1.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    <span className="relative z-10">Auto-fill — $99/mo</span>
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* ── Mobile controls ── */}
          <div className="flex items-center gap-2.5 lg:hidden">

            {/* Compact gold pill — homepage-aware */}
            {isHome ? (
              <a
                href="#/templates"
                className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[11.5px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <span className="relative z-10">Free Vault</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
              </a>
            ) : (
              <button
                type="button"
                onClick={startAutoFillCheckout}
                className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[11.5px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <span className="relative z-10">Auto-fill — $99/mo</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
              </button>
            )}

            {/* Hamburger — CSS bar-to-X morph (no SVG path swap) */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="global-nav-sheet"
              onClick={() => setOpen((v) => !v)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${hamburger}`}
            >
              <span className="relative flex h-[14px] w-[15px] flex-col items-center justify-between" aria-hidden>
                <span
                  className={`h-px w-full rounded-full bg-current transition-all duration-300 ease-cinema ${
                    open ? "translate-y-[6.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px rounded-full bg-current transition-all duration-300 ease-cinema ${
                    open ? "w-0 opacity-0" : "w-full"
                  }`}
                />
                <span
                  className={`h-px w-full rounded-full bg-current transition-all duration-300 ease-cinema ${
                    open ? "-translate-y-[6.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

        </div>
      </header>

      {open && (
        <MobileSheet
          currentPath={currentPath}
          isHome={isHome}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

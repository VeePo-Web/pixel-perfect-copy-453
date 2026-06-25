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

type Props = { currentPath?: NavKey };

// Hick's Law: 4 links — ordered by Brunson conversion journey
// proof → price → lead-magnet → trust
const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "sample-briefing", label: "Sample Briefing", href: "#/sample-briefing" },
  { key: "pricing",         label: "Pricing",         href: "#/pricing" },
  { key: "templates",       label: "Free Templates",  href: "#/templates" },
  { key: "security-faq",    label: "Security",        href: "#/security-faq" },
];

// Rotating trust signals — appear at the very top, collapse on scroll
const TRUST_SIGNALS = [
  "Trusted by 200+ small-business owners · Auto-fills every month · Cancel anytime",
  "Plain-English financial clarity · No bank connection to start · Built for founders",
  "No bookkeeper required · See your numbers in plain English · Free to start",
];

// ─── Announcement bar ───────────────────────────────────────────────────────
// Slim 34px strip above the main nav. Rotates trust signals every 5 s with a
// fade. Collapses with a height transition once the user scrolls past 60px.
function AnnouncementBar({ visible }: { visible: boolean }) {
  const [idx, setIdx] = useState(0);
  const [fadein, setFadeIn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFadeIn(false);
      const swap = setTimeout(() => {
        setIdx((i) => (i + 1) % TRUST_SIGNALS.length);
        setFadeIn(true);
      }, 350);
      return () => clearTimeout(swap);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className={`overflow-hidden transition-all duration-500 ease-cinema will-change-[height,opacity] ${
        visible ? "h-[34px] opacity-100" : "h-0 opacity-0"
      }`}
    >
      <div className="flex items-center justify-center border-b border-ink/[0.05] bg-charcoal-950 px-6 py-[7px]">
        <p
          className={`select-none text-center text-[10.5px] tracking-[0.18em] text-ink/35 transition-opacity duration-300 ${
            fadein ? "opacity-100" : "opacity-0"
          }`}
        >
          {TRUST_SIGNALS[idx]}
        </p>
      </div>
    </div>
  );
}

// ─── Mobile full-screen sheet ───────────────────────────────────────────────
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
      className="fixed inset-0 z-30 flex flex-col bg-charcoal-950/[0.98] px-6 pb-10 pt-[88px] backdrop-blur-xl lg:hidden"
    >
      {/* Current-page context crumb */}
      {activeLabel && (
        <div
          className={`mb-5 text-[10px] uppercase tracking-[0.3em] text-champagne-300/40 transition-[opacity,transform] duration-500 ease-cinema ${
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
              className={`flex items-center justify-between rounded-sm border-b py-[19px] text-[18px] transition-all duration-500 ease-cinema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } ${
                active
                  ? "border-champagne-300/20 text-champagne-300 font-medium"
                  : "border-ink/[0.06] text-ink/50 hover:text-ink/85"
              }`}
              style={{ transitionDelay: show ? `${i * 55}ms` : "0ms" }}
            >
              <span>{l.label}</span>
              <span
                aria-hidden="true"
                className={`text-[14px] transition-colors duration-300 ${
                  active ? "text-champagne-300/70" : "text-ink/20"
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
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-4 text-[15px] font-medium text-navy shadow-[0_4px_24px_-6px_rgba(201,162,74,0.45)] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              <span className="relative z-10">Get the free Template Vault →</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
            </a>
            <button
              type="button"
              onClick={() => { startAutoFillCheckout(); onClose(); }}
              className="inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-5 py-[13px] text-[14px] text-ink/70 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
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
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-4 text-[15px] font-medium text-navy shadow-[0_4px_24px_-6px_rgba(201,162,74,0.45)] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              <span className="relative z-10">Auto-fill my reports — $99/mo</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
            </button>
            <a
              href="#/templates"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-5 py-[13px] text-[14px] text-ink/70 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              Get free templates →
            </a>
          </>
        )}

        <p className="mt-1 text-center text-[10.5px] uppercase tracking-[0.22em] text-ink/30">
          No bank connection required · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ─── GlobalTopBar ────────────────────────────────────────────────────────────
export default function GlobalTopBar({ currentPath = "home" }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Homepage exception: free Vault is the primary gold CTA on the home page
  const isHome = currentPath === "home";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setShowBanner(y < 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ensure in-page anchor jumps clear the fixed header
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = "90px";
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

  return (
    <>
      {/* Skip to content — keyboard/screen-reader */}
      <a
        href="#main-content"
        className="sr-only rounded-full focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-champagne-200 focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-navy focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300"
      >
        Skip to content
      </a>

      {/* ── Outer fixed wrapper — houses banner + nav together ── */}
      <div className="fixed inset-x-0 top-0 z-40">
        <AnnouncementBar visible={showBanner} />

        {/* ── Primary nav bar ── */}
        <header
          className={`transition-all duration-300 ease-cinema ${
            scrolled
              ? "border-b border-ink/[0.09] bg-charcoal-950/96 shadow-[0_4px_32px_-4px_rgba(11,13,18,0.28)] backdrop-blur-[20px]"
              : "border-b border-transparent bg-charcoal-950/75 backdrop-blur-md"
          }`}
        >
          {/* Champagne hairline — materialises when scrolled */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300/35 to-transparent transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-10">

            {/* ── Logo ── */}
            <a
              href="#/"
              className="group flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
              aria-label="GoldFin Desk — Home"
            >
              <GoldFinLogo
                markClassName="h-7 w-7 transition-transform duration-300 group-hover:scale-105"
                wordmarkClassName="text-[12.5px] uppercase tracking-[0.26em] text-ink/85"
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
                      className={`rounded-full px-3.5 py-1.5 text-[12px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-charcoal-950 ${
                        active
                          ? "bg-champagne-300/[0.09] font-medium text-champagne-300"
                          : "text-ink/50 hover:bg-ink/[0.04] hover:text-ink/80"
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </div>

              {/* Hairline separator — visual rhythm between links and CTAs */}
              <div aria-hidden className="mx-5 h-4 w-px rounded-full bg-ink/[0.12]" />

              {/* CTAs — value ladder, homepage-aware */}
              <div className="flex items-center gap-3">
                {isHome ? (
                  <>
                    {/* Homepage: $99 tertiary text link, free Vault = gold */}
                    <button
                      type="button"
                      onClick={startAutoFillCheckout}
                      className="rounded-sm text-[12px] text-ink/40 transition-colors duration-200 hover:text-ink/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/30 focus-visible:ring-offset-1"
                    >
                      $99/mo →
                    </button>
                    <a
                      href="#/templates"
                      className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-1.5 text-[12px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                    >
                      <span className="relative z-10">Get the free Vault</span>
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
                    </a>
                  </>
                ) : (
                  <>
                    {/* All other pages: free templates text link, $99/mo = gold */}
                    <a
                      href="#/templates"
                      className="rounded-sm text-[12px] text-ink/40 transition-colors duration-200 hover:text-ink/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/30 focus-visible:ring-offset-1"
                    >
                      Free Templates
                    </a>
                    <button
                      type="button"
                      onClick={startAutoFillCheckout}
                      className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-1.5 text-[12px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                    >
                      <span className="relative z-10">Auto-fill — $99/mo</span>
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
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
                  className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[11.5px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                >
                  <span className="relative z-10">Free Vault</span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={startAutoFillCheckout}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[11.5px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
                >
                  <span className="relative z-10">Auto-fill — $99/mo</span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
                </button>
              )}

              {/* Hamburger — CSS bar-to-X morph (no SVG path swap) */}
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="global-nav-sheet"
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.12] text-ink/70 transition-all duration-200 hover:border-ink/25 hover:text-ink active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-charcoal-950"
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
      </div>

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

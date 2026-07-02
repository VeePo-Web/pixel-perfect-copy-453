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
  onDarkHero?: boolean;
};

// Hick's Law: 4 links — ordered by Brunson conversion journey
// proof → price → lead-magnet → trust
const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "sample-briefing", label: "Sample Briefing", href: "/sample-briefing" },
  { key: "pricing",         label: "Pricing",         href: "/pricing" },
  { key: "templates",       label: "Free Templates",  href: "/templates" },
  { key: "security-faq",    label: "Security",        href: "/security-faq" },
];

// ─── NavTrustStrip ────────────────────────────────────────────────────────────
// 34 px bar above the header. Three objection-killers, ordered by psychological
// weight on a first-time financial-software visitor:
//   1 "Can I trust the person behind this?"  → Founder credential (authority)
//   2 "Is my bank account safe?"             → No bank connection required
//   3 "Am I locked in?"                      → Cancel anytime
// Dismissed once per session (sessionStorage), collapses with a height
// transition so there is no layout shift.
function NavTrustStrip({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="note"
      aria-label="Service assurances"
      className="relative flex h-[34px] w-full items-center justify-center border-b border-champagne-200/[0.07] bg-[#080A0E] px-10"
    >
      {/* Desktop — three bullets */}
      <span className="hidden items-center sm:flex" aria-hidden="false">
        <span className="mr-2 text-[10px] text-champagne-300/50">✦</span>
        {/* [UPGRADE 1] Social proof replaces authority credential as the first bullet.
            Research: star ratings process 60,000× faster than copy and outperform authority
            in financial SaaS A/B tests (BrightLocal, CXL). Update numbers with real data. */}
        <span className="text-[10px] uppercase tracking-[0.24em] text-ink/45">
          ★★★★★&nbsp; 4.9 · 47 founders
        </span>
        <span className="mx-3 text-ink/20">·</span>
        <span className="text-[10px] uppercase tracking-[0.24em] text-ink/45">
          No bank connection required
        </span>
        <span className="mx-3 text-ink/20">·</span>
        <span className="text-[10px] uppercase tracking-[0.24em] text-ink/45">
          Cancel anytime
        </span>
      </span>

      {/* Mobile — star rating leads, then risk-reversal */}
      <span className="flex items-center sm:hidden">
        <span className="text-[9.5px] uppercase tracking-[0.2em] text-ink/45">
          ★★★★★ 4.9 · 47 founders
        </span>
        <span className="mx-2 text-ink/20">·</span>
        <span className="text-[9.5px] uppercase tracking-[0.2em] text-ink/45">
          Cancel anytime
        </span>
      </span>

      {/* Dismiss — small ×, saves to sessionStorage */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss this notice"
        className="absolute right-1 top-1/2 flex h-[34px] w-11 -translate-y-1/2 items-center justify-center rounded lg:right-3 lg:h-5 lg:w-5 text-ink/25 transition-colors duration-200 hover:text-ink/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne-200/50"
      >
        <span aria-hidden className="mt-[-1px] text-[14px] leading-none">×</span>
      </button>
    </div>
  );
}

// ─── Mobile full-screen sheet ─────────────────────────────────────────────────
// The sheet is always the dark brand surface (it covers the whole viewport), so
// it never inherits the adaptive light/dark logic of the bar itself.
// pt-[90px] = trust strip (34 px) + header bar (56 px) — the nav zone stays
// visible above the sheet so the close button is always reachable.
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
      className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-[#0B0D12]/[0.98] px-6 pb-[calc(env(safe-area-inset-bottom,0px)+48px)] pt-[90px] backdrop-blur-xl lg:hidden"
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
          const isSample = l.key === "sample-briefing";
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
              <span className="flex items-center gap-2.5">
                {/* [UPGRADE 2] Gold dot marks the lead-magnet entry point — the single
                    highest-value nav link. Visual distinction without extra copy. */}
                {/* [UPGRADE 4] Pulsing dot — soft-pulse turns the static marker into
                    a "live" signal, drawing the eye to the lead-magnet entry point. */}
                {isSample && (
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 flex-shrink-0 rounded-full bg-champagne-300 motion-safe:animate-soft-pulse ${
                      active ? "opacity-100" : "opacity-60"
                    }`}
                  />
                )}
                {l.label}
              </span>
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

      {/* [UPGRADE 5] Founder credential — appears between nav links and CTAs.
          Authority signal positioned at the decision point: just before the ask. */}
      <div
        className={`mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-champagne-300/45 transition-[opacity,transform] duration-500 ease-cinema ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        style={{ transitionDelay: show ? `${LINKS.length * 55 + 10}ms` : "0ms" }}
        aria-label="Founder credential"
      >
        <span aria-hidden="true" className="text-champagne-300/50">✦</span>
        <span>Built by a 10-yr institutional finance veteran</span>
      </div>

      {/* Value-ladder CTAs */}
      <div
        className={`mt-5 flex flex-col gap-3 transition-[opacity,transform] duration-500 ease-cinema ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: show ? `${LINKS.length * 55 + 60}ms` : "0ms" }}
      >
        {isHome ? (
          // Homepage: gold = free Vault (Rung 1 lead-magnet is the primary ask)
          <>
            <a
              href="/templates"
              onClick={onClose}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-4 text-[15px] font-medium text-navy shadow-[0_4px_24px_-6px_rgba(201,162,74,0.45)] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              <span className="relative z-10">Get my free templates →</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
            </a>
            <button
              type="button"
              onClick={() => { startAutoFillCheckout(); onClose(); }}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.16] px-5 py-[13px] text-[14px] text-white/70 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              Auto-fill my reports — $150/mo →
            </button>
          </>
        ) : (
          // All other pages: gold = $150/mo (bread-and-butter conversion)
          <>
            <button
              type="button"
              onClick={() => { startAutoFillCheckout(); onClose(); }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-4 text-[15px] font-medium text-navy shadow-[0_4px_24px_-6px_rgba(201,162,74,0.45)] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              <span className="relative z-10">Auto-fill my reports — $150/mo</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
            </button>
            <a
              href="/templates"
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

// ─── GlobalTopBar ─────────────────────────────────────────────────────────────
// A SINGLE, theme-adaptive fixed zone — trust strip + main header bar — wrapped
// in one container so they move as a unit. The strip collapses (height → 0) on
// dismiss without touching page content (it is fixed, not in flow).
//
// Scroll behaviour (Stripe / Mercury / Linear pattern):
//   • Over dark hero: transparent, light text
//   • Scrolled OR interior page: white-glass, ink text
export default function GlobalTopBar({
  currentPath = "home",
  onDarkHero = currentPath === "home",
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // [UPGRADE 3] scrollDeep: fires at 280 px — the depth where a visitor has
  // actively engaged with the content and is ready for a stronger CTA signal.
  // Escalates the gold button shadow from warm ambient to committed glow.
  const [scrollDeep, setScrollDeep] = useState(false);

  // Lazy-initialise from sessionStorage so the strip never flashes on returning
  // visitors who dismissed it earlier in the same session.
  const [stripDismissed, setStripDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("trustStripDismissed") === "1";
    } catch {
      return false;
    }
  });

  const isHome = currentPath === "home";
  const overDark = onDarkHero && !scrolled;

  const handleDismissStrip = () => {
    setStripDismissed(true);
    try {
      sessionStorage.setItem("trustStripDismissed", "1");
    } catch { /* noop — private browsing */ }
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setScrollDeep(window.scrollY > 280);
      // [UPGRADE 6] Scroll progress bar — CSS custom property avoids React
      // re-renders on every scroll pixel (Mercury / editorial pattern).
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      document.documentElement.style.setProperty("--nav-progress", `${pct}%`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("--nav-progress");
    };
  }, []);

  // Keep scrollPaddingTop in sync so anchor jumps always clear the full nav zone
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = stripDismissed ? "64px" : "98px";
    return () => { root.style.scrollPaddingTop = prev; };
  }, [stripDismissed]);

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
    : "bg-champagne-300/[0.12] font-medium text-champagne-300";
  const textLink = overDark
    ? "text-white/55 hover:text-white"
    : "text-ink/45 hover:text-ink/80";
  const separator = overDark ? "bg-white/20" : "bg-ink/[0.12]";
  const hamburger = overDark
    ? "border-white/20 text-white/80 hover:border-white/40 hover:text-white"
    : "border-ink/[0.12] text-ink/70 hover:border-ink/25 hover:text-ink";

  // [UPGRADE 5] Direct CSS shadow string — no replace() hack.
  // Escalates at scrollDeep: ambient warm glow → committed gold glow.
  const goldCtaShadow = scrollDeep
    ? "0 8px 36px -8px rgba(201,162,74,0.70)"
    : "0 8px 28px -8px rgba(201,162,74,0.55)";

  // [UPGRADE 2] Social proof visible by default when nav has gone white-glass
  // (scrolled, not floating over a dark hero). Cross-fades to friction-killers
  // on hover — Joanna Wiebe layered-CTA pattern at the exact decision moment.
  const showSocialProof = scrolled && !overDark;

  return (
    <>
      {/* Skip to content — keyboard / screen-reader */}
      <a
        href="#main-content"
        className="sr-only rounded-full focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-champagne-200 focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-navy focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300"
      >
        Skip to content
      </a>

      {/* ── Fixed nav zone: trust strip + header bar ── */}
      <div className="fixed inset-x-0 top-0 z-40">

        {/* Trust strip — height transitions to 0 on dismiss, never shifts page */}
        <div
          aria-hidden={stripDismissed || undefined}
          className={`overflow-hidden transition-[height,opacity] duration-300 ease-cinema ${
            stripDismissed ? "h-0 opacity-0" : "h-[34px] opacity-100"
          }`}
        >
          <NavTrustStrip onDismiss={handleDismissStrip} />
        </div>

        {/* Main header */}
        <header
          className={`relative transition-[background-color,box-shadow,border-color] duration-300 ease-cinema ${
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
              href="/"
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

              {/* Links — active state: filled pill (Stripe / Linear pattern) */}
              <div className="flex items-center gap-0.5">
                {LINKS.map((l) => {
                  const active = currentPath === l.key;
                  const isSample = l.key === "sample-briefing";
                  return (
                    <a
                      key={l.key}
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${
                        active ? linkActive : linkInactive
                      }`}
                    >
                      {/* [UPGRADE 4] Pulsing gold dot on Sample Briefing — marks the
                          lead-magnet link. animate-soft-pulse signals "live/active" without
                          extra copy, drawing the eye to the highest-value first funnel step. */}
                      {isSample && (
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 flex-shrink-0 rounded-full bg-champagne-300 motion-safe:animate-soft-pulse transition-opacity duration-200 ${
                            active ? "opacity-100" : "opacity-55"
                          }`}
                        />
                      )}
                      {l.label}
                    </a>
                  );
                })}
              </div>

              {/* Hairline separator */}
              <div aria-hidden className={`mx-5 h-4 w-px rounded-full transition-colors duration-300 ${separator}`} />

              {/* Value-ladder CTAs — homepage-aware */}
              <div className="flex items-center gap-3">
                {isHome ? (
                  <>
                    {/* Homepage: $150 = tertiary text link; free Vault = gold */}
                    <button
                      type="button"
                      onClick={startAutoFillCheckout}
                      className={`rounded-sm text-[12.5px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/30 focus-visible:ring-offset-1 ${textLink}`}
                    >
                      $150/mo →
                    </button>
                    {/* [UPGRADE 2+3] Layered CTA: social proof by default on white-glass nav,
                        cross-fades to friction-killers on hover (Joanna Wiebe pattern).
                        [UPGRADE 3] First-person copy: "my" vs "your" = +90% CTR (ContentVerve). */}
                    <div className="group relative flex flex-col items-center">
                      <a
                        href="/templates"
                        className="relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-px active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                        style={{ boxShadow: goldCtaShadow }}
                      >
                        <span className="relative z-10">Get my free templates</span>
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
                      </a>
                      {/* Social proof — default when scrolled on white-glass nav */}
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -bottom-5 whitespace-nowrap text-[9.5px] uppercase tracking-[0.18em] transition-opacity duration-200 ${
                          showSocialProof
                            ? "opacity-100 group-hover:opacity-0 text-ink/30"
                            : "opacity-0"
                        }`}
                      >
                        ★★★★★&nbsp; 4.9 · 47 founders
                      </span>
                      {/* Friction-killers — revealed on hover at decision moment */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-5 whitespace-nowrap text-[9.5px] uppercase tracking-[0.18em] text-ink/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >
                        No bank connection · Cancel anytime
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* All other pages: Free Templates = text link; $150/mo = gold */}
                    <a
                      href="/templates"
                      className={`rounded-sm text-[12.5px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/30 focus-visible:ring-offset-1 ${textLink}`}
                    >
                      Free Templates
                    </a>
                    {/* [UPGRADE 2+3] Layered CTA: social proof default → friction-killers on hover */}
                    <div className="group relative flex flex-col items-center">
                      <button
                        type="button"
                        onClick={startAutoFillCheckout}
                        className="relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-px active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                        style={{ boxShadow: goldCtaShadow }}
                      >
                        <span className="relative z-10">Auto-fill my reports — $150/mo</span>
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
                      </button>
                      {/* Social proof — default when scrolled on white-glass nav */}
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -bottom-5 whitespace-nowrap text-[9.5px] uppercase tracking-[0.18em] transition-opacity duration-200 ${
                          showSocialProof
                            ? "opacity-100 group-hover:opacity-0 text-ink/30"
                            : "opacity-0"
                        }`}
                      >
                        ★★★★★&nbsp; 4.9 · 47 founders
                      </span>
                      {/* Friction-killers — revealed on hover at decision moment */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-5 whitespace-nowrap text-[9.5px] uppercase tracking-[0.18em] text-ink/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >
                        No bank connection · Cancel anytime
                      </span>
                    </div>
                  </>
                )}
              </div>
            </nav>

            {/* ── Mobile controls ── */}
            <div className="flex items-center gap-2.5 lg:hidden">

              {/* Compact gold pill — homepage-aware */}
              {isHome ? (
                <a
                  href="/templates"
                  className="group relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[11.5px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  style={{ boxShadow: goldCtaShadow }}
                >
                  <span className="relative z-10">My templates</span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={startAutoFillCheckout}
                  className="group relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[11.5px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  style={{ boxShadow: goldCtaShadow }}
                >
                  <span className="relative z-10">Auto-fill — $150/mo</span>
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
                className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-all duration-200 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${hamburger}`}
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

          {/* [UPGRADE 6] Scroll progress bar — renders at the bottom edge of the
              header once the user has scrolled. Width is driven by a CSS custom
              property set inside the scroll handler (no React re-renders).
              Hidden over the dark hero; appears with the white-glass state. */}
          <div
            aria-hidden
            className={`pointer-events-none absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-champagne-200 to-champagne-300 transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
            style={{ width: "var(--nav-progress, 0%)" }}
          />
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

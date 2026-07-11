import { useEffect, useState } from "react";

// Homepage-only sticky thumb-zone CTA. Mobile/tablet only (lg:hidden) — the
// desktop render is never touched. Appears after the user scrolls past the hero
// so the primary action ("Get the free templates") stays in the thumb's reach on
// the long landing scroll. Matches the established interior-page MobileStickyCTA
// pattern, plus a dismiss control (2026 sticky-CTA best practice).
// HOMEPAGE EXCEPTION: free-templates CTA only — NO $150/mo here.
export default function HomeMobileStickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      // Hide near the page bottom so the bar never covers the final lead-capture
      // form or the footer (the primary action is already on-screen there).
      const nearBottom =
        window.innerHeight + scrolled >=
        document.documentElement.scrollHeight - 220;
      setVisible(scrolled > 520 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const show = visible && !dismissed;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 transform border-t border-ink/[0.08] bg-white/95 backdrop-blur-xl transition-all duration-500 ease-cinema lg:hidden ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-center gap-3 px-4 pt-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/45">
            Free · No bank connection
          </p>
        </div>

        <a
          href="/templates"
          className="shrink-0 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-5 py-3 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
        >
          Get the free templates
        </a>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="flex h-11 w-9 shrink-0 items-center justify-center text-ink/35 transition-colors duration-200 hover:text-ink/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

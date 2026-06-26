import { useInView } from "../how-it-works/hooks/useInView";

// Homepage Section 4 — Epiphany Bridge: free templates → $99/mo auto-fill.
// Pattern D: two-column reframe. Left = manual/painful. Right = GoldFin/calm.
// Right column CTA: quiet text link ONLY — NO button, NO gold.

const MANUAL_BULLETS = [
  "Open the bank statement, download the CSV",
  "Copy paste into spreadsheet, fix the formulas",
  "Rebuild the cash flow projection again",
  "Hope you didn't miss a category",
  "Email your accountant the same question as last month",
] as const;

const GOLDFIN_BULLETS = [
  "Bank reads your transactions automatically",
  "Templates fill with your real numbers",
  "Plain-English briefing lands in your inbox",
  "Focused on the 3 decisions that actually matter",
] as const;

export default function EpiphanyBridge() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      aria-labelledby="epiphany-bridge-title"
      className="bg-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-16 md:py-28 lg:px-10">
        {/* Section header */}
        <div className="mb-14 max-w-[46ch]">
          <div
            className={`text-[10px] uppercase tracking-[0.28em] text-champagne-300 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            Two ways to use these templates
          </div>

          <h2
            id="epiphany-bridge-title"
            className={`mt-4 font-robert-medium text-[clamp(1.75rem,3.8vw,2.75rem)] font-black uppercase leading-[0.98] tracking-tight text-ink transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "80ms" }}
          >
            Use them free. Or have them filled for you every month.
          </h2>
        </div>

        {/* Two-column comparison */}
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* ── Left column — manual / painful ── */}
          <div
            className={`border-ink/[0.06] py-8 pr-0 transition-all duration-700 ease-cinema md:border-r md:pr-12 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Eyebrow */}
            <div className="mb-5 text-[10px] uppercase tracking-[0.26em] text-ink/40">
              The manual way
            </div>

            {/* H3 */}
            <h3 className="mb-6 text-[20px] font-medium leading-snug text-ink">
              3 hours per month you don't have
            </h3>

            {/* Bullets */}
            <ul className="space-y-3">
              {MANUAL_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[3px] shrink-0 text-[12px] text-ink/30 select-none"
                  >
                    —
                  </span>
                  <span className="text-[14px] leading-[1.6] text-ink/65">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right column — GoldFin / calm ── */}
          <div
            className={`py-8 pl-0 transition-all duration-700 ease-cinema md:pl-12 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {/* Eyebrow with signal dot */}
            <div className="mb-5 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-champagne-300/70"
              />
              <span className="text-[10px] uppercase tracking-[0.26em] text-champagne-300">
                The GoldFin way
              </span>
            </div>

            {/* H3 */}
            <h3 className="mb-6 text-[20px] font-medium leading-snug text-ink">
              Connected once. Filled every month.
            </h3>

            {/* Bullets */}
            <ul className="space-y-3">
              {GOLDFIN_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[2px] shrink-0 text-[13px] text-champagne-300/80 select-none"
                  >
                    ✓
                  </span>
                  <span className="text-[14px] leading-[1.6] text-ink/80">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            {/* Quiet text link CTA — NO button, NO gold */}
            <div className="mt-8">
              <a
                href="/pricing"
                className="group inline-flex items-center border-b border-ink/20 pb-0.5 text-[13px] text-ink/65 transition-colors duration-300 hover:border-champagne-300/60 hover:text-champagne-300"
              >
                See how auto-fill works
                <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
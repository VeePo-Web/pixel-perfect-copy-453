import { heroColumns } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { trackCtaByHref } from "../analytics";

export default function ComparisonHero() {
  return (
    <section
      aria-labelledby="three-way-hero-heading"
      className="relative isolate overflow-hidden border-b border-ink/[0.06] bg-white"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(201,163,90,0.08),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-32 md:pb-24 sm:pt-36 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1.05fr] lg:gap-16">
          <div className="motion-safe:animate-section-in">
            <div className="flex items-center gap-2 font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70"><span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-champagne-300/70" />
              Compare your financial support options
            </div>
            <h1
              id="three-way-hero-heading"
              className="mt-5 max-w-[22ch] font-display font-medium text-ink [text-wrap:balance] text-[38px] leading-[1.04] tracking-[-0.02em] sm:text-[52px] lg:text-[60px]"
            >
              Bookkeeper vs Fractional CFO vs GoldFin Desk.
            </h1>
            <p className="mt-5 max-w-[60ch] text-[15.5px] leading-[1.7] [text-wrap:pretty] text-ink/70">
              A bookkeeper helps keep records clean. A fractional CFO helps with deeper
              financial strategy. The GoldFin Desk gives owner-led businesses the
              missing middle: structured financial clarity, bi-weekly plain-English briefings,
              and a monthly strategy review.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#fit-finder"
                className="w-full rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-4 text-center text-[13px] font-medium tracking-wide text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema sm:w-auto sm:py-3.5 hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
              Find My Best Fit
              </a>
              <a
                href="/sample-briefing"
                onClick={() => trackCtaByHref("/sample-briefing", "hero")}
                className="rounded-full border border-ink/[0.12] bg-white px-6 py-3.5 text-[13px] text-ink/80 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
              Generate Sample Finance Briefing
              </a>
              <button
                type="button"
                onClick={() => { startAutoFillCheckout(); trackCtaByHref("/pricing#auto-fill", "hero"); }}
                className="text-[12.5px] text-ink/55 underline-offset-4 transition-all duration-300 ease-cinema hover:text-ink hover:underline"
              >
                Or have it done for you — $150/mo
              </button>
            </div>
            <p className="mt-5 font-general text-[11.5px] uppercase tracking-[0.2em] text-ink/55">
              No bank connection required to preview or apply.
            </p>
          </div>

          <div aria-hidden className="relative">
            <ThreeColumnDecision />
          </div>
        </div>
      </div>
    </section>
  );
}

function ThreeColumnDecision() {
  return (
    <div className="relative rounded-3xl border border-ink/[0.08] bg-white p-6 shadow-[0_24px_80px_-32px_rgba(11,13,18,0.14)] sm:p-8">
      <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-ink/45">
        Three options · one decision
      </div>
      <div className="mt-5 grid grid-cols-3 items-stretch gap-3">
        {heroColumns.map((c) => (
          <div
            key={c.id}
            className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-4 transition-all duration-300 ease-cinema ${
              c.isMfd
                ? "border-champagne-200/50 bg-champagne-50/40 shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
                : "border-ink/[0.06] bg-white"
            }`}
          >
            {c.isMfd ? (
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/70 to-transparent"
              />
            ) : null}
            <div
              className={`font-general text-[9.5px] uppercase tracking-[0.26em] ${
                c.isMfd ? "text-champagne-300/70" : "text-ink/40"
              }`}
            >
              {c.isMfd ? "The missing middle" : "Option"}
            </div>
            <div className={`mt-3 text-[13.5px] leading-snug text-ink ${c.isMfd ? "font-medium" : ""}`}>
              {c.label}
            </div>
            <div
              className={`mt-2 text-[11.5px] leading-relaxed ${
                c.isMfd ? "text-ink/80" : "text-ink/55"
              }`}
            >
              {c.role}
            </div>
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="mt-5 grid grid-cols-3 items-center text-center font-general text-[10px] uppercase tracking-[0.24em] text-ink/35"
      >
        <span>Records</span>
        <span className="text-champagne-300/70">Recurring clarity</span>
        <span>Leadership</span>
      </div>
    </div>
  );
}

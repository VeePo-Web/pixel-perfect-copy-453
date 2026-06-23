import { heroColumns } from "../content";
import { trackCtaByHref } from "../analytics";

export default function ComparisonHero() {
  return (
    <section
      aria-labelledby="three-way-hero-heading"
      className="relative isolate overflow-hidden border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(201,163,90,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(250,248,243,0))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-36 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1.05fr] lg:gap-16">
          <div className="motion-safe:animate-section-in">
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              Compare your financial support options
            </div>
            <h1
              id="three-way-hero-heading"
              className="mt-5 max-w-[22ch] font-light text-ink text-[38px] leading-[1.04] tracking-[-0.01em] sm:text-[52px] lg:text-[60px]"
            >
              Bookkeeper vs Fractional CFO vs GoldFin Desk.
            </h1>
            <p className="mt-5 max-w-[60ch] text-[15.5px] leading-[1.7] text-ink/70">
              A bookkeeper helps keep records clean. A fractional CFO helps with deeper
              financial strategy. The GoldFin Desk gives owner-led businesses the
              missing middle: structured financial clarity, bi-weekly plain-English briefings,
              and a monthly strategy review.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#fit-finder"
                className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              <span className="relative z-10">Find My Best Fit</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </a>
              <a
                href="#/sample-briefing"
                onClick={() => trackCtaByHref("#/sample-briefing", "hero")}
                className="rounded-full border border-ink/[0.12] px-6 py-3.5 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              Generate Sample Finance Briefing
              </a>
              <a
                href="#/pricing#auto-fill"
                onClick={() => trackCtaByHref("#/pricing#auto-fill", "hero")}
                className="text-[12.5px] text-ink/55 underline-offset-4 transition-all duration-300 ease-cinema hover:text-ink hover:underline"
              >
                Or have it done for you â€” $99/mo
              </a>
            </div>
            <p className="mt-5 text-[11.5px] uppercase tracking-[0.2em] text-ink/40">
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
    <div className="relative rounded-3xl border border-ink/[0.07] bg-ink/[0.02] p-6 shadow-[0_30px_120px_-40px_rgba(25,28,34,0.14)] sm:p-8">
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-ink/45">
        Three options Â· one decision
      </div>
      <div className="mt-5 grid grid-cols-3 items-stretch gap-3">
        {heroColumns.map((c) => (
          <div
            key={c.id}
            className={`group relative flex h-full flex-col rounded-2xl border p-4 transition-all duration-300 ease-cinema ${
              c.isMfd
                ? "border-champagne-200/45 bg-charcoal-900/70 shadow-[0_25px_70px_-30px_rgba(217,190,130,0.5)]"
                : "border-ink/[0.07] bg-charcoal-900/40 hover:border-champagne-200/25"
            }`}
          >
            {c.isMfd ? (
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/70 to-transparent"
              />
            ) : null}
            <div
              className={`text-[9.5px] uppercase tracking-[0.26em] ${
                c.isMfd ? "text-champagne-300/70" : "text-ink/40"
              }`}
            >
              {c.isMfd ? "The missing middle" : "Option"}
            </div>
            <div className="mt-3 text-[13.5px] font-light leading-snug text-ink">
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
        className="mt-5 grid grid-cols-3 items-center text-center text-[10px] uppercase tracking-[0.24em] text-ink/35"
      >
        <span>Records</span>
        <span className="text-champagne-300/70">Recurring clarity</span>
        <span>Leadership</span>
      </div>
    </div>
  );
}

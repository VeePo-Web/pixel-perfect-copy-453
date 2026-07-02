import { startAutoFillCheckout } from "../../../lib/checkout";
export default function PricingHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink/[0.05] bg-charcoal-950">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(201,163,90,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(250,248,243,0))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-36 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1.1fr] lg:gap-16">
          <div className="motion-safe:animate-section-in">
            <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70"><span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-champagne-300/70" />
              Pricing
            </div>
            <h1 className="mt-5 max-w-[24ch] font-light text-ink [text-wrap:balance] text-[38px] leading-[1.08] tracking-[-0.01em] sm:text-[50px] lg:text-[58px]">
              Free templates. <span className="text-champagne-300">$150 to have them filled for you</span> — every two weeks.
            </h1>
            <p className="mt-6 max-w-[56ch] text-[15.5px] leading-[1.7] [text-wrap:pretty] text-ink/70">
              Most owners don&rsquo;t need a full finance team — they need their numbers organized and explained on a schedule. That&rsquo;s $150/mo. Start there, or grab the free templates below.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button" onClick={startAutoFillCheckout}
                className="group relative w-full overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-4 text-center text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema sm:w-auto sm:py-3.5 hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span className="relative z-10">Auto-fill my reports — $150/mo</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </button>
              <a
                href="/sample-briefing"
                className="rounded-full border border-ink/[0.12] px-6 py-3.5 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                See a sample briefing
              </a>
              <a
                href="/templates"
                className="rounded text-[12.5px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Or start with free templates
              </a>
            </div>
            <p className="mt-4 text-[11.5px] uppercase tracking-[0.2em] text-ink/50">
              No contracts · Cancel anytime · No bank connection required to start
            </p>
          </div>

          {/* ── Focal price visual — the $150 plan rendered as the hero object ── */}
          <div
            aria-hidden
            className="pointer-events-none relative flex h-[440px] items-center justify-center sm:h-[500px] lg:h-[540px]"
          >
            {/* concentrated gold halo behind the focal card */}
            <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,168,69,0.20),transparent_70%)] blur-2xl" />

            {/* ghosted value-ladder cards — depth + context, hidden on small screens */}
            <div className="absolute left-[4%] top-[15%] hidden w-[42%] -rotate-[8deg] rounded-2xl border border-ink/[0.06] bg-paper/70 p-4 opacity-60 shadow-[0_24px_60px_-32px_rgba(11,13,18,0.25)] backdrop-blur-sm motion-safe:animate-panel-rise sm:block">
              <div className="text-[9px] uppercase tracking-[0.26em] text-ink/40">Free</div>
              <div className="mt-1.5 text-[12px] text-ink/70">Template Vault</div>
              <div className="mt-2 text-[24px] font-light tabular-nums text-ink/70">Free</div>
            </div>
            <div
              className="absolute bottom-[15%] right-[4%] hidden w-[42%] rotate-[8deg] rounded-2xl border border-ink/[0.06] bg-paper/70 p-4 opacity-60 shadow-[0_24px_60px_-32px_rgba(11,13,18,0.25)] backdrop-blur-sm motion-safe:animate-panel-rise sm:block"
              style={{ animationDelay: "90ms" }}
            >
              <div className="text-[9px] uppercase tracking-[0.26em] text-ink/40">Sample</div>
              <div className="mt-1.5 text-[12px] text-ink/70">See a briefing</div>
              <div className="mt-2 text-[24px] font-light tabular-nums text-ink/70">Preview</div>
            </div>

            {/* THE focal card — GoldFin Reports · $150/mo */}
            <div
              className="relative z-20 w-[80%] max-w-[348px] overflow-hidden rounded-[22px] border border-champagne-200/50 bg-paper shadow-[0_44px_110px_-30px_rgba(212,168,69,0.45),0_22px_56px_-34px_rgba(11,13,18,0.45)] motion-safe:animate-panel-rise"
              style={{ animationDelay: "160ms" }}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300 to-transparent" />
              <div className="relative px-6 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne-200/50 bg-champagne-300/[0.08] px-2.5 py-1 text-[9.5px] uppercase tracking-[0.22em] text-champagne-300">
                    <span className="h-1 w-1 rounded-full bg-champagne-300 motion-safe:animate-soft-pulse" />
                    Recommended
                  </span>
                  <span className="text-[9.5px] uppercase tracking-[0.24em] text-ink/35">Continuity</span>
                </div>
                <div className="mt-4 text-[15px] text-ink">GoldFin Reports</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[54px] font-light leading-none tabular-nums text-ink">$150</span>
                  <span className="text-[13px] text-ink/45">/month</span>
                </div>
                <div className="mt-5 space-y-2.5">
                  {[
                    "Your templates auto-filled monthly",
                    "A plain-English briefing every cycle",
                    "No bank connection to start",
                    "Cancel anytime",
                  ].map((line) => (
                    <div key={line} className="flex items-center gap-2.5 text-[12.5px] text-ink/75">
                      <svg
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5 shrink-0 text-champagne-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 8.5l3.2 3.2L13 5" />
                      </svg>
                      {line}
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 py-2.5 text-center text-[12px] font-medium text-navy shadow-[0_10px_28px_-10px_rgba(212,168,69,0.55)]">
                  Auto-fill my reports
                </div>
              </div>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent motion-safe:animate-shimmer-slow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

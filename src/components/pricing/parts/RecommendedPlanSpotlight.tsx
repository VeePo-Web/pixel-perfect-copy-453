import { monthlyRhythm } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";

export default function RecommendedPlanSpotlight() {
  return (
    <section aria-labelledby="spotlight-title" className="relative border-b border-ink/[0.05] bg-charcoal-950">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(201,163,90,0.08),transparent_65%)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12 max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            The next step up · by application
          </div>
          <h2 id="spotlight-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[46px]">
            When you want a human reading the numbers with you.
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.7] text-ink/70">
            Auto-fill keeps your reports current. The GoldFin Desk adds a person who interprets them and meets with you every month. Most owners start with $150 auto-fill and move here when the decisions get bigger.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-champagne-200/30 bg-charcoal-900/70 backdrop-blur-sm shadow-[0_40px_120px_-40px_rgba(217,190,130,0.35)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/60 to-transparent" />
          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14 lg:p-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-champagne-200/40 bg-champagne-300/[0.06] px-3 py-1 text-[10.5px] uppercase tracking-[0.22em] text-champagne-300">
                <span className="h-1.5 w-1.5 rounded-full bg-champagne-200 motion-safe:animate-soft-pulse" />
                Most relevant for serious owner-led businesses
              </div>
              <h3 className="mt-5 font-light text-ink text-[28px] leading-[1.1]">
                The GoldFin Desk
              </h3>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-[56px] font-light tabular-nums text-ink">$1,500</span>
                <span className="text-[14px] text-ink/55">/ month</span>
              </div>
              <p className="mt-5 max-w-[44ch] text-[14.5px] leading-[1.7] text-ink/75">
                A recurring system that keeps the financial side of the business from disappearing into the background.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {/* $150/mo — gold, the bread-and-butter rung; Advisory is never gold */}
                <button
                  type="button"
                  onClick={startAutoFillCheckout}
                  className="group relative inline-flex w-full justify-center items-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema sm:w-auto sm:justify-start sm:py-3 hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <span className="relative z-10">Auto-fill my reports — $150/mo</span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
                </button>
                {/* Advisory — border/secondary */}
                <a
                  href="/apply"
                  className="rounded-full border border-ink/[0.12] px-5 py-3 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Apply for the GoldFin Desk
                </a>
                <a
                  href="/sample-briefing"
                  className="rounded-full border border-ink/[0.12] px-5 py-3 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Preview Sample Briefing
                </a>
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ink/45">
                Most owners start at $150 · Advisory is application-only
              </p>
            </div>

            <div>
              <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/45">
                Your monthly rhythm
              </div>
              <ol className="mt-5 space-y-3">
                {monthlyRhythm.map((r, i) => (
                  <li
                    key={r.week}
                    className="grid grid-cols-[80px_1fr] items-center gap-4 rounded-xl border border-ink/[0.07] bg-ink/[0.02] px-5 py-4 transition-all duration-300 hover:border-champagne-200/25 hover:bg-ink/[0.04]"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="text-[11px] uppercase tracking-[0.22em] text-champagne-300/70">
                      {r.week}
                    </span>
                    <span className="text-[15px] text-ink/90">{r.title}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-[11.5px] uppercase tracking-[0.2em] text-ink/40">
                One repeating cycle. No surprises. No catching up at year-end.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

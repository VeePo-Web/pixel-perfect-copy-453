import { productBoundaries } from "../content";
import { trackCtaByHref } from "../analytics";

export default function ProductBoundariesSection() {
  return (
    <section
      id="boundaries"
      aria-labelledby="boundaries-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Scope
          </div>
          <h2
            id="boundaries-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
          >
            What GoldFin Desk does — and does not do.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.03] p-6">
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-emerald-300/80">
              What it does
            </div>
            <ul className="mt-5 space-y-3">
              {productBoundaries.does.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/85"
                >
                  <span
                    aria-hidden
                    className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 text-emerald-300/90"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.025] p-6">
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-amber-200/80">
              What it does not do
            </div>
            <ul className="mt-5 space-y-3">
              {productBoundaries.doesNot.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/80"
                >
                  <span
                    aria-hidden
                    className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-amber-300/25 text-amber-200/90"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 6l12 12M6 18L18 6" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-ink/45">
          GoldFin Desk does not replace tax, legal, accounting, bookkeeping
          cleanup, CFO services, or investment advice.
        </p>
        <div className="mt-8">
          <a
            href="#/compare"
            onClick={() => trackCtaByHref("#/compare", "security_faq_boundaries")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-[13px] text-ink transition-colors hover:border-ink/30 hover:bg-ink/[0.03]"
          >
            Compare Your Options →
          </a>
        </div>
      </div>
    </section>
  );
}

import { priceFraming, valueStack } from "../content";
import { trackCtaByHref } from "../analytics";

export default function PricingValueContext() {
  return (
    <section
      aria-labelledby="pricing-context-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
              Pricing context
            </div>
            <h2
              id="pricing-context-heading"
              className="mt-3 font-light text-bone text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
            >
              Why the Monthly Finance Desk is $1,500/month.
            </h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-bone/70">
              You are not paying for bookkeeping. You are not paying for a spreadsheet. You are
              paying for a recurring financial clarity rhythm.
            </p>

            <ul className="mt-8 space-y-2.5">
              {priceFraming.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-bone/80"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-champagne-200"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#/pricing"
                onClick={() => trackCtaByHref("#/pricing", "pricing-context")}
                className="rounded-full border border-ink/[0.12] px-5 py-2.5 text-[12.5px] text-bone/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-bone"
              >
                View Pricing
              </a>
              <a
                href="#/apply"
                onClick={() => trackCtaByHref("#/apply", "pricing-context")}
                className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-charcoal-950 transition-all duration-300 ease-cinema hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)]"
              >
                Apply for Monthly Finance Desk
              </a>
            </div>
          </div>

          <div className="relative rounded-3xl border border-champagne-200/35 bg-charcoal-900/70 p-7 shadow-[0_40px_120px_-40px_rgba(217,190,130,0.4)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/60 to-transparent"
            />
            <div className="flex items-baseline justify-between">
              <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-200/85">
                Included monthly
              </div>
              <div className="text-[12px] uppercase tracking-[0.22em] text-bone/45">
                $1,500 / mo
              </div>
            </div>
            <ul className="mt-5 divide-y divide-ink/[0.06]">
              {valueStack.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-3 text-[13.5px] text-bone/85"
                >
                  <span
                    aria-hidden
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-champagne-200/45 text-[10px] text-champagne-200"
                  >
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

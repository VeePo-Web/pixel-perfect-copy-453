import { priceFraming, valueStack } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { trackCtaByHref } from "../analytics";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function PricingValueContext() {
  const reveal = useInView<HTMLDivElement>();
  const ref = reveal.ref;
  const inView = reveal.inView;
  return (
    <section
      aria-labelledby="pricing-context-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
          <div className={`transition-all duration-700 ease-cinema ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              Pricing context
            </div>
            <h2
              id="pricing-context-heading"
              className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
            >
              Why the GoldFin Desk is $1,500/month.
            </h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-ink/70">
              You are not paying for bookkeeping. You are not paying for a spreadsheet. You are
              paying for a recurring financial clarity rhythm.
            </p>

            <ul className="mt-8 space-y-2.5">
              {priceFraming.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/80"
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
                href="/pricing"
                onClick={() => trackCtaByHref("/pricing", "pricing-context")}
                className="rounded-full border border-ink/[0.12] px-5 py-2.5 text-[12.5px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                View Pricing
              </a>
              <button
                type="button"
                onClick={() => { startAutoFillCheckout(); trackCtaByHref("/pricing#auto-fill", "pricing-context"); }}
                className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              Auto-fill my reports — $150/mo
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl border border-champagne-200/35 bg-charcoal-900/70 p-7 shadow-[0_40px_120px_-40px_rgba(217,190,130,0.4)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/60 to-transparent"
            />
            <div className="flex items-baseline justify-between">
              <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">
                Included monthly
              </div>
              <div className="text-[12px] uppercase tracking-[0.22em] text-ink/45">
                $1,500 / mo
              </div>
            </div>
            <ul className="mt-5 divide-y divide-ink/[0.06]">
              {valueStack.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-3 text-[13.5px] text-ink/85"
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

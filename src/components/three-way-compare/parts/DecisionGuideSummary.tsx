import { decisionSummary } from "../content";
import { trackCtaByHref } from "../analytics";

export default function DecisionGuideSummary() {
  return (
    <section
      aria-labelledby="decision-summary-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Decision guide
          </div>
          <h2
            id="decision-summary-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Simple rule of thumb.
          </h2>
        </div>

        <ul className="mt-8 divide-y divide-ink/[0.06] rounded-2xl border border-ink/[0.07] bg-ink/[0.02]">
          {decisionSummary.map((row, i) => (
            <li
              key={row.need}
              className="grid items-center gap-3 px-5 py-5 sm:grid-cols-[1fr_auto] sm:gap-6 sm:px-7 sm:py-6"
            >
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.24em] text-ink/40">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-1.5 text-[15.5px] text-ink">{row.need}</div>
                <div className="mt-1 text-[14px] text-ink/70">{row.answer}</div>
              </div>
              <a
                href={row.href}
                onClick={() => trackCtaByHref(row.href, `decision-${i}`)}
                className="justify-self-start rounded-full border border-ink/[0.12] px-4 py-2 text-[12.5px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 sm:justify-self-end"
              >
                Go →
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <a
            href="#fit-finder"
            className="inline-flex rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/70 focus-visible:ring-offset-2"
          >
            Find My Best Fit
          </a>
        </div>
      </div>
    </section>
  );
}

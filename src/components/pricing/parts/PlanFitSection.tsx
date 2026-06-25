import { planFit } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";

export default function PlanFitSection() {
  return (
    <section aria-labelledby="fit-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Self-select
          </div>
          <h2 id="fit-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
            Choose based on your current financial maturity.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {planFit.map((col) => {
            // continuity ($99/mo) is the ONLY plan that earns gold — not Advisory
            const gold = col.tone === "continuity";
            const isContinuity = gold;
            return (
              <div
                key={col.title}
                className={`flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 ease-cinema hover:-translate-y-0.5 ${
                  gold
                    ? "border-champagne-200/40 bg-charcoal-900/75 shadow-[0_30px_80px_-30px_rgba(217,190,130,0.3)]"
                    : "border-ink/[0.07] bg-charcoal-900/55 hover:border-champagne-200/25"
                }`}
              >
                <h3 className={`text-[18px] font-light ${gold ? "text-ink" : "text-ink/90"}`}>{col.title}</h3>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {col.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink/80">
                      <span
                        aria-hidden
                        className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                          gold ? "bg-champagne-200" : "bg-bone/30"
                        }`}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                {isContinuity ? (
                  <button
                    type="button"
                    onClick={startAutoFillCheckout}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-3 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    {col.cta.label}
                    <span aria-hidden>→</span>
                  </button>
                ) : (
                  <a
                    href={col.cta.href}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/[0.12] px-5 py-3 text-[13px] font-medium tracking-wide text-ink/90 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-ink"
                  >
                    {col.cta.label}
                    <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

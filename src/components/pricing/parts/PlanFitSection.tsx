import { planFit } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";

export default function PlanFitSection() {
  return (
    <section aria-labelledby="fit-title" className="border-b border-ink/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            Self-select
          </div>
          <h2 id="fit-title" className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
            Choose based on your current financial maturity.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {planFit.map((col) => {
            // continuity ($150/mo) is the ONLY plan that earns gold — not Advisory
            const gold = col.tone === "continuity";
            const isContinuity = gold;
            return (
              <div
                key={col.title}
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-7 ${
                  gold
                    ? "border-champagne-200/50 shadow-[0_24px_60px_-28px_rgba(11,13,18,0.16),0_14px_40px_-22px_rgba(184,137,58,0.25)]"
                    : "border-ink/[0.08] shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
                }`}
              >
                {gold && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300 to-transparent"
                  />
                )}
                <h3 className={`text-[18px] font-medium ${gold ? "text-ink" : "text-ink/90"}`}>{col.title}</h3>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {col.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink/80">
                      <span
                        aria-hidden
                        className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                          gold ? "bg-champagne-200" : "bg-ink/25"
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
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-5 py-3 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    {col.cta.label}
                    <span aria-hidden>→</span>
                  </button>
                ) : (
                  <a
                    href={col.cta.href}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/[0.12] bg-white px-5 py-3 text-[13px] font-medium text-ink/80 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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

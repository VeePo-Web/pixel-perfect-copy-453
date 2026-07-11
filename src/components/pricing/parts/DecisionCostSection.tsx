import { decisionCards } from "../content";

export default function DecisionCostSection() {
  return (
    <section aria-labelledby="decision-title" className="border-b border-ink/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            Decision cost
          </div>
          <h2 id="decision-title" className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
            One unclear decision can cost more than the monthly desk.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.7] text-ink/70">
            The GoldFin Desk does not promise guaranteed savings or outcomes. It creates the structure to review decisions before they become expensive.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {decisionCards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-champagne-200/40 bg-champagne-50/50 px-2.5 py-1 font-general text-[10px] uppercase tracking-[0.22em] text-champagne-300">
                Caution
              </div>
              <h3 className="mt-4 text-[17px] font-medium text-ink">{c.title}</h3>
              <p className="mt-3 text-[13.5px] leading-[1.65] text-ink/75">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="/sample-briefing"
            className="inline-flex items-center gap-2 rounded-full border border-ink/[0.12] bg-white px-6 py-3 text-[13px] text-ink/80 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            See a Sample Briefing
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

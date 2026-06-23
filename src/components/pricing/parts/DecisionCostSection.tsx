import { decisionCards } from "../content";

export default function DecisionCostSection() {
  return (
    <section aria-labelledby="decision-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Decision cost
          </div>
          <h2 id="decision-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
            One unclear decision can cost more than the monthly desk.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink/70">
            The GoldFin Desk does not promise guaranteed savings or outcomes. It creates the structure to review decisions before they become expensive.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {decisionCards.map((c) => (
            <div
              key={c.title}
              className="group rounded-2xl border border-champagne-200/15 bg-charcoal-900/55 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne-200/35 hover:shadow-[0_24px_60px_-30px_rgba(217,190,130,0.25)]"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-champagne-200/30 bg-champagne-300/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-champagne-300">
                Caution
              </div>
              <h3 className="mt-4 text-[17px] font-light text-ink">{c.title}</h3>
              <p className="mt-3 text-[13.5px] leading-[1.65] text-ink/75">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="#/sample-briefing"
            className="inline-flex items-center gap-2 rounded-full border border-ink/[0.12] px-6 py-3 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            See a Sample Briefing
            <span aria-hidden>â†’</span>
          </a>
        </div>
      </div>
    </section>
  );
}

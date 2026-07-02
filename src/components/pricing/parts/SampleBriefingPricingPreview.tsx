export default function SampleBriefingPricingPreview() {
  const items = [
    { label: "Cash Movement", body: "+12% vs prior 2 weeks. Driven mostly by delayed vendor payments." },
    { label: "Revenue Trend", body: "+8% growth, concentrated in a small number of accounts." },
    { label: "Expense Pattern", body: "+15% rise. Contractor and software subscriptions leading." },
    { label: "Questions to Review", body: "Can the business support another fixed payroll cost right now?" },
    { label: "Decisions to Consider", body: "Delay hiring. Audit software stack. Reset reserve target." },
  ];
  return (
    <section aria-labelledby="proof-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              Proof
            </div>
            <h2 id="proof-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
              See what the GoldFin Desk actually produces.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-ink/70">
              Before you apply, preview the kind of plain-English briefing designed to help owners understand what changed, what looks risky, and what decisions deserve attention.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/sample-briefing"
                className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span className="relative z-10">Generate Sample Finance Briefing</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </a>
              {/* Advisory — text/tertiary; never border or gold per value ladder */}
              <a
                href="/pricing"
                className="text-[12.5px] text-ink/55 underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
              >
                Apply for the GoldFin Desk →
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-champagne-200/20 bg-charcoal-900/65 backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent" />
            <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
                Sample bi-weekly briefing
              </div>
              <div className="rounded-full border border-ink/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-ink/55">
                Demo
              </div>
            </div>
            <ul className="divide-y divide-ink/[0.05]">
              {items.map((i) => (
                <li key={i.label} className="px-5 py-4">
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/50">{i.label}</div>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-ink/85">{i.body}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink/[0.05] bg-ink/[0.015] px-5 py-4">
              <p className="text-[13px] leading-[1.6] text-ink/75">
                Revenue is growing, but expenses are rising faster than margin. Before adding another fixed payroll cost, review whether current cash flow can support the hire without weakening reserves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

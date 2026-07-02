import { useInView } from "../../how-it-works/hooks/useInView";
import { comparisonCards } from "../content";
import { track } from "../analytics";

export default function ComparisonCardGrid() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      id="comparisons"
      aria-labelledby="comparisons-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-14 md:py-24 lg:px-10">
        <div
          className={`max-w-[60ch] transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Compare your options
          </div>
          <h2
            id="comparisons-heading"
            className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            Compare your options.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink/70">
            Each option solves a different problem. Choose the comparison closest to your decision.
          </p>
        </div>

        <ul
          className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {comparisonCards.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.anchorId}`}
                onClick={() => track("comparison_card_clicked", { id: c.id })}
                className="group flex h-full flex-col rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-5 transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:border-champagne-200/35 hover:bg-ink/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/40 focus-visible:ring-offset-2"
              >
                <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">
                  Comparison
                </div>
                <div className="mt-2 text-[17px] font-light leading-snug text-ink">
                  {c.title}
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-ink/55">
                  <span className="text-ink/40">Best for · </span>
                  {c.bestFor}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/70 opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  {c.coreInsight}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-ink/85 transition-colors group-hover:text-champagne-200">
                  {c.ctaText}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

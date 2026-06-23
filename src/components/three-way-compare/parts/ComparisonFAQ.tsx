import { faq } from "../content";
import { track } from "../analytics";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function ComparisonFAQ() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      id="faq"
      aria-labelledby="three-way-faq-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <div className={`transition-all duration-700 ease-cinema ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Objection handling · FAQ
          </div>
          <h2
            id="three-way-faq-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Questions owners ask before choosing.
          </h2>
        </div>
        <div className={`mt-8 divide-y divide-ink/[0.06] rounded-2xl border border-ink/[0.07] bg-ink/[0.02] transition-all duration-700 ease-cinema delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {faq.map((item, i) => (
            <details
              key={item.q}
              className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) {
                  track("comparison_faq_opened", { index: i, question: item.q });
                }
              }}
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-[14.5px] text-ink">
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className="mt-1 inline-block h-4 w-4 shrink-0 text-ink/55 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[68ch] text-[13.5px] leading-relaxed text-ink/70">
                {item.a}
              </p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-[11.5px] leading-relaxed text-ink/40">
          GoldFin Desk does not replace tax, legal, accounting, bookkeeping cleanup, or
          investment advice.
        </p>
      </div>
    </section>
  );
}

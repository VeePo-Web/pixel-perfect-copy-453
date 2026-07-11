import { fastAnswerCards } from "../content";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function FastAnswerCards() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      id="fast-answer"
      aria-labelledby="fast-answer-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.06] bg-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className={`max-w-[60ch] transition-all duration-700 ease-cinema ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Fast answer
          </div>
          <h2
            id="fast-answer-heading"
            className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[30px] leading-[1.1] tracking-[-0.02em] sm:text-[40px]"
          >
            The fast answer.
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {fastAnswerCards.map((c) => (
            <li
              key={c.id}
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 ease-cinema ${
                c.isMfd
                  ? "border-champagne-200/50 bg-champagne-50/40 shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
                  : "border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(11,13,18,0.04)] hover:-translate-y-0.5 hover:border-ink/[0.16] hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)]"
              }`}
            >
              {c.isMfd ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/70 to-transparent"
                />
              ) : null}
              <div
                className={`font-general text-[10.5px] uppercase tracking-[0.26em] ${
                  c.isMfd ? "text-champagne-300/70" : "text-ink/45"
                }`}
              >
                {c.isMfd ? "Likely fit" : "Option"}
              </div>
              <h3 className="mt-2 text-[18px] font-medium leading-snug text-ink">{c.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{c.body}</p>
              <div className={`mt-5 border-t pt-4 ${c.isMfd ? "border-champagne-200/30" : "border-ink/[0.06]"}`}>
                <div className="font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">
                  Best for
                </div>
                <p className="mt-1 text-[13px] text-ink/80">{c.bestFor}</p>
              </div>
              <div className="mt-4">
                <div className="font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">
                  {c.caveatLabel}
                </div>
                <p className="mt-1 text-[12.5px] text-ink/55">{c.caveat}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <a
            href="#fit-finder"
            className="inline-flex items-center gap-2 rounded-full border border-ink/[0.12] bg-white px-6 py-3 text-[13px] text-ink/80 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink"
          >
            Find My Best Fit
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

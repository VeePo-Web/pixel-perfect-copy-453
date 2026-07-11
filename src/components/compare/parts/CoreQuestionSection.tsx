import { useInView } from "../../how-it-works/hooks/useInView";

export default function CoreQuestionSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const rows = [
    {
      n: "01",
      title: "If your records are messy",
      copy: "You may need bookkeeping cleanup before any review system is useful.",
    },
    {
      n: "02",
      title: "If your reports exist but you do not know what to do with them",
      copy: "You may need financial interpretation, not more data.",
    },
    {
      n: "03",
      title: "If your decisions are getting bigger and riskier",
      copy: "You may need a recurring finance rhythm before each major call.",
    },
  ];
  return (
    <section
      aria-labelledby="core-question-heading"
      className="relative border-b border-ink/[0.06] bg-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div
            className={`transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              The core question
            </div>
            <h2
              id="core-question-heading"
              className="mt-4 max-w-[22ch] font-display font-medium text-ink [text-wrap:balance] text-[32px] leading-[1.1] tracking-[-0.02em] sm:text-[44px]"
            >
              The question is not which tool is best. The question is what job your business needs done.
            </h2>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.7] text-ink/70">
              Most serious owners do not lack financial data. They lack a consistent way to turn that data into decisions.
            </p>
            <a
              href="#fit-finder"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-ink/[0.12] bg-white px-5 py-2.5 text-[12.5px] text-ink/80 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Find the right fit <span aria-hidden>→</span>
            </a>
          </div>
          <ol
            className={`grid gap-4 transition-all duration-700 ease-cinema delay-150 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {rows.map((r) => (
              <li
                key={r.n}
                className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-general text-[16px] tabular-nums leading-none text-champagne-300/80">{r.n}</span>
                  <div>
                    <div className="text-[16px] font-medium leading-snug text-ink">{r.title}</div>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/60">{r.copy}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

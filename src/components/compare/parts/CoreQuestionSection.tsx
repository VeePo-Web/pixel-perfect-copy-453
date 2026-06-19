export default function CoreQuestionSection() {
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
      className="relative border-b border-white/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
              The core question
            </div>
            <h2
              id="core-question-heading"
              className="mt-4 max-w-[22ch] font-light text-bone text-[32px] leading-[1.1] tracking-[-0.01em] sm:text-[44px]"
            >
              The question is not which tool is best. The question is what job your business needs done.
            </h2>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.7] text-bone/70">
              Most serious owners do not lack financial data. They lack a consistent way to turn that data into decisions.
            </p>
            <a
              href="#fit-finder"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-5 py-2.5 text-[12.5px] text-bone/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-bone"
            >
              Find the right fit <span aria-hidden>→</span>
            </a>
          </div>
          <ol className="grid gap-4">
            {rows.map((r) => (
              <li
                key={r.n}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-champagne-200/25"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-light text-champagne-200/70 text-[22px] leading-none">{r.n}</span>
                  <div>
                    <div className="text-[16px] font-light leading-snug text-bone">{r.title}</div>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-bone/60">{r.copy}</p>
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

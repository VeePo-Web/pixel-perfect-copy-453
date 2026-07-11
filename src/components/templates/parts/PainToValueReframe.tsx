import { useInView } from "../../how-it-works/hooks/useInView";

const PAIRS: { before: string; after: string }[] = [
  { before: "Guessing from the bank balance", after: "A 13-week cash map you can read" },
  { before: "Expenses creeping unnoticed", after: "An expense audit that flags the creep" },
  { before: "Revenue up but profit unclear", after: "A cash-basis P&L review" },
  { before: "Monthly review feels scattered", after: "An owner command center" },
];

export default function PainToValueReframe() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18 });
  return (
    <section
      aria-labelledby="reframe-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300">
              From scattered to clear
            </div>
            <h2
              id="reframe-heading"
              className="mt-4 max-w-[22ch] font-display font-medium text-ink [text-wrap:balance] text-[32px] leading-[1.08] tracking-[-0.02em] sm:text-[44px]"
            >
              Most owners do not need more numbers. They need a clearer way to review them.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.7] text-ink/70">
              Your bank balance tells you what is left. Your bookkeeping tells you what happened.
              Your spreadsheets only help when someone has time to update them. The Vault gives
              you the structure to review cash flow, profitability, expenses, and owner decisions for free.
            </p>
            <a
              href="#vault-capture"
              className="group mt-7 inline-flex items-center text-[13px] text-champagne-300/80 underline-offset-4 transition-colors duration-300 hover:text-champagne-300 hover:underline"
            >
              <span>Send me the Vault</span>
              <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>{">"}</span>
            </a>
          </div>

          <ul className="space-y-3">
            {PAIRS.map((p, i) => (
              <li
                key={p.after}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`group grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-ink/[0.08] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-all duration-700 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)] sm:gap-5 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <span className="text-[13.5px] leading-snug text-ink/45 line-through decoration-ink/20">
                  {p.before}
                </span>
                <span
                  aria-hidden
                  className="text-champagne-300 transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  {">"}
                </span>
                <span className="text-[14px] font-medium leading-snug text-ink">
                  {p.after}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

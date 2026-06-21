import { useInView } from "../../how-it-works/hooks/useInView";

// Paired before -> after transformation (Brunson). Each line moves the owner
// from a pain they recognize to the clarity the Vault gives — stronger than
// two separate lists.
const PAIRS: { before: string; after: string }[] = [
  { before: "Guessing from the bank balance", after: "A cash-flow forecast you can read" },
  { before: "Expenses creeping unnoticed", after: "An expense audit that flags the creep" },
  { before: "“Can I afford to hire?” — unsure", after: "A hiring-affordability check" },
  { before: "Tax-season dread", after: "A tax reserve set aside on purpose" },
  { before: "Spreadsheets nobody updates", after: "A monthly review rhythm" },
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
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300">
              From scattered to clear
            </div>
            <h2
              id="reframe-heading"
              className="mt-4 max-w-[22ch] font-light text-ink text-[32px] leading-[1.1] tracking-[-0.01em] sm:text-[44px]"
            >
              Most owners don't need more numbers. They need a clearer way to review them.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.7] text-ink/70">
              Your bank balance tells you what's left. Your bookkeeping tells you what
              happened. Your spreadsheets only help when someone has time to update them.
              The Vault gives you the structure to actually review cash flow, expenses,
              hiring, and monthly decisions — for free.
            </p>
            <a
              href="#vault-capture"
              className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-2.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98]"
            >
              Send me the Vault <span aria-hidden>→</span>
            </a>
          </div>

          <ul className="space-y-3">
            {PAIRS.map((p, i) => (
              <li
                key={p.after}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`group grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-ink/[0.07] bg-ink/[0.02] px-5 py-4 transition-all duration-700 ease-cinema hover:-translate-y-0.5 hover:border-champagne-200/25 sm:gap-5 ${
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
                  →
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

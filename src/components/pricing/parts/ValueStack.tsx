import { valueStack } from "../content";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function ValueStack() {
  return (
    <section aria-labelledby="value-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Value stack
          </div>
          <h2 id="value-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
            What is included in the Monthly Finance Desk.
          </h2>
        </div>

        <ol className="mt-12 space-y-4">
          {valueStack.map((item, i) => (
            <ValueRow key={item.title} index={i} item={item} />
          ))}
        </ol>

        <div className="mt-10">
          <a
            href="#/apply"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-400 ease-cinema hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)]"
          >
            <span className="relative z-10">Apply for the Monthly Finance Desk</span>
            <span aria-hidden className="relative z-10">→</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ValueRow({ index, item }: { index: number; item: (typeof valueStack)[number] }) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.2 });
  return (
    <li
      ref={ref}
      className={`grid items-start gap-6 rounded-2xl border border-ink/[0.07] bg-charcoal-900/55 p-6 transition-all duration-700 ease-cinema sm:p-8 md:grid-cols-[60px_1fr_1fr] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="text-[11px] uppercase tracking-[0.28em] text-champagne-200/80 tabular-nums">
        0{index + 1}
      </div>
      <div>
        <h3 className="text-[18px] font-light text-ink">{item.title}</h3>
        <p className="mt-3 text-[14px] leading-[1.65] text-ink/80">{item.value}</p>
        {item.trust && (
          <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-ink/45">{item.trust}</p>
        )}
      </div>
      <div className="rounded-xl border border-ink/[0.05] bg-ink/[0.02] p-5">
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/50">Why it matters</div>
        <p className="mt-2 text-[14px] leading-[1.65] text-ink/80">{item.why}</p>
      </div>
    </li>
  );
}

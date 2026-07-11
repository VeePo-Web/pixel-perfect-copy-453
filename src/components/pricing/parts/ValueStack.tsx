import { valueStack } from "../content";
import { useInView } from "../../how-it-works/hooks/useInView";
import { startAutoFillCheckout } from "../../../lib/checkout";

export default function ValueStack() {
  return (
    <section aria-labelledby="value-title" className="border-b border-ink/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            Value stack
          </div>
          <h2 id="value-title" className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
            What is included in the GoldFin Desk.
          </h2>
        </div>

        <ol className="mt-12 space-y-4">
          {valueStack.map((item, i) => (
            <ValueRow key={item.title} index={i} item={item} />
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          {/* $150/mo — gold, bread-and-butter */}
          <button
            type="button"
            onClick={startAutoFillCheckout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-4 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema sm:w-auto sm:justify-start sm:py-3.5 hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Auto-fill my reports — $150/mo
            <span aria-hidden>→</span>
          </button>
          {/* Advisory — text/tertiary per value ladder */}
          <a
            href="/apply"
            className="text-[12.5px] text-ink/55 underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Running something larger? Apply for GoldFin Advisory →
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
      className={`grid items-start gap-6 rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-all duration-700 ease-cinema sm:p-8 md:grid-cols-[60px_1fr_1fr] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="font-general text-[11px] uppercase tracking-[0.28em] tabular-nums text-champagne-300/80">
        0{index + 1}
      </div>
      <div>
        <h3 className="text-[18px] font-medium text-ink">{item.title}</h3>
        <p className="mt-3 text-[14px] leading-[1.65] text-ink/80">{item.value}</p>
        {item.trust && (
          <p className="mt-3 font-general text-[10.5px] uppercase tracking-[0.18em] text-ink/45">{item.trust}</p>
        )}
      </div>
      <div className="rounded-xl border border-ink/[0.06] bg-ink/[0.02] p-5">
        <div className="font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/45">Why it matters</div>
        <p className="mt-2 text-[14px] leading-[1.65] text-ink/80">{item.why}</p>
      </div>
    </li>
  );
}

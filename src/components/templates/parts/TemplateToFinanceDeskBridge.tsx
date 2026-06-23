import { bridgeSteps } from "../content";
import { track } from "../analytics";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function TemplateToFinanceDeskBridge() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="bridge-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className={`max-w-[60ch] transition-all duration-700 ease-cinema ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            From templates to rhythm
          </div>
          <h2
            id="bridge-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            From spreadsheet structure to monthly financial clarity.
          </h2>
        </div>
        <ol className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-700 ease-cinema delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {bridgeSteps.map((s, i) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-5"
            >
              <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">
                Step {s.n}
              </div>
              <div className="mt-2 text-[16px] font-light leading-snug text-ink">{s.title}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{s.copy}</p>
              {i < bridgeSteps.length - 1 ? (
                <span aria-hidden className="pointer-events-none absolute right-[-8px] top-1/2 hidden h-px w-4 bg-ink/15 lg:block" />
              ) : null}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#/sample-briefing"
            onClick={() => track("sample_briefing_clicked_from_templates", { source: "bridge" })}
            className="inline-flex rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Generate Sample Finance Briefing
          </a>
          <a
            href="#/pricing#auto-fill"
            onClick={() => track("autofill_clicked_from_templates", { source: "bridge" })}
            className="group inline-flex items-center text-[12px] uppercase tracking-[0.18em] text-ink/40 transition-colors duration-300 hover:text-champagne-300"
          >
            <span className="border-b border-ink/10 pb-0.5 group-hover:border-champagne-300/60">Already ready? $99/mo</span>
            <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

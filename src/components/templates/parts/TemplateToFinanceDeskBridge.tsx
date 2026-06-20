import { bridgeSteps } from "../content";
import { track } from "../analytics";

export default function TemplateToFinanceDeskBridge() {
  return (
    <section
      aria-labelledby="bridge-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            From templates to rhythm
          </div>
          <h2
            id="bridge-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            From spreadsheet structure to monthly financial clarity.
          </h2>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bridgeSteps.map((s, i) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-5"
            >
              <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-200/70">
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
        <div className="mt-8">
          <a
            href="#/sample-briefing"
            onClick={() => track("sample_briefing_clicked_from_templates", { source: "bridge" })}
            className="inline-flex rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:shadow-[0_14px_40px_-12px_rgba(217,190,130,0.55)]"
          >
            Generate Sample Finance Briefing
          </a>
        </div>
      </div>
    </section>
  );
}

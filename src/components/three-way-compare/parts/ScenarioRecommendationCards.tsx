import { useState } from "react";
import { scenarios } from "../content";
import { track, trackCtaByHref } from "../analytics";

export default function ScenarioRecommendationCards() {
  const [open, setOpen] = useState<string | null>(scenarios[1]?.id ?? null);

  return (
    <section
      aria-labelledby="scenario-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[62ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Self-identify
          </div>
          <h2
            id="scenario-heading"
            className="mt-3 font-light text-bone text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            Which situation sounds like you?
          </h2>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((s) => {
            const isOpen = open === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => {
                    const next = isOpen ? null : s.id;
                    setOpen(next);
                    if (next) track("scenario_selected", { id: s.id });
                  }}
                  className={`group w-full text-left transition-all duration-400 ease-cinema rounded-2xl border p-5 ${
                    isOpen
                      ? "border-champagne-200/45 bg-charcoal-900/70 shadow-[0_20px_60px_-30px_rgba(217,190,130,0.45)]"
                      : "border-ink/[0.07] bg-ink/[0.02] hover:-translate-y-0.5 hover:border-champagne-200/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="max-w-[28ch] text-[15.5px] italic leading-snug text-bone">
                      “{s.quote.replace(/^["“]?|["”]?$/g, "")}”
                    </p>
                    <span
                      aria-hidden
                      className={`text-[18px] leading-none text-bone/55 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-400 ease-cinema ${
                      isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="text-[10.5px] uppercase tracking-[0.22em] text-champagne-200/80">
                        Recommendation
                      </div>
                      <p className="mt-1 text-[14px] font-light text-bone">{s.recommendation}</p>
                      <p className="mt-3 text-[13px] leading-relaxed text-bone/70">
                        {s.explanation}
                      </p>
                      <a
                        href={s.cta.href}
                        onClick={(e) => {
                          e.stopPropagation();
                          trackCtaByHref(s.cta.href, `scenario-${s.id}`);
                        }}
                        className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-champagne-200 underline-offset-4 hover:underline"
                      >
                        {s.cta.label} <span aria-hidden>→</span>
                      </a>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

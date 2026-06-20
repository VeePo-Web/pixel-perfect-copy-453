import { useState } from "react";
import { useCases } from "../content";
import { track } from "../analytics";

export default function UseCasePaths() {
  const [openId, setOpenId] = useState<string | null>(useCases[0]?.id ?? null);
  return (
    <section
      aria-labelledby="use-cases-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            See yourself in the page
          </div>
          <h2
            id="use-cases-heading"
            className="mt-3 font-light text-bone text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            Choose the path that sounds most like your business.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => {
            const open = openId === u.id;
            return (
              <article
                key={u.id}
                className={`rounded-2xl border p-5 transition-all duration-400 ease-cinema ${
                  open
                    ? "border-champagne-200/45 bg-charcoal-900/70 shadow-[0_30px_70px_-30px_rgba(217,190,130,0.35)]"
                    : "border-ink/[0.07] bg-ink/[0.02] hover:border-champagne-200/25"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    const next = open ? null : u.id;
                    setOpenId(next);
                    if (next) track("use_case_selected", { id: u.id });
                  }}
                  aria-expanded={open}
                  className="w-full text-left"
                >
                  <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-200/70">
                    Owner says
                  </div>
                  <div className="mt-2 text-[16px] font-light leading-snug text-bone">
                    “{u.quote}”
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-400 ease-cinema ${
                    open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[13px] leading-relaxed text-bone/70">{u.recommendation}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a
                        href={u.primaryCTA.href}
                        onClick={() => {
                          const h = u.primaryCTA.href;
                          if (h === "#/apply") track("apply_clicked_from_compare", { source: `use-case:${u.id}` });
                          else if (h === "#/sample-briefing")
                            track("sample_briefing_clicked_from_compare", { source: `use-case:${u.id}` });
                          else if (h === "#/templates")
                            track("templates_clicked_from_compare", { source: `use-case:${u.id}` });
                        }}
                        className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-2 text-[12px] font-medium text-charcoal-950 transition-all duration-300 ease-cinema hover:shadow-[0_10px_30px_-10px_rgba(217,190,130,0.55)]"
                      >
                        {u.primaryCTA.label}
                      </a>
                      <a
                        href={u.secondaryCTA.href}
                        className="text-[12px] text-bone/60 underline-offset-4 hover:text-bone hover:underline"
                      >
                        {u.secondaryCTA.label}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

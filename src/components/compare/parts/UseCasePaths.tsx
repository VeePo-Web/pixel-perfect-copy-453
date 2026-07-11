import { useState } from "react";
import { useInView } from "../../how-it-works/hooks/useInView";
import { useCases } from "../content";
import { track } from "../analytics";

export default function UseCasePaths() {
  const [openId, setOpenId] = useState<string | null>(useCases[0]?.id ?? null);
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="use-cases-heading"
      className="relative border-b border-ink/[0.06] bg-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div
          className={`max-w-[60ch] transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            See yourself in the page
          </div>
          <h2
            id="use-cases-heading"
            className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[30px] leading-[1.1] tracking-[-0.02em] sm:text-[40px]"
          >
            Choose the path that sounds most like your business.
          </h2>
        </div>

        <div
          className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {useCases.map((u) => {
            const open = openId === u.id;
            return (
              <article
                key={u.id}
                className={`rounded-2xl border p-5 transition-all duration-300 ease-cinema ${
                  open
                    ? "border-champagne-200/50 bg-champagne-50/40 shadow-[0_16px_40px_-20px_rgba(11,13,18,0.14)]"
                    : "border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(11,13,18,0.04)] hover:-translate-y-0.5 hover:border-ink/[0.16] hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)]"
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
                  <div className="font-general text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">
                    Owner says
                  </div>
                  <div className="mt-2 text-[16px] font-medium leading-snug text-ink">
                    “{u.quote}”
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-cinema ${
                    open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[13px] leading-relaxed text-ink/70">{u.recommendation}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a
                        href={u.primaryCTA.href}
                        onClick={() => {
                          const h = u.primaryCTA.href;
                          if (h === "/apply") track("apply_clicked_from_compare", { source: `use-case:${u.id}` });
                          else if (h === "/sample-briefing")
                            track("sample_briefing_clicked_from_compare", { source: `use-case:${u.id}` });
                          else if (h === "/templates")
                            track("templates_clicked_from_compare", { source: `use-case:${u.id}` });
                        }}
                        className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-4 py-2 text-[12px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        {u.primaryCTA.label}
                      </a>
                      <a
                        href={u.secondaryCTA.href}
                        className="text-[12px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
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

import { recommendedPaths } from "../content";
import { track } from "../analytics";

type Props = {
  activeId: string | null;
  onSelect: (id: string | null) => void;
};

export default function RecommendedStartingPaths({ activeId, onSelect }: Props) {
  return (
    <section
      aria-labelledby="paths-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Not sure where to start?
          </div>
          <h2
            id="paths-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Choose the question that sounds closest to what you are trying to understand.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedPaths.map((p) => {
            const active = activeId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  const next = active ? null : p.id;
                  onSelect(next);
                  track("recommended_path_selected", { pathId: p.id });
                  if (next) {
                    const el = document.getElementById("template-grid");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`group flex flex-col rounded-2xl border p-5 text-left transition-all duration-400 ease-cinema hover:-translate-y-0.5 ${
                  active
                    ? "border-champagne-200/55 bg-charcoal-900/70 shadow-[0_30px_70px_-30px_rgba(217,190,130,0.4)]"
                    : "border-ink/[0.07] bg-ink/[0.02] hover:border-champagne-200/30"
                }`}
              >
                <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-200/70">
                  {active ? "Highlighted in library" : "Owner question"}
                </div>
                <div className="mt-2 text-[18px] font-light leading-snug text-ink">“{p.question}”</div>
                <div className="mt-4 text-[12px] text-ink/55">
                  Highlights {p.templateIds.length} templates in the library
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-[12.5px] text-ink/85 transition-colors group-hover:text-champagne-200">
                  {p.cta} <span aria-hidden>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

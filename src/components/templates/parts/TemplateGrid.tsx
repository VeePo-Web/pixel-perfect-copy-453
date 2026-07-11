import TemplateCard from "./TemplateCard";
import type { TemplateItem } from "../content";

type Props = {
  templates: TemplateItem[];
  highlightedIds: Set<string>;
  onGet: (t: TemplateItem) => void;
  onPreview: (t: TemplateItem) => void;
};

export default function TemplateGrid({ templates, highlightedIds, onGet, onPreview }: Props) {
  return (
    <section
      id="template-grid"
      aria-labelledby="grid-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              GoldFin Template Vault
            </div>
            <h2
              id="grid-heading"
              className="mt-3 max-w-[26ch] font-display font-medium text-ink [text-wrap:balance] text-[28px] leading-[1.12] tracking-[-0.02em] sm:text-[36px]"
            >
              Find the template that matches what you are trying to understand.
            </h2>
          </div>
          <div className="hidden font-general text-[11px] tabular-nums text-ink/45 sm:block">
            {templates.length} template{templates.length === 1 ? "" : "s"}
          </div>
        </div>
        {templates.length === 0 ? (
          <div className="rounded-2xl border border-ink/[0.08] bg-white px-6 py-12 text-center text-[13px] text-ink/55 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
            No templates in this category yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {templates.map((t, i) => (
              <div
                key={t.id}
                style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
                className="motion-safe:animate-section-in"
              >
                <TemplateCard
                  template={t}
                  highlighted={highlightedIds.has(t.id)}
                  onGet={() => onGet(t)}
                  onPreview={() => onPreview(t)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

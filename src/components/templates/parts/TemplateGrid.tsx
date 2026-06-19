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
      className="relative border-b border-white/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
              Template Library
            </div>
            <h2
              id="grid-heading"
              className="mt-3 max-w-[26ch] font-light text-bone text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
            >
              Find the template that matches what you are trying to understand.
            </h2>
          </div>
          <div className="hidden text-[11.5px] text-bone/45 sm:block">
            {templates.length} template{templates.length === 1 ? "" : "s"}
          </div>
        </div>
        {templates.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-12 text-center text-[13px] text-bone/55">
            No templates in this category yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                highlighted={highlightedIds.has(t.id)}
                onGet={() => onGet(t)}
                onPreview={() => onPreview(t)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import type { TemplateItem } from "../content";
import SpreadsheetPreview from "./SpreadsheetPreview";
import { track } from "../analytics";

type Props = {
  template: TemplateItem;
  highlighted?: boolean;
  onGet: () => void;
  onPreview: () => void;
};

export default function TemplateCard({ template, highlighted, onGet, onPreview }: Props) {
  const diffDot = template.difficulty === "Beginner" ? "bg-green-signal" : "bg-champagne-300";
  const ref = useRef<HTMLElement | null>(null);
  const seen = useRef(false);
  useEffect(() => {
    if (!ref.current || seen.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !seen.current) {
            seen.current = true;
            track("template_card_viewed", { templateId: template.id });
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [template.id]);
  return (
    <article
      ref={ref}
      data-template-id={template.id}
      data-highlighted={highlighted ? "true" : "false"}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-ink/[0.02] p-5 transition-all duration-500 ease-cinema hover:-translate-y-0.5 hover:border-champagne-200/30 hover:bg-ink/[0.035] ${
        highlighted
          ? "border-champagne-200/55 shadow-[0_0_0_1px_rgba(217,190,130,0.25),0_30px_60px_-30px_rgba(217,190,130,0.35)]"
          : "border-ink/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-[10px] uppercase tracking-[0.26em] text-champagne-200/70">
          {template.category}
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] text-ink/55">
          <span className={`h-1.5 w-1.5 rounded-full ${diffDot}`} aria-hidden />
          {template.difficulty}
        </div>
      </div>
      <h3 className="mt-2 text-[17px] font-light leading-snug text-ink">{template.name}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65">{template.description}</p>

      <div className="relative mt-4 transition-transform duration-500 ease-cinema group-hover:-translate-y-1">
        <SpreadsheetPreview rows={template.previewRows.slice(0, 4)} title={template.shortName} dense />
      </div>

      <div className="mt-4 space-y-1 text-[11.5px] text-ink/55">
        <div>
          <span className="text-ink/40">Best for · </span>
          {template.bestFor}
        </div>
        <div>
          <span className="text-ink/40">Time · </span>
          {template.timeToUse}
        </div>
      </div>

      <p className="mt-3 max-h-0 overflow-hidden text-[12px] text-champagne-200/80 opacity-0 transition-all duration-500 ease-cinema group-hover:max-h-12 group-hover:opacity-100">
        {template.decisionLine}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            onGet();
            track("template_download_started", { templateId: template.id });
          }}
          className="min-h-[40px] rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:shadow-[0_10px_32px_-12px_rgba(217,190,130,0.6)]"
        >
          {template.ctaText}
        </button>
        <button
          type="button"
          onClick={() => {
            onPreview();
            track("template_preview_opened", { templateId: template.id });
          }}
          className="text-[12px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Preview
        </button>
      </div>

      <div className="mt-4 border-t border-ink/[0.06] pt-3">
        <a
          href="#/apply"
          className="text-[11.5px] text-ink/50 transition-colors hover:text-champagne-200"
          onClick={() => track("apply_clicked_from_templates", { source: "card", templateId: template.id })}
        >
          Want this automated? <span className="underline-offset-4 hover:underline">Monthly Finance Desk →</span>
        </a>
      </div>
    </article>
  );
}

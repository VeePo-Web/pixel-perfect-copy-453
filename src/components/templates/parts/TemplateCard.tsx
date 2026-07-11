import { useEffect, useRef } from "react";
import { startAutoFillCheckout } from "../../../lib/checkout";
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-500 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)] ${
        highlighted
          ? "border-champagne-300/50 shadow-[0_16px_40px_-20px_rgba(184,137,58,0.30)]"
          : "border-ink/[0.08] shadow-[0_1px_2px_rgba(11,13,18,0.04)] hover:border-ink/[0.14]"
      }`}
    >
      {/* Premium hover hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent opacity-0 transition-opacity duration-500 ease-cinema group-hover:opacity-100"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="font-general text-[10px] uppercase tracking-[0.26em] text-champagne-300/70">
          {template.category}
        </div>
        <div className="flex items-center gap-1.5 font-general text-[10px] uppercase tracking-[0.14em] text-ink/55">
          <span className={`h-1.5 w-1.5 rounded-full ${diffDot}`} aria-hidden />
          {template.difficulty}
        </div>
      </div>
      <h3 className="mt-2 text-[17px] font-medium leading-snug text-ink">{template.name}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65">{template.description}</p>

      <div className="relative mt-4 transition-transform duration-500 ease-cinema group-hover:-translate-y-1">
        <SpreadsheetPreview rows={template.previewRows.slice(0, 4)} title={template.shortName} dense />
      </div>

      <div className="mt-4 divide-y divide-ink/[0.06] border-t border-ink/[0.06] text-[12px] text-ink/65">
        <div className="py-2">
          <span className="font-general text-[9.5px] uppercase tracking-[0.18em] text-ink/40">Best for · </span>
          {template.bestFor}
        </div>
        <div className="py-2">
          <span className="font-general text-[9.5px] uppercase tracking-[0.18em] text-ink/40">Time · </span>
          {template.timeToUse}
        </div>
      </div>

      <p className="mt-3 max-h-0 overflow-hidden text-[12px] text-ink/55 opacity-0 transition-all duration-500 ease-cinema group-hover:max-h-24 group-hover:opacity-100">
        {template.decisionLine}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            onGet();
            track("template_download_started", { templateId: template.id });
          }}
          className="min-h-[44px] rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-5 py-2 text-[12.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {template.ctaText}
        </button>
        <button
          type="button"
          onClick={() => {
            onPreview();
            track("template_preview_opened", { templateId: template.id });
          }}
          className="min-h-[44px] rounded-md px-1 text-[12px] text-ink/55 underline-offset-4 transition-all duration-300 ease-cinema hover:text-ink hover:underline active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/60 focus-visible:ring-offset-white"
        >
          Preview
        </button>
      </div>

      <div className="mt-4 border-t border-ink/[0.06] pt-3">
        <button
          type="button"
          className="text-[11.5px] text-ink/50 transition-colors hover:text-champagne-300"
          onClick={() => { startAutoFillCheckout(); track("autofill_clicked_from_templates", { source: "card", templateId: template.id }); }}
        >
          Want this filled for you every month? <span className="underline-offset-4 hover:underline">GoldFin Reports · $150/mo →</span>
        </button>
      </div>
    </article>
  );
}

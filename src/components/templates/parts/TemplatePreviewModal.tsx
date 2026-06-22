import ModalShell from "./ModalShell";
import SpreadsheetPreview from "./SpreadsheetPreview";
import type { TemplateItem } from "../content";

type Props = {
  template: TemplateItem | null;
  onClose: () => void;
  onGet: () => void;
};

export default function TemplatePreviewModal({ template, onClose, onGet }: Props) {
  if (!template) return null;
  return (
    <ModalShell open={!!template} onClose={onClose} labelledBy="preview-heading" size="panel">
      <div className="flex items-center justify-between border-b border-ink/[0.06] px-6 py-4">
        <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
          Template Preview
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="rounded-full border border-ink/[0.08] px-3 py-1 text-[11.5px] text-ink/70 transition-colors hover:border-ink/20 hover:text-ink"
        >
          Close
        </button>
      </div>

      <div className="px-6 py-6">
        <h2 id="preview-heading" className="text-[24px] font-light leading-snug text-ink">
          {template.name}
        </h2>
        <p className="mt-2 text-[13.5px] text-ink/65">{template.description}</p>

        <div className="mt-5">
          <SpreadsheetPreview rows={template.previewRows} title={template.shortName} />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/[0.06] pt-5 text-[12.5px]">
          <Pair label="Best for" value={template.bestFor} />
          <Pair label="Time to use" value={template.timeToUse} />
          <Pair label="Difficulty" value={template.difficulty} />
          <Pair label="Category" value={template.category} />
        </dl>

        <div className="mt-6 rounded-xl border border-ink/[0.07] bg-ink/[0.02] p-4">
          <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">
            What it helps you decide
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink/80">{template.decisionLine}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onGet}
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema hover:shadow-[0_14px_40px_-12px_rgba(217,190,130,0.6)]"
          >
            {template.ctaText}
          </button>
          <a
            href="#/apply"
            className="rounded-full border border-ink/[0.12] px-6 py-3 text-center text-[12.5px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink"
          >
            Want this automated and reviewed monthly? Apply for the GoldFin Desk
          </a>
        </div>
      </div>
    </ModalShell>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10.5px] uppercase tracking-[0.24em] text-ink/40">{label}</dt>
      <dd className="mt-1 text-ink/80">{value}</dd>
    </div>
  );
}

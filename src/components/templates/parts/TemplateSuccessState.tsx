import type { TemplateItem } from "../content";
import { track } from "../analytics";

type Props = {
  template: TemplateItem;
  onClose: () => void;
  headingId: string;
};

export default function TemplateSuccessState({ template, onClose, headingId }: Props) {
  return (
    <div className="p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/80">
            Sent
          </div>
          <h2 id={headingId} className="mt-2 text-[22px] font-light leading-snug text-ink">
            Your template is on its way.
          </h2>
          <p className="mt-2 text-[13.5px] text-ink/65">
            Check your inbox for the {template.shortName} download link. While you wait, preview what this becomes inside the Monthly Finance Desk.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="rounded-full border border-ink/[0.08] px-2.5 py-1 text-[11px] text-ink/60 hover:text-ink"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <a
          href="#/sample-briefing"
          onClick={() => track("sample_briefing_clicked_from_templates", { source: "success", templateId: template.id })}
          className="block rounded-2xl border border-champagne-200/30 bg-charcoal-900/70 p-4 transition-all duration-300 ease-cinema hover:border-champagne-200/55"
        >
          <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-200/85">Recommended next</div>
          <div className="mt-1.5 text-[15px] text-ink">Generate Sample Finance Briefing</div>
          <div className="mt-1 text-[12.5px] text-ink/60">See what this becomes when automated and interpreted monthly.</div>
        </a>
        <a
          href="#/apply"
          onClick={() => track("apply_clicked_from_templates", { source: "success", templateId: template.id })}
          className="block rounded-2xl border border-ink/[0.08] bg-ink/[0.02] p-4 transition-all duration-300 ease-cinema hover:border-ink/20"
        >
          <div className="text-[15px] text-ink">Apply for the Monthly Finance Desk</div>
          <div className="mt-1 text-[12.5px] text-ink/55">$1,500/month. No bank connection required to apply.</div>
        </a>
        <button
          type="button"
          onClick={onClose}
          className="block w-full rounded-2xl border border-ink/[0.06] bg-transparent p-4 text-left transition-colors hover:border-ink/15"
        >
          <div className="text-[15px] text-ink/85">Browse more templates</div>
          <div className="mt-1 text-[12.5px] text-ink/50">Keep exploring the library.</div>
        </button>
      </div>
    </div>
  );
}

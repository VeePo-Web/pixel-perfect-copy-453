import type { DemoBusiness } from "../content";
import ModuleShell from "./ModuleShell";

type Props = { business: DemoBusiness };

export default function ExecutiveSummaryCard({ business }: Props) {
  return (
    <ModuleShell
      id="executive-summary"
      eyebrow="Executive Summary"
      title="What this period is telling you."
      cta={
        <a
          href="#/apply"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium tracking-wide text-navy transition-all duration-400 ease-cinema hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)]"
        >
          Apply to Get This for Your Real Numbers
          <span aria-hidden>→</span>
        </a>
      }
    >
      <p className="max-w-[68ch] text-[16px] leading-[1.75] text-ink/85">
        {business.executiveSummary}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {business.summaryTags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-ink/[0.1] bg-ink/[0.02] px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-ink/70"
          >
            {t}
          </span>
        ))}
      </div>
    </ModuleShell>
  );
}

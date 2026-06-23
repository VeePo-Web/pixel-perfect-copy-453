import type { DemoBusiness } from "../content";
import ModuleShell from "./ModuleShell";

export default function MonthlyStrategyFocus({ business }: { business: DemoBusiness }) {
  return (
    <ModuleShell
      id="monthly-focus"
      eyebrow="Monthly Strategy Call Focus"
      title="What this would become in your monthly review."
      cta={
        <a
          href="#/apply"
          className="inline-flex items-center gap-2 rounded-full border border-champagne-200/40 px-6 py-3 text-[13px] tracking-wide text-ink transition-all duration-300 ease-cinema hover:border-champagne-200 hover:bg-champagne-300/[0.06]"
        >
          Apply to Build Your Monthly Finance Rhythm
          <span aria-hidden>â†’</span>
        </a>
      }
    >
      <p className="max-w-[64ch] text-[14.5px] leading-[1.7] text-ink/75">
        The briefing gives you the questions. The monthly call gives you a focused moment to review what they mean for the business.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/[0.08] bg-charcoal-900/60">
        <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
              Monthly Strategy Review Agenda
            </div>
            <div className="mt-1 text-[13px] text-ink/80">{business.reportTitle}</div>
          </div>
          <span className="rounded-full border border-ink/[0.1] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-ink/65">
            1-hour monthly review
          </span>
        </div>
        <ol className="divide-y divide-ink/[0.05]">
          {business.monthlyFocus.map((item, i) => (
            <li key={item} className="grid grid-cols-[40px_1fr] items-center gap-3 px-5 py-4">
              <span className="text-[11px] tabular-nums text-ink/40">0{i + 1}</span>
              <span className="text-[14.5px] text-ink/90">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </ModuleShell>
  );
}

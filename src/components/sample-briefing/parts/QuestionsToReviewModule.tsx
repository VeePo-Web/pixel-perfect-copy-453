import type { DemoBusiness } from "../content";
import ModuleShell from "./ModuleShell";

export default function QuestionsToReviewModule({ business }: { business: DemoBusiness }) {
  return (
    <ModuleShell
      id="questions"
      eyebrow="Questions to Review"
      title="The questions an owner should be asking next."
    >
      <ol className="space-y-3">
        {business.questions.map((q, i) => (
          <li
            key={q}
            className="flex items-start gap-4 rounded-xl border border-ink/[0.06] bg-ink/[0.015] px-5 py-4 transition-all duration-300 ease-cinema hover:border-champagne-200/25 hover:bg-ink/[0.03]"
          >
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-champagne-200/30 text-[11px] tabular-nums text-champagne-100">
              {i + 1}
            </span>
            <span className="text-[15px] leading-[1.6] text-ink/90">{q}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[13px] text-ink/55">
        A good briefing should not just report numbers. It should surface the questions an owner needs to ask.
      </p>
    </ModuleShell>
  );
}

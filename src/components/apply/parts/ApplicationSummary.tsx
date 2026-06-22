import type { ApplicationState } from "../hooks/useApplicationState";

type Row = { label: string; value: string; step: number };

export default function ApplicationSummary({
  state,
  onEdit,
}: {
  state: ApplicationState;
  onEdit: (step: number) => void;
}) {
  const rows: Row[] = [
    { label: "Business", value: `${state.business_name || "—"} · ${state.business_type || "—"}`, step: 1 },
    { label: "Revenue range", value: state.revenue_range || "—", step: 1 },
    { label: "Current tools", value: state.current_tools.join(", ") || "—", step: 2 },
    { label: "What feels unclear", value: state.clarity_gap || "—", step: 2 },
    { label: "Decisions to review", value: state.decisions.join(", ") || "—", step: 3 },
    { label: "What clarity would change", value: state.clarity_outcome || "—", step: 3 },
    { label: "Monthly review willingness", value: state.monthly_review || "—", step: 4 },
    { label: "Budget fit", value: state.budget_fit || "—", step: 4 },
    { label: "Worth-it goal", value: state.worth_it || "—", step: 4 },
    { label: "Timeline", value: state.timeline || "—", step: 4 },
  ];
  return (
    <div className="divide-y divide-ink/[0.06] overflow-hidden rounded-2xl border border-ink/[0.06] bg-charcoal-900/40">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[140px_1fr_auto] items-start gap-4 px-5 py-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink/40">{r.label}</div>
          <div className="text-[14px] leading-[1.55] text-ink/85 break-words">{r.value}</div>
          <button
            onClick={() => onEdit(r.step)}
            className="text-[12px] text-champagne-300/80 hover:text-champagne-300 underline-offset-4 hover:underline"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}

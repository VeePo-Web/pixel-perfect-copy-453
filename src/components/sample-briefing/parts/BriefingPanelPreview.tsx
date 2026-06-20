import { type DemoBusiness } from "../content";
import BriefingGenerationState from "./BriefingGenerationState";
import MiniLineChart from "../charts/MiniLineChart";

type Props = {
  business: DemoBusiness;
  status: "idle" | "loading" | "ready";
  loaderIndex: number;
};

const fmt = (n: number) => `$${n.toLocaleString()}`;
const delta = (n: number) =>
  `${n >= 0 ? "+" : ""}${n}% vs prior period`;

export default function BriefingPanelPreview({ business, status, loaderIndex }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-champagne-200/15 bg-charcoal-900/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent" />
      <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/70">
            Sample bi-weekly briefing
          </div>
          <div className="mt-1 text-[13px] text-bone/85">{business.reportTitle}</div>
        </div>
        <div className="rounded-full border border-ink/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-bone/55">
          Demo data
        </div>
      </div>

      {status === "loading" ? (
        <div className="p-6">
          <BriefingGenerationState activeIndex={loaderIndex} />
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 overflow-hidden rounded-lg border border-ink/[0.05] bg-ink/[0.02]"
              >
                <div className="h-full w-full motion-safe:animate-shimmer-slow bg-gradient-to-r from-transparent via-ink/[0.04] to-transparent" />
              </div>
            ))}
          </div>
        </div>
      ) : status === "ready" ? (
        <div className="p-6 motion-safe:animate-panel-rise">
          <div className="grid grid-cols-3 gap-3">
            <Kpi label="Cash" value={fmt(business.cash)} sub={delta(business.cashDelta)} positive={business.cashDelta >= 0} />
            <Kpi label="Revenue" value={fmt(business.revenue)} sub={delta(business.revenueDelta)} positive={business.revenueDelta >= 0} />
            <Kpi
              label="Expenses"
              value={fmt(business.expenses)}
              sub={delta(business.expensesDelta)}
              positive={business.expensesDelta <= 0}
            />
          </div>
          <div className="mt-5 rounded-lg border border-ink/[0.05] bg-ink/[0.02] p-4">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/55">Cash trend</div>
            <div className="mt-3 h-[120px] w-full">
              <MiniLineChart values={business.cashSeries} height={120} width={520} accent="#C9A35A" className="h-full w-full" />
            </div>
          </div>
          <p className="mt-5 text-[13.5px] leading-[1.65] text-bone/80">
            {business.executiveSummary}
          </p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {["Cash Movement", "Revenue Trend", "Expense Pattern", "Unusual Spend", "Questions to Review", "Decisions to Consider"].map(
              (label) => (
                <div
                  key={label}
                  className="rounded-lg border border-ink/[0.05] bg-ink/[0.015] px-4 py-5"
                >
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/45">{label}</div>
                  <div className="mt-3 h-2 w-3/4 rounded bg-ink/[0.05]" />
                  <div className="mt-2 h-2 w-1/2 rounded bg-ink/[0.04]" />
                </div>
              )
            )}
          </div>
          <p className="mt-6 text-[12px] text-bone/45">
            Choose a demo business or describe your own to generate a sample briefing preview.
          </p>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, sub, positive }: { label: string; value: string; sub: string; positive: boolean }) {
  return (
    <div className="rounded-lg border border-ink/[0.06] bg-ink/[0.02] p-4">
      <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/55">{label}</div>
      <div className="mt-2 text-[18px] tabular-nums text-bone">{value}</div>
      <div className={`mt-1 text-[11.5px] ${positive ? "text-green-signal" : "text-champagne-200"}`}>{sub}</div>
    </div>
  );
}

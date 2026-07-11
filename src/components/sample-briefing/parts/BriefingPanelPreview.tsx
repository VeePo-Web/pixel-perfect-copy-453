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

// Idle state sells the briefing: each section + the question it answers.
const SECTIONS: { label: string; desc: string }[] = [
  { label: "Cash Movement", desc: "What actually changed in cash" },
  { label: "Revenue Trend", desc: "Where revenue is heading" },
  { label: "Expense Pattern", desc: "Where the money went" },
  { label: "Unusual Spend", desc: "Anything to flag this cycle" },
  { label: "Questions to Review", desc: "What to look at next" },
  { label: "Decisions to Consider", desc: "The 2-3 moves that matter" },
];

export default function BriefingPanelPreview({ business, status, loaderIndex }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-champagne-200/15 bg-charcoal-900/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent" />
      <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
            Sample bi-weekly briefing
          </div>
          <div className="mt-1 text-[13px] text-ink/85">{business.reportTitle}</div>
        </div>
        <div className="rounded-full border border-ink/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-ink/55">
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
                <div className="h-full w-full bg-gradient-to-r from-transparent via-ink/[0.04] to-transparent" />
              </div>
            ))}
          </div>
        </div>
      ) : status === "ready" ? (
        <div className="p-6 motion-safe:animate-panel-rise">
          {/* Plain-English verdict FIRST: the "are we okay?" answer — one number + read. */}
          <div className="rounded-xl border border-champagne-200/25 bg-[rgba(201,163,90,0.05)] p-4">
            <div className="text-[10px] uppercase tracking-[0.24em] text-champagne-300/80">
              Plain-English verdict
            </div>
            <p className="mt-2 text-[15px] leading-[1.55] text-ink">
              <span className="font-medium tabular-nums">{`Cash ${fmt(business.cash)} (${business.cashDelta >= 0 ? "+" : ""}${business.cashDelta}%)`}</span>
              {" — watch: "}
              {business.mainRisk}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
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
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">Cash trend</div>
            <div className="mt-3 h-[120px] w-full">
              <MiniLineChart values={business.cashSeries} height={120} width={520} accent="#C9A35A" className="h-full w-full" />
            </div>
          </div>
          <p className="mt-5 text-[13.5px] leading-[1.65] text-ink/80">
            {business.executiveSummary}
          </p>
        </div>
      ) : (
        <div className="p-6 motion-safe:animate-panel-rise">
          <div className="text-[10px] uppercase tracking-[0.24em] text-champagne-300/70">
            Your briefing will answer
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {SECTIONS.map((s, i) => (
              <div
                key={s.label}
                className="rounded-lg border border-ink/[0.06] bg-ink/[0.015] px-4 py-3.5 transition-colors duration-300 hover:border-champagne-200/25"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-champagne-200/30 bg-champagne-300/[0.08] text-[9.5px] font-medium tabular-nums text-champagne-300">
                    {i + 1}
                  </span>
                  <div className="text-[11.5px] font-medium leading-tight text-ink/85">{s.label}</div>
                </div>
                <div className="mt-1.5 text-[11px] leading-[1.5] text-ink/55">{s.desc}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-[12px] text-ink/55">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-champagne-300/70"
            />
            Pick a business above to generate the full briefing →
          </p>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, sub, positive }: { label: string; value: string; sub: string; positive: boolean }) {
  return (
    <div className="rounded-lg border border-ink/[0.06] bg-ink/[0.02] p-4">
      <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">{label}</div>
      <div className="mt-2 text-[18px] tabular-nums text-ink">{value}</div>
      <div className={`mt-1 text-[11.5px] ${positive ? "text-green-signal" : "text-red-signal"}`}>{sub}</div>
    </div>
  );
}

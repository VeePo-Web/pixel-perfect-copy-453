import type { DemoBusiness } from "../content";
import ModuleShell from "./ModuleShell";
import MiniLineChart from "../charts/MiniLineChart";
import ConcentrationMeter from "../charts/ConcentrationMeter";

const fmt = (n: number) => `$${n.toLocaleString()}`;

export default function RevenueTrendModule({ business }: { business: DemoBusiness }) {
  const positive = business.revenueDelta >= 0;
  return (
    <ModuleShell id="revenue-trend" eyebrow="Revenue Trend" title="Growth, with context.">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-ink/[0.07] bg-ink/[0.02] p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">Total revenue</div>
              <div className="mt-2 text-[30px] font-light tabular-nums text-ink">{fmt(business.revenue)}</div>
              <div className={`mt-1 text-[12.5px] ${positive ? "text-green-signal" : "text-champagne-200"}`}>
                {positive ? "+" : ""}{business.revenueDelta}% vs prior 2 weeks
              </div>
            </div>
          </div>
          <div className="mt-4 h-[160px] w-full">
            <MiniLineChart values={business.revenueSeries} height={160} width={560} accent="#3F7A5E" className="h-full w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-ink/[0.07] bg-ink/[0.02] p-5">
            <ConcentrationMeter value={business.topClientConcentration} />
            <p className="mt-4 text-[14px] leading-[1.65] text-ink/80">{business.insights.revenue}</p>
          </div>
          <div className="rounded-lg border border-champagne-200/20 bg-champagne-300/[0.04] p-4">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-champagne-300/70">Watch</div>
            <p className="mt-1.5 text-[13px] text-ink/85">
              Concentration risk worth raising on the monthly call before committing to new fixed costs.
            </p>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}

import type { DemoBusiness } from "../content";
import ModuleShell from "./ModuleShell";
import MiniLineChart from "../charts/MiniLineChart";

const fmt = (n: number) => `$${n.toLocaleString()}`;

export default function CashMovementModule({ business }: { business: DemoBusiness }) {
  const positive = business.cashDelta >= 0;
  return (
    <ModuleShell id="cash-movement" eyebrow="Cash Movement" title="What actually changed in cash this period.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/55">Cash balance</div>
            <div className="mt-2 text-[34px] font-light tabular-nums text-bone">{fmt(business.cash)}</div>
            <div className={`mt-1 text-[12.5px] ${positive ? "text-green-signal" : "text-champagne-200"}`}>
              {positive ? "+" : ""}{business.cashDelta}% vs prior 2 weeks
            </div>
          </div>
          <p className="text-[11.5px] uppercase tracking-[0.2em] text-bone/40">
            Your bank account shows what is left. The briefing explains what changed and why it matters.
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/55">Trailing trend</div>
          <div className="mt-3 h-[160px] w-full">
            <MiniLineChart values={business.cashSeries} height={160} width={560} accent="#C9A35A" className="h-full w-full" />
          </div>
          <div className="mt-4 rounded-lg border border-white/[0.06] bg-charcoal-900/60 p-4">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/55">What this means</div>
            <p className="mt-2 text-[14.5px] leading-[1.7] text-bone/85">{business.insights.cash}</p>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}

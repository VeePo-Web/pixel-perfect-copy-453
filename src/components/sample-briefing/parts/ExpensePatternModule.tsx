import type { DemoBusiness } from "../content";
import ModuleShell from "./ModuleShell";
import Donut, { DONUT_PALETTE } from "../charts/Donut";

const fmt = (n: number) => `$${n.toLocaleString()}`;

export default function ExpensePatternModule({ business }: { business: DemoBusiness }) {
  const up = business.expensesDelta >= 0;
  return (
    <ModuleShell id="expense-pattern" eyebrow="Expense Pattern" title="Where the money went, and what is moving.">
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
          <Donut slices={business.expenseMix} size={210} />
          <div className="mt-4 text-center">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/55">Total expenses</div>
            <div className="mt-1 text-[22px] font-light tabular-nums text-bone">{fmt(business.expenses)}</div>
            <div className={`mt-1 text-[12px] ${up ? "text-champagne-200" : "text-green-signal"}`}>
              {up ? "+" : ""}{business.expensesDelta}% vs prior 2 weeks
            </div>
          </div>
        </div>
        <div>
          <ul className="divide-y divide-white/[0.05] overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">
            {business.expenseMix.map((s, i) => (
              <li key={s.label} className="grid grid-cols-[16px_1fr_auto_auto] items-center gap-4 px-4 py-3.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: DONUT_PALETTE[i % DONUT_PALETTE.length] }}
                  aria-hidden
                />
                <span className="text-[14px] text-bone/85">{s.label}</span>
                <span className="text-[12.5px] tabular-nums text-bone/55">{s.pct}%</span>
                <span className="text-[13px] tabular-nums text-bone">{fmt(s.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-lg border border-champagne-200/20 bg-champagne-300/[0.04] p-4">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-champagne-200/80">Review before hiring</div>
            <p className="mt-1.5 text-[14px] leading-[1.65] text-bone/85">{business.insights.expenses}</p>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}

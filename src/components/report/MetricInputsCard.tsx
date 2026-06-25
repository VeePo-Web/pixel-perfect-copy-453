// Captures the period inputs that unlock the vertical lead metric + growth gate
// the bank feed alone can't compute: order count (CM/order), WIP jobs (under-
// billing), average inventory (GMROI), billable/available hours (utilization),
// and LTV/CAC (the growth gate). Owner's own data — written directly under
// own-row RLS (business_metric_inputs). Only the fields relevant to the owner's
// industry are shown, so the form stays short.
import { useEffect, useMemo, useState } from "react";
import { useBusinessProfile } from "@/lib/report/useBusinessProfile";
import { useMetricInputs, type MetricInputs, type WipJob } from "@/lib/report/useMetricInputs";

const fieldCls =
  "mt-1.5 w-full rounded-lg border border-charcoal-700 bg-paper px-3 py-2 text-[14px] tabular-nums text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40";

const num = (s: string): number | null => {
  const t = s.replace(/[$,\s]/g, "");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};
const str = (n: number | null | undefined): string => (n == null ? "" : String(n));

function NumberField({
  label, hint, value, onChange,
}: { label: string; hint?: string; value: number | null | undefined; onChange: (n: number | null) => void }) {
  return (
    <label className="block text-[12.5px] text-ink/70">
      {label}
      <input
        type="text" inputMode="decimal" value={str(value)}
        onChange={(e) => onChange(num(e.target.value))}
        placeholder="—" className={fieldCls}
      />
      {hint && <span className="mt-1 block text-[11px] text-ink/40">{hint}</span>}
    </label>
  );
}

export default function MetricInputsCard() {
  const { profile } = useBusinessProfile();
  const { inputs, loading, saving, savedAt, error, save } = useMetricInputs();
  const industry = profile?.industry ?? "other";

  const [form, setForm] = useState<MetricInputs | null>(null);
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (!loading && !seeded) { setForm(inputs ?? {}); setSeeded(true); }
  }, [loading, seeded, inputs]);

  const f = form ?? {};
  const set = (patch: Partial<MetricInputs>) => setForm({ ...f, ...patch });

  const show = useMemo(() => ({
    orders: ["ecommerce", "saas", "other"].includes(industry),
    inventory: industry === "retail",
    hours: ["agency", "professional_services"].includes(industry),
    jobs: industry === "contractor",
  }), [industry]);

  const jobs: WipJob[] = f.jobs ?? [];
  const setJob = (i: number, patch: Partial<WipJob>) =>
    set({ jobs: jobs.map((j, k) => (k === i ? { ...j, ...patch } : j)) });
  const addJob = () => set({ jobs: [...jobs, { name: "", pctComplete: 0, contract: 0, billed: 0 }] });
  const removeJob = (i: number) => set({ jobs: jobs.filter((_, k) => k !== i) });

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl border border-charcoal-700 bg-paper-raised" />;
  }

  const nothingForIndustry = !show.orders && !show.inventory && !show.hours && !show.jobs;

  return (
    <section className="rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/80">Unlock your numbers</div>
      <h3 className="mt-2 text-[18px] font-light text-ink">A few inputs the bank can't see</h3>
      <p className="mt-1 text-[13px] leading-[1.6] text-ink/55">
        These unlock the metric your industry lives or dies by, plus a safe reinvestment budget. Optional — leave
        blank and your report scopes around what's missing. Never guessed.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {show.orders && (
          <NumberField label="Orders this period" hint="Unlocks contribution margin per order"
            value={f.orders} onChange={(n) => set({ orders: n })} />
        )}
        {show.inventory && (
          <NumberField label="Average inventory (at cost)" hint="Unlocks turnover & GMROI"
            value={f.avgInventory} onChange={(n) => set({ avgInventory: n })} />
        )}
        {show.hours && (
          <>
            <NumberField label="Billable hours" hint="Unlocks utilization"
              value={f.billableHours} onChange={(n) => set({ billableHours: n })} />
            <NumberField label="Available hours" hint="Total capacity this period"
              value={f.availableHours} onChange={(n) => set({ availableHours: n })} />
          </>
        )}
        <NumberField label="Customer lifetime value (LTV)" hint="For the growth gate (LTV:CAC ≥ 3:1)"
          value={f.ltv} onChange={(n) => set({ ltv: n })} />
        <NumberField label="Customer acquisition cost (CAC)" hint="For the growth gate"
          value={f.cac} onChange={(n) => set({ cac: n })} />
      </div>

      {show.jobs && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-ink/70">Active jobs (WIP)</span>
            <span className="text-[11px] text-ink/40">Unlocks underbilled cash trapped</span>
          </div>
          <div className="mt-2 space-y-2">
            {jobs.map((j, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2">
                <input type="text" value={j.name} placeholder="Job name"
                  onChange={(e) => setJob(i, { name: e.target.value })}
                  className={`col-span-4 ${fieldCls} mt-0`} />
                <input type="text" inputMode="decimal" value={str(j.pctComplete)} placeholder="% done"
                  onChange={(e) => setJob(i, { pctComplete: num(e.target.value) ?? 0 })}
                  className={`col-span-2 ${fieldCls} mt-0`} />
                <input type="text" inputMode="decimal" value={str(j.contract)} placeholder="Contract $"
                  onChange={(e) => setJob(i, { contract: num(e.target.value) ?? 0 })}
                  className={`col-span-3 ${fieldCls} mt-0`} />
                <input type="text" inputMode="decimal" value={str(j.billed)} placeholder="Billed $"
                  onChange={(e) => setJob(i, { billed: num(e.target.value) ?? 0 })}
                  className={`col-span-2 ${fieldCls} mt-0`} />
                <button type="button" onClick={() => removeJob(i)} aria-label="Remove job"
                  className="col-span-1 text-[16px] text-ink/40 transition-colors hover:text-red-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40">
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addJob}
            className="mt-2 text-[12.5px] text-gold-700 transition-colors hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40">
            + Add a job
          </button>
        </div>
      )}

      {nothingForIndustry && (
        <p className="mt-4 text-[12px] text-ink/45">
          For {industry.replace(/_/g, " ")}, your lead metric comes from your bank feed and template — LTV and CAC
          above unlock the growth budget.
        </p>
      )}

      <div className="mt-5 flex items-center gap-4">
        <button type="button" onClick={() => form && void save(form)} disabled={saving}
          className="rounded-full bg-ink px-5 py-2 text-[13px] text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 disabled:opacity-50">
          {saving ? "Saving…" : "Save inputs"}
        </button>
        {savedAt && !saving && <span className="text-[12px] text-green-signal">Saved — regenerate to apply</span>}
        {error && <span className="text-[12px] text-ink/45">{error}</span>}
      </div>
    </section>
  );
}

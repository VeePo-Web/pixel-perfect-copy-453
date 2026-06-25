// "Download your filled templates" — the in-portal surface that finally delivers
// what the marketing sells: the named spreadsheet templates, auto-filled from the
// owner's real numbers. It maps the report's server-authoritative metrics_snapshot
// to ProductMetrics, runs the SAME anti-hallucination gate as the advisory report
// (safeTemplatesCsv → traceableValues), and hands back a CSV the owner opens in
// Excel / Google Sheets / Numbers. Frontend-only; no recompute, nothing invented.
import { useState } from "react";
import type { MetricsSnapshot } from "@/lib/report/types";
import { fillAllTemplates, traceableValues, type ProductMetrics } from "@/lib/finance/productTemplates";
import { safeTemplatesCsv } from "@/lib/finance/productTemplatesCsv";

/** Pick exactly the fields the template builders read — explicit so drift is caught. */
function toProductMetrics(m: MetricsSnapshot): ProductMetrics {
  return {
    period: m.period,
    cashOnHand: m.cashOnHand,
    inflow: m.inflow,
    outflow: m.outflow,
    netCash: m.netCash,
    monthlyBurn: m.monthlyBurn,
    runwayMonths: m.runwayMonths,
    ownerPay: m.ownerPay,
    waste: m.waste,
    wasteAnnualTotal: m.wasteAnnualTotal,
    costCreep: m.costCreep,
    coveragePct: m.coveragePct,
    transactionsCount: m.transactionsCount,
    profile: { reserve_floor_months: m.profile.reserve_floor_months },
  };
}

const TEMPLATE_NAMES = "Monthly Review · Cash Flow Forecast · Owner Pay · Subscription Audit · Tax Reserve";

export default function TemplateDownloadCard({
  m,
  periodEnd,
}: {
  m: MetricsSnapshot;
  periodEnd: string | null;
}) {
  const [error, setError] = useState<string | null>(null);

  function download() {
    try {
      const pm = toProductMetrics(m);
      const csv = safeTemplatesCsv(fillAllTemplates(pm), traceableValues(pm));
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `goldfin-templates-${periodEnd ?? "current"}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setError(null);
    } catch {
      // The gate refused an untraceable cell — never expose the technical reason.
      setError("We're double-checking these numbers before they download. Try again shortly.");
    }
  }

  return (
    <section className="mt-2 rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <div className="text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">Your templates</div>
      <h2 className="mt-2 font-light text-ink text-[19px] leading-[1.2] tracking-[-0.01em]">
        Five spreadsheets, filled from your numbers
      </h2>
      <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.7] text-ink/60">
        {TEMPLATE_NAMES}. Every cell traces to your real data — open them in Excel, Google Sheets, or Numbers.
      </p>
      <button
        type="button"
        onClick={download}
        className="mt-5 rounded-full bg-ink px-5 py-2.5 text-[13.5px] text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
      >
        Download my filled templates
      </button>
      {error && <p className="mt-3 text-[12px] text-ink/45">{error}</p>}
    </section>
  );
}

// "Your templates" — the in-portal surface that delivers what the marketing sells:
// the five named spreadsheets, auto-filled from the owner's real numbers and shown
// ON SCREEN (the way Ramp/Digits present data — not just a file). Maps the report's
// server-authoritative metrics_snapshot to ProductMetrics, renders each FilledTemplate
// via the shared FilledTemplateTable, and offers download-all OR any single template —
// each passed through the same anti-hallucination gate (safeTemplatesCsv →
// traceableValues). Frontend-only; no recompute, nothing invented.
import { useMemo, useState } from "react";
import type { MetricsSnapshot } from "@/lib/report/types";
import type { FilledTemplate } from "@/lib/finance/types";
import { fillAllTemplates, traceableValues, type ProductMetrics } from "@/lib/finance/productTemplates";
import { safeTemplatesCsv, templateFileName } from "@/lib/finance/productTemplatesCsv";
import FilledTemplateTable from "./FilledTemplateTable";

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

function triggerDownload(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const GATE_ERROR = "We're double-checking these numbers before they download. Try again shortly.";

export default function TemplateDownloadCard({
  m,
  periodEnd,
}: {
  m: MetricsSnapshot;
  periodEnd: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const pm = useMemo(() => toProductMetrics(m), [m]);
  const allowed = useMemo(() => traceableValues(pm), [pm]);
  const templates = useMemo(() => fillAllTemplates(pm), [pm]);

  function downloadAll() {
    try {
      triggerDownload(`goldfin-templates-${periodEnd ?? "current"}.csv`, safeTemplatesCsv(templates, allowed));
      setError(null);
    } catch {
      setError(GATE_ERROR); // gate refused an untraceable cell — never expose the technical reason
    }
  }

  function downloadOne(t: FilledTemplate) {
    try {
      triggerDownload(templateFileName(t), safeTemplatesCsv([t], allowed));
      setError(null);
    } catch {
      setError(GATE_ERROR);
    }
  }

  return (
    <section className="mt-2 rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">Your templates</div>
          <h2 className="mt-2 font-light text-ink text-[19px] leading-[1.2] tracking-[-0.01em]">
            Five spreadsheets, filled from your numbers
          </h2>
        </div>
        <button
          type="button"
          onClick={downloadAll}
          className="shrink-0 rounded-full bg-ink px-4 py-2 text-[12.5px] text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
        >
          Download all (CSV)
        </button>
      </div>
      <p className="mt-2 max-w-[52ch] text-[13px] leading-[1.7] text-ink/55">
        Every cell traces to your real data — read them here, or open any in Excel, Google Sheets, or Numbers.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {templates.map((t) => (
          <FilledTemplateTable key={t.title} t={t} onDownload={() => downloadOne(t)} />
        ))}
      </div>

      {error && <p className="mt-3 text-[12px] text-ink/45">{error}</p>}
    </section>
  );
}

// "Download your filled templates" — the in-portal surface that delivers what the
// marketing sells: the named spreadsheets, auto-filled from the owner's real numbers.
// Maps the report's server-authoritative metrics_snapshot to ProductMetrics and runs
// the SAME anti-hallucination gate as the advisory report (safeTemplatesCsv →
// traceableValues), then offers download-all OR any single template. Each opens in
// Excel / Google Sheets / Numbers. Frontend-only; no recompute, nothing invented.
import { useMemo, useState } from "react";
import type { MetricsSnapshot } from "@/lib/report/types";
import { fillAllTemplates, traceableValues, type ProductMetrics } from "@/lib/finance/productTemplates";
import { safeTemplatesCsv, templateFileName } from "@/lib/finance/productTemplatesCsv";

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

  function downloadOne(t: (typeof templates)[number]) {
    try {
      triggerDownload(templateFileName(t), safeTemplatesCsv([t], allowed));
      setError(null);
    } catch {
      setError(GATE_ERROR);
    }
  }

  return (
    <section className="mt-2 rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <div className="text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">Your templates</div>
      <h2 className="mt-2 font-light text-ink text-[19px] leading-[1.2] tracking-[-0.01em]">
        Five spreadsheets, filled from your numbers
      </h2>
      <p className="mt-2 max-w-[52ch] text-[13.5px] leading-[1.7] text-ink/60">
        Every cell traces to your real data — open them in Excel, Google Sheets, or Numbers.
      </p>

      <button
        type="button"
        onClick={downloadAll}
        className="mt-5 rounded-full bg-ink px-5 py-2.5 text-[13.5px] text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
      >
        Download all (CSV)
      </button>

      <ul className="mt-5 divide-y divide-charcoal-800 border-t border-charcoal-800">
        {templates.map((t) => (
          <li key={t.title} className="flex items-center justify-between gap-4 py-3">
            <span className="text-[13.5px] text-ink/75">{t.title}</span>
            <button
              type="button"
              onClick={() => downloadOne(t)}
              aria-label={`Download ${t.title} as CSV`}
              className="shrink-0 rounded-full border border-gold-500/50 px-4 py-1.5 text-[12.5px] text-gold-700 transition-colors duration-200 ease-cinema hover:bg-gold-300/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
            >
              Download
            </button>
          </li>
        ))}
      </ul>

      {error && <p className="mt-3 text-[12px] text-ink/45">{error}</p>}
    </section>
  );
}

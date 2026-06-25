// "Your templates" — the in-portal surface that delivers what the marketing sells:
// the five named spreadsheets, auto-filled from the owner's real numbers and shown
// ON SCREEN (the way Ramp/Digits present data — not just a file). Maps the report's
// server-authoritative metrics_snapshot to ProductMetrics, renders each FilledTemplate
// as a styled table, and offers download-all OR any single template — each passed
// through the same anti-hallucination gate (safeTemplatesCsv → traceableValues).
// Frontend-only; no recompute, nothing invented.
import { useMemo, useState } from "react";
import type { MetricsSnapshot } from "@/lib/report/types";
import type { FilledTemplate, TemplateRow } from "@/lib/finance/types";
import { fillAllTemplates, traceableValues, type ProductMetrics } from "@/lib/finance/productTemplates";
import { safeTemplatesCsv, templateFileName } from "@/lib/finance/productTemplatesCsv";
import { fmtUSD, fmtPct, fmtMonths } from "@/lib/report/format";

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

/** Format a row value by its display unit (default USD). */
function formatValue(row: TemplateRow): string {
  if (row.value === null) return "";
  switch (row.unit) {
    case "percent":
      return fmtPct(row.value);
    case "months":
      return fmtMonths(row.value);
    case "count":
      return String(row.value);
    default:
      return fmtUSD(row.value);
  }
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

function TemplateBlock({ t, onDownload }: { t: FilledTemplate; onDownload: () => void }) {
  return (
    <div className="rounded-xl border border-charcoal-800 bg-ink/[0.015] p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[14px] font-light text-ink tracking-[-0.005em]">{t.title}</h3>
        <button
          type="button"
          onClick={onDownload}
          aria-label={`Download ${t.title} as CSV`}
          className="shrink-0 rounded-full border border-gold-500/50 px-3.5 py-1 text-[11.5px] text-gold-700 transition-colors duration-200 ease-cinema hover:bg-gold-300/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
        >
          Download
        </button>
      </div>
      <div className="mt-1 text-[11px] text-ink/40">{t.periodLabel}</div>
      <dl className="mt-3">
        {t.rows.map((row, i) =>
          row.kind === "section" ? (
            <div
              key={i}
              className="mt-3 mb-1 text-[10px] uppercase tracking-[0.2em] text-champagne-300/70"
            >
              {row.label}
            </div>
          ) : (
            <div
              key={i}
              className={`flex items-baseline justify-between gap-4 py-1 ${
                row.kind === "total" ? "border-t border-charcoal-800 mt-1 pt-2" : ""
              }`}
              style={{ paddingLeft: row.indent ? row.indent * 12 : undefined }}
            >
              <dt
                className={`text-[12.5px] ${
                  row.kind === "memo" ? "text-ink/45" : row.kind === "total" ? "text-ink/85" : "text-ink/70"
                }`}
              >
                {row.label}
              </dt>
              <dd
                className={`shrink-0 tabular-nums text-[12.5px] ${
                  row.kind === "total" ? "font-medium text-ink" : row.kind === "memo" ? "text-ink/45" : "text-ink/80"
                }`}
              >
                {formatValue(row)}
              </dd>
            </div>
          ),
        )}
      </dl>
    </div>
  );
}

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
          <TemplateBlock key={t.title} t={t} onDownload={() => downloadOne(t)} />
        ))}
      </div>

      {error && <p className="mt-3 text-[12px] text-ink/45">{error}</p>}
    </section>
  );
}

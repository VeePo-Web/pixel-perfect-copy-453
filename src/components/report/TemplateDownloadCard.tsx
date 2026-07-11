// "Your templates" - the in-portal surface that delivers what the marketing sells:
// GoldFin-branded spreadsheets auto-filled from the owner's real numbers and shown
// on screen before download. XLSX export is lazy-loaded on click; CSV remains as a
// plain fallback. Both pass through the same anti-fabrication gate.
import { useMemo, useState } from "react";
import type { MetricsSnapshot } from "@/lib/report/types";
import type { FilledTemplate } from "@/lib/finance/types";
import { fillAllTemplates, traceableValues, type ProductMetrics } from "@/lib/finance/productTemplates";
import { safeTemplatesCsv, templateFileName } from "@/lib/finance/productTemplatesCsv";
import FilledTemplateTable from "./FilledTemplateTable";

function toProductMetrics(m: MetricsSnapshot): ProductMetrics {
  return {
    period: m.period,
    cashOnHand: m.cashOnHand,
    inflow: m.inflow,
    outflow: m.outflow,
    netCash: m.netCash,
    monthlyBurn: m.monthlyBurn,
    runwayMonths: m.runwayMonths,
    nonOperatingExcluded: m.figures.nonOperatingExcluded ?? 0,
    revenueVsPriorPct: m.revenueVsPriorPct,
    profitProxy: m.profitProxy,
    profitVsPriorPct: m.profitVsPriorPct,
    duplicates: m.duplicates,
    unfamiliar: m.unfamiliar,
    biggestMover: m.biggestMover,
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
const XLSX_ERROR = "The Excel workbook could not be prepared. The CSV fallback is still available.";

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
  const hasData = pm.transactionsCount > 0;

  async function downloadAllXlsx() {
    try {
      const { downloadGoldfinTemplateVaultXlsx } = await import("@/lib/finance/xlsx/download");
      downloadGoldfinTemplateVaultXlsx(pm, periodEnd ?? "current");
      setError(null);
    } catch (err) {
      console.error("GoldFin XLSX vault export failed", err);
      setError(XLSX_ERROR);
    }
  }

  function downloadAllCsv() {
    try {
      triggerDownload(`goldfin-templates-${periodEnd ?? "current"}.csv`, safeTemplatesCsv(templates, allowed));
      setError(null);
    } catch {
      setError(GATE_ERROR);
    }
  }

  async function downloadOneXlsx(t: FilledTemplate) {
    try {
      const { downloadGoldfinTemplateXlsx } = await import("@/lib/finance/xlsx/download");
      downloadGoldfinTemplateXlsx(t.title, pm, periodEnd ?? "current");
      setError(null);
    } catch (err) {
      console.error("GoldFin XLSX template export failed", err);
      setError(XLSX_ERROR);
    }
  }

  function downloadOneCsv(t: FilledTemplate) {
    try {
      triggerDownload(templateFileName(t), safeTemplatesCsv([t], allowed));
      setError(null);
    } catch {
      setError(GATE_ERROR);
    }
  }

  return (
    <section className="mt-2 rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">Your templates</div>
          <h2 className="mt-2 font-light text-ink text-[19px] leading-[1.2] tracking-[-0.01em]">
            Four spreadsheets, filled from your numbers
          </h2>
        </div>
        {hasData && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={downloadAllXlsx}
              className="rounded-full bg-ink px-4 py-2 text-[12.5px] text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
            >
              Download all (.xlsx)
            </button>
            <button
              type="button"
              onClick={downloadAllCsv}
              className="rounded-full border border-ink/10 px-3.5 py-2 text-[12px] text-ink/55 transition-colors duration-200 ease-cinema hover:border-gold-500/35 hover:text-gold-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/30"
            >
              CSV
            </button>
          </div>
        )}
      </div>

      {hasData ? (
        <>
          <p className="mt-2 max-w-[58ch] text-[13px] leading-[1.7] text-ink/55">
            Each workbook is GoldFin-branded, Excel-ready, and traceable to your connected bank data.
            The CSV fallback stays available for accountants who prefer plain tables.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {templates.map((t) => (
              <FilledTemplateTable key={t.title} t={t} onDownload={() => downloadOneXlsx(t)} />
            ))}
          </div>
          <button
            type="button"
            onClick={downloadAllCsv}
            className="mt-4 text-[11.5px] text-ink/45 underline-offset-4 transition-colors hover:text-gold-700 hover:underline"
          >
            Download plain CSV fallback
          </button>
        </>
      ) : (
        <p className="mt-3 max-w-[54ch] text-[13px] leading-[1.7] text-ink/55">
          These fill in automatically once we see activity on your connected accounts. Sync a bank or card with a
          few transactions and the GoldFin workbook suite appears here - every number tied to your real data.
        </p>
      )}

      {error && (
        <p className="mt-3 text-[12px] text-ink/45">
          {error}
          {hasData && (
            <button type="button" onClick={() => downloadAllCsv()} className="ml-1 underline underline-offset-4">
              Download CSV instead.
            </button>
          )}
        </p>
      )}
      {hasData && (
        <div className="sr-only">
          {templates.map((t) => (
            <button key={t.title} type="button" onClick={() => downloadOneCsv(t)}>
              Download {t.title} CSV
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

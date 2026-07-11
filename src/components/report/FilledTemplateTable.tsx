// Shared, presentational renderer for one auto-filled template, used in the portal
// report AND on the marketing /templates page so both show the SAME honest engine
// output (no mock). Totals bold, memos muted, section headers, and per-unit number
// formatting (USD / % / months / count). Pure: it renders a FilledTemplate, nothing more.
import type { FilledTemplate, TemplateRow } from "@/lib/finance/types";
import { fmtUSD, fmtPct, fmtMonths } from "@/lib/report/format";

/** Format a row value by its display unit (default USD). "" for section headers. */
export function formatValue(row: TemplateRow): string {
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

export default function FilledTemplateTable({
  t,
  onDownload,
}: {
  t: FilledTemplate;
  onDownload?: () => void;
}) {
  return (
    <div className="rounded-xl border border-charcoal-800 bg-ink/[0.015] p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[14px] font-light text-ink tracking-[-0.005em]">{t.title}</h3>
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            aria-label={`Download ${t.title} as Excel workbook`}
            className="shrink-0 rounded-full border border-gold-500/50 px-3.5 py-1 text-[11.5px] text-gold-700 transition-colors duration-200 ease-cinema hover:bg-gold-300/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
          >
            XLSX
          </button>
        )}
      </div>
      <div className="mt-1 text-[11px] text-ink/40">{t.periodLabel}</div>
      <dl className="mt-3">
        {t.rows.map((row, i) =>
          row.kind === "section" ? (
            <div key={i} className="mt-3 mb-1 text-[10px] uppercase tracking-[0.2em] text-champagne-300/70">
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

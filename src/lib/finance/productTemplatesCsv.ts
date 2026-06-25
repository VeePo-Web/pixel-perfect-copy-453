// GoldFin Desk — CSV export for the auto-filled spreadsheet templates (the "missing half", v1).
// Turns the pure FilledTemplate rows into RFC-4180 CSV a real spreadsheet (Excel / Google
// Sheets / Numbers) opens as live, computable numbers — NOT pre-formatted "$" strings.
// The product sells "your templates, filled from your numbers"; this is the download that
// delivers it. xlsx is a later (v2) pass; CSV is universal and zero-dependency.
//
// THE GROUNDING CONTRACT (report 17): every numeric cell that ships must trace back to a
// production-metrics value. `safeTemplatesCsv` enforces it with the SAME allow-list
// (`traceableValues`) that protects the advisory report — a cell the engine didn't compute
// can never reach the customer's spreadsheet. Fabrication is structurally impossible here.

import type { FilledTemplate, TemplateRow } from "./types.ts";

/** Thrown when a filled cell holds a number the metrics engine never produced. */
export class UntraceableCellError extends Error {
  constructor(
    readonly template: string,
    readonly label: string,
    readonly value: number,
  ) {
    super(
      `Untraceable cell in "${template}" → "${label}" = ${value}. ` +
        `Every spreadsheet number must come from the metrics engine; refusing to export.`,
    );
    this.name = "UntraceableCellError";
  }
}

/** RFC-4180 field escaping: quote when the field holds a comma, quote, CR or LF. */
function csvField(raw: string): string {
  if (/[",\r\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
}

/** Serialize a cell value as a spreadsheet-native number (or "" for a section header). */
function csvValue(row: TemplateRow): string {
  if (row.value === null) return "";
  // Emit a raw number the spreadsheet can compute on. Percent rows carry the bare
  // magnitude (the label already says "%"); a trailing "%" would make it text.
  return String(row.value);
}

/** Header columns for every template block. */
const HEADER = "Item,Amount";

/** One template → its own CSV block (title, period, header, rows). No trailing newline. */
export function templateToCsv(t: FilledTemplate): string {
  const lines: string[] = [csvField(t.title), csvField(t.periodLabel), HEADER];
  for (const row of t.rows) {
    lines.push(`${csvField(row.label)},${csvValue(row)}`);
  }
  return lines.join("\r\n");
}

/** Many templates → one combined CSV, blank line between blocks (download-all). */
export function templatesToCsv(templates: readonly FilledTemplate[]): string {
  return templates.map(templateToCsv).join("\r\n\r\n");
}

/**
 * The safe export entry point. Verifies every numeric cell against the engine's
 * allow-list BEFORE serializing, then returns the combined CSV. Throws
 * `UntraceableCellError` on the first cell the engine didn't produce.
 */
export function safeTemplatesCsv(
  templates: readonly FilledTemplate[],
  allowed: ReadonlySet<number>,
): string {
  for (const t of templates) {
    for (const row of t.rows) {
      if (row.value !== null && !allowed.has(row.value)) {
        throw new UntraceableCellError(t.title, row.label, row.value);
      }
    }
  }
  return templatesToCsv(templates);
}

/** Filename-safe slug for a single template download (e.g. "cash-flow-forecast"). */
export function templateFileName(t: FilledTemplate): string {
  const slug = t.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "template"}.csv`;
}

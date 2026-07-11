// GoldFin Desk CSV export for the auto-filled spreadsheet templates.
// Turns FilledTemplate rows into RFC-4180 CSV a real spreadsheet opens as live,
// computable numbers, not pre-formatted "$" strings. The branded XLSX is the
// primary lead magnet; CSV remains the universal fallback.
//
// Grounding contract: every numeric cell that ships must trace back to a
// production-metrics value. `safeTemplatesCsv` enforces the same allow-list
// (`traceableValues`) that protects the advisory report: a cell the engine did
// not compute can never reach the customer's spreadsheet.

import type { FilledTemplate, TemplateRow } from "./types.ts";

/** Thrown when a filled cell holds a number the metrics engine never produced. */
export class UntraceableCellError extends Error {
  constructor(
    readonly template: string,
    readonly label: string,
    readonly value: number,
  ) {
    super(
      `Untraceable cell in "${template}" -> "${label}" = ${value}. ` +
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

/** Serialize a cell value as a spreadsheet-native number, or blank for sections. */
function csvValue(row: TemplateRow): string {
  if (row.value === null) return "";
  // Percent rows carry the bare magnitude; adding "%" would make the value text.
  return String(row.value);
}

/** One template to its own CSV block: title, period, header, rows. */
export function templateToCsv(t: FilledTemplate): string {
  const lines: string[] = [csvField(t.title), csvField(t.periodLabel), "Item,Amount"];
  for (const row of t.rows) {
    lines.push(`${csvField(row.label)},${csvValue(row)}`);
  }
  return lines.join("\r\n");
}

/** Many templates to one combined CSV, blank line between blocks. */
export function templatesToCsv(templates: readonly FilledTemplate[]): string {
  return templates.map(templateToCsv).join("\r\n\r\n");
}

/**
 * Safe export entry point. Verifies every numeric cell against the engine's
 * allow-list before serializing, then returns the combined CSV.
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

/** Filename-safe slug for a single template download. */
export function templateFileName(t: FilledTemplate): string {
  const slug = t.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "template"}.csv`;
}

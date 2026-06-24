// Spreadsheet-template intake: the canonical ledger schema (Cycle-4) + a
// minimal, dependency-free CSV parser for it. The owner fills one row per
// revenue or cost line; revenue_line + variable flag unlock contribution
// margin by line. Kept deliberately simple — a fixed, known schema.

export interface LedgerRow {
  entry_date: string;     // YYYY-MM-DD
  kind: "revenue" | "cost";
  amount: number;         // positive magnitude
  revenue_line: string | null;
  category: string | null;
  is_variable: boolean;
  description: string | null;
}

export const LEDGER_TEMPLATE_HEADERS = [
  "date", "kind", "amount", "revenue_line", "category", "variable", "description",
] as const;

/** A ready-to-fill template with example rows the owner replaces. */
export const LEDGER_TEMPLATE_CSV = [
  LEDGER_TEMPLATE_HEADERS.join(","),
  "2026-06-10,revenue,4200,Retainers,Client work,no,Acme monthly retainer",
  "2026-06-12,revenue,1800,Projects,Client work,no,One-off landing page",
  "2026-06-12,cost,640,Projects,Contractor,yes,Freelance designer hours",
  "2026-06-15,cost,300,Retainers,Software,yes,Tools used on retainer work",
].join("\n");

/** Split a single CSV line, honoring simple double-quoted fields. */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === "," && !inQ) {
      out.push(cur); cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const truthy = (s: string) => /^(yes|true|y|1|variable)$/i.test(s.trim());
const isoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s.trim());

export interface ParseResult { rows: LedgerRow[]; errors: string[] }

export function parseLedgerCsv(text: string): ParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const errors: string[] = [];
  if (lines.length < 2) return { rows: [], errors: ["The file has no data rows."] };

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const di = idx("date"), ki = idx("kind"), ai = idx("amount");
  if (di < 0 || ki < 0 || ai < 0) {
    return { rows: [], errors: ["Header must include at least: date, kind, amount."] };
  }
  const rli = idx("revenue_line"), ci = idx("category"), vi = idx("variable"), desci = idx("description");

  const rows: LedgerRow[] = [];
  for (let r = 1; r < lines.length; r++) {
    const cells = splitCsvLine(lines[r]);
    const date = cells[di] ?? "";
    const kindRaw = (cells[ki] ?? "").toLowerCase();
    const amount = parseFloat((cells[ai] ?? "").replace(/[$,]/g, ""));
    if (!isoDate(date)) { errors.push(`Row ${r + 1}: date must be YYYY-MM-DD.`); continue; }
    if (kindRaw !== "revenue" && kindRaw !== "cost") { errors.push(`Row ${r + 1}: kind must be "revenue" or "cost".`); continue; }
    if (Number.isNaN(amount) || amount < 0) { errors.push(`Row ${r + 1}: amount must be a positive number.`); continue; }
    rows.push({
      entry_date: date,
      kind: kindRaw,
      amount,
      revenue_line: rli >= 0 ? (cells[rli] || null) : null,
      category: ci >= 0 ? (cells[ci] || null) : null,
      is_variable: vi >= 0 ? truthy(cells[vi] ?? "") : true,
      description: desci >= 0 ? (cells[desci] || null) : null,
    });
  }
  return { rows, errors };
}

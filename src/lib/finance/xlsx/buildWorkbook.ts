import type { FilledTemplate, TemplateRow } from "../types.ts";
import { fillAllTemplates, traceableValues, type ProductMetrics } from "../productTemplates.ts";
import { createStoredZip } from "./zip.ts";

const NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

export class UntraceableWorkbookCellError extends Error {
  constructor(
    readonly sheet: string,
    readonly label: string,
    readonly value: number,
  ) {
    super(`Untraceable XLSX cell in "${sheet}" -> "${label}" = ${value}`);
    this.name = "UntraceableWorkbookCellError";
  }
}

/** A metric reached the workbook non-finite (NaN / ±Infinity). Writing it would
 *  produce `<v>NaN</v>` — a package Excel refuses to open — and it would slip
 *  the trace gate (Set.has(NaN) is true). We fail LOUD instead: the caller's
 *  download gate catches this and never ships a corrupt/wrong workbook. */
export class NonFiniteWorkbookCellError extends Error {
  constructor(
    readonly sheet: string,
    readonly label: string,
    readonly value: number,
  ) {
    super(`Non-finite XLSX cell in "${sheet}" -> "${label}" = ${value}`);
    this.name = "NonFiniteWorkbookCellError";
  }
}

type CellStyle =
  | "default"
  | "coverBrand"
  | "coverTitle"
  | "coverMeta"
  | "sheetTitle"
  | "section"
  | "header"
  | "label"
  | "money"
  | "moneyTotal"
  | "percent"
  | "months"
  | "count"
  | "memo"
  // Shaded, editable input cells for the fillable (free) templates.
  | "input"
  | "inputCount"
  | "inputPercent";

type Cell = {
  readonly value: string | number | null;
  readonly style?: CellStyle;
  readonly traceLabel?: string;
  // Excel formula (without the leading "="). When present, the cell writes
  // <f>formula</f><v>cachedValue</v> — Excel recalculates from the formula, and
  // `value` is the GoldFin-computed cached result (still non-finite-guarded).
  readonly formula?: string;
};

type SheetDef = {
  readonly name: string;
  readonly rows: readonly (readonly Cell[])[];
  readonly widths?: readonly number[];
  readonly hidden?: boolean;
  readonly freezeTopRow?: boolean;
};

const STYLE_INDEX: Record<CellStyle, number> = {
  default: 0,
  coverBrand: 1,
  coverTitle: 2,
  coverMeta: 3,
  sheetTitle: 4,
  section: 5,
  header: 6,
  label: 7,
  money: 8,
  moneyTotal: 9,
  percent: 10,
  months: 11,
  count: 12,
  memo: 13,
  input: 14,
  inputCount: 15,
  inputPercent: 16,
};

// XML 1.0 forbids the C0 control block except tab/LF/CR, even when escaped -
// a single one (real bank descriptors carry them) makes the whole workbook
// unreadable. Strip them (char-code arithmetic, no literal control chars in
// source) before escaping so the readable text survives.
function stripXmlIllegal(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i += 1) {
    const code = s.charCodeAt(i);
    if (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) continue;
    out += s[i];
  }
  return out;
}

function esc(s: string): string {
  return stripXmlIllegal(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sheetName(name: string): string {
  return name.replace(/[\\/?*[\]:]/g, " ").slice(0, 31);
}

function templateTabName(title: string): string {
  const names: Record<string, string> = {
    "Owner Command Center": "Command Center",
    "13-Week Cash Map": "13-Week Cash Map",
    "Cash-Basis P&L Review": "Cash P&L",
    "Expense And Vendor Audit": "Vendor Audit",
    "Subscription And Recurring Spend Tracker": "Recurring Spend",
    "Revenue And Deposit Trend Tracker": "Deposit Trend",
    "Owner Pay And Tax Reserve Planner": "Owner Pay",
    "Bank Statement Health Snapshot": "Statement Health",
  };
  return names[title] ?? sheetName(title);
}

function colName(n: number): string {
  let s = "";
  let x = n;
  while (x > 0) {
    const m = (x - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    x = Math.floor((x - m) / 26);
  }
  return s;
}

function c(value: string | number | null, style: CellStyle = "default", traceLabel?: string): Cell {
  return { value, style, traceLabel };
}

function row(label: string, value: number | string | null, style: CellStyle = "money"): readonly Cell[] {
  return [c(label, "label"), typeof value === "number" ? c(value, style, label) : c(value, "memo")];
}

function styleForRow(r: TemplateRow): CellStyle {
  if (r.kind === "total") return r.unit === "percent" ? "percent" : "moneyTotal";
  if (r.kind === "memo") {
    if (r.unit === "percent") return "percent";
    if (r.unit === "months") return "months";
    if (r.unit === "count") return "count";
    return "memo";
  }
  if (r.unit === "percent") return "percent";
  if (r.unit === "months") return "months";
  if (r.unit === "count") return "count";
  return "money";
}

function templateSheet(t: FilledTemplate): SheetDef {
  const rows: Cell[][] = [
    [c("GOLDFIN DESK", "coverBrand"), c(t.title, "sheetTitle")],
    [c("Period", "coverMeta"), c(t.periodLabel, "memo")],
    [],
    [c("Item", "header"), c("Amount", "header")],
  ];
  for (const r of t.rows) {
    if (r.kind === "section") {
      rows.push([c(r.label, "section"), c(null)]);
    } else {
      rows.push([c(`${"  ".repeat(r.indent)}${r.label}`, r.kind === "memo" ? "memo" : "label"), c(r.value, styleForRow(r), r.label)]);
    }
  }
  return {
    name: templateTabName(t.title),
    rows,
    widths: [42, 18, 18, 18],
    freezeTopRow: true,
  };
}

function coverSheet(metrics: ProductMetrics, title: string): SheetDef {
  return {
    name: "Cover",
    widths: [24, 24, 24, 24],
    rows: [
      [c("GF", "coverBrand"), c("GOLDFIN DESK", "coverBrand"), c(null), c(null)],
      [c(title, "coverTitle"), c(null), c(null), c(null)],
      [c("Bank-statement-derived planning workbook", "memo"), c(null), c(null), c(null)],
      [],
      row("Period start", metrics.period.start, "memo"),
      row("Period end", metrics.period.end, "memo"),
      row("Cash on hand", metrics.cashOnHand),
      row("Money in", metrics.inflow),
      row("Money out", -metrics.outflow),
      row("Net cash", metrics.netCash, "moneyTotal"),
      row("Transactions reviewed", metrics.transactionsCount, "count"),
      row("Categorization coverage", metrics.coveragePct, "percent"),
      [],
      [c("Method", "section")],
      [c("Every visible number is generated by GoldFin code from the deterministic metrics snapshot. The workbook is a planning artifact, not tax, accounting, credit, legal, or investment advice.", "memo")],
    ],
  };
}

function methodologySheet(): SheetDef {
  return {
    name: "Methodology",
    widths: [34, 96],
    rows: [
      [c("GOLDFIN DESK", "coverBrand"), c("Workbook methodology", "sheetTitle")],
      [],
      row("Data source", "Connected business bank and card activity through Plaid.", "memo"),
      row("Included", "Posted transaction activity, merchant/category enrichment, cash balance metrics, recurring-spend signals, and deterministic GoldFin calculations.", "memo"),
      row("Excluded", "Full accrual balance sheet, AR/AP aging, exact tax liability, inventory, depreciation, payroll headcount, and product-level margins unless separate source data exists.", "memo"),
      row("Transfers", "Internal transfers, card payoffs, and owner-equity moves are excluded from operating P&L when detected.", "memo"),
      row("Tax", "Tax reserve rows are planning targets, not tax advice.", "memo"),
      row("Credit", "Bank statement health is informational and is not a formal underwriting score or credit decision.", "memo"),
    ],
  };
}

function metricsSheet(metrics: ProductMetrics): SheetDef {
  const entries: [string, number | string | null][] = [
    ["period_start", metrics.period.start],
    ["period_end", metrics.period.end],
    ["cashOnHand", metrics.cashOnHand],
    ["inflow", metrics.inflow],
    ["outflow", metrics.outflow],
    ["netCash", metrics.netCash],
    ["monthlyBurn", metrics.monthlyBurn],
    ["runwayMonths", metrics.runwayMonths ?? 0],
    ["nonOperatingExcluded", metrics.nonOperatingExcluded ?? 0],
    ["revenueVsPriorPct", metrics.revenueVsPriorPct ?? 0],
    ["profitProxy", metrics.profitProxy ?? metrics.netCash],
    ["profitVsPriorPct", metrics.profitVsPriorPct ?? 0],
    ["wasteAnnualTotal", metrics.wasteAnnualTotal],
    ["coveragePct", metrics.coveragePct],
    ["transactionsCount", metrics.transactionsCount],
    ["reserve_floor_months", metrics.profile.reserve_floor_months],
  ];
  // Style each metric by its real unit — a currency format on a months/percent/
  // count value renders "$6" for 5.6 months or "$94" for 94%. Even though this
  // sheet is hidden, a shipped artifact must be correct if a user unhides it.
  const PERCENT_KEYS = new Set(["revenueVsPriorPct", "profitVsPriorPct", "coveragePct"]);
  const MONTHS_KEYS = new Set(["runwayMonths"]);
  const COUNT_KEYS = new Set(["transactionsCount", "reserve_floor_months"]);
  const styleForMetric = (k: string, v: number | string | null): CellStyle => {
    if (typeof v !== "number") return "memo";
    if (PERCENT_KEYS.has(k)) return "percent";
    if (MONTHS_KEYS.has(k)) return "months";
    if (COUNT_KEYS.has(k)) return "count";
    return "money";
  };
  return {
    name: "__metrics",
    hidden: true,
    widths: [32, 20],
    rows: [[c("Metric", "header"), c("Value", "header")], ...entries.map(([k, v]) => row(k, v, styleForMetric(k, v)))],
  };
}

function mappingSheet(): SheetDef {
  return {
    name: "__mapping",
    hidden: true,
    widths: [34, 80],
    rows: [
      [c("Line", "header"), c("Source rule", "header")],
      row("Revenue / deposits", "Bank inflows. Labeled as deposits/inflows, not accrual revenue.", "memo"),
      row("Operating outflow", "Bank/card outflows after non-operating exclusions.", "memo"),
      row("Recurring waste", "Plaid recurring stream signals when available; deterministic dormant/cost-creep metrics otherwise.", "memo"),
      row("P&L", "Cash-basis operating view only. It is not a full accrual P&L.", "memo"),
    ],
  };
}

function rawTransactionsSheet(): SheetDef {
  return {
    name: "__raw_transactions",
    hidden: true,
    widths: [42, 96],
    rows: [
      [c("Detail", "header"), c("Note", "header")],
      row("Transaction detail", "This planning workbook summarizes your connected bank and card activity. Line-item transaction detail lives in your GoldFin Desk account and your own bank export.", "memo"),
    ],
  };
}

function checksSheet(metrics: ProductMetrics): SheetDef {
  return {
    name: "__checks",
    hidden: true,
    widths: [42, 24],
    rows: [
      [c("Check", "header"), c("Value", "header")],
      row("net_cash_identity", Math.round((metrics.inflow - metrics.outflow - metrics.netCash) * 100) / 100, "money"),
      row("template_count", fillAllTemplates(metrics).length, "count"),
      row("traceable_values_count", traceableValues(metrics).size, "count"),
    ],
  };
}

function assertTraceable(sheet: string, rows: readonly (readonly Cell[])[], allowed: ReadonlySet<number>) {
  for (const r of rows) {
    const label = String(r[0]?.value ?? "cell");
    for (const cell of r) {
      if (typeof cell.value === "number" && cell.traceLabel) {
        // A non-finite value is a distinct, more informative failure than
        // "untraceable" — and it must never pass (Set.has(NaN) is true).
        if (!Number.isFinite(cell.value)) {
          throw new NonFiniteWorkbookCellError(sheet, cell.traceLabel || label, cell.value);
        }
        if (!allowed.has(cell.value)) {
          throw new UntraceableWorkbookCellError(sheet, cell.traceLabel || label, cell.value);
        }
      }
    }
  }
}

function sheetXml(sheet: SheetDef): string {
  const cols = sheet.widths?.length
    ? `<cols>${sheet.widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>`
    : "";
  const pane = sheet.freezeTopRow
    ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    : '<sheetViews><sheetView workbookViewId="0"/></sheetViews>';
  const rows = sheet.rows
    .map((cells, rIdx) => {
      const rowNum = rIdx + 1;
      const xmlCells = cells
        .map((cell, cIdx) => {
          if (cell.value === null || cell.value === undefined) return "";
          const ref = `${colName(cIdx + 1)}${rowNum}`;
          // Fall back to default (0) if a style name is ever unmapped, so a
          // typo can never emit s="undefined" (which corrupts the package).
          const style = STYLE_INDEX[cell.style ?? "default"] ?? 0;
          // A formula that returns TEXT (e.g. a plain-English verdict) — cached
          // as a string result. t="str" tells Excel the formula yields text.
          if (cell.formula && typeof cell.value === "string") {
            return `<c r="${ref}" s="${style}" t="str"><f>${esc(cell.formula)}</f><v>${esc(cell.value)}</v></c>`;
          }
          if (typeof cell.value === "number") {
            // Fail LOUD on NaN/±Infinity — writing <v>NaN</v> yields a package
            // Excel refuses to open, and NaN would slip the trace gate.
            if (!Number.isFinite(cell.value)) {
              throw new NonFiniteWorkbookCellError(sheet.name, cell.traceLabel ?? String(cells[0]?.value ?? ref), cell.value);
            }
            if (cell.formula) {
              // <f> recalculates in Excel; <v> is GoldFin's cached result so the
              // sheet shows correct numbers before the first recalc.
              return `<c r="${ref}" s="${style}"><f>${esc(cell.formula)}</f><v>${cell.value}</v></c>`;
            }
            return `<c r="${ref}" s="${style}"><v>${cell.value}</v></c>`;
          }
          return `<c r="${ref}" s="${style}" t="inlineStr"><is><t>${esc(cell.value)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowNum}">${xmlCells}</row>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="${NS_MAIN}" xmlns:r="${NS_REL}">${pane}${cols}<sheetData>${rows}</sheetData></worksheet>`;
}

function workbookXml(sheets: readonly SheetDef[]): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="${NS_MAIN}" xmlns:r="${NS_REL}"><workbookPr/><sheets>${sheets
    .map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}"${s.hidden ? ' state="hidden"' : ""} r:id="rId${i + 1}"/>`)
    .join("")}</sheets></workbook>`;
}

function workbookRelsXml(sheets: readonly SheetDef[]): string {
  const sheetRels = sheets
    .map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheetRels}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
}

function stylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="${NS_MAIN}"><numFmts count="4"><numFmt numFmtId="164" formatCode="$#,##0;[Red]($#,##0);-"/><numFmt numFmtId="165" formatCode="0.0&quot;%&quot;"/><numFmt numFmtId="166" formatCode="0.0&quot; mo&quot;"/><numFmt numFmtId="167" formatCode="#,##0"/></numFmts><fonts count="6"><font><sz val="11"/><name val="Aptos"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font><font><b/><sz val="22"/><color rgb="FF0B0D12"/><name val="Aptos Display"/></font><font><b/><sz val="13"/><color rgb="FF0B0D12"/><name val="Aptos"/></font><font><sz val="10"/><color rgb="FF6B6253"/><name val="Aptos"/></font><font><b/><sz val="11"/><color rgb="FFC9A24A"/><name val="Aptos"/></font></fonts><fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0B0D12"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF7F1DF"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC9A24A"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFDFBF6"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFBF0CE"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="3"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFE7D8AF"/></left><right style="thin"><color rgb="FFE7D8AF"/></right><top style="thin"><color rgb="FFE7D8AF"/></top><bottom style="thin"><color rgb="FFE7D8AF"/></bottom><diagonal/></border><border><bottom style="thin"><color rgb="FF0B0D12"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="17"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1"/><xf numFmtId="0" fontId="5" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="0" xfId="0" applyFill="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="164" fontId="3" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="167" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="164" fontId="0" fillId="6" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1"/><xf numFmtId="167" fontId="0" fillId="6" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1"/><xf numFmtId="165" fontId="0" fillId="6" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
}

function contentTypesXml(sheets: readonly SheetDef[]): string {
  const sheetTypes = sheets
    .map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheetTypes}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
}

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;

const CORE_PROPS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>GoldFin Desk Template Vault</dc:title><dc:creator>GoldFin Desk</dc:creator><cp:lastModifiedBy>GoldFin Desk</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2026-07-10T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-07-10T00:00:00Z</dcterms:modified></cp:coreProperties>`;

const APP_PROPS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>GoldFin Desk</Application></Properties>`;

function workbookBytes(sheets: readonly SheetDef[], metrics: ProductMetrics): Uint8Array {
  const allowed = traceableValues(metrics);
  for (const sheet of sheets.filter((s) => !s.hidden)) assertTraceable(sheet.name, sheet.rows, allowed);
  return createStoredZip([
    { path: "[Content_Types].xml", data: contentTypesXml(sheets) },
    { path: "_rels/.rels", data: ROOT_RELS },
    { path: "docProps/core.xml", data: CORE_PROPS },
    { path: "docProps/app.xml", data: APP_PROPS },
    { path: "xl/workbook.xml", data: workbookXml(sheets) },
    { path: "xl/_rels/workbook.xml.rels", data: workbookRelsXml(sheets) },
    { path: "xl/styles.xml", data: stylesXml() },
    ...sheets.map((sheet, i) => ({ path: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(sheet) })),
  ]);
}

export function buildGoldfinTemplateVaultXlsx(metrics: ProductMetrics): Uint8Array {
  const templates = fillAllTemplates(metrics);
  const sheets: SheetDef[] = [
    coverSheet(metrics, "GoldFin Template Vault"),
    ...templates.map(templateSheet),
    methodologySheet(),
    metricsSheet(metrics),
    rawTransactionsSheet(),
    mappingSheet(),
    checksSheet(metrics),
  ];
  return workbookBytes(sheets, metrics);
}

export function buildGoldfinTemplateXlsx(templateTitle: string, metrics: ProductMetrics): Uint8Array {
  const template = fillAllTemplates(metrics).find((t) => t.title === templateTitle);
  if (!template) throw new Error(`Unknown GoldFin template: ${templateTitle}`);
  const sheets: SheetDef[] = [
    coverSheet(metrics, template.title),
    templateSheet(template),
    methodologySheet(),
    metricsSheet(metrics),
    rawTransactionsSheet(),
    mappingSheet(),
    checksSheet(metrics),
  ];
  return workbookBytes(sheets, metrics);
}

export function goldfinTemplateXlsxFileName(title: string, periodEnd = "current"): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `goldfin-${slug || "template"}-${periodEnd}.xlsx`;
}

// =========================================================================
// FILLABLE (FREE) TEMPLATES
// The lead-magnet workbooks are genuine, self-contained planning models: the
// owner types their own numbers into shaded input cells and every result is an
// Excel FORMULA that recalculates. Distinct from the paid export above (a
// static, verified report of a closed period). Provenance here is the formula
// itself — transparent by construction — so these skip the anti-fabrication
// trace gate but keep the non-finite guard in sheetXml.
// =========================================================================

export type FillableInputs = {
  readonly periodLabel: string;
  readonly cashOnHand: number;
  readonly moneyIn: number;
  readonly moneyOut: number;
  readonly reserveMonths: number;
  readonly ownerPayTaken: number;
  readonly weeklyIn: number;
  readonly weeklyOut: number;
  readonly taxRatePct: number;
  readonly costs: {
    readonly materials: number;
    readonly payroll: number;
    readonly rent: number;
    readonly software: number;
    readonly marketing: number;
    readonly ownerPay: number;
    readonly other: number;
  };
  readonly vendors: ReadonlyArray<{ readonly name: string; readonly monthly: number; readonly decision: string }>;
};

// A coherent sample business (mirrors SAMPLE_METRICS' story) pre-filled so the
// downloaded sample looks complete and reconciles, yet recalculates on edit.
// The cost buckets sum to moneyOut (71,900) so the P&L ties to the cash view.
export const DEFAULT_FILLABLE_INPUTS: FillableInputs = {
  periodLabel: "2026-05-01 to 2026-05-31",
  cashOnHand: 268000,
  moneyIn: 96400,
  moneyOut: 71900,
  reserveMonths: 3,
  ownerPayTaken: 8000,
  weeklyIn: 22493,
  weeklyOut: 16777,
  taxRatePct: 15,
  costs: { materials: 15000, payroll: 30000, rent: 6000, software: 4500, marketing: 5400, ownerPay: 8000, other: 3000 },
  vendors: [
    { name: "Unused SaaS seat", monthly: 49, decision: "Cut" },
    { name: "Old design tool", monthly: 30, decision: "Cut" },
    { name: "Cloud hosting", monthly: 410, decision: "Keep" },
  ],
};

const round2f = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const pctOf = (part: number, whole: number): number => (whole === 0 ? 0 : round2f((part / whole) * 100));
const icell = (value: number | string, style: CellStyle = "input"): Cell => ({ value, style });
const fnum = (formula: string, cached: number, style: CellStyle = "money"): Cell => ({ value: cached, style, formula });
// A formula that returns a plain-English verdict (a CFO reading, in a cell).
const ftext = (formula: string, cached: string): Cell => ({ value: cached, style: "memo", formula });
const hcell = (t: string): Cell => c(t, "header");

/** Small row builder that tracks each input/result cell's B-column coordinate
 *  so downstream formulas can reference it (absolute, e.g. "$B$7"). */
function fillableBuilder() {
  const rows: Cell[][] = [];
  const at = new Map<string, number>();
  const api = {
    rows,
    brand(title: string) { rows.push([c("GOLDFIN DESK", "coverBrand"), c(title, "sheetTitle")]); return api; },
    kv(label: string, val: string) { rows.push([c(label, "coverMeta"), c(val, "memo")]); return api; },
    note(text: string) { rows.push([c(text, "coverMeta")]); return api; },
    blank() { rows.push([]); return api; },
    section(title: string) { rows.push([c(title, "section"), c(null)]); return api; },
    input(label: string, value: number, style: CellStyle = "input") {
      rows.push([c(label, "label"), { value, style }]);
      at.set(label, rows.length);
      return api;
    },
    result(label: string, formula: string, cached: number, style: CellStyle = "money") {
      rows.push([c(label, "label"), { value: cached, style, formula }]);
      at.set(label, rows.length);
      return api;
    },
    ref(label: string): string {
      const r = at.get(label);
      if (!r) throw new Error(`fillable: no cell reference for "${label}"`);
      return `$B$${r}`;
    },
    push(cells: Cell[]): number { rows.push(cells); return rows.length; },
    nextRow(): number { return rows.length + 1; },
  };
  return api;
}

const HOW_TO = "How to use: type your own numbers into the shaded gold cells. Every grey result cell recalculates automatically.";

// 1. OWNER COMMAND CENTER — "Am I okay?" answered with a verdict + the ratios.
function fcOwnerCommand(i: FillableInputs): SheetDef {
  const b = fillableBuilder();
  b.brand("Owner Command Center").kv("Period", i.periodLabel).blank().note(HOW_TO).blank();
  b.section("Your inputs");
  b.input("Cash on hand", i.cashOnHand);
  b.input("Money in (this month)", i.moneyIn);
  b.input("Money out (this month)", i.moneyOut);
  b.input("Owner pay you took (this month)", i.ownerPayTaken);
  b.input("Reserve months target", i.reserveMonths, "inputCount");
  const cash = b.ref("Cash on hand"), inn = b.ref("Money in (this month)"), out = b.ref("Money out (this month)"),
    own = b.ref("Owner pay you took (this month)"), mo = b.ref("Reserve months target");
  const net = i.moneyIn - i.moneyOut, floor = i.moneyOut * i.reserveMonths;
  const verdict =
    net < 0 ? "You spent more than you earned this month - act now"
      : i.cashOnHand < floor ? "Below your cash reserve - build cash before new spending"
      : i.moneyIn === 0 ? "No income yet - enter your numbers"
      : net / i.moneyIn < 0.1 ? "Thin profit margin - review pricing or costs"
      : "Healthy - profitable and above your reserve";
  b.blank().section("Where you stand");
  b.push([ftext(
    `IF((${inn}-${out})<0,"You spent more than you earned this month - act now",IF(${cash}<${out}*${mo},"Below your cash reserve - build cash before new spending",IF(${inn}=0,"No income yet - enter your numbers",IF((${inn}-${out})/${inn}<0.1,"Thin profit margin - review pricing or costs","Healthy - profitable and above your reserve"))))`,
    verdict)]);
  b.blank().section("The numbers that matter");
  b.result("Profit this month (net cash)", `${inn}-${out}`, net, "moneyTotal");
  b.result("Profit margin", `IF(${inn}=0,0,(${inn}-${out})/${inn}*100)`, pctOf(net, i.moneyIn), "percent");
  b.result("Owner pay as % of income", `IF(${inn}=0,0,${own}/${inn}*100)`, pctOf(i.ownerPayTaken, i.moneyIn), "percent");
  b.result("Cash coverage (months at this burn)", `IF(${out}=0,0,${cash}/${out})`, round2f(i.moneyOut === 0 ? 0 : i.cashOnHand / i.moneyOut), "months");
  b.result("Reserve floor target", `${out}*${mo}`, floor);
  b.result("Cash over / (under) reserve", `${cash}-${out}*${mo}`, i.cashOnHand - floor, "moneyTotal");
  return { name: "Command Center", rows: b.rows, widths: [46, 22] };
}

// 2. 13-WEEK CASH MAP — a real liquidity model: edit any week, see the crunch.
function fcCashMap(i: FillableInputs): SheetDef {
  const b = fillableBuilder();
  b.brand("13-Week Cash Map").kv("Period", i.periodLabel).blank().note(HOW_TO).blank();
  b.section("Your inputs");
  b.input("Starting cash", i.cashOnHand);
  const floorDefault = Math.round((i.weeklyOut * 4) / 1000) * 1000;
  b.input("Cash floor to stay above", floorDefault);
  const start = b.ref("Starting cash"), floorRef = b.ref("Cash floor to stay above");
  b.blank().section("13-week plan (edit any week's money in and out)");
  const headRow = b.push([hcell("Week"), hcell("Money in"), hcell("Money out"), hcell("Ending cash")]);
  const firstWeek = headRow + 1;
  const wnet = i.weeklyIn - i.weeklyOut;
  const endings: number[] = [];
  for (let n = 1; n <= 13; n += 1) {
    const r = firstWeek + (n - 1);
    const ending = i.cashOnHand + wnet * n;
    endings.push(ending);
    const formula = n === 1 ? `${start}+B${r}-C${r}` : `D${r - 1}+B${r}-C${r}`;
    b.push([c(`Week ${n}`, "label"), icell(i.weeklyIn), icell(i.weeklyOut), fnum(formula, ending)]);
  }
  const lastWeek = firstWeek + 12;
  const minEnding = Math.min(...endings), weeksBelow = endings.filter((e) => e < floorDefault).length;
  const range = `D${firstWeek}:D${lastWeek}`;
  b.blank().section("Watch for the crunch");
  b.result("Lowest weekly cash", `MIN(${range})`, minEnding);
  b.result("Weeks ending below your floor", `COUNTIF(${range},"<"&${floorRef})`, weeksBelow, "count");
  const mapVerdict =
    minEnding < 0 ? "Cash goes negative in this window - line up funding or slow outflows"
      : minEnding < floorDefault ? "Cash dips below your floor - watch the tightest week"
      : "Cash stays above your floor across all 13 weeks";
  b.blank();
  b.push([ftext(
    `IF(MIN(${range})<0,"Cash goes negative in this window - line up funding or slow outflows",IF(MIN(${range})<${floorRef},"Cash dips below your floor - watch the tightest week","Cash stays above your floor across all 13 weeks"))`,
    mapVerdict)]);
  return { name: "13-Week Cash Map", rows: b.rows, widths: [16, 16, 16, 18] };
}

// 3. CASH-BASIS P&L — categorized, with each cost as a % of revenue + margin.
function fcCashPnl(i: FillableInputs): SheetDef {
  const b = fillableBuilder();
  b.brand("Cash-Basis P&L Review").kv("Period", i.periodLabel).blank().note(HOW_TO).blank();
  b.section("Revenue & assumptions");
  b.input("Revenue (deposits / money in)", i.moneyIn);
  b.input("Tax reserve rate (%)", i.taxRatePct, "inputPercent");
  const rev = b.ref("Revenue (deposits / money in)"), rate = b.ref("Tax reserve rate (%)");
  b.blank().section("Where the money went (edit these)");
  const headRow = b.push([hcell("Item"), hcell("Amount"), hcell("% of revenue")]);
  const first = headRow + 1;
  const costRows: [string, number][] = [
    ["Materials / cost of goods", i.costs.materials],
    ["Payroll & contractors", i.costs.payroll],
    ["Rent & utilities", i.costs.rent],
    ["Software & subscriptions", i.costs.software],
    ["Marketing & sales", i.costs.marketing],
    ["Owner pay", i.costs.ownerPay],
    ["Other", i.costs.other],
  ];
  costRows.forEach(([name, amt], idx) => {
    const r = first + idx;
    b.push([c(name, "label"), icell(amt), fnum(`IF(${rev}=0,0,B${r}/${rev}*100)`, pctOf(amt, i.moneyIn), "percent")]);
  });
  const last = first + costRows.length - 1;
  const totalCosts = costRows.reduce((s, [, a]) => s + a, 0);
  const totalRow = b.nextRow();
  b.push([c("Total spending", "label"), fnum(`SUM(B${first}:B${last})`, totalCosts, "moneyTotal"), fnum(`IF(${rev}=0,0,B${totalRow}/${rev}*100)`, pctOf(totalCosts, i.moneyIn), "percent")]);
  const opProfit = i.moneyIn - totalCosts;
  b.blank().section("Profit");
  b.result("Operating profit", `${rev}-B${totalRow}`, opProfit, "moneyTotal");
  b.result("Profit margin", `IF(${rev}=0,0,(${rev}-B${totalRow})/${rev}*100)`, pctOf(opProfit, i.moneyIn), "percent");
  b.result("Tax reserve target", `(${rev}-B${totalRow})*${rate}/100`, round2f(opProfit * i.taxRatePct / 100));
  b.result("Cash left after tax reserve", `(${rev}-B${totalRow})-(${rev}-B${totalRow})*${rate}/100`, round2f(opProfit - opProfit * i.taxRatePct / 100), "moneyTotal");
  return { name: "Cash P&L", rows: b.rows, widths: [40, 18, 16] };
}

// 4. EXPENSE & VENDOR AUDIT — a cut decision, with annual drain + savings.
function fcVendorAudit(i: FillableInputs): SheetDef {
  const b = fillableBuilder();
  b.brand("Expense & Vendor Audit").kv("Period", i.periodLabel).blank();
  b.note("List each recurring vendor, its monthly cost, and whether to Keep, Review, or Cut it. Totals and savings update as you edit.").blank();
  b.section("Recurring vendors (edit these)");
  const headRow = b.push([hcell("Vendor"), hcell("Monthly"), hcell("Annual"), hcell("% of total"), hcell("Keep / Review / Cut")]);
  const first = headRow + 1;
  const rowsData: [string, number, string][] = [
    ...i.vendors.map((v) => [v.name, v.monthly, v.decision] as [string, number, string]),
    ...Array.from({ length: 3 }, () => ["(add a vendor)", 0, ""] as [string, number, string]),
  ];
  const totalRow = first + rowsData.length;
  const totalMonthly = i.vendors.reduce((s, v) => s + v.monthly, 0);
  rowsData.forEach(([name, monthly, decision], idx) => {
    const r = first + idx;
    b.push([
      icell(name), icell(monthly),
      fnum(`B${r}*12`, monthly * 12),
      fnum(`IF($B$${totalRow}=0,0,B${r}/$B$${totalRow}*100)`, pctOf(monthly, totalMonthly), "percent"),
      icell(decision),
    ]);
  });
  const last = first + rowsData.length - 1;
  b.push([c("Total", "label"), fnum(`SUM(B${first}:B${last})`, totalMonthly, "moneyTotal"), fnum(`SUM(C${first}:C${last})`, totalMonthly * 12), c(null), c(null)]);
  const cutMonthly = i.vendors.filter((v) => v.decision.toLowerCase() === "cut").reduce((s, v) => s + v.monthly, 0);
  b.blank().section("Your savings opportunity");
  b.result("Monthly cost of vendors marked Cut", `SUMIF(E${first}:E${last},"Cut",B${first}:B${last})`, cutMonthly);
  b.result("Annual savings if you cut them", `SUMIF(E${first}:E${last},"Cut",C${first}:C${last})`, cutMonthly * 12);
  b.blank();
  b.push([ftext(
    `IF(SUMIF(E${first}:E${last},"Cut",C${first}:C${last})>0,"Cutting the vendors you marked Cut saves the annual amount above","Mark any vendor Cut to see the annual savings")`,
    cutMonthly > 0 ? "Cutting the vendors you marked Cut saves the annual amount above" : "Mark any vendor Cut to see the annual savings")]);
  return { name: "Vendor Audit", rows: b.rows, widths: [34, 14, 14, 14, 20] };
}

function fillableCoverSheet(i: FillableInputs, title: string): SheetDef {
  return {
    name: "Start here",
    widths: [30, 30, 30],
    rows: [
      [c("GF", "coverBrand"), c("GOLDFIN DESK", "coverBrand"), c(null)],
      [c(title, "coverTitle"), c(null), c(null)],
      [c("A fill-in-yourself planning workbook. Type your numbers in the shaded gold cells and every result recalculates.", "memo"), c(null), c(null)],
      [],
      [c("How it works", "section")],
      [c("1. Open a template tab below.", "memo")],
      [c("2. Type your own figures into the shaded gold cells.", "memo")],
      [c("3. The grey result cells recalculate instantly.", "memo")],
      [],
      [c("Sample figures (pre-filled - type over them)", "section")],
      ...([
        ["Cash on hand", i.cashOnHand],
        ["Money in", i.moneyIn],
        ["Money out", i.moneyOut],
        ["Profit this month", i.moneyIn - i.moneyOut],
      ] as [string, number][]).map(([k, v]) => row(k, v)),
      row("Profit margin", pctOf(i.moneyIn - i.moneyOut, i.moneyIn), "percent"),
      [],
      [c("Prefer it filled from your bank every month? That is GoldFin Reports - goldfindesk.com/pricing", "memo")],
      [c("A planning artifact, not tax, accounting, credit, legal, or investment advice.", "memo")],
    ],
  };
}

function fillableAboutSheet(): SheetDef {
  return {
    name: "About",
    widths: [30, 90],
    rows: [
      [c("GOLDFIN DESK", "coverBrand"), c("About this workbook", "sheetTitle")],
      [],
      row("Shaded gold cells", "Your inputs. Type over the sample numbers with your own.", "memo"),
      row("Grey result cells", "Formulas that recalculate automatically from your inputs.", "memo"),
      row("Self-contained", "Everything computes from the numbers you enter - no bank connection needed.", "memo"),
      row("Not advice", "A planning aid, not tax, accounting, credit, legal, or investment advice.", "memo"),
      row("Done for you", "GoldFin Reports fills these from your real bank activity every month, with a plain-English briefing. See goldfindesk.com/pricing.", "memo"),
    ],
  };
}

function fillableWorkbookBytes(sheets: readonly SheetDef[]): Uint8Array {
  // No trace gate: fillable values are input/formula-derived (transparent
  // provenance). sheetXml still guards against non-finite cached values.
  return createStoredZip([
    { path: "[Content_Types].xml", data: contentTypesXml(sheets) },
    { path: "_rels/.rels", data: ROOT_RELS },
    { path: "docProps/core.xml", data: CORE_PROPS },
    { path: "docProps/app.xml", data: APP_PROPS },
    { path: "xl/workbook.xml", data: workbookXml(sheets) },
    { path: "xl/_rels/workbook.xml.rels", data: workbookRelsXml(sheets) },
    { path: "xl/styles.xml", data: stylesXml() },
    ...sheets.map((sheet, i) => ({ path: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(sheet) })),
  ]);
}

const FILLABLE_BUILDERS: Record<string, (i: FillableInputs) => SheetDef> = {
  "Owner Command Center": fcOwnerCommand,
  "13-Week Cash Map": fcCashMap,
  "Cash-Basis P&L Review": fcCashPnl,
  "Expense & Vendor Audit": fcVendorAudit,
};

/** The full fillable lead-magnet vault: all four interactive templates. */
export function buildGoldfinFillableVaultXlsx(inputs: FillableInputs = DEFAULT_FILLABLE_INPUTS): Uint8Array {
  const sheets: SheetDef[] = [
    fillableCoverSheet(inputs, "GoldFin Template Vault"),
    ...Object.values(FILLABLE_BUILDERS).map((fn) => fn(inputs)),
    fillableAboutSheet(),
  ];
  return fillableWorkbookBytes(sheets);
}

/** One fillable template workbook by title. */
export function buildGoldfinFillableTemplateXlsx(title: string, inputs: FillableInputs = DEFAULT_FILLABLE_INPUTS): Uint8Array {
  const fn = FILLABLE_BUILDERS[title];
  if (!fn) throw new Error(`Unknown fillable GoldFin template: ${title}`);
  const sheets: SheetDef[] = [fillableCoverSheet(inputs, title), fn(inputs), fillableAboutSheet()];
  return fillableWorkbookBytes(sheets);
}

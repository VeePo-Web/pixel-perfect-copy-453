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
  | "memo";

type Cell = {
  readonly value: string | number | null;
  readonly style?: CellStyle;
  readonly traceLabel?: string;
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
          const style = STYLE_INDEX[cell.style ?? "default"];
          if (typeof cell.value === "number") {
            // Fail LOUD on NaN/±Infinity — writing <v>NaN</v> yields a package
            // Excel refuses to open, and NaN would slip the trace gate.
            if (!Number.isFinite(cell.value)) {
              throw new NonFiniteWorkbookCellError(sheet.name, cell.traceLabel ?? String(cells[0]?.value ?? ref), cell.value);
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
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="${NS_MAIN}"><numFmts count="4"><numFmt numFmtId="164" formatCode="$#,##0;[Red]($#,##0);-"/><numFmt numFmtId="165" formatCode="0.0&quot;%&quot;"/><numFmt numFmtId="166" formatCode="0.0&quot; mo&quot;"/><numFmt numFmtId="167" formatCode="#,##0"/></numFmts><fonts count="6"><font><sz val="11"/><name val="Aptos"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font><font><b/><sz val="22"/><color rgb="FF0B0D12"/><name val="Aptos Display"/></font><font><b/><sz val="13"/><color rgb="FF0B0D12"/><name val="Aptos"/></font><font><sz val="10"/><color rgb="FF6B6253"/><name val="Aptos"/></font><font><b/><sz val="11"/><color rgb="FFC9A24A"/><name val="Aptos"/></font></fonts><fills count="6"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0B0D12"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF7F1DF"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC9A24A"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFDFBF6"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="3"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFE7D8AF"/></left><right style="thin"><color rgb="FFE7D8AF"/></right><top style="thin"><color rgb="FFE7D8AF"/></top><bottom style="thin"><color rgb="FFE7D8AF"/></bottom><diagonal/></border><border><bottom style="thin"><color rgb="FF0B0D12"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="14"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1"/><xf numFmtId="0" fontId="5" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="0" xfId="0" applyFill="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="164" fontId="3" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="167" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
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

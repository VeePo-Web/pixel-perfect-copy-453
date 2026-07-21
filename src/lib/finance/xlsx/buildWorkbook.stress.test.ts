// STRESS TEST — the auto-filled XLSX must survive real-world "Tuesday" data:
// raw bank merchant descriptors with control chars / XML metacharacters, and
// upstream metrics that went non-finite. A corrupt or wrong workbook handed to a
// paying customer is a lost customer — this suite guarantees the builder either
// produces a clean, valid package or fails LOUD (never a silently broken file).
import { test, assert, expect } from "vitest";
import type { ProductMetrics } from "../productTemplates.ts";
import {
  buildGoldfinTemplateVaultXlsx,
  NonFiniteWorkbookCellError,
} from "./buildWorkbook.ts";
import { readStoredZip, readStoredZipText } from "./zip.ts";

const BASE: ProductMetrics = {
  period: { start: "2026-06-01", end: "2026-06-14" },
  cashOnHand: 84200, inflow: 132400, outflow: 87540, netCash: 44860,
  monthlyBurn: 190000, runwayMonths: 0.44, nonOperatingExcluded: 15500,
  revenueVsPriorPct: 6.4, profitProxy: 44860, profitVsPriorPct: 2.8,
  duplicates: [], unfamiliar: [], biggestMover: null,
  ownerPay: { profit: 6620, ownerPay: 66200, tax: 19860, opex: 39720 },
  waste: [], wasteAnnualTotal: 900, costCreep: [],
  coveragePct: 92.5, transactionsCount: 143, profile: { reserve_floor_months: 3 },
};
const m = (over: Partial<ProductMetrics>): ProductMetrics => ({ ...BASE, ...over });

// XML 1.0 forbids these code points even when "escaped"; their presence makes
// the whole workbook unreadable in Excel/Sheets/Numbers. (Tab/LF/CR are legal.)
// Built from \u escapes so no literal control char lives in this source file.
const ILLEGAL_XML = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]");
const NUL = String.fromCharCode(0);
const BS = String.fromCharCode(8);
const VT = String.fromCharCode(11);

function allSheetXml(bytes: Uint8Array): string {
  const files = readStoredZip(bytes);
  let all = "";
  for (const name of files.keys()) if (name.endsWith(".xml")) all += readStoredZipText(bytes, name);
  return all;
}

test("control characters in a merchant descriptor never corrupt the package", () => {
  // A genuine Plaid descriptor can carry a stray NUL / backspace / vertical-tab.
  const dirty = `ACME${NUL}BILLING CO${BS} #4021${VT}`;
  const bytes = buildGoldfinTemplateVaultXlsx(m({
    duplicates: [{ merchant: dirty, amount: 320, date: "2026-06-09" }],
    unfamiliar: [{ merchant: "Vendor X", amount: 2400, date: "2026-06-12" }],
    biggestMover: { category: "Software", from: 2400, to: 3900, delta: 1500 },
    costCreep: [{ merchant: "AWS", from: 1200, to: 1850 }],
  }));
  const xml = allSheetXml(bytes);
  assert.notMatch(xml, ILLEGAL_XML, "workbook XML still contains an XML-illegal control char");
  // The readable text survives once the control chars are stripped.
  assert.ok(xml.includes("ACMEBILLING CO #4021"));
});

test("XML metacharacters in names are escaped, not injected", () => {
  const bytes = buildGoldfinTemplateVaultXlsx(m({
    duplicates: [{ merchant: `<script>&"'</script>`, amount: 100, date: "2026-06-09" }],
  }));
  const xml = allSheetXml(bytes);
  assert.ok(!xml.includes("<script>"), "raw tag leaked into the sheet XML");
  assert.ok(xml.includes("&lt;script&gt;"));
});

test("a non-finite metric fails LOUD instead of writing <v>NaN</v>", () => {
  // Old bug: Set.has(NaN)===true, so NaN passed the trace gate, then
  // `<v>NaN</v>` produced a workbook Excel refuses to open.
  expect(() => buildGoldfinTemplateVaultXlsx(m({ cashOnHand: NaN }))).toThrow(NonFiniteWorkbookCellError);
  expect(() => buildGoldfinTemplateVaultXlsx(m({ inflow: Infinity }))).toThrow(NonFiniteWorkbookCellError);
  expect(() => buildGoldfinTemplateVaultXlsx(m({ netCash: -Infinity }))).toThrow(NonFiniteWorkbookCellError);
  // and the hidden __metrics sheet path is covered too:
  expect(() => buildGoldfinTemplateVaultXlsx(m({ monthlyBurn: NaN }))).toThrow(NonFiniteWorkbookCellError);
});

test("no sheet in a clean workbook ever emits a non-finite <v>", () => {
  const xml = allSheetXml(buildGoldfinTemplateVaultXlsx(BASE));
  assert.ok(!/<v>(NaN|Infinity|-Infinity)<\/v>/.test(xml));
});

test("degenerate zero-activity period still produces a valid package", () => {
  // A freshly connected account mid-cycle: no flow yet, runway null.
  const bytes = buildGoldfinTemplateVaultXlsx(m({
    cashOnHand: 0, inflow: 0, outflow: 0, netCash: 0, monthlyBurn: 0,
    runwayMonths: null, profitProxy: 0, wasteAnnualTotal: 0,
    ownerPay: { profit: 0, ownerPay: 0, tax: 0, opex: 0 },
    coveragePct: 0, transactionsCount: 0,
    revenueVsPriorPct: null, profitVsPriorPct: null, nonOperatingExcluded: 0,
  }));
  const files = readStoredZip(bytes);
  assert.ok(files.has("xl/workbook.xml"));
  assert.notMatch(allSheetXml(bytes), ILLEGAL_XML);
});

test("overdraft (negative cash) and a huge single charge stay valid", () => {
  const bytes = buildGoldfinTemplateVaultXlsx(m({
    cashOnHand: -12500.55, netCash: -80000,
    unfamiliar: [{ merchant: "WIRE OUT", amount: 250000.99, date: "2026-06-12" }],
  }));
  const xml = allSheetXml(bytes);
  assert.notMatch(xml, ILLEGAL_XML);
  assert.ok(!/<v>(NaN|Infinity|-Infinity)<\/v>/.test(xml));
});

test("unicode merchant names are preserved and valid", () => {
  const bytes = buildGoldfinTemplateVaultXlsx(m({
    duplicates: [{ merchant: "Café Münchën 東京 🍜", amount: 42, date: "2026-06-09" }],
  }));
  const xml = allSheetXml(bytes);
  assert.ok(xml.includes("Café Münchën 東京 🍜"));
  assert.notMatch(xml, ILLEGAL_XML);
});

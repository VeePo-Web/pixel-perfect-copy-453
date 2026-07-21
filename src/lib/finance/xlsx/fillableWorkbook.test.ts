// The FREE lead-magnet templates must be genuine decision tools, not static
// snapshots: shaded input cells the owner edits, computed cells that are Excel
// FORMULAS referencing those inputs (so the workbook recalculates), plain-English
// verdicts, ratios/margins, a lumpy 13-week model with crunch detection, a
// categorized P&L, and a vendor cut-savings calculation.
import { test, assert } from "vitest";
import {
  buildGoldfinFillableVaultXlsx,
  buildGoldfinFillableTemplateXlsx,
  DEFAULT_FILLABLE_INPUTS,
  NonFiniteWorkbookCellError,
} from "./buildWorkbook.ts";
import { readStoredZip, readStoredZipText } from "./zip.ts";

function allSheetXml(bytes: Uint8Array): string {
  const files = readStoredZip(bytes);
  let all = "";
  for (const name of files.keys()) if (name.endsWith(".xml")) all += readStoredZipText(bytes, name);
  return all;
}
const sheet2 = (title: string) => readStoredZipText(buildGoldfinFillableTemplateXlsx(title), "xl/worksheets/sheet2.xml");

test("fillable vault is a valid package with all four interactive templates + guidance", () => {
  const wb = readStoredZipText(buildGoldfinFillableVaultXlsx(), "xl/workbook.xml");
  for (const tab of ["Start here", "Command Center", "13-Week Cash Map", "Cash P&amp;L", "Vendor Audit", "About"]) {
    assert.ok(wb.includes(`name="${tab}"`), `missing sheet ${tab}`);
  }
});

test("computed cells are real formulas, not static values", () => {
  const formulaCount = (allSheetXml(buildGoldfinFillableVaultXlsx()).match(/<f>/g) ?? []).length;
  assert.ok(formulaCount >= 40, `expected many formulas, got ${formulaCount}`);
});

test("Command Center: profit, margin, coverage and reserve are formulas wired to inputs", () => {
  const xml = sheet2("Owner Command Center");
  // inputs: Cash B7, Money in B8, Money out B9, Owner pay B10, Reserve months B11.
  assert.ok(xml.includes("<f>$B$8-$B$9</f>"), "profit is not a formula on money in/out");
  assert.ok(xml.includes("<f>IF($B$8=0,0,($B$8-$B$9)/$B$8*100)</f>"), "profit margin formula missing");
  assert.ok(xml.includes("<f>IF($B$9=0,0,$B$7/$B$9)</f>"), "cash coverage (div-0 safe) missing");
  assert.ok(xml.includes("<f>$B$7-$B$9*$B$11</f>"), "cash-over-reserve formula missing");
});

test("Command Center: a plain-English verdict is a text formula (t=str) reading the numbers", () => {
  const xml = sheet2("Owner Command Center");
  assert.match(xml, /t="str"><f>IF\(\(\$B\$8-\$B\$9\)&lt;0,/, "verdict text formula missing");
  assert.ok(xml.includes("Healthy - profitable and above your reserve"), "cached verdict text missing");
});

test("13-Week map: per-week ending cash chains, with MIN + COUNTIF crunch detection", () => {
  const xml = sheet2("13-Week Cash Map");
  // week rows start at row 12 (brand,period,blank,note,blank,section,cash,floor,blank,section,header).
  assert.ok(xml.includes("<f>$B$7+B12-C12</f>"), "week 1 ending should chain from starting cash + week in/out");
  assert.ok(xml.includes("<f>D12+B13-C13</f>"), "week 2 ending should chain from the prior week");
  assert.match(xml, /<f>MIN\(D12:D24\)<\/f>/, "lowest-cash MIN missing");
  // In XML the criteria "<" is escaped: " -> &quot;, < -> &lt;, & -> &amp;.
  assert.match(xml, /<f>COUNTIF\(D12:D24,&quot;&lt;&quot;&amp;\$B\$8\)<\/f>/, "weeks-below-floor COUNTIF missing");
});

test("Cash P&L: each cost shows % of revenue, and margin + tax reserve are formulas", () => {
  const xml = sheet2("Cash-Basis P&L Review");
  assert.match(xml, /<f>IF\(\$B\$7=0,0,B\d+\/\$B\$7\*100\)<\/f>/, "cost % of revenue formula missing");
  assert.match(xml, /<f>SUM\(B\d+:B\d+\)<\/f>/, "total spending SUM missing");
  assert.match(xml, /<f>IF\(\$B\$7=0,0,\(\$B\$7-B\d+\)\/\$B\$7\*100\)<\/f>/, "profit margin formula missing");
});

test("Vendor audit: annual drain, % of total, and a SUMIF cut-savings calculation", () => {
  const xml = sheet2("Expense & Vendor Audit");
  assert.match(xml, /<f>B\d+\*12<\/f>/, "per-vendor annual (monthly*12) missing");
  assert.match(xml, /<f>IF\(\$B\$\d+=0,0,B\d+\/\$B\$\d+\*100\)<\/f>/, "vendor % of total missing");
  assert.match(xml, /<f>SUMIF\(E\d+:E\d+,&quot;Cut&quot;,C\d+:C\d+\)<\/f>/, "annual cut-savings SUMIF missing");
});

test("cached values match the pre-filled sample (profit = in - out = 24,500)", () => {
  const i = DEFAULT_FILLABLE_INPUTS;
  const xml = sheet2("Owner Command Center");
  assert.ok(xml.includes(`<f>$B$8-$B$9</f><v>${i.moneyIn - i.moneyOut}</v>`), "cached profit value is wrong");
});

test("a non-finite input still fails loud (guard survives the formula path)", () => {
  assert.throws(() => buildGoldfinFillableVaultXlsx({ ...DEFAULT_FILLABLE_INPUTS, cashOnHand: NaN }), NonFiniteWorkbookCellError);
});

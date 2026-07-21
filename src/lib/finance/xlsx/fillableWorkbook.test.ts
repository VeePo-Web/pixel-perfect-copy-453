// The FREE lead-magnet templates must be genuinely fillable: shaded input cells
// the owner edits, and computed cells that are Excel FORMULAS referencing those
// inputs (so the workbook recalculates when the owner types their numbers).
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

test("fillable vault is a valid package with all four interactive templates + guidance", () => {
  const bytes = buildGoldfinFillableVaultXlsx();
  const wb = readStoredZipText(bytes, "xl/workbook.xml");
  for (const tab of ["Start here", "Command Center", "13-Week Cash Map", "Cash P&amp;L", "Vendor Audit", "About"]) {
    assert.ok(wb.includes(`name="${tab}"`), `missing sheet ${tab}`);
  }
});

test("computed cells are real formulas, not static values", () => {
  const xml = allSheetXml(buildGoldfinFillableVaultXlsx());
  // Every result cell writes <f>...</f><v>cached</v>. There must be many formulas.
  const formulaCount = (xml.match(/<f>/g) ?? []).length;
  assert.ok(formulaCount >= 20, `expected many formulas, got ${formulaCount}`);
});

test("Net cash formula references the money-in and money-out input cells", () => {
  const xml = readStoredZipText(buildGoldfinFillableTemplateXlsx("Owner Command Center"), "xl/worksheets/sheet2.xml");
  // Inputs land at B7..B10 (brand, period, blank, note, blank, section, then inputs).
  // Net cash = money in - money out, cached to the sample value.
  assert.ok(xml.includes("<f>$B$8-$B$9</f>"), "Net cash is not a formula referencing the inputs");
  assert.ok(xml.includes("<f>$B$7+($B$8-$B$9)*13</f>") === false); // that's the cash-map sheet, not here
});

test("13-Week projections are formulas that compound weekly net over the inputs", () => {
  const xml = readStoredZipText(buildGoldfinFillableTemplateXlsx("13-Week Cash Map"), "xl/worksheets/sheet2.xml");
  assert.ok(xml.includes("<f>$B$7+($B$8-$B$9)*1</f>"), "week 1 projection formula missing");
  assert.ok(xml.includes("<f>$B$7+($B$8-$B$9)*13</f>"), "week 13 projection formula missing");
});

test("Vendor audit total is a SUM over the editable vendor rows", () => {
  const xml = readStoredZipText(buildGoldfinFillableTemplateXlsx("Expense & Vendor Audit"), "xl/worksheets/sheet2.xml");
  assert.match(xml, /<f>SUM\(B\d+:B\d+\)<\/f>/, "vendor total is not a SUM formula");
  assert.match(xml, /<f>SUM\(B\d+:B\d+\)\*12<\/f>/, "annualized total missing");
});

test("cached values match the pre-filled sample inputs (net cash = in - out)", () => {
  const i = DEFAULT_FILLABLE_INPUTS;
  const xml = readStoredZipText(buildGoldfinFillableTemplateXlsx("Owner Command Center"), "xl/worksheets/sheet2.xml");
  const cachedNet = i.moneyIn - i.moneyOut;
  assert.ok(xml.includes(`<f>$B$8-$B$9</f><v>${cachedNet}</v>`), "cached Net cash value is wrong");
});

test("cover-off-by-zero division is guarded in the formula (no #DIV/0!)", () => {
  const xml = readStoredZipText(buildGoldfinFillableTemplateXlsx("Owner Command Center"), "xl/worksheets/sheet2.xml");
  assert.ok(xml.includes("IF($B$9=0,0,$B$7/$B$9)"), "coverage formula not divide-by-zero safe");
});

test("a non-finite input still fails loud (guard survives the formula path)", () => {
  const bad = { ...DEFAULT_FILLABLE_INPUTS, cashOnHand: NaN };
  assert.throws(() => buildGoldfinFillableVaultXlsx(bad), NonFiniteWorkbookCellError);
});

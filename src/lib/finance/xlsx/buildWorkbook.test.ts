import { test, assert } from "vitest";

import type { ProductMetrics } from "../productTemplates.ts";
import {
  buildGoldfinTemplateVaultXlsx,
  buildGoldfinTemplateXlsx,
  goldfinTemplateXlsxFileName,
} from "./buildWorkbook.ts";
import { readStoredZip, readStoredZipText } from "./zip.ts";

const M: ProductMetrics = {
  period: { start: "2026-06-01", end: "2026-06-14" },
  cashOnHand: 84200,
  inflow: 132400,
  outflow: 87540,
  netCash: 44860,
  monthlyBurn: 190000,
  runwayMonths: 0.44,
  nonOperatingExcluded: 15500,
  revenueVsPriorPct: 6.4,
  profitProxy: 44860,
  profitVsPriorPct: 2.8,
  duplicates: [{ merchant: "FedEx", amount: 320, date: "2026-06-09" }],
  unfamiliar: [{ merchant: "New equipment vendor", amount: 2400, date: "2026-06-12" }],
  biggestMover: { category: "Software", from: 2400, to: 3900, delta: 1500 },
  ownerPay: { profit: 6620, ownerPay: 66200, tax: 19860, opex: 39720 },
  waste: [
    { merchant: "Adobe", annual: 720, monthly: 60 },
    { merchant: "Zoom Old Seat", annual: 180, monthly: 15 },
  ],
  wasteAnnualTotal: 900,
  costCreep: [{ merchant: "AWS", from: 1200, to: 1850 }],
  coveragePct: 92.5,
  transactionsCount: 143,
  profile: { reserve_floor_months: 3 },
};

test("vault XLSX is a valid package with visible template sheets and hidden audit sheets", () => {
  const bytes = buildGoldfinTemplateVaultXlsx(M);
  const files = readStoredZip(bytes);
  assert.ok(bytes.byteLength > 1000);
  assert.ok(files.has("[Content_Types].xml"));
  assert.ok(files.has("xl/workbook.xml"));
  assert.ok(files.has("xl/styles.xml"));

  const workbook = readStoredZipText(bytes, "xl/workbook.xml");
  for (const tabName of ["Command Center", "13-Week Cash Map", "Cash P&amp;L", "Vendor Audit"]) {
    assert.ok(workbook.includes(`name="${tabName}"`), `missing sheet ${tabName}`);
  }
  for (const deferred of ["Recurring Spend", "Deposit Trend", "Owner Pay", "Statement Health"]) {
    assert.ok(!workbook.includes(`name="${deferred}"`), `deferred sheet should not ship: ${deferred}`);
  }
  for (const hidden of ["__metrics", "__raw_transactions", "__mapping", "__checks"]) {
    // Attribute-order-independent: the <sheet> element carries name, sheetId,
    // and state — assert the hidden sheet's element exists with state="hidden".
    assert.match(workbook, new RegExp(`name="${hidden}"[^>]*state="hidden"`), `missing hidden sheet ${hidden}`);
  }
});

test("XLSX stores native numbers instead of preformatted currency strings", () => {
  const bytes = buildGoldfinTemplateVaultXlsx(M);
  const cover = readStoredZipText(bytes, "xl/worksheets/sheet1.xml");
  assert.ok(cover.includes("<v>84200</v>"));
  assert.ok(!cover.includes("$84,200"));
});

test("style formats percent-point metrics without Excel percentage scaling", () => {
  const styles = readStoredZipText(buildGoldfinTemplateVaultXlsx(M), "xl/styles.xml");
  assert.ok(styles.includes('numFmtId="165" formatCode="0.0"'));
  assert.ok(!styles.includes('formatCode="0.0%"'));
});

test("individual template workbooks include only the requested visible template", () => {
  const bytes = buildGoldfinTemplateXlsx("13-Week Cash Map", M);
  const workbook = readStoredZipText(bytes, "xl/workbook.xml");
  assert.ok(workbook.includes('name="13-Week Cash Map"'));
  assert.ok(!workbook.includes('name="Expense And Vendor Audit"'));
  assert.match(workbook, /name="__checks"[^>]*state="hidden"/);
});

test("deferred individual workbook titles are refused", () => {
  assert.throws(() => buildGoldfinTemplateXlsx("Owner Pay And Tax Reserve Planner", M), /Unknown GoldFin template/);
});

test("XLSX file names are branded, slugged, and dated", () => {
  assert.equal(goldfinTemplateXlsxFileName("13-Week Cash Map", "2026-06-14"), "goldfin-13-week-cash-map-2026-06-14.xlsx");
});

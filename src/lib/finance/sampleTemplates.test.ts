// The marketing sample must be honest: it passes the same grounding gate as a real
// customer export, and shows every launch lead-magnet template.

import { test, assert } from "vitest";
import {
  buildSampleTemplatesCsv,
  buildSampleTemplatesXlsx,
  SAMPLE_METRICS,
} from "./sampleTemplates.ts";

test("sample export passes the grounding gate and lists every template", () => {
  const csv = buildSampleTemplatesCsv(); // throws UntraceableCellError if any cell is invented
  for (const title of [
    "Owner Command Center",
    "13-Week Cash Map",
    "Cash-Basis P&L Review",
    "Expense And Vendor Audit",
  ]) {
    assert.ok(csv.includes(title), `sample missing ${title}`);
  }
});

test("sample XLSX workbook is generated from the same fixture", () => {
  const xlsx = buildSampleTemplatesXlsx();
  assert.ok(xlsx.byteLength > 1000);
});

test("the demo business is internally consistent (netCash = inflow - outflow)", () => {
  assert.equal(SAMPLE_METRICS.netCash, SAMPLE_METRICS.inflow - SAMPLE_METRICS.outflow);
});

test("the demo business reconciles the way the live engine derives it", () => {
  const m = SAMPLE_METRICS;
  // span in months, exactly as productTemplates.monthsSpan computes it.
  const days = Math.round((Date.parse(m.period.end) - Date.parse(m.period.start)) / 86_400_000);
  const spanMonths = days / 30.4375;
  // monthlyBurn ~ outflow / span (the previous sample was ~11x off here).
  assert.ok(Math.abs(m.monthlyBurn - m.outflow / spanMonths) < 2, "monthlyBurn does not match outflow run-rate");
  // runway ~ cash / burn.
  assert.ok(m.runwayMonths !== null && Math.abs(m.runwayMonths - m.cashOnHand / m.monthlyBurn) < 0.02, "runway does not match cash / burn");
  // Profit-First allocation of the period's deposits (5 / 50 / 15 / 30).
  assert.equal(m.ownerPay.profit, Math.round(m.inflow * 0.05));
  assert.equal(m.ownerPay.ownerPay, Math.round(m.inflow * 0.5));
  assert.equal(m.ownerPay.tax, Math.round(m.inflow * 0.15));
  assert.equal(m.ownerPay.opex, Math.round(m.inflow * 0.3));
  // profitProxy is the cash profit = netCash.
  assert.equal(m.profitProxy, m.netCash);
});

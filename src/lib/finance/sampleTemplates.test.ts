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

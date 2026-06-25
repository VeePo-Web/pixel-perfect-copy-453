// The marketing sample must be honest: it passes the SAME grounding gate as a real
// customer export, and shows all five named templates.

import { test, assert } from "vitest";
import { buildSampleTemplatesCsv, SAMPLE_METRICS } from "./sampleTemplates.ts";

test("sample export passes the grounding gate and lists every template", () => {
  const csv = buildSampleTemplatesCsv(); // throws UntraceableCellError if any cell is invented
  for (const title of [
    "Monthly Review",
    "Cash Flow Forecast",
    "Owner Pay (Profit First)",
    "Subscription & Waste Audit",
    "Tax Reserve",
  ]) {
    assert.ok(csv.includes(title), `sample missing ${title}`);
  }
});

test("the demo business is internally consistent (netCash = inflow - outflow)", () => {
  assert.equal(SAMPLE_METRICS.netCash, SAMPLE_METRICS.inflow - SAMPLE_METRICS.outflow);
});

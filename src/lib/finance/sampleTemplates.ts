// Marketing proof-of-value: a realistic SAMPLE of the auto-filled templates a
// prospect can download BEFORE connecting a bank. Built from a fixed demo business
// and run through the exact same grounding gate (safeTemplatesCsv → traceableValues)
// as a real customer's export — so the sample is honest about what the product does.
// Pure + zero-dep; the browser-download wrapper lives in the marketing component.

import { fillAllTemplates, traceableValues, type ProductMetrics } from "./productTemplates.ts";
import { safeTemplatesCsv } from "./productTemplatesCsv.ts";

/** A believable demo agency — internally consistent (netCash = inflow − outflow). */
export const SAMPLE_METRICS: ProductMetrics = {
  period: { start: "2026-05-15", end: "2026-05-31" },
  cashOnHand: 38400,
  inflow: 52300,
  outflow: 41180,
  netCash: 11120,
  monthlyBurn: 6800,
  runwayMonths: 5.6,
  ownerPay: { profit: 2615, ownerPay: 26150, tax: 7845, opex: 15690 },
  waste: [
    { merchant: "Unused SaaS seat", annual: 588, monthly: 49 },
    { merchant: "Old design tool", annual: 360, monthly: 30 },
  ],
  wasteAnnualTotal: 948,
  costCreep: [{ merchant: "Cloud hosting", from: 240, to: 410 }],
  coveragePct: 94.0,
  transactionsCount: 118,
  profile: { reserve_floor_months: 3 },
};

/** The sample export, gated identically to a live customer's. */
export function buildSampleTemplatesCsv(): string {
  return safeTemplatesCsv(fillAllTemplates(SAMPLE_METRICS), traceableValues(SAMPLE_METRICS));
}

export const SAMPLE_TEMPLATES_FILENAME = "goldfin-sample-templates.csv";

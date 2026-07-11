// Marketing proof-of-value: a realistic sample of the auto-filled templates a
// prospect can download before connecting a bank. Built from a fixed demo
// business and run through the same grounding gates as a customer's export.

import { fillAllTemplates, traceableValues, type ProductMetrics } from "./productTemplates.ts";
import { safeTemplatesCsv } from "./productTemplatesCsv.ts";
import { buildGoldfinTemplateVaultXlsx } from "./xlsx/buildWorkbook.ts";

export const SAMPLE_METRICS: ProductMetrics = {
  period: { start: "2026-05-15", end: "2026-05-31" },
  cashOnHand: 38400,
  inflow: 52300,
  outflow: 41180,
  netCash: 11120,
  monthlyBurn: 6800,
  runwayMonths: 5.6,
  nonOperatingExcluded: 14600,
  revenueVsPriorPct: 6.4,
  profitProxy: 11120,
  profitVsPriorPct: 3.1,
  duplicates: [{ merchant: "Print vendor", amount: 420, date: "2026-05-23" }],
  unfamiliar: [{ merchant: "One-time equipment rental", amount: 1280, date: "2026-05-27" }],
  biggestMover: { category: "Software", from: 2140, to: 3180, delta: 1040 },
  ownerPay: { profit: 2615, ownerPay: 26150, tax: 7845, opex: 15690 },
  waste: [
    { merchant: "Unused SaaS seat", annual: 588, monthly: 49, lastDate: "2026-01-18" },
    { merchant: "Old design tool", annual: 360, monthly: 30, lastDate: "2026-02-04" },
  ],
  wasteAnnualTotal: 948,
  costCreep: [{ merchant: "Cloud hosting", from: 240, to: 410 }],
  coveragePct: 94.0,
  transactionsCount: 118,
  profile: { reserve_floor_months: 3 },
};

export function buildSampleTemplatesCsv(): string {
  return safeTemplatesCsv(fillAllTemplates(SAMPLE_METRICS), traceableValues(SAMPLE_METRICS));
}

export function buildSampleTemplatesXlsx(): Uint8Array {
  return buildGoldfinTemplateVaultXlsx(SAMPLE_METRICS);
}

export const SAMPLE_TEMPLATES_FILENAME = "goldfin-sample-templates.csv";
export const SAMPLE_TEMPLATES_XLSX_FILENAME = "goldfin-sample-template-vault.xlsx";

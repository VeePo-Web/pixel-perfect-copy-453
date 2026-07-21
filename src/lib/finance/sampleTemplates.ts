// Marketing proof-of-value: a realistic sample of the auto-filled templates a
// prospect can download before connecting a bank. Built from a fixed demo
// business and run through the same grounding gates as a customer's export.

import { fillAllTemplates, traceableValues, type ProductMetrics } from "./productTemplates.ts";
import { safeTemplatesCsv } from "./productTemplatesCsv.ts";
import { buildGoldfinTemplateVaultXlsx } from "./xlsx/buildWorkbook.ts";

// A coherent demo business. Every figure reconciles the way the live engine
// derives it, so a financially-literate prospect who cross-checks the sample
// finds numbers that add up (the previous sample had monthlyBurn ~11x below the
// outflow run-rate, which manufactured a falsely reassuring reserve/runway):
//   full calendar month -> span = 30 / 30.4375 = 0.98563 months, 30/7 = 4.2857 weeks
//   netCash      = inflow - outflow                = 96,400 - 71,900 = 24,500
//   monthlyBurn  = outflow / span                  = 71,900 / 0.98563 = 72,948
//   runwayMonths = cashOnHand / monthlyBurn        = 268,000 / 72,948 = 3.67
//   reserveFloor = monthlyBurn * reserve_months    = 72,948 * 3 = 218,844  (cash is comfortably over)
//   ownerPay     = inflow * Profit-First split      (5 / 50 / 15 / 30 %)
//   net_cash_identity (hidden __checks)            = inflow - outflow - netCash = 0
export const SAMPLE_METRICS: ProductMetrics = {
  period: { start: "2026-05-01", end: "2026-05-31" },
  cashOnHand: 268000,
  inflow: 96400,
  outflow: 71900,
  netCash: 24500,
  monthlyBurn: 72948,
  runwayMonths: 3.67,
  nonOperatingExcluded: 22700,
  revenueVsPriorPct: 6.4,
  profitProxy: 24500,
  profitVsPriorPct: 3.1,
  duplicates: [{ merchant: "Print vendor", amount: 420, date: "2026-05-23" }],
  unfamiliar: [{ merchant: "One-time equipment rental", amount: 1280, date: "2026-05-27" }],
  biggestMover: { category: "Software", from: 2140, to: 3180, delta: 1040 },
  ownerPay: { profit: 4820, ownerPay: 48200, tax: 14460, opex: 28920 },
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

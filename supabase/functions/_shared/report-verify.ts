// =========================================================================
// VERIFICATION LAYER  (Layer 4 — anti-hallucination, deterministic)
// Extracts every FINANCIAL figure ($ amounts, %, months, and bare numbers)
// from the generated report text and asserts each traces to a number the
// metrics engine actually produced OR to an explicitly allowed constant
// scoped to that kind. Any orphan number BLOCKS the send.
//
// The allow-lists are SEPARATED by kind (fix-handoff Tasks 3+5):
//   currencyAllowed — metrics figures + injected extras ONLY. A structural
//     count (60-day window, Profit First %, "3 subscriptions") can never
//     ground a dollar amount — "$60" must trace to a real $60 figure.
//   percentAllowed  — percent constants (Profit First 5/15/50/30, 0/100) +
//     figure-derived percents + injected extras in percent range.
//   countAllowed    — small structural integers (item counts, months 1–12,
//     transaction count, reserve floor).
// Tolerances are tight (Task 5): currency to the nearest dollar, percents
// ±0.5pt, months ±5% — never the old ±max($1, 1%) band that passed
// materially wrong figures. A bare-number scan catches ungrounded numbers
// ≥100 written without a $ / % / months marker, so the gate no longer
// depends on the model remembering to prefix "$".
//
// This is what makes "grounded, never invented" structurally true rather
// than merely instructed.
// =========================================================================

import type { MetricsPayload } from "./report-metrics.ts";

export type VerifyResult = {
  passed: boolean;
  orphans: { raw: string; value: number; kind: string }[];
  checked: number;
};

// Small integer counts the report may narrate ("3 subscriptions",
// "2 invoices", 1..12 months). Percentages and dollar amounts do NOT
// draw from this set — they must match a real METRICS figure.
function countAllowed(p: MetricsPayload): Set<number> {
  const s = new Set<number>([0, p.profile.reserve_floor_months]);
  s.add(p.waste.length);
  s.add(p.duplicates.length);
  s.add(p.unfamiliar.length);
  s.add(p.costCreep.length);
  s.add(p.transactionsCount);
  // small counts 1..12 are structural (months, item counts)
  for (let i = 1; i <= 12; i++) s.add(i);
  return s;
}

// Percentages that are legitimately citable but not in METRICS figures:
// Profit First allocation targets (5% profit, 50% owner pay, 15% tax,
// 30% opex) and the 0/100 endpoints.
const PERCENT_CONSTANTS = [0, 5, 15, 30, 50, 100];

function matches(value: number, allowed: number[], absTol: number, relTol: number): boolean {
  for (const a of allowed) {
    const tol = Math.max(absTol, Math.abs(a) * relTol);
    if (Math.abs(value - a) <= tol) return true;
  }
  return false;
}

/**
 * @param text          full generated report (subject + all section bodies)
 * @param payload       the deterministic metrics the report was built from
 * @param allowedExtra  extra citable numbers injected into the prompt
 *                      (benchmark figures, tax-savings range bounds, etc.)
 */
export function verifyReport(
  text: string,
  payload: MetricsPayload,
  allowedExtra: number[] = [],
): VerifyResult {
  const figureValues = Object.values(payload.figures).map((v) => Math.abs(v));
  const extras = allowedExtra.map(Math.abs);
  const counts = countAllowed(payload);

  // Dollar grounding: real figures + injected extras only. $0 is always sayable.
  const currencyAllowed = [...figureValues, ...extras, 0];
  // Percent grounding: constants + figure-derived percents + injected extras
  // in percent range (benchmark bounds like "65%"). Dollar-scale figures
  // (>100) never ground a percent claim.
  const percentAllowed = [
    ...PERCENT_CONSTANTS,
    payload.revenueVsPriorPct ?? NaN,
    payload.profitVsPriorPct ?? NaN,
    payload.coveragePct,
    ...figureValues.filter((n) => n >= 0 && n <= 100),
    ...extras.filter((n) => n >= 0 && n <= 100),
  ].filter((n) => !Number.isNaN(n)).map(Math.abs);
  // Months grounding: runway + reserve floor (integers 1..12 pass as counts —
  // "over the next 12 months" is narrative duration, not a claimed figure).
  const monthVals = [payload.runwayMonths ?? NaN, payload.profile.reserve_floor_months]
    .filter((n) => !Number.isNaN(n));

  const orphans: VerifyResult["orphans"] = [];
  let checked = 0;
  // Track matched spans so the bare-number scan only sees unmarked numbers.
  let residual = text;
  const consume = (raw: string) => {
    residual = residual.replace(raw, " ".repeat(raw.length));
  };

  // ---- $ amounts: $7,344  $1,150.50  $12,000 — nearest-dollar only --------
  const moneyRe = /\$\s?([\d,]+(?:\.\d+)?)/g;
  for (const m of text.matchAll(moneyRe)) {
    consume(m[0]);
    const value = parseFloat(m[1].replace(/,/g, ""));
    if (Number.isNaN(value)) continue;
    checked++;
    if (matches(value, currencyAllowed, 1, 0)) continue;
    orphans.push({ raw: m[0], value, kind: "money" });
  }

  // ---- percentages: 9%  14.2% — ±0.5 percentage point ----------------------
  const pctRe = /([\d,]+(?:\.\d+)?)\s?%/g;
  for (const m of text.matchAll(pctRe)) {
    consume(m[0]);
    const value = parseFloat(m[1].replace(/,/g, ""));
    if (Number.isNaN(value)) continue;
    checked++;
    if (matches(value, percentAllowed, 0.5, 0)) continue;
    orphans.push({ raw: m[0], value, kind: "percent" });
  }

  // ---- months: 5.1 months  2.9 months --------------------------------------
  const monthsRe = /([\d,]+(?:\.\d+)?)\s?months?/gi;
  for (const m of text.matchAll(monthsRe)) {
    consume(m[0]);
    const value = parseFloat(m[1].replace(/,/g, ""));
    if (Number.isNaN(value)) continue;
    checked++;
    if (matches(value, monthVals, 0.1, 0.05)) continue;
    if (Number.isInteger(value) && counts.has(value)) continue;
    orphans.push({ raw: m[0], value, kind: "months" });
  }

  // ---- BARE numbers ≥100 with no $ / % / months marker (Task 5) -----------
  // "you'll save 1,200 a year" must still trace. Calendar years 2000–2100
  // are exempt, as are the structural counts.
  const bareRe = /\b(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?\b/g;
  for (const m of residual.matchAll(bareRe)) {
    const value = parseFloat(m[0].replace(/,/g, ""));
    if (Number.isNaN(value) || value < 100) continue;
    if (value >= 2000 && value <= 2100 && Number.isInteger(value)) continue; // years
    checked++;
    if (matches(value, currencyAllowed, 1, 0)) continue;
    if (counts.has(value)) continue;
    orphans.push({ raw: m[0], value, kind: "bare" });
  }

  return { passed: orphans.length === 0, orphans, checked };
}

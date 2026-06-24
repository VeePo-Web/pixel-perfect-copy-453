// =========================================================================
// VERIFICATION LAYER  (Layer 4 — anti-hallucination, deterministic)
// Extracts every FINANCIAL figure ($ amounts, %, months) from the generated
// report text and asserts each traces to a number the metrics engine actually
// produced (within rounding tolerance) OR to an explicitly allowed constant
// (benchmarks injected into the prompt, the 60-day dispute window, Profit
// First %s, structural counts). Any orphan number BLOCKS the send.
//
// This is what makes "grounded, never invented" structurally true rather than
// merely instructed.
// =========================================================================

import type { MetricsPayload } from "./report-metrics.ts";

export type VerifyResult = {
  passed: boolean;
  orphans: { raw: string; value: number; kind: string }[];
  checked: number;
};

// Numbers that are legitimately citable but not in the metrics figures map:
// the 60-day dispute window, the Profit First allocation %s, and the small
// structural counts the report narrates ("3 subscriptions", "2 invoices").
function structuralAllowed(p: MetricsPayload): Set<number> {
  const s = new Set<number>([60, 5, 50, 15, 30, 0, 100, p.profile.reserve_floor_months]);
  s.add(p.waste.length);
  s.add(p.duplicates.length);
  s.add(p.costCreep.length);
  s.add(p.transactionsCount);
  // small counts 1..12 are structural (months, item counts) — allowed
  for (let i = 1; i <= 12; i++) s.add(i);
  return s;
}

function matches(value: number, allowed: number[], pct: number): boolean {
  for (const a of allowed) {
    const tol = Math.max(1, Math.abs(a) * pct);
    if (Math.abs(value - a) <= tol) return true;
  }
  return false;
}

/**
 * @param text       full generated report (all section bodies + subject concatenated)
 * @param payload    the deterministic metrics the report was built from
 * @param allowedExtra extra citable numbers injected into the prompt
 *                     (benchmark figures, tax-savings range bounds, etc.)
 */
export function verifyReport(
  text: string,
  payload: MetricsPayload,
  allowedExtra: number[] = [],
): VerifyResult {
  const figureValues = Object.values(payload.figures).map((v) => Math.abs(v));
  const structural = [...structuralAllowed(payload)];
  const dollarAllowed = [...figureValues, ...allowedExtra.map(Math.abs)];
  const pctAllowed = [
    ...figureValues,
    ...allowedExtra.map(Math.abs),
    payload.revenueVsPriorPct ?? NaN,
    payload.profitVsPriorPct ?? NaN,
    payload.coveragePct,
  ].filter((n) => !Number.isNaN(n)).map(Math.abs);

  const orphans: VerifyResult["orphans"] = [];
  let checked = 0;

  // $ amounts: $7,344  $1,150.50  $12,000
  const moneyRe = /\$\s?([\d,]+(?:\.\d+)?)/g;
  for (const m of text.matchAll(moneyRe)) {
    const value = parseFloat(m[1].replace(/,/g, ""));
    if (Number.isNaN(value)) continue;
    checked++;
    // allow exact rounding to nearest dollar / nearest 1%
    if (matches(value, dollarAllowed, 0.01) || structural.includes(value)) continue;
    orphans.push({ raw: m[0], value, kind: "money" });
  }

  // percentages: 9%  14.2%
  const pctRe = /(\d+(?:\.\d+)?)\s?%/g;
  for (const m of text.matchAll(pctRe)) {
    const value = parseFloat(m[1]);
    checked++;
    if (matches(value, pctAllowed, 0.02) || structural.includes(value)) continue;
    orphans.push({ raw: m[0], value, kind: "percent" });
  }

  // months: 5.1 months  2.9 months
  const monthsRe = /(\d+(?:\.\d+)?)\s?months?/gi;
  for (const m of text.matchAll(monthsRe)) {
    const value = parseFloat(m[1]);
    checked++;
    const monthVals = [payload.runwayMonths ?? NaN, payload.profile.reserve_floor_months]
      .filter((n) => !Number.isNaN(n));
    if (matches(value, monthVals, 0.05) || structural.includes(value)) continue;
    orphans.push({ raw: m[0], value, kind: "months" });
  }

  return { passed: orphans.length === 0, orphans, checked };
}

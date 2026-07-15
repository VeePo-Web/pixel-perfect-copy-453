// =========================================================================
// VERIFICATION LAYER  (Layer 4 — anti-hallucination, deterministic)
// Extracts every FINANCIAL figure ($ amounts, %, months, bare counts ≥100)
// from the generated report text and asserts each traces to a number the
// metrics engine actually produced (within tight tolerance) OR to an
// explicitly allowed constant scoped to that kind (currency vs percent vs
// count). Any orphan number BLOCKS the send.
//
// This is what makes "grounded, never invented" structurally true rather
// than merely instructed.
//
// Handoff Tasks 3 + 5 (2026-07-15): the previous version shared ONE
// `structuralAllowed` set across $ and % matches AND used a ±1% tolerance,
// which let bare `$60`, `$5`, `30%`, `15%`, and `$1..$12` slip through
// regardless of whether METRICS actually produced them. This version:
//   - splits allowed into countAllowed / currencyAllowed / percentAllowed
//   - tightens currency tolerance to max($1, 0.5%) — nearest-dollar
//   - tightens percent tolerance to ±0.5pp
//   - adds a bare-number scan for standalone integers ≥100 (excluding years)
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
  s.add(p.costCreep.length);
  s.add(p.transactionsCount);
  for (let i = 1; i <= 12; i++) s.add(i);
  return s;
}

// Percentages that are legitimately citable but not in METRICS figures:
// Profit First allocation targets, and 0/100 endpoints.
function percentConstants(): number[] {
  // Profit First: 5% profit, 50% owner pay, 15% tax, 30% opex. 0 and 100
  // are structural endpoints ("100% of the shortfall", "0% coverage").
  return [0, 5, 15, 30, 50, 100];
}

// Currency constants: the 60-day federal dispute window is a MONTHS figure,
// not currency, so it doesn't belong here. Currency ONLY matches figures
// engine produced or allowed extras (benchmark bounds, tax savings range).
function currencyConstants(): number[] {
  return [0];
}

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
 *                      — treated as CURRENCY unless also in metrics.
 */
export function verifyReport(
  text: string,
  payload: MetricsPayload,
  allowedExtra: number[] = [],
): VerifyResult {
  const figureValues = Object.values(payload.figures).map((v) => Math.abs(v));

  // Kind-scoped allow lists (Handoff Task 3 + 5).
  const counts = countAllowed(payload);
  const currencyAllowed = [
    ...figureValues,
    ...allowedExtra.map((n) => Math.abs(n)),
    ...currencyConstants(),
  ];
  const percentAllowed = [
    ...percentConstants(),
    payload.revenueVsPriorPct ?? NaN,
    payload.profitVsPriorPct ?? NaN,
    payload.coveragePct,
    // Percentages that live inside METRICS figures (industry pack targets,
    // margin percentages) — carry through.
    ...figureValues.filter((n) => n >= 0 && n <= 100),
  ].filter((n) => !Number.isNaN(n)).map((n) => Math.abs(n));

  const orphans: VerifyResult["orphans"] = [];
  let checked = 0;

  // ---- $ amounts: $7,344  $1,150.50  $12,000 -----------------------------
  // Nearest-dollar tolerance floor + 0.5% relative for larger sums.
  const moneyRe = /\$\s?([\d,]+(?:\.\d+)?)/g;
  const moneySpans: Array<[number, number]> = [];
  for (const m of text.matchAll(moneyRe)) {
    const value = parseFloat(m[1].replace(/,/g, ""));
    if (Number.isNaN(value)) continue;
    checked++;
    if (matches(value, currencyAllowed, 1, 0.005)) continue;
    orphans.push({ raw: m[0], value, kind: "money" });
    moneySpans.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
  }

  // ---- percentages: 9%  14.2% --------------------------------------------
  // ±0.5 percentage point tolerance (absolute), no relative loosening.
  const pctRe = /(\d+(?:\.\d+)?)\s?%/g;
  const pctSpans: Array<[number, number]> = [];
  for (const m of text.matchAll(pctRe)) {
    const value = parseFloat(m[1]);
    checked++;
    if (matches(value, percentAllowed, 0.5, 0)) continue;
    orphans.push({ raw: m[0], value, kind: "percent" });
    pctSpans.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
  }

  // ---- months: 5.1 months  2.9 months ------------------------------------
  const monthsRe = /(\d+(?:\.\d+)?)\s?months?/gi;
  const monthSpans: Array<[number, number]> = [];
  for (const m of text.matchAll(monthsRe)) {
    const value = parseFloat(m[1]);
    checked++;
    const monthVals = [
      payload.runwayMonths ?? NaN,
      payload.profile.reserve_floor_months,
      60, // 60-day (≈2 month) federal dispute window — sometimes phrased "2 months"
    ].filter((n) => !Number.isNaN(n));
    if (matches(value, monthVals, 0.1, 0.05) || counts.has(value)) continue;
    orphans.push({ raw: m[0], value, kind: "months" });
    monthSpans.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
  }

  // ---- BARE numbers ≥100 with no $/%/months/days suffix, not a year -------
  // Excludes anything already claimed by the money/percent/months scans, plus
  // 4-digit years 2000..2099.
  const covered = [...moneySpans, ...pctSpans, ...monthSpans];
  const bareRe = /(?<![\$\d.,])(\d{3,}(?:[.,]\d+)?)(?!\s?%|\s?months?|\s?days?|\d)/gi;
  for (const m of text.matchAll(bareRe)) {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    if (covered.some(([a, b]) => start >= a && end <= b)) continue;
    const raw = m[1].replace(/,/g, "");
    const value = parseFloat(raw);
    if (Number.isNaN(value)) continue;
    // Skip 4-digit calendar years.
    if (/^\d{4}$/.test(raw) && value >= 2000 && value <= 2099) continue;
    checked++;
    // Bare integers may cite a real METRICS figure (dollar or count) — check
    // BOTH allow lists so "$1,500" written as "1,500" isn't flagged.
    if (
      matches(value, currencyAllowed, 1, 0.005) ||
      counts.has(value) ||
      matches(value, [...counts], 0, 0)
    ) continue;
    orphans.push({ raw: m[0], value, kind: "bare" });
  }

  return { passed: orphans.length === 0, orphans, checked };
}

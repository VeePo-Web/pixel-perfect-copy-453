// =========================================================================
// ENRICHMENT / CATEGORIZATION  (Layer 0 — the load-bearing wall)
// Cycle-5 §"Layer 0" + Cycle-7 §4 step 1. Raw bank/card descriptors are
// messy ("AMZN / Amazon.com / AMZ*Digital"); Plaid's category is broad. One
// wrong number is the "fireable offense" that destroys trust — so EVERY metric
// downstream runs only on this layer's output.
//
// The proven method is a hybrid hierarchy, highest-confidence first:
//   1. OWNER CORRECTION  (correction memory — self-trains the categorizer)
//   2. DETERMINISTIC RULE (known merchants → canonical category)
//   3. PLAID personal_finance_category (enrichment)
//   4. LEGACY category[] fallback
//   5. UNCATEGORIZED (low confidence — surfaced, never silently guessed)
//
// PURE + dependency-free so it is unit-tested and shared by the sync function
// and the correction function alike. Server-authoritative everywhere it runs.
// =========================================================================

export type EnrichInput = {
  merchantNorm: string | null;
  pfcDetailed: string | null;
  pfcPrimary: string | null;
  confidenceLevel: string | null;   // Plaid: VERY_HIGH | HIGH | MEDIUM | LOW | UNKNOWN
  legacyFirst: string | null;       // legacy category[] first element
};

export type EnrichResult = {
  category: string | null;
  confidence: number;               // 0..1
  source: "owner" | "rule" | "plaid" | "legacy" | "none";
  ownerCorrected: boolean;
};

/** Owner corrections, keyed by normalized merchant — the self-training memory. */
export type CorrectionMap = Map<string, string>;

const PLAID_CONFIDENCE: Record<string, number> = {
  VERY_HIGH: 0.95, HIGH: 0.8, MEDIUM: 0.6, LOW: 0.3, UNKNOWN: 0.1,
};

// Deterministic merchant → canonical category rules. Stable, auditable, and
// always beat Plaid's broad guess for the merchants owners care about most
// (the recurring SaaS/utilities/fees that drive the waste + cost-creep math).
const MERCHANT_RULES: { test: RegExp; category: string }[] = [
  { test: /\b(adobe|figma|notion|slack|zoom|dropbox|github|atlassian|hubspot|salesforce|quickbooks|xero|canva|zapier|airtable)\b/i, category: "Software & Subscriptions" },
  { test: /\b(aws|amazon web services|google cloud|gcp|azure|digitalocean|vercel|netlify|cloudflare|heroku)\b/i, category: "Cloud & Hosting" },
  { test: /\b(stripe|square|paypal|shopify payments|merchant fee|interchange)\b/i, category: "Payment Processing Fees" },
  { test: /\b(gusto|adp|rippling|justworks|paychex)\b/i, category: "Payroll & Benefits" },
  { test: /\b(comcast|verizon|at&t|t-mobile|spectrum|xfinity)\b/i, category: "Utilities & Telecom" },
  { test: /\b(uber|lyft|delta|united|american airlines|marriott|hilton|airbnb)\b/i, category: "Travel" },
  { test: /\b(meta|facebook ads|google ads|tiktok ads|linkedin ads)\b/i, category: "Advertising" },
];

function ruleCategory(merchantNorm: string | null): string | null {
  if (!merchantNorm) return null;
  for (const r of MERCHANT_RULES) if (r.test.test(merchantNorm)) return r.category;
  return null;
}

/**
 * Resolve one transaction's category + confidence through the trust hierarchy.
 * Corrections (owner-trained) and rules (deterministic) take precedence over
 * Plaid's broad classification. The result records its SOURCE so coverage and
 * the "owner_corrected" flag are honest.
 */
export function enrichTransaction(input: EnrichInput, corrections: CorrectionMap): EnrichResult {
  const key = (input.merchantNorm ?? "").toUpperCase();

  // 1. Owner correction memory — self-training, always wins.
  if (key && corrections.has(key)) {
    return { category: corrections.get(key) as string, confidence: 1, source: "owner", ownerCorrected: true };
  }
  // 2. Deterministic merchant rule.
  const ruled = ruleCategory(input.merchantNorm);
  if (ruled) return { category: ruled, confidence: 0.97, source: "rule", ownerCorrected: false };

  // 3. Plaid personal_finance_category.
  const plaidCat = input.pfcDetailed ?? input.pfcPrimary;
  if (plaidCat) {
    return {
      category: plaidCat,
      confidence: PLAID_CONFIDENCE[input.confidenceLevel ?? "UNKNOWN"] ?? 0.1,
      source: "plaid",
      ownerCorrected: false,
    };
  }
  // 4. Legacy fallback.
  if (input.legacyFirst) return { category: input.legacyFirst, confidence: 0.3, source: "legacy", ownerCorrected: false };

  // 5. Uncategorized — surfaced honestly, never guessed.
  return { category: null, confidence: 0.1, source: "none", ownerCorrected: false };
}

/** Build the correction lookup from stored owner corrections. */
export function buildCorrectionMap(rows: { merchant_name_norm: string | null; category: string }[]): CorrectionMap {
  const m: CorrectionMap = new Map();
  for (const r of rows) {
    if (r.merchant_name_norm) m.set(r.merchant_name_norm.toUpperCase(), r.category);
  }
  return m;
}

/** Coverage = share of transactions categorized at/above the confidence floor. */
export function coveragePct(
  txns: { category: string | null; confidence: number }[],
  threshold = 0.6,
): number {
  if (txns.length === 0) return 0;
  const ok = txns.filter((t) => t.category != null && t.confidence >= threshold).length;
  return Math.round((ok / txns.length) * 10000) / 100;
}

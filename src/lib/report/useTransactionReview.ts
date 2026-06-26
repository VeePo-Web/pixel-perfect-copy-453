import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// plaid_transactions lags the auto-generated Database types (migration
// 20260623120000). Cast at the boundary; remove when types regenerate.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type RawTxn = {
  merchant_name_norm: string | null;
  category: string | null;
  confidence: number;
  amount: number;
  posted_date: string;
  owner_corrected: boolean;
};

/** One merchant the owner can correct in a single action — the correction
 *  back-fills every transaction from this merchant (merchant-keyed memory). */
export interface MerchantGroup {
  merchant: string;
  count: number;
  total: number;          // sum of spend (Plaid sign: positive = out)
  category: string | null;
  minConfidence: number;  // lowest confidence in the group (drives "needs review")
  ownerCorrected: boolean;
  lastDate: string;
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

function group(rows: RawTxn[]): MerchantGroup[] {
  const map = new Map<string, MerchantGroup>();
  for (const t of rows) {
    const key = t.merchant_name_norm;
    if (!key) continue;
    const g = map.get(key) ?? {
      merchant: key, count: 0, total: 0, category: t.category,
      minConfidence: 1, ownerCorrected: false, lastDate: t.posted_date,
    };
    g.count += 1;
    if (t.amount > 0) g.total += t.amount; // spend only
    if (t.confidence < g.minConfidence) { g.minConfidence = t.confidence; g.category = t.category; }
    if (t.owner_corrected) g.ownerCorrected = true;
    if (t.posted_date > g.lastDate) g.lastDate = t.posted_date;
    map.set(key, g);
  }
  // Lowest confidence first (what needs review), then by spend.
  return [...map.values()].sort(
    (a, b) => a.minConfidence - b.minConfidence || b.total - a.total,
  );
}

export function useTransactionReview(threshold = 0.6) {
  const [groups, setGroups] = useState<MerchantGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null); // merchant being saved
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db
      .from("plaid_transactions")
      .select("merchant_name_norm, category, confidence, amount, posted_date, owner_corrected")
      .gte("posted_date", isoDaysAgo(60))
      .order("posted_date", { ascending: false })
      .limit(1000);
    if (error) setError(error.message);
    setGroups(group((data as RawTxn[]) ?? []));
    setLoading(false);
  }, []);

  const correct = useCallback(async (merchantNorm: string, category: string) => {
    setBusy(merchantNorm);
    setError(null);
    setMsg(null);
    const { data, error } = await supabase.functions.invoke("plaid-correct-transaction", {
      body: { merchantNorm, category },
    });
    if (error) setError(error.message);
    else {
      const n = data && typeof data === "object" && "backfilled" in data
        ? Number((data as { backfilled: number }).backfilled) : 0;
      setMsg(`Updated ${n} transaction${n === 1 ? "" : "s"} from ${merchantNorm}.`);
      await load();
    }
    setBusy(null);
  }, [load]);

  useEffect(() => { void load(); }, [load]);

  const needsReview = groups.filter((g) => !g.ownerCorrected && (g.category == null || g.minConfidence < threshold));

  return { groups, needsReview, loading, busy, msg, error, correct, reload: load };
}

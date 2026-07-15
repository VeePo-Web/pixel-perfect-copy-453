// Pulls the transaction feed for one Plaid item and stores it enriched +
// categorized (Layer 0). Cursor-based /transactions/sync (uses the existing
// plaid_items.cursor column) + /transactions/recurring/get for the waste
// detector. Merchant normalization collapses "AMZN / Amazon.com / AMZ*Digital"
// into one merchant; Plaid's personal_finance_category drives category +
// confidence. Server-authoritative: all writes via service_role.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid, getAccessToken } from "../_shared/plaid.ts";
import { buildCorrectionMap, enrichTransaction } from "../_shared/report-enrich.ts";

const Body = z.object({ itemId: z.string().uuid() });

/** Collapse messy bank descriptors to a clean, stable merchant key. */
function normalizeMerchant(merchant: string | null, name: string | null): string | null {
  const base = (merchant || name || "").toUpperCase().trim();
  if (!base) return null;
  let s = base
    .replace(/AMZN MKTP.*|AMZN.*|AMAZON\.COM.*|AMZ\*.*/g, "AMAZON")
    .replace(/SQ \*|SQUARE \*|TST\*|TST \*/g, "")
    .replace(/PAYPAL \*|PP\*/g, "")
    .replace(/\b\d{3,}\b/g, "")          // store/ref numbers
    .replace(/#\s?\d+/g, "")
    .replace(/[*]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  // Title-case a clean version
  s = s.split(" ").filter(Boolean).slice(0, 4).join(" ");
  return s || base;
}

type PfCategory = { primary?: string; detailed?: string; confidence_level?: string };
type SyncTxn = {
  transaction_id: string;
  account_id: string;
  date: string;
  name: string | null;
  merchant_name: string | null;
  amount: number;
  iso_currency_code: string | null;
  pending: boolean;
  personal_finance_category?: PfCategory | null;
  category?: string[] | null;
};
type SyncResp = {
  added: SyncTxn[];
  modified: SyncTxn[];
  removed: { transaction_id: string }[];
  next_cursor: string;
  has_more: boolean;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

    const admin = adminClient();
    const { data: item, error } = await admin
      .from("plaid_items")
      .select("id, user_id, cursor")
      .eq("id", parsed.data.itemId)
      .single();
    if (error || !item || item.user_id !== user.id) return json({ error: "Item not found" }, 404);
    const accessToken = await getAccessToken(admin, item.id);

    // ---- Layer 0: load the owner's correction memory (self-training categorizer) ----
    const correctionsRes = await admin
      .from("transaction_corrections")
      .select("merchant_name_norm, category")
      .eq("user_id", item.user_id);
    const corrections = buildCorrectionMap(correctionsRes.data ?? []);

    // ---- /transactions/sync (cursor-paged) ----
    let cursor: string | undefined = item.cursor ?? undefined;
    let added = 0, modified = 0, removed = 0;
    for (let guard = 0; guard < 50; guard++) {
      const resp = await plaid<SyncResp>("/transactions/sync", {
        access_token: accessToken,
        cursor: cursor ?? null,
        count: 500,
        // Handoff Task 6: pin PFC v2 so category taxonomy is stable across
        // Plaid rollouts (v1 is being deprecated).
        options: { include_personal_finance_category: true },
        personal_finance_category_version: "v2",
      });


      const upserts = [...resp.added, ...resp.modified].map((t) => {
        const pf = t.personal_finance_category ?? null;
        const merchantNorm = normalizeMerchant(t.merchant_name, t.name);
        // Layer 0 enrichment: owner correction > deterministic rule > Plaid PFC > legacy.
        const enriched = enrichTransaction({
          merchantNorm,
          pfcDetailed: pf?.detailed ?? null,
          pfcPrimary: pf?.primary ?? null,
          confidenceLevel: pf?.confidence_level ?? null,
          legacyFirst: t.category?.[0] ?? null,
        }, corrections);
        return {
          user_id: item.user_id,
          plaid_item_id: item.id,
          account_id: t.account_id,
          plaid_transaction_id: t.transaction_id,
          posted_date: t.date,
          name: t.name,
          merchant_name_raw: t.merchant_name,
          merchant_name_norm: merchantNorm,
          amount: t.amount,
          iso_currency_code: t.iso_currency_code,
          pending: t.pending,
          category_raw: pf ?? (t.category ? { legacy: t.category } : null),
          category: enriched.category,
          confidence: enriched.confidence,
          owner_corrected: enriched.ownerCorrected,
        };
      });

      if (upserts.length) {
        const { error: upErr } = await admin
          .from("plaid_transactions")
          .upsert(upserts, { onConflict: "plaid_transaction_id" });
        if (upErr) throw new Error(upErr.message);
        added += resp.added.length;
        modified += resp.modified.length;
      }
      if (resp.removed.length) {
        const ids = resp.removed.map((r) => r.transaction_id);
        await admin.from("plaid_transactions").delete().in("plaid_transaction_id", ids);
        removed += ids.length;
      }

      cursor = resp.next_cursor;
      if (!resp.has_more) break;
    }
    await admin.from("plaid_items")
      .update({ cursor, last_synced_at: new Date().toISOString() })
      .eq("id", item.id);

    // ---- /transactions/recurring/get (waste detector source) ----
    let streamsStored = 0;
    try {
      const accts = await admin.from("plaid_accounts").select("account_id").eq("plaid_item_id", item.id);
      const accountIds = (accts.data ?? []).map((a) => a.account_id);
      if (accountIds.length) {
        type Stream = {
          stream_id: string; description: string | null; merchant_name: string | null;
          category?: { primary?: string } | null; first_date?: string | null; last_date: string | null;
          frequency: string | null; last_amount?: { amount: number } | null;
          average_amount?: { amount: number } | null; is_active: boolean; status: string | null;
        };
        const rec = await plaid<{ outflow_streams: Stream[]; inflow_streams: Stream[] }>(
          "/transactions/recurring/get",
          { access_token: accessToken, account_ids: accountIds, personal_finance_category_version: "v2" },
        );

        const mapStream = (s: Stream, direction: string) => ({
          user_id: item.user_id,
          plaid_item_id: item.id,
          stream_id: s.stream_id,
          direction,
          description: s.description,
          merchant_name: normalizeMerchant(s.merchant_name, s.description),
          category: s.category?.primary ?? null,
          frequency: s.frequency,
          last_amount: s.last_amount?.amount ?? null,
          average_amount: s.average_amount?.amount ?? null,
          first_amount: s.average_amount?.amount ?? null, // proxy: avg ~ baseline for creep
          last_date: s.last_date,
          is_active: s.is_active,
          status: s.status,
        });
        const rows = [
          ...rec.outflow_streams.map((s) => mapStream(s, "outflow")),
          ...rec.inflow_streams.map((s) => mapStream(s, "inflow")),
        ];
        if (rows.length) {
          const { error: rErr } = await admin
            .from("recurring_streams")
            .upsert(rows, { onConflict: "stream_id" });
          if (rErr) throw new Error(rErr.message);
          streamsStored = rows.length;
        }
      }
    } catch (e) {
      // recurring is an add-on; never fail the whole sync if it's unavailable
      console.warn("recurring/get unavailable:", e instanceof Error ? e.message : e);
    }

    return json({ added, modified, removed, streams: streamsStored });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

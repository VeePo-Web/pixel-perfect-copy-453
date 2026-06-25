// Owner category correction → the self-training loop (Layer 0).
// Records "this merchant is actually <category>" into transaction_corrections
// (the correction memory) AND back-fills every existing transaction from that
// merchant for this owner — so the fix is retroactive and every future sync
// inherits it (enrichTransaction gives owner corrections top precedence).
// Server-authoritative: the write happens via service_role, never the client.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";

const Body = z.object({
  merchantNorm: z.string().min(1).max(120),
  category: z.string().min(1).max(80),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

    const merchantNorm = parsed.data.merchantNorm.trim();
    const category = parsed.data.category.trim();
    const admin = adminClient();

    // 1. Persist the correction memory (self-training, idempotent upsert).
    const { error: upErr } = await admin
      .from("transaction_corrections")
      .upsert(
        { user_id: user.id, merchant_name_norm: merchantNorm, category, updated_at: new Date().toISOString() },
        { onConflict: "user_id,merchant_name_norm" },
      );
    if (upErr) throw new Error(upErr.message);

    // 2. Back-fill every existing transaction from this merchant (retroactive,
    //    confidence 1.0, flagged owner_corrected). Scoped to this user only.
    const { data: updated, error: bfErr } = await admin
      .from("plaid_transactions")
      .update({ category, confidence: 1, owner_corrected: true })
      .eq("user_id", user.id)
      .eq("merchant_name_norm", merchantNorm)
      .select("id");
    if (bfErr) throw new Error(bfErr.message);

    return json({ ok: true, merchantNorm, category, backfilled: updated?.length ?? 0 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

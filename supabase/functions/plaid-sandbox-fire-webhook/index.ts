// TEST-ONLY: fires a synthetic Plaid webhook against plaid-webhook with the
// correct shared secret so the full reauth/update branches can be exercised
// from outside without exposing PLAID_WEBHOOK_SECRET to clients.
import { corsHeaders, getUserFromRequest, json, adminClient } from "../_shared/auth-context.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if ((Deno.env.get("PLAID_ENV") || "sandbox").toLowerCase() !== "sandbox") {
      return json({ error: "sandbox only" }, 403);
    }
    const user = await getUserFromRequest(req);
    const { itemLocalId, webhook_type, webhook_code, error } = await req.json();

    // Validate that the item belongs to the caller
    const admin = adminClient();
    const { data: item } = await admin
      .from("plaid_items")
      .select("plaid_item_id, user_id")
      .eq("id", itemLocalId)
      .maybeSingle();
    if (!item || item.user_id !== user.id) return json({ error: "not found" }, 404);

    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/plaid-webhook`;
    const secret = Deno.env.get("PLAID_WEBHOOK_SECRET") ?? "";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-plaid-webhook-secret": secret,
      },
      body: JSON.stringify({
        webhook_type,
        webhook_code,
        item_id: item.plaid_item_id,
        error: error ?? null,
      }),
    });
    const text = await res.text();
    return json({ status: res.status, body: text });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});

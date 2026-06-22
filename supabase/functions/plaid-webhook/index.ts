// Receives Plaid webhooks (item login required, transactions updates, etc.).
// Sandbox-friendly: no signature verification yet (Plaid's JWT verification
// requires a key endpoint round-trip; add when going to production).
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";

type Webhook = {
  webhook_type: string;
  webhook_code: string;
  item_id: string;
  error?: { error_code?: string } | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = (await req.json()) as Webhook;
    const admin = adminClient();

    if (
      body.webhook_type === "ITEM" &&
      (body.webhook_code === "PENDING_EXPIRATION" ||
        body.webhook_code === "ERROR" ||
        body.error?.error_code === "ITEM_LOGIN_REQUIRED")
    ) {
      await admin
        .from("plaid_items")
        .update({ status: "reauth_required" })
        .eq("plaid_item_id", body.item_id);
    }
    return json({ received: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

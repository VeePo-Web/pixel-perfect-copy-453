// Receives Plaid webhooks. Sandbox-friendly:
// - Optional shared-secret check via the `x-plaid-webhook-secret` header
//   compared against PLAID_WEBHOOK_SECRET. (Production should switch to
//   verifying the Plaid `Plaid-Verification` JWT.)
// - Branches on webhook_type/code: marks items needing reauth, and re-syncs
//   accounts/balances on TRANSACTIONS/HOLDINGS update events.
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";
import { syncAccountsForItem } from "../_shared/plaid.ts";

type Webhook = {
  webhook_type: string;
  webhook_code: string;
  item_id: string;
  error?: { error_code?: string } | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const expected = Deno.env.get("PLAID_WEBHOOK_SECRET");
    if (expected) {
      const got = req.headers.get("x-plaid-webhook-secret");
      if (got !== expected) return json({ error: "unauthorized" }, 401);
    }

    const body = (await req.json()) as Webhook;
    const admin = adminClient();

    const { data: item } = await admin
      .from("plaid_items")
      .select("id, user_id, access_token")
      .eq("plaid_item_id", body.item_id)
      .maybeSingle();

    if (!item) return json({ received: true, unknown_item: true });

    const isReauth =
      body.webhook_type === "ITEM" &&
      (body.webhook_code === "PENDING_EXPIRATION" ||
        body.webhook_code === "ERROR" ||
        body.error?.error_code === "ITEM_LOGIN_REQUIRED");

    const isUpdate =
      (body.webhook_type === "TRANSACTIONS" || body.webhook_type === "HOLDINGS") &&
      (body.webhook_code.endsWith("_UPDATE") || body.webhook_code === "DEFAULT_UPDATE" ||
        body.webhook_code === "SYNC_UPDATES_AVAILABLE");

    if (isReauth) {
      await admin
        .from("plaid_items")
        .update({ status: "reauth_required" })
        .eq("id", item.id);
    } else if (isUpdate) {
      await syncAccountsForItem(admin, item);
    }

    return json({ received: true });
  } catch (e) {
    console.error("plaid-webhook error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

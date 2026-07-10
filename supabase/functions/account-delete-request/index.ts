// User-initiated GDPR/CCPA deletion request. Marks the profile for hard-delete
// in 30 days, revokes every Plaid item now, and cancels any active Stripe
// subscription at period end. Pass { cancel: true } to undo a pending request.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid, getAccessToken } from "../_shared/plaid.ts";
import { createStripeClient } from "../_shared/stripe.ts";

const Body = z.object({ cancel: z.boolean().optional() });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
    const admin = adminClient();

    if (parsed.data.cancel) {
      await admin
        .from("profiles")
        .update({ deletion_requested_at: null })
        .eq("id", user.id);
      return json({ ok: true, cancelled: true });
    }

    // 1. Revoke Plaid items immediately.
    const { data: items } = await admin
      .from("plaid_items")
      .select("id, access_token")
      .eq("user_id", user.id);
    for (const it of items ?? []) {
      try {
        await plaid("/item/remove", { access_token: it.access_token });
      } catch (e) {
        console.error("plaid remove failed", it.id, e);
      }
      await admin.from("plaid_items").update({ status: "removed" }).eq("id", it.id);
    }

    // 2. Cancel Stripe subscriptions at period end.
    try {
      const { data: subs } = await admin
        .from("subscriptions")
        .select("stripe_subscription_id, environment")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"]);
      for (const s of subs ?? []) {
        const sid = (s as { stripe_subscription_id?: string }).stripe_subscription_id;
        const env = (s as { environment?: string }).environment === "live" ? "live" : "sandbox";
        if (!sid) continue;
        try {
          const stripe = createStripeClient(env);
          await stripe.subscriptions.update(sid, { cancel_at_period_end: true });
        } catch (e) {
          console.error("stripe cancel failed", sid, e);
        }
      }
    } catch (e) {
      console.error("stripe loop failed", e);
    }

    // 3. Mark profile for hard-delete in 30 days.
    await admin
      .from("profiles")
      .update({ deletion_requested_at: new Date().toISOString() })
      .eq("id", user.id);

    return json({
      ok: true,
      message: "Account scheduled for permanent deletion in 30 days. Sign in again before then to cancel.",
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown" }, 500);
  }
});

// stripe-webhook — authoritative billing source of truth for GoldFin Desk.
//
// REGISTER IN STRIPE DASHBOARD (replace payments-webhook):
//   Sandbox: https://paarucbnaxorpxqjecrz.supabase.co/functions/v1/stripe-webhook?env=sandbox
//   Live:    https://paarucbnaxorpxqjecrz.supabase.co/functions/v1/stripe-webhook?env=live
//
// REQUIRED SECRETS (set via Lovable Secrets or Supabase Dashboard):
//   STRIPE_SANDBOX_API_KEY          — sk_test_… (Lovable's Stripe integration)
//   STRIPE_LIVE_API_KEY             — sk_live_…
//   PAYMENTS_SANDBOX_WEBHOOK_SECRET — whsec_… from Stripe test webhook endpoint
//   PAYMENTS_LIVE_WEBHOOK_SECRET    — whsec_… from Stripe live webhook endpoint
//   SUPABASE_URL                    — auto-set
//   SUPABASE_SERVICE_ROLE_KEY       — auto-set
//   RESEND_API_KEY                  — transactional email (omit to disable email)
//   RESEND_FROM                     — "GoldFin Desk <hello@goldfindesk.com>"
//   OPERATOR_EMAIL                  — receives new-subscriber alerts
//   APP_URL                         — https://goldfindesk.com
//
// EVENTS HANDLED:
//   checkout.session.completed       → upsert row, send welcome + operator alert
//   customer.subscription.created    → upsert full subscription state
//   customer.subscription.updated    → upsert full subscription state
//   customer.subscription.deleted    → mark canceled
//   invoice.paid                     → refresh period_end, ensure status=active
//   invoice.payment_failed           → mark past_due, send dunning email
//
// IDEMPOTENCY: billing_events keyed by stripe_event_id prevents double-processing
//   even when Stripe re-delivers events.
//
// ERROR SEMANTICS: transient handler errors → 500 (Stripe retries automatically).
//   Invalid signature → 400 (Stripe does NOT retry — correct rejection).
//
// SUPERSEDES: supabase/functions/payments-webhook — that function returns 400 on
//   error (Stripe never retries), lacks idempotency, and was Lovable's scaffolded
//   starting point. This file is the hardened replacement. Do NOT register
//   payments-webhook in Stripe Dashboard.
//
// NOTE: this file does NOT touch create-checkout (Lovable owns it) and does NOT
//   touch any conversion UI (src/components/**) — it is Claude B's backend only.

import { createClient } from "npm:@supabase/supabase-js@2";
import { verifyWebhook, corsHeaders } from "../_shared/stripe.ts";
import type { StripeEnv } from "../_shared/stripe.ts";

// deno-lint-ignore no-explicit-any
type Obj = Record<string, any>;

const jsonRes = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonRes({ error: "method not allowed" }, 405);

  // 1. Resolve environment from the URL param Lovable registers in Stripe Dashboard
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("stripe-webhook: invalid ?env param:", rawEnv);
    // Return 200 so Stripe stops retrying what is a permanent config error.
    return jsonRes({ received: true, ignored: "invalid env param" }, 200);
  }
  const env = rawEnv as StripeEnv;

  // 2. Verify Stripe signature and parse body (atomic — consumes the body stream once).
  //    verifyWebhook throws on invalid signature → 400 (Stripe will not retry 4xx).
  let event: Obj;
  try {
    event = (await verifyWebhook(req, env)) as Obj;
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", String(err));
    return jsonRes({ error: "invalid signature" }, 400);
  }

  const eventId = event.id as string | undefined;
  const eventType = event.type as string | undefined;
  if (!eventId || !eventType) {
    return jsonRes({ error: "malformed event: missing id or type" }, 400);
  }

  // 3. Service-role Supabase client — bypasses RLS; only used server-side.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 4. Idempotency: record the raw event first.
  //    ignoreDuplicates=true: if stripe_event_id already exists, the row is unchanged.
  //    This means re-delivered events are recorded but the existing row is preserved.
  await supabase
    .from("billing_events")
    .upsert(
      { stripe_event_id: eventId, type: eventType, payload: event },
      { onConflict: "stripe_event_id", ignoreDuplicates: true },
    );

  // Short-circuit: if a previous attempt already set processed_at, we're done.
  const { data: ledgerRow } = await supabase
    .from("billing_events")
    .select("processed_at")
    .eq("stripe_event_id", eventId)
    .single();

  if (ledgerRow?.processed_at) {
    return jsonRes({ ok: true, idempotent: true });
  }

  // 5. Dispatch — return 500 on any transient error so Stripe automatically retries.
  //    Only return 400 for permanent rejections (signature, unknown env) above.
  try {
    await dispatch(supabase, event, env);

    await supabase
      .from("billing_events")
      .update({ processed_at: new Date().toISOString(), processing_error: null })
      .eq("stripe_event_id", eventId);

    return jsonRes({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("stripe-webhook: handler error [%s]", eventType, msg);

    // Clear processed_at so this event is retried; store error for debugging.
    await supabase
      .from("billing_events")
      .update({ processing_error: msg, processed_at: null })
      .eq("stripe_event_id", eventId);

    return jsonRes({ error: "handler error" }, 500);
  }
});

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

async function dispatch(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  event: Obj,
  env: StripeEnv,
): Promise<void> {
  const obj = (event.data?.object ?? {}) as Obj;
  switch (event.type) {
    case "checkout.session.completed":
      await onCheckoutCompleted(supabase, obj, env);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await onSubscriptionUpsert(supabase, obj, env);
      break;
    case "customer.subscription.deleted":
      await onSubscriptionDeleted(supabase, obj, env);
      break;
    case "invoice.paid":
      await onInvoicePaid(supabase, obj, env);
      break;
    case "invoice.payment_failed":
      await onInvoicePaymentFailed(supabase, obj);
      break;
    default:
      // All other event types are recorded in billing_events and silently no-op'd.
      break;
  }
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function onCheckoutCompleted(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  session: Obj,
  env: StripeEnv,
): Promise<void> {
  const email: string | null =
    (session.customer_details as Obj | null)?.email ??
    session.customer_email ??
    null;
  const userId: string | null = (session.metadata as Obj | null)?.userId ?? null;
  const plan: string | null = (session.metadata as Obj | null)?.plan ?? null;
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : null;

  if (session.mode === "subscription") {
    const stripeSubId = typeof session.subscription === "string" ? session.subscription : null;
    if (!stripeSubId) {
      throw new Error("checkout.session.completed (subscription): missing session.subscription");
    }
    // Partial upsert with customer identity. Full subscription state (period dates,
    // price_id, status) is filled in by the customer.subscription.created event that
    // Stripe fires alongside this one — whichever arrives second wins on the upsert.
    const { error } = await supabase.from("subscriptions").upsert(
      {
        stripe_subscription_id: stripeSubId,
        stripe_customer_id: stripeCustomerId,
        email,
        user_id: userId,
        price_id: plan,
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    );
    if (error) throw error;
  } else if (session.mode === "payment") {
    // One-off purchase (e.g. Clarity Report). Upsert by stripe_session_id.
    // The partial unique index on subscriptions.stripe_session_id (from migration
    // 20260621120000) ensures this is idempotent.
    const { error } = await supabase.from("subscriptions").upsert(
      {
        stripe_session_id: session.id,
        stripe_customer_id: stripeCustomerId,
        email,
        user_id: userId,
        price_id: plan,
        status: "paid",
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_session_id" },
    );
    if (error) throw error;
  }

  // Customer welcome email + operator alert are best-effort:
  // a missing/failing email must NEVER fail the webhook and lose billing state.
  if (email && plan) {
    sendCustomerWelcome(email, plan).catch((e) =>
      console.error("stripe-webhook: welcome email non-fatal error:", e)
    );
  }
  notifyOperator(email, plan, session.amount_total as number | null).catch((e) =>
    console.error("stripe-webhook: operator alert non-fatal error:", e)
  );
}

async function onSubscriptionUpsert(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  sub: Obj,
  env: StripeEnv,
): Promise<void> {
  const item = (sub.items as Obj | null)?.data?.[0] as Obj | undefined;
  const price = item?.price as Obj | undefined;

  // Use lookup_key (the stable identifier matching create-checkout plan keys)
  // rather than the opaque price.id.
  const priceId: string | null = price?.lookup_key ?? price?.id ?? null;
  const productId: string | null = typeof price?.product === "string" ? price.product : null;
  const stripeCustomerId: string | null =
    typeof sub.customer === "string" ? sub.customer : null;

  // Period timestamps arrive as Unix seconds from Stripe.
  const subPeriodStart = sub.current_period_start as number | undefined;
  const subPeriodEnd = sub.current_period_end as number | undefined;

  // Email may already exist on the row from checkout.session.completed. Look it up
  // rather than overwriting with null (the subscription object has no email field).
  let email: string | null = null;
  if (stripeCustomerId) {
    const { data } = await supabase
      .from("subscriptions")
      .select("email")
      .eq("stripe_customer_id", stripeCustomerId)
      .limit(1)
      .maybeSingle();
    email = data?.email ?? null;
  }

  const { error } = await supabase.from("subscriptions").upsert(
    {
      stripe_subscription_id: sub.id,
      stripe_customer_id: stripeCustomerId,
      email,
      user_id: (sub.metadata as Obj | null)?.userId ?? null,
      product_id: productId,
      price_id: priceId,
      status: sub.status,
      current_period_start: subPeriodStart
        ? new Date(subPeriodStart * 1000).toISOString()
        : null,
      current_period_end: subPeriodEnd
        ? new Date(subPeriodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: (sub.cancel_at_period_end as boolean | null) ?? false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) throw error;
}

async function onSubscriptionDeleted(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  sub: Obj,
  env: StripeEnv,
): Promise<void> {
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", sub.id)
    .eq("environment", env);
  if (error) throw error;
}

async function onInvoicePaid(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  invoice: Obj,
  env: StripeEnv,
): Promise<void> {
  const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
  if (!subId) return;

  // Refresh the period end from the invoice line so the DB stays current after each renewal.
  const lineEnd =
    (invoice.lines as Obj | null)?.data?.[0]?.period?.end as number | undefined;
  const periodEnd = lineEnd ? new Date(lineEnd * 1000).toISOString() : null;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      ...(periodEnd ? { current_period_end: periodEnd } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subId)
    .eq("environment", env);
  if (error) throw error;
}

async function onInvoicePaymentFailed(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  invoice: Obj,
): Promise<void> {
  const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
  if (subId) {
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "past_due", updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", subId);
    if (error) throw error;
  }

  // Dunning email — best-effort, same as welcome email.
  const email = invoice.customer_email as string | null;
  if (email) {
    sendDunningEmail(email).catch((e) =>
      console.error("stripe-webhook: dunning email non-fatal error:", e)
    );
  }
}

// ---------------------------------------------------------------------------
// Email helpers — all best-effort.
// A missing RESEND_API_KEY is an intentional no-op (not a webhook failure).
// ---------------------------------------------------------------------------

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return;

  const from = Deno.env.get("RESEND_FROM") ?? "GoldFin Desk <noreply@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    console.error("stripe-webhook: Resend error", res.status, await res.text());
  }
}

function planLabel(planKey: string | null): string {
  if (planKey === "auto_fill_monthly" || planKey === "auto-fill-monthly") {
    return "Auto-Fill Monthly";
  }
  if (planKey === "finance_desk_monthly" || planKey === "finance-desk-monthly") {
    return "GoldFin Desk Monthly";
  }
  if (planKey === "clarity_report_once" || planKey === "clarity-report") {
    return "Clarity Report";
  }
  return planKey ?? "GoldFin Desk";
}

async function sendCustomerWelcome(email: string, plan: string): Promise<void> {
  await sendEmail(
    email,
    "You're in — here's what happens next",
    `<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.6;color:#1a1a1a;padding:32px">
      <p style="margin:0 0 16px">Hi,</p>
      <p style="margin:0 0 16px">
        Your <strong>${planLabel(plan)}</strong> plan is active.
      </p>
      <p style="margin:0 0 16px">
        <strong>One thing to do right now:</strong><br>
        Reply to this email with your last 3 months of bank or accounting exports
        (PDF, CSV, or a screenshot is fine) and we'll have your first automated
        financial briefing ready within 48 hours.
      </p>
      <p style="margin:0 0 16px">That's it — no setup calls, no dashboard to learn.</p>
      <p style="margin:0">— The GoldFin Desk team</p>
    </div>`,
  );
}

async function sendDunningEmail(email: string): Promise<void> {
  const appUrl = Deno.env.get("APP_URL") ?? "https://goldfindesk.com";
  await sendEmail(
    email,
    "Your GoldFin Desk payment didn't go through",
    `<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.6;color:#1a1a1a;padding:32px">
      <p style="margin:0 0 16px">Hi,</p>
      <p style="margin:0 0 16px">
        Your last GoldFin Desk payment didn't process successfully.
      </p>
      <p style="margin:0 0 16px">
        Stripe will retry automatically over the next few days. If your card details
        have changed, you can update them now so there's no interruption:
      </p>
      <p style="margin:0 0 24px">
        <a href="${appUrl}/billing" style="display:inline-block;background:#b45309;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
          Update payment method
        </a>
      </p>
      <p style="margin:0 0 16px">
        If you're not sure what happened, just reply to this email and we'll sort it out.
      </p>
      <p style="margin:0">— The GoldFin Desk team</p>
    </div>`,
  );
}

async function notifyOperator(
  email: string | null,
  plan: string | null,
  amountTotal: number | null,
): Promise<void> {
  const operatorEmail = Deno.env.get("OPERATOR_EMAIL");
  if (!operatorEmail) return;

  const amt =
    amountTotal != null ? `$${(amountTotal / 100).toFixed(2)}` : "unknown";

  await sendEmail(
    operatorEmail,
    `New subscriber — ${planLabel(plan)} (${amt})`,
    `<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.6;padding:32px">
      <p style="margin:0 0 16px"><strong>New GoldFin Desk subscriber</strong></p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#555">Email</td><td>${email ?? "(not captured)"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#555">Plan</td><td>${planLabel(plan)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#555">Amount</td><td>${amt}</td></tr>
      </table>
    </div>`,
  );
}

// stripe-webhook — billing source of truth for GoldFin Desk / Monthly Finance Desk.
//
// Secrets (set in Supabase / Lovable secrets — NEVER in the repo):
//   STRIPE_SECRET_KEY          — from Lovable's Stripe integration
//   STRIPE_WEBHOOK_SECRET      — whsec_… from Stripe Dashboard after registering endpoint
//   RESEND_API_KEY             — operator notification email (optional; missing = silent)
//   RESEND_FROM                — e.g. "GoldFin Desk <hello@yourdomain.com>"
//   OPERATOR_EMAIL             — where new-customer alerts go
//   SUPABASE_URL               — auto-set by Supabase
//   SUPABASE_SERVICE_ROLE_KEY  — auto-set by Supabase
//
// Register this endpoint in Stripe Dashboard:
//   https://<project-ref>.supabase.co/functions/v1/stripe-webhook
// Events: checkout.session.completed, customer.subscription.updated,
//         customer.subscription.deleted, invoice.paid, invoice.payment_failed, charge.refunded

import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  // 1. CORS preflight
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // 2. Stripe calls via POST only
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  // 3. Read RAW body first — must be text for Stripe signature verification
  const body = await req.text();

  // 4. Stripe-Signature header
  const sig = req.headers.get("stripe-signature");
  if (!sig) return json({ error: "missing stripe-signature header" }, 400);

  // Keys — fail loud so misconfiguration is obvious in Supabase logs
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    console.error("stripe-webhook: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set");
    return json({ error: "server misconfigured" }, 500);
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  // 5. Verify Stripe signature — uses SubtleCrypto (Deno has no Node crypto)
  //    Throws on failure → 400, and Stripe will NOT retry a 4xx.
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", err);
    return json({ error: "invalid signature" }, 400);
  }

  // Service-role client — bypasses RLS, safe for server-side only use
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 6. Insert idempotently into billing_events
  //    ignoreDuplicates=true: if the event_id already exists, skip (don't overwrite).
  await supabase.from("billing_events").upsert(
    {
      stripe_event_id: event.id,
      type: event.type,
      payload: JSON.parse(body), // full verified event → jsonb
    },
    { onConflict: "stripe_event_id", ignoreDuplicates: true },
  );

  // Idempotency short-circuit: if already successfully processed, return 200
  const { data: row } = await supabase
    .from("billing_events")
    .select("processed_at")
    .eq("stripe_event_id", event.id)
    .single();

  if (row?.processed_at) {
    return json({ ok: true, idempotent: true });
  }

  // 7. Handle event — fail loud on error so Stripe retries (500 triggers retry)
  try {
    await handleEvent(stripe, supabase, event);

    await supabase
      .from("billing_events")
      .update({ processed_at: new Date().toISOString(), processing_error: null })
      .eq("stripe_event_id", event.id);

    return json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("stripe-webhook: handler error", event.type, msg);

    // Clear processed_at so the row is retryable; store error for debugging
    await supabase
      .from("billing_events")
      .update({ processing_error: msg, processed_at: null })
      .eq("stripe_event_id", event.id);

    return json({ error: "handler error" }, 500);
  }
});

// ---------------------------------------------------------------------------
// Event dispatcher
// ---------------------------------------------------------------------------

async function handleEvent(
  stripe: Stripe,
  // deno-lint-ignore no-explicit-any
  supabase: any,
  event: Stripe.Event,
): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await onCheckoutCompleted(stripe, supabase, event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.updated":
      await upsertSubscription(supabase, event.data.object as Stripe.Subscription, null);
      break;
    case "customer.subscription.deleted":
      await onSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription);
      break;
    case "invoice.paid":
      await onInvoicePaid(supabase, event.data.object as Stripe.Invoice);
      break;
    case "invoice.payment_failed":
      await onInvoicePaymentFailed(supabase, event.data.object as Stripe.Invoice);
      break;
    case "charge.refunded":
      // Recorded in billing_events above; logged here for ops visibility
      console.log("stripe-webhook: charge.refunded", (event.data.object as Stripe.Charge).id);
      break;
    default:
      // All other events are recorded but silently no-op'd
      break;
  }
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function onCheckoutCompleted(
  stripe: Stripe,
  // deno-lint-ignore no-explicit-any
  supabase: any,
  session: Stripe.Checkout.Session,
): Promise<void> {
  if (session.mode !== "subscription") return;

  const stripeSubscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;
  if (!stripeSubscriptionId) {
    throw new Error("checkout.session.completed: no subscription id on session");
  }

  // Fetch full subscription — never trust client metadata for billing state
  const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  // Email from checkout session (not on subscription object)
  const email =
    session.customer_details?.email ??
    (typeof session.customer_email === "string" ? session.customer_email : null);

  await upsertSubscription(supabase, sub, email);

  // Operator notification — best-effort; missing key is intentional no-op
  notifyOperator(email, stripeSubscriptionId).catch((e) =>
    console.error("stripe-webhook: operator notification failed (non-fatal)", e),
  );
}

async function onSubscriptionDeleted(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  sub: Stripe.Subscription,
): Promise<void> {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", sub.id);
  if (error) throw error;
}

async function onInvoicePaid(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  invoice: Stripe.Invoice,
): Promise<void> {
  const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
  if (!subId) return;

  // Update renewal period end; keep status active
  const lineEnd = invoice.lines?.data?.[0]?.period?.end;
  const periodEnd = lineEnd ? new Date(lineEnd * 1000).toISOString() : null;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      ...(periodEnd ? { current_period_end: periodEnd } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subId);
  if (error) throw error;
}

async function onInvoicePaymentFailed(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  invoice: Stripe.Invoice,
): Promise<void> {
  const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
  if (!subId) return;

  // Mark past_due — dunning signal; not an instant cancel
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "past_due", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Shared upsert — idempotent by stripe_subscription_id
// ---------------------------------------------------------------------------

async function upsertSubscription(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  sub: Stripe.Subscription,
  emailOverride: string | null,
): Promise<void> {
  const price = sub.items?.data?.[0]?.price;
  const plan = price?.lookup_key ?? price?.id ?? "unknown";
  const amountCents = price?.unit_amount ?? null;
  const currency = price?.currency ?? "usd";
  const stripeCustomerId = typeof sub.customer === "string" ? sub.customer : null;
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;
  const canceledAt = sub.canceled_at
    ? new Date(sub.canceled_at * 1000).toISOString()
    : null;

  const payload: Record<string, unknown> = {
    stripe_subscription_id: sub.id,
    stripe_customer_id: stripeCustomerId,
    plan,
    status: sub.status,
    amount_cents: amountCents,
    currency,
    current_period_end: periodEnd,
    canceled_at: canceledAt,
    updated_at: new Date().toISOString(),
  };

  // Only set email when we have it — don't overwrite a known email with null
  if (emailOverride !== null) payload.email = emailOverride;

  const { error } = await supabase
    .from("subscriptions")
    .upsert(payload, { onConflict: "stripe_subscription_id" });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Operator email — best-effort, never throws into the webhook handler
// ---------------------------------------------------------------------------

async function notifyOperator(email: string | null, subId: string): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return; // Not configured — intentional no-op per spec

  const operatorEmail = Deno.env.get("OPERATOR_EMAIL");
  if (!operatorEmail) return;

  const from =
    Deno.env.get("RESEND_FROM") ?? "GoldFin Desk <noreply@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [operatorEmail],
      subject: "New $99/mo Auto-Fill subscriber",
      html: `<p>A new customer just subscribed to <strong>Auto-Fill Monthly</strong>.</p>
             <p><strong>Email:</strong> ${email ?? "(unknown)"}</p>
             <p><strong>Subscription ID:</strong> ${subId}</p>`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("stripe-webhook: resend notification failed", res.status, text);
  }
}

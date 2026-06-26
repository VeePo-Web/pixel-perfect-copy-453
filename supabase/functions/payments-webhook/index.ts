import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";
import { generateReportForUser } from "../_shared/report-core.ts";


let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

function planFromPrice(price: any): string | null {
  return price?.lookup_key ?? price?.metadata?.lovable_external_id ?? price?.id ?? null;
}

async function sendWelcomeEmail(email: string, plan: string) {
  try {
    await getSupabase().functions.invoke("send-email", {
      body: {
        to: email,
        subject: "Welcome to GoldFin Desk — your numbers, on autopilot",
        html: `<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.55">
          <p>Hi,</p>
          <p>Your <strong>${plan === "auto_fill_monthly" ? "Auto-Fill Monthly" : "GoldFin"}</strong> subscription is live.</p>
          <p>Next: reply to this email with the last 3 months of bank statements (PDF or CSV) and we'll have your first briefing back inside 48 hours.</p>
          <p>— The GoldFin Desk</p>
        </div>`,
      },
    });
  } catch (e) {
    console.error("welcome email failed:", e);
  }
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const customerId = session.customer;
  const email = session.customer_details?.email ?? session.customer_email ?? null;
  const plan = session.metadata?.plan ?? null;
  const userId = session.metadata?.userId ?? null;

  if (session.mode === "payment") {
    // One-off purchase (Clarity Report). Record it.
    await getSupabase().from("subscriptions").upsert({
      stripe_session_id: session.id,
      stripe_customer_id: customerId,
      email,
      user_id: userId,
      price_id: plan,
      status: "paid",
      environment: env,
      updated_at: new Date().toISOString(),
    }, { onConflict: "stripe_session_id" });
  }
  if (email && plan) await sendWelcomeEmail(email, plan);

  // Kickoff first advisory report immediately for paying users who already
  // connected a bank — so they don't wait up to 13 days for the cron pass.
  const ELIGIBLE_PLANS = ["auto-fill-monthly", "finance-desk-monthly"];
  if (userId && plan && ELIGIBLE_PLANS.includes(plan)) {
    try {
      const { data: hasBank } = await getSupabase()
        .from("plaid_items").select("id").eq("user_id", userId).eq("status", "active").limit(1).maybeSingle();
      if (hasBank) {
        const today = new Date().toISOString().slice(0, 10);
        await generateReportForUser(getSupabase() as any, userId, { send: true, today });
      }

    } catch (e) {
      console.error("kickoff report failed:", e);
    }
  }
}


async function handleSubscriptionUpsert(subscription: any, env: StripeEnv) {
  const item = subscription.items?.data?.[0];
  const priceId = planFromPrice(item?.price);
  const productId = typeof item?.price?.product === "string"
    ? item.price.product
    : item?.price?.product?.id ?? null;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;
  const customer = subscription.customer;

  let email: string | null = null;
  try {
    const { data: cust } = await getSupabase()
      .from("subscriptions")
      .select("email")
      .eq("stripe_customer_id", customer)
      .limit(1)
      .maybeSingle();
    email = cust?.email ?? null;
  } catch {}

  await getSupabase().from("subscriptions").upsert(
    {
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customer,
      email,
      user_id: subscription.metadata?.userId ?? null,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

async function handleInvoicePaymentFailed(invoice: any) {
  const email = invoice.customer_email;
  if (!email) return;
  try {
    await getSupabase().functions.invoke("send-email", {
      body: {
        to: email,
        subject: "Payment failed — let's get it sorted",
        html: `<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.55">
          <p>Your last GoldFin Desk payment didn't go through. Stripe will retry automatically, or you can update your card right away.</p>
          <p>Reply to this email if you'd like a hand.</p>
          <p>— The GoldFin Desk</p>
        </div>`,
      },
    });
  } catch (e) {
    console.error("dunning email failed:", e);
  }
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object, env);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpsert(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Webhook received with invalid env:", rawEnv);
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    await handleWebhook(req, rawEnv);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

/**
 * Centralised checkout helpers for the GoldFin funnel. One source of truth
 * for plan keys, returned URLs, and invocation — every CTA on the site
 * routes through here so adding/renaming a plan is a one-file change.
 */
import { supabase } from "../integrations/supabase/client";
import { getStripeEnvironment, hasPaymentsConfigured } from "./stripe";
import { analytics } from "./analytics";

export type PlanKey = "auto-fill-monthly" | "finance-desk-monthly" | "clarity-report";

/** Display/analytics value per plan (USD). Source of truth for price = Stripe. */
const PLAN_PRICE_USD: Partial<Record<PlanKey, number>> = {
  "auto-fill-monthly": 99,
};

const RETURN_PATH = "/checkout/return";

function buildReturnUrl(): string {
  // Stripe substitutes {CHECKOUT_SESSION_ID} server-side.
  return `${window.location.origin}${RETURN_PATH}?session_id={CHECKOUT_SESSION_ID}`;
}

/**
 * Open the embedded checkout for a given plan. The actual <EmbeddedCheckout/>
 * mount is owned by `CheckoutOverlay` — this helper just stores the plan in
 * a query param and triggers the overlay via a custom event.
 *
 * Falls back to the pricing page when Stripe isn't configured in this build.
 */
export function openCheckout(plan: PlanKey, customerEmail?: string): void {
  analytics.checkoutStarted(plan, PLAN_PRICE_USD[plan]);

  if (!hasPaymentsConfigured()) {
    window.location.hash = "#/pricing#auto-fill";
    return;
  }
  window.dispatchEvent(
    new CustomEvent<CheckoutOpenDetail>("goldfin:open-checkout", {
      detail: { plan, customerEmail },
    }),
  );
}

export type CheckoutOpenDetail = { plan: PlanKey; customerEmail?: string };

/** Back-compat: existing CTAs call this name. */
export function startAutoFillCheckout(): void {
  openCheckout("auto-fill-monthly");
}

export function startClarityReportCheckout(email?: string): void {
  openCheckout("clarity-report", email);
}

export function startFinanceDeskCheckout(email?: string): void {
  openCheckout("finance-desk-monthly", email);
}

/** Server call used by <CheckoutOverlay/> — kept here so all Stripe wiring lives in one module. */
export async function fetchCheckoutClientSecret(
  plan: PlanKey,
  customerEmail?: string,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: {
      plan,
      customerEmail,
      environment: getStripeEnvironment(),
      returnUrl: buildReturnUrl(),
    },
  });
  if (error) throw new Error(error.message);
  const clientSecret = (data as { clientSecret?: string } | null)?.clientSecret;
  if (!clientSecret) throw new Error("No clientSecret returned");
  return clientSecret;
}

export type CheckoutReturn = "success" | "cancel" | null;

/**
 * Detects a return from Stripe Checkout via the `?checkout=` query param, fires
 * the matching conversion event exactly once, then strips the param so a refresh
 * never double-counts. Returns the status so a UI surface can show a
 * confirmation (that screen is owned by the conversion build, not this module).
 *
 * Call once on app boot. Idempotent: removing the param means a second call is a
 * no-op.
 */
export function handleCheckoutReturn(): CheckoutReturn {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const status = params.get("checkout");
  if (status !== "success" && status !== "cancel") return null;

  if (status === "success") {
    analytics.purchaseCompleted("auto-fill-monthly", PLAN_PRICE_USD["auto-fill-monthly"]);
  } else {
    analytics.checkoutCancelled("auto-fill-monthly");
  }

  // Strip ?checkout= but preserve any other query params and the hash route.
  params.delete("checkout");
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", url);

  return status;
}

/**
 * Centralised checkout helpers for the GoldFin funnel. One source of truth
 * for plan keys, returned URLs, and invocation — every CTA on the site
 * routes through here so adding/renaming a plan is a one-file change.
 */
import { supabase } from "../integrations/supabase/client";
import { getStripeEnvironment, hasPaymentsConfigured } from "./stripe";
import { analytics } from "./analytics";

export type PlanKey = "auto-fill-monthly";

/** Display/analytics value per plan (USD). Source of truth for price = Stripe. */
const PLAN_PRICE_USD: Partial<Record<PlanKey, number>> = {
  "auto-fill-monthly": 150,
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
    window.history.pushState({}, "", "/pricing#auto-fill"); window.dispatchEvent(new PopStateEvent("popstate"));
    return;
  }

  // Store the plan key in sessionStorage so handleCheckoutReturn() can
  // correctly identify the plan when Stripe redirects back with ?session_id=.
  sessionStorage.setItem("goldfin:checkout:plan", plan);

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

// Legacy checkout helpers (finance-desk-monthly, clarity-report) removed:
// the current pricing page has a single paid SKU (auto-fill-monthly).

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
 * Detects a return from Stripe's embedded checkout.
 *
 * Stripe's embedded-checkout flow redirects to `returnUrl` with
 * `?session_id=cs_xxx` appended (not `?checkout=success` — that was the
 * old redirect-checkout pattern). The plan key may optionally be stored in
 * sessionStorage by <CheckoutOverlay> so the analytics event is accurate.
 *
 * Returns "success" when a session_id is present (Stripe only redirects here
 * on completion — there is no "cancel" redirect in embedded mode; the customer
 * simply closes the overlay), or null if we're not on the return path.
 *
 * Call once on app boot or when the return route mounts. Idempotent: stripping
 * the session_id param means a second call is a no-op.
 */
export function handleCheckoutReturn(): CheckoutReturn {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  if (!sessionId) return null;

  // Recover the plan key the overlay stored before launching checkout.
  const plan =
    (sessionStorage.getItem("goldfin:checkout:plan") as PlanKey | null) ??
    "auto-fill-monthly";
  sessionStorage.removeItem("goldfin:checkout:plan");

  analytics.purchaseCompleted(plan, PLAN_PRICE_USD[plan]);

  // Strip ?session_id= but preserve any other query params and the hash route.
  params.delete("session_id");
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", url);

  return "success";
}

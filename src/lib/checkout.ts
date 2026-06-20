import { supabase } from "../integrations/supabase/client";

/**
 * Single integration point for the $99/mo Auto-Fill continuity checkout.
 *
 * The Lovable Stripe integration generates a Supabase edge function named
 * `create-checkout` that creates a Stripe Checkout Session (subscription mode)
 * and returns `{ url }`. This helper invokes it and redirects the buyer there.
 *
 * Until that function is live, the call fails gracefully and the CTA scrolls
 * back to the offer instead of dead-ending. Once Lovable wires Stripe, no UI
 * code changes — this is the only place the checkout call lives.
 */
export type CheckoutPlan = "auto-fill-monthly";

export async function startAutoFillCheckout(): Promise<void> {
  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { plan: "auto-fill-monthly" satisfies CheckoutPlan },
    });
    if (error) throw error;
    const url = (data as { url?: string } | null)?.url;
    if (!url) throw new Error("No checkout URL returned");
    window.location.href = url;
  } catch {
    // Stripe not wired yet (or offline) — never leave the buyer on a dead click.
    window.location.hash = "#/pricing#auto-fill";
  }
}

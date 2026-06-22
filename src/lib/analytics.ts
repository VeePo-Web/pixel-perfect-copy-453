/**
 * Privacy-first, dependency-free conversion event layer.
 *
 * This is the single place funnel + checkout events are emitted. It forwards to
 * whatever analytics tools happen to be present on `window` at call time
 * (GA4 `gtag`, Meta Pixel `fbq`, PostHog, Vercel Analytics `va`, GTM `dataLayer`)
 * and safely no-ops when none are installed. That means:
 *   - it is safe to ship before any pixel is wired, and
 *   - it starts working the moment a pixel is added (via Lovable or index.html)
 *     with NO code change here.
 *
 * Rule: events carry IDs, amounts, currency, and booleans only — never PII.
 * No email, no name, no raw form content ever passes through this module.
 */

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

type Win = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  posthog?: { capture?: (event: string, props?: AnalyticsProps) => void };
  va?: (event: "event", props: { name: string } & AnalyticsProps) => void;
  dataLayer?: unknown[];
};

function strip(props?: AnalyticsProps): AnalyticsProps {
  const out: AnalyticsProps = {};
  if (!props) return out;
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** Generic custom event — forwarded to every analytics tool present on window. */
export function track(event: string, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  const w = window as Win;
  const payload = strip(props);
  try {
    w.gtag?.("event", event, payload);
    w.posthog?.capture?.(event, payload);
    w.va?.("event", { name: event, ...payload });
    w.fbq?.("trackCustom", event, payload);
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...payload });
  } catch {
    // Analytics must never break the app or block a conversion.
  }
}

/** Fire a Meta Pixel *standard* event (Purchase / InitiateCheckout / Lead). */
function fbqStandard(name: string, valueUsd?: number): void {
  if (typeof window === "undefined") return;
  const w = window as Win;
  try {
    w.fbq?.("track", name, valueUsd != null ? { value: valueUsd, currency: "USD" } : undefined);
  } catch {
    /* no-op */
  }
}

/**
 * The funnel's named conversion events. Use these instead of raw `track` so the
 * Meta Pixel standard events stay correct and the event names stay consistent
 * across every call site.
 */
export const analytics = {
  /** Free-template lead captured (lib/leads.ts). */
  leadCaptured(templateId: string): void {
    track("lead_captured", { template_id: templateId });
    fbqStandard("Lead");
  },

  /** Buyer clicked an Auto-Fill CTA and is being sent to Stripe Checkout. */
  checkoutStarted(plan: string, valueUsd?: number): void {
    track("checkout_started", { plan, value: valueUsd, currency: "USD" });
    fbqStandard("InitiateCheckout", valueUsd);
  },

  /**
   * Buyer returned from Stripe on the success URL. NOTE: this is an *optimistic*
   * signal — the success URL is reachable without a completed payment, so the
   * Stripe webhook (see docs/STRIPE-CHECKOUT-CONTRACT.md) remains the source of
   * truth for billing. This event is for marketing/conversion measurement only.
   */
  purchaseCompleted(plan: string, valueUsd?: number): void {
    track("purchase_completed", { plan, value: valueUsd, currency: "USD" });
    fbqStandard("Purchase", valueUsd);
  },

  /** Buyer returned from Stripe on the cancel URL. */
  checkoutCancelled(plan: string): void {
    track("checkout_cancelled", { plan });
  },
};

import { Suspense, lazy, useEffect, useState } from "react";
import type { CheckoutOpenDetail } from "../../lib/checkout";

// Heavy: pulls in @stripe/react-stripe-js. Loaded only after the first
// checkout intent so it never weighs down the initial marketing bundle / LCP.
const CheckoutOverlay = lazy(() => import("./CheckoutOverlay"));

/**
 * Always-mounted, near-zero-cost listener. It registers for the global
 * "goldfin:open-checkout" event and, on the first one, lazy-loads the real
 * Stripe overlay and hands it that event's detail so it opens instantly.
 */
export default function CheckoutMount() {
  const [initialDetail, setInitialDetail] = useState<CheckoutOpenDetail | null>(null);

  useEffect(() => {
    // Once armed, the overlay owns the listener for subsequent opens.
    if (initialDetail) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CheckoutOpenDetail>).detail;
      if (!detail?.plan) return;
      setInitialDetail(detail);
    };
    window.addEventListener("goldfin:open-checkout", handler as EventListener);
    return () =>
      window.removeEventListener("goldfin:open-checkout", handler as EventListener);
  }, [initialDetail]);

  if (!initialDetail) return null;

  return (
    <Suspense fallback={null}>
      <CheckoutOverlay initialDetail={initialDetail} />
    </Suspense>
  );
}

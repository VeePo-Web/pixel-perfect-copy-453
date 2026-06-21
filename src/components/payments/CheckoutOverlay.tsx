import { useCallback, useEffect, useMemo, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { fetchCheckoutClientSecret, type CheckoutOpenDetail, type PlanKey } from "../../lib/checkout";
import { getStripe } from "../../lib/stripe";

/**
 * Listens for the global "goldfin:open-checkout" event and mounts Stripe's
 * Embedded Checkout in a modal. Sits at the App root so any CTA on any page
 * can fire `openCheckout(plan)` without prop drilling.
 */
export default function CheckoutOverlay() {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PlanKey | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CheckoutOpenDetail>).detail;
      if (!detail?.plan) return;
      setPlan(detail.plan);
      setCustomerEmail(detail.customerEmail);
      setError(null);
      setOpen(true);
    };
    window.addEventListener("goldfin:open-checkout", handler);
    return () => window.removeEventListener("goldfin:open-checkout", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const fetchClientSecret = useCallback(async () => {
    if (!plan) throw new Error("No plan selected");
    try {
      return await fetchCheckoutClientSecret(plan, customerEmail);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Checkout failed";
      setError(msg);
      throw e;
    }
  }, [plan, customerEmail]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);

  if (!open || !plan) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative my-10 w-full max-w-3xl rounded-2xl bg-white p-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close checkout"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-sm text-gray-700 shadow hover:bg-gray-100"
        >
          ✕
        </button>
        {error ? (
          <div className="p-10 text-center">
            <p className="text-base font-medium text-red-700">Couldn't open checkout</p>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 rounded-full bg-gray-900 px-5 py-2 text-sm text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <div id="checkout">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </div>
    </div>
  );
}

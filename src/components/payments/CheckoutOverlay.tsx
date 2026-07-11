import { useCallback, useEffect, useMemo, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { fetchCheckoutClientSecret, type CheckoutOpenDetail, type PlanKey } from "../../lib/checkout";
import { getStripe } from "../../lib/stripe";

/**
 * Mounts Stripe's Embedded Checkout in a modal. This module statically imports
 * the (heavy) Stripe React SDK, so it is loaded LAZILY by CheckoutMount only
 * after the first "goldfin:open-checkout" event — keeping the SDK out of the
 * initial marketing bundle. `initialDetail` carries that first event's plan so
 * the modal opens immediately on the click that armed it; subsequent opens are
 * handled by this component's own listener.
 */
export default function CheckoutOverlay({
  initialDetail = null,
}: {
  initialDetail?: CheckoutOpenDetail | null;
}) {
  const [open, setOpen] = useState(Boolean(initialDetail?.plan));
  const [plan, setPlan] = useState<PlanKey | null>(initialDetail?.plan ?? null);
  const [customerEmail, setCustomerEmail] = useState<string | undefined>(
    initialDetail?.customerEmail,
  );
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
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative my-10 w-full max-w-3xl rounded-2xl border border-ink/[0.08] bg-white p-2 shadow-[0_40px_120px_-24px_rgba(11,13,18,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close checkout"
          className="absolute right-3 top-3 z-10 rounded-full border border-ink/[0.08] bg-white px-3 py-1 text-sm text-ink/60 shadow-[0_1px_2px_rgba(11,13,18,0.08)] transition-colors duration-200 hover:border-ink/[0.2] hover:text-ink"
        >
          ✕
        </button>
        {error ? (
          <div className="p-10 text-center">
            <p className="text-base font-medium text-red-signal">Couldn't open checkout</p>
            <p className="mt-2 text-sm text-ink/60">{error}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-ink/90 active:scale-[0.98]"
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

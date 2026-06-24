const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export default function PaymentTestModeBanner() {
  // Developer/ops notice only. It must never reach customers in production —
  // a config/test strip above the nav reads as a confusing second nav bar and
  // erodes trust. In production builds this renders nothing (one clean nav).
  if (!import.meta.env.DEV) return null;

  if (!clientToken) {
    return (
      <div className="w-full bg-red-100 border-b border-red-300 px-4 py-2 text-center text-sm text-red-800">
        Production checkout is not configured. Complete payments go-live to accept real payments.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
        All payments in the preview are in test mode. Use card 4242 4242 4242 4242 with any future date and CVC.
      </div>
    );
  }
  return null;
}

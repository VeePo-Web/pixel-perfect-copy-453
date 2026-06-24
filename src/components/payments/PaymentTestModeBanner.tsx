const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

/**
 * Dev-only payments notice. Rendered as a small, unobtrusive corner pill —
 * NEVER a full-width bar above the nav (that read as a confusing second nav bar
 * and eroded trust). Hidden entirely in production, so customers always see
 * exactly one top bar: the nav.
 */
export default function PaymentTestModeBanner() {
  if (!import.meta.env.DEV) return null;

  const message = !clientToken
    ? "Dev: checkout not configured"
    : clientToken.startsWith("pk_test_")
      ? "Test mode · card 4242 4242 4242 4242"
      : null;

  if (!message) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-3 left-3 z-[55] rounded-full border border-amber-300/50 bg-amber-100/95 px-3 py-1.5 text-[11px] font-medium text-amber-800 shadow-lg backdrop-blur"
    >
      {message}
    </div>
  );
}

import { useEffect, useState } from "react";

/**
 * Stripe Embedded Checkout redirects here after payment with
 * ?session_id=cs_... — Stripe substitutes the token server-side.
 *
 * We show a calm confirmation. The real source of truth is the webhook,
 * which writes the row into `subscriptions` and triggers the welcome email.
 */
export default function CheckoutReturnPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  return (
    <main className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] bg-charcoal-950 text-ink">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-full border border-champagne-200/40 bg-champagne-200/10 text-champagne-200">
          ✓
        </div>
        <h1 className="text-[42px] font-light leading-[1.05] tracking-[-0.01em]">
          Payment confirmed.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[15.5px] leading-[1.7] text-ink/70">
          You'll get a welcome email in the next minute or two with what to send us next. If you don't see it, check spam — or just reply to <a className="underline" href="mailto:hello@goldfindesk.com">hello@goldfindesk.com</a>.
        </p>
        {sessionId && (
          <p className="mt-6 text-[11.5px] uppercase tracking-[0.22em] text-ink/35">
            Reference · {sessionId.slice(0, 20)}…
          </p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3 text-[13.5px] font-medium text-navy"
          >
            Back to home
          </a>
          <a
            href="/billing"
            className="rounded-full border border-ink/15 px-6 py-3 text-[13.5px] text-ink/85 hover:border-champagne-200/40"
          >
            Manage billing
          </a>
        </div>
      </div>
    </main>
  );
}

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
        <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-full border border-green-signal/25 bg-green-signal/[0.08] text-green-signal">
          ✓
        </div>
        <h1 className="font-display text-[42px] font-medium leading-[1.05] tracking-[-0.02em]">
          Payment confirmed.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[15.5px] leading-[1.7] text-ink/70">
          You'll get a welcome email in the next minute or two with what to send us next. If you don't see it, check spam — or just reply to <a className="underline underline-offset-2 transition-colors duration-200 hover:text-ink" href="mailto:hello@goldfindesk.com">hello@goldfindesk.com</a>.
        </p>
        {sessionId && (
          <p className="mt-6 font-general text-[11px] uppercase tracking-[0.22em] text-ink/40">
            Reference · {sessionId.slice(0, 20)}…
          </p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98]"
          >
            Back to home
          </a>
          <a
            href="/billing"
            className="rounded-full border border-ink/[0.12] bg-white px-6 py-3 text-[13.5px] text-ink/75 transition-colors duration-200 hover:border-ink/[0.25] hover:text-ink"
          >
            Manage billing
          </a>
        </div>
      </div>
    </main>
  );
}

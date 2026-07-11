import { trustCards } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";
export default function PricingTrustBlock() {
  return (
    <section aria-labelledby="trust-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              Trust & privacy
            </div>
            <h2 id="trust-title" className="mt-4 font-display font-medium text-ink text-[34px] leading-[1.1] tracking-[-0.02em] sm:text-[42px]">
              Preview and apply without connecting your bank.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.7] text-ink/70">
              You can experience the briefing and complete the application before any financial connection. Plaid happens after onboarding, not before.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {trustCards.map((t) => (
              <li
                key={t}
                className="flex items-start gap-3 rounded-xl border border-ink/[0.07] bg-ink/[0.02] px-5 py-4 transition-all duration-300 hover:border-green-signal/40 hover:bg-green-deep/15"
              >
                <span aria-hidden className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-signal" />
                <span className="text-[14px] leading-[1.55] text-ink/85">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <button
            type="button" onClick={startAutoFillCheckout}
            className="group relative inline-flex overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 py-3 text-[13px] font-medium text-ink transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(217,190,130,0.45)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <span className="relative z-10">Auto-fill my reports — $150/mo</span>
          </button>
          <a
            href="/sample-briefing"
            className="rounded-full border border-ink/[0.14] px-5 py-3 text-[13px] text-ink/90 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            See a sample briefing
          </a>
        </div>
        <p className="mt-3 text-[11.5px] uppercase tracking-[0.22em] text-ink/40">No contracts · Cancel anytime</p>
      </div>
    </section>
  );
}

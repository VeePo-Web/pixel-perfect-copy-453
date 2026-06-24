import { startAutoFillCheckout } from "../../../lib/checkout";
type Props = { onAnother: () => void };

// Proof-page close (conversion-prompt PAGE 3 Â§6). The ONE place equal-weight
// CTAs are allowed: the visitor just consumed proof, so let them self-select
// the rung. Card B ($99 GoldFin Reports) carries the visual emphasis â€” the
// bread-and-butter. $1,500 Advisory demoted to a tertiary text link.
export default function SampleBriefingCTA({ onAnother }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-ink/[0.05] bg-charcoal-950">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_100%,rgba(201,163,90,0.10),transparent_60%)]" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 py-28 lg:px-10">
        <div className="text-center">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Two ways to make this yours
          </div>
          <h2 className="mx-auto mt-5 max-w-[24ch] font-light text-ink text-[36px] leading-[1.05] tracking-[-0.01em] sm:text-[52px]">
            Want this briefing for your actual business?
          </h2>
          <p className="mx-auto mt-5 max-w-[58ch] text-[15.5px] leading-[1.7] text-ink/70">
            Start with the free templates these numbers came from â€” or have them filled and briefed for you every month.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {/* Card A â€” free Vault */}
          <div className="flex flex-col rounded-2xl border border-ink/[0.08] bg-ink/[0.02] p-7">
            <div className="text-[10.5px] uppercase tracking-[0.26em] text-ink/45">Free</div>
            <h3 className="mt-2 text-[20px] font-light text-ink">Get the free Template Vault</h3>
            <p className="mt-2 flex-1 text-[13.5px] leading-[1.6] text-ink/60">
              The same templates these numbers came from â€” sent to your inbox, free.
            </p>
            <a
              href="#/templates"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-ink/[0.14] px-5 py-3 text-[13px] text-ink/90 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Send me the Vault
            </a>
          </div>

          {/* Card B â€” $99 GoldFin Reports (recommended) */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-champagne-200/45 bg-charcoal-900/70 p-7 shadow-[0_30px_80px_-30px_rgba(217,190,130,0.4)]">
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/60 to-transparent" />
            <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300">
              Recommended Â· $99/mo
            </div>
            <h3 className="mt-2 text-[20px] font-light text-ink">Have GoldFin fill these every month</h3>
            <p className="mt-2 flex-1 text-[13.5px] leading-[1.6] text-ink/70">
              Your numbers, filled and briefed in plain English â€” every month. No spreadsheet work. Cancel anytime.
            </p>
            <button type="button" onClick={startAutoFillCheckout}
              className="group relative mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-3 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <span aria-hidden className="relative z-10">Auto-fill my reports — $99/mo</span>
              <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
            </button>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={onAnother}
            className="text-[12.5px] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Generate another sample briefing
          </button>
          <a
            href="#/apply"
            className="text-[12.5px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Running something larger? Apply for GoldFin Advisory â†’
          </a>
        </div>
        <p className="mt-6 text-center text-[11.5px] uppercase tracking-[0.22em] text-ink/40">
          No bank connection required. This is a sample â€” your real briefing is built after onboarding.
        </p>
      </div>
    </section>
  );
}

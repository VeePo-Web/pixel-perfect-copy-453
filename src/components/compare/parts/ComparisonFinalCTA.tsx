import { track } from "../analytics";
import { startAutoFillCheckout } from "../../../lib/checkout";
export default function ComparisonFinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative border-t border-ink/[0.06] bg-white"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(201,163,90,0.10),transparent_60%)]" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-28 lg:px-10 lg:py-32">
        <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
          Still comparing?
        </div>
        <h2
          id="final-cta-heading"
          className="mt-4 mx-auto max-w-[22ch] font-display font-medium text-ink [text-wrap:balance] text-[36px] leading-[1.08] tracking-[-0.02em] sm:text-[52px]"
        >
          Start with the missing layer.
        </h2>
        <p className="mx-auto mt-5 max-w-[64ch] text-[15px] leading-relaxed text-ink/65">
          If your books exist, your tools are active, and your business still feels financially unclear, GoldFin Reports is the missing layer — your numbers filled and briefed in plain English every month, for $150.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => { startAutoFillCheckout(); track("autofill_clicked_from_compare", { source: "final" }); }}
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13px] font-medium tracking-wide text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Auto-fill my reports — $150/mo
          </button>
          <a
            href="/sample-briefing"
            onClick={() => track("sample_briefing_clicked_from_compare", { source: "final" })}
            className="rounded-full border border-ink/[0.12] bg-white px-6 py-3.5 text-[13px] text-ink/80 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink"
          >
            See a sample briefing
          </a>
          <a
            href="/templates"
            onClick={() => track("templates_clicked_from_compare", { source: "final" })}
            className="text-[12.5px] text-ink/55 underline-offset-4 hover:text-ink hover:underline"
          >
            Or get the free Template Vault
          </a>
        </div>
        <p className="mt-6 font-general text-[11.5px] uppercase tracking-[0.22em] text-ink/40">
          $150/mo. No bank connection required to start. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

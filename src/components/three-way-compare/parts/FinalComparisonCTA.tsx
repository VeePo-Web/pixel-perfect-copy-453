import { track, trackCtaByHref } from "../analytics";
import { startAutoFillCheckout } from "../../../lib/checkout";
export default function FinalComparisonCTA() {
  return (
    <section
      id="apply"
      aria-labelledby="final-cta-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:px-10">
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
          Apply
        </div>
        <h2
          id="final-cta-heading"
          className="mx-auto mt-4 max-w-[24ch] font-light text-ink text-[34px] leading-[1.08] tracking-[-0.01em] sm:text-[46px]"
        >
          If you already have numbers but still feel unclear, this is the layer you are missing.
        </h2>
        <p className="mx-auto mt-5 max-w-[64ch] text-[15px] leading-[1.7] text-ink/70">
          GoldFin Reports is that layer — your numbers filled from your activity and briefed
          in plain English every month, for $150. No spreadsheet work. Cancel anytime.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              startAutoFillCheckout();
              track("final_cta_clicked", { target: "reports" });
              trackCtaByHref("/pricing#auto-fill", "final-cta");
            }}
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13px] font-medium tracking-wide text-ink transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
            <span className="relative z-10">Auto-fill my reports — $150/mo</span>
          </button>
          <a
            href="/sample-briefing"
            onClick={() => {
              track("final_cta_clicked", { target: "sample-briefing" });
              trackCtaByHref("/sample-briefing", "final-cta");
            }}
            className="rounded-full border border-ink/[0.12] px-6 py-3.5 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
            See a sample briefing
          </a>
          <a
            href="/templates"
            onClick={() => {
              track("final_cta_clicked", { target: "templates" });
              trackCtaByHref("/templates", "final-cta");
            }}
            className="text-[12.5px] text-ink/55 underline-offset-4 transition-all duration-300 ease-cinema hover:text-ink hover:underline"
          >
            Or get the free Template Vault
          </a>
        </div>

        <p className="mt-7 text-[11.5px] uppercase tracking-[0.2em] text-ink/40">
          $150/mo. No bank connection required to start. Cancel anytime.
        </p>

        <p className="mx-auto mt-10 max-w-[64ch] text-[11.5px] leading-relaxed text-ink/40">
          GoldFin Desk does not replace tax, legal, accounting, bookkeeping cleanup, or
          investment advice.
        </p>
      </div>
    </section>
  );
}

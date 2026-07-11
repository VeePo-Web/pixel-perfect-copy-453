import { track } from "../analytics";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function TemplateFinalCTA() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative bg-charcoal-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(201,163,90,0.12),transparent_60%)]" />
      </div>
      <div ref={ref} className={`relative mx-auto max-w-5xl px-6 py-24 text-center lg:px-10 lg:py-32 transition-all duration-700 ease-cinema ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
          Start free
        </div>
        <h2
          id="final-cta-heading"
          className="mt-4 mx-auto max-w-[20ch] font-light text-ink text-[36px] leading-[1.08] tracking-[-0.01em] sm:text-[52px]"
        >
          Start free. Upgrade when you want the rhythm.
        </h2>
        <p className="mx-auto mt-5 max-w-[60ch] text-[15px] leading-relaxed text-ink/65">
          Get the free GoldFin Template Vault to start organizing your numbers today — or have them filled for you every month with GoldFin Reports at $150/mo. No spreadsheet work, cancel anytime.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => { startAutoFillCheckout(); track("autofill_clicked_from_templates", { source: "final" }); }}
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13px] font-medium text-ink transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <span className="relative z-10">Auto-fill my reports — $150/mo</span>
          </button>
          <a
            href="#vault-capture"
            className="rounded-full border border-ink/[0.12] px-6 py-3.5 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:border-champagne-200/40 hover:text-ink active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Send me the Vault
          </a>
          <a
            href="/sample-briefing"
            onClick={() => track("sample_briefing_clicked_from_templates", { source: "final" })}
            className="text-[12.5px] text-ink/55 underline-offset-4 hover:text-ink hover:underline"
          >
            Or see a sample briefing
          </a>
        </div>
        <p className="mt-6 text-[11.5px] uppercase tracking-[0.22em] text-ink/40">
          Free, email-only. No bank connection required to start.
        </p>
      </div>
    </section>
  );
}

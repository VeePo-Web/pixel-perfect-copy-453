import { track } from "../analytics";
import { startAutoFillCheckout } from "../../../lib/checkout";
export default function TemplateToFinanceDeskBridge() {
  return (
    <section
      aria-label="Finance Desk bridge"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:px-10">
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
          When you're ready for more
        </div>
        <p className="mt-4 text-[15px] leading-[1.7] text-ink/65">
          When you're ready for a human to read your numbers with you,{" "}
          <a
            href="/apply"
            onClick={() => track("desk_bridge_clicked_from_templates", { source: "bridge" })}
            className="text-ink/85 underline decoration-champagne-200/50 underline-offset-4 transition-colors hover:text-ink hover:decoration-champagne-300"
          >
            here's what the Desk does
          </a>
          .
        </p>
        <p className="mt-4">
          <button
            type="button"
            onClick={() => { startAutoFillCheckout(); track("autofill_clicked_from_templates", { source: "bridge" }); }}
            className="group inline-flex items-center text-[12px] uppercase tracking-[0.18em] text-ink/40 transition-colors duration-300 hover:text-champagne-300"
          >
            <span className="border-b border-ink/10 pb-0.5 group-hover:border-champagne-300/60">
              Already ready? $99/mo
            </span>
            <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </p>
      </div>
    </section>
  );
}

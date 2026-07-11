import { plans } from "../content";
import PricingCard from "./PricingCard";

export default function PricingLadder() {
  // order for desktop: templates, toolkit, desk (center), plus, private
  return (
    <section id="plans" aria-labelledby="ladder-title" className="border-b border-ink/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="mb-12 max-w-[58ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            The offer ladder
          </div>
          <h2 id="ladder-title" className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
            Five paths to financial clarity, anchored on one recurring rhythm.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {plans.map((p) => (
            <div
              key={p.id}
              className={p.tone === "flagship" ? "md:col-span-2 xl:col-span-1 xl:order-3" : ""}
            >
              <PricingCard plan={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

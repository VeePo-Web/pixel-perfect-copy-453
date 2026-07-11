import { plans } from "../content";
import PricingCard from "./PricingCard";

export default function PricingLadder() {
  return (
    <section id="plans" aria-labelledby="ladder-title" className="border-b border-ink/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="mb-12 max-w-[62ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            The offer ladder
          </div>
          <h2 id="ladder-title" className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
            Three ways to work with us — anchored on one recurring rhythm.
          </h2>
          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-ink/65">
            Start free with the Vault. Step into GoldFin Reports when you want the templates filled for you every two weeks. Move up to Advisory when you want Chris Sam in the room for the decisions that move the business.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <PricingCard key={p.id} plan={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

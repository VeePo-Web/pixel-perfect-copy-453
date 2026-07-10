import { plans } from "../content";
import PricingCard from "./PricingCard";

export default function PricingLadder() {
  return (
    <section id="plans" aria-labelledby="ladder-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-24 lg:px-10">
        <div className="mb-12 max-w-[62ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            The offer ladder
          </div>
          <h2 id="ladder-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
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

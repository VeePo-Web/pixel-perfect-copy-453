import type { PricingPlan } from "../content";

type Props = { plan: PricingPlan; emphasis?: boolean };

export default function PricingCard({ plan, emphasis }: Props) {
  const flagship = plan.tone === "flagship" || emphasis;
  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl border p-6 backdrop-blur-sm transition-all duration-500 ease-cinema sm:p-7 ${
        flagship
          ? "border-champagne-200/40 bg-charcoal-900/75 shadow-[0_30px_80px_-30px_rgba(217,190,130,0.35)] lg:scale-[1.04]"
          : "border-ink/[0.07] bg-charcoal-900/55 hover:-translate-y-0.5 hover:border-champagne-200/25 hover:shadow-[0_24px_60px_-30px_rgba(217,190,130,0.25)]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent transition-opacity duration-500 ${
          flagship ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />
      {plan.badge && (
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-champagne-200/40 bg-champagne-300/[0.06] px-3 py-1 text-[10.5px] uppercase tracking-[0.22em] text-champagne-100">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-200 motion-safe:animate-soft-pulse" />
          {plan.badge}
        </div>
      )}
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-bone/45">
        {plan.tone === "entry" ? "Free" : plan.tone === "self" ? "Self-guided" : plan.tone === "flagship" ? "Flagship" : plan.tone === "plus" ? "Plus" : "Private"}
      </div>
      <h3 className="mt-2 font-light text-bone text-[22px] leading-[1.15] tracking-[-0.005em]">
        {plan.name}
      </h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={`font-light tabular-nums ${flagship ? "text-[44px] text-bone" : "text-[32px] text-bone/90"}`}>
          {plan.price}
        </span>
        {plan.priceSuffix && (
          <span className="text-[12.5px] text-bone/55">{plan.priceSuffix}</span>
        )}
      </div>
      {plan.note && (
        <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-bone/40">{plan.note}</div>
      )}
      <p className="mt-5 text-[14px] leading-[1.6] text-bone/75">{plan.positioning}</p>
      <p className="mt-3 text-[12.5px] leading-[1.6] text-bone/50">
        <span className="uppercase tracking-[0.18em] text-bone/40">Best for · </span>
        {plan.bestFor}
      </p>
      <ul className="mt-6 space-y-2.5">
        {plan.includes.map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-bone/85">
            <span
              className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                flagship ? "bg-champagne-200" : "bg-bone/30"
              }`}
              aria-hidden
            />
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-7 pt-2">
        <a
          href={plan.cta.href}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium tracking-wide transition-all duration-400 ease-cinema ${
            flagship
              ? "bg-gradient-to-b from-champagne-100 to-champagne-300 text-charcoal-950 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)]"
              : "border border-ink/[0.12] text-bone/90 hover:border-champagne-200/40 hover:text-bone"
          }`}
        >
          {plan.cta.label}
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}

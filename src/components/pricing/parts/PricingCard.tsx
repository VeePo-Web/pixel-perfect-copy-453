import type { PricingPlan } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";

type Props = { plan: PricingPlan; emphasis?: boolean };

export default function PricingCard({ plan, emphasis }: Props) {
  const flagship = plan.tone === "flagship" || emphasis;
  // The $150 continuity rung is the ONLY plan that earns the gold CTA.
  // Advisory (flagship) is text/tertiary — never gold.
  const recommended = plan.tone === "continuity";
  const gold = recommended; // advisory does NOT get gold
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 transition-all duration-500 ease-cinema sm:p-7 ${
        flagship
          ? "border-ink/[0.10] shadow-[0_16px_48px_-24px_rgba(11,13,18,0.14)] lg:scale-[1.04]"
          : recommended
          ? "border-champagne-200/50 shadow-[0_24px_60px_-28px_rgba(11,13,18,0.16),0_14px_40px_-22px_rgba(184,137,58,0.25)] hover:-translate-y-0.5"
          : "border-ink/[0.08] shadow-[0_1px_2px_rgba(11,13,18,0.04)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)]"
      }`}
    >
      {gold && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300 to-transparent"
        />
      )}
      {plan.badge && (
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-champagne-200/50 bg-champagne-50/50 px-3 py-1 font-general text-[10px] uppercase tracking-[0.22em] text-champagne-300">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-200" />
          {plan.badge}
        </div>
      )}
      <div className="font-general text-[10px] uppercase tracking-[0.28em] text-ink/45">
        {plan.tone === "entry" ? "Free" : plan.tone === "self" ? "Self-guided" : plan.tone === "continuity" ? "Continuity" : plan.tone === "flagship" ? "Flagship" : plan.tone === "plus" ? "Plus" : "Private"}
      </div>
      <h3 className="mt-2 font-display text-[22px] font-medium leading-[1.15] tracking-[-0.01em] text-ink">
        {plan.name}
      </h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={`font-display font-medium tracking-[-0.01em] tabular-nums ${flagship ? "text-[44px] text-ink" : recommended ? "text-[40px] text-ink" : "text-[32px] text-ink/80"}`}>
          {plan.price}
        </span>
        {plan.priceSuffix && (
          <span className="text-[12.5px] text-ink/55">{plan.priceSuffix}</span>
        )}
      </div>
      {plan.note && (
        <div className="mt-1 font-general text-[10.5px] uppercase tracking-[0.18em] text-ink/45">{plan.note}</div>
      )}
      <p className="mt-5 text-[14px] leading-[1.6] text-ink/75">{plan.positioning}</p>
      <p className="mt-3 text-[12.5px] leading-[1.6] text-ink/65">
        <span className="font-general text-[10.5px] uppercase tracking-[0.18em] text-ink/45">Best for · </span>
        {plan.bestFor}
      </p>
      <ul className="mt-6 space-y-2.5">
        {plan.includes.map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink/85">
            <span
              className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                flagship || gold ? "bg-champagne-200" : "bg-ink/25"
              }`}
              aria-hidden
            />
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-7 pt-2">
        {plan.tone === "continuity" ? (
          <button
            type="button"
            onClick={startAutoFillCheckout}
            className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium transition-all duration-300 ease-cinema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 active:scale-[0.98] ${
              gold
                ? "bg-gradient-to-b from-champagne-100 to-champagne-200 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)]"
                : "border border-ink/[0.12] bg-white text-ink/80 hover:border-ink/[0.25] hover:text-ink"
            }`}
          >
            {plan.cta.label}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <a
            href={plan.cta.href}
          className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium transition-all duration-300 ease-cinema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 active:scale-[0.98] ${
            gold
              ? "bg-gradient-to-b from-champagne-100 to-champagne-200 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)]"
              : "border border-ink/[0.12] bg-white text-ink/80 hover:border-ink/[0.25] hover:text-ink"
          }`}
          >
            {plan.cta.label}
            <span aria-hidden>→</span>
          </a>
        )}
        {(plan.tone === "entry" || plan.tone === "continuity" || plan.tone === "flagship") && (
          <p className="mt-2.5 text-center font-general text-[10px] uppercase tracking-[0.16em] text-ink/50">
            {plan.tone === "entry"
              ? "No account required · Instant access"
              : plan.tone === "continuity"
              ? "Month-to-month · Cancel anytime"
              : "By application · No obligation"}
          </p>
        )}
      </div>
    </article>
  );
}

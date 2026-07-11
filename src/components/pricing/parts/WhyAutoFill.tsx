import { useInView } from "../../how-it-works/hooks/useInView";
import { startAutoFillCheckout } from "../../../lib/checkout";
const rows = [
  { label: "Doing it yourself", value: "~3 hrs / month", sub: "Pulling transactions, categorizing, updating every template, then trying to read it." },
  { label: "Auto-filled for you", value: "0 hrs / month", sub: "Filled from your numbers and explained in a monthly briefing. You just read it." },
];

export default function WhyAutoFill() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <section aria-labelledby="why150-title" className="border-b border-ink/[0.06] bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            Why $150 makes sense
          </div>
          <h2 id="why150-title" className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[46px]">
            The work doesn’t go away. It just stops being yours.
          </h2>
          <p className="mt-6 text-[15.5px] leading-[1.7] text-ink/70">
            Organizing and reading your numbers takes about three hours every month — the part most owners quietly skip. Auto-fill does it for you for $150. If an hour of your time is worth more than about $50, the math already works.
          </p>
        </div>

        <div
          ref={ref}
          className={`mt-12 grid gap-4 sm:grid-cols-2 transition-all duration-700 ease-cinema ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`relative overflow-hidden rounded-2xl border bg-white p-7 ${
                i === 1
                  ? "border-champagne-200/50 shadow-[0_20px_50px_-24px_rgba(11,13,18,0.16),0_12px_36px_-20px_rgba(184,137,58,0.22)]"
                  : "border-ink/[0.08] shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
              }`}
            >
              {i === 1 && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300 to-transparent"
                />
              )}
              <div className="font-general text-[11px] uppercase tracking-[0.24em] text-ink/45">{r.label}</div>
              <div className={`mt-3 font-general tabular-nums ${i === 1 ? "text-[34px] text-ink" : "text-[34px] text-ink/70"}`}>
                {r.value}
              </div>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-ink/65">{r.sub}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[13px] text-ink/50">
          You decide what your time is worth.{" "}
          <button type="button" onClick={startAutoFillCheckout} className="text-champagne-300 underline-offset-4 transition-colors hover:text-ink hover:underline">
            See what’s included for $150/mo →
          </button>
        </p>
      </div>
    </section>
  );
}

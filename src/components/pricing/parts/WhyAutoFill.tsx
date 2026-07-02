import { useInView } from "../../how-it-works/hooks/useInView";
import { startAutoFillCheckout } from "../../../lib/checkout";
const rows = [
  { label: "Doing it yourself", value: "~3 hrs / month", sub: "Pulling transactions, categorizing, updating every template, then trying to read it." },
  { label: "Auto-filled for you", value: "0 hrs / month", sub: "Filled from your numbers and explained in a monthly briefing. You just read it." },
];

export default function WhyAutoFill() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <section aria-labelledby="why99-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Why $150 makes sense
          </div>
          <h2 id="why99-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[46px]">
            The work doesn’t go away. It just stops being yours.
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.7] text-ink/70">
            Organizing and reading your numbers takes about three hours every month — the part most owners quietly skip. Auto-fill does it for you for $150. If an hour of your time is worth more than about $33, the math already works.
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
              className={`rounded-2xl border p-7 ${
                i === 1
                  ? "border-champagne-200/35 bg-charcoal-900/70 shadow-[0_24px_60px_-30px_rgba(217,190,130,0.3)]"
                  : "border-ink/[0.07] bg-charcoal-900/55"
              }`}
            >
              <div className="text-[11px] uppercase tracking-[0.24em] text-ink/45">{r.label}</div>
              <div className={`mt-3 font-light tabular-nums ${i === 1 ? "text-[34px] text-ink" : "text-[34px] text-ink/80"}`}>
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

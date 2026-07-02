import { useInView } from "../../how-it-works/hooks/useInView";
import { startAutoFillCheckout } from "../../../lib/checkout";
// Squeeze §5 — Soap-Opera Promise. Sets expectations for the email sequence
// (reduces unsubscribes) and pre-frames the $150 upgrade. No CTA by design —
// the value is the promise itself.
const DAYS = [
  { d: "Day 1", t: "Your Vault — and the one number most owners miss" },
  { d: "Day 2", t: "Why your bank balance isn't a strategy" },
  { d: "Day 3", t: "Clean books still need interpretation" },
  { d: "Day 4", t: "Can you actually afford the next hire?" },
  { d: "Day 5", t: "Revenue grew. Cash still felt tight. Here's why." },
];

export default function SoapOperaPromise() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <section aria-labelledby="soap-title" className="border-b border-ink/[0.05] bg-white">
      <div ref={ref} className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
        <div
          className={`text-[10.5px] uppercase tracking-[0.32em] text-champagne-300 transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          What lands in your inbox
        </div>
        <h2
          id="soap-title"
          className={`mt-4 max-w-[24ch] font-light text-ink text-[30px] leading-[1.1] tracking-[-0.005em] transition-all duration-700 ease-cinema sm:text-[40px] ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "80ms" }}
        >
          Over the next 5 days, one short email shows you how owners actually use the Vault.
        </h2>

        <ol className="mt-10 space-y-3">
          {DAYS.map((day, i) => (
            <li
              key={day.d}
              className={`grid grid-cols-[64px_1fr] items-center gap-4 rounded-xl border border-ink/[0.07] bg-white px-5 py-4 transition-all duration-700 ease-cinema ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: `${160 + i * 80}ms` }}
            >
              <span className="text-[11px] uppercase tracking-[0.22em] text-champagne-300">{day.d}</span>
              <span className="text-[15px] text-ink/85">{day.t}</span>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-[56ch] text-[14px] leading-[1.65] text-ink/55">
          No spam, ever. By the end you'll know exactly what your numbers are telling you — and whether you'd rather have them filled for you every month.
        </p>
        <button
          type="button" onClick={startAutoFillCheckout}
          className="group mt-6 inline-flex items-center text-[12px] uppercase tracking-[0.18em] text-ink/35 transition-colors duration-300 hover:text-champagne-300"
        >
          <span className="border-b border-ink/10 pb-0.5 group-hover:border-champagne-300/60">
            Already decided? Auto-fill my reports — $150/mo
          </span>
          <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </button>
      </div>
    </section>
  );
}

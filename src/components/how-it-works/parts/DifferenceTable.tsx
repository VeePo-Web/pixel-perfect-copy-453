import { HIW_COPY } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";
import SectionHeader from "./SectionHeader";
import { useInView } from "../hooks/useInView";

export default function DifferenceTable() {
  const c = HIW_COPY.diff;
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div>
      <SectionHeader headline={c.headline} />
      <div
        ref={ref}
        className={`mt-10 overflow-x-auto rounded-2xl border border-charcoal-700 bg-white shadow-[0_1px_3px_0_rgba(11,13,18,0.07),_0_2px_8px_-2px_rgba(11,13,18,0.05)] transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-[0.22em] text-ink/40">
              <th className="sticky left-0 bg-paper-raised px-5 py-4 font-normal">Approach</th>
              {c.cols.map((col) => (
                <th key={col} className="px-5 py-4 font-normal">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr
                key={r.name}
                className={`border-t border-charcoal-700/60 transition-colors duration-300 ${
                  r.highlight ? "bg-champagne-200/[0.04]" : "hover:bg-paper-raised"
                }`}
              >
                <td
                  className={`relative sticky left-0 px-5 py-5 align-top ${
                    r.highlight ? "bg-champagne-200/[0.06]" : "bg-white"
                  }`}
                >
                  {r.highlight && (
                    <span className="absolute inset-y-3 left-0 w-[2px] bg-champagne-200" />
                  )}
                  <div
                    className={`text-[15px] tracking-tight ${r.highlight ? "text-ink" : "text-ink/75"}`}
                  >
                    {r.name}
                  </div>
                </td>
                <td className="px-5 py-5 align-top text-[13.5px] leading-[1.55] text-ink/70">
                  {r.helps}
                </td>
                <td className="px-5 py-5 align-top text-[13.5px] leading-[1.55] text-ink/55">
                  {r.misses}
                </td>
                <td className="px-5 py-5 align-top text-[13.5px] leading-[1.55] text-ink/70">
                  {r.fit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <button
          type="button" onClick={startAutoFillCheckout}
          className="group relative inline-block overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13px] font-medium tracking-wide text-ink transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(212,168,69,0.45)] active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
        >
          <span className="relative z-10">{c.cta}</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
        </button>
      </div>
    </div>
  );
}

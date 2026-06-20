import { HIW_COPY } from "../content";
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
        className={`mt-10 overflow-x-auto rounded-2xl border border-ink/[0.06] bg-charcoal-900/40 transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-[0.22em] text-bone/40">
              <th className="px-5 py-4 font-normal sticky left-0 bg-charcoal-900/80 backdrop-blur-sm">Approach</th>
              {c.cols.map((col) => (
                <th key={col} className="px-5 py-4 font-normal">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr
                key={r.name}
                className={`border-t border-ink/[0.05] transition-colors duration-300 ${
                  r.highlight ? "bg-champagne-200/[0.04]" : "hover:bg-ink/[0.02]"
                }`}
              >
                <td className={`relative px-5 py-5 align-top sticky left-0 ${r.highlight ? "bg-charcoal-900/80" : "bg-charcoal-900/60"} backdrop-blur-sm`}>
                  {r.highlight && <span className="absolute inset-y-3 left-0 w-[2px] bg-champagne-200" />}
                  <div className={`text-[15px] tracking-tight ${r.highlight ? "text-bone" : "text-bone/75"}`}>{r.name}</div>
                </td>
                <td className="px-5 py-5 align-top text-[13.5px] leading-[1.55] text-bone/70">{r.helps}</td>
                <td className="px-5 py-5 align-top text-[13.5px] leading-[1.55] text-bone/55">{r.misses}</td>
                <td className="px-5 py-5 align-top text-[13.5px] leading-[1.55] text-bone/70">{r.fit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <a
          href="#/apply"
          className="group relative overflow-hidden inline-block rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-charcoal-950 transition-all duration-400 ease-cinema hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)]"
        >
          <span className="relative z-10">{c.cta}</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
        </a>
      </div>
    </div>
  );
}

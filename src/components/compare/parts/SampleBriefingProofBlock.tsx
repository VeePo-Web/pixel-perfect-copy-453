import { useInView } from "../../how-it-works/hooks/useInView";
import { sampleBriefingProof } from "../content";
import { track } from "../analytics";

export default function SampleBriefingProofBlock() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="proof-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div
            className={`transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              The difference
            </div>
            <h2
              id="proof-heading"
              className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
            >
              The difference is the plain-English briefing.
            </h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-ink/70">
              Most tools show numbers. The GoldFin Desk turns financial activity into cash movement, revenue trend, expense pattern, questions to review, and decisions to consider.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/sample-briefing"
                onClick={() => track("sample_briefing_clicked_from_compare", { source: "proof" })}
                className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span className="relative z-10">Generate Sample Finance Briefing</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </a>
              <a
                href="/sample-briefing"
                className="text-[12.5px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
              >
                See full sample briefing →
              </a>
            </div>
          </div>

          <div
            className={`rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-6 shadow-[0_30px_100px_-40px_rgba(25,28,34,0.14)] transition-all duration-700 ease-cinema delay-150 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.26em] text-ink/45">
              <span>Bi-weekly briefing · preview</span>
              <span className="text-champagne-300/70">Plain English</span>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {sampleBriefingProof.modules.map((m) => (
                <li
                  key={m.title}
                  className="rounded-xl border border-ink/[0.06] bg-charcoal-900/40 p-4"
                >
                  <div className="text-[10.5px] uppercase tracking-[0.24em] text-champagne-300/70">
                    Module
                  </div>
                  <div className="mt-1.5 text-[14px] font-light text-ink">{m.title}</div>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink/55">{m.note}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-champagne-200/30 bg-champagne-200/[0.05] p-4">
              <div className="text-[10.5px] uppercase tracking-[0.24em] text-champagne-300/70">
                Sample insight
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/85">
                {sampleBriefingProof.insight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

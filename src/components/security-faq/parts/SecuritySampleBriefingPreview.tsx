import { useInView } from "../../how-it-works/hooks/useInView";
import { sampleBriefingPreview } from "../content";
import { trackCtaByHref } from "../analytics";

export default function SecuritySampleBriefingPreview() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="sample-briefing-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div
            className={`max-w-xl transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              Preview the product
            </div>
            <h2
              id="sample-briefing-heading"
              className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
            >
              The safest way to understand the product is to preview it.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink/65">
              Use demo data or rough non-sensitive numbers to see how the Monthly Finance
              Desk turns financial activity into plain-English interpretation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/sample-briefing"
                onClick={() =>
                  trackCtaByHref("/sample-briefing", "security_faq_sample")
                }
                className="group relative overflow-hidden inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 text-[13.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_10px_36px_-10px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span className="relative z-10">Generate Sample Finance Briefing</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </a>
              <span className="text-[12px] text-ink/45">No bank connection required.</span>
            </div>
          </div>

          <div
            className={`rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-6 transition-all duration-700 ease-cinema delay-150 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center justify-between border-b border-ink/[0.06] pb-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-ink/45">
                Sample briefing · preview
              </div>
              <div className="text-[10.5px] text-ink/35">demo data</div>
            </div>
            <dl className="mt-4 divide-y divide-ink/[0.05]">
              {sampleBriefingPreview.rows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt className="text-[12.5px] uppercase tracking-[0.18em] text-ink/55">
                    {r.label}
                  </dt>
                  <dd className="text-right text-[13px] text-ink/85">{r.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 rounded-xl border border-champagne-200/15 bg-champagne-200/[0.05] p-4">
              <div className="text-[10.5px] uppercase tracking-[0.24em] text-champagne-300/70">
                Insight
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/85">
                {sampleBriefingPreview.insight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

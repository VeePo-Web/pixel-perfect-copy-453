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
            <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
              Preview the product
            </div>
            <h2
              id="sample-briefing-heading"
              className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[28px] leading-[1.08] tracking-[-0.02em] sm:text-[40px]"
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
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Generate Sample Finance Briefing
              </a>
              <span className="text-[12px] text-ink/45">No bank connection required.</span>
            </div>
          </div>

          <div
            className={`relative rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_24px_60px_-32px_rgba(11,13,18,0.25)] transition-all duration-700 ease-cinema delay-150 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent"
            />
            <div className="flex items-center justify-between border-b border-ink/[0.06] pb-4">
              <div className="font-general text-[10.5px] uppercase tracking-[0.24em] text-ink/45">
                Sample briefing · preview
              </div>
              <div className="font-general text-[10px] uppercase tracking-[0.2em] text-ink/35">demo data</div>
            </div>
            <dl className="mt-4 divide-y divide-ink/[0.05]">
              {sampleBriefingPreview.rows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt className="font-general text-[10.5px] uppercase tracking-[0.18em] text-ink/50">
                    {r.label}
                  </dt>
                  <dd className="text-right text-[13px] text-ink/85">{r.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 rounded-xl border border-champagne-200/40 bg-champagne-50/40 p-4">
              <div className="font-general text-[10.5px] uppercase tracking-[0.24em] text-champagne-300">
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

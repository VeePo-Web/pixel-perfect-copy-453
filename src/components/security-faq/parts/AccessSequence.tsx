import { accessSequence } from "../content";
import { trackCtaByHref } from "../analytics";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function AccessSequence() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      id="sequence"
      aria-labelledby="sequence-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div
          className={`max-w-3xl transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            Access sequence
          </div>
          <h2
            id="sequence-heading"
            className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[28px] leading-[1.08] tracking-[-0.02em] sm:text-[40px]"
          >
            How access works, step by step.
          </h2>
        </div>
        <ol className={`mt-12 grid gap-4 lg:grid-cols-5 transition-all duration-700 ease-cinema delay-150 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          {accessSequence.map((s) => (
            <li
              key={s.n}
              className="group relative flex flex-col rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-all duration-300 ease-cinema hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)] motion-safe:hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-general text-[10.5px] uppercase tracking-[0.28em] text-champagne-300">
                  Step {s.n}
                </span>
                <span className="font-general text-[11px] tabular-nums text-ink/30">0{s.n}</span>
              </div>
              <h3 className="mt-3 text-[15.5px] font-medium text-ink">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/65">{s.body}</p>
              <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-green-signal/20 bg-green-signal/[0.05] px-2.5 py-1 text-[11px] text-green-signal">
                <span aria-hidden className="h-1 w-1 rounded-full bg-green-signal" />
                {s.trust}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <a
            href="/sample-briefing"
            onClick={() =>
              trackCtaByHref("/sample-briefing", "security_faq_sequence")
            }
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/[0.12] bg-white px-5 text-[13px] text-ink/80 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
          >
            Start With a Safe Preview →
          </a>
        </div>
      </div>
    </section>
  );
}

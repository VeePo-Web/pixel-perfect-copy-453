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
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Access sequence
          </div>
          <h2
            id="sequence-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
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
              className="group relative flex flex-col rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-5 transition-all duration-300 hover:border-ink/[0.18] hover:bg-ink/[0.035] motion-safe:hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
                  Step {s.n}
                </span>
                <span className="text-[11px] text-ink/35">0{s.n}</span>
              </div>
              <h3 className="mt-3 text-[15.5px] font-medium text-ink">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/65">{s.body}</p>
              <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-2.5 py-1 text-[11px] text-emerald-200/85">
                <span aria-hidden className="h-1 w-1 rounded-full bg-emerald-300/80" />
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
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-[13px] text-ink transition-all duration-300 ease-cinema hover:border-ink/30 hover:bg-ink/[0.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
          >
            Start With a Safe Preview →
          </a>
        </div>
      </div>
    </section>
  );
}

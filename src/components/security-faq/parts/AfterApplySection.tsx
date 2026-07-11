import { useInView } from "../../how-it-works/hooks/useInView";
import { afterApplySteps } from "../content";
import { trackCtaByHref } from "../analytics";

export default function AfterApplySection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="after-apply-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div
          className={`max-w-3xl transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            After you apply
          </div>
          <h2
            id="after-apply-heading"
            className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[28px] leading-[1.08] tracking-[-0.02em] sm:text-[40px]"
          >
            What happens after you apply?
          </h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink/65">
            The application is designed to understand fit, not collect sensitive access.
          </p>
        </div>
        <ol
          className={`mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/[0.08] bg-ink/[0.06] shadow-[0_1px_2px_rgba(11,13,18,0.04)] sm:grid-cols-2 lg:grid-cols-5 transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {afterApplySteps.map((s) => (
            <li
              key={s.n}
              className="relative bg-white p-6 transition-colors hover:bg-[#FCFBF9]"
            >
              <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-champagne-300">
                Step {s.n}
              </div>
              <h3 className="mt-3 text-[15px] font-medium text-ink">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/65">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-green-signal/20 bg-green-signal/[0.04] p-5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-green-signal"
          />
          <p className="text-[13px] text-ink/80">
            Applying does not require payment, bank connection, or document upload.
          </p>
        </div>
        <div className="mt-10">
          <a
            href="/pricing"
            onClick={() => trackCtaByHref("/apply", "security_faq_after_apply")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Start My Application
          </a>
        </div>
      </div>
    </section>
  );
}

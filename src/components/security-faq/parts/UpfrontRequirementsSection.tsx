import { noUpfrontCards } from "../content";
import { trackCtaByHref } from "../analytics";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function UpfrontRequirementsSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="upfront-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div
          className={`max-w-3xl transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            What we do not ask for upfront
          </div>
          <h2
            id="upfront-heading"
            className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[28px] leading-[1.08] tracking-[-0.02em] sm:text-[40px]"
          >
            What you do not need to share to preview or apply.
          </h2>
        </div>
        <ul className={`mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-cinema delay-150 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          {noUpfrontCards.map((c) => (
            <li
              key={c.title}
              className="group relative rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-all duration-300 ease-cinema hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)] motion-safe:hover:-translate-y-0.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-signal/25 bg-green-signal/[0.05] text-green-signal">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-[15.5px] font-medium text-ink">{c.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/65">{c.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <a
            href="/pricing"
            onClick={() => trackCtaByHref("/apply", "security_faq_upfront")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Apply Without Bank Connection
          </a>
        </div>
      </div>
    </section>
  );
}

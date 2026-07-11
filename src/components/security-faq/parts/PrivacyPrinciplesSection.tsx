import { privacyPrinciples } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { useInView } from "../../how-it-works/hooks/useInView";
import { track } from "../analytics";

export default function PrivacyPrinciplesSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="principles-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div
          className={`max-w-3xl transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            Data minimization
          </div>
          <h2
            id="principles-heading"
            className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[28px] leading-[1.08] tracking-[-0.02em] sm:text-[40px]"
          >
            We ask for the least sensitive step first.
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink/65">
            The first interaction is intentionally low-risk. The preview works with demo
            data. The application asks for business context. Bank connection is not
            requested until later in the process, after onboarding and fit are
            established.
          </p>
        </div>
        <div className={`mt-12 grid gap-4 lg:grid-cols-3 transition-all duration-700 ease-cinema delay-150 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          {privacyPrinciples.map((p, i) => (
            <article
              key={p.title}
              className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-all duration-300 ease-cinema hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)] motion-safe:hover:-translate-y-0.5"
            >
              <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-champagne-300">
                Principle {i + 1}
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-ink">{p.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/65">{p.body}</p>
            </article>
          ))}
        </div>

        {/* CTA band — post-trust conversion gate (Brunson: trust → offer, never dead-end) */}
        <div className={`mt-14 flex flex-wrap items-center gap-4 transition-all duration-700 ease-cinema delay-200 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <button
            type="button"
            onClick={() => { startAutoFillCheckout(); track("privacy_principles_cta_gold"); }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Auto-fill my reports — $150/mo
          </button>
          <a
            href="/pricing"
            onClick={() => track("privacy_principles_cta_apply")}
            className="inline-flex min-h-11 items-center rounded-full border border-ink/[0.12] bg-white px-5 text-[13.5px] text-ink/80 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Start My Application
          </a>
        </div>
        <p className="mt-3 font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">No bank connection required · Cancel anytime</p>
      </div>
    </section>
  );
}

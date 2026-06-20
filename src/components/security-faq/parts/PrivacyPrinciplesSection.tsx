import { privacyPrinciples } from "../content";

export default function PrivacyPrinciplesSection() {
  return (
    <section
      aria-labelledby="principles-heading"
      className="relative border-b border-white/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Data minimization
          </div>
          <h2
            id="principles-heading"
            className="mt-3 font-light text-bone text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
          >
            We ask for the least sensitive step first.
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-bone/65">
            The first interaction is intentionally low-risk. The preview works with demo
            data. The application asks for business context. Bank connection is not
            requested until later in the process, after onboarding and fit are
            established.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {privacyPrinciples.map((p, i) => (
            <article
              key={p.title}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.18] motion-safe:hover:-translate-y-0.5"
            >
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/70">
                Principle {i + 1}
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-bone">{p.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-bone/65">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

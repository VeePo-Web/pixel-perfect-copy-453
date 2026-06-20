import { afterApplySteps } from "../content";
import { trackCtaByHref } from "../analytics";

export default function AfterApplySection() {
  return (
    <section
      aria-labelledby="after-apply-heading"
      className="relative border-b border-white/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            After you apply
          </div>
          <h2
            id="after-apply-heading"
            className="mt-3 font-light text-bone text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
          >
            What happens after you apply?
          </h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-bone/65">
            The application is designed to understand fit, not collect sensitive access.
          </p>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-5">
          {afterApplySteps.map((s) => (
            <li
              key={s.n}
              className="relative bg-charcoal-950/40 p-6 transition-colors hover:bg-white/[0.025]"
            >
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/70">
                Step {s.n}
              </div>
              <h3 className="mt-3 text-[15px] font-medium text-bone">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-bone/65">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300"
          />
          <p className="text-[13px] text-bone/80">
            Applying does not require payment, bank connection, or document upload.
          </p>
        </div>
        <div className="mt-10">
          <a
            href="#/apply"
            onClick={() => trackCtaByHref("#/apply", "security_faq_after_apply")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 text-[13.5px] font-medium text-charcoal-950 transition-all hover:shadow-[0_10px_36px_-10px_rgba(217,190,130,0.55)]"
          >
            Start Application
          </a>
        </div>
      </div>
    </section>
  );
}

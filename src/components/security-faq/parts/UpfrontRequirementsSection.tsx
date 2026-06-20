import { noUpfrontCards } from "../content";
import { trackCtaByHref } from "../analytics";

export default function UpfrontRequirementsSection() {
  return (
    <section
      aria-labelledby="upfront-heading"
      className="relative border-b border-white/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            What we do not ask for upfront
          </div>
          <h2
            id="upfront-heading"
            className="mt-3 font-light text-bone text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
          >
            What you do not need to share to preview or apply.
          </h2>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {noUpfrontCards.map((c) => (
            <li
              key={c.title}
              className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.04] motion-safe:hover:-translate-y-0.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200/90">
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
              <h3 className="mt-4 text-[15.5px] font-medium text-bone">{c.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-bone/65">{c.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <a
            href="#/apply"
            onClick={() => trackCtaByHref("#/apply", "security_faq_upfront")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 text-[13.5px] font-medium text-charcoal-950 transition-all hover:shadow-[0_10px_36px_-10px_rgba(217,190,130,0.55)]"
          >
            Apply Without Bank Connection
          </a>
        </div>
      </div>
    </section>
  );
}

import { featuredFAQ } from "../content";
import { track } from "../analytics";

export default function FeaturedFAQPreview() {
  return (
    <section
      aria-labelledby="featured-faq-heading"
      className="relative border-b border-white/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
          Top questions
        </div>
        <h2
          id="featured-faq-heading"
          className="mt-3 font-light text-bone text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
        >
          The questions most owners ask first.
        </h2>
        <div className="mt-10 grid gap-3 lg:grid-cols-2">
          {featuredFAQ.map((f, i) => (
            <details
              key={f.q}
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) {
                  track("faq_opened", { id: `featured-${i}`, question: f.q });
                }
              }}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.18] [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-[15px] font-medium text-bone">
                <span>{f.q}</span>
                <span
                  aria-hidden
                  className="mt-1 inline-block h-4 w-4 shrink-0 text-bone/55 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[13.5px] leading-relaxed text-bone/70">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8">
          <a
            href="#faq"
            className="inline-flex min-h-11 items-center text-[13px] text-bone/65 underline-offset-4 hover:text-bone hover:underline"
          >
            See all questions →
          </a>
        </div>
      </div>
    </section>
  );
}

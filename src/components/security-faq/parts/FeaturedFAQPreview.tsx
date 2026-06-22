import { useInView } from "../../how-it-works/hooks/useInView";
import { featuredFAQ } from "../content";
import { track } from "../analytics";

export default function FeaturedFAQPreview() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="featured-faq-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-5xl px-6 py-20 lg:px-10 lg:py-24">
        <div
          className={`transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Top questions
          </div>
          <h2
            id="featured-faq-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
          >
            The questions most owners ask first.
          </h2>
        </div>
        <div
          className={`mt-10 grid gap-3 lg:grid-cols-2 transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {featuredFAQ.map((f, i) => (
            <details
              key={f.q}
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) {
                  track("faq_opened", { id: `featured-${i}`, question: f.q });
                }
              }}
              className="group rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-5 transition-colors hover:border-ink/[0.18] [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-[15px] font-medium text-ink">
                <span>{f.q}</span>
                <span
                  aria-hidden
                  className="mt-1 inline-block h-4 w-4 shrink-0 text-ink/55 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8">
          <a
            href="#faq"
            className="inline-flex min-h-11 items-center text-[13px] text-ink/65 underline-offset-4 hover:text-ink hover:underline"
          >
            See all questions →
          </a>
        </div>
      </div>
    </section>
  );
}

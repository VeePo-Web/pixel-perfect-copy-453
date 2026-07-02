import { faq } from "../content";

// FAQPage schema — eligible for Google rich results + AI Overview citations
// (personas/seo-faq.md). Questions answer real $150 objections at the ask.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function PricingFAQ() {
  return (
    <section aria-labelledby="faq-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            FAQ
          </div>
          <h2 id="faq-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
            Questions owners ask before starting.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-ink/[0.07] overflow-hidden rounded-2xl border border-ink/[0.07] bg-charcoal-900/55">
          {faq.map((item, i) => (
            <details key={item.q} open={i === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-champagne-300/60">
                <span className="text-[15.5px] text-ink group-open:text-ink">{item.q}</span>
                <span
                  aria-hidden
                  className="text-[20px] leading-none text-ink/45 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14.5px] leading-[1.7] text-ink/75">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-8 text-[11.5px] uppercase tracking-[0.2em] text-ink/40">
          GoldFin Desk does not replace tax, legal, accounting, or investment advice.
        </p>
      </div>
    </section>
  );
}

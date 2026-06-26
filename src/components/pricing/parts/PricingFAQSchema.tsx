import { faq } from "../content";

// FAQPage structured data from the same `faq` the pricing page renders, so the
// schema text matches the visible markup. Rich-result + AI-citation eligibility,
// zero runtime/perf cost.
const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function PricingFAQSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

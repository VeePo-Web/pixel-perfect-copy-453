import { faqItems } from "../content";

// FAQPage structured data, generated from the SAME faqItems the page renders —
// so every Q&A in the markup matches the visible text (Google's requirement).
// Eligible for FAQ rich results and AI-answer citations; zero runtime/perf cost.
const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function FAQSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Service schema for the homepage (personas/seo-expert.md approves Service;
// explicitly NOT Product/Review until genuine reviews exist — penalty risk).
// Lists both offers, with the $99 GoldFin Reports first (the bread-and-butter).
const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Monthly financial clarity service",
  name: "GoldFin Desk",
  provider: { "@type": "Organization", name: "GoldFin Desk" },
  description:
    "GoldFin Desk turns your financial activity into organized spreadsheets and a plain-English monthly briefing — a recurring finance rhythm for owner-led businesses, without hiring a CFO.",
  areaServed: "US",
  offers: [
    {
      "@type": "Offer",
      name: "GoldFin Reports",
      description:
        "Your templates filled from your numbers and a plain-English briefing, every month. Fully automated.",
      price: "99",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "99",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
    },
    {
      "@type": "Offer",
      name: "GoldFin Advisory",
      description:
        "Everything in Reports plus a monthly one-hour strategy review with a finance professional. By application.",
      price: "1500",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "1500",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
    },
  ],
};

export default function HomeSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

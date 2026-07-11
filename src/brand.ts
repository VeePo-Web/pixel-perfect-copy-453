// Central brand + offer naming. One source of truth.
// Three-rung ladder: Free Vault · $150/mo Reports · Advisory (custom, contact-only).
// Advisory has NO Stripe SKU and NO public price. Never reintroduce $1,500.
export const BRAND = {
  name: "GoldFin Desk",
  tagline: "A dedicated thought partner for business owners.",
  // Offer ladder
  vault: "GoldFin Template Vault", // Free lead magnet
  reports: "GoldFin Reports", // $150/mo continuity — the offer
  advisory: "GoldFin Advisory", // Enterprise — custom, contact-only
  // Prices
  reportsPrice: "$150",
  advisoryPrice: "Custom",
  // Contact
  advisoryContactEmail: "chris@goldfindesk.com",
} as const;

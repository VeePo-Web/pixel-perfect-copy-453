// Central brand + offer naming. One source of truth so the GoldFin naming
// system stays identical across every surface (Brunson: consistent offer naming).
export const BRAND = {
  name: "GoldFin Desk",
  tagline: "Financial clarity for owner-led businesses",
  // Offer ladder
  vault: "GoldFin Template Vault", // Free lead magnet
  reports: "GoldFin Reports", // $99/mo continuity — bread & butter
  advisory: "GoldFin Advisory", // $1,500/mo human advisory
  executive: "GoldFin Executive Desk", // future high-end
  // Prices
  reportsPrice: "$99",
  advisoryPrice: "$1,500",
} as const;

// GoldFin Desk — first-pass mapping from Plaid PFC v2 primary categories to our statement sections.
// This is the FIRST PASS only. Precedence at runtime: user/learned rule -> this Plaid map
// (high confidence) -> AI tail (ambiguous). `internal_transfer` and `owner_equity` are later
// refined by opposite-signed pair matching and one-tap owner confirmation, and never touch
// revenue/expense totals.

import type { OpexLine, StatementSection } from "./types.ts";

const PLAID_PRIMARY_TO_SECTION: Readonly<Record<string, StatementSection>> = {
  INCOME: "revenue",
  TRANSFER_IN: "internal_transfer",
  TRANSFER_OUT: "internal_transfer",
  LOAN_PAYMENTS: "debt_service",
  GOVERNMENT_AND_NON_PROFIT: "tax",
  BANK_FEES: "opex",
  ENTERTAINMENT: "opex",
  FOOD_AND_DRINK: "opex",
  GENERAL_MERCHANDISE: "opex",
  HOME_IMPROVEMENT: "opex",
  MEDICAL: "opex",
  PERSONAL_CARE: "opex",
  GENERAL_SERVICES: "opex",
  TRANSPORTATION: "opex",
  TRAVEL: "opex",
  RENT_AND_UTILITIES: "opex",
};

const PLAID_PRIMARY_TO_OPEX_LINE: Readonly<Record<string, OpexLine>> = {
  RENT_AND_UTILITIES: "rent_utilities",
  GENERAL_SERVICES: "software",
  TRAVEL: "travel_meals",
  FOOD_AND_DRINK: "travel_meals",
};

/** First-pass section for a Plaid PFC primary; falls back to the review queue. */
export function sectionFromPlaidPrimary(primary: string): StatementSection {
  return PLAID_PRIMARY_TO_SECTION[primary] ?? "uncategorized";
}

/** First-pass opex line (only meaningful when the section resolves to `opex`). */
export function opexLineFromPlaidPrimary(primary: string): OpexLine {
  return PLAID_PRIMARY_TO_OPEX_LINE[primary] ?? "other";
}

export const OPEX_LINE_LABELS: Readonly<Record<OpexLine, string>> = {
  rent_utilities: "Rent & Utilities",
  software: "Software & Subscriptions",
  marketing: "Marketing",
  travel_meals: "Travel & Meals",
  other: "Other OpEx",
};

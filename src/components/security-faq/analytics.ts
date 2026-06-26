export type SecurityFAQEvent =
  | "security_faq_page_viewed"
  | "trust_flow_viewed"
  | "faq_search_used"
  | "faq_category_selected"
  | "faq_opened"
  | "plaid_section_viewed"
  | "sample_briefing_clicked_from_security_faq"
  | "apply_clicked_from_security_faq"
  | "autofill_clicked_from_security_faq"
  | "templates_clicked_from_security_faq"
  | "compare_clicked_from_security_faq"
  | "privacy_principles_cta_gold"
  | "privacy_principles_cta_apply"
  | "final_security_cta_clicked";

export function track(event: SecurityFAQEvent, payload?: Record<string, unknown>) {
  try {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (w.dataLayer && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...(payload ?? {}) });
    }
  } catch {
    /* analytics never blocks UI */
  }
}

export function trackCtaByHref(href: string, source: string) {
  if (href.startsWith("/pricing")) track("autofill_clicked_from_security_faq", { source });
  else if (href === "/apply") track("apply_clicked_from_security_faq", { source });
  else if (href === "/sample-briefing")
    track("sample_briefing_clicked_from_security_faq", { source });
  else if (href === "/templates")
    track("templates_clicked_from_security_faq", { source });
  else if (href === "/compare")
    track("compare_clicked_from_security_faq", { source });
}

export type CompareEvent =
  | "comparison_fit_finder_started"
  | "comparison_fit_finder_completed"
  | "comparison_recommendation_shown"
  | "comparison_card_clicked"
  | "use_case_selected"
  | "sample_briefing_clicked_from_compare"
  | "apply_clicked_from_compare"
  | "templates_clicked_from_compare"
  | "comparison_faq_opened"
  | "comparison_page_link_clicked";

export function track(event: CompareEvent, payload?: Record<string, unknown>) {
  try {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (w.dataLayer && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...(payload ?? {}) });
    }
  } catch {
    /* analytics never blocks UI */
  }
}

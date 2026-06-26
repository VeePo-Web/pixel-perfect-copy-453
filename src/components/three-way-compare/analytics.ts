export type ThreeWayEvent =
  | "three_way_comparison_viewed"
  | "fit_finder_started"
  | "fit_finder_completed"
  | "fit_finder_recommendation_shown"
  | "scenario_selected"
  | "sample_briefing_clicked_from_three_way_compare"
  | "apply_clicked_from_three_way_compare"
  | "templates_clicked_from_three_way_compare"
  | "pricing_clicked_from_three_way_compare"
  | "comparison_faq_opened"
  | "final_cta_clicked";

export function track(event: ThreeWayEvent, payload?: Record<string, unknown>) {
  try {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (w.dataLayer && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...(payload ?? {}) });
    }
  } catch {
    /* analytics never blocks UI */
  }
}

/** Convenience wrapper for CTA clicks that infers the event from href. */
export function trackCtaByHref(href: string, source: string) {
  if (href === "/apply")
    track("apply_clicked_from_three_way_compare", { source });
  else if (href === "/sample-briefing")
    track("sample_briefing_clicked_from_three_way_compare", { source });
  else if (href === "/templates")
    track("templates_clicked_from_three_way_compare", { source });
  else if (href.startsWith("/pricing"))
    track("pricing_clicked_from_three_way_compare", { source });
}

export type TemplateEvent =
  | "template_filter_clicked"
  | "template_card_viewed"
  | "template_preview_opened"
  | "template_download_started"
  | "template_download_completed"
  | "sample_briefing_clicked_from_templates"
  | "autofill_clicked_from_templates"
  | "apply_clicked_from_templates"
  | "recommended_path_selected"
  | "desk_bridge_clicked_from_templates"
  | "faq_opened";

export function track(event: TemplateEvent, payload?: Record<string, unknown>) {
  try {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (w.dataLayer && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...(payload ?? {}) });
    }
  } catch {
    /* analytics never blocks UI */
  }
}

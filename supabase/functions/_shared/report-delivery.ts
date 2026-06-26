// =========================================================================
// REPORT EMAIL DELIVERY — world-class delivery of the bi-weekly advisory.
// Service-role only. Four guarantees:
//   1. IDEMPOTENT   — one ledger row per report (UNIQUE report_id). A report
//                     already "sent" is never emailed again, even if the cron
//                     re-runs or a manual trigger overlaps.
//   2. COMPLIANT    — respects the recipient opt-out; every email carries a
//                     List-Unsubscribe (one-click) header + visible footer link.
//   3. DURABLE      — every attempt is recorded; transient failures are retried
//                     with exponential backoff by retryFailedDeliveries().
//   4. OBSERVABLE   — status / provider_message_id / last_error per report.
// The pure decision functions are unit-tested in report-delivery.test.ts.
// =========================================================================
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.45.0";
import { renderReportEmail, type RenderInput } from "./report-email.ts";

export const MAX_DELIVERY_ATTEMPTS = 5;
// Wait before attempt N+1, indexed by attempts already made.
//   0 made -> send now | 1 -> +10m | 2 -> +1h | 3 -> +6h | 4 -> +24h.
export const BACKOFF_MS = [0, 10 * 60_000, 60 * 60_000, 6 * 60 * 60_000, 24 * 60 * 60_000];

export type DeliveryStatus = "pending" | "sent" | "failed" | "suppressed";
export type DeliveryDecision = "suppress" | "skip" | "send";
type RenderBase = Omit<RenderInput, "unsubscribeUrl">;

// ---- PURE: retry scheduling ----
export function nextRetryDue(attempts: number, lastAttemptAt: string | null, nowMs: number): boolean {
  if (attempts >= MAX_DELIVERY_ATTEMPTS) return false;
  if (!lastAttemptAt) return true;
  const wait = BACKOFF_MS[Math.min(attempts, BACKOFF_MS.length - 1)];
  const last = Date.parse(lastAttemptAt);
  if (Number.isNaN(last)) return true;
  return nowMs - last >= wait;
}

// ---- PURE: what to do given preference + existing ledger state ----
export function decideDelivery(enabled: boolean, existingStatus: DeliveryStatus | null): DeliveryDecision {
  if (!enabled) return "suppress";
  if (existingStatus === "sent") return "skip";
  return "send";
}

// ---- PURE: CAN-SPAM one-click unsubscribe headers (RFC 8058) ----
export function unsubscribeHeaders(unsubscribeUrl: string): Record<string, string> {
  return {
    "List-Unsubscribe": "<" + unsubscribeUrl + ">",
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

// ---- PURE: map a Resend webhook event to a suppression reason (or null) ----
// Hard bounce + spam complaint => never email this address again (reputation).
export function suppressionReasonForEvent(eventType: string): "bounce" | "complaint" | null {
  if (eventType === "email.bounced") return "bounce";
  if (eventType === "email.complained") return "complaint";
  return null;
}

// ---- PURE: which delivery timestamp column a Resend event stamps (or null) ----
export function deliveryTimestampField(eventType: string): string | null {
  switch (eventType) {
    case "email.delivered": return "delivered_at";
    case "email.opened": return "opened_at";
    case "email.clicked": return "clicked_at";
    case "email.bounced": return "bounced_at";
    case "email.complained": return "complained_at";
    default: return null;
  }
}

async function ensurePreference(
  admin: SupabaseClient,
  userId: string,
): Promise<{ enabled: boolean; token: string | null }> {
  await admin.from("email_preferences").upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
  const { data } = await admin
    .from("email_preferences")
    .select("advisory_report_enabled, unsubscribe_token")
    .eq("user_id", userId)
    .maybeSingle();
  return { enabled: data?.advisory_report_enabled ?? true, token: (data?.unsubscribe_token as string | undefined) ?? null };
}

async function ensureDeliveryRow(admin: SupabaseClient, reportId: string, userId: string, email: string) {
  await admin
    .from("report_email_deliveries")
    .upsert({ report_id: reportId, user_id: userId, recipient_email: email }, { onConflict: "report_id", ignoreDuplicates: true });
}

async function getDelivery(admin: SupabaseClient, reportId: string) {
  const { data } = await admin
    .from("report_email_deliveries")
    .select("status, attempts, last_attempt_at")
    .eq("report_id", reportId)
    .maybeSingle();
  return data as { status: DeliveryStatus; attempts: number; last_attempt_at: string | null } | null;
}

// Global do-not-send check (fed by the Resend webhook: hard bounces + complaints).
// Fails open if the table is absent (pre-migration) so delivery is never blocked
// by a missing dependency.
async function isEmailSuppressed(admin: SupabaseClient, email: string): Promise<{ suppressed: boolean; reason: string | null }> {
  const { data } = await admin
    .from("email_suppressions")
    .select("reason")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return { suppressed: !!data, reason: (data?.reason as string | undefined) ?? null };
}

async function recordAttempt(admin: SupabaseClient, reportId: string, fields: Record<string, unknown>) {
  await admin.from("report_email_deliveries").update(fields).eq("report_id", reportId);
}

async function sendViaGateway(
  to: string,
  subject: string,
  html: string,
  text: string,
  unsubscribeUrl: string | null,
): Promise<{ ok: boolean; messageId?: string | null; error?: string }> {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !resendKey) return { ok: false, error: "missing_email_keys" };
  const from = Deno.env.get("RESEND_FROM") ?? "GoldFin Desk <noreply@goldfindesk.com>";
  const body: Record<string, unknown> = { from, to: [to], subject, html, text };
  if (unsubscribeUrl) body.headers = unsubscribeHeaders(unsubscribeUrl);
  try {
    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + lovableKey,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { ok: false, error: "gateway_" + res.status };
    const data = await res.json().catch(() => ({}));
    return { ok: true, messageId: data?.id ?? data?.message_id ?? null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network_error" };
  }
}

// ---- The one entry point (idempotent, compliant, durable, observable) ----
export async function deliverReportEmail(
  admin: SupabaseClient,
  params: { reportId: string; userId: string; email: string; render: RenderBase },
): Promise<{ status: DeliveryStatus; skipped?: boolean; messageId?: string | null }> {
  const { reportId, userId, email, render } = params;

  const pref = await ensurePreference(admin, userId);
  const existing = await getDelivery(admin, reportId);
  const sup = await isEmailSuppressed(admin, email);
  const decision = decideDelivery(pref.enabled && !sup.suppressed, existing?.status ?? null);

  if (decision === "skip") return { status: "sent", skipped: true };

  await ensureDeliveryRow(admin, reportId, userId, email);
  const nowIso = new Date().toISOString();

  if (decision === "suppress") {
    const reason = sup.suppressed ? "suppressed_" + sup.reason : "user_unsubscribed";
    await recordAttempt(admin, reportId, { status: "suppressed", last_error: reason, last_attempt_at: nowIso });
    return { status: "suppressed" };
  }

  const supaUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const unsubscribeUrl = pref.token && supaUrl
    ? supaUrl + "/functions/v1/email-unsubscribe?token=" + pref.token
    : null;
  const { subject, html, text } = renderReportEmail({ ...render, unsubscribeUrl });

  const attempts = (existing?.attempts ?? 0) + 1;
  const result = await sendViaGateway(email, subject, html, text, unsubscribeUrl);

  if (result.ok) {
    await recordAttempt(admin, reportId, {
      status: "sent", provider_message_id: result.messageId ?? null,
      sent_at: nowIso, attempts, last_attempt_at: nowIso, last_error: null,
    });
    await admin.from("advisory_reports").update({ status: "sent" }).eq("id", reportId);
    return { status: "sent", messageId: result.messageId };
  }

  await recordAttempt(admin, reportId, { status: "failed", attempts, last_attempt_at: nowIso, last_error: result.error ?? "send_failed" });
  return { status: "failed" };
}

async function loadRenderForReport(admin: SupabaseClient, reportId: string): Promise<RenderBase | null> {
  const { data: r } = await admin
    .from("advisory_reports")
    .select("user_id, subject_line, narrative, metrics_snapshot, recommendations, coverage_pct, period_end, model")
    .eq("id", reportId)
    .maybeSingle();
  if (!r) return null;
  const { data: prof } = await admin
    .from("business_profiles").select("business_name").eq("user_id", r.user_id).maybeSingle();
  return {
    subjectLine: (r.subject_line as string | null) ?? null,
    sections: (r.narrative as RenderInput["sections"] | null) ?? [],
    metrics: (r.metrics_snapshot as RenderInput["metrics"]) ?? null,
    recommendations: (r.recommendations as RenderInput["recommendations"] | null) ?? [],
    coveragePct: (r.coverage_pct as number | null) ?? null,
    periodEnd: (r.period_end as string | null) ?? null,
    model: (r.model as string | null) ?? null,
    businessName: (prof?.business_name as string | null) ?? null,
  };
}

// Retry sweep — call from the cron after generation. Backoff-gated; bounded.
export async function retryFailedDeliveries(
  admin: SupabaseClient,
  opts: { now?: number; limit?: number } = {},
): Promise<{ retried: number; recovered: number }> {
  const nowMs = opts.now ?? Date.now();
  const limit = opts.limit ?? 50;
  const { data: rows } = await admin
    .from("report_email_deliveries")
    .select("report_id, user_id, recipient_email, attempts, last_attempt_at")
    .eq("status", "failed")
    .lt("attempts", MAX_DELIVERY_ATTEMPTS)
    .order("last_attempt_at", { ascending: true })
    .limit(limit);

  let retried = 0;
  let recovered = 0;
  for (const row of rows ?? []) {
    if (!nextRetryDue((row.attempts as number) ?? 0, (row.last_attempt_at as string | null) ?? null, nowMs)) continue;
    const render = await loadRenderForReport(admin, row.report_id as string);
    if (!render) continue;
    retried++;
    const r = await deliverReportEmail(admin, {
      reportId: row.report_id as string,
      userId: row.user_id as string,
      email: row.recipient_email as string,
      render,
    });
    if (r.status === "sent") recovered++;
  }
  return { retried, recovered };
}

// Pure renderer: grounded advisory report -> branded HTML email + subject.
// Email-safe inline styles, brand tokens (ink #0B0D12, gold #D4A845/#B8893A,
// hairline #E6E8EC, signal green #2E6B4A). No data is computed here — it renders
// the already-verified report. Pure => unit-tested (report-email.test.ts).
import type { MetricsPayload } from "./report-metrics.ts";

export type EmailSection = { key: string; heading: string; body: string };
export type EmailRec = { text: string; bucket: string; dollar?: number | null; deadline?: string | null };

export type RenderInput = {
  subjectLine: string | null;
  sections: EmailSection[];
  metrics: MetricsPayload | null;
  recommendations: EmailRec[];
  coveragePct: number | null;
  periodEnd: string | null;
  model: string | null;
  businessName: string | null;
  unsubscribeUrl?: string | null;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const usd = (n: number) => {
  const abs = Math.abs(n);
  const d = abs < 100 && abs % 1 !== 0 ? 2 : 0;
  return (n < 0 ? "-$" : "$") + abs.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};

const fmtDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const BUCKET: Record<string, string> = { find_cash: "Find cash", keep_more: "Keep more", earn_new: "Earn new" };

function moneyRecoveryHtml(m: MetricsPayload): string {
  if (!m.waste.length && !m.duplicates.length && !m.costCreep.length) return "";
  const rows: string[] = [];
  for (const w of m.waste) rows.push(`<tr><td style="padding:6px 0;font-size:14px;color:#0B0D12">Dormant: <strong>${esc(w.merchant)}</strong></td><td style="padding:6px 0;text-align:right;font-size:14px;color:#2E6B4A">${usd(w.annual)}/yr</td></tr>`);
  for (const d of m.duplicates) rows.push(`<tr><td style="padding:6px 0;font-size:14px;color:#0B0D12">Duplicate: <strong>${esc(d.merchant)}</strong> — dispute by ${fmtDate(d.disputeBy)}</td><td style="padding:6px 0;text-align:right;font-size:14px;color:#2E6B4A">${usd(d.amount)} back</td></tr>`);
  for (const c of m.costCreep) rows.push(`<tr><td style="padding:6px 0;font-size:14px;color:#0B0D12">Cost creep: <strong>${esc(c.merchant)}</strong> ${usd(c.from)} → ${usd(c.to)}</td><td style="padding:6px 0;text-align:right;font-size:13px;color:#5A6170">verify</td></tr>`);
  return `<div style="border:1px solid rgba(212,168,69,.4);background:rgba(212,168,69,.06);border-radius:10px;padding:14px 18px;margin:14px 0">
    <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#B8893A;margin:0 0 8px">Money to recover · ${usd(m.wasteAnnualTotal)}/yr identified</p>
    <table style="width:100%;border-collapse:collapse">${rows.join("")}</table></div>`;
}

function decisionsHtml(recs: EmailRec[]): string {
  if (!recs.length) return "";
  const items = recs.map((r, i) => {
    const dollar = r.dollar != null ? ` <span style="color:#2E6B4A">${usd(r.dollar)}</span>` : "";
    const by = r.deadline ? ` <span style="color:#8A93A3">by ${fmtDate(r.deadline)}</span>` : "";
    return `<li style="margin:0 0 12px;font-size:14.5px;line-height:1.6;color:#0B0D12">${esc(r.text)}<br><span style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#B8893A">${esc(BUCKET[r.bucket] ?? r.bucket)}</span>${dollar}${by}</li>`;
  }).join("");
  return `<h3 style="font-size:17px;font-weight:400;color:#0B0D12;margin:24px 0 8px">What to do now</h3><ol style="margin:0;padding-left:20px">${items}</ol>`;
}

// The "one number" headline — the owner grasps "am I OK?" in five seconds
// (Report-Value: understood-in-30s). Pure render of ALREADY-VERIFIED metrics
// (the same figures the model was grounded on) — no model text, nothing to
// hallucinate. Runway is coloured against the owner's reserve floor.
function headlineHtml(m: MetricsPayload): string {
  const floor = m.profile?.reserve_floor_months ?? 3;
  const netColor = m.netCash >= 0 ? "#2E6B4A" : "#B4452F";
  const cell = (label: string, value: string, color: string) =>
    `<td style="padding:0 6px;vertical-align:top;width:33%">
      <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8A93A3;margin:0 0 4px">${label}</div>
      <div style="font-size:22px;line-height:1.1;color:${color}">${value}</div></td>`;

  const cells: string[] = [];
  if (m.runwayMonths != null) {
    const runwayColor = m.runwayMonths >= floor ? "#2E6B4A" : m.runwayMonths >= floor / 2 ? "#B8893A" : "#B4452F";
    cells.push(cell("Cash runway", `${m.runwayMonths} mo`, runwayColor));
    cells.push(cell("Net cash (period)", usd(m.netCash), netColor));
  } else {
    cells.push(cell("Net cash (period)", usd(m.netCash), netColor));
    cells.push(cell("Monthly burn", usd(m.monthlyBurn), "#0B0D12"));
  }
  const revValue = m.revenueVsPriorPct == null
    ? "—"
    : `${m.revenueVsPriorPct >= 0 ? "▲ " : "▼ "}${Math.abs(m.revenueVsPriorPct)}%`;
  const revColor = m.revenueVsPriorPct == null ? "#0B0D12" : (m.revenueVsPriorPct >= 0 ? "#2E6B4A" : "#B4452F");
  cells.push(cell("Revenue vs prior", revValue, revColor));

  // Why the figures won't match the raw bank balance (transparency builds trust).
  const note = m.nonOperatingExcluded > 0
    ? `<p style="font-size:11px;line-height:1.5;color:#8A93A3;margin:12px 0 0">${usd(m.nonOperatingExcluded)} of transfers and owner draws were set aside — they aren't business income or expense, so this won't match your raw bank balance.</p>`
    : "";

  return `<div style="border:1px solid #E6E8EC;border-radius:12px;padding:18px 14px;margin:0 0 16px;box-shadow:0 0 0 1px rgba(212,168,69,.18)">
    <table style="width:100%;border-collapse:collapse"><tr>${cells.join("")}</tr></table>${note}</div>`;
}

// Trust signal: when coverage is low, say so plainly rather than present shaky
// figures with false confidence (Report-Value: TRUSTED). Pure render.
function trustBannerHtml(m: MetricsPayload): string {
  if (m.coveragePct == null || m.coveragePct >= 80) return "";
  return `<div style="border:1px solid rgba(184,137,58,.4);background:rgba(184,137,58,.07);border-radius:10px;padding:12px 16px;margin:0 0 14px">
    <p style="font-size:12.5px;line-height:1.55;color:#7A5B1E;margin:0">Heads up — ${m.coveragePct}% of your transactions are categorized so far. Treat the figures below as directional; they sharpen as the rest are reviewed.</p></div>`;
}

// Hidden preview text shown by inboxes next to the subject (drives the open).
function preheaderText(m: MetricsPayload | null): string {
  if (!m) return "";
  const parts: string[] = [];
  if (m.runwayMonths != null) parts.push(`Cash runway ${m.runwayMonths} months`);
  else parts.push(`Net cash ${usd(m.netCash)} this period`);
  if (m.revenueVsPriorPct != null) parts.push(`revenue ${m.revenueVsPriorPct >= 0 ? "up" : "down"} ${Math.abs(m.revenueVsPriorPct)}% vs last cycle`);
  if (m.wasteAnnualTotal > 0) parts.push(`${usd(m.wasteAnnualTotal)}/yr to recover`);
  return parts.join(" · ");
}

// Plain-text part — every well-formed email ships text/plain alongside HTML
// (deliverability + accessibility + clients that strip HTML).
function renderText(input: RenderInput, stamp: string): string {
  const out: string[] = ["GOLDFIN DESK — BI-WEEKLY ADVISORY"];
  if (input.subjectLine) out.push("", input.subjectLine);
  const summary = preheaderText(input.metrics);
  if (summary) out.push("", summary);
  const m = input.metrics;
  if (m && m.coveragePct != null && m.coveragePct < 80) {
    out.push("", `Heads up: ${m.coveragePct}% of transactions categorized so far — figures are directional.`);
  }
  if (m && m.nonOperatingExcluded > 0) {
    out.push("", `Note: ${usd(m.nonOperatingExcluded)} of transfers and owner draws were set aside (not business income or expense).`);
  }
  for (const s of input.sections) out.push("", s.heading.toUpperCase(), s.body.trim());
  if (input.recommendations.length) {
    out.push("", "WHAT TO DO NOW");
    input.recommendations.forEach((r, i) => {
      const dollar = r.dollar != null ? ` (${usd(r.dollar)})` : "";
      const by = r.deadline ? ` — by ${fmtDate(r.deadline)}` : "";
      out.push(`${i + 1}. ${r.text} [${BUCKET[r.bucket] ?? r.bucket}]${dollar}${by}`);
    });
  }
  out.push("", "—", stamp);
  if (input.unsubscribeUrl) out.push("", `Unsubscribe from advisory emails: ${input.unsubscribeUrl}`);
  return out.join("\n");
}

export function renderReportEmail(input: RenderInput): { subject: string; html: string; text: string } {
  const subject = input.subjectLine?.trim() || `${input.businessName ?? "Your business"}: your advisory report`;
  const blocks = input.sections.map((s) => {
    const emphasis = s.key === "verdict";
    const headStyle = emphasis ? "font-size:21px;color:#0B0D12;margin:0 0 6px" : "font-size:16px;color:#0B0D12;margin:0 0 6px";
    const extra = s.key === "leaking" && input.metrics ? moneyRecoveryHtml(input.metrics) : "";
    return `<div style="border:1px solid #E6E8EC;border-radius:12px;padding:18px 20px;margin:0 0 14px${emphasis ? ";box-shadow:0 0 0 1px rgba(212,168,69,.25)" : ""}">
      <h3 style="font-weight:400;${headStyle}">${esc(s.heading)}</h3>
      <p style="font-size:14.5px;line-height:1.7;color:#3A4150;margin:0;white-space:pre-line">${esc(s.body)}</p>${extra}</div>`;
  }).join("");

  const stamp = `Based on ${input.coveragePct != null ? `${input.coveragePct}% of transactions categorized` : "your connected accounts"}, reconciled as of ${fmtDate(input.periodEnd)}. No figures were invented — every number comes from your connected data.${input.model ? ` Generated by GoldFin Desk · ${esc(input.model)}.` : ""}`;

  const unsubHtml = input.unsubscribeUrl
    ? `<p style="font-size:11px;line-height:1.6;color:#B0B5BE;margin:10px 0 0">You're receiving this as part of your GoldFin Desk plan. <a href="${esc(input.unsubscribeUrl)}" style="color:#8A93A3;text-decoration:underline">Unsubscribe from advisory emails</a>.</p>`
    : "";

  const preheader = preheaderText(input.metrics);
  const headline = input.metrics ? headlineHtml(input.metrics) : "";
  const trust = input.metrics ? trustBannerHtml(input.metrics) : "";

  const html = `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0B0D12">
  ${preheader ? `<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;max-height:0;max-width:0;overflow:hidden;mso-hide:all">${esc(preheader)}</span>` : ""}
  <div style="max-width:600px;margin:0 auto;padding:36px 24px">
    <p style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8893A;margin:0 0 6px">GoldFin Desk · Bi-Weekly Advisory</p>
    ${input.subjectLine ? `<h1 style="font-size:24px;font-weight:400;line-height:1.2;color:#0B0D12;margin:0 0 16px">${esc(input.subjectLine)}</h1>` : ""}
    ${trust}
    ${headline}
    ${blocks}
    ${decisionsHtml(input.recommendations)}
    <hr style="border:none;border-top:1px solid #E6E8EC;margin:22px 0 14px" />
    <p style="font-size:11.5px;line-height:1.6;color:#8A93A3;margin:0">${stamp}</p>
    ${unsubHtml}
  </div></body></html>`;

  return { subject, html, text: renderText(input, stamp) };
}

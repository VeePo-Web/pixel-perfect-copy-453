// Presentational building blocks for the advisory report surface.
// Token-driven (ink / paper / gold / champagne / charcoal). Renders the
// server-computed snapshot — never recomputes financials.
import type { MetricsSnapshot, Recommendation, IndustryMetric, IndustryPack, GrowthBlock } from "@/lib/report/types";
import { BUCKET_LABEL } from "@/lib/report/types";
import { fmtUSD, fmtPct, fmtDate } from "@/lib/report/format";

// ---------------------------------------------------------------------------
// GROWTH GATE — the "now make MORE money" move, shown only as earned. Growth is
// the least-certain bucket: the budget appears ONLY when the cash reserve is
// secured AND unit economics clear 3:1. Otherwise it shows exactly what to fix
// first. Renders the server-computed gate; never recomputes.
// ---------------------------------------------------------------------------
function GateCheck({ label, state }: { label: string; state: boolean | null }) {
  const style = state === true
    ? { text: "text-green-signal", mark: "✓" }
    : state === false
      ? { text: "text-red-signal", mark: "✕" }
      : { text: "text-ink/45", mark: "•" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12.5px] ${style.text}`}>
      <span aria-hidden className="font-[robert-medium]">{style.mark}</span>
      {label}
    </span>
  );
}

export function GrowthGate({ growth }: { growth: GrowthBlock | null }) {
  if (!growth) return null;
  const open = growth.status === "ready";
  return (
    <div className={`mt-4 rounded-xl border px-6 py-5 ${open ? "border-green-signal/30 bg-green-signal/[0.05]" : "border-charcoal-700 bg-paper-raised"}`}>
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/80">
        Where to grow · the least-certain money move
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <GateCheck label={`Cash reserve secured (${growth.reserveFloorMonths}-mo floor)`} state={growth.reserveSecured} />
        <GateCheck
          label={growth.ltvCacRatio != null ? `Unit economics ${growth.ltvCacRatio}:1 (need 3:1)` : "Unit economics (LTV:CAC) — add to assess"}
          state={growth.unitEconomicsOk}
        />
      </div>
      <p className="mt-3 text-[14px] leading-[1.65] text-ink/75">{growth.headline}</p>
      {open && growth.reinvestLow != null && growth.reinvestHigh != null && (
        <div className="mt-3 inline-flex items-baseline gap-2 rounded-lg bg-paper px-4 py-2 ring-1 ring-green-signal/25">
          <span className="text-[11px] uppercase tracking-[0.12em] text-ink/45">Reinvest budget</span>
          <span className="font-light tabular-nums text-green-signal text-[20px]">
            {fmtUSD(growth.reinvestLow)} – {fmtUSD(growth.reinvestHigh)}
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// INDUSTRY KPI SURFACE — the vertical lead metric (prime cost / CM-per-order /
// WIP underbilling / GMROI / utilization). Cycle-7: every report leads with
// the owner's make-or-break number. Renders the server-computed pack only.
// ---------------------------------------------------------------------------
const STATUS_STYLE: Record<string, { text: string; ring: string; dot: string; word: string }> = {
  good:   { text: "text-green-signal", ring: "ring-green-signal/25", dot: "bg-green-signal", word: "On target" },
  watch:  { text: "text-gold-700",     ring: "ring-gold-500/30",     dot: "bg-gold-500",    word: "Watch" },
  danger: { text: "text-red-signal",   ring: "ring-red-signal/30",   dot: "bg-red-signal",  word: "Past the line" },
  info:   { text: "text-ink/60",       ring: "ring-charcoal-700",    dot: "bg-ink/30",      word: "" },
};

function fmtMetricValue(m: IndustryMetric): string {
  switch (m.unit) {
    case "pct": return fmtPct(m.value).replace("+", "");
    case "usd": return fmtUSD(m.value);
    case "x": return `${m.value}x`;
    case "ratio": return `${m.value}`;
  }
}

export function IndustryKpi({ pack }: { pack: IndustryPack | null }) {
  if (!pack || (pack.metrics.length === 0 && !pack.unlockNote)) return null;
  return (
    <div className="mt-2 rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-5">
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/80">
        Your make-or-break number · {pack.leadLabel}
      </div>
      {pack.metrics.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pack.metrics.map((m) => {
            const s = STATUS_STYLE[m.status] ?? STATUS_STYLE.info;
            return (
              <div key={m.key} className={`rounded-lg bg-paper px-4 py-3 ring-1 ${s.ring}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[12px] text-ink/55">{m.label}</span>
                  {s.word && (
                    <span className={`inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.12em] ${s.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
                      {s.word}
                    </span>
                  )}
                </div>
                <div className={`mt-1 font-light tabular-nums ${s.text} text-[26px] leading-none`}>
                  {fmtMetricValue(m)}
                </div>
                {m.benchmarkLabel && (
                  <div className="mt-1.5 text-[11.5px] text-ink/45">Target: {m.benchmarkLabel}</div>
                )}
                {m.note && <div className="mt-1.5 text-[12px] leading-[1.5] text-ink/65">{m.note}</div>}
              </div>
            );
          })}
        </div>
      )}
      {pack.unlockNote && (
        <p className="mt-3 text-[12.5px] leading-[1.6] text-ink/55">
          <span className="text-gold-700">Unlock:</span> {pack.unlockNote}
        </p>
      )}
    </div>
  );
}

export function ContributionByLine({ m }: { m: MetricsSnapshot }) {
  const lines = m.contributionByLine ?? [];
  if (lines.length === 0) return null;
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-charcoal-700">
      <div className="bg-charcoal-800 px-5 py-2.5 text-[10.5px] uppercase tracking-[0.28em] text-ink/55">
        What's actually profitable · contribution margin by line
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-ink/45">
            <th className="px-5 py-2 font-normal">Line</th>
            <th className="px-5 py-2 text-right font-normal">Revenue</th>
            <th className="px-5 py-2 text-right font-normal">Contribution</th>
            <th className="px-5 py-2 text-right font-normal">Margin</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((c, i) => {
            const top = i === 0;
            const bottom = i === lines.length - 1 && lines.length > 1;
            return (
              <tr key={c.line} className="border-t border-charcoal-700">
                <td className="px-5 py-2.5 text-ink">
                  {c.line}
                  {top && <span className="ml-2 text-[10px] text-green-signal">best</span>}
                  {bottom && <span className="ml-2 text-[10px] text-ink/40">lowest</span>}
                </td>
                <td className="px-5 py-2.5 text-right tabular-nums text-ink/70">{fmtUSD(c.revenue)}</td>
                <td className="px-5 py-2.5 text-right tabular-nums text-ink/70">{fmtUSD(c.contribution)}</td>
                <td className={`px-5 py-2.5 text-right tabular-nums ${top ? "text-green-signal" : "text-ink"}`}>
                  {c.marginPct != null ? fmtPct(c.marginPct).replace("+", "") : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ReportSectionBlock({
  heading,
  body,
  emphasis = false,
}: {
  heading: string;
  body: string;
  emphasis?: boolean;
}) {
  return (
    <section
      className={`animate-[section-in_0.5s_ease-cinema_both] rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6 ${
        emphasis ? "ring-1 ring-gold-500/30" : ""
      }`}
    >
      <h3
        className={`font-light tracking-[-0.005em] text-ink ${
          emphasis ? "text-[24px] leading-[1.15] sm:text-[28px]" : "text-[18px]"
        }`}
      >
        {heading}
      </h3>
      <p className="mt-3 whitespace-pre-line text-[14.5px] leading-[1.7] text-ink/75">{body}</p>
    </section>
  );
}

export function MoneyRecoveryStrip({ m }: { m: MetricsSnapshot }) {
  const hasAny = m.waste.length > 0 || m.duplicates.length > 0 || m.costCreep.length > 0;
  if (!hasAny) return null;
  return (
    <div className="mt-4 space-y-3 rounded-lg border border-gold-500/30 bg-gold-300/[0.06] px-5 py-4">
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-gold-700">
        Money to recover · {fmtUSD(m.wasteAnnualTotal)}/yr identified
      </div>
      <ul className="space-y-2 text-[13.5px] text-ink/80">
        {m.waste.map((w, i) => (
          <li key={`w${i}`} className="flex items-baseline justify-between gap-4">
            <span>Dormant: <span className="text-ink">{w.merchant}</span> — no activity since {fmtDate(w.lastDate)}</span>
            <span className="shrink-0 font-[robert-medium] text-green-signal">{fmtUSD(w.annual)}/yr</span>
          </li>
        ))}
        {m.duplicates.map((d, i) => (
          <li key={`d${i}`} className="flex items-baseline justify-between gap-4">
            <span>Duplicate charge: <span className="text-ink">{d.merchant}</span> — dispute by <span className="text-ink">{fmtDate(d.disputeBy)}</span></span>
            <span className="shrink-0 font-[robert-medium] text-green-signal">{fmtUSD(d.amount)} back</span>
          </li>
        ))}
        {m.costCreep.map((c, i) => (
          <li key={`c${i}`} className="flex items-baseline justify-between gap-4">
            <span>Cost creep: <span className="text-ink">{c.merchant}</span> rose {fmtUSD(c.from)} → {fmtUSD(c.to)}</span>
            <span className="shrink-0 text-ink/50">verify</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const BUCKET_STYLE: Record<string, string> = {
  find_cash: "border-green-signal/40 text-green-signal",
  keep_more: "border-gold-700/40 text-gold-700",
  earn_new: "border-ink/25 text-ink/60",
};

export function DecisionMemo({ recs }: { recs: Recommendation[] }) {
  if (!recs.length) return null;
  return (
    <section className="animate-[section-in_0.5s_ease-cinema_both] rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <h3 className="text-[18px] font-light tracking-[-0.005em] text-ink">What to do now</h3>
      <ol className="mt-4 space-y-4">
        {recs.map((r, i) => (
          <li key={i} className="flex gap-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-[12px] text-gold-700">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[14.5px] leading-[1.6] text-ink/85">{r.text}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11.5px]">
                <span className={`rounded-full border px-2 py-0.5 uppercase tracking-[0.12em] ${BUCKET_STYLE[r.bucket] ?? BUCKET_STYLE.earn_new}`}>
                  {BUCKET_LABEL[r.bucket] ?? r.bucket}
                </span>
                {r.dollar != null && <span className="text-green-signal">{fmtUSD(r.dollar)}</span>}
                {r.deadline && <span className="text-ink/45">by {fmtDate(r.deadline)}</span>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TrustStamp({
  coverage,
  periodEnd,
  model,
}: {
  coverage: number | null;
  periodEnd: string | null;
  model: string | null;
}) {
  return (
    <footer className="mt-2 rounded-lg border border-charcoal-700 bg-charcoal-800 px-5 py-4 text-[11.5px] leading-[1.6] text-ink/50">
      Based on {coverage != null ? `${coverage}% of transactions categorized` : "your connected accounts"},
      reconciled as of {fmtDate(periodEnd)}. No figures were invented — every number comes from your bank, card,
      and connected data. Generated by GoldFin Desk{model ? ` · ${model}` : ""}. Standard terms available for your accountant.
    </footer>
  );
}

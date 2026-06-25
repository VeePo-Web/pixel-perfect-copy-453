// Cycle-7 reference reports on the marketing site — the gold-standard build
// targets, one per vertical, each leading with its make-or-break number.
// Static + illustrative (clearly labeled). Token-driven; mirrors the in-app
// IndustryKpi visual language so prospects see exactly what they'll receive.
import { useState } from "react";

type Status = "good" | "watch" | "danger";

type Ref = {
  id: string;
  vertical: string;
  business: string;
  meta: string;
  subject: string;
  lead: { label: string; value: string; status: Status; benchmark: string };
  verdict: string;
  recovered: string;
  action: string;
};

const STATUS: Record<Status, { text: string; dot: string; word: string }> = {
  good: { text: "text-green-signal", dot: "bg-green-signal", word: "On target" },
  watch: { text: "text-gold-700", dot: "bg-gold-500", word: "Watch" },
  danger: { text: "text-red-signal", dot: "bg-red-signal", word: "Past the line" },
};

const REPORTS: Ref[] = [
  {
    id: "restaurant",
    vertical: "Restaurant",
    business: "Harbor & Vine",
    meta: "Full-service · S-corp · ~$92K/mo",
    subject: "Prime cost hit 68% — above the danger line",
    lead: { label: "Prime cost", value: "68%", status: "danger", benchmark: "55–65% of sales" },
    verdict:
      "Sales were strong at $92,400 (up 6%), but prime cost hit 68% — past the line where full-service restaurants stop making money. Busy month, thinner plate.",
    recovered: "$4,560/yr in dormant tools + a $612 duplicate to dispute",
    action: "Re-bid the supplier up 11% and trim week-2/3 overtime → prime cost back under 65%.",
  },
  {
    id: "ecommerce",
    vertical: "Ecommerce",
    business: "Trailhead Goods",
    meta: "DTC · LLC sole prop · ~$140K/mo",
    subject: "You're losing money on Meta orders",
    lead: { label: "Contribution / order — Meta", value: "-$6", status: "danger", benchmark: "positive per order" },
    verdict:
      "Revenue looked great at $141,000, but blended ROAS hides that Meta orders lose $6 each after a $41 CAC. You're scaling the channel that costs you.",
    recovered: "$3,360/yr in 4 dormant app subscriptions",
    action: "Shift the Meta budget to Google + email, where LTV:CAC clears 3:1.",
  },
  {
    id: "contractor",
    vertical: "Contractor",
    business: "Granite Ridge Builders",
    meta: "S-corp · ~$210K/mo",
    subject: "You're underbilled $138K — that's why cash is tight",
    lead: { label: "Underbilled (cash trapped)", value: "$138K", status: "danger", benchmark: "underbilling = #1 cash killer" },
    verdict:
      "You're profitable, but cash is tight because you're underbilled $138,000 across active jobs. That's a billing problem, not a profit problem.",
    recovered: "$5,880/yr in dormant tools + a $740 duplicate to dispute",
    action: "Submit the Cedar Lofts draw + two underbilled jobs → recover $138K in owed cash.",
  },
];

export default function VerticalReferenceReports() {
  const [active, setActive] = useState(0);
  const r = REPORTS[active];
  const s = STATUS[r.lead.status];

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <div className="text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">
          Built for your industry
        </div>
        <h2 className="mx-auto mt-3 max-w-[28ch] font-light text-ink text-[26px] leading-[1.15] tracking-[-0.01em] sm:text-[32px]">
          Every briefing leads with your make-or-break number
        </h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-[14px] leading-[1.7] text-ink/60">
          Rising sales can hide a failing business. Your briefing reconciles revenue, profit, and cash — then
          names the one metric your industry lives or dies by.
        </p>
      </div>

      {/* Vertical selector */}
      <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Industry examples">
        {REPORTS.map((rep, i) => (
          <button
            key={rep.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-1.5 text-[12.5px] transition-colors duration-200 ease-cinema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 ${
              i === active
                ? "border-gold-500/60 bg-gold-300/[0.1] text-gold-700"
                : "border-charcoal-700 text-ink/55 hover:text-ink"
            }`}
          >
            {rep.vertical}
          </button>
        ))}
      </div>

      {/* Report card */}
      <article className="mx-auto mt-6 max-w-2xl animate-[section-in_0.5s_ease-cinema_both] rounded-2xl border border-charcoal-700 bg-paper-raised px-6 py-7 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[13px] font-[robert-medium] text-ink">{r.business}</span>
          <span className="text-[11.5px] text-ink/45">{r.meta}</span>
        </div>
        <h3 className="mt-2 font-light text-ink text-[20px] leading-[1.2] tracking-[-0.005em] sm:text-[24px]">
          {r.subject}
        </h3>

        {/* Lead KPI */}
        <div className="mt-5 rounded-xl bg-paper px-5 py-4 ring-1 ring-red-signal/20">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] text-ink/55">{r.lead.label}</span>
            <span className={`inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.12em] ${s.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
              {s.word}
            </span>
          </div>
          <div className={`mt-1 font-light tabular-nums ${s.text} text-[34px] leading-none`}>{r.lead.value}</div>
          <div className="mt-1.5 text-[11.5px] text-ink/45">Target: {r.lead.benchmark}</div>
        </div>

        <p className="mt-5 text-[14.5px] leading-[1.7] text-ink/75">{r.verdict}</p>

        <div className="mt-4 rounded-lg border border-gold-500/30 bg-gold-300/[0.06] px-4 py-3 text-[13px] text-ink/75">
          <span className="text-gold-700">Money to recover:</span> {r.recovered}
        </div>

        <div className="mt-4 flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-[12px] text-gold-700">
            1
          </span>
          <p className="text-[14px] leading-[1.6] text-ink/85">{r.action}</p>
        </div>

        <p className="mt-6 border-t border-charcoal-700 pt-3 text-[11px] leading-[1.6] text-ink/40">
          Illustrative example. In your real briefing every number is computed from your connected accounts —
          none are invented.
        </p>
      </article>
    </section>
  );
}

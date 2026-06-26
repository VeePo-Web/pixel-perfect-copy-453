// The advisory report SURFACE — renders a generated AdvisoryReport matching
// the Cycle-6 Reference Report. Server-authoritative: it renders the stored
// snapshot and never recomputes financials.
import { useAdvisoryReport } from "@/lib/report/useAdvisoryReport";
import { ReportSectionBlock, MoneyRecoveryStrip, ContributionByLine, DecisionMemo, TrustStamp, IndustryKpi, GrowthGate } from "./ReportBlocks";
import TemplateDownloadCard from "./TemplateDownloadCard";
import { fmtDate } from "@/lib/report/format";

export default function AdvisoryReportView() {
  const { report, loading, generating, error, generate, markRecommendation } = useAdvisoryReport();

  if (loading) return <ReportSkeleton />;

  if (!report) {
    return (
      <EmptyState onGenerate={generate} generating={generating} error={error} />
    );
  }

  const sections = report.narrative ?? [];
  const m = report.metrics_snapshot;
  const failed = report.verification_passed === false;

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      {/* Subject line / eyebrow */}
      <div className="mb-2 text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">
        Bi-Weekly Advisory · {report.period_start ? `${fmtDate(report.period_start)} – ` : ""}
        {fmtDate(report.period_end)}
      </div>
      {report.subject_line && (
        <h1 className="mb-8 font-light text-ink text-[26px] leading-[1.15] tracking-[-0.01em] sm:text-[32px]">
          {report.subject_line}
        </h1>
      )}

      {failed && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-gold-700/40 bg-gold-300/[0.08] px-5 py-3 text-[13px] text-ink/70"
        >
          This report is held for review — an automated check flagged a figure that did not tie to your source
          data, so it was not sent. We never show numbers we can't verify against your accounts.
        </div>
      )}

      <div className="space-y-5">
        {sections.map((s, i) => (
          <div key={s.key + i}>
            <ReportSectionBlock heading={s.heading} body={s.body} emphasis={s.key === "verdict"} />
            {/* Lead with the vertical make-or-break metric right after the verdict. */}
            {s.key === "verdict" && m && <IndustryKpi pack={m.industry} />}
            {s.key === "making_money" && m && <ContributionByLine m={m} />}
            {s.key === "leaking" && m && <MoneyRecoveryStrip m={m} />}
            {s.key === "grow" && m && <GrowthGate growth={m.growth} />}
          </div>
        ))}

        {report.recommendations && (
          <DecisionMemo
            recs={report.recommendations}
            onMark={(i, acted, outcome) => void markRecommendation(report.id, i, acted, outcome)}
          />
        )}

        <TrustStamp coverage={report.coverage_pct} periodEnd={report.period_end} model={report.model} />

        {m && !failed && <TemplateDownloadCard m={m} periodEnd={report.period_end} />}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => void generate()}
          disabled={generating}
          className="rounded-full border border-gold-500/50 px-5 py-2 text-[13px] text-gold-700 transition-colors duration-200 ease-cinema hover:bg-gold-300/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 disabled:opacity-50"
        >
          {generating ? "Generating…" : "Generate latest report"}
        </button>
        {error && <span className="text-[12px] text-ink/45">{error}</span>}
      </div>
    </article>
  );
}

function ReportSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="h-3 w-40 rounded bg-charcoal-700" />
      <div className="mt-4 h-8 w-3/4 rounded bg-charcoal-700" />
      <div className="mt-8 space-y-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
            <div className="h-4 w-44 rounded bg-charcoal-700" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-charcoal-800" />
              <div className="h-3 w-5/6 rounded bg-charcoal-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  onGenerate,
  generating,
  error,
}: {
  onGenerate: () => void;
  generating: boolean;
  error: string | null;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">Your advisory desk</div>
      <h1 className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em]">
        No report yet
      </h1>
      <p className="mx-auto mt-3 max-w-[46ch] text-[14px] leading-[1.7] text-ink/60">
        Connect a bank or card account and sync your transactions, then generate your first grounded bi-weekly
        briefing — every number tied to your real data.
      </p>
      <button
        type="button"
        onClick={() => void onGenerate()}
        disabled={generating}
        className="mt-7 rounded-full bg-ink px-6 py-2.5 text-[13.5px] text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 disabled:opacity-50"
      >
        {generating ? "Generating…" : "Generate my first report"}
      </button>
      {error && <p className="mt-4 text-[12px] text-ink/45">{error}</p>}
    </div>
  );
}

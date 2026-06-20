import type { DemoBusiness } from "../content";
import StickyReportNav from "./StickyReportNav";
import ExecutiveSummaryCard from "./ExecutiveSummaryCard";
import CashMovementModule from "./CashMovementModule";
import RevenueTrendModule from "./RevenueTrendModule";
import ExpensePatternModule from "./ExpensePatternModule";
import UnusualSpendModule from "./UnusualSpendModule";
import QuestionsToReviewModule from "./QuestionsToReviewModule";
import DecisionsToConsiderModule from "./DecisionsToConsiderModule";
import MonthlyStrategyFocus from "./MonthlyStrategyFocus";

type Props = { business: DemoBusiness; visible: boolean };

export default function BriefingReportShell({ business, visible }: Props) {
  return (
    <section
      id="briefing-report"
      aria-hidden={!visible}
      className={`relative border-b border-ink/[0.05] bg-charcoal-950 transition-opacity duration-700 ease-cinema ${
        visible ? "opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0"
      }`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_30%_0%,rgba(63,122,94,0.08),transparent_60%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-ink/[0.06] pb-8">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
              Sample Bi-Weekly Finance Briefing
            </div>
            <h2 className="mt-3 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[42px]">
              {business.reportTitle}
            </h2>
            <p className="mt-2 text-[13px] text-ink/55">
              {business.period} · Demo Data
            </p>
          </div>
          <p className="max-w-[42ch] text-[12px] leading-[1.6] text-ink/45">
            This is a sample briefing using demo numbers. Your real briefing would be based on your onboarded financial system. Not financial, tax, legal, or investment advice.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
          <StickyReportNav active={visible} />
          <div className="space-y-6">
            <ExecutiveSummaryCard business={business} />
            <CashMovementModule business={business} />
            <RevenueTrendModule business={business} />
            <ExpensePatternModule business={business} />
            <UnusualSpendModule business={business} />
            <QuestionsToReviewModule business={business} />
            <DecisionsToConsiderModule business={business} />
            <MonthlyStrategyFocus business={business} />
          </div>
        </div>
      </div>
    </section>
  );
}

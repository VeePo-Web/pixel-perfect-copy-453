// Review & correct categories — the owner-facing half of the self-training
// categorizer (Layer 0). A correction is merchant-keyed: it persists to
// transaction_corrections AND back-fills every transaction from that merchant
// (plaid-correct-transaction), so the fix is retroactive and every future sync
// inherits it. Merchants are grouped, lowest-confidence first.
import { useState } from "react";
import { useTransactionReview, type MerchantGroup } from "@/lib/report/useTransactionReview";
import { fmtUSD, fmtDate } from "@/lib/report/format";

// Suggestions mirror the deterministic enrichment categories (report-enrich.ts)
// plus the common owner buckets. Free text is allowed — this is a datalist.
const CATEGORY_OPTIONS = [
  "Software & Subscriptions", "Cloud & Hosting", "Payment Processing Fees",
  "Payroll & Benefits", "Utilities & Telecom", "Travel", "Advertising",
  "Food", "Beverage", "Labor", "COGS", "Shipping & Fulfillment",
  "Office & Supplies", "Rent", "Insurance", "Professional Services",
  "Equipment", "Meals & Entertainment", "Taxes & Fees", "Other",
];

function ConfidenceTag({ g }: { g: MerchantGroup }) {
  if (g.ownerCorrected) return <span className="text-[10.5px] uppercase tracking-[0.12em] text-champagne-300">Yours</span>;
  const c = g.minConfidence;
  const s = c >= 0.8
    ? { t: "text-green-signal", w: "High" }
    : c >= 0.6
      ? { t: "text-gold-700", w: "Medium" }
      : { t: "text-red-signal", w: g.category ? "Low" : "Uncategorized" };
  return <span className={`text-[10.5px] uppercase tracking-[0.12em] ${s.t}`}>{s.w}</span>;
}

function ReviewRow({
  g, busy, onApply,
}: { g: MerchantGroup; busy: boolean; onApply: (cat: string) => void }) {
  const [val, setVal] = useState(g.category ?? "");
  const changed = val.trim() !== "" && val.trim() !== (g.category ?? "");
  return (
    <div className="grid grid-cols-12 items-center gap-2 border-t border-charcoal-700 px-1 py-3">
      <div className="col-span-12 sm:col-span-5">
        <div className="flex items-baseline gap-2">
          <span className="text-[13.5px] text-ink">{g.merchant}</span>
          <ConfidenceTag g={g} />
        </div>
        <div className="text-[11.5px] text-ink/45">
          {g.count} charge{g.count === 1 ? "" : "s"} · {fmtUSD(g.total)} · last {fmtDate(g.lastDate)}
        </div>
      </div>
      <div className="col-span-9 sm:col-span-5">
        <input
          type="text" list="goldfin-categories" value={val}
          onChange={(e) => setVal(e.target.value)} placeholder="Set a category"
          className="w-full rounded-lg border border-charcoal-700 bg-paper px-3 py-1.5 text-[13px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
        />
      </div>
      <div className="col-span-3 sm:col-span-2 text-right">
        <button
          type="button" disabled={!changed || busy} onClick={() => onApply(val.trim())}
          className="rounded-full border border-gold-500/50 px-3 py-1.5 text-[12px] text-gold-700 transition-colors duration-200 ease-cinema hover:bg-gold-300/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 disabled:opacity-40"
        >
          {busy ? "…" : "Apply"}
        </button>
      </div>
    </div>
  );
}

export default function TransactionReviewCard() {
  const { groups, needsReview, loading, busy, msg, error, correct } = useTransactionReview();
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl border border-charcoal-700 bg-paper-raised" />;
  }
  if (groups.length === 0) {
    return (
      <section className="rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
        <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/80">Categorization</div>
        <h3 className="mt-2 text-[18px] font-light text-ink">Nothing to review yet</h3>
        <p className="mt-1 text-[13px] leading-[1.6] text-ink/55">
          Sync your transactions and any low-confidence categories will surface here to confirm or fix.
        </p>
      </section>
    );
  }

  const list = showAll ? groups : needsReview;

  return (
    <section className="rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <datalist id="goldfin-categories">
        {CATEGORY_OPTIONS.map((o) => <option key={o} value={o} />)}
      </datalist>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/80">Categorization</div>
          <h3 className="mt-2 text-[18px] font-light text-ink">Confirm what we couldn't be sure about</h3>
          <p className="mt-1 max-w-[58ch] text-[13px] leading-[1.6] text-ink/55">
            Fix a merchant once and it sticks — every past and future charge from it updates automatically. Accurate
            categories are what keep your numbers trustworthy.
          </p>
        </div>
        <button
          type="button" onClick={() => setShowAll((s) => !s)}
          className="rounded-full border border-charcoal-700 px-3 py-1.5 text-[12px] text-ink/65 transition-colors duration-200 ease-cinema hover:bg-charcoal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
        >
          {showAll ? `Needs review (${needsReview.length})` : `Show all (${groups.length})`}
        </button>
      </div>

      {list.length === 0 ? (
        <p className="mt-5 text-[13px] text-green-signal">All caught up — every merchant is confidently categorized.</p>
      ) : (
        <div className="mt-4">
          {list.slice(0, 40).map((g) => (
            <ReviewRow key={g.merchant} g={g} busy={busy === g.merchant} onApply={(cat) => void correct(g.merchant, cat)} />
          ))}
          {list.length > 40 && (
            <p className="mt-3 px-1 text-[11.5px] text-ink/40">Showing the 40 lowest-confidence merchants.</p>
          )}
        </div>
      )}

      {msg && <p className="mt-4 text-[12.5px] text-green-signal">{msg}</p>}
      {error && <p className="mt-4 text-[12.5px] text-ink/45">{error}</p>}
    </section>
  );
}

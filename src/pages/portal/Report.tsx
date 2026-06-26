import { useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import ProtectedRoute from "../../components/portal/ProtectedRoute";
import BusinessProfileCard from "../../components/report/BusinessProfileCard";
import TemplateImportCard from "../../components/report/TemplateImportCard";
import MetricInputsCard from "../../components/report/MetricInputsCard";
import TransactionReviewCard from "../../components/report/TransactionReviewCard";
import AdvisoryReportView from "../../components/report/AdvisoryReportView";
import { supabase } from "../../integrations/supabase/client";

export default function Report() {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  // True when a sync found no connected institutions — never dead-end the
  // owner; route them to connect (instant-first-value, teardown §2.6).
  const [needsConnect, setNeedsConnect] = useState(false);

  async function syncTransactions() {
    setSyncing(true);
    setSyncMsg(null);
    setNeedsConnect(false);
    const { data: items } = await supabase.from("plaid_items").select("id");
    if (!items?.length) {
      setNeedsConnect(true);
      setSyncMsg("Connect your bank to build your report — it takes about a minute.");
      setSyncing(false);
      return;
    }
    // Progressive feedback: the owner sees work happening, not a silent wait.
    setSyncMsg(`Pulling your latest transactions from ${items.length} connected ${items.length === 1 ? "account" : "accounts"}…`);
    let added = 0;
    for (const it of items) {
      const { data, error } = await supabase.functions.invoke("plaid-sync-transactions", {
        body: { itemId: it.id },
      });
      if (!error && data && typeof data === "object" && "added" in data) {
        added += Number((data as { added: number }).added) || 0;
      }
    }
    setSyncMsg(
      added > 0
        ? `Pulled ${added} new transaction${added === 1 ? "" : "s"} — your report below reflects the latest data.`
        : "You're up to date — no new transactions since your last sync.",
    );
    setSyncing(false);
  }

  return (
    <ProtectedRoute>
      <PortalLayout active="/portal/report">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-medium text-ink">Advisory report</h1>
            <p className="mt-2 max-w-[52ch] text-[14px] text-ink/60">
              Your grounded bi-weekly briefing — every number tied to your real bank and card data, never invented.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void syncTransactions()}
            disabled={syncing}
            className="rounded-full border border-charcoal-700 px-4 py-2 text-[12.5px] text-ink/70 transition-colors duration-200 ease-cinema hover:bg-charcoal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 disabled:opacity-50"
          >
            {syncing ? "Syncing…" : "Sync transactions"}
          </button>
        </div>
        {syncMsg && (
          <p className="mt-2 text-[12.5px] text-ink/50">
            {syncMsg}
            {needsConnect && (
              <>
                {" "}
                <a
                  href="/portal/accounts"
                  className="text-gold-700 underline-offset-2 transition-colors duration-200 ease-cinema hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
                >
                  Connect my bank →
                </a>
              </>
            )}
          </p>
        )}

        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <BusinessProfileCard />
            <TemplateImportCard />
          </div>
          <MetricInputsCard />
          <TransactionReviewCard />
          <AdvisoryReportView />
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}

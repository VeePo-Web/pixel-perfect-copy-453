import { useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import ProtectedRoute from "../../components/portal/ProtectedRoute";
import BusinessProfileCard from "../../components/report/BusinessProfileCard";
import TemplateImportCard from "../../components/report/TemplateImportCard";
import AdvisoryReportView from "../../components/report/AdvisoryReportView";
import { supabase } from "../../integrations/supabase/client";

export default function Report() {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  async function syncTransactions() {
    setSyncing(true);
    setSyncMsg(null);
    const { data: items } = await supabase.from("plaid_items").select("id");
    if (!items?.length) {
      setSyncMsg("Connect a bank or card first to sync transactions.");
      setSyncing(false);
      return;
    }
    let added = 0;
    for (const it of items) {
      const { data, error } = await supabase.functions.invoke("plaid-sync-transactions", {
        body: { itemId: it.id },
      });
      if (!error && data && typeof data === "object" && "added" in data) {
        added += Number((data as { added: number }).added) || 0;
      }
    }
    setSyncMsg(`Synced. ${added} new transactions.`);
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
        {syncMsg && <p className="mt-2 text-[12.5px] text-ink/50">{syncMsg}</p>}

        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <BusinessProfileCard />
            <TemplateImportCard />
          </div>
          <AdvisoryReportView />
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}

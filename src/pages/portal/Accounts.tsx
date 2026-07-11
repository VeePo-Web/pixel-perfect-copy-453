import { useCallback, useEffect, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import ProtectedRoute from "../../components/portal/ProtectedRoute";
import AccountCard, { type ItemWithAccounts } from "../../components/portal/AccountCard";
import PlaidLinkButton from "../../components/portal/PlaidLinkButton";
import { supabase } from "../../integrations/supabase/client";

export default function Accounts() {
  const [items, setItems] = useState<ItemWithAccounts[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: itemRows } = await supabase
      .from("plaid_items")
      .select("id, institution_name, status, last_synced_at")
      .order("created_at", { ascending: false });
    const { data: accRows } = await supabase
      .from("plaid_accounts")
      .select("id, name, mask, type, subtype, current_balance, iso_currency_code, plaid_item_id");
    setItems(
      (itemRows ?? []).map((it) => ({
        ...it,
        accounts: (accRows ?? []).filter((a) => a.plaid_item_id === it.id),
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ProtectedRoute>
      <PortalLayout active="/portal/accounts">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-medium tracking-[-0.01em] text-ink">Connected accounts</h1>
            <p className="mt-2 text-[14px] text-ink/55">
              Each institution is authorized separately through Plaid. We never see your bank
              credentials.
            </p>
          </div>
          <PlaidLinkButton onConnected={load} label="Add another bank" />
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-[13px] text-ink/55">Loading…</p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/[0.12] bg-white p-10 text-center">
              {/* Payoff above the ask: the owner connects after the value is concrete,
                  not before — the highest-leverage conversion lever in the connect flow
                  (docs/research/2026-06-25-plaid-competitor-teardown.md §2.1). */}
              <h2 className="text-[20px] font-medium tracking-[-0.01em] text-ink">Connect your bank to build your first report</h2>
              <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-[1.6] text-ink/65">
                We read your transactions, categorize them automatically, and turn them into a
                plain-English report in minutes. The more accounts you connect, the more complete
                your numbers.
              </p>
              <div className="mt-5 inline-block">
                <PlaidLinkButton onConnected={load} label="Connect my bank & build my report" />
              </div>
              {/* Trust reducer at the exact moment of hesitation — the connect CTA (§2.2). */}
              <p className="mt-4 text-[12px] text-ink/45">
                Read-only · We never see your login · Bank-level encryption · We never move money · Powered by Plaid
              </p>
            </div>
          ) : (
            items.map((it) => <AccountCard key={it.id} item={it} onChange={load} />)
          )}
        </div>
      </PortalLayout>
    </ProtectedRoute>
  );
}

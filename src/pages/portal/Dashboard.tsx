import { useEffect, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import ProtectedRoute from "../../components/portal/ProtectedRoute";
import ActivationChecklist from "../../components/portal/ActivationChecklist";
import { supabase } from "../../integrations/supabase/client";

export default function Dashboard() {
  const [accountCount, setAccountCount] = useState<number | null>(null);
  const [netCash, setNetCash] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("plaid_accounts")
        .select("current_balance, type");
      const rows = data ?? [];
      setAccountCount(rows.length);
      setNetCash(
        rows
          .filter((r) => r.type === "depository")
          .reduce((s, r) => s + Number(r.current_balance || 0), 0),
      );
    })();
  }, []);

  return (
    <ProtectedRoute>
      <PortalLayout active="/portal">
        <h1 className="text-[28px] font-medium text-ink">Welcome back.</h1>
        <p className="mt-2 text-[14px] text-ink/60">
          Your cash position, refreshed read-only from your bank via Plaid.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 bg-paper p-6">
            <p className="text-[11px] uppercase tracking-wider text-ink/45">Net cash</p>
            <p className="mt-2 text-[28px] font-medium tabular-nums text-ink">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(netCash)}
            </p>
            <p className="mt-1 text-[12px] text-ink/50">Sum of depository balances.</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-paper p-6">
            <p className="text-[11px] uppercase tracking-wider text-ink/45">Connected accounts</p>
            <p className="mt-2 text-[28px] font-medium tabular-nums text-ink">
              {accountCount ?? "—"}
            </p>
            <a
              href="/portal/accounts"
              className="mt-1 inline-block text-[12.5px] text-ink underline underline-offset-4"
            >
              Manage →
            </a>
          </div>
        </div>

        {accountCount === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-ink/15 p-8 text-center">
            <p className="text-[14px] text-ink/70">
              You haven't connected a bank yet. GoldFin starts working the moment you do.
            </p>
            <a
              href="/portal/accounts"
              className="mt-4 inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5"
            >
              Connect my bank &amp; build my report
            </a>
          </div>
        )}

        {/* Connected → guide the owner through connect → sync → report, the
            highest-leverage activation path. The report is what the $99/mo buys. */}
        {accountCount != null && accountCount > 0 && (
          <ActivationChecklist accountCount={accountCount} />
        )}
      </PortalLayout>
    </ProtectedRoute>
  );
}

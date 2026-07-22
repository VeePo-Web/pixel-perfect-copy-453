import { useEffect, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import ProtectedRoute from "../../components/portal/ProtectedRoute";
import ActivationChecklist from "../../components/portal/ActivationChecklist";
import FounderTestPanel from "../../components/portal/FounderTestPanel";
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
        <h1 className="text-[28px] font-medium tracking-[-0.01em] text-ink">Welcome back.</h1>
        <p className="mt-2 text-[14px] text-ink/55">
          Your cash position, refreshed read-only from your bank via Plaid.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
            <p className="font-general text-[10.5px] uppercase tracking-[0.2em] text-ink/45">Net cash</p>
            <p className="mt-2 font-general text-[26px] tabular-nums tracking-[-0.01em] text-ink">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(netCash)}
            </p>
            <p className="mt-1 text-[12px] text-ink/50">Sum of depository balances.</p>
          </div>
          <div className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
            <p className="font-general text-[10.5px] uppercase tracking-[0.2em] text-ink/45">Connected accounts</p>
            <p className="mt-2 font-general text-[26px] tabular-nums tracking-[-0.01em] text-ink">
              {accountCount ?? "—"}
            </p>
            <a
              href="/portal/accounts"
              className="mt-1 inline-block text-[12.5px] text-ink/70 underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              Manage →
            </a>
          </div>
        </div>

        {accountCount === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-ink/[0.12] bg-white p-8 text-center">
            <p className="text-[14px] text-ink/70">
              You haven't connected a bank yet. GoldFin starts working the moment you do.
            </p>
            <a
              href="/portal/accounts"
              className="mt-4 inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-white transition-all duration-200 ease-cinema hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0 active:scale-[0.98]"
            >
              Connect my bank &amp; build my report
            </a>
          </div>
        )}

        {/* Connected → guide the owner through connect → sync → report, the
            highest-leverage activation path. The report is what the $150/mo buys. */}
        {accountCount != null && accountCount > 0 && (
          <ActivationChecklist accountCount={accountCount} />
        )}

        <FounderTestPanel />
      </PortalLayout>
    </ProtectedRoute>
  );
}

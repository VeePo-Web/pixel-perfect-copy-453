import { useEffect, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import ProtectedRoute from "../../components/portal/ProtectedRoute";
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

        {/* Connected → route straight to the product. The advisory report is
            what the $99/mo buys; the home screen must hand the owner to it. */}
        {accountCount != null && accountCount > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-paper p-6">
            <div>
              <p className="text-[15px] font-medium text-ink">Your advisory report is ready when you are</p>
              <p className="mt-1 max-w-[52ch] text-[13px] leading-[1.6] text-ink/60">
                We turn your connected transactions into a plain-English, grounded briefing — every number tied to
                your real data.
              </p>
            </div>
            <a
              href="/portal/report"
              className="inline-block shrink-0 rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
            >
              See my advisory report &rarr;
            </a>
          </div>
        )}
      </PortalLayout>
    </ProtectedRoute>
  );
}

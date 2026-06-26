import { useEffect, useState } from "react";
import PortalLayout from "../../../components/portal/PortalLayout";
import ProtectedRoute from "../../../components/portal/ProtectedRoute";
import { supabase } from "../../../integrations/supabase/client";
import { useAuth } from "../../../contexts/AuthContext";
import { RETENTION_POLICY_VERSION } from "../../../lib/portal/tos";

type Row = {
  user_id: string;
  email: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  providers: string[] | null;
  plaid_item_count: number;
  plaid_status: string | null;
  plaid_account_count: number;
  sub_plan: string | null;
  sub_status: string | null;
  sub_period_end: string | null;
  last_report_at: string | null;
  last_report_status: string | null;
  last_webhook_source: string | null;
  last_webhook_type: string | null;
  last_webhook_at: string | null;
};

type CronRun = {
  started_at: string;
  finished_at: string | null;
  candidates: number;
  generated: number;
  sent: number;
  skipped: number;
  failed: number;
};


const since = (s: string | null) => {
  if (!s) return "—";
  const d = (Date.now() - new Date(s).getTime()) / 86_400_000;
  if (d < 1) return `${Math.round(d * 24)}h ago`;
  return `${Math.round(d)}d ago`;
};

function Pill({ tone, children }: { tone: "ok" | "warn" | "bad" | "muted"; children: React.ReactNode }) {
  const map = {
    ok: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-amber-50 text-amber-800 ring-amber-200",
    bad: "bg-red-50 text-red-700 ring-red-200",
    muted: "bg-ink/5 text-ink/55 ring-ink/10",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${map[tone]}`}>
      {children}
    </span>
  );
}

export default function Audit() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [run, setRun] = useState<CronRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [running, setRunning] = useState(false);
  const [lastTriggerMsg, setLastTriggerMsg] = useState<string | null>(null);
  const [lastReview, setLastReview] = useState<{ reviewed_at: string; policy_version: string } | null>(null);
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const [{ data, error: e1 }, { data: cronRows }, { data: rev }] = await Promise.all([
      supabase.rpc("admin_audit_overview"),
      supabase.from("cron_runs").select("started_at, finished_at, candidates, generated, sent, skipped, failed")
        .order("started_at", { ascending: false }).limit(1),
      supabase.from("retention_policy_reviews").select("reviewed_at, policy_version")
        .order("reviewed_at", { ascending: false }).limit(1),
    ]);
    if (e1) { setError(e1.message); return; }
    setRows((data as Row[]) ?? []);
    setRun((cronRows?.[0] as CronRun) ?? null);
    setLastReview((rev?.[0] as { reviewed_at: string; policy_version: string }) ?? null);
  };

  useEffect(() => { load(); }, []);

  const recordReview = async () => {
    if (!user) return;
    setReviewMsg(null);
    const { error } = await supabase.from("retention_policy_reviews").insert({
      policy_version: RETENTION_POLICY_VERSION,
      reviewer_user_id: user.id,
      notes: "Quarterly review recorded from admin dashboard.",
    });
    setReviewMsg(error ? `Error: ${error.message}` : "Review recorded.");
    load();
  };

  const triggerCron = async () => {
    setRunning(true); setLastTriggerMsg(null);
    const { data, error: e } = await supabase.functions.invoke("admin-trigger-cron", { body: {} });
    setRunning(false);
    setLastTriggerMsg(e ? `Error: ${e.message}` : `Run complete — ${JSON.stringify((data as any)?.body ?? data)}`);
    load();
  };

  const filtered = (rows ?? []).filter((r) =>
    !query || (r.email ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const summary = {
    total: rows?.length ?? 0,
    withBank: rows?.filter((r) => r.plaid_item_count > 0).length ?? 0,
    paying: rows?.filter((r) => r.sub_status === "active" || r.sub_status === "trialing").length ?? 0,
    reported14d: rows?.filter((r) => r.last_report_at && (Date.now() - new Date(r.last_report_at).getTime()) < 14 * 86_400_000).length ?? 0,
  };

  return (
    <ProtectedRoute>
      <PortalLayout active="/portal/settings">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-medium text-ink">Audit dashboard</h1>
          <button
            onClick={triggerCron}
            disabled={running}
            className="rounded-full bg-ink px-5 py-2 text-[12.5px] font-medium text-paper disabled:opacity-50"
          >
            {running ? "Running…" : "Run cron now"}
          </button>
        </div>
        {lastTriggerMsg && <p className="mt-2 text-[12px] text-ink/65">{lastTriggerMsg}</p>}
        {error && <p className="mt-2 text-[12px] text-red-600">{error} — you may not be an admin.</p>}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          <Stat label="Users" value={summary.total} />
          <Stat label="With bank" value={`${summary.withBank}/${summary.total}`} />
          <Stat label="Paying" value={`${summary.paying}/${summary.total}`} />
          <Stat label="Reported <14d" value={`${summary.reported14d}/${summary.total}`} />
          <Stat label="Last cron" value={run ? since(run.started_at) : "never"}
            sub={run ? `g${run.generated} s${run.sent} sk${run.skipped} f${run.failed}` : undefined} />
        </div>

        <div className="mt-6 flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by email…"
            className="w-72 rounded-lg border border-ink/15 px-3 py-2 text-[13px]"
          />
          <button onClick={load} className="rounded-full border border-ink/15 px-4 py-2 text-[12.5px] text-ink/75">
            Refresh
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-paper">
          <table className="min-w-full text-[12.5px]">
            <thead className="bg-ink/[0.03] text-left text-[11px] uppercase tracking-wide text-ink/55">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Sign-in</th>
                <th className="px-3 py-2">Provider</th>
                <th className="px-3 py-2">Plaid</th>
                <th className="px-3 py-2">Stripe</th>
                <th className="px-3 py-2">Last report</th>
                <th className="px-3 py-2">Last webhook</th>
              </tr>
            </thead>
            <tbody>
              {rows === null && (
                <tr><td colSpan={7} className="px-3 py-6 text-center text-ink/55">Loading…</td></tr>
              )}
              {rows && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-6 text-center text-ink/55">No users.</td></tr>
              )}
              {filtered.map((r) => (
                <tr key={r.user_id} className="border-t border-ink/5">
                  <td className="px-3 py-2">
                    <div className="text-ink">{r.email ?? "—"}</div>
                    <div className="text-[11px] text-ink/45">joined {since(r.created_at)}</div>
                  </td>
                  <td className="px-3 py-2">
                    {r.last_sign_in_at
                      ? <Pill tone="ok">{since(r.last_sign_in_at)}</Pill>
                      : <Pill tone="warn">never</Pill>}
                  </td>
                  <td className="px-3 py-2 text-ink/70">{(r.providers ?? []).join(", ") || "—"}</td>
                  <td className="px-3 py-2">
                    {r.plaid_item_count === 0
                      ? <Pill tone="muted">none</Pill>
                      : r.plaid_status === "active"
                        ? <Pill tone="ok">{r.plaid_account_count} acct</Pill>
                        : <Pill tone="bad">{r.plaid_status ?? "?"}</Pill>}
                  </td>
                  <td className="px-3 py-2">
                    {!r.sub_status
                      ? <Pill tone="muted">none</Pill>
                      : r.sub_status === "active" || r.sub_status === "trialing"
                        ? <Pill tone="ok">{r.sub_plan ?? r.sub_status}</Pill>
                        : <Pill tone="warn">{r.sub_status}</Pill>}
                  </td>
                  <td className="px-3 py-2">
                    {!r.last_report_at
                      ? <Pill tone="muted">never</Pill>
                      : (Date.now() - new Date(r.last_report_at).getTime()) < 14 * 86_400_000
                        ? <Pill tone="ok">{since(r.last_report_at)}</Pill>
                        : <Pill tone="warn">{since(r.last_report_at)}</Pill>}
                  </td>
                  <td className="px-3 py-2">
                    {!r.last_webhook_at
                      ? <Pill tone="muted">—</Pill>
                      : <div>
                          <Pill tone="ok">{r.last_webhook_source}</Pill>
                          <div className="mt-0.5 text-[11px] text-ink/55">{r.last_webhook_type} · {since(r.last_webhook_at)}</div>
                        </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[11px] text-ink/45">
          Sign-in = Google OAuth or 6-digit email code (via Resend). Plaid = bank link status.
          Stripe = latest subscription. Reports auto-generate every 13 days via pg_cron.
        </p>
      </PortalLayout>
    </ProtectedRoute>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-4">
      <div className="text-[11px] uppercase tracking-wide text-ink/55">{label}</div>
      <div className="mt-1 text-[20px] font-medium text-ink">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-ink/45">{sub}</div>}
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";

type Result = { label: string; ok: boolean; body: unknown } | null;

export default function FounderTestPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      const uid = user.user?.id;
      if (!uid) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  const invoke = async (label: string, fn: () => Promise<{ data: unknown; error: unknown }>) => {
    setBusy(label);
    setResult(null);
    try {
      const { data, error } = await fn();
      setResult({ label, ok: !error, body: error ?? data });
    } catch (e) {
      setResult({ label, ok: false, body: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(null);
    }
  };

  const connectSandbox = () =>
    invoke("Connect sandbox bank", async () => {
      const pub = await supabase.functions.invoke("plaid-sandbox-public-token", { body: {} });
      if (pub.error) return pub;
      const publicToken = (pub.data as { publicToken?: string })?.publicToken;
      if (!publicToken) return { data: null, error: "no publicToken returned" };
      return await supabase.functions.invoke("plaid-exchange-public-token", {
        body: { publicToken, institution: { institution_id: "ins_109508", name: "First Platypus Bank" } },
      });
    });

  const syncNow = () =>
    invoke("Sync accounts + transactions", async () => {
      const a = await supabase.functions.invoke("plaid-sync-accounts", { body: {} });
      if (a.error) return a;
      const t = await supabase.functions.invoke("plaid-sync-transactions", { body: {} });
      return t;
    });

  const generateReport = () =>
    invoke("Generate advisory report", async () =>
      supabase.functions.invoke("generate-advisory-report", { body: { send: true } }),
    );

  if (!isAdmin) return null;

  return (
    <section className="mt-10 rounded-2xl border border-champagne-300/40 bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-champagne-300/50 bg-champagne-50 px-2 py-0.5 font-general text-[10px] uppercase tracking-[0.22em] text-champagne-700">
          Founder
        </span>
        <h2 className="font-general text-[15px] tracking-[-0.005em] text-ink">One-click end-to-end test</h2>
      </div>
      <p className="mt-2 text-[13px] leading-[1.6] text-ink/60">
        Admin-only. Runs the full pipeline using Plaid sandbox (First Platypus Bank) — bypasses Stripe via the
        <code className="mx-1 rounded bg-ink/[0.05] px-1 py-0.5 text-[11.5px]">ADVISORY_TEST_EMAILS</code>
        allowlist. Panel disappears once <code>PLAID_ENV</code> flips to production.
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <TestButton onClick={connectSandbox} disabled={!!busy} label="1. Connect sandbox bank" busy={busy === "Connect sandbox bank"} />
        <TestButton onClick={syncNow} disabled={!!busy} label="2. Sync now" busy={busy === "Sync accounts + transactions"} />
        <TestButton onClick={generateReport} disabled={!!busy} label="3. Generate report + email" busy={busy === "Generate advisory report"} />
      </div>

      {result && (
        <div className="mt-5 rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-4">
          <div className="flex items-center gap-2 font-general text-[11px] uppercase tracking-[0.22em] text-ink/60">
            <span className={`h-2 w-2 rounded-full ${result.ok ? "bg-green-signal" : "bg-red-signal"}`} />
            {result.label} — {result.ok ? "ok" : "error"}
          </div>
          <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-[11.5px] leading-[1.55] text-ink/75">
            {JSON.stringify(result.body, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}

function TestButton({
  onClick, disabled, label, busy,
}: { onClick: () => void; disabled: boolean; label: string; busy: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-ink/[0.12] bg-white px-4 py-2 text-[12.5px] font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-ink"
    >
      {busy ? "Running…" : label}
    </button>
  );
}

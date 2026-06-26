const PLAID_OPS_VERSION = "2026-06-26.1";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-[18px] font-medium text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[14px] leading-[1.75] text-ink/75">{children}</p>
);
const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="mt-1.5 text-[14px] leading-[1.7] text-ink/75">{children}</li>
);

const ENVS = [
  { env: "Sandbox", host: "sandbox.plaid.com", secret: "PLAID_SANDBOX_SECRET" },
  { env: "Production", host: "production.plaid.com", secret: "PLAID_PRODUCTION_SECRET" },
  { env: "Shared", host: "—", secret: "PLAID_CLIENT_ID, PLAID_WEBHOOK_SECRET" },
];

const MATURITY = [
  { lvl: "1", name: "Initial", def: "Ad hoc; controls undocumented." },
  { lvl: "2", name: "Repeatable", def: "Controls documented; performed by specific people." },
  { lvl: "3", name: "Defined", def: "Controls codified, automated where possible, reviewed quarterly." },
  { lvl: "4", name: "Managed", def: "Metrics collected; control effectiveness measured." },
  { lvl: "5", name: "Optimizing", def: "Continuous improvement loop with measured outcomes." },
];

export default function PlaidOperations() {
  return (
    <main className="min-h-screen bg-paper">
      <article className="mx-auto max-w-2xl px-6 py-16 text-ink">
        <a href="/" className="text-[12.5px] text-ink/55 hover:text-ink">
          ← Back to GoldFin Desk
        </a>

        <h1 className="mt-6 font-zentry text-[36px] leading-[1.1] tracking-[-0.01em]">
          Plaid Integration Operations &amp; Maturity Policy
        </h1>
        <p className="mt-3 text-[12.5px] text-ink/55">
          Version {PLAID_OPS_VERSION} · Owner: Chris Sam, Founder · Reviewed quarterly by
          the founder and engineering lead.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/downloads/goldfin-plaid-operations-policy.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink px-4 py-2 text-[12.5px] font-medium text-paper hover:bg-ink/90"
          >
            Download PDF
          </a>
          <a
            href="/data-retention"
            className="text-[12.5px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            See related: Data Retention &amp; Deletion Policy →
          </a>
        </div>

        <H2>1. Purpose</H2>
        <P>
          This document defines how GoldFin Desk integrates with Plaid, how it protects
          end-user financial data obtained through Plaid, and how the program is continuously
          matured. It exists to satisfy Plaid's End User Services Agreement (EUSA) and End
          User Data Processing Addendum (EUDPA), the storage-limitation, integrity, and
          confidentiality principles of GDPR Art. 5, CCPA/CPRA security and deletion
          obligations, Canada's PIPEDA Principles 4.5 and 4.7, and SOC 2 Trust Services
          Criteria CC6/CC7/CC8.
        </P>

        <H2>2. Scope</H2>
        <P>
          All GoldFin Desk systems, environments, employees, contractors, and sub-processors
          that touch Plaid Link sessions, Plaid Items/Accounts/Auth/Balance/Transactions/
          Identity, Plaid webhooks, or any database row derived from a Plaid response.
        </P>

        <H2>3. Roles and responsibilities</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI><strong className="text-ink">Founder (Chris Sam)</strong> — policy owner; approves changes; signs the quarterly review.</LI>
          <LI><strong className="text-ink">Engineering lead</strong> — implements controls; maintains this document; triages incidents.</LI>
          <LI><strong className="text-ink">On-call engineer</strong> — first responder to webhook failures and item-error alerts.</LI>
          <LI><strong className="text-ink">Support</strong> — user-facing communication during incidents and data-subject requests.</LI>
        </ul>

        <H2>4. Environments &amp; secret management</H2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="min-w-full text-[12.5px]">
            <thead className="bg-ink/[0.03] text-left text-[11px] uppercase tracking-wide text-ink/55">
              <tr>
                <th className="px-3 py-2">Environment</th>
                <th className="px-3 py-2">API host</th>
                <th className="px-3 py-2">Secret name</th>
              </tr>
            </thead>
            <tbody>
              {ENVS.map((r) => (
                <tr key={r.env} className="border-t border-ink/10">
                  <td className="px-3 py-2 text-ink">{r.env}</td>
                  <td className="px-3 py-2 font-mono text-[11.5px] text-ink/75">{r.host}</td>
                  <td className="px-3 py-2 font-mono text-[11.5px] text-ink/75">{r.secret}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Secrets are never committed to source control, never logged, and never exposed to
          the browser. Rotation cadence: every 180 days, or immediately upon suspected
          compromise, staff departure, or a Plaid security advisory.
        </P>

        <H2>5. Access control</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI>All Plaid-derived tables have Row-Level Security enabled.</LI>
          <LI>Policies restrict every operation to <code className="font-mono text-[12px]">auth.uid() = user_id</code>.</LI>
          <LI>The service-role key is used only inside edge functions, never client-side.</LI>
          <LI>Administrative read access is limited to users in the <code className="font-mono text-[12px]">admin</code> role and is audited.</LI>
        </ul>

        <H2>6. Token lifecycle</H2>
        <P>
          Link and public tokens live only in browser memory (≤ 30 minutes). Access tokens
          are stored encrypted at rest and disposed via Plaid's <code className="font-mono text-[12px]">/item/remove</code> before
          the row is deleted. Webhook payloads are retained for 90 days in <code className="font-mono text-[12px]">webhook_events</code> and
          then purged by the daily retention sweep.
        </P>

        <H2>7. Webhook handling</H2>
        <P>
          All Plaid webhooks hit <code className="font-mono text-[12px]">/functions/v1/plaid-webhook</code>. The request body is
          HMAC-SHA256 verified against <code className="font-mono text-[12px]">PLAID_WEBHOOK_SECRET</code>; invalid signatures are
          rejected with HTTP 401 and logged. Transaction sync uses Plaid's <code className="font-mono text-[12px]">/transactions/sync</code> cursor
          pattern. Persistent failures surface in the admin audit dashboard.
        </P>

        <H2>8. Incident response runbook</H2>
        <ol className="mt-3 list-decimal pl-5">
          <LI><strong className="text-ink">Detect.</strong> Pager triggers on elevated webhook 5xx, link-token failures, or ITEM_ERROR storms.</LI>
          <LI><strong className="text-ink">Triage.</strong> On-call opens the admin audit dashboard and inspects <code className="font-mono text-[12px]">webhook_events</code> and <code className="font-mono text-[12px]">cron_runs</code>.</LI>
          <LI><strong className="text-ink">Contain.</strong> Rotate <code className="font-mono text-[12px]">PLAID_*</code> secrets, mark affected items <code className="font-mono text-[12px]">reauth_required</code>, call <code className="font-mono text-[12px]">/item/remove</code> on any exposed item.</LI>
          <LI><strong className="text-ink">Communicate.</strong> Notify affected users within 72 hours of confirmed unauthorized access.</LI>
          <LI><strong className="text-ink">Report.</strong> File a Plaid security report at <code className="font-mono text-[12px]">security@plaid.com</code> within 72 hours.</LI>
          <LI><strong className="text-ink">Post-mortem.</strong> Written within 5 business days, attached as an appendix to this policy, with at least one durable control change.</LI>
        </ol>

        <H2>9. Change management</H2>
        <P>
          Any pull request touching <code className="font-mono text-[12px]">supabase/functions/plaid-*</code>, the portal Plaid components, or any
          <code className="font-mono text-[12px]"> plaid_*</code> table must update this document in the same PR and bump the version
          string (format <code className="font-mono text-[12px]">YYYY-MM-DD.N</code>). A version bump triggers an admin re-acknowledgement
          banner at next sign-in.
        </P>

        <H2>10. Sub-processors</H2>
        <P>
          Plaid Inc. (bank data, US), Stripe Inc. (billing, US), Resend (transactional email,
          US), and Lovable Cloud / Supabase (database, auth, edge functions, secrets, US).
          The list is re-validated at every quarterly review; new sub-processors require
          founder sign-off before production rollout.
        </P>

        <H2>11. Maturity model</H2>
        <P>
          GoldFin Desk uses a 5-level maturity model adapted from CMMI / NIST PRISMA. We
          self-assess against it every quarter.
        </P>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="min-w-full text-[12.5px]">
            <thead className="bg-ink/[0.03] text-left text-[11px] uppercase tracking-wide text-ink/55">
              <tr>
                <th className="px-3 py-2">Level</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Definition</th>
              </tr>
            </thead>
            <tbody>
              {MATURITY.map((r) => (
                <tr key={r.lvl} className="border-t border-ink/10">
                  <td className="px-3 py-2 text-ink">{r.lvl}</td>
                  <td className="px-3 py-2 text-ink">{r.name}</td>
                  <td className="px-3 py-2 text-ink/75">{r.def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          <strong className="text-ink">Current self-assessed level: 3 (Defined).</strong>{" "}
          Target by next annual review: 4 (Managed). Gaps being closed: automated monthly RLS
          drift check, SLO dashboards for webhook latency and link-token success, and a
          quarterly tabletop exercise against the §8 runbook.
        </P>

        <H2>12. Review cadence — how this policy stays continuously matured</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI><strong className="text-ink">Quarterly review</strong> by founder + engineering lead, logged in the admin audit dashboard.</LI>
          <LI><strong className="text-ink">Triggered review</strong> after any §8 incident, new sub-processor, Plaid EUSA/EUDPA change, or material product change.</LI>
          <LI><strong className="text-ink">Annual external review</strong> against the then-current Plaid product surface and regulatory guidance.</LI>
          <LI><strong className="text-ink">Version log</strong> in §13 is appended at every review — even a "reviewed, no change" entry is recorded.</LI>
        </ul>

        <H2>13. Change log</H2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="min-w-full text-[12.5px]">
            <thead className="bg-ink/[0.03] text-left text-[11px] uppercase tracking-wide text-ink/55">
              <tr>
                <th className="px-3 py-2">Version</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Author</th>
                <th className="px-3 py-2">Summary</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-ink/10">
                <td className="px-3 py-2 font-mono text-[11.5px] text-ink">2026-06-26.1</td>
                <td className="px-3 py-2 text-ink/75">2026-06-26</td>
                <td className="px-3 py-2 text-ink/75">Chris Sam</td>
                <td className="px-3 py-2 text-ink/75">Initial published version. Maturity level 3.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-10 text-[12px] text-ink/55">
          Questions or reports of suspected security issues:{" "}
          <a className="underline" href="mailto:security@goldfindesk.com">security@goldfindesk.com</a>.
        </p>
      </article>
    </main>
  );
}

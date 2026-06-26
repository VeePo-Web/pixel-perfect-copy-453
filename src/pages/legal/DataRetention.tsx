import { RETENTION_POLICY_VERSION } from "../../lib/portal/tos";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-[18px] font-medium text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[14px] leading-[1.75] text-ink/75">{children}</p>
);

const SCHEDULE: Array<{ data: string; window: string; basis: string }> = [
  { data: "Login codes (one-time passcodes)", window: "Purged 24 hours after expiry", basis: "Security minimization" },
  { data: "Webhook event log", window: "90 days, then purged", basis: "Operational debugging only" },
  { data: "Cron / automation run log", window: "90 days, then purged", basis: "Operational debugging only" },
  { data: "Advisory reports (your bi-weekly briefings)", window: "24 months", basis: "Customer access + service history" },
  { data: "Disconnected Plaid bank connections", window: "30 days after disconnect, then purged with Plaid /item/remove", basis: "Plaid End-User Data Disposal" },
  { data: "Marketing leads (no account created)", window: "18 months of inactivity", basis: "Marketing consent expiry" },
  { data: "Applications (unaccepted/abandoned)", window: "24 months", basis: "Sales-cycle window" },
  { data: "Account & profile data after deletion request", window: "30-day grace window, then hard-deleted", basis: "GDPR Art. 17 / CCPA §1798.105" },
  { data: "Terms-of-Service acceptances", window: "Retained 7 years", basis: "Legal evidence (contract record)" },
  { data: "Subscription / billing records", window: "Retained 7 years, then purged", basis: "Tax & accounting law" },
];

export default function DataRetention() {
  return (
    <main className="min-h-screen bg-paper">
      <article className="mx-auto max-w-2xl px-6 py-16 text-ink">
        <a href="/" className="text-[12.5px] text-ink/55 hover:text-ink">
          ← Back to GoldFin Desk
        </a>
        <h1 className="mt-6 font-zentry text-[36px] leading-[1.1] tracking-[-0.01em]">
          Data Retention &amp; Deletion Policy
        </h1>
        <p className="mt-3 text-[12.5px] text-ink/55">
          Version {RETENTION_POLICY_VERSION} · Reviewed quarterly by the GoldFin Desk founder
          and engineering lead.
        </p>

        <H2>1. Purpose &amp; legal basis</H2>
        <P>
          GoldFin Desk operates a defined, written, and automatically enforced data retention
          and deletion program. The program is designed to comply with the storage-limitation
          principle of the EU General Data Protection Regulation (GDPR Art. 5(1)(e) and the
          right to erasure under Art. 17), the California Consumer Privacy Act / CPRA
          (Cal. Civ. Code §1798.105), Canada's Personal Information Protection and Electronic
          Documents Act (PIPEDA Principle 5 — Limiting Use, Disclosure, and Retention), and
          Plaid's End User Data Disposal Standard.
        </P>

        <H2>2. Retention schedule</H2>
        <P>
          We keep each category of data only for as long as it serves the purpose it was
          collected for, plus the minimum window required by law. After the window, the data
          is deleted by an automated daily sweep — no human action required.
        </P>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="min-w-full text-[12.5px]">
            <thead className="bg-ink/[0.03] text-left text-[11px] uppercase tracking-wide text-ink/55">
              <tr>
                <th className="px-3 py-2">Data category</th>
                <th className="px-3 py-2">Retention window</th>
                <th className="px-3 py-2">Basis</th>
              </tr>
            </thead>
            <tbody>
              {SCHEDULE.map((row) => (
                <tr key={row.data} className="border-t border-ink/5 align-top">
                  <td className="px-3 py-2 text-ink">{row.data}</td>
                  <td className="px-3 py-2 text-ink/75">{row.window}</td>
                  <td className="px-3 py-2 text-ink/60">{row.basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2>3. How deletion is enforced</H2>
        <P>
          A scheduled job (<code>cron-retention-sweep</code>) runs daily at 09:00 UTC. It calls
          a server-side database function (<code>run_retention_sweep</code>) that deletes any
          rows that have aged past their retention window and returns a per-table count. Every
          run is logged for internal audit and surfaced in our admin dashboard.
        </P>

        <H2>4. Your right to request deletion</H2>
        <P>
          You can delete your account and all associated data at any time from{" "}
          <a href="/portal/settings" className="underline">Portal → Settings → Delete account</a>,
          or by emailing{" "}
          <a href="mailto:privacy@goldfindesk.com" className="underline">privacy@goldfindesk.com</a>.
          On request we:
        </P>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-[14px] text-ink/75">
          <li>Immediately revoke every Plaid bank connection (no further data is pulled).</li>
          <li>Cancel any active subscription at period end.</li>
          <li>Mark your account for hard-deletion after a 30-day grace window (so you can recover it if the request was a mistake).</li>
          <li>After 30 days, permanently delete your profile, reports, bank metadata, and authentication record.</li>
        </ul>
        <P>
          Records that we are legally required to keep (e.g. signed terms-of-service
          acceptances, billing receipts) are retained only for the minimum statutory period,
          stripped of unnecessary personal identifiers where possible.
        </P>

        <H2>5. Sub-processors</H2>
        <P>
          GoldFin Desk relies on Plaid (bank connectivity), Supabase (database &amp; auth),
          Stripe (billing), and Resend (transactional email). Each sub-processor has its own
          data-retention commitments. Deleting your GoldFin Desk account triggers deletion or
          revocation requests against each of them where supported. See our{" "}
          <a href="/privacy" className="underline">Privacy Policy</a> and{" "}
          <a href="/plaid-consent" className="underline">Plaid Data Consent</a>.
        </P>

        <H2>6. Periodic review</H2>
        <P>
          This policy is formally reviewed at least once per calendar quarter by the founder
          and engineering lead. Reviews are recorded in an internal{" "}
          <code>retention_policy_reviews</code> log so we can demonstrate the cadence on
          request. Any material change bumps the policy version and is announced in-app the
          next time you sign in.
        </P>

        <H2>7. Contact</H2>
        <P>
          Privacy and deletion requests:{" "}
          <a href="mailto:privacy@goldfindesk.com" className="underline">
            privacy@goldfindesk.com
          </a>
          . We respond within 30 days, as required by GDPR and CCPA.
        </P>
      </article>
    </main>
  );
}

const MFA_VERSION = "2026-06-26.1";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-[18px] font-medium text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[14px] leading-[1.75] text-ink/75">{children}</p>
);
const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="mt-1.5 text-[14px] leading-[1.7] text-ink/75">{children}</li>
);

const FACTORS = [
  { path: "Email OTP", f1: "Verified email mailbox (possession)", f2: "6-digit one-time code, out-of-band", notes: "Single-use, 10-min TTL, rate-limited" },
  { path: "Google OAuth", f1: "Google account (possession)", f2: "Google-enforced 2-Step Verification", notes: "Federated; 2SV required on the Google account" },
];

export default function MfaPolicy() {
  return (
    <main className="min-h-screen bg-paper">
      <article className="mx-auto max-w-2xl px-6 py-16 text-ink">
        <a href="/" className="text-[12.5px] text-ink/55 hover:text-ink">
          ← Back to GoldFin Desk
        </a>

        <h1 className="mt-6 font-display font-medium text-[36px] leading-[1.12] tracking-[-0.02em]">
          Multi-Factor Authentication (MFA) Policy
        </h1>
        <p className="mt-3 text-[12.5px] text-ink/55">
          Version {MFA_VERSION} · Owner: Chris Sam, Founder · Reviewed quarterly by the
          founder and engineering lead.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/downloads/goldfin-mfa-policy.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink px-4 py-2 text-[12.5px] font-medium text-paper hover:bg-ink/90"
          >
            Download PDF
          </a>
          <a
            href="/plaid-operations"
            className="text-[12.5px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            See related: Plaid Operations &amp; Maturity Policy →
          </a>
        </div>

        <H2>1. Purpose</H2>
        <P>
          GoldFin Desk operates a passwordless, MFA-by-default authentication model. There
          is no password-only path anywhere in the product. This policy documents how we
          authenticate every identity that can reach the portal or any system handling
          end-user financial data obtained through Plaid, in alignment with Plaid's EUSA
          §5, Plaid Production Access review (authentication &amp; session management),
          SOC 2 CC6.1 / CC6.6, NIST SP 800-63B AAL2, and PCI-DSS 8.4.
        </P>

        <H2>2. Scope</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI>All end users of the GoldFin portal (<code className="font-mono text-[12px]">/portal/*</code>).</LI>
          <LI>All administrators (any account in <code className="font-mono text-[12px]">user_roles</code> with role = <code className="font-mono text-[12px]">admin</code>).</LI>
          <LI>All employees, contractors, and sub-processors with access to GoldFin systems.</LI>
          <LI>Every authentication event that precedes a Plaid Link session, token exchange, or read of Plaid-derived data.</LI>
        </ul>

        <H2>3. Authentication factors in use</H2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="min-w-full text-[12.5px]">
            <thead className="bg-ink/[0.03] text-left text-[11px] uppercase tracking-wide text-ink/55">
              <tr>
                <th className="px-3 py-2">Path</th>
                <th className="px-3 py-2">Factor 1</th>
                <th className="px-3 py-2">Factor 2</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {FACTORS.map((r) => (
                <tr key={r.path} className="border-t border-ink/10">
                  <td className="px-3 py-2 text-ink">{r.path}</td>
                  <td className="px-3 py-2 text-ink/75">{r.f1}</td>
                  <td className="px-3 py-2 text-ink/75">{r.f2}</td>
                  <td className="px-3 py-2 text-ink/75">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Knowledge-based authentication, SMS OTP, and security questions are explicitly out
          of scope. Both supported paths satisfy NIST AAL2.
        </P>

        <H2>4. Email OTP — technical controls</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI>6-digit numeric, generated server-side with a CSPRNG inside <code className="font-mono text-[12px]">send-login-otp</code>.</LI>
          <LI>Stored as SHA-256 hash in <code className="font-mono text-[12px]">auth_otp_codes</code>; raw codes are never persisted.</LI>
          <LI>Delivered by Resend from <code className="font-mono text-[12px]">noreply@goldfindesk.com</code> over TLS 1.2+.</LI>
          <LI>10-minute TTL; single-use, atomically consumed on first successful verify.</LI>
          <LI>Rate limits: 5 issuances per email per hour, 5 verify attempts per code; excess triggers a 15-minute soft lock with alert.</LI>
          <LI>Enumeration-resistant: identical response for known and unknown emails.</LI>
        </ul>

        <H2>5. Google OAuth — federation controls</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI>Scopes requested: <code className="font-mono text-[12px]">openid email profile</code> only — no Gmail, Drive, or Calendar.</LI>
          <LI>Account binding by Google subject ID; an email change alone does not re-bind.</LI>
          <LI>Users are required during onboarding to have Google 2-Step Verification enabled.</LI>
          <LI>OAuth tokens exchanged server-side; only the GoldFin session JWT reaches the client.</LI>
        </ul>

        <H2>6. Enforcement — no path bypasses MFA</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI>No username/password form exists in the product.</LI>
          <LI>Legacy paths (<code className="font-mono text-[12px]">/portal/signup</code>, <code className="font-mono text-[12px]">/portal/forgot-password</code>, <code className="font-mono text-[12px]">/portal/reset-password</code>) all route to <code className="font-mono text-[12px]">/portal/login</code>.</LI>
          <LI>Every protected route is wrapped by <code className="font-mono text-[12px]">ProtectedRoute</code>; unauthenticated requests redirect to login.</LI>
          <LI>All Plaid edge functions re-verify <code className="font-mono text-[12px]">auth.uid()</code> server-side on every call.</LI>
        </ul>

        <H2>7. Privileged access (administrators)</H2>
        <P>
          Admin role lives in <code className="font-mono text-[12px]">user_roles</code> — never on the user/profile row — and is checked
          via the <code className="font-mono text-[12px]">public.has_role()</code> security-definer function used inside RLS policies.
          Admins use the exact same Email OTP or Google OAuth flow as end users; there is no
          separate admin login. The audit dashboard at <code className="font-mono text-[12px]">/portal/admin/audit</code> is
          gated by <code className="font-mono text-[12px]">has_role(auth.uid(), 'admin')</code>.
        </P>

        <H2>8. Session policy</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI>Access-token lifetime: 1 hour (HS256 JWT), validated on every edge-function call.</LI>
          <LI>Refresh-token rotation enabled; reused refresh tokens revoke the entire session family.</LI>
          <LI>Idle timeout: 30 minutes. Absolute timeout: 24 hours.</LI>
          <LI><strong className="text-ink">Plaid Link re-auth:</strong> a fresh authentication assertion within the last 30 minutes is required before <code className="font-mono text-[12px]">plaid-create-link-token</code> returns a token.</LI>
          <LI>Logout revokes the refresh token server-side and clears all client storage.</LI>
        </ul>

        <H2>9. Account recovery</H2>
        <P>
          Recovery is by fresh OTP to the verified email on file, or fresh Google OAuth for
          Google-bound accounts. No security questions, no SMS resets, no support-channel
          password resets. Email-address changes require OTP verification at both the old
          and new addresses. Lost-email situations are resolved out-of-band by{" "}
          <a className="underline" href="mailto:security@goldfindesk.com">security@goldfindesk.com</a>{" "}
          before access is restored.
        </P>

        <H2>10. Logging, monitoring, and incident response</H2>
        <P>
          All authentication events (issued, verified, failed, rate-limited, locked) are
          surfaced in <code className="font-mono text-[12px]">/portal/admin/audit</code>. Webhook deliveries are retained for 90
          days in <code className="font-mono text-[12px]">webhook_events</code>. On suspected credential compromise we revoke
          refresh tokens, force re-auth, mark every Plaid item <code className="font-mono text-[12px]">reauth_required</code>,
          notify the user within 72 hours of confirmed unauthorized access, and file a Plaid
          security report at <code className="font-mono text-[12px]">security@plaid.com</code> within the same window where
          Plaid-derived data is implicated.
        </P>

        <H2>11. Review cadence — how this policy stays continuously matured</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI><strong className="text-ink">Quarterly review</strong> by founder + engineering lead, logged in the admin audit dashboard.</LI>
          <LI><strong className="text-ink">Triggered review</strong> after any auth incident, change to the auth surface, new identity provider, or new Plaid product surface.</LI>
          <LI><strong className="text-ink">Annual external review</strong> against the current NIST 800-63B revision and SOC 2 control set.</LI>
          <LI><strong className="text-ink">Version log</strong> in §12 is appended at every review — even a "reviewed, no change" entry is recorded.</LI>
        </ul>

        <H2>12. Change log</H2>
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
                <td className="px-3 py-2 text-ink/75">Initial published version. Email OTP + Google OAuth, AAL2, no password path.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-10 text-[12px] text-ink/55">
          Questions or reports of suspected authentication issues:{" "}
          <a className="underline" href="mailto:security@goldfindesk.com">security@goldfindesk.com</a>.
        </p>
      </article>
    </main>
  );
}

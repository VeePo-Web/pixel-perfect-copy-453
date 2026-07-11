const VERSION = "2026-06-26.1";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-[18px] font-medium text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[14px] leading-[1.75] text-ink/75">{children}</p>
);
const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="mt-1.5 text-[14px] leading-[1.7] text-ink/75">{children}</li>
);
const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-[12px]">{children}</code>
);

const SYSTEMS = [
  { sys: "GoldFin customer portal (/portal/*)", who: "End users", mfa: "Email OTP or Google OAuth (2SV required). No password form." },
  { sys: "Admin / audit dashboard", who: "Admin role only", mfa: "Same passwordless flow; server-side has_role() gate." },
  { sys: "Edge functions calling Plaid", who: "Service + per-call auth.uid()", mfa: "JWT validated every call; cron uses vaulted CRON_SECRET." },
  { sys: "Lovable Cloud database (Plaid tables)", who: "Operators via vendor console", mfa: "Vendor-console MFA (TOTP); service-role key never exposed." },
  { sys: "Plaid Dashboard", who: "Founder + engineering lead", mfa: "Plaid MFA (TOTP); recovery codes sealed in vault." },
  { sys: "Stripe Dashboard", who: "Founder", mfa: "Stripe MFA (TOTP + hardware key)." },
  { sys: "Resend", who: "Founder", mfa: "Resend MFA (TOTP)." },
  { sys: "Source-code repository (GitHub)", who: "Founder + engineering lead", mfa: "GitHub MFA (hardware key); branch protection on main." },
  { sys: "Domain registrar & DNS", who: "Founder", mfa: "Registrar MFA (TOTP); registrar lock on." },
];

export default function MfaAttestation() {
  return (
    <main className="min-h-screen bg-paper">
      <article className="mx-auto max-w-2xl px-6 py-16 text-ink">
        <a href="/" className="text-[12.5px] text-ink/55 hover:text-ink">
          ← Back to GoldFin Desk
        </a>

        <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-ink/45">
          Plaid Production Access · Security &amp; Access Control
        </p>
        <h1 className="mt-2 font-display font-medium text-[34px] leading-[1.12] tracking-[-0.02em]">
          MFA Attestation for Plaid
        </h1>
        <p className="mt-3 text-[12.5px] text-ink/55">
          Version {VERSION} · Owner: Chris Sam, Founder · Reviewed quarterly.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/downloads/goldfin-mfa-attestation.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink px-4 py-2 text-[12.5px] font-medium text-paper hover:bg-ink/90"
          >
            Download PDF
          </a>
          <a
            href="/mfa-policy"
            className="text-[12.5px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            See full MFA Policy →
          </a>
          <a
            href="/plaid-operations"
            className="text-[12.5px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Plaid Operations Policy →
          </a>
        </div>

        <H2>Plaid question answered by this document</H2>
        <blockquote className="mt-3 rounded-xl border-l-2 border-champagne-300 bg-paper-raised px-4 py-3 text-[14px] italic text-ink/80">
          "Is multi-factor authentication (MFA) in place for access to critical systems that
          store or process consumer financial data?"
        </blockquote>

        <H2>Answer</H2>
        <P>
          <strong className="text-ink">Yes.</strong> Every identity — end user, employee, contractor,
          and sub-processor — that can reach a critical system storing or processing consumer
          financial data obtained through Plaid authenticates with multi-factor authentication.
          There is no password-only path anywhere in the product or in any operator console.
          Both supported authentication paths satisfy NIST SP 800-63B AAL2.
        </P>

        <H2>Critical systems in scope</H2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="min-w-full text-[12.5px]">
            <thead className="bg-ink/[0.03] text-left text-[11px] uppercase tracking-wide text-ink/55">
              <tr>
                <th className="px-3 py-2">System</th>
                <th className="px-3 py-2">Who can access</th>
                <th className="px-3 py-2">MFA enforcement</th>
              </tr>
            </thead>
            <tbody>
              {SYSTEMS.map((r) => (
                <tr key={r.sys} className="border-t border-ink/10 align-top">
                  <td className="px-3 py-2 text-ink">{r.sys}</td>
                  <td className="px-3 py-2 text-ink/75">{r.who}</td>
                  <td className="px-3 py-2 text-ink/75">{r.mfa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2>End-user MFA</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI><strong className="text-ink">Email OTP</strong> — 6-digit, single-use, 10-min TTL, SHA-256 stored, rate-limited (5/hour, 5 verify attempts/code).</LI>
          <LI><strong className="text-ink">Google OAuth</strong> — federated; Google 2-Step Verification required on the account during onboarding.</LI>
          <LI>Knowledge-based auth, SMS OTP, and security questions are explicitly out of scope.</LI>
        </ul>

        <H2>Privileged / admin MFA</H2>
        <P>
          Admin role lives in a separate <Code>user_roles</Code> table — never on the user row —
          and is gated by the <Code>public.has_role()</Code> security-definer function inside RLS
          policies. Admins authenticate via the same passwordless flow as end users; there is no
          separate admin login surface and no shared credential.
        </P>

        <H2>Plaid Link — fresh-auth requirement</H2>
        <P>
          Before <Code>plaid-create-link-token</Code> returns a token, the session must have
          completed an authentication assertion within the last 30 minutes. A stale session
          cannot initiate a new bank link or change linked accounts without re-authenticating.
        </P>

        <H2>Vendor / operator console MFA</H2>
        <P>
          Plaid, Stripe, Resend, Lovable Cloud, GitHub, and the domain registrar all enforce
          MFA on every operator account. Recovery codes are sealed in a password-manager vault
          accessible only to the founder. Quarterly review confirms MFA is still enforced and
          that no shared logins exist.
        </P>

        <H2>Enforcement evidence</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI>No password input exists anywhere in <Code>src/pages/portal/*</Code>.</LI>
          <LI>Legacy paths (<Code>/portal/signup</Code>, <Code>/portal/forgot-password</Code>, <Code>/portal/reset-password</Code>) all route to <Code>/portal/login</Code>.</LI>
          <LI>Every protected route is wrapped by <Code>ProtectedRoute</Code>.</LI>
          <LI>Every Plaid edge function re-verifies <Code>auth.uid()</Code> server-side on every call and fails closed.</LI>
          <LI>Refresh-token rotation enabled; reused tokens revoke the session family.</LI>
          <LI>Session limits: access token 1h, idle 30m, absolute 24h.</LI>
          <LI>Auth events logged to the admin audit dashboard; webhook deliveries retained 90 days.</LI>
        </ul>

        <H2>Standards alignment</H2>
        <ul className="mt-3 list-disc pl-5">
          <LI>Plaid EUSA §5 (security &amp; confidentiality).</LI>
          <LI>Plaid Production Access review — authentication and session management.</LI>
          <LI>NIST SP 800-63B AAL2.</LI>
          <LI>SOC 2 CC6.1 / CC6.6.</LI>
          <LI>PCI-DSS 8.4.</LI>
        </ul>

        <H2>Attestation</H2>
        <P>
          I, <strong className="text-ink">Chris Sam</strong>, Founder of GoldFin Desk, attest that
          the controls described above are implemented and operating as stated as of the version
          date below.
        </P>
        <p className="mt-2 text-[13px] text-ink/65">
          Signed: Chris Sam, Founder · Date: 2026-06-26 · Version {VERSION}
        </p>

        <p className="mt-10 text-[12px] text-ink/55">
          Report suspected authentication issues to{" "}
          <a className="underline" href="mailto:security@goldfindesk.com">security@goldfindesk.com</a>.
        </p>
      </article>
    </main>
  );
}

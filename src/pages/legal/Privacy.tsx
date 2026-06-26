const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-[18px] font-medium text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[14px] leading-[1.75] text-ink/75">{children}</p>
);

export default function Privacy() {
  return (
    <main className="min-h-screen bg-paper">
      <article className="mx-auto max-w-2xl px-6 py-16 text-ink">
        <a href="/" className="text-[12.5px] text-ink/55 hover:text-ink">
          ← Back to GoldFin Desk
        </a>
        <h1 className="mt-6 font-zentry text-[36px] leading-[1.1] tracking-[-0.01em]">
          Privacy Policy
        </h1>

        <H2>Information we collect</H2>
        <P>
          Account information you provide (name, email, phone), financial account snapshots
          delivered by Plaid (see the Plaid Data Consent for details), and minimal log data
          required to operate the Service (IP address, user agent, timestamps).
        </P>

        <H2>How we use it</H2>
        <P>
          We use your data to operate the portal, display your financial position, secure your
          account, comply with legal obligations, and improve the Service. We do not sell your
          personal information.
        </P>

        <H2>Subprocessors</H2>
        <P>
          We rely on Plaid (bank connectivity), Lovable Cloud / Supabase (database and
          authentication), Stripe (billing), and Resend (transactional email). Each is bound by
          its own security and privacy commitments. We are not responsible for any incident
          affecting these third parties; see the Terms of Service for the full disclaimer.
        </P>

        <H2>Your choices</H2>
        <P>
          You can update your profile, regenerate two-factor authentication, disconnect any
          institution, or delete your account from the portal at any time. Contact{" "}
          <a href="mailto:privacy@goldfindesk.com" className="underline">
            privacy@goldfindesk.com
          </a>{" "}
          for any data-related request.
        </P>
      </article>
    </main>
  );
}

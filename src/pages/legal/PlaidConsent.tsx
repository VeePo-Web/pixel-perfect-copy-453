import { PLAID_CONSENT_VERSION } from "../../lib/portal/tos";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-[18px] font-medium text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[14px] leading-[1.75] text-ink/75">{children}</p>
);

export default function PlaidConsent() {
  return (
    <main className="min-h-screen bg-paper">
      <article className="mx-auto max-w-2xl px-6 py-16 text-ink">
        <a href="/" className="text-[12.5px] text-ink/55 hover:text-ink">
          ← Back to GoldFin Desk
        </a>
        <h1 className="mt-6 font-zentry text-[36px] leading-[1.1] tracking-[-0.01em]">
          Plaid Data Consent
        </h1>
        <p className="mt-3 text-[12.5px] uppercase tracking-wider text-ink/45">
          Version {PLAID_CONSENT_VERSION}
        </p>

        <P>
          To enable GoldFin Desk to read information about your financial accounts, you authorize
          Plaid Inc. ("Plaid") to act on your behalf, and you authorize Plaid to share the
          following information with GoldFin Desk.
        </P>

        <H2>What Plaid will share with GoldFin</H2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-[1.75] text-ink/75">
          <li>Account names, masks, types, and subtypes.</li>
          <li>Current and available balances, in the account's native currency.</li>
          <li>Transactions: date, amount, merchant, category, and pending status.</li>
          <li>Institution name and logo.</li>
        </ul>
        <P>
          We do <strong>not</strong> request and do <strong>not</strong> receive your bank
          username, password, MFA codes, security questions, full account or routing numbers, or
          investment trade history. If we ever add a feature that requires expanded data, you
          will be asked to consent again.
        </P>

        <H2>How long we keep it</H2>
        <P>
          Account snapshots are stored for as long as the institution remains connected, plus a
          reasonable retention window for support and accounting. You can disconnect any
          institution at any time from the "Connected accounts" page; doing so revokes our access
          token at Plaid immediately and deletes the corresponding records from our database.
        </P>

        <H2>Plaid's own policy</H2>
        <P>
          Plaid's End User Privacy Policy governs Plaid's collection, use, and storage of your
          information independently of these terms. You should review it at{" "}
          <a
            href="https://plaid.com/legal/#end-user-privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            plaid.com/legal
          </a>
          .
        </P>

        <H2>What we are not responsible for</H2>
        <P>
          GoldFin is not responsible for, and disclaims all liability arising from, any breach,
          intrusion, outage, data loss, or unauthorized disclosure affecting Plaid or your
          financial institution. See the full Terms of Service for the complete liability
          disclaimer.
        </P>

        <H2>Withdrawing consent</H2>
        <P>
          You may withdraw this consent at any time by disconnecting each institution in the
          portal or by deleting your account. Withdrawal does not affect data processing that
          occurred before withdrawal.
        </P>
      </article>
    </main>
  );
}

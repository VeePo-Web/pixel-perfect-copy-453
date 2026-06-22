import { TOS_VERSION } from "../../lib/portal/tos";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-[18px] font-medium text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[14px] leading-[1.75] text-ink/75">{children}</p>
);

export default function Terms() {
  return (
    <main className="min-h-screen bg-paper">
      <article className="mx-auto max-w-2xl px-6 py-16 text-ink">
        <a href="/" className="text-[12.5px] text-ink/55 hover:text-ink">
          ← Back to Goldfin Desk
        </a>
        <h1 className="mt-6 font-zentry text-[36px] leading-[1.1] tracking-[-0.01em]">
          Terms of Service
        </h1>
        <p className="mt-3 text-[12.5px] uppercase tracking-wider text-ink/45">
          Version {TOS_VERSION} · Effective immediately
        </p>

        <P>
          These Terms of Service ("Terms") govern your access to and use of Goldfin Desk (the
          "Service"), provided by Goldfin Desk ("Goldfin," "we," "us"). By creating an account,
          clicking "I agree," or using the Service, you accept and agree to be bound by these
          Terms in full. If you do not agree, do not use the Service.
        </P>

        <H2>1. Read-only access</H2>
        <P>
          The Service connects to your financial accounts through Plaid Inc. solely on a
          read-only basis. We do not initiate, authorize, instruct, or facilitate any payment,
          transfer, trade, withdrawal, or other movement of funds, and we have no ability to do
          so. Any payment, banking, or investment action remains entirely between you and your
          financial institution.
        </P>

        <H2>2. Plaid is the data conduit</H2>
        <P>
          You authenticate with each financial institution through Plaid's interface. Plaid
          handles the credential exchange and delivers a token to us; we never see, store,
          process, or have access to your bank username, password, MFA codes, security
          questions, or any other login credentials. Your relationship with Plaid is governed
          by Plaid's own End User Privacy Policy, which you accept separately. Goldfin is not
          responsible for Plaid's services, availability, security, or data handling.
        </P>

        <H2>3. Not financial, tax, legal, or fiduciary advice</H2>
        <P>
          The Service provides information for organizational purposes only. Nothing displayed
          in the Service constitutes financial, investment, tax, accounting, or legal advice,
          and we are not acting as your fiduciary, broker, dealer, investment adviser,
          accountant, attorney, or registered representative. You should consult licensed
          professionals before making any decision based on data shown in the Service.
        </P>

        <H2>4. No warranty</H2>
        <P>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED. WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY,
          COMPLETENESS, RELIABILITY, TIMELINESS, OR AVAILABILITY. WE DO NOT WARRANT THAT THE
          SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </P>

        <H2>5. No guarantee of data accuracy</H2>
        <P>
          Balances, transactions, categorizations, and any other data displayed in the Service
          are sourced from third parties and may be delayed, incomplete, inaccurate, or wrong.
          You must independently verify all information against your authoritative bank
          statements before relying on it for any purpose. We are not responsible for any
          decision, action, or omission made in reliance on data displayed in the Service.
        </P>

        <H2>6. Third-party breach and outage disclaimer</H2>
        <P>
          To the maximum extent permitted by law, Goldfin is not liable for any breach, hack,
          ransomware, intrusion, unauthorized access, leak, outage, data corruption, data loss,
          service interruption, or other security or availability incident affecting Plaid, your
          financial institution, our cloud infrastructure providers (including Lovable Cloud,
          Supabase, and their subprocessors), Stripe, Resend, or any other third party we
          rely on. You acknowledge and accept these third-party risks as a condition of using
          the Service.
        </P>

        <H2>7. Your responsibility for account security</H2>
        <P>
          You are solely responsible for safeguarding your Goldfin account credentials, the
          devices you use to access the Service, your two-factor authentication enrollment, and
          your backup codes. You must enable and maintain two-factor authentication. Any loss,
          theft, fraud, or unauthorized use arising from compromised credentials, lost devices,
          shared accounts, or your failure to maintain reasonable security measures is your
          responsibility, not ours.
        </P>

        <H2>8. Limitation of liability</H2>
        <P>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL GOLDFIN, ITS OWNERS,
          OFFICERS, EMPLOYEES, CONTRACTORS, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS,
          REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATING TO YOUR
          USE OF OR INABILITY TO USE THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
          DAMAGES. OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE IS
          LIMITED TO THE GREATER OF (A) FEES YOU PAID TO GOLDFIN IN THE THREE (3) MONTHS
          IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED U.S.
          DOLLARS (USD $100).
        </P>

        <H2>9. Indemnification</H2>
        <P>
          You agree to defend, indemnify, and hold harmless Goldfin and its personnel from and
          against any and all claims, damages, obligations, losses, liabilities, costs, and
          expenses (including reasonable attorneys' fees) arising from (a) your use of or
          access to the Service, (b) your violation of these Terms, (c) your violation of any
          third-party right, including any privacy or intellectual property right, or (d) any
          inaccurate, misleading, or unlawful information you provide.
        </P>

        <H2>10. Acceptable use</H2>
        <P>
          You may not use the Service to violate any law, infringe any right, transmit
          malware, attempt to gain unauthorized access to systems, reverse engineer the
          Service, scrape or resell our data, or harass any person. We may suspend or
          terminate any account at any time, with or without notice, for any reason or no
          reason.
        </P>

        <H2>11. Termination</H2>
        <P>
          You may stop using the Service at any time. We may suspend or terminate your access
          to the Service at any time, in our sole discretion, with or without cause and with or
          without notice. Sections that by their nature should survive termination — including
          Sections 3 through 10, 12, and 13 — survive termination.
        </P>

        <H2>12. Mandatory arbitration and class-action waiver</H2>
        <P>
          Any dispute, claim, or controversy arising out of or relating to these Terms or the
          Service will be resolved exclusively by binding, individual arbitration administered
          under the rules of a recognized arbitration provider in the jurisdiction set forth
          below, and not in court. YOU AND GOLDFIN EACH WAIVE THE RIGHT TO A TRIAL BY JURY AND
          THE RIGHT TO PARTICIPATE IN A CLASS ACTION, CLASS ARBITRATION, OR ANY OTHER
          REPRESENTATIVE PROCEEDING. If this Section is held unenforceable, the unenforceable
          portion will be severed and the remainder will continue in effect.
        </P>

        <H2>13. Governing law and venue</H2>
        <P>
          These Terms are governed by the laws of the jurisdiction in which Goldfin is
          principally established (the "Governing Jurisdiction"), without regard to conflict-of-laws
          principles. Subject to Section 12, any action or proceeding that is not subject to
          arbitration must be brought exclusively in the state or federal courts located within
          the Governing Jurisdiction, and you irrevocably consent to personal jurisdiction
          there.
        </P>

        <H2>14. Changes to these Terms</H2>
        <P>
          We may revise these Terms at any time. Material revisions will be announced in the
          Service, and you must re-accept the updated Terms before continuing to use the
          Service. Continued use after re-acceptance constitutes agreement to the revised
          Terms. The current version is identified at the top of this document.
        </P>

        <H2>15. Entire agreement</H2>
        <P>
          These Terms, together with the Plaid Data Consent and our Privacy Policy, constitute
          the entire agreement between you and Goldfin regarding the Service and supersede all
          prior or contemporaneous understandings.
        </P>

        <H2>16. Contact</H2>
        <P>
          Questions about these Terms: <a href="mailto:legal@goldfindesk.com" className="underline">legal@goldfindesk.com</a>.
        </P>
      </article>
    </main>
  );
}

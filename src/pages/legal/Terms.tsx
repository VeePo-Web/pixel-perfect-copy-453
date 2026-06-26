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
          ← Back to GoldFin Desk
        </a>
        <h1 className="mt-6 font-zentry text-[36px] leading-[1.1] tracking-[-0.01em]">
          Terms of Service
        </h1>
        <p className="mt-3 text-[12.5px] uppercase tracking-wider text-ink/45">
          Version {TOS_VERSION} · Effective immediately
        </p>

        <P>
          These Terms of Service ("Terms") govern your access to and use of GoldFin Desk (the
          "Service"), provided by GoldFin Desk ("GoldFin," "we," "us"). By creating an account,
          clicking "I agree," or using the Service in any manner, you accept and agree to be
          bound by these Terms in full. If you do not agree, do not use the Service. These Terms
          form a binding legal contract between you and GoldFin.
        </P>

        <H2>1. Read-only access</H2>
        <P>
          The Service connects to your financial accounts through Plaid Inc. ("Plaid") solely on
          a read-only basis. We do not initiate, authorize, instruct, or facilitate any payment,
          transfer, wire, ACH, trade, withdrawal, refund, chargeback, or other movement of funds,
          and we have no technical capability to do so. Any payment, banking, or investment
          action remains entirely between you and your financial institution.
        </P>

        <H2>2. Plaid is the data conduit</H2>
        <P>
          You authenticate with each financial institution through Plaid's interface. Plaid
          handles the credential exchange and delivers a read-only access token to us; we never
          see, store, process, or have access to your bank username, password, multi-factor
          codes, security questions, OAuth tokens, or any other login credentials. Your
          relationship with Plaid is governed by Plaid's own End User Privacy Policy and Plaid's
          terms, which you accept separately when you complete Plaid Link. GoldFin is not
          responsible for Plaid's services, availability, security, data handling, pricing, or
          changes thereto.
        </P>

        <H2>3. Not financial, tax, legal, or fiduciary advice</H2>
        <P>
          The Service provides information for organizational and informational purposes only.
          Nothing displayed in the Service constitutes financial, investment, tax, accounting, or
          legal advice, and we are not acting as your fiduciary, broker, dealer, investment
          adviser, accountant, attorney, CPA, or registered representative. You should consult
          appropriately licensed professionals before making any decision based on data shown in
          the Service.
        </P>

        <H2>3a. AI-generated content</H2>
        <P>
          Portions of the Service — including monthly briefings, summaries, recommendations,
          categorizations, and narrative explanations — are generated using large language models
          and other automated systems. Such output may be incomplete, outdated, biased, or
          factually wrong ("hallucinate"), may misinterpret your data, and must be independently
          verified by you against your authoritative bank statements and your professional
          advisors before any reliance. You acknowledge AI output is probabilistic, not
          deterministic, and you accept this risk as a condition of using the Service.
        </P>

        <H2>4. No warranty</H2>
        <P>
          THE SERVICE IS PROVIDED "AS IS," "AS AVAILABLE," AND "WITH ALL FAULTS," WITHOUT
          WARRANTY OF ANY KIND, EXPRESS, IMPLIED, OR STATUTORY. WE EXPRESSLY DISCLAIM ALL
          WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          TITLE, NON-INFRINGEMENT, ACCURACY, COMPLETENESS, RELIABILITY, TIMELINESS,
          UNINTERRUPTED OPERATION, AVAILABILITY, OR THAT THE SERVICE IS FREE OF VIRUSES, BUGS,
          OR HARMFUL COMPONENTS. WE DO NOT WARRANT ANY OUTCOME, COST SAVINGS, REVENUE,
          PERFORMANCE, OR RESULT FROM USING THE SERVICE.
        </P>

        <H2>5. No guarantee of data accuracy</H2>
        <P>
          Balances, transactions, categorizations, recurring-spend detection, anomaly flags,
          forecasts, and any other data displayed in the Service are sourced from third parties
          and may be delayed, incomplete, inaccurate, duplicated, omitted, mis-categorized,
          stale, or wrong. You must independently verify all information against your
          authoritative bank statements before relying on it for any purpose. We are not
          responsible for any decision, action, omission, tax filing, audit, dispute, or
          financial outcome made in reliance on data displayed in the Service.
        </P>

        <H2>6. Third-party breach and outage disclaimer</H2>
        <P>
          To the maximum extent permitted by law, GoldFin is not liable for any breach, hack,
          ransomware, intrusion, unauthorized access, data exfiltration, leak, outage, data
          corruption, data loss, service interruption, mis-delivery, mis-routing, throttling,
          deprecation, account closure, or other security, privacy, or availability incident
          affecting any third party we rely on, including without limitation: Plaid;
          your financial institution and its core processor; our cloud and infrastructure
          providers (including Lovable Cloud, Supabase, AWS, Cloudflare, and their
          subprocessors); Stripe; Resend; OpenAI, Anthropic, and any other AI/LLM provider; DNS
          and CDN providers; email providers; and any other vendor in our supply chain. You
          acknowledge and accept these third-party risks as a condition of using the Service.
        </P>

        <H2>6a. Force majeure</H2>
        <P>
          GoldFin is not liable for any failure or delay in performance caused by events beyond
          its reasonable control, including acts of God, natural disasters, pandemics, war,
          terrorism, civil unrest, labor disputes, government action, regulatory change,
          sanctions, embargoes, denial-of-service or other cyberattacks, internet or
          telecommunications outages, power failures, or failure of any third party named in
          Section 6.
        </P>

        <H2>7. Your responsibility for account security</H2>
        <P>
          You are solely responsible for safeguarding your GoldFin account credentials, the
          devices and browsers you use to access the Service, your email account (which receives
          one-time sign-in codes), and the physical security of those devices. You must use a
          strong, unique password and protect access to the email inbox associated with your
          account. Any loss, theft, fraud, mis-use, or unauthorized access arising from
          compromised credentials, compromised email, lost devices, shared accounts, malware,
          phishing, SIM-swap, or your failure to maintain reasonable security measures is your
          responsibility, not ours. Notify us immediately at security@goldfindesk.com if you
          suspect unauthorized access.
        </P>

        <H2>7a. No service-level agreement</H2>
        <P>
          The Service has no guaranteed uptime, latency, throughput, or response-time
          commitment. We may take the Service offline at any time, with or without notice, for
          maintenance, upgrades, migrations, security, regulatory compliance, business reasons,
          or no reason. No SLA is offered or implied.
        </P>

        <H2>8. Limitation of liability</H2>
        <P>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL GOLDFIN, ITS OWNERS,
          OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AGENTS, OR LICENSORS BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR
          ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, BUSINESS OPPORTUNITY, REPUTATION, OR
          ANTICIPATED SAVINGS, ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE
          SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND EVEN IF A LIMITED
          REMEDY FAILS OF ITS ESSENTIAL PURPOSE. OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS
          OF ANY KIND RELATING TO THE SERVICE IS LIMITED TO THE GREATER OF (A) FEES YOU PAID TO
          GOLDFIN IN THE THREE (3) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE
          CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS (USD $100). THESE LIMITS APPLY TO ALL THEORIES
          OF LIABILITY, INCLUDING CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, AND
          STATUTORY CLAIMS, AND APPLY TO THE FULLEST EXTENT PERMITTED BY LAW EVEN IN THE EVENT
          OF GROSS NEGLIGENCE OR WILLFUL MISCONDUCT BY ANY THIRD PARTY NAMED IN SECTION 6.
        </P>

        <H2>9. Indemnification</H2>
        <P>
          You agree to defend, indemnify, and hold harmless GoldFin and its personnel from and
          against any and all claims, damages, obligations, losses, liabilities, costs, and
          expenses (including reasonable attorneys' fees) arising from (a) your use of or
          access to the Service, (b) your violation of these Terms, (c) your violation of any
          third-party right, including any privacy or intellectual-property right, (d) any
          inaccurate, misleading, or unlawful information you provide, or (e) your failure to
          maintain reasonable security on your accounts, devices, or email.
        </P>

        <H2>10. Acceptable use</H2>
        <P>
          You may not use the Service to violate any law, infringe any right, transmit malware,
          attempt to gain unauthorized access to systems, reverse engineer or decompile the
          Service, scrape or resell our data, train any AI/ML model on data extracted from the
          Service, harass any person, or use the Service on behalf of someone whose accounts you
          are not lawfully authorized to view. We may suspend or terminate any account at any
          time, with or without notice, for any reason or no reason.
        </P>

        <H2>11. Termination</H2>
        <P>
          You may stop using the Service at any time by disconnecting your Plaid items and
          requesting account deletion. We may suspend or terminate your access at any time, in
          our sole discretion, with or without cause and with or without notice. Sections that
          by their nature should survive termination — including Sections 3 through 10, 12, and
          13 — survive termination.
        </P>

        <H2>11a. Sandbox and beta features</H2>
        <P>
          When the Service runs in Plaid's sandbox environment, all account, balance, and
          transaction data is synthetic test data generated by Plaid and is not your real
          financial information. Features labeled "beta," "preview," or "experimental" may
          change, break, or be removed at any time. We are not liable for any reliance on
          sandbox data or beta features.
        </P>

        <H2>11b. Data export on termination</H2>
        <P>
          For thirty (30) days after termination, you may request a one-time export of your
          stored data by emailing support@goldfindesk.com. After that window, your data may be
          irreversibly purged from active systems; we make no representation that backups can be
          restored or that purged data can be recovered.
        </P>

        <H2>12. Mandatory arbitration and class-action waiver</H2>
        <P>
          Any dispute, claim, or controversy arising out of or relating to these Terms or the
          Service will be resolved exclusively by binding, individual arbitration administered
          under the rules of a recognized arbitration provider in the Governing Jurisdiction
          (defined below), and not in court. YOU AND GOLDFIN EACH WAIVE THE RIGHT TO A TRIAL BY
          JURY AND THE RIGHT TO PARTICIPATE IN A CLASS ACTION, CLASS ARBITRATION, MASS
          ARBITRATION, PRIVATE-ATTORNEY-GENERAL ACTION, OR ANY OTHER REPRESENTATIVE PROCEEDING.
          If this Section is held unenforceable in whole or part, the unenforceable portion will
          be severed and the remainder will continue in effect.
        </P>

        <H2>13. Governing law and venue</H2>
        <P>
          These Terms are governed by the laws of the jurisdiction in which GoldFin is
          principally established (the "Governing Jurisdiction"), without regard to conflict-of-
          laws principles. Subject to Section 12, any action or proceeding that is not subject
          to arbitration must be brought exclusively in the state or federal courts located
          within the Governing Jurisdiction, and you irrevocably consent to personal
          jurisdiction there.
        </P>

        <H2>14. Changes to these Terms</H2>
        <P>
          We may revise these Terms at any time. Material revisions will be announced in the
          Service, and you must re-accept the updated Terms before continuing to use the
          Service. Continued use after re-acceptance constitutes agreement to the revised Terms.
          The current version is identified at the top of this document.
        </P>

        <H2>15. Entire agreement; severability</H2>
        <P>
          These Terms, together with the Plaid Data Consent and our Privacy Policy, constitute
          the entire agreement between you and GoldFin regarding the Service and supersede all
          prior or contemporaneous understandings. If any provision is held unenforceable, the
          remainder remains in full effect, and the unenforceable provision will be reformed
          only to the minimum extent needed to make it enforceable. No waiver is effective
          unless in writing and signed by GoldFin.
        </P>

        <H2>16. Contact</H2>
        <P>
          Questions about these Terms:{" "}
          <a href="mailto:legal@goldfindesk.com" className="underline">
            legal@goldfindesk.com
          </a>
          . Security or unauthorized-access reports:{" "}
          <a href="mailto:security@goldfindesk.com" className="underline">
            security@goldfindesk.com
          </a>
          .
        </P>
      </article>
    </main>
  );
}

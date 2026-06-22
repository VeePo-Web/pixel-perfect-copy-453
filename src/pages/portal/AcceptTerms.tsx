import { useEffect, useState } from "react";
import { AuthShell, PrimaryButton, useAsync, supabase } from "../../components/portal/AuthShell";
import { useAuth } from "../../contexts/AuthContext";
import { TOS_VERSION, PLAID_CONSENT_VERSION } from "../../lib/portal/tos";

/**
 * Forces the user to (re)accept current ToS + Plaid consent versions
 * before the portal will load.
 */
export default function AcceptTerms() {
  const { user, loading: authLoading } = useAuth();
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) window.location.assign("/portal/login");
  }, [authLoading, user]);

  const { run, loading, error } = useAsync(async () => {
    if (!user) throw new Error("Not signed in");
    if (!accept) throw new Error("You must accept the terms to continue");
    const { error } = await supabase.from("tos_acceptances").insert({
      user_id: user.id,
      tos_version: TOS_VERSION,
      plaid_consent_version: PLAID_CONSENT_VERSION,
      user_agent: navigator.userAgent,
    });
    if (error) throw error;
    window.location.assign("/portal");
  });

  return (
    <AuthShell title="Terms & Plaid consent">
      <p className="text-[13.5px] leading-relaxed text-ink/75">
        Before you can use the portal you need to acknowledge our current Terms of Service and
        Plaid Data Consent. These spell out — in plain English — that Goldfin Desk is read-only,
        is not your fiduciary, and is not liable for any breach, hack, outage, or loss involving
        Plaid, your financial institution, or any other third party.
      </p>
      <div className="mt-5 space-y-2 text-[12.5px]">
        <a
          href="/terms"
          target="_blank"
          className="block text-ink underline underline-offset-4"
        >
          Read Terms of Service (v{TOS_VERSION}) →
        </a>
        <a
          href="/plaid-consent"
          target="_blank"
          className="block text-ink underline underline-offset-4"
        >
          Read Plaid Data Consent (v{PLAID_CONSENT_VERSION}) →
        </a>
      </div>
      <label className="mt-6 flex items-start gap-2 text-[12.5px] text-ink/75">
        <input
          type="checkbox"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I have read and agree to the Terms of Service v{TOS_VERSION} and Plaid Data Consent v
          {PLAID_CONSENT_VERSION}. I understand my acceptance, IP address, and timestamp will be
          recorded.
        </span>
      </label>
      {error && <p className="mt-3 text-[12.5px] text-red-700">{error}</p>}
      <div className="mt-5">
        <PrimaryButton disabled={loading || !accept} onClick={run}>
          {loading ? "Saving…" : "Accept and continue"}
        </PrimaryButton>
      </div>
    </AuthShell>
  );
}

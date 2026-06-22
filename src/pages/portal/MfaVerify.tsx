import { useState } from "react";
import { AuthShell, Field, PrimaryButton, useAsync, supabase } from "../../components/portal/AuthShell";
import { TOS_VERSION, PLAID_CONSENT_VERSION } from "../../lib/portal/tos";

/**
 * Standalone MFA challenge page — not currently used in the auth flow
 * (Supabase password auth doesn't gate a second factor server-side without
 * AAL2 setup). Kept here for future per-session MFA prompts.
 */
export default function MfaVerify() {
  const [code, setCode] = useState("");
  const { run, loading, error } = useAsync(async () => {
    const { data, error } = await supabase.functions.invoke("mfa-verify", { body: { code } });
    if (error || (data as { error?: string })?.error) {
      throw new Error((data as { error?: string })?.error || error?.message || "Invalid code");
    }
    // After a successful MFA challenge, ensure TOS acceptance is current.
    const { data: tos } = await supabase
      .from("tos_acceptances")
      .select("tos_version")
      .order("accepted_at", { ascending: false })
      .limit(1);
    window.location.assign(
      tos?.[0]?.tos_version === TOS_VERSION ? "/portal" : "/portal/accept-terms",
    );
  });

  return (
    <AuthShell title="Two-factor verification">
      <p className="mb-4 text-[13px] text-ink/60">
        Enter a code from your authenticator app, or a backup code.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="space-y-4"
      >
        <Field
          label="Code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
        {error && <p className="text-[12.5px] text-red-700">{error}</p>}
        <PrimaryButton disabled={loading}>{loading ? "Verifying…" : "Verify"}</PrimaryButton>
      </form>
      <p className="mt-6 text-[11px] text-ink/40">
        Consent versions in effect — ToS {TOS_VERSION}, Plaid {PLAID_CONSENT_VERSION}.
      </p>
    </AuthShell>
  );
}

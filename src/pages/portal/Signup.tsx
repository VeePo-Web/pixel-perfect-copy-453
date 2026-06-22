import { useState } from "react";
import { AuthShell, Field, PrimaryButton, useAsync, supabase } from "../../components/portal/AuthShell";

export default function PortalSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [accept, setAccept] = useState(false);
  const [done, setDone] = useState(false);

  const { run, loading, error } = useAsync(async () => {
    if (!accept) throw new Error("You must accept the Terms and Plaid consent.");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal/login`,
        data: { first_name: first, last_name: last },
      },
    });
    if (error) throw error;
    setDone(true);
  });

  if (done) {
    return (
      <AuthShell title="Check your email">
        <p className="text-[14px] leading-relaxed text-ink/70">
          We sent a confirmation link to <strong className="text-ink">{email}</strong>. Click it to
          activate your account, then sign in.
        </p>
        <div className="mt-6">
          <a href="/portal/login" className="text-[13px] text-ink underline underline-offset-4">
            Back to sign in
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your portal account"
      footer={
        <>
          Already have an account?{" "}
          <a href="/portal/login" className="text-ink underline underline-offset-4">
            Sign in
          </a>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" required value={first} onChange={(e) => setFirst(e.target.value)} />
          <Field label="Last name" required value={last} onChange={(e) => setLast(e.target.value)} />
        </div>
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field
          label="Password"
          type="password"
          required
          minLength={10}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-[11.5px] text-ink/50">
          Minimum 10 characters. We check against known leaked passwords.
        </p>
        <label className="flex items-start gap-2 text-[12.5px] text-ink/70">
          <input
            type="checkbox"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            I have read and agree to the{" "}
            <a href="/terms" target="_blank" className="text-ink underline underline-offset-4">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/plaid-consent" target="_blank" className="text-ink underline underline-offset-4">
              Plaid Data Consent
            </a>
            . I understand Goldfin Desk is read-only, is not a fiduciary, and bears no liability
            for hacks, breaches, or losses affecting Plaid, my bank, or other third parties.
          </span>
        </label>
        {error && <p className="text-[12.5px] text-red-700">{error}</p>}
        <PrimaryButton disabled={loading || !accept}>
          {loading ? "Creating…" : "Create account"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}

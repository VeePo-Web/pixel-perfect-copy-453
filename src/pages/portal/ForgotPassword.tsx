import { useState } from "react";
import { AuthShell, Field, PrimaryButton, useAsync, supabase } from "../../components/portal/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { run, loading, error } = useAsync(async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    if (error) throw error;
    setSent(true);
  });

  if (sent) {
    return (
      <AuthShell title="Check your email">
        <p className="text-[14px] text-ink/70">
          If an account exists for {email}, a password reset link is on its way.
        </p>
      </AuthShell>
    );
  }
  return (
    <AuthShell
      title="Reset your password"
      footer={
        <a href="/portal/login" className="text-ink underline underline-offset-4">
          Back to sign in
        </a>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="space-y-4"
      >
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="text-[12.5px] text-red-700">{error}</p>}
        <PrimaryButton disabled={loading}>{loading ? "Sending…" : "Send reset link"}</PrimaryButton>
      </form>
    </AuthShell>
  );
}

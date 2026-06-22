import { useState } from "react";
import { AuthShell, Field, PrimaryButton, useAsync, supabase } from "../../components/portal/AuthShell";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { run, loading, error } = useAsync(async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    window.location.assign("/portal");
  });

  return (
    <AuthShell
      title="Sign in to your portal"
      footer={
        <>
          New here?{" "}
          <a href="/portal/signup" className="text-ink underline underline-offset-4">
            Create an account
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
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-[12.5px] text-red-700">{error}</p>}
        <PrimaryButton disabled={loading}>{loading ? "Signing in…" : "Sign in"}</PrimaryButton>
        <div className="text-center text-[12.5px]">
          <a href="/portal/forgot-password" className="text-ink/55 hover:text-ink">
            Forgot password?
          </a>
        </div>
      </form>
    </AuthShell>
  );
}

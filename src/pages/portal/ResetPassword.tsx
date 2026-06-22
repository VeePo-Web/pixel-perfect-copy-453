import { useEffect, useState } from "react";
import { AuthShell, Field, PrimaryButton, useAsync, supabase } from "../../components/portal/AuthShell";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase parses recovery params from URL hash automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const { run, loading, error } = useAsync(async () => {
    if (password !== confirm) throw new Error("Passwords do not match");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    setDone(true);
  });

  if (done) {
    return (
      <AuthShell title="Password updated">
        <a href="/portal/login" className="text-[13px] text-ink underline underline-offset-4">
          Sign in
        </a>
      </AuthShell>
    );
  }
  return (
    <AuthShell title="Set a new password">
      {!ready ? (
        <p className="text-[13px] text-ink/55">Validating your reset link…</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className="space-y-4"
        >
          <Field
            label="New password"
            type="password"
            required
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Field
            label="Confirm password"
            type="password"
            required
            minLength={10}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error && <p className="text-[12.5px] text-red-700">{error}</p>}
          <PrimaryButton disabled={loading}>{loading ? "Saving…" : "Update password"}</PrimaryButton>
        </form>
      )}
    </AuthShell>
  );
}

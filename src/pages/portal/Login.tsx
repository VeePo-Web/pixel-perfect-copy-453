import { useCallback, useEffect, useState } from "react";
import { AuthShell, Field, PrimaryButton, supabase } from "../../components/portal/AuthShell";
import PortalOtpVerify from "../../components/portal/PortalOtpVerify";
import { useLoginOtp } from "../../hooks/useLoginOtp";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

type Stage = "credentials" | "otp";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const [stage, setStage] = useState<Stage>("credentials");
  const { sendOtp, isSending } = useLoginOtp();

  useEffect(() => {
    if (!lockoutUntil) return;
    const t = setInterval(() => {
      const remaining = Math.max(0, lockoutUntil - Date.now());
      setLockoutRemaining(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
      }
    }, 250);
    return () => clearInterval(t);
  }, [lockoutUntil]);

  const isLockedOut = !!lockoutUntil && Date.now() < lockoutUntil;

  const onCapsKey = useCallback((e: React.KeyboardEvent) => {
    setCapsLock(e.getModifierState("CapsLock"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    setLoading(true);
    setError(null);
    try {
      const { error: signErr, data } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr || !data.user) {
        const next = failedAttempts + 1;
        setFailedAttempts(next);
        if (next >= MAX_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_MS);
          setError("Too many failed attempts. Try again in 30 seconds.");
        } else {
          setError(
            `${signErr?.message || "Invalid credentials"}${
              next >= 3 ? ` · ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next === 1 ? "" : "s"} remaining` : ""
            }`,
          );
        }
        setLoading(false);
        return;
      }
      setFailedAttempts(0);
      const r = await sendOtp(email, data.user.id);
      if (!r.success) {
        setError(r.error);
        setLoading(false);
        return;
      }
      setStage("otp");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    window.location.assign("/portal");
  };

  const handleOtpCancel = async () => {
    await supabase.auth.signOut();
    setStage("credentials");
    setPassword("");
  };

  const handleResend = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return { success: false, error: "Session expired. Please sign in again." };
    return sendOtp(email, data.user.id);
  };

  if (stage === "otp") {
    return (
      <PortalOtpVerify
        email={email}
        onSuccess={handleOtpSuccess}
        onCancel={handleOtpCancel}
        onResend={handleResend}
      />
    );
  }

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLockedOut || loading || isSending}
        />
        <Field
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onCapsKey}
          onKeyUp={onCapsKey}
          disabled={isLockedOut || loading || isSending}
        />
        {capsLock && (
          <p className="text-[12px] text-amber-600">⚠ Caps Lock is on</p>
        )}
        {error && <p className="text-[12.5px] text-red-700">{error}</p>}
        {isLockedOut && (
          <p className="text-[12.5px] text-red-700">
            Locked out. Try again in {lockoutRemaining}s.
          </p>
        )}
        <PrimaryButton disabled={loading || isSending || isLockedOut}>
          {loading
            ? "Signing in…"
            : isSending
              ? "Sending code…"
              : isLockedOut
                ? `Locked (${lockoutRemaining}s)`
                : "Sign in"}
        </PrimaryButton>
        <div className="text-center text-[12.5px]">
          <a href="/portal/forgot-password" className="text-ink/55 hover:text-ink">
            Forgot password?
          </a>
        </div>
        <p className="text-center text-[11.5px] text-ink/45">
          Email verification required for security.
        </p>
      </form>
    </AuthShell>
  );
}

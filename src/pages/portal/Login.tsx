import { useEffect, useState } from "react";
import { AuthShell, Field, PrimaryButton, supabase } from "../../components/portal/AuthShell";
import { useLoginOtp } from "../../hooks/useLoginOtp";
import { lovable } from "../../integrations/lovable";

type Stage = "entry" | "otp";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("entry");
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  const { sendOtp, verifyOtp, isSending, isVerifying } = useLoginOtp();
  const code = digits.join("");
  const masked = email.replace(/(.{2})(.*)(@.*)/, "$1•••$3");

  // If already signed in, bounce straight in.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.assign("/portal");
    });
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (stage !== "otp" || code.length !== 6 || isVerifying) return;
    (async () => {
      setOtpError(null);
      const r = await verifyOtp(email, code);
      if (r.success) {
        window.location.assign("/portal");
      } else {
        setOtpError(r.error);
        setDigits(["", "", "", "", "", ""]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, stage]);

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/portal/login`,
    });
    if (result.error) {
      setError(result.error.message || "Google sign-in failed");
      setGoogleLoading(false);
      return;
    }
    if (result.redirected) return;
    window.location.assign("/portal");
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const r = await sendOtp(email);
    if (!r.success) {
      setError(r.error);
      return;
    }
    setStage("otp");
    setResendCooldown(60);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtpError(null);
    const r = await sendOtp(email);
    if (r.success) setResendCooldown(60);
    else setOtpError(r.error);
  };

  if (stage === "otp") {
    return (
      <AuthShell title="Check your email">
        <p className="text-[13.5px] text-ink/65">
          We sent a 6-digit code to <strong className="text-ink">{masked}</strong>. It expires in 10 minutes.
        </p>
        <div className="mt-6 flex gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              disabled={isVerifying}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(-1);
                const next = [...digits];
                next[i] = v;
                setDigits(next);
                if (v && i < 5) {
                  const el = document.getElementById(`d${i + 1}`) as HTMLInputElement | null;
                  el?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) {
                  const el = document.getElementById(`d${i - 1}`) as HTMLInputElement | null;
                  el?.focus();
                }
              }}
              onPaste={(e) => {
                const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                if (t.length === 6) {
                  e.preventDefault();
                  setDigits(t.split(""));
                }
              }}
              id={`d${i}`}
              aria-label={`Digit ${i + 1}`}
              className="h-12 w-full rounded-lg border border-ink/15 bg-paper text-center text-[18px] font-medium text-ink outline-none focus:border-ink/50 disabled:opacity-50"
            />
          ))}
        </div>
        {otpError && <p className="mt-4 text-center text-[13px] text-red-700">{otpError}</p>}
        {isVerifying && <p className="mt-4 text-center text-[12.5px] text-ink/55">Verifying…</p>}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setStage("entry");
              setDigits(["", "", "", "", "", ""]);
              setOtpError(null);
            }}
            className="text-[12.5px] text-ink/55 hover:text-ink"
          >
            ← Use a different email
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isSending}
            className="text-[12.5px] text-ink/55 underline underline-offset-4 hover:text-ink disabled:no-underline disabled:opacity-50"
          >
            {isSending ? "Sending…" : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Sign in to GoldFin Desk">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/15 bg-paper py-2.5 text-[13.5px] font-medium text-ink hover:bg-ink/5 disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
          <path fill="#FBBC05" d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 .96 4.96L3.97 7.3C4.68 5.18 6.66 3.58 9 3.58z" />
        </svg>
        {googleLoading ? "Opening Google…" : "Continue with Google"}
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/10" />
        <span className="text-[11px] uppercase tracking-wider text-ink/45">or</span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <form onSubmit={handleEmail} className="space-y-4">
        <Field
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSending}
          placeholder="you@company.com"
        />
        {error && <p className="text-[12.5px] text-red-700">{error}</p>}
        <PrimaryButton disabled={isSending || !email}>
          {isSending ? "Sending code…" : "Email me a code"}
        </PrimaryButton>
        <p className="text-center text-[11.5px] text-ink/45">
          We'll email a 6-digit code to sign you in. No password.
        </p>
      </form>
    </AuthShell>
  );
}

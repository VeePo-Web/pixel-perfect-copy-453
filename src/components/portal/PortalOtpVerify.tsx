import { useEffect, useRef, useState } from "react";
import { useLoginOtp } from "../../hooks/useLoginOtp";

type Props = {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
  onResend: () => Promise<{ success: boolean; error?: string }>;
};

/** 6-slot OTP input + auto-submit + masked email + resend cooldown. */
export default function PortalOtpVerify({ email, onSuccess, onCancel, onResend }: Props) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const { verifyOtp, isVerifying } = useLoginOtp();

  const code = digits.join("");
  const masked = email.replace(/(.{2})(.*)(@.*)/, "$1•••$3");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (code.length === 6 && !isVerifying) {
      (async () => {
        setError(null);
        const r = await verifyOtp(email, code);
        if (r.success) {
          onSuccess();
        } else {
          setError(r.error);
          if (typeof r.remainingAttempts === "number") setRemainingAttempts(r.remainingAttempts);
          setDigits(["", "", "", "", "", ""]);
          refs.current[0]?.focus();
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const setAt = (i: number, v: string) => {
    const next = [...digits];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setDigits(next);
    if (next[i] && i < 5) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      e.preventDefault();
      setDigits(text.split(""));
      refs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    setError(null);
    setRemainingAttempts(null);
    const r = await onResend();
    setIsResending(false);
    if (r.success) setResendCooldown(60);
    else setError(r.error || "Failed to resend code");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal-950 px-6 py-12">
      <div className="w-full max-w-sm">
        <a href="/" className="font-zentry text-[20px] tracking-wide text-ink">
          GOLDFIN DESK
        </a>
        <div className="mt-10 rounded-2xl border border-ink/10 bg-paper p-8 shadow-sm">
          <h1 className="text-[22px] font-medium text-ink">Check your email</h1>
          <p className="mt-2 text-[13.5px] text-ink/65">
            We sent a 6-digit code to <strong className="text-ink">{masked}</strong>. It expires in
            10 minutes.
          </p>

          <div className="mt-6 flex gap-2" onPaste={onPaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                disabled={isVerifying}
                onChange={(e) => setAt(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                aria-label={`Digit ${i + 1}`}
                className="h-12 w-full rounded-lg border border-ink/15 bg-paper text-center text-[18px] font-medium text-ink outline-none focus:border-ink/50 disabled:opacity-50"
              />
            ))}
          </div>

          {error && (
            <div className="mt-4 text-center">
              <p className="text-[13px] text-red-700">{error}</p>
              {remainingAttempts !== null && remainingAttempts > 0 && (
                <p className="mt-1 text-[12px] text-ink/55">
                  {remainingAttempts} attempt{remainingAttempts === 1 ? "" : "s"} remaining
                </p>
              )}
            </div>
          )}

          {isVerifying && (
            <p className="mt-4 text-center text-[12.5px] text-ink/55">Verifying…</p>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="text-[12.5px] text-ink/55 underline underline-offset-4 hover:text-ink disabled:no-underline disabled:opacity-50"
            >
              {isResending
                ? "Sending…"
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Didn't receive it? Resend"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-[12.5px] text-ink/55 hover:text-ink"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </main>
  );
}

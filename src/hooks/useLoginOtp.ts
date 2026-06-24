import { useCallback, useState } from "react";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type SendResult = { success: true; expiresAt: string } | { success: false; error: string };
type VerifyResult =
  | { success: true }
  | { success: false; error: string; remainingAttempts?: number };

/** Thin client around send-login-otp / verify-login-otp. */
export function useLoginOtp() {
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendOtp = useCallback(async (email: string, userId: string): Promise<SendResult> => {
    setIsSending(true);
    try {
      const res = await fetch(`${FN_URL}/send-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON },
        body: JSON.stringify({ email, userId }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Failed to send code" };
      return { success: true, expiresAt: data.expiresAt };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsSending(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, code: string): Promise<VerifyResult> => {
    setIsVerifying(true);
    try {
      const res = await fetch(`${FN_URL}/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || "Verification failed",
          remainingAttempts: data.remainingAttempts,
        };
      }
      // Mark portal session OTP-verified (24h window).
      try {
        localStorage.setItem(
          "gf_otp_verified_at",
          JSON.stringify({ email, at: Date.now() }),
        );
      } catch {
        /* ignore */
      }
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return { sendOtp, verifyOtp, isSending, isVerifying };
}

/** Returns true if this device verified an OTP for the given email within 24h. */
export function isOtpVerifiedFor(email: string | null | undefined): boolean {
  if (!email) return false;
  try {
    const raw = localStorage.getItem("gf_otp_verified_at");
    if (!raw) return false;
    const { email: e, at } = JSON.parse(raw) as { email: string; at: number };
    if (e !== email) return false;
    return Date.now() - at < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function clearOtpVerified() {
  try {
    localStorage.removeItem("gf_otp_verified_at");
  } catch {
    /* ignore */
  }
}

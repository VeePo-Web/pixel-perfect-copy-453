import { useCallback, useState } from "react";
import { supabase } from "../integrations/supabase/client";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type SendResult = { success: true; expiresAt: string } | { success: false; error: string };
type VerifyResult =
  | { success: true }
  | { success: false; error: string; remainingAttempts?: number };

/**
 * Passwordless email-OTP client. Calls our custom send/verify edge functions.
 * verifyOtp returns a token_hash the client redeems with Supabase to mint a
 * real session (no password needed).
 */
export function useLoginOtp() {
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendOtp = useCallback(async (email: string): Promise<SendResult> => {
    setIsSending(true);
    try {
      const res = await fetch(`${FN_URL}/send-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON },
        body: JSON.stringify({ email }),
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
      // Server returned a magic-link token_hash; redeem it to mint a real session.
      if (data.token_hash) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: data.token_hash,
          type: "magiclink",
        });
        if (error) return { success: false, error: error.message };
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

import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../integrations/supabase/client";
import { TOS_VERSION } from "../../lib/portal/tos";
import { isOtpVerifiedFor, clearOtpVerified } from "../../hooks/useLoginOtp";
import AuthLoadingScreen from "./AuthLoadingScreen";

type Gate = "loading" | "no-session" | "needs-otp" | "needs-tos" | "ok";

/**
 * Wraps any /portal page. Enforces, in order:
 *   1. Active Supabase session.
 *   2. Email-OTP verified within the last 24h on this device.
 *   3. Latest Terms accepted.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const [gate, setGate] = useState<Gate>("loading");

  useEffect(() => {
    if (loading) return;
    if (!session) {
      setGate("no-session");
      return;
    }
    if (!isOtpVerifiedFor(session.user.email)) {
      // Force a fresh sign-in so a new OTP can be issued.
      clearOtpVerified();
      supabase.auth.signOut().finally(() => setGate("needs-otp"));
      return;
    }
    (async () => {
      const { data: tos } = await supabase
        .from("tos_acceptances")
        .select("tos_version")
        .eq("user_id", session.user.id)
        .order("accepted_at", { ascending: false })
        .limit(1);
      const accepted = tos?.[0]?.tos_version === TOS_VERSION;
      setGate(accepted ? "ok" : "needs-tos");
    })();
  }, [session, loading]);

  useEffect(() => {
    if (gate === "no-session" || gate === "needs-otp")
      window.location.assign("/portal/login");
    if (gate === "needs-tos") window.location.assign("/portal/accept-terms");
  }, [gate]);

  if (gate !== "ok") return <AuthLoadingScreen />;
  return <>{children}</>;
}

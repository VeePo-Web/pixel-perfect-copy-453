import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../integrations/supabase/client";
import { TOS_VERSION } from "../../lib/portal/tos";

type Gate = "loading" | "no-session" | "needs-mfa" | "needs-tos" | "ok";

/**
 * Wraps any /portal page. Enforces:
 *  1) Active session.
 *  2) MFA enrolled (else redirect to /portal/mfa-setup).
 *  3) Latest TOS accepted (else redirect to /portal/accept-terms).
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
    (async () => {
      const [{ data: mfa }, { data: tos }] = await Promise.all([
        supabase.rpc("mfa_status", { _user_id: session.user.id }),
        supabase
          .from("tos_acceptances")
          .select("tos_version")
          .eq("user_id", session.user.id)
          .order("accepted_at", { ascending: false })
          .limit(1),
      ]);
      const mfaEnabled = Array.isArray(mfa) ? mfa[0]?.enabled : false;
      if (!mfaEnabled) {
        setGate("needs-mfa");
        return;
      }
      const accepted = tos?.[0]?.tos_version === TOS_VERSION;
      if (!accepted) {
        setGate("needs-tos");
        return;
      }
      setGate("ok");
    })();
  }, [session, loading]);

  useEffect(() => {
    if (gate === "no-session") window.location.assign("/portal/login");
    if (gate === "needs-mfa") window.location.assign("/portal/mfa-setup");
    if (gate === "needs-tos") window.location.assign("/portal/accept-terms");
  }, [gate]);

  if (gate !== "ok") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal-950 text-ink/60">
        <div className="text-sm tracking-wide">Loading portal…</div>
      </div>
    );
  }
  return <>{children}</>;
}

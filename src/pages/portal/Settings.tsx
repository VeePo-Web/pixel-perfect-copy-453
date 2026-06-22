import { useEffect, useState } from "react";
import PortalLayout from "../../components/portal/PortalLayout";
import ProtectedRoute from "../../components/portal/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../integrations/supabase/client";

export default function Settings() {
  const { user } = useAuth();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [mfaStatus, setMfaStatus] = useState<{ enabled: boolean; unused_backup_codes: number } | null>(
    null,
  );

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setFirst(data.first_name ?? "");
        setLast(data.last_name ?? "");
        setPhone(data.phone ?? "");
      }
      const { data: mfa } = await supabase.rpc("mfa_status", { _user_id: user.id });
      if (Array.isArray(mfa) && mfa[0]) setMfaStatus(mfa[0]);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .upsert({ id: user.id, first_name: first, last_name: last, phone, email: user.email });
    setSavedAt(new Date().toLocaleTimeString());
  };

  return (
    <ProtectedRoute>
      <PortalLayout active="/portal/settings">
        <h1 className="text-[28px] font-medium text-ink">Settings</h1>

        <section className="mt-8 rounded-2xl border border-ink/10 bg-paper p-6">
          <h2 className="text-[16px] font-medium text-ink">Profile</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <input
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="First name"
              className="rounded-lg border border-ink/15 px-3 py-2 text-[14px]"
            />
            <input
              value={last}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Last name"
              className="rounded-lg border border-ink/15 px-3 py-2 text-[14px]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="col-span-2 rounded-lg border border-ink/15 px-3 py-2 text-[14px]"
            />
          </div>
          <button
            onClick={save}
            className="mt-4 rounded-full bg-ink px-5 py-2 text-[12.5px] font-medium text-paper"
          >
            Save profile
          </button>
          {savedAt && <span className="ml-3 text-[12px] text-green-deep">Saved at {savedAt}</span>}
        </section>

        <section className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
          <h2 className="text-[16px] font-medium text-ink">Two-factor authentication</h2>
          {mfaStatus ? (
            <p className="mt-2 text-[13px] text-ink/65">
              Status: <strong>{mfaStatus.enabled ? "Enabled" : "Not enabled"}</strong> · Unused
              backup codes: {mfaStatus.unused_backup_codes}
            </p>
          ) : (
            <p className="mt-2 text-[13px] text-ink/55">Loading…</p>
          )}
          <a
            href="/portal/mfa-setup"
            className="mt-3 inline-block text-[12.5px] text-ink underline underline-offset-4"
          >
            Regenerate authenticator & backup codes →
          </a>
        </section>

        <section className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
          <h2 className="text-[16px] font-medium text-ink">Password</h2>
          <a
            href="/portal/forgot-password"
            className="mt-3 inline-block text-[12.5px] text-ink underline underline-offset-4"
          >
            Send password reset email →
          </a>
        </section>
      </PortalLayout>
    </ProtectedRoute>
  );
}

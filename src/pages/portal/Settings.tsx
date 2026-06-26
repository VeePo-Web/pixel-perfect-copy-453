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
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletionRequestedAt, setDeletionRequestedAt] = useState<string | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data }, { data: role }] = await Promise.all([
        supabase.from("profiles").select("first_name, last_name, phone, deletion_requested_at").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle(),
      ]);
      if (data) {
        setFirst(data.first_name ?? "");
        setLast(data.last_name ?? "");
        setPhone(data.phone ?? "");
        setDeletionRequestedAt((data as { deletion_requested_at?: string | null }).deletion_requested_at ?? null);
      }
      setIsAdmin(!!role);
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
          <h2 className="text-[16px] font-medium text-ink">Sign-in security</h2>
          <p className="mt-2 text-[13px] text-ink/65">
            You sign in with Google or a 6-digit code emailed to you. No passwords.
            Codes expire in 10 minutes.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
          <h2 className="text-[16px] font-medium text-ink">Your data</h2>
          <p className="mt-2 text-[13px] text-ink/65">
            GoldFin Desk follows a documented{" "}
            <a href="/data-retention" className="underline" target="_blank" rel="noreferrer">
              Data Retention &amp; Deletion Policy
            </a>
            . You can permanently delete your account and all linked data at any time.
          </p>

          {deletionRequestedAt ? (
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-[13px] text-amber-900">
              Your account is scheduled for permanent deletion on{" "}
              <strong>
                {new Date(new Date(deletionRequestedAt).getTime() + 30 * 86_400_000).toLocaleDateString()}
              </strong>
              . Plaid connections have been revoked and any subscription will cancel at period end.
              <div className="mt-3">
                <button
                  disabled={deleteBusy}
                  onClick={async () => {
                    setDeleteBusy(true); setDeleteMsg(null);
                    const { error } = await supabase.functions.invoke("account-delete-request", { body: { cancel: true } });
                    setDeleteBusy(false);
                    if (error) { setDeleteMsg(error.message); return; }
                    setDeletionRequestedAt(null);
                    setDeleteMsg("Deletion request cancelled.");
                  }}
                  className="rounded-full bg-ink px-4 py-1.5 text-[12px] font-medium text-paper disabled:opacity-50"
                >
                  Cancel deletion request
                </button>
              </div>
            </div>
          ) : (
            <button
              disabled={deleteBusy}
              onClick={async () => {
                if (!confirm("Permanently delete your account?\n\nWe will revoke every bank connection immediately and hard-delete all your data after a 30-day grace window. You can cancel during that window by signing back in.")) return;
                setDeleteBusy(true); setDeleteMsg(null);
                const { data, error } = await supabase.functions.invoke("account-delete-request", { body: {} });
                setDeleteBusy(false);
                if (error) { setDeleteMsg(error.message); return; }
                setDeletionRequestedAt(new Date().toISOString());
                setDeleteMsg((data as { message?: string })?.message ?? "Request received.");
              }}
              className="mt-4 rounded-full border border-red-300 bg-white px-5 py-2 text-[12.5px] font-medium text-red-700 disabled:opacity-50"
            >
              {deleteBusy ? "Working…" : "Delete my account & data"}
            </button>
          )}
          {deleteMsg && <p className="mt-2 text-[12px] text-ink/70">{deleteMsg}</p>}
        </section>

        {isAdmin && (
          <section className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
            <h2 className="text-[16px] font-medium text-ink">Admin</h2>
            <p className="mt-2 text-[13px] text-ink/65">Internal lifecycle dashboard.</p>
            <a href="/portal/admin/audit" className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-[12.5px] font-medium text-paper">
              Open audit dashboard →
            </a>
          </section>
        )}

      </PortalLayout>
    </ProtectedRoute>
  );
}

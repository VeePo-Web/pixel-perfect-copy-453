import { useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import PlaidLinkButton from "./PlaidLinkButton";

type Account = {
  id: string;
  name: string | null;
  mask: string | null;
  type: string | null;
  subtype: string | null;
  current_balance: number | null;
  iso_currency_code: string | null;
};

export type ItemWithAccounts = {
  id: string;
  institution_name: string | null;
  status: string;
  last_synced_at: string | null;
  accounts: Account[];
};

export default function AccountCard({
  item,
  onChange,
}: {
  item: ItemWithAccounts;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const sync = async () => {
    setBusy(true);
    await supabase.functions.invoke("plaid-sync-accounts", { body: { itemId: item.id } });
    setBusy(false);
    onChange();
  };

  const remove = async () => {
    if (!confirm("Disconnect this institution? Goldfin will lose access immediately.")) return;
    setBusy(true);
    await supabase.functions.invoke("plaid-remove-item", { body: { itemId: item.id } });
    setBusy(false);
    onChange();
  };

  const needsReauth = item.status === "reauth_required";

  return (
    <section className="rounded-2xl border border-ink/10 bg-paper p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-medium text-ink">
            {item.institution_name || "Connected institution"}
          </h3>
          <p className="mt-1 text-[12px] text-ink/55">
            {item.accounts.length} account{item.accounts.length === 1 ? "" : "s"} ·{" "}
            {item.last_synced_at
              ? `Synced ${new Date(item.last_synced_at).toLocaleString()}`
              : "Not yet synced"}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            needsReauth
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-deep"
          }`}
        >
          {needsReauth ? "Re-auth required" : "Active"}
        </span>
      </div>

      <ul className="mt-4 divide-y divide-ink/5 border-t border-ink/5">
        {item.accounts.map((a) => (
          <li key={a.id} className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-ink">
              {a.name} <span className="text-ink/45">··{a.mask}</span>
            </span>
            <span className="font-medium tabular-nums text-ink">
              {a.current_balance != null
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: a.iso_currency_code || "USD",
                  }).format(a.current_balance)
                : "—"}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {needsReauth ? (
          <PlaidLinkButton mode="update" itemId={item.id} label="Re-authenticate" onConnected={onChange} />
        ) : (
          <button
            onClick={sync}
            disabled={busy}
            className="rounded-full border border-ink/15 px-5 py-2 text-[12.5px] text-ink hover:bg-ink/5 disabled:opacity-40"
          >
            {busy ? "Working…" : "Refresh balances"}
          </button>
        )}
        <button
          onClick={remove}
          disabled={busy}
          className="text-[12.5px] text-ink/55 hover:text-red-700"
        >
          Disconnect
        </button>
      </div>
    </section>
  );
}

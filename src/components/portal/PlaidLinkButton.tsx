import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { supabase } from "../../integrations/supabase/client";

type Props = {
  mode?: "create" | "update";
  itemId?: string;
  label?: string;
  onConnected?: () => void;
  disabled?: boolean;
};

/**
 * Opens Plaid Link. For "update" mode pass the local plaid_items.id of the
 * item being re-authenticated. Server resolves the access token securely.
 */
export default function PlaidLinkButton({
  mode = "create",
  itemId,
  label,
  onConnected,
  disabled,
}: Props) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("plaid-create-link-token", {
        body: { mode, itemId },
      });
      if (!alive) return;
      if (error || (data as { error?: string })?.error) {
        setError((data as { error?: string })?.error || error?.message || "Failed");
      } else {
        setLinkToken((data as { linkToken: string }).linkToken);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [mode, itemId]);

  const onSuccess = useCallback(
    async (publicToken: string, metadata: { institution?: { institution_id?: string; name?: string } | null }) => {
      if (mode === "update") {
        // Update mode does not return a new access token; just re-sync.
        await supabase.functions.invoke("plaid-sync-accounts", { body: { itemId } });
        onConnected?.();
        return;
      }
      const { data, error } = await supabase.functions.invoke("plaid-exchange-public-token", {
        body: {
          publicToken,
          institution: metadata?.institution
            ? { id: metadata.institution.institution_id, name: metadata.institution.name }
            : undefined,
        },
      });
      if (error || (data as { error?: string })?.error) {
        setError((data as { error?: string })?.error || error?.message || "Failed");
        return;
      }
      onConnected?.();
    },
    [mode, itemId, onConnected],
  );

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

  return (
    <div>
      <button
        type="button"
        disabled={disabled || loading || !ready || !linkToken}
        onClick={() => open()}
        className="rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper disabled:opacity-40 hover:bg-ink/90"
      >
        {loading ? "Preparing…" : label || (mode === "update" ? "Re-authenticate" : "Connect a bank")}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-[12px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

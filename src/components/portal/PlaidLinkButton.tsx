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
  const [status, setStatus] = useState<"idle" | "exchanging" | "connected">("idle");
  const [refreshKey, setRefreshKey] = useState(0);

  const storageKey = `plaid_link_token:${mode}:${itemId ?? "new"}`;
  const isOAuthReturn =
    typeof window !== "undefined" && window.location.search.includes("oauth_state_id=");

  useEffect(() => {
    let alive = true;
    (async () => {
      // On OAuth return, reuse the link token saved before redirect.
      if (isOAuthReturn) {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          setLinkToken(stored);
          return;
        }
      }
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.functions.invoke("plaid-create-link-token", {
        body: { mode, itemId },
      });
      if (!alive) return;
      if (error || (data as { error?: string })?.error) {
        setError((data as { error?: string })?.error || error?.message || "Failed to start Plaid");
      } else {
        const tok = (data as { linkToken: string }).linkToken;
        setLinkToken(tok);
        try { sessionStorage.setItem(storageKey, tok); } catch { /* ignore */ }
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [mode, itemId, refreshKey, isOAuthReturn, storageKey]);


  const onSuccess = useCallback(
    async (publicToken: string, metadata: { institution?: { institution_id?: string; name?: string } | null }) => {
      setStatus("exchanging");
      setError(null);
      try { sessionStorage.removeItem(storageKey); } catch { /* ignore */ }
      if (mode === "update") {
        const { error } = await supabase.functions.invoke("plaid-sync-accounts", { body: { itemId } });
        if (error) {
          setError(error.message);
          setStatus("idle");
          return;
        }
        setStatus("connected");
        onConnected?.();
        setTimeout(() => {
          setStatus("idle");
          setRefreshKey((k) => k + 1);
        }, 1500);
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
        setError((data as { error?: string })?.error || error?.message || "Failed to connect");
        setStatus("idle");
        return;
      }
      setStatus("connected");
      onConnected?.();
      setTimeout(() => {
        setStatus("idle");
        setRefreshKey((k) => k + 1);
      }, 1500);
    },
    [mode, itemId, onConnected, storageKey],
  );

  const onExit = useCallback(
    (err: { error_message?: string; display_message?: string } | null) => {
      if (err) {
        setError(err.display_message || err.error_message || "Plaid Link was closed");
      }
      try { sessionStorage.removeItem(storageKey); } catch { /* ignore */ }
      setRefreshKey((k) => k + 1);
    },
    [storageKey],
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
    receivedRedirectUri: isOAuthReturn ? window.location.href : undefined,
  });

  // Auto-resume Plaid Link after an OAuth bank redirect.
  useEffect(() => {
    if (isOAuthReturn && ready && linkToken) {
      open();
    }
  }, [isOAuthReturn, ready, linkToken, open]);

  const handleOpen = () => {
    if (linkToken) {
      try { sessionStorage.setItem(storageKey, linkToken); } catch { /* ignore */ }
    }
    open();
  };


  const buttonLabel =
    status === "exchanging"
      ? "Connecting…"
      : status === "connected"
      ? "Connected ✓"
      : loading
      ? "Preparing…"
      : label || (mode === "update" ? "Re-authenticate" : "Connect a bank");

  return (
    <div>
      <button
        type="button"
        disabled={disabled || loading || !ready || !linkToken || status !== "idle"}
        onClick={handleOpen}
        className="rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper disabled:opacity-40 hover:bg-ink/90"
      >
        {buttonLabel}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-[12px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}


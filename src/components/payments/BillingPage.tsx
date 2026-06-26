import { useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { getStripeEnvironment } from "../../lib/stripe";

/**
 * Self-serve billing portal entry. Site has no user auth yet, so buyers
 * authenticate by entering the email they paid with. Once the edge function
 * finds a matching customer, it mints a Stripe Billing Portal URL.
 */
export default function BillingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("create-portal-session", {
        body: {
          email: email.trim().toLowerCase(),
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/billing`,
        },
      });
      if (invokeError) throw new Error(invokeError.message);
      const url = (data as { url?: string; error?: string } | null)?.url;
      const errMsg = (data as { error?: string } | null)?.error;
      if (errMsg) throw new Error(errMsg);
      if (!url) throw new Error("No portal URL returned");
      window.open(url, "_blank", "noopener");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't open billing portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-charcoal-950 text-ink">
      <div className="mx-auto max-w-xl px-6 py-24">
        <h1 className="text-[36px] font-light leading-[1.1] tracking-[-0.01em]">Manage billing</h1>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/70">
          Enter the email you used at checkout to update your card, view invoices, or cancel.
        </p>
        <form onSubmit={open} className="mt-8 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            className="w-full rounded-xl border border-ink/15 bg-charcoal-900/40 px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink/35 focus:border-champagne-200/50"
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3 text-[13.5px] font-medium text-navy disabled:opacity-50"
          >
            {loading ? "Opening…" : "Open billing portal"}
          </button>
          {error && (
            <p role="alert" className="text-[13px] text-red-300">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}

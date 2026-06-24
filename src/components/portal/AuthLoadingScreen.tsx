import { useEffect, useState } from "react";

/** Branded loading splash; offers a manual retry after 5s if something stalls. */
export default function AuthLoadingScreen() {
  const [showRetry, setShowRetry] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowRetry(true), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-md bg-ink/90" />
        <p className="text-[12.5px] uppercase tracking-[0.22em] text-ink/45">Authenticating…</p>
        <div
          className={`mt-4 transition-opacity duration-300 ${
            showRetry ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <button
            onClick={() => window.location.reload()}
            className="text-[12px] text-ink/45 underline underline-offset-4 hover:text-ink/70"
          >
            Taking too long? Retry
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, type ReactNode } from "react";
import { supabase } from "../../integrations/supabase/client";

/** Centered card layout reused across all auth screens. */
export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <a
            href="/"
            className="font-general text-[12.5px] uppercase tracking-[0.26em] text-ink/85 transition-colors duration-200 hover:text-ink"
          >
            GOLDFIN DESK
          </a>
        </div>
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-ink/[0.08] bg-white p-8 shadow-[0_1px_2px_rgba(11,13,18,0.04),0_24px_64px_-32px_rgba(11,13,18,0.18)]">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/70 to-transparent"
          />
          <h1 className="text-[20px] font-medium tracking-[-0.01em] text-ink">{title}</h1>
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-[13px] text-ink/55">{footer}</div>}
      </div>
    </main>
  );
}

export function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="font-general text-[11px] uppercase tracking-[0.2em] text-ink/45">
        {label}
      </span>
      <input
        {...rest}
        className="mt-2 w-full rounded-xl border border-ink/[0.12] bg-white px-3.5 py-2.5 text-[14px] text-ink transition-colors placeholder:text-ink/35 focus:border-champagne-300/50 focus:outline-none focus:ring-2 focus:ring-champagne-200/40 disabled:opacity-50"
      />
    </label>
  );
}

export function PrimaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="w-full rounded-full bg-ink py-2.5 text-[13.5px] font-medium text-white transition-all duration-200 hover:bg-ink/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 focus-visible:ring-offset-2 disabled:bg-ink/[0.06] disabled:text-ink/35"
    >
      {children}
    </button>
  );
}

export function useAsync<T extends (...a: never[]) => Promise<unknown>>(fn: T) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = (async (...args: Parameters<T>) => {
    setLoading(true);
    setError(null);
    try {
      return await fn(...args);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }) as T;
  return { run, loading, error, setError };
}

export { supabase };

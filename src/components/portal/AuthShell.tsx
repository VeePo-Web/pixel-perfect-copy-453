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
        <a href="/" className="font-zentry text-[20px] tracking-wide text-ink">
          GOLDFIN DESK
        </a>
        <div className="mt-10 rounded-2xl border border-ink/10 bg-paper p-8 shadow-sm">
          <h1 className="text-[22px] font-medium text-ink">{title}</h1>
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
      <span className="text-[12px] font-medium uppercase tracking-wider text-ink/55">
        {label}
      </span>
      <input
        {...rest}
        className="mt-1.5 w-full rounded-lg border border-ink/15 bg-paper px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-ink/40"
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
      className="w-full rounded-full bg-ink py-2.5 text-[13.5px] font-medium text-paper hover:bg-ink/90 disabled:opacity-40"
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

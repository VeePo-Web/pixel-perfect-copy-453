import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";

// advisory_reports lags the generated Database types — cast at the boundary
// (same pattern as useAdvisoryReport). eslint-disable-next-line is intentional.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type StepState = "done" | "active" | "todo";

interface Step {
  n: number;
  title: string;
  desc: string;
  state: StepState;
  href?: string;
  cta?: string;
}

/**
 * First-run activation guide — the connect → sync → report path, the highest-
 * leverage onboarding pattern (Ramp/Mercury). Renders once a bank is connected;
 * the first incomplete step is highlighted with a single clear next action so the
 * owner always knows the one thing to do next. Frictionless by construction.
 */
export default function ActivationChecklist({ accountCount }: { accountCount: number }) {
  const [txnCount, setTxnCount] = useState<number | null>(null);
  const [hasReport, setHasReport] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { count } = await db
        .from("plaid_transactions")
        .select("id", { count: "exact", head: true });
      const { data: report } = await db
        .from("advisory_reports")
        .select("id")
        .limit(1)
        .maybeSingle();
      if (!alive) return;
      setTxnCount(count ?? 0);
      setHasReport(Boolean(report));
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Don't render a half-formed checklist until status is known.
  if (txnCount === null || hasReport === null) {
    return <div className="mt-10 h-28 animate-pulse rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(11,13,18,0.04)]" />;
  }

  const synced = txnCount > 0;
  const steps: Step[] = [
    {
      n: 1,
      title: "Connect your bank",
      desc: `${accountCount} account${accountCount === 1 ? "" : "s"} connected, read-only.`,
      state: "done",
      href: "/portal/accounts",
      cta: "Add another",
    },
    {
      n: 2,
      title: "Sync your transactions",
      desc: synced
        ? `${txnCount.toLocaleString()} transaction${txnCount === 1 ? "" : "s"} categorized.`
        : "Pull your latest transactions so we can read your numbers.",
      state: synced ? "done" : "active",
      href: "/portal/report",
      cta: "Sync now",
    },
    {
      n: 3,
      title: "Generate your advisory report",
      desc: hasReport
        ? "Your grounded briefing is ready — every number tied to your real data."
        : "Turn your transactions into a plain-English, grounded briefing.",
      state: hasReport ? "done" : synced ? "active" : "todo",
      href: "/portal/report",
      cta: hasReport ? "See my report" : "Generate my report",
    },
  ];

  const allDone = steps.every((s) => s.state === "done");

  return (
    <section className="mt-10 rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">
          {allDone ? "You're all set" : "Finish setting up GoldFin"}
        </h2>
        <span className="font-general text-[11.5px] tabular-nums text-ink/45">
          {steps.filter((s) => s.state === "done").length}/{steps.length} done
        </span>
      </div>

      <ol className="mt-4 space-y-1">
        {steps.map((s) => (
          <li
            key={s.n}
            className={`flex items-center gap-4 rounded-xl px-3 py-3 ${
              s.state === "active" ? "bg-ink/[0.03]" : ""
            }`}
          >
            <span
              aria-hidden
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-general text-[11.5px] tabular-nums ${
                s.state === "done"
                  ? "bg-ink text-white"
                  : s.state === "active"
                    ? "border border-champagne-300/60 bg-champagne-50/60 text-ink"
                    : "border border-ink/[0.12] text-ink/40"
              }`}
            >
              {s.state === "done" ? "✓" : s.n}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-[14px] ${s.state === "todo" ? "text-ink/45" : "text-ink"}`}>{s.title}</p>
              <p className="mt-0.5 text-[12.5px] leading-[1.5] text-ink/55">{s.desc}</p>
            </div>
            {s.href && s.cta && s.state !== "todo" && (
              <a
                href={s.href}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-all duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 ${
                  s.state === "active"
                    ? "bg-ink text-white hover:bg-ink/90"
                    : "border border-ink/[0.12] bg-white text-ink/75 hover:border-ink/[0.25] hover:text-ink"
                }`}
              >
                {s.cta} &rarr;
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { track, trackCtaByHref } from "../analytics";

const flow = [
  "Business bank activity",
  "Plaid connection after onboarding",
  "Spreadsheet structure",
  "Plain-English briefing",
  "Monthly review",
];

export default function PlaidExplanationSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            track("plaid_section_viewed");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="plaid"
      ref={ref}
      aria-labelledby="plaid-heading"
      className="relative scroll-mt-24 border-b border-white/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-sky-300/70">
            Data connection
          </div>
          <h2
            id="plaid-heading"
            className="mt-3 font-light text-bone text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
          >
            How Plaid fits into the process.
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-bone/65">
            Plaid connection is not part of the public preview or first application step.
            It becomes relevant only after onboarding, when the Monthly Finance Desk needs
            to work from real financial activity.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
            <p className="text-[14px] leading-relaxed text-bone/75">
              Plaid is used to help connect financial data from business bank accounts
              after onboarding. This helps reduce manual entry and allows the Monthly
              Finance Desk system to organize financial activity into the spreadsheet and
              briefing rhythm.
            </p>
            <ul className="mt-5 space-y-2 text-[13px] text-bone/65">
              {[
                "No Plaid connection is required to preview.",
                "No Plaid connection is required to apply.",
                "Connection happens after onboarding.",
                "The process is explained before any connection step.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-sky-300/70"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ol className="flex flex-col gap-2">
            {flow.map((label, i) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/[0.08] text-[11px] text-sky-200/90">
                  {i + 1}
                </span>
                <span className="text-[13.5px] text-bone/85">{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <a
            href="#/sample-briefing"
            onClick={() =>
              trackCtaByHref("#/sample-briefing", "security_faq_plaid")
            }
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-[13px] text-bone transition-colors hover:border-white/30 hover:bg-white/[0.03]"
          >
            Generate a Sample Briefing Without Plaid →
          </a>
        </div>
      </div>
    </section>
  );
}

import { useInView } from "../how-it-works/hooks/useInView";

// Homepage Section 3 — "What's In The Vault". Pattern C: 7-card grid.
// bg-[#FAF8F3] ivory. No external template import — hardcoded inline.

interface VaultItem {
  icon: string;
  label: string;
  decision: string;
}

const VAULT: VaultItem[] = [
  { icon: "◎", label: "Cash Flow Forecast", decision: "Will cash feel tight next month?" },
  { icon: "⊡", label: "Monthly Financial Review", decision: "What happened to my numbers this month?" },
  { icon: "⊟", label: "Expense Audit", decision: "Where did my money actually go?" },
  { icon: "◈", label: "Hiring Affordability Calculator", decision: "Can I afford to hire right now?" },
  { icon: "◉", label: "Tax Reserve Tracker", decision: "Am I setting enough aside for tax?" },
  { icon: "⊞", label: "Subscription Expense Tracker", decision: "What am I paying for that I don't use?" },
  { icon: "◑", label: "Revenue & Expense Trend Tracker", decision: "Revenue is up — so why does cash feel tight?" },
] as const;

export default function VaultPreview() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      aria-labelledby="vault-preview-title"
      className="bg-[#FAF8F3]"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-24 md:py-28 lg:px-10">
        {/* Section header */}
        <div className="mb-14 max-w-[42ch]">
          <div
            className={`text-[10px] uppercase tracking-[0.28em] text-champagne-300 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            The Template Vault
          </div>

          <h2
            id="vault-preview-title"
            className={`mt-4 font-robert-medium text-[clamp(1.75rem,3.8vw,2.75rem)] font-black uppercase leading-[0.98] tracking-tight text-ink transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "80ms" }}
          >
            Seven templates. Seven decisions answered.
          </h2>

          <p
            className={`mt-4 text-[16px] leading-[1.65] text-ink/60 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            Each one shows you a number you've been guessing.
          </p>
        </div>

        {/* 7-card grid */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {VAULT.map((item, i) => (
            <li
              key={item.label}
              className={`rounded-2xl border border-ink/[0.07] bg-white/60 p-6 transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:bg-white/90 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionProperty: "opacity, transform, background-color",
                transitionDelay: inView ? `${200 + i * 60}ms` : "0ms",
                transitionDuration: inView ? "700ms, 700ms, 150ms" : "700ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Icon */}
              <div className="mb-3 text-xl text-champagne-300" aria-hidden>
                {item.icon}
              </div>

              {/* Label */}
              <p className="text-[17px] font-light leading-snug text-ink">
                {item.label}
              </p>

              {/* Decision question */}
              <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
                {item.decision}
              </p>
            </li>
          ))}
        </ul>

        {/* CTA below grid */}
        <div
          className={`mt-14 flex flex-col items-center gap-3 transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${200 + VAULT.length * 60 + 120}ms` }}
        >
          <a
            href="#/templates"
            className="group relative inline-flex overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(217,190,130,0.45)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent motion-safe:animate-shimmer-slow"
            />
            <span className="relative z-10">Get the free templates</span>
          </a>

          <p className="text-[11px] uppercase tracking-[0.22em] text-ink/40">
            Free · No account required · Instant access
          </p>
        </div>
      </div>
    </section>
  );
}
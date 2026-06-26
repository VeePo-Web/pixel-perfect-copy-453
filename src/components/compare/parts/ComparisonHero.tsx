import { options } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { track } from "../analytics";

export default function ComparisonHero() {
  return (
    <section
      aria-labelledby="compare-hero-heading"
      className="relative isolate overflow-hidden border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(201,163,90,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(250,248,243,0))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-36 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1.05fr] lg:gap-16">
          <div className="motion-safe:animate-section-in">
            <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70"><span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-champagne-300/70" />
              Compare Financial Support Options
            </div>
            <h1
              id="compare-hero-heading"
              className="mt-5 max-w-[24ch] font-light text-ink [text-wrap:balance] text-[40px] leading-[1.04] tracking-[-0.01em] sm:text-[54px] lg:text-[62px]"
            >
              What kind of financial support does your business actually need?
            </h1>
            <p className="mt-5 max-w-[58ch] text-[15.5px] leading-[1.7] [text-wrap:pretty] text-ink/70">
              If your business has outgrown bank-balance guessing but is not ready for a full
              finance team, this guide helps you compare the options and choose the right next
              step.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#fit-finder"
                className="group relative w-full overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-4 text-center text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema sm:w-auto sm:py-3.5 hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span className="relative z-10">Find My Best Fit</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </a>
              <a
                href="/sample-briefing"
                onClick={() => track("sample_briefing_clicked_from_compare", { source: "hero" })}
                className="rounded-full border border-ink/[0.12] px-6 py-3.5 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Generate Sample Finance Briefing
              </a>
              <button
                type="button"
                onClick={() => { startAutoFillCheckout(); track("autofill_clicked_from_compare", { source: "hero" }); }}
                className="text-[12.5px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Or have it done for you — $99/mo
              </button>
            </div>
            <p className="mt-5 text-[11.5px] uppercase tracking-[0.2em] text-ink/55">
              No bank connection required to preview or apply.
            </p>
          </div>

          {/* Decision map visual */}
          <div aria-hidden className="relative">
            <DecisionMap />
          </div>
        </div>
      </div>
    </section>
  );
}

function DecisionMap() {
  // Three columns: Records / Interpretation / Leadership
  const left = options.filter((o) => ["diy-templates", "accounting-software", "bookkeeper"].includes(o.id));
  const middle = options.find((o) => o.id === "mfd")!;
  const right = options.filter((o) => ["fractional-cfo", "internal-team"].includes(o.id));
  const tools = options.filter((o) => ["dashboard", "spend-tools"].includes(o.id));

  return (
    <div className="relative rounded-3xl border border-ink/[0.07] bg-ink/[0.02] p-6 shadow-[0_30px_120px_-40px_rgba(25,28,34,0.14)] sm:p-8">
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-ink/45">
        Financial support map
      </div>
      <div className="mt-5 grid grid-cols-3 items-stretch gap-3">
        <Column label="Records & data" items={left.map((o) => o.shortLabel).concat(tools.map((o) => o.shortLabel))} />
        <FlagshipColumn item={middle} />
        <Column label="Leadership" items={right.map((o) => o.shortLabel)} align="right" />
      </div>
      <div aria-hidden className="mt-5 grid grid-cols-3 items-center text-center text-[10px] uppercase tracking-[0.24em] text-ink/35">
        <span>DIY / Low</span>
        <span className="text-champagne-300/70">Missing middle</span>
        <span>High-touch</span>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-8 bottom-[78px] h-px bg-gradient-to-r from-transparent via-champagne-200/30 to-transparent" />
    </div>
  );
}

function Column({ label, items, align }: { label: string; items: string[]; align?: "right" }) {
  return (
    <div className={`flex h-full flex-col rounded-2xl border border-ink/[0.06] bg-charcoal-900/40 p-4 ${align === "right" ? "items-end text-right" : ""}`}>
      <div className="text-[9.5px] uppercase tracking-[0.26em] text-ink/40">{label}</div>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-2 text-[12px] text-ink/70">
            {align === "right" ? null : <span className="h-1 w-1 rounded-full bg-ink/25" />}
            <span>{i}</span>
            {align === "right" ? <span className="h-1 w-1 rounded-full bg-ink/25" /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlagshipColumn({ item }: { item: { shortLabel: string } }) {
  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-champagne-200/40 bg-charcoal-900/70 p-4 shadow-[0_25px_70px_-30px_rgba(217,190,130,0.5)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/70 to-transparent" />
      <div className="text-[9.5px] uppercase tracking-[0.26em] text-champagne-300/70">The middle</div>
      <div className="mt-3 text-[14px] font-light leading-snug text-ink">{item.shortLabel}</div>
      <ul className="mt-3 space-y-1.5 text-[11.5px] text-ink/70">
        <li>· Structure</li>
        <li>· Bi-weekly briefings</li>
        <li>· Monthly review</li>
      </ul>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[10.5px] uppercase tracking-[0.24em] text-champagne-300/70">
        Most owner-led businesses
      </span>
    </div>
  );
}

import { useInView } from "../how-it-works/hooks/useInView";

// Homepage Section 1 — Bait Hero (Pattern A: asymmetric 7/5 copy-left + layered template cards right).
// HOMEPAGE EXCEPTION: gold CTA = "Get the free templates" → #/templates. NO $99/mo CTA here.

interface CardDef {
  label: string;
  decision: string;
  rows: { name: string; value: string }[];
  rotate: string;
  translate: string;
  zIndex: string;
}

const CARDS: CardDef[] = [
  {
    label: "Cash Flow Forecast",
    decision: "Will cash feel tight next month?",
    rows: [
      { name: "Starting cash", value: "$84,200" },
      { name: "Expected revenue", value: "$132,400" },
      { name: "Payroll + costs", value: "–$72,400" },
      { name: "Projected end cash", value: "$129,060" },
    ],
    rotate: "rotate-[3deg]",
    translate: "translate-x-6 translate-y-2",
    zIndex: "z-10",
  },
  {
    label: "Expense Audit",
    decision: "Where did my money actually go?",
    rows: [
      { name: "Total expenses", value: "$87,540" },
      { name: "Unusual spike Travel", value: "+212%" },
      { name: "Duplicate tools", value: "3 found" },
      { name: "Review items", value: "12" },
    ],
    rotate: "-rotate-[2deg]",
    translate: "-translate-x-4 -translate-y-1",
    zIndex: "z-20",
  },
  {
    label: "Owner Dashboard",
    decision: "What's my real financial health?",
    rows: [
      { name: "Cash on hand", value: "$129,060" },
      { name: "Gross margin", value: "61%" },
      { name: "Months of runway", value: "7.4" },
      { name: "Decision flag", value: "Audit subs" },
    ],
    rotate: "rotate-[1deg]",
    translate: "translate-x-2 translate-y-4",
    zIndex: "z-30",
  },
];

export default function HomeHero() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative overflow-hidden bg-[#0B0D12]"
    >
      {/* Gold radial glow — top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(212,168,69,0.13) 0%, rgba(212,168,69,0.04) 45%, transparent 70%)",
        }}
      />
      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(236,216,163,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(236,216,163,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        ref={ref}
        className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-12 md:items-center md:gap-8 md:py-32 lg:px-10"
      >
        {/* ── Left column — 7 cols ── */}
        <div className="md:col-span-7">
          {/* Eyebrow */}
          <div
            className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-champagne-300/80 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-champagne-300/70"
            />
            Free financial templates
          </div>

          {/* H1 */}
          <h1
            id="home-hero-title"
            className={`mt-5 font-robert-medium text-[clamp(2rem,4.8vw,3.6rem)] font-black uppercase leading-[0.96] tracking-tight text-white transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "80ms" }}
          >
            Your business finances are not unclear. They are just unorganized.
          </h1>

          {/* Subheading */}
          <p
            className={`mt-6 max-w-[52ch] text-[17px] leading-[1.65] text-white/55 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            Seven free templates that answer the questions your bank account,
            bookkeeping software, and spreadsheets never do.
          </p>

          {/* CTA group */}
          <div
            className={`mt-9 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "240ms" }}
          >
            {/* Gold primary CTA — free templates only, NO $99/mo */}
            <a
              href="#/templates"
              className="group relative inline-flex overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(217,190,130,0.45)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent motion-safe:animate-shimmer-slow"
              />
              <span className="relative z-10">Get the free templates</span>
            </a>

            {/* Microcopy */}
            <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/30">
              Free · No bank connection required
            </p>

            {/* Text link secondary */}
            <a
              href="#/sample-briefing"
              className="group mt-5 inline-flex items-center text-[12.5px] uppercase tracking-[0.18em] text-white/45 transition-colors duration-300 hover:text-champagne-300"
            >
              <span className="border-b border-white/15 pb-0.5 group-hover:border-champagne-300/60">
                See a sample briefing
              </span>
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </div>

        {/* ── Right column — 5 cols — layered template cards ── */}
        <div className="relative flex h-[360px] items-center justify-center md:col-span-5 md:h-[420px]">
          {CARDS.map((card, i) => (
            <div
              key={card.label}
              className={`absolute w-[260px] rounded-xl border border-white/[0.09] bg-white/[0.05] p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-all duration-700 ease-cinema ${card.rotate} ${card.translate} ${card.zIndex} ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              {/* Card header */}
              <div className="mb-2 flex items-center gap-2">
                {/* Green signal dot */}
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-signal"
                />
                <span className="text-[10px] uppercase tracking-[0.2em] text-champagne-300/80">
                  {card.label}
                </span>
              </div>

              {/* Decision question */}
              <p className="mb-3 text-[11px] italic leading-[1.4] text-white/45">
                {card.decision}
              </p>

              {/* Data rows */}
              <div className="space-y-1.5">
                {card.rows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-baseline justify-between"
                  >
                    <span className="text-[11px] text-white/50">{row.name}</span>
                    <span className="text-[11px] font-medium text-white/80">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Thin champagne gradient bottom line */}
              <div
                aria-hidden
                className="mt-3 h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(212,168,69,0.35), transparent)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
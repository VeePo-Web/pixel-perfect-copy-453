import { useInView } from "../how-it-works/hooks/useInView";

// Homepage Section 1 — Bait Hero (Pattern A: asymmetric 7/5 copy-left + layered template cards right).
// HOMEPAGE EXCEPTION: gold CTA = "Get the free templates" → /templates. NO $150/mo CTA here.

interface CardDef {
  label: string;
  decision: string;
  rows: { name: string; value: string }[];
  placement: string;
}

const CARDS: CardDef[] = [
  {
    label: "13-Week Cash Map",
    decision: "Will cash feel tight next quarter?",
    rows: [
      { name: "Starting cash", value: "$84,200" },
      { name: "Weekly deposits", value: "+$66,200" },
      { name: "Weekly outflow", value: "-$43,770" },
      { name: "Week 13 cash", value: "$375,790" },
    ],
    placement: "top-0 ml-[-18px] -rotate-[1.25deg] z-10 opacity-70",
  },
  {
    label: "Expense And Vendor Audit",
    decision: "Where did my money actually go?",
    rows: [
      { name: "Total outflow", value: "$87,540" },
      { name: "Duplicate-like", value: "1 found" },
      { name: "Unfamiliar", value: "1 vendor" },
      { name: "Biggest mover", value: "Software" },
    ],
    placement: "top-[28%] ml-[14px] rotate-[0.75deg] z-20 opacity-85",
  },
  {
    label: "Owner Command Center",
    decision: "What should I look at first?",
    rows: [
      { name: "Cash on hand", value: "$84,200" },
      { name: "Money in", value: "$132,400" },
      { name: "Net cash", value: "+$44,860" },
      { name: "Runway", value: "0.44 mo" },
    ],
    placement: "top-[56%] ml-[-6px] z-30",
  },
];

export default function HomeHero() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative overflow-hidden bg-[#0B0D12]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(212,168,69,0.13) 0%, rgba(212,168,69,0.04) 45%, transparent 70%)",
        }}
      />
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
        className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-20 md:grid-cols-12 md:items-center md:gap-8 md:py-32 lg:px-10"
      >
        <div className="md:col-span-7">
          <div
            className={`flex items-center gap-2 font-general text-[10px] uppercase tracking-[0.28em] text-champagne-300/80 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full bg-champagne-300/70"
            />
            Free XLSX financial templates
          </div>

          <h1
            id="home-hero-title"
            className={`mt-6 max-w-[16ch] font-display text-[clamp(2.35rem,4.6vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.02em] text-white [text-wrap:balance] transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "80ms" }}
          >
            Your business finances are not unclear. They are just unorganized.
          </h1>

          <p
            className={`mt-6 max-w-[52ch] text-[17px] leading-[1.65] text-white/60 [text-wrap:pretty] transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            Four branded XLSX templates that can be filled from business bank and card activity:
            command center, cash map, cash-basis P&L, and expense audit.
          </p>

          <div
            className={`mt-10 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "240ms" }}
          >
            {/* Gold primary CTA — free templates only, NO $150/mo */}
            <a
              href="/templates"
              className="inline-flex w-full justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-4 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(0,0,0,0.25)] transition-all duration-300 ease-cinema sm:w-auto sm:justify-start sm:py-3.5 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_12px_32px_-10px_rgba(212,168,69,0.5)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D12]"
            >
              Get the free XLSX vault
            </a>

            <p className="mt-3.5 font-general text-[10.5px] uppercase tracking-[0.22em] text-white/35">
              Free - No bank connection required
            </p>

            <a
              href="/sample-briefing"
              className="group mt-6 inline-flex items-center gap-2 text-[14px] text-white/55 transition-colors duration-300 hover:text-champagne-100"
            >
              <span className="border-b border-white/20 pb-0.5 transition-colors duration-300 group-hover:border-champagne-200/60">
                Watch your numbers turn into plain English
              </span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                {">"}
              </span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto h-[430px] w-full max-w-[340px] md:col-span-5 md:h-[480px] md:max-w-none">
          {CARDS.map((card, i) => (
            <div
              key={card.label}
              className={`absolute left-1/2 w-[290px] -translate-x-1/2 rounded-2xl border border-white/[0.09] bg-[#12151D] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] transition-all duration-700 ease-cinema ${card.placement} ${
                inView ? "opacity-100" : "!opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${300 + i * 110}ms` }}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-1 w-1 shrink-0 rounded-full bg-green-signal"
                />
                <span className="font-general text-[10px] uppercase tracking-[0.2em] text-champagne-300/80">
                  {card.label}
                </span>
              </div>

              {/* Decision question */}
              <p className="mb-3 mt-2 text-[12px] leading-[1.4] text-white/45">
                {card.decision}
              </p>

              <div className="space-y-1.5">
                {card.rows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="text-[12px] text-white/50">{row.name}</span>
                    <span className="font-general text-[11.5px] font-medium tabular-nums text-white/85">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                aria-hidden
                className="mt-4 h-px w-full"
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

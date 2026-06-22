import { spectrumStops } from "../content";
import { trackCtaByHref } from "../analytics";

export default function MissingMiddleSpectrum() {
  return (
    <section
      aria-labelledby="missing-middle-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[62ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Where GoldFin Desk fits
          </div>
          <h2
            id="missing-middle-heading"
            className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            The missing middle between bookkeeping and a full CFO.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink/70">
            Many owner-led businesses already have tools and reports. What they lack is a
            consistent way to understand what the numbers mean before decisions are made.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-ink/[0.07] bg-ink/[0.02] p-6 shadow-[0_30px_100px_-40px_rgba(25,28,34,0.14)] sm:p-10">
          {/* SVG rail */}
          <div className="relative">
            <svg
              role="img"
              aria-label="Maturity spectrum from basic records to internal finance team"
              viewBox="0 0 1000 80"
              className="h-20 w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="rail" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="rgba(237,231,218,0.18)" />
                  <stop offset="50%" stopColor="rgba(217,190,130,0.65)" />
                  <stop offset="100%" stopColor="rgba(237,231,218,0.18)" />
                </linearGradient>
              </defs>
              <line
                x1="20"
                y1="40"
                x2="980"
                y2="40"
                stroke="url(#rail)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {spectrumStops.map((s) => {
                const x = 20 + s.position * 960;
                return (
                  <g key={s.id}>
                    <circle
                      cx={x}
                      cy={40}
                      r={s.isCenter ? 9 : 5}
                      fill={s.isCenter ? "#D9BE82" : "#1A1A1F"}
                      stroke={s.isCenter ? "#D9BE82" : "rgba(237,231,218,0.45)"}
                      strokeWidth={s.isCenter ? 2 : 1.5}
                    />
                    {s.isCenter ? (
                      <circle
                        cx={x}
                        cy={40}
                        r={16}
                        fill="none"
                        stroke="rgba(217,190,130,0.35)"
                        strokeWidth="1"
                      />
                    ) : null}
                  </g>
                );
              })}
            </svg>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {spectrumStops.map((s) => (
                <div
                  key={s.id}
                  className={`text-center text-[10.5px] uppercase tracking-[0.18em] ${
                    s.isCenter ? "text-champagne-200/90" : "text-ink/45"
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-champagne-200/40 bg-charcoal-900/70 p-6 shadow-[0_25px_70px_-30px_rgba(217,190,130,0.45)]">
              <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">
                The recurring clarity layer
              </div>
              <p className="mt-3 text-[16px] font-light leading-relaxed text-ink">
                The GoldFin Desk is for owners who have enough financial complexity to
                need a rhythm, but not enough internal finance infrastructure to justify a full
                finance department.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[14px] leading-relaxed text-ink/70">
                Bi-weekly briefings, monthly strategy reviews, and an organized financial system
                — without the cost or complexity of a CFO engagement.
              </p>
              <div className="mt-6">
                <a
                  href="#/sample-briefing"
                  onClick={() => trackCtaByHref("#/sample-briefing", "missing-middle")}
                  className="inline-flex rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)]"
                >
                  Generate Sample Finance Briefing
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

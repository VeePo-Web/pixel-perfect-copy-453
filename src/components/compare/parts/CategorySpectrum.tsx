import { options } from "../content";

export default function CategorySpectrum() {
  return (
    <section
      id="spectrum"
      aria-labelledby="spectrum-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Where it fits
          </div>
          <h2
            id="spectrum-heading"
            className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            Where the GoldFin Desk fits.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink/70">
            For many owner-led businesses, the gap is not between free templates and a CFO. The gap is between having financial data and having a recurring way to understand it.
          </p>
        </div>

        {/* Desktop spectrum */}
        <div className="mt-12 hidden lg:block">
          <div className="relative h-[200px] rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-6">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.26em] text-ink/45">
                <span>DIY / Low support</span>
                <span className="text-champagne-300/70">Structure + Interpretation</span>
                <span>High-touch finance leadership</span>
              </div>
              <div className="relative h-px w-full bg-gradient-to-r from-ink/15 via-champagne-200/40 to-ink/15" />
              <div className="relative h-[88px]">
                {options.map((o) => (
                  <SpectrumNode key={o.id} option={o} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/tablet stacked list */}
        <ol className="mt-10 grid gap-2 lg:hidden">
          {options.map((o) => (
            <li
              key={o.id}
              className={`flex items-start justify-between gap-4 rounded-xl border p-4 ${
                o.isMfd
                  ? "border-champagne-200/45 bg-charcoal-900/70"
                  : "border-ink/[0.07] bg-ink/[0.02]"
              }`}
            >
              <div>
                <div className={`text-[10.5px] uppercase tracking-[0.24em] ${o.isMfd ? "text-champagne-300/70" : "text-ink/45"}`}>
                  {o.isMfd ? "Missing middle" : `Position ${Math.round(o.position * 100)}`}
                </div>
                <div className="mt-1 text-[14.5px] font-light text-ink">{o.label}</div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink/60">{o.bestWhen}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SpectrumNode({ option }: { option: import("../content").SupportOption }) {
  const flagship = !!option.isMfd;
  const left = `${option.position * 100}%`;
  return (
    <div
      className="absolute top-0 -translate-x-1/2 text-center"
      style={{ left }}
    >
      <div
        className={`mx-auto h-3 w-3 -translate-y-[7px] rounded-full border ${
          flagship
            ? "border-champagne-200 bg-champagne-200 shadow-[0_0_0_6px_rgba(217,190,130,0.18)]"
            : "border-ink/30 bg-charcoal-950"
        }`}
      />
      <div
        className={`mt-3 max-w-[140px] text-[11.5px] leading-tight ${
          flagship ? "text-ink" : "text-ink/65"
        }`}
      >
        {option.shortLabel}
      </div>
      {flagship ? (
        <div className="mt-1 text-[9.5px] uppercase tracking-[0.22em] text-champagne-300/70">
          The middle
        </div>
      ) : null}
    </div>
  );
}

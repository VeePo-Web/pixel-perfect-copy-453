import { feelingCards } from "../content";

export default function OwnerFeelingComparison() {
  return (
    <section
      aria-labelledby="feeling-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[62ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            What the owner feels
          </div>
          <h2
            id="feeling-heading"
            className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            The real difference is what the owner feels.
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {feelingCards.map((c) => (
            <li
              key={c.id}
              className={`relative rounded-2xl border p-6 transition-all duration-400 ease-cinema ${
                c.isMfd
                  ? "border-champagne-200/40 bg-charcoal-900/70 shadow-[0_25px_70px_-30px_rgba(217,190,130,0.45)]"
                  : "border-ink/[0.07] bg-ink/[0.02]"
              }`}
            >
              <div
                className={`text-[10.5px] uppercase tracking-[0.26em] ${
                  c.isMfd ? "text-champagne-200/85" : "text-ink/45"
                }`}
              >
                {c.label}
              </div>
              <div className="mt-5">
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">
                  Before
                </div>
                <p className="mt-1.5 text-[14.5px] italic leading-relaxed text-ink/70">
                  {c.before}
                </p>
              </div>
              <div className="mt-5 border-t border-ink/[0.06] pt-4">
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">
                  After
                </div>
                <p className="mt-1.5 text-[15px] italic leading-relaxed text-ink">{c.after}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-[68ch] border-l border-champagne-200/40 pl-5 text-[15px] leading-[1.7] text-ink/75">
          If your pain is not recordkeeping or full finance leadership, but financial clarity,
          the GoldFin Desk was designed for that middle.
        </p>
      </div>
    </section>
  );
}

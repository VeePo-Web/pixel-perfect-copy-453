import { jobMap } from "../content";

export default function RealDifferenceSection() {
  return (
    <section
      aria-labelledby="real-difference-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[62ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            The real difference
          </div>
          <h2
            id="real-difference-heading"
            className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            They do different jobs.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink/70">
            The mistake is comparing them as if they are the same kind of support. They are not.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {jobMap.map((j) => (
            <li
              key={j.id}
              className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-400 ease-cinema ${
                j.isMfd
                  ? "border-champagne-200/40 bg-charcoal-900/70 shadow-[0_25px_70px_-30px_rgba(217,190,130,0.45)]"
                  : "border-ink/[0.07] bg-ink/[0.02] hover:border-champagne-200/25"
              }`}
            >
              <div
                className={`text-[10.5px] uppercase tracking-[0.26em] ${
                  j.isMfd ? "text-champagne-200/85" : "text-ink/45"
                }`}
              >
                {j.label}
              </div>
              <div className="mt-4">
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">Job</div>
                <p className="mt-1.5 text-[16px] font-light text-ink">{j.job}</p>
              </div>
              <div className="mt-5">
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">
                  Core output
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/70">{j.output}</p>
              </div>
              <div className="mt-5 border-t border-ink/[0.06] pt-4">
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">
                  Owner question
                </div>
                <p className="mt-1.5 text-[13.5px] italic leading-relaxed text-ink/80">
                  {j.question}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-[68ch] border-l border-champagne-200/40 pl-5 text-[15px] leading-[1.7] text-ink/75">
          If your records are messy, start with bookkeeping. If your decisions are getting bigger
          but a CFO feels too heavy, the Monthly Finance Desk may be the missing layer.
        </p>
      </div>
    </section>
  );
}

import { whyCards } from "../content";

export default function WhyItMakesSense() {
  return (
    <section aria-labelledby="why-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Why $1,500 / month
          </div>
          <h2 id="why-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[46px]">
            You are not paying for a spreadsheet.
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.7] text-ink/70">
            You are paying for structure, automation, written interpretation, and a monthly review rhythm around your business.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {whyCards.map((c) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-ink/[0.07] bg-charcoal-900/55 p-7 transition-all duration-400 ease-cinema hover:-translate-y-0.5 hover:border-champagne-200/25 hover:shadow-[0_24px_60px_-30px_rgba(217,190,130,0.25)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
              <h3 className="text-[18px] font-light text-ink">{c.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-ink/75">{c.body}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-[60ch] border-l-2 border-champagne-200/40 pl-6 text-[18px] font-light italic leading-[1.5] text-ink/85">
          The cost of financial confusion is usually not visible until after the decision has already been made.
        </p>
      </div>
    </section>
  );
}

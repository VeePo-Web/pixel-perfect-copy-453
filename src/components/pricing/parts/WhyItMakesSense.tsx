import { whyCards } from "../content";

export default function WhyItMakesSense() {
  return (
    <section aria-labelledby="why-title" className="border-b border-ink/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            Why $150 / month
          </div>
          <h2 id="why-title" className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[46px]">
            You are not paying for a spreadsheet.
          </h2>
          <p className="mt-6 text-[15.5px] leading-[1.7] text-ink/70">
            You are paying for structure, automation, written interpretation, and a monthly review rhythm around your business.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {whyCards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-ink/[0.08] bg-white p-7 shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
            >
              <h3 className="text-[18px] font-medium text-ink">{c.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-ink/75">{c.body}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-[60ch] border-l-2 border-champagne-200/60 pl-6 text-[18px] leading-[1.6] text-ink/75 [text-wrap:pretty]">
          The cost of financial confusion is usually not visible until after the decision has already been made.
        </p>
      </div>
    </section>
  );
}

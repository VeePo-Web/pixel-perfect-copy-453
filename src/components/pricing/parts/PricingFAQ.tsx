import { faq } from "../content";

export default function PricingFAQ() {
  return (
    <section aria-labelledby="faq-title" className="border-b border-white/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            FAQ
          </div>
          <h2 id="faq-title" className="mt-4 font-light text-bone text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
            Questions owners usually ask before applying.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/[0.07] bg-charcoal-900/55">
          {faq.map((item, i) => (
            <details key={item.q} open={i === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-white/[0.02]">
                <span className="text-[15.5px] text-bone group-open:text-bone">{item.q}</span>
                <span
                  aria-hidden
                  className="text-[20px] leading-none text-bone/45 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14.5px] leading-[1.7] text-bone/75">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-8 text-[11.5px] uppercase tracking-[0.2em] text-bone/40">
          Monthly Finance Desk does not replace tax, legal, accounting, or investment advice.
        </p>
      </div>
    </section>
  );
}

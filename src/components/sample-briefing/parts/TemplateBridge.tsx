import { templateBridgeItems } from "../content";

export default function TemplateBridge() {
  return (
    <section id="templates" className="bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
              Lower-intent path
            </div>
            <h2 className="mt-4 font-light text-bone text-[32px] leading-[1.1] tracking-[-0.005em] sm:text-[40px]">
              Not ready for the Monthly Finance Desk yet?
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-bone/70">
              Start with free financial templates designed to help you organize cash flow, expenses, hiring decisions, and monthly review.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <a
              href="#templates-signup"
              className="inline-flex items-center gap-2 rounded-full border border-champagne-200/40 px-6 py-3 text-[13px] tracking-wide text-bone transition-all duration-400 ease-cinema hover:bg-champagne-300/[0.06]"
            >
              Get Free Financial Templates
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {templateBridgeItems.map((t) => (
            <div
              key={t.title}
              className="group rounded-2xl border border-white/[0.07] bg-charcoal-900/50 p-6 transition-all duration-400 ease-cinema hover:-translate-y-1 hover:border-champagne-200/30"
            >
              <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/45">Template</div>
              <h3 className="mt-2 text-[17px] font-light text-bone">{t.title}</h3>
              <p className="mt-3 text-[13px] leading-[1.6] text-bone/65">{t.body}</p>
              <div className="mt-5 text-[12px] text-champagne-100/80 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                Download →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

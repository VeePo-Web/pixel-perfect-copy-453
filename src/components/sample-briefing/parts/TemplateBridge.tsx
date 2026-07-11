import { templateBridgeItems } from "../content";

export default function TemplateBridge() {
  return (
    <section id="templates" className="bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-24 lg:px-10">
        <div className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              Start free instead
            </div>
            <h2 className="mt-4 font-display font-medium text-ink text-[32px] leading-[1.1] tracking-[-0.02em] sm:text-[40px]">
              Not ready for the GoldFin Desk yet?
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-ink/70">
              Start with free XLSX templates designed to organize cash flow, cash-basis P&L, expenses, and owner decisions.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <a
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-champagne-200/40 px-6 py-3 text-[13px] tracking-wide text-ink transition-all duration-300 ease-cinema hover:bg-champagne-300/[0.06] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/40 focus-visible:ring-offset-2"
            >
              Get Free Financial Templates
              <span aria-hidden>{">"}</span>
            </a>
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {templateBridgeItems.map((t) => (
            <a
              key={t.title}
              href="/templates"
              className="group rounded-2xl border border-ink/[0.07] bg-charcoal-900/50 p-6 transition-all duration-300 ease-cinema hover:-translate-y-1 hover:border-champagne-200/30"
            >
              <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/45">Template</div>
              <h3 className="mt-2 text-[17px] font-display font-medium text-ink">{t.title}</h3>
              <p className="mt-3 text-[13px] leading-[1.6] text-ink/65">{t.body}</p>
              <div className="mt-5 text-[12px] text-champagne-300/80 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                Get it free {">"}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

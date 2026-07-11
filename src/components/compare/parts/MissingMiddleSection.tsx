import { useInView } from "../../how-it-works/hooks/useInView";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { missingMiddle } from "../content";
import { track } from "../analytics";

export default function MissingMiddleSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      id="missing-middle"
      aria-labelledby="missing-middle-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.06] bg-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div
          className={`max-w-[62ch] transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            The missing middle
          </div>
          <h2
            id="missing-middle-heading"
            className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[30px] leading-[1.1] tracking-[-0.02em] sm:text-[40px]"
          >
            The missing middle between bookkeeping and a full CFO.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink/70">
            Many owner-led businesses do not need a finance department yet. But they do need more than bank statements, basic reports, and spreadsheets that only work when someone updates them.
          </p>
        </div>

        <div
          className={`mt-10 grid items-stretch gap-4 lg:grid-cols-3 transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <SideColumn
            label={missingMiddle.tooLight.label}
            tone="muted"
            items={missingMiddle.tooLight.items}
            footerLabel="Problem"
            footer={missingMiddle.tooLight.problem}
          />
          <MfdColumn
            label={missingMiddle.mfd.label}
            items={missingMiddle.mfd.items}
            outcome={missingMiddle.mfd.outcome}
          />
          <SideColumn
            label={missingMiddle.tooHeavy.label}
            tone="muted"
            items={missingMiddle.tooHeavy.items}
            footerLabel="Problem"
            footer={missingMiddle.tooHeavy.problem}
          />
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => { startAutoFillCheckout(); track("autofill_clicked_from_compare", { source: "missing-middle" }); }}
            className="inline-flex rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 py-3 text-[12.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Auto-fill my reports — $150/mo
          </button>
        </div>
      </div>
    </section>
  );
}

function SideColumn({
  label,
  items,
  tone,
  footerLabel,
  footer,
}: {
  label: string;
  items: string[];
  tone: "muted";
  footerLabel: string;
  footer: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
      <div className={`font-general text-[10.5px] uppercase tracking-[0.28em] ${tone === "muted" ? "text-ink/45" : "text-champagne-300/70"}`}>
        {label}
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-2.5 text-[13.5px] text-ink/70">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/20" />
            {x}
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-ink/[0.06] pt-4 text-[12.5px] text-ink/55">
        <span className="text-ink/40">{footerLabel} · </span>
        {footer}
      </div>
    </div>
  );
}

function MfdColumn({ label, items, outcome }: { label: string; items: string[]; outcome: string }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-champagne-200/50 bg-champagne-50/40 p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/70 to-transparent" />
      <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">{label}</div>
      <ul className="mt-4 space-y-2.5">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-2.5 text-[13.5px] text-ink">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne-200" />
            {x}
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-champagne-200/30 pt-4 text-[12.5px] text-ink/70">
        <span className="text-ink/40">Outcome · </span>
        {outcome}
      </div>
    </div>
  );
}

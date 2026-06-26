import { comparison } from "../content";
import { track } from "../analytics";
import { useInView } from "../../how-it-works/hooks/useInView";

export default function ManualVsMonthlyDesk() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="manual-vs-desk-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className={`max-w-[60ch] transition-all duration-700 ease-cinema ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Two ways to use the Vault
          </div>
          <h2
            id="manual-vs-desk-heading"
            className="mt-3 font-light text-ink text-[30px] leading-[1.12] tracking-[-0.01em] sm:text-[40px]"
          >
            Use them yourself — or have them filled for you every month.
          </h2>
        </div>

        <div className={`mt-10 grid items-stretch gap-5 lg:grid-cols-2 transition-all duration-700 ease-cinema delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Card
            label={comparison.free.label}
            time={comparison.free.time}
            positioning={comparison.free.positioning}
            items={comparison.free.items}
            bestFor={comparison.free.bestFor}
            tone="muted"
            cta={{ label: "Browse the Vault", href: "#template-grid" }}
          />
          <Card
            label={comparison.desk.label}
            time={comparison.desk.time}
            positioning={comparison.desk.positioning}
            items={comparison.desk.items}
            bestFor={comparison.desk.bestFor}
            tone="flagship"
            cta={{ label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" }}
            secondary={{ label: "See a sample briefing", href: "/sample-briefing" }}
          />
        </div>

        <p className="mt-8 max-w-[68ch] text-[14px] leading-relaxed text-ink/65">
          If you use the Vault and realize, “I don't want to keep doing this manually,” that is exactly what GoldFin Reports is built for — the same templates, filled for you, for $99/mo.
        </p>
      </div>
    </section>
  );
}

function Card({
  label,
  time,
  positioning,
  items,
  bestFor,
  tone,
  cta,
  secondary,
}: {
  label: string;
  time: string;
  positioning: string;
  items: string[];
  bestFor: string;
  tone: "muted" | "flagship";
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  const flag = tone === "flagship";
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-7 ${
        flag
          ? "border-champagne-200/40 bg-paper-raised shadow-[0_40px_100px_-40px_rgba(217,190,130,0.4)]"
          : "border-ink/[0.07] bg-ink/[0.02]"
      }`}
    >
      {flag ? (
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/60 to-transparent" />
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
          {label}
        </div>
        <div className={`shrink-0 text-[11px] font-medium tabular-nums ${flag ? "text-champagne-300" : "text-ink/45"}`}>
          {time}
        </div>
      </div>
      <div className="mt-2 text-[20px] font-light text-ink">{positioning}</div>
      <ul className="mt-5 space-y-2.5">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-2.5 text-[13.5px] text-ink/80">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${flag ? "bg-champagne-200" : "bg-ink/20"}`} />
            {x}
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-ink/[0.06] pt-4 text-[12.5px] text-ink/55">
        <span className="text-ink/40">Best for · </span>
        {bestFor}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={cta.href}
          onClick={() => {
            if (cta.href.includes("auto-fill")) track("autofill_clicked_from_templates", { source: "comparison" });
          }}
          className={
            flag
              ? "rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              : "rounded-full border border-ink/[0.12] px-5 py-2.5 text-[12.5px] text-ink/85 transition-all duration-300 ease-cinema hover:border-ink/25 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          }
        >
          {cta.label}
        </a>
        {secondary ? (
          <a
            href={secondary.href}
            onClick={() => track("sample_briefing_clicked_from_templates", { source: "comparison" })}
            className="text-[12.5px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            {secondary.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}

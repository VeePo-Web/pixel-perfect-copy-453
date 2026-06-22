import { HIW_COPY } from "../content";
import SectionHeader from "./SectionHeader";
import { useInView } from "../hooks/useInView";

function Column({ label, title, items, accent }: { label: string; title: string; items: string[]; accent?: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`relative rounded-2xl border p-7 transition-all duration-700 ease-cinema ${
        accent
          ? "border-champagne-200/25 bg-white shadow-[0_2px_8px_-2px_rgba(11,13,18,0.08),_0_1px_2px_-1px_rgba(11,13,18,0.04)]"
          : "border-charcoal-700 bg-paper-raised shadow-[0_1px_2px_0_rgba(11,13,18,0.05)]"
      } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      {accent && <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent" />}
      <div className={`text-[10.5px] uppercase tracking-[0.28em] ${accent ? "text-champagne-300/70" : "text-ink/40"}`}>
        {label}
      </div>
      <h3 className="mt-3 font-robert-medium text-2xl leading-tight tracking-tight text-ink">{title}</h3>
      <ul className="mt-6 space-y-3">
        {items.map((it, i) => (
          <li
            key={it}
            className={`flex items-start gap-3 text-[14.5px] leading-[1.55] transition-all duration-500 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            }`}
            style={{ transitionDelay: `${120 + i * 70}ms` }}
          >
            {accent ? (
              <span className="mt-[7px] inline-block h-1.5 w-3 bg-champagne-200/80" />
            ) : (
              <span className="mt-[10px] inline-block h-px w-3 bg-bone/30" />
            )}
            <span className={accent ? "text-ink/90" : "text-ink/65"}>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WhatYouDoVsWeDo() {
  const c = HIW_COPY.vs;
  return (
    <div>
      <SectionHeader headline={c.headline} sub={c.sub} />
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <Column label="What you do" title="A light, focused role" items={c.you} />
        <Column label="What the Finance Desk handles" title="The recurring system" items={c.desk} accent />
      </div>
      <div className="mt-10">
        <a
          href="#/sample-briefing"
          className="group inline-flex items-center text-[13px] text-ink/75 transition-colors duration-300 hover:text-champagne-100"
        >
          <span className="border-b border-bone/20 pb-0.5 group-hover:border-champagne-200/60">{c.cta}</span>
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </div>
  );
}

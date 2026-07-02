import { useEffect, useRef, useState } from "react";
import { buildTabContent, type DemoBusiness, type TabKey } from "../content";

const TABS: { id: TabKey; label: string }[] = [
  { id: "cash", label: "Cash" },
  { id: "revenue", label: "Revenue" },
  { id: "expenses", label: "Expenses" },
  { id: "risk", label: "Risk" },
  { id: "questions", label: "Questions" },
  { id: "decisions", label: "Decisions" },
];

export default function BriefingTabs({ business }: { business: DemoBusiness }) {
  const [active, setActive] = useState<TabKey>("cash");
  const content = buildTabContent(business);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setActive("cash");
  }, [business.id]);

  const onKey = (e: React.KeyboardEvent) => {
    const idx = TABS.findIndex((t) => t.id === active);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    if (next !== idx) {
      e.preventDefault();
      const id = TABS[next].id;
      setActive(id);
      tabRefs.current[id]?.focus();
    }
  };

  const current = content[active];

  return (
    <section className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Explore the briefing
          </div>
          <h2 className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
            Move through the briefing the way an owner would read it.
          </h2>
        </div>

        <div className="mt-10 -mx-6 no-scrollbar overflow-x-auto overscroll-x-contain px-6 lg:mx-0 lg:px-0">
          <div
            role="tablist"
            aria-label="Briefing topics"
            onKeyDown={onKey}
            className="flex min-w-max gap-2"
          >
            {TABS.map((t) => {
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => (tabRefs.current[t.id] = el)}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-[13px] tracking-wide transition-all duration-300 ease-cinema ${
                    isActive
                      ? "border-champagne-200/50 bg-charcoal-800/80 text-ink shadow-[0_0_0_1px_rgba(217,190,130,0.18)]"
                      : "border-ink/[0.08] text-ink/55 hover:border-ink/20 hover:text-ink/85"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          key={active + business.id}
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="mt-8 grid gap-6 motion-safe:animate-section-in lg:grid-cols-3"
        >
          <Panel label="Metric" body={current.metric} accent="champagne" />
          <Panel label="Plain-English interpretation" body={current.interpretation} />
          <div className="space-y-6">
            <Panel label="Why it matters" body={current.why} />
            <Panel label="Monthly call question" body={current.callQuestion} accent="green" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent?: "champagne" | "green";
}) {
  const accentClass =
    accent === "champagne"
      ? "border-champagne-200/25 bg-champagne-300/[0.04]"
      : accent === "green"
      ? "border-green-signal/30 bg-green-deep/20"
      : "border-ink/[0.07] bg-ink/[0.02]";
  return (
    <div
      className={`rounded-2xl border ${accentClass} p-6 transition-all duration-300 ease-cinema hover:-translate-y-0.5`}
    >
      <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">{label}</div>
      <p className="mt-3 text-[15px] leading-[1.7] text-ink/90">{body}</p>
    </div>
  );
}

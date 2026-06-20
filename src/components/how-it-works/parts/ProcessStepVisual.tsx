import { useInView } from "../hooks/useInView";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative h-full w-full rounded-2xl border border-champagne-200/10 bg-charcoal-900/50 p-6 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/30 to-transparent" />
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10.5px] uppercase tracking-[0.28em] text-ink/40">{label}</span>
        <span className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-bone/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-bone/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-200/60" />
        </span>
      </div>
      {children}
    </div>
  );
}

function StepSpreadsheet() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const rows = ["Revenue", "Payroll", "Software", "Contractors", "Tax Reserve", "Owner Draw"];
  return (
    <div ref={ref}>
      <Frame label="Spreadsheet system">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-px overflow-hidden rounded-md bg-champagne-200/[0.06]">
          <div className="bg-charcoal-800/80 px-3 py-2 text-[10.5px] uppercase tracking-[0.22em] text-ink/45">Category</div>
          <div className="bg-charcoal-800/80 px-3 py-2 text-[10.5px] uppercase tracking-[0.22em] text-ink/45">Period</div>
          <div className="bg-charcoal-800/80 px-3 py-2 text-right text-[10.5px] uppercase tracking-[0.22em] text-ink/45">Amount</div>
          {rows.map((r, i) => (
            <div key={r} className="contents">
              <div
                className={`bg-charcoal-900/60 px-3 py-2.5 text-[13px] text-ink/80 transition-all duration-500 ease-cinema ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                }`}
                style={{ transitionDelay: `${120 + i * 70}ms` }}
              >
                {r}
              </div>
              <div
                className={`bg-charcoal-900/60 px-3 py-2.5 text-[13px] text-ink/45 transition-all duration-500 ease-cinema ${
                  inView ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${160 + i * 70}ms` }}
              >
                Apr 01–14
              </div>
              <div
                className={`bg-charcoal-900/60 px-3 py-2.5 text-right text-[13px] tabular-nums text-champagne-100/90 transition-all duration-500 ease-cinema ${
                  inView ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${200 + i * 70}ms` }}
              >
                ${(12 - i) * 1820}
              </div>
            </div>
          ))}
        </div>
      </Frame>
    </div>
  );
}

function StepPlaid() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Frame label="Secure data connection">
        <div className="relative grid grid-cols-3 items-center gap-4 py-6">
          <div className="rounded-xl border border-ink/[0.06] bg-charcoal-800/60 p-4">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">Bank</div>
            <div className="mt-3 text-[15px] text-ink/85">Operating Account</div>
            <div className="mt-1 text-[11.5px] text-ink/40">•••• 4821</div>
          </div>
          <div className="relative h-[2px] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bone/15 to-transparent" />
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r from-champagne-200/0 via-champagne-200 to-champagne-200/0 transition-all duration-[1400ms] ease-cinema ${
                inView ? "w-full" : "w-0"
              }`}
            />
          </div>
          <div className="rounded-xl border border-champagne-200/15 bg-charcoal-800/60 p-4">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-champagne-200/60">Desk</div>
            <div className="mt-3 text-[15px] text-ink/85">Finance system</div>
            <div className="mt-1 text-[11.5px] text-ink/40">Encrypted</div>
          </div>
        </div>
        <div className="mt-2 text-[11.5px] text-ink/40">
          Connection happens after onboarding via Plaid. No bank link is required for the public preview.
        </div>
      </Frame>
    </div>
  );
}

function StepOrganize() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const items = [
    { from: "Stripe deposit", to: "Revenue" },
    { from: "Gusto draft", to: "Payroll" },
    { from: "Vendor ACH", to: "Software" },
    { from: "Contractor xfer", to: "Contractors" },
    { from: "Quarterly set-aside", to: "Tax Reserve" },
  ];
  return (
    <div ref={ref}>
      <Frame label="Organized into structure">
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li
              key={it.from}
              className={`grid grid-cols-[1.2fr_auto_1fr] items-center gap-3 rounded-md border border-ink/[0.04] bg-charcoal-900/50 px-3 py-2.5 transition-all duration-500 ease-cinema ${
                inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
              }`}
              style={{ transitionDelay: `${120 + i * 90}ms` }}
            >
              <span className="text-[13px] text-ink/55">{it.from}</span>
              <span className="text-ink/30">→</span>
              <span className="text-[13px] text-champagne-100/90">{it.to}</span>
            </li>
          ))}
        </ul>
      </Frame>
    </div>
  );
}

function StepBriefing() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const lines = [
    { l: "Cash Movement", b: "Cash up $13,500, largely from delayed vendor payments." },
    { l: "Revenue Trend", b: "Up 14% week-over-week, concentrated in three accounts." },
    { l: "Expense Pattern", b: "Software and contractor costs rising faster than revenue." },
    { l: "Questions to Review", b: "Can the business support another hire this quarter?" },
  ];
  return (
    <div ref={ref}>
      <Frame label="Bi-weekly briefing">
        <div className="space-y-3">
          {lines.map((ln, i) => (
            <div
              key={ln.l}
              className={`rounded-md border border-ink/[0.04] bg-charcoal-900/50 p-3 transition-all duration-500 ease-cinema ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${160 + i * 130}ms` }}
            >
              <div className="text-[10.5px] uppercase tracking-[0.22em] text-champagne-200/60">{ln.l}</div>
              <div className="mt-1.5 text-[13.5px] leading-[1.55] text-ink/80">{ln.b}</div>
            </div>
          ))}
        </div>
      </Frame>
    </div>
  );
}

function StepReview() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const agenda = ["Cash position", "Revenue quality", "Expense pressure", "Hiring readiness", "Next decisions"];
  return (
    <div ref={ref}>
      <Frame label="Monthly strategy review">
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <div className="rounded-xl border border-champagne-200/15 bg-charcoal-800/60 p-4 text-center">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">Apr</div>
            <div className="mt-1 font-zentry text-3xl leading-none text-ink">28</div>
            <div className="mt-1 text-[10.5px] text-champagne-200/70">1:00 PM</div>
          </div>
          <div className="rounded-xl border border-ink/[0.06] bg-charcoal-900/50 p-4">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">Agenda</div>
            <ul className="mt-2 space-y-1.5">
              {agenda.map((a, i) => (
                <li
                  key={a}
                  className={`flex items-center gap-2 text-[13px] text-ink/75 transition-all duration-500 ease-cinema ${
                    inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  }`}
                  style={{ transitionDelay: `${140 + i * 80}ms` }}
                >
                  <span className="h-1 w-1 rounded-full bg-champagne-200/60" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Frame>
    </div>
  );
}

export default function ProcessStepVisual({ index }: { index: number }) {
  const map = [StepSpreadsheet, StepPlaid, StepOrganize, StepBriefing, StepReview];
  const Cmp = map[index];
  return <Cmp />;
}

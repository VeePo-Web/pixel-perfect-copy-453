import { useEffect, useRef, useState } from "react";
import { supabase } from "../../integrations/supabase/client";

type BriefingSection = { label: string; body: string };

type HeroState = "idle" | "loading" | "briefing";

const COPY = {
  eyebrow: "For serious small business owners",
  slogan: "Stop guessing. Know what your numbers mean.",
  headline: "Stop Running Your Business From Your Bank Balance",
  subheadline:
    "Most owners have bank statements, bookkeeping reports, and spreadsheets. What they do not have is a recurring finance rhythm. The Monthly Finance Desk turns your financial activity into organized spreadsheets, bi-weekly plain-English briefings, and a monthly strategy review.",
  placeholder:
    "Describe your business and what you want to understand about your numbers\u2026",
  example:
    "Example: \u201CI run a 12-person agency doing $90K/month. Revenue is growing, but cash still feels tight.\u201D",
  primaryCta: "Generate Sample Finance Briefing",
  secondaryCta: "Use Demo Business Data",
  trust:
    "No bank connection required for this preview. Use demo data or rough non-sensitive numbers.",
  panelLabel: "Sample Bi-Weekly Finance Briefing",
  emptySections: [
    "Cash Movement",
    "Revenue Trend",
    "Expense Pattern",
    "Unusual Spend",
    "Questions to Review",
    "Decisions to Consider",
  ],
  badges: [
    "Plain-English briefing",
    "Monthly strategy review",
    "Built for owner-led businesses",
  ],
  loading: [
    "Reading sample financial activity\u2026",
    "Finding cash movement\u2026",
    "Reviewing expense patterns\u2026",
    "Preparing plain-English briefing\u2026",
  ],
  briefing: [
    {
      label: "Cash Movement",
      body: "Your demo business brought in $92,400 this month and spent $78,900. Cash increased, but most of the gain came from delayed vendor payments, not stronger operating margin.",
    },
    {
      label: "Revenue Trend",
      body: "Revenue is up 14% compared with the previous period. The increase appears concentrated in one client segment, which may create risk if that trend does not continue.",
    },
    {
      label: "Expense Pattern",
      body: "Software, subcontractor, and owner-discretionary expenses are increasing faster than revenue. These categories should be reviewed before adding new fixed costs.",
    },
    {
      label: "Decision to Review",
      body: "Before hiring again, review whether current monthly cash flow can support another payroll obligation without relying on delayed vendor payments.",
    },
    {
      label: "Questions for Monthly Call",
      body: "Should the next move be hiring, expense cleanup, pricing review, or cash reserve planning?",
    },
  ],
  postDemo: {
    headline: "Want this kind of briefing for your real business?",
    body: "Apply for the Monthly Finance Desk and get your financial activity organized, briefed in plain English every two weeks, and reviewed monthly with a strategy call.",
    primary: "Apply for the Monthly Finance Desk",
    secondary: "Get Free Templates",
    micro:
      "Start with the free templates, or apply to have your financial system automated and reviewed monthly.",
  },
  mobile: {
    eyebrow: "For serious small business owners",
    headline: "Stop Running Your Business From Your Bank Balance",
    sub: "Get a plain-English sample briefing that shows what changed, what looks risky, and what decisions deserve your attention.",
    placeholder: "What do you want to understand about your numbers?",
    cta: "Generate Sample Briefing",
    trust: "No bank connection required.",
    afterCta: "Apply for the Monthly Finance Desk",
  },
} as const;

const DEMO_PROMPT =
  "I run a 12-person agency doing $90K/month. Revenue is growing, but cash still feels tight.";
const EXAMPLE_FALLBACK_PROMPT = DEMO_PROMPT;

const FALLBACK_SECTIONS: BriefingSection[] = COPY.briefing.map((s) => ({ ...s }));

const FinanceHero = () => {
  const [state, setState] = useState<HeroState>("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [briefingData, setBriefingData] =
    useState<BriefingSection[]>(FALLBACK_SECTIONS);
  const timeouts = useRef<number[]>([]);

  const clearTimers = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const runBriefing = async (sourcePrompt: string) => {
    clearTimers();
    setState("loading");
    setLoadingStep(0);
    COPY.loading.forEach((_, i) => {
      const id = window.setTimeout(() => setLoadingStep(i), i * 750);
      timeouts.current.push(id);
    });

    const minLoadingMs = COPY.loading.length * 750 + 400;
    const minDelay = new Promise<void>((resolve) => {
      const id = window.setTimeout(() => resolve(), minLoadingMs);
      timeouts.current.push(id);
    });

    const fetchBriefing = (async (): Promise<BriefingSection[]> => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "generate-briefing",
          { body: { prompt: sourcePrompt } }
        );
        if (error) throw error;
        const sections = (data as { sections?: BriefingSection[] } | null)
          ?.sections;
        if (
          Array.isArray(sections) &&
          sections.length === 6 &&
          sections.every((s) => s && typeof s.body === "string" && s.body.trim())
        ) {
          return sections;
        }
        return FALLBACK_SECTIONS;
      } catch (e) {
        console.error("briefing fetch failed", e);
        return FALLBACK_SECTIONS;
      }
    })();

    const [sections] = await Promise.all([fetchBriefing, minDelay]);
    setBriefingData(sections);
    setState("briefing");
  };

  const startDemo = () => {
    const source = prompt.trim() || EXAMPLE_FALLBACK_PROMPT;
    void runBriefing(source);
  };

  const useDemoData = () => {
    setPrompt(DEMO_PROMPT);
    void runBriefing(DEMO_PROMPT);
  };

  const ctasDisabled = state === "loading";

  return (
    <section id="top" className="relative w-full overflow-hidden bg-white text-ink">
      {/* Quiet hairline accents — no dark washes */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />


      <HeroNav />

      <div className="relative mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-7xl flex-col px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* LEFT: copy + composer */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-champagne-300/70" />
              <p className="font-general text-[0.72rem] uppercase tracking-[0.28em] text-champagne-100">
                {COPY.eyebrow}
              </p>
            </div>

            {/* Slogan */}
            <p className="mt-6 font-circular-web text-sm text-ink/70 sm:text-base">
              {COPY.slogan}
            </p>

            {/* Headline */}
            <h1 className="mt-3 font-zentry text-[2.4rem] font-black uppercase leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
              {COPY.headline}
            </h1>

            {/* Subheadline */}
            <p className="mt-7 max-w-2xl font-circular-web text-base leading-relaxed text-ink/75 sm:text-lg">
              <span className="hidden md:inline">{COPY.subheadline}</span>
              <span className="md:hidden">{COPY.mobile.sub}</span>
            </p>

            {/* Command-style composer */}
            <div className="mt-9 max-w-2xl">
              <div className="group relative overflow-hidden rounded-2xl border border-ink/[0.09] bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-20px_rgba(15,23,42,0.18)] transition-colors duration-300 focus-within:border-gold-500/70">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-champagne-200/[0.08] blur-3xl transition-opacity duration-500 group-focus-within:opacity-100" />
                <div className="flex flex-col sm:flex-row sm:items-stretch">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={COPY.placeholder}
                    aria-label="Describe your business"
                    rows={3}
                    className="relative flex-1 resize-none bg-transparent px-5 py-4 font-circular-web text-base text-ink placeholder:text-ink/40 focus:outline-none sm:py-5"
                  />
                  <div className="relative flex items-stretch border-t border-champagne-300/10 p-2 sm:border-l sm:border-t-0">
                    <button
                      onClick={startDemo}
                      disabled={ctasDisabled}
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-champagne-200 px-5 py-3 font-general text-[0.72rem] uppercase tracking-[0.18em] text-navy transition-all duration-300 hover:bg-champagne-100 hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.6)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:rounded-lg"
                    >
                      <span className="hidden md:inline">{COPY.primaryCta}</span>
                      <span className="md:hidden">{COPY.mobile.cta}</span>
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      >
                        &rarr;
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-3 pl-1 font-circular-web text-sm italic text-ink/50">
                {COPY.example}
              </p>

              <div className="mt-4 pl-1">
                <button
                  onClick={useDemoData}
                  disabled={ctasDisabled}
                  className="font-general text-[0.68rem] uppercase tracking-[0.2em] text-ink/45 underline-offset-4 transition-colors hover:text-champagne-100 hover:underline disabled:opacity-50"
                >
                  Try demo business data
                </button>
              </div>

              <p className="mt-5 max-w-md font-circular-web text-xs leading-relaxed text-ink/45">
                <span className="hidden md:inline">{COPY.trust}</span>
                <span className="md:hidden">{COPY.mobile.trust}</span>
              </p>
            </div>
          </div>

          {/* RIGHT: briefing panel */}
          <div id="sample" className="lg:col-span-5">
            <BriefingPanel state={state} loadingStep={loadingStep} sections={briefingData} />

            {/* badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {COPY.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-champagne-300/20 bg-charcoal-800/70 px-3 py-1.5 font-general text-[0.66rem] uppercase tracking-[0.16em] text-ink/70"
                >
                  {b}
                </span>
              ))}
            </div>

            {state === "briefing" && <PostDemoCTA />}
          </div>
        </div>
      </div>
    </section>
  );
};

const NAV_LINKS = [
  { label: "How It Works", href: "#how" },
  { label: "Sample Briefing", href: "#sample" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

const HeroNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-20 border-b border-bone/5 bg-charcoal-950/60 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="font-general text-[0.78rem] uppercase tracking-[0.22em] text-ink"
        >
          Monthly Finance Desk
        </a>
        <nav className="hidden gap-9 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-general text-[0.7rem] uppercase tracking-[0.2em] text-ink/65 transition-colors hover:text-champagne-100"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-ink/80 md:hidden"
        >
          <span className="relative block h-2.5 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-current transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>
      {open && (
        <div className="border-t border-bone/5 bg-charcoal-950/95 md:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col px-5 py-4 sm:px-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-bone/5 py-3 font-general text-[0.78rem] uppercase tracking-[0.2em] text-ink/75 last:border-b-0 hover:text-champagne-100"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

const BriefingPanel = ({
  state,
  loadingStep,
  sections,
}: {
  state: HeroState;
  loadingStep: number;
  sections: BriefingSection[];
}) => {
  const totalSteps = COPY.loading.length;
  const progressPct =
    state === "briefing"
      ? 100
      : state === "loading"
      ? Math.min(100, ((loadingStep + 1) / totalSteps) * 100)
      : 0;

  return (
    <div className="group/panel relative overflow-hidden rounded-2xl border border-ink/[0.09] bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_40px_-24px_rgba(15,23,42,0.18)] motion-safe:animate-panel-rise sm:p-7">
      {/* top rim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent motion-safe:animate-rim-in" />

      {/* progress bar */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-champagne-300/0 via-champagne-200/80 to-champagne-300/0 transition-[width] duration-[750ms] ease-cinema"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* panel header */}
      <div className="flex items-center justify-between border-b border-bone/10 pb-4">
        <div>
          <p className="font-general text-[0.62rem] uppercase tracking-[0.22em] text-champagne-200/80">
            MFD &middot; Briefing 001
          </p>
          <p className="mt-1 font-circular-web text-base text-ink">
            {COPY.panelLabel}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-general text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-cinema ${
            state === "briefing"
              ? "border-champagne-200/40 text-champagne-100"
              : "border-bone/15 text-ink/55"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-[400ms] ease-cinema ${
              state === "briefing"
                ? "bg-champagne-200"
                : state === "loading"
                ? "bg-champagne-300 motion-safe:animate-soft-pulse"
                : "bg-bone/40"
            }`}
          />
          <span key={state} className="motion-safe:animate-[fade-in_180ms_ease-out]">
            {state === "briefing"
              ? "Ready"
              : state === "loading"
              ? `${String(loadingStep + 1).padStart(2, "0")} / ${String(totalSteps).padStart(2, "0")}`
              : "Preview"}
          </span>
        </span>
      </div>

      {/* body */}
      <div className="relative mt-5 min-h-[380px]">
        <div key={state} className="motion-safe:animate-[fade-in_280ms_cubic-bezier(0.22,1,0.36,1)]">
          {state === "idle" && (
            <ul className="space-y-3">
              {COPY.emptySections.map((label, i) => (
                <li
                  key={label}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="relative flex items-center justify-between overflow-hidden rounded-lg border border-bone/5 bg-charcoal-900/40 px-4 py-3 motion-safe:animate-section-in"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-general text-[0.62rem] tracking-[0.18em] text-ink/35">
                      0{i + 1}
                    </span>
                    <span className="font-circular-web text-sm text-ink/80">{label}</span>
                  </span>
                  <span className="relative h-px w-16 overflow-hidden bg-bone/10">
                    <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent motion-safe:animate-shimmer" />
                  </span>
                </li>
              ))}
            </ul>
          )}

          {state === "loading" && (
            <div className="space-y-3 pt-2">
              {COPY.loading.map((line, i) => {
                const active = i === loadingStep;
                const done = i < loadingStep;
                return (
                  <div
                    key={line}
                    className={`flex items-center gap-3 font-circular-web text-sm transition-[color,opacity] duration-[240ms] ease-cinema ${
                      active ? "text-ink" : done ? "text-ink/55" : "text-ink/25"
                    }`}
                  >
                    {done ? (
                      <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-champagne-200" aria-hidden>
                        <path
                          d="M2 6.5 L5 9 L10 3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-[300ms] ${
                          active
                            ? "bg-champagne-200 motion-safe:animate-soft-pulse"
                            : "bg-bone/20"
                        }`}
                      />
                    )}
                    <span className="flex-1">{line}</span>
                    {active && (
                      <span
                        aria-hidden
                        className="ml-1 inline-block h-3 w-px bg-champagne-200 motion-safe:animate-caret-blink"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {state === "briefing" && (
            <div className="space-y-5">
              {sections.map((s, i) => (
                <div
                  key={s.label}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="motion-safe:animate-section-in"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-general text-[0.66rem] uppercase tracking-[0.2em] text-champagne-200">
                      {s.label}
                    </p>
                    <span
                      style={{ animationDelay: `${i * 70 + 120}ms` }}
                      className="h-px flex-1 origin-left bg-gradient-to-r from-champagne-200/30 to-transparent motion-safe:animate-rim-in"
                    />
                  </div>
                  <p className="mt-1.5 font-circular-web text-[0.95rem] leading-relaxed text-ink/85">
                    {highlightFigures(s.body)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const highlightFigures = (text: string) => {
  const parts = text.split(/(\$[\d,]+(?:\.\d+)?|\d+%)/g);
  return parts.map((part, i) =>
    /^(\$[\d,]+(?:\.\d+)?|\d+%)$/.test(part) ? (
      <span key={i} className="font-medium text-champagne-100">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const PostDemoCTA = () => (
  <div
    className="relative mt-6 overflow-hidden rounded-2xl border border-champagne-300/20 bg-charcoal-800/60 p-6 motion-safe:animate-panel-rise"
    style={{ animationDelay: "250ms" }}
  >
    <h3 className="font-zentry text-2xl font-black uppercase leading-tight text-ink sm:text-3xl">
      {COPY.postDemo.headline}
    </h3>
    <p className="mt-3 font-circular-web text-sm leading-relaxed text-ink/75">
      {COPY.postDemo.body}
    </p>
    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
      <button className="group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-champagne-200 px-5 py-3 font-general text-[0.72rem] uppercase tracking-[0.18em] text-navy transition-colors duration-[400ms] ease-cinema hover:bg-champagne-100">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow group-hover/cta:opacity-0"
        />
        <span className="relative">{COPY.postDemo.primary}</span>
        <span aria-hidden className="relative">&rarr;</span>
      </button>
      <button className="inline-flex items-center justify-center rounded-full border border-bone/20 px-5 py-3 font-general text-[0.72rem] uppercase tracking-[0.18em] text-ink/85 transition-colors duration-[400ms] ease-cinema hover:border-champagne-200/60 hover:text-champagne-100">
        {COPY.postDemo.secondary}
      </button>
    </div>
    <p className="mt-4 font-circular-web text-xs italic text-ink/50">
      {COPY.postDemo.micro}
    </p>
  </div>
);

export default FinanceHero;

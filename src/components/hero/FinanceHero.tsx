import { useEffect, useRef, useState } from "react";

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

const FinanceHero = () => {
  const [state, setState] = useState<HeroState>("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [prompt, setPrompt] = useState("");
  const timeouts = useRef<number[]>([]);

  const clearTimers = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const startDemo = () => {
    clearTimers();
    setState("loading");
    setLoadingStep(0);
    COPY.loading.forEach((_, i) => {
      const id = window.setTimeout(() => setLoadingStep(i), i * 750);
      timeouts.current.push(id);
    });
    const finishId = window.setTimeout(() => {
      setState("briefing");
    }, COPY.loading.length * 750 + 400);
    timeouts.current.push(finishId);
  };

  const useDemoData = () => {
    setPrompt(
      "I run a 12-person agency doing $90K/month. Revenue is growing, but cash still feels tight."
    );
    startDemo();
  };

  return (
    <section className="relative w-full bg-charcoal-950 text-bone">
      {/* subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,163,90,0.06),transparent_60%)]"
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-5 pb-24 pt-28 sm:px-8 lg:px-12">
        {/* Wordmark */}
        <div className="mb-10 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-bone/60">
          <span className="font-general">The Monthly Finance Desk</span>
          <span className="hidden font-general sm:inline">
            Los Angeles &middot; Est. by Chris Sam
          </span>
        </div>

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
            <p className="mt-6 font-circular-web text-sm text-bone/70 sm:text-base">
              {COPY.slogan}
            </p>

            {/* Headline */}
            <h1 className="mt-3 font-zentry text-[2.4rem] font-black uppercase leading-[0.95] text-bone sm:text-6xl lg:text-7xl">
              {COPY.headline}
            </h1>

            {/* Subheadline */}
            <p className="mt-7 max-w-2xl font-circular-web text-base leading-relaxed text-bone/75 sm:text-lg">
              {COPY.subheadline}
            </p>

            {/* Composer */}
            <div className="mt-9 max-w-2xl">
              <div className="rounded-2xl border border-champagne-300/15 bg-charcoal-900/80 p-1.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={COPY.placeholder}
                  rows={3}
                  className="w-full resize-none rounded-xl bg-transparent px-4 py-3 font-circular-web text-base text-bone placeholder:text-bone/40 focus:outline-none"
                />
              </div>
              <p className="mt-3 pl-1 font-circular-web text-sm italic text-bone/50">
                {COPY.example}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={startDemo}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-champagne-200 px-6 py-3.5 font-general text-[0.78rem] uppercase tracking-[0.18em] text-charcoal-950 transition-all duration-300 hover:bg-champagne-100 hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.5)]"
                >
                  {COPY.primaryCta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </button>
                <button
                  onClick={useDemoData}
                  className="inline-flex items-center justify-center rounded-full border border-bone/20 px-6 py-3.5 font-general text-[0.78rem] uppercase tracking-[0.18em] text-bone/85 transition-colors duration-300 hover:border-champagne-200/60 hover:text-champagne-100"
                >
                  {COPY.secondaryCta}
                </button>
              </div>

              <p className="mt-5 max-w-md font-circular-web text-xs leading-relaxed text-bone/45">
                {COPY.trust}
              </p>
            </div>
          </div>

          {/* RIGHT: briefing panel */}
          <div className="lg:col-span-5">
            <BriefingPanel state={state} loadingStep={loadingStep} />

            {/* badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {COPY.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-champagne-300/20 bg-charcoal-800/70 px-3 py-1.5 font-general text-[0.66rem] uppercase tracking-[0.16em] text-bone/70"
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

const BriefingPanel = ({
  state,
  loadingStep,
}: {
  state: HeroState;
  loadingStep: number;
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-champagne-300/20 bg-gradient-to-b from-charcoal-800/80 to-charcoal-900/80 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-7">
      {/* top rim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent" />

      {/* panel header */}
      <div className="flex items-center justify-between border-b border-bone/10 pb-4">
        <div>
          <p className="font-general text-[0.62rem] uppercase tracking-[0.22em] text-champagne-200/80">
            Sample
          </p>
          <p className="mt-1 font-circular-web text-base text-bone">
            {COPY.panelLabel}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-general text-[0.6rem] uppercase tracking-[0.18em] ${
            state === "briefing"
              ? "border-champagne-200/40 text-champagne-100"
              : "border-bone/15 text-bone/55"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              state === "briefing"
                ? "bg-champagne-200"
                : state === "loading"
                ? "animate-pulse bg-champagne-300"
                : "bg-bone/40"
            }`}
          />
          {state === "briefing" ? "Ready" : state === "loading" ? "Preparing" : "Preview"}
        </span>
      </div>

      {/* body */}
      <div className="relative mt-5 min-h-[380px]">
        {state === "idle" && (
          <ul className="space-y-3">
            {COPY.emptySections.map((label, i) => (
              <li
                key={label}
                className="flex items-center justify-between rounded-lg border border-bone/5 bg-charcoal-900/40 px-4 py-3"
              >
                <span className="flex items-center gap-3">
                  <span className="font-general text-[0.62rem] tracking-[0.18em] text-bone/35">
                    0{i + 1}
                  </span>
                  <span className="font-circular-web text-sm text-bone/80">{label}</span>
                </span>
                <span className="h-px w-10 bg-bone/15" />
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
                  className={`flex items-center gap-3 font-circular-web text-sm transition-all duration-300 ${
                    active
                      ? "text-bone"
                      : done
                      ? "text-bone/55"
                      : "text-bone/25"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      active
                        ? "animate-pulse bg-champagne-200"
                        : done
                        ? "bg-champagne-300/70"
                        : "bg-bone/20"
                    }`}
                  />
                  {line}
                </div>
              );
            })}
          </div>
        )}

        {state === "briefing" && (
          <div className="space-y-5 animate-fade-in">
            {COPY.briefing.map((s) => (
              <div key={s.label}>
                <p className="font-general text-[0.66rem] uppercase tracking-[0.2em] text-champagne-200">
                  {s.label}
                </p>
                <p className="mt-1.5 font-circular-web text-[0.95rem] leading-relaxed text-bone/85">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PostDemoCTA = () => (
  <div className="mt-6 rounded-2xl border border-champagne-300/20 bg-charcoal-800/60 p-6 animate-fade-in">
    <h3 className="font-zentry text-2xl font-black uppercase leading-tight text-bone sm:text-3xl">
      {COPY.postDemo.headline}
    </h3>
    <p className="mt-3 font-circular-web text-sm leading-relaxed text-bone/75">
      {COPY.postDemo.body}
    </p>
    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
      <button className="inline-flex items-center justify-center gap-2 rounded-full bg-champagne-200 px-5 py-3 font-general text-[0.72rem] uppercase tracking-[0.18em] text-charcoal-950 transition-colors hover:bg-champagne-100">
        {COPY.postDemo.primary}
        <span aria-hidden>&rarr;</span>
      </button>
      <button className="inline-flex items-center justify-center rounded-full border border-bone/20 px-5 py-3 font-general text-[0.72rem] uppercase tracking-[0.18em] text-bone/85 transition-colors hover:border-champagne-200/60 hover:text-champagne-100">
        {COPY.postDemo.secondary}
      </button>
    </div>
    <p className="mt-4 font-circular-web text-xs italic text-bone/50">
      {COPY.postDemo.micro}
    </p>
  </div>
);

export default FinanceHero;

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
// Conversion -> money seam (COORDINATION.md): A's button calls B's helper.
// Opens the embedded CheckoutOverlay directly (no page hop to the money).
import { startAutoFillCheckout } from "../../lib/checkout";

// Persona demo chips — each prefills a realistic, pain-language prompt so the
// visitor self-identifies ("this is built for businesses like mine").
const DEMO_CHIPS: { label: string; prompt: string }[] = [
  { label: "Agency", prompt: "I run a 12-person agency doing about $90K/month. Revenue is growing, but cash still feels tight and contractor costs keep changing." },
  { label: "Clinic", prompt: "I own a clinic with 8 employees. Payroll is the biggest expense, and I want to know if we can afford another hire." },
  { label: "Restaurant", prompt: "I operate a restaurant. Sales are decent, but food costs, payroll, and cash timing make it hard to know what is actually profitable." },
  { label: "Trades", prompt: "I run a trades business with seasonal revenue. I want to understand cash flow before the slower months." },
  { label: "Consultant", prompt: "I'm a consultant with a small team. Revenue is lumpy and I want to know how much cash to keep in reserve." },
  { label: "E-commerce", prompt: "I run an e-commerce business. Revenue moves up and down, ad spend is high, and I want to understand whether growth is actually producing cash." },
  { label: "Local service", prompt: "I run a local service business. Sales are seasonal and I want to understand cash flow before the slow months." },
  { label: "Professional firm", prompt: "I run a professional services firm. Revenue looks healthy but I'm not sure where the money is actually going." },
];

type BriefingSection = { label: string; body: string };

type HeroState = "idle" | "loading" | "briefing";

const COPY = {
  eyebrow: "For serious small business owners",
  slogan: "Stop guessing. Know what your numbers mean.",
  headline: "Stop Running Your Business From Your Bank Balance",
  subheadline:
    "Most owners have bank statements, bookkeeping reports, and spreadsheets. What they do not have is a recurring finance rhythm. The GoldFin Desk turns your financial activity into organized spreadsheets, bi-weekly plain-English briefings, and a monthly strategy review.",
  placeholder:
    "Describe your business and what you want to understand about your numbers\u2026",
  example:
    "Example: \u201CI run a 12-person agency doing $90K/month. Revenue is growing, but cash still feels tight.\u201D",
  primaryCta: "Generate my sample briefing",
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
    "Bi-weekly plain-English briefing",
    "Monthly strategy review",
    "No spreadsheet work",
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
    headline: "Want this briefing for your real business every month?",
    body: "GoldFin Reports fills your templates from your numbers and sends a plain-English briefing like this one — every month. No spreadsheet work. Cancel anytime.",
    primary: "Auto-fill my reports — $99/mo",
    primaryHref: "/pricing#auto-fill",
    secondary: "Get the free Template Vault",
    secondaryHref: "/templates",
    tertiary: "Running something larger? Apply for GoldFin Advisory →",
    tertiaryHref: "/apply",
    micro:
      "$99/mo · No contracts · Cancel anytime · No bank connection required.",
  },
  mobile: {
    eyebrow: "For serious small business owners",
    headline: "Stop Running Your Business From Your Bank Balance",
    sub: "Get a plain-English sample briefing that shows what changed, what looks risky, and what decisions deserve your attention.",
    placeholder: "What do you want to understand about your numbers?",
    cta: "Generate my briefing",
    trust: "No bank connection required.",
    afterCta: "Apply for the GoldFin Desk",
  },
} as const;

const DEMO_PROMPT =
  "I run a 12-person agency doing $90K/month. Revenue is growing, but cash still feels tight.";
const EXAMPLE_FALLBACK_PROMPT = DEMO_PROMPT;

// Rotating placeholder prompts (Lovable-style) — they cycle when the field is
// empty so the visitor instantly sees "this is where I just type my situation".
const HERO_PLACEHOLDERS = [
  "Describe your business and what you want to understand about your numbers...",
  "I run a 12-person agency at $90K/month. Cash still feels tight.",
  "I own a clinic with 8 staff. Can we afford another hire?",
  "Seasonal trades business. Will cash hold through the slow months?",
  "E-commerce, high ad spend. Is growth actually producing cash?",
];

const FALLBACK_SECTIONS: BriefingSection[] = COPY.briefing.map((s) => ({ ...s }));

const FinanceHero = () => {
  const [state, setState] = useState<HeroState>("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [briefingData, setBriefingData] =
    useState<BriefingSection[]>(FALLBACK_SECTIONS);
  const [phIdx, setPhIdx] = useState(0);
  const timeouts = useRef<number[]>([]);

  const clearTimers = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  // Rotating placeholder (Lovable-style): cycles only while the field is empty
  // and motion is allowed. Stops the moment the visitor starts typing.
  useEffect(() => {
    if (prompt.trim()) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(
      () => setPhIdx((i) => (i + 1) % HERO_PLACEHOLDERS.length),
      3400,
    );
    return () => window.clearInterval(id);
  }, [prompt]);

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

      <div className="relative mx-auto flex min-h-[calc(100dvh-56px)] w-full max-w-7xl flex-col px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* LEFT: copy + composer */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-champagne-300/70" />
              <p className="font-general text-[0.72rem] uppercase tracking-[0.28em] text-champagne-300">
                {COPY.eyebrow}
              </p>
            </div>

            {/* Slogan */}
            <p className="mt-6 font-general text-sm text-ink/70 sm:text-base">
              {COPY.slogan}
            </p>

            {/* Headline */}
            <h1 className="mt-3 font-robert-medium text-[2.4rem] font-black uppercase leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
              {COPY.headline}
            </h1>

            {/* Subheadline */}
            <p className="mt-7 max-w-2xl font-general text-base leading-relaxed text-ink/75 sm:text-lg">
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
                    onKeyDown={(e) => {
                      // Chat-style: Enter sends, Shift+Enter makes a new line.
                      if (e.key === "Enter" && !e.shiftKey && !ctasDisabled) {
                        e.preventDefault();
                        startDemo();
                      }
                    }}
                    placeholder={prompt ? "" : HERO_PLACEHOLDERS[phIdx]}
                    aria-label="Describe your business"
                    rows={3}
                    className="relative flex-1 resize-none bg-transparent px-5 py-4 font-general text-base text-ink placeholder:text-ink/40 focus:outline-none sm:py-5"
                  />
                  <div className="relative flex items-stretch border-t border-champagne-300/10 p-2 sm:border-l sm:border-t-0">
                    <button
                      onClick={startDemo}
                      disabled={ctasDisabled}
                      className="group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-3.5 font-general text-[0.72rem] uppercase tracking-[0.18em] text-navy shadow-[0_10px_30px_-12px_rgba(217,190,130,0.7)] transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_16px_46px_-12px_rgba(217,190,130,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:rounded-lg"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent motion-safe:animate-shimmer-slow"
                      />
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        className="relative h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.7L12 3Z" />
                      </svg>
                      <span className="relative hidden md:inline">{COPY.primaryCta}</span>
                      <span className="relative md:hidden">{COPY.mobile.cta}</span>
                      <span
                        aria-hidden
                        className="relative transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      >
                        &rarr;
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Friction-free promise — the rotating placeholder now carries the
                  example, so this line reassures "test it out" with zero risk. */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-1">
                <span className="hidden items-center gap-1.5 font-general text-xs text-ink/45 sm:inline-flex">
                  <kbd className="rounded border border-ink/15 bg-paper-raised px-1.5 py-0.5 font-general text-[10px] not-italic text-ink/55">
                    Enter
                  </kbd>
                  to test it instantly
                </span>
                <span className="font-general text-xs text-ink/50">
                  Free preview in seconds &middot; no signup &middot; no bank data
                </span>
              </div>

              {/* Demo chips — self-identification + zero-effort prefill */}
              <div className="mt-4 pl-1">
                <p className="font-general text-[0.62rem] uppercase tracking-[0.2em] text-ink/40">
                  Or start from a business like yours
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {DEMO_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setPrompt(chip.prompt)}
                      disabled={ctasDisabled}
                      className="rounded-full border border-ink/[0.12] bg-white px-3 py-1.5 font-general text-[0.68rem] tracking-[0.04em] text-ink/70 transition-all duration-300 hover:border-champagne-300/70 hover:text-ink disabled:opacity-50"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={useDemoData}
                  disabled={ctasDisabled}
                  className="mt-3 font-general text-[0.68rem] uppercase tracking-[0.2em] text-ink/45 underline-offset-4 transition-colors hover:text-champagne-200 hover:underline disabled:opacity-50"
                >
                  Try demo business data
                </button>
              </div>

              <p className="mt-5 max-w-md font-general text-xs leading-relaxed text-ink/45">
                <span className="hidden md:inline">{COPY.trust}</span>
                <span className="md:hidden">{COPY.mobile.trust}</span>
              </p>

              {/* Desktop money CTA. Pairs with the demo above the fold so the
                  $99/mo path is unmistakable on large screens with zero scroll.
                  Subordinate (outline) to the filled demo primary -> one dominant
                  primary + one clear money CTA. Below lg, the sticky bottom bar
                  carries it, so there is exactly one $99 CTA per breakpoint. */}
              <div className="mt-7 hidden items-center gap-4 lg:flex">
                <button
                  type="button"
                  onClick={startAutoFillCheckout}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-champagne-300/60 bg-white px-6 py-3.5 font-general text-[0.72rem] uppercase tracking-[0.18em] text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:border-champagne-300 hover:bg-champagne-50 hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <span>Auto-fill my reports &mdash; $99/mo</span>
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    &rarr;
                  </span>
                </button>
                <span className="font-general text-[11px] uppercase tracking-[0.16em] text-ink/40">
                  No bank connection &middot; Cancel anytime
                </span>
              </div>
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
                  className="rounded-full border border-charcoal-700 bg-paper-raised px-3 py-1.5 font-general text-[0.66rem] uppercase tracking-[0.16em] text-ink/70"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* $99/mo CTA placement by breakpoint: desktop = the left-column
                pair beside the demo (above fold); mobile/tablet = the sticky
                bottom bar. Exactly one money CTA per breakpoint, no duplication. */}
            {state === "briefing" && <PostDemoCTA />}
          </div>
        </div>
      </div>
      <MobileStickyHeroCTA />
    </section>
  );
};

// Mobile-only persistent money CTA. Guarantees one clear, thumb-reachable
// $99/mo action on every phone viewport (Contentsquare: sticky bottom-bar
// CTAs ~+31% conversions). Appears after the in-hero demo button scrolls out
// of the thumb zone, so it never competes with the demo for the same screen.
const MobileStickyHeroCTA = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 340);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transform border-t border-ink/[0.08] bg-white/95 backdrop-blur-md transition-all duration-500 ease-cinema lg:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <div className="leading-tight">
          <p className="font-general text-[13px] font-medium text-ink">
            Done-for-you reports
          </p>
          <p className="font-general text-[11px] uppercase tracking-[0.16em] text-ink/45">
            $99/mo &middot; cancel anytime
          </p>
        </div>
        <button
          type="button"
          onClick={startAutoFillCheckout}
          className="shrink-0 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 font-general text-[13px] font-medium text-navy shadow-[0_8px_28px_-10px_rgba(217,190,130,0.6)] transition-all duration-300 ease-cinema active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Start &mdash; $99/mo
        </button>
      </div>
    </div>
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
          <p className="font-general text-[0.62rem] uppercase tracking-[0.22em] text-champagne-300/70">
            GFD &middot; Briefing 001
          </p>
          <p className="mt-1 font-general text-base text-ink">
            {COPY.panelLabel}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-general text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-cinema ${
            state === "briefing"
              ? "border-champagne-200/40 text-champagne-300"
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
                  className="relative flex items-center justify-between overflow-hidden rounded-lg border border-charcoal-700 bg-paper-raised px-4 py-3 motion-safe:animate-section-in"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-general text-[0.62rem] tracking-[0.18em] text-ink/35">
                      0{i + 1}
                    </span>
                    <span className="font-general text-sm text-ink/80">{label}</span>
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
                    className={`flex items-center gap-3 font-general text-sm transition-[color,opacity] duration-[240ms] ease-cinema ${
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
                  <p className="mt-1.5 font-general text-[0.95rem] leading-relaxed text-ink/85">
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
      <span key={i} className="font-medium text-champagne-200">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const PostDemoCTA = () => (
  <div
    className="relative mt-6 overflow-hidden rounded-2xl border border-charcoal-700 bg-paper-raised p-6 shadow-[0_1px_3px_0_rgba(11,13,18,0.07)] motion-safe:animate-panel-rise"
    style={{ animationDelay: "250ms" }}
  >
    <h3 className="font-robert-medium text-2xl font-black uppercase leading-tight text-ink sm:text-3xl">
      {COPY.postDemo.headline}
    </h3>
    <p className="mt-3 font-general text-sm leading-relaxed text-ink/75">
      {COPY.postDemo.body}
    </p>
    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={startAutoFillCheckout}
        className="group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-3 font-general text-[0.72rem] uppercase tracking-[0.18em] text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_10px_36px_-10px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow"
        />
        <span className="relative">{COPY.postDemo.primary}</span>
        <span aria-hidden className="relative">&rarr;</span>
      </button>
      <a
        href={COPY.postDemo.secondaryHref}
        className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 font-general text-[0.72rem] uppercase tracking-[0.18em] text-ink/85 transition-all duration-300 ease-cinema hover:border-ink/30 hover:bg-ink/[0.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
      >
        {COPY.postDemo.secondary}
      </a>
    </div>
    <p className="mt-3 font-general text-[11px] uppercase tracking-[0.22em] text-ink/40">No contracts · Cancel anytime</p>
    <a
      href={COPY.postDemo.tertiaryHref}
      className="mt-3 inline-block font-general text-[0.68rem] uppercase tracking-[0.18em] text-ink/45 underline-offset-4 transition-colors hover:text-champagne-200 hover:underline"
    >
      {COPY.postDemo.tertiary}
    </a>
    <p className="mt-4 font-general text-xs italic text-ink/50">
      {COPY.postDemo.micro}
    </p>
  </div>
);

export default FinanceHero;

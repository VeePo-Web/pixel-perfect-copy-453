type Props = {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  onUseDemo: () => void;
  disabled?: boolean;
};

export default function BusinessPromptInput({ value, onChange, onGenerate, onUseDemo, disabled }: Props) {
  return (
    <div className="relative rounded-2xl border border-ink/[0.08] bg-charcoal-900/50 p-5 backdrop-blur-sm transition-colors duration-400 ease-cinema focus-within:border-champagne-200/30">
      <label htmlFor="bp" className="sr-only">
        Describe your business
      </label>
      <textarea
        id="bp"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Describe your business and what you want to understand about your numbers…"
        className="w-full resize-none bg-transparent text-[15px] leading-[1.6] text-ink placeholder:text-ink/35 focus:outline-none"
      />
      <p className="mt-2 text-[12px] text-ink/40">
        Example: “I run a 12-person agency doing $90K/month. Revenue is growing, but cash still feels tight.”
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled}
          className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium tracking-wide text-navy transition-all duration-400 ease-cinema hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)] disabled:opacity-60"
        >
          <span className="relative z-10">Generate My Sample Briefing</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
        </button>
        <button
          type="button"
          onClick={onUseDemo}
          className="rounded-full border border-ink/[0.1] px-5 py-3 text-[13px] text-ink/80 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink"
        >
          Use Demo Business Data
        </button>
        <a
          href="#/apply"
          className="ml-auto text-[12.5px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Apply for the Monthly Finance Desk →
        </a>
      </div>
    </div>
  );
}

type Props = {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  status: "idle" | "loading" | "ready";
};

// ONE-CTA doctrine: pre-aha the hero has exactly one loud action (Generate). The
// industry chips above pre-fill this prompt, so demo data is implicit (zero friction)
// and no second button is needed. Offer CTAs (150/mo, Apply) appear only AFTER the
// reveal. Post-aha (status ready) the Generate button is demoted to a quiet
// "generate another" so the eye flows down to the full briefing and the offer.
export default function BusinessPromptInput({ value, onChange, onGenerate, status }: Props) {
  const loading = status === "loading";
  const ready = status === "ready";
  return (
    <div className="relative rounded-2xl border border-ink/[0.08] bg-charcoal-900/50 p-5 backdrop-blur-sm transition-colors duration-300 ease-cinema focus-within:border-champagne-200/30">
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
        Example: "I run a 12-person agency doing $90K/month. Revenue is growing, but cash still feels tight."
      </p>
      <div className="mt-4">
        {ready ? (
          <div className="flex flex-col items-start gap-2">
            <button
              type="button"
              onClick={onGenerate}
              className="group inline-flex items-center gap-1.5 rounded-full border border-ink/[0.12] px-5 py-2.5 text-[12.5px] text-ink/75 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
            >
              <span aria-hidden className="transition-transform duration-500 group-hover:rotate-180">↻</span>
              Generate another briefing
            </button>
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne-300/70">
              Your full briefing is below ↓
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onGenerate}
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 py-4 text-center text-[14px] font-medium tracking-wide text-ink transition-all duration-300 ease-cinema sm:py-3.5 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              <span className="relative z-10">
                {loading ? "Generating your briefing…" : "Generate My Sample Briefing →"}
              </span>
            </button>
            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-ink/45">
              Free · No bank connection · Takes ~10 seconds
            </p>
          </>
        )}
      </div>
    </div>
  );
}

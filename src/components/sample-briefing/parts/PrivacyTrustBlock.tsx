import { privacyCards } from "../content";

export default function PrivacyTrustBlock() {
  return (
    <section className="border-b border-white/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
              Preview safely
            </div>
            <h2 className="mt-4 font-light text-bone text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[42px]">
              Preview safely. Connect only after onboarding.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.7] text-bone/70">
              You can experience the full briefing rhythm before committing. No bank login, no payment, no pressure.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {privacyCards.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-all duration-300 ease-cinema hover:border-green-signal/40 hover:bg-green-deep/15"
              >
                <span
                  aria-hidden
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-signal"
                />
                <span className="text-[14px] leading-[1.55] text-bone/85">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

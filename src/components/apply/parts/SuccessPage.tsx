import { useEffect } from "react";
import { APPLY } from "../content";
import { navigate } from "../hooks/useHashRoute";
import ApplicationHeader from "./ApplicationHeader";

export default function SuccessPage({ onClear }: { onClear: () => void }) {
  const c = APPLY.success;
  useEffect(() => {
    onClear();
  }, [onClear]);

  return (
    <div className="min-h-screen bg-white text-ink">
      <ApplicationHeader />
      <main
        className="relative mx-auto max-w-3xl px-6 py-20 md:py-28"
        style={{
          backgroundImage:
            "radial-gradient(1000px 600px at 50% -10%, rgba(63,122,94,0.06), transparent 60%)",
        }}
      >
        <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-green-signal">Confirmed</div>
        <h1 className="mt-4 font-display font-medium text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance] motion-safe:animate-section-in">
          {c.headline}
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/65">{c.sub}</p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {c.confirm.map((line, i) => (
            <div
              key={line}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-[13.5px] shadow-[0_1px_2px_rgba(11,13,18,0.04)] ${
                i === 0 ? "border-green-signal/30 bg-green-signal/[0.05] text-ink" : "border-ink/[0.08] bg-white text-ink/70"
              }`}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? "bg-green-signal" : "bg-champagne-200"}`} />
              {line}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-ink/45">What happens next</div>
          <ol className="relative mt-5">
            <div className="absolute left-[10px] top-2 bottom-2 w-px bg-ink/[0.06]" />
            {c.timeline.map((t, i) => (
              <li key={t} className="relative pl-8 py-2.5">
                <span
                  className={`absolute left-[5px] top-[14px] h-3 w-3 rounded-full border ${
                    i === 0 ? "border-champagne-300/80 bg-champagne-200" : "border-ink/[0.15] bg-white"
                  }`}
                />
                <span className={`text-[14px] ${i === 0 ? "text-ink" : "text-ink/55"}`}>{t}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            onClick={() => navigate("#top")}
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {c.primary}
          </button>
          <a href="/templates" className="rounded-full border border-ink/[0.12] bg-white px-6 py-3.5 text-[13px] text-ink/70 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
            {c.secondary}
          </a>
        </div>

        <div className="mt-16">
          <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-ink/45">While you wait</div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {c.wait.map((w) => (
              <a
                key={w.t}
                href={w.href}
                className="group rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)]"
              >
                <div className="text-[13.5px] leading-[1.5] text-ink/85 group-hover:text-ink">{w.t}</div>
                <div className="mt-3 font-general text-[10.5px] uppercase tracking-[0.22em] text-champagne-300">Open →</div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

import { startAutoFillCheckout } from "../../../lib/checkout";
import { whatThisIsNot } from "../content";

export default function WhatThisIsNot() {
  return (
    <section className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Category clarity
          </div>
          <h2 className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
            This is not another dashboard.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {whatThisIsNot.map((c) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-ink/[0.07] bg-charcoal-900/55 p-6 transition-all duration-300 ease-cinema hover:-translate-y-1 hover:border-champagne-200/30"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink/45">{c.title.split(" ")[0]}</div>
              <h3 className="mt-2 text-[18px] font-light text-ink">{c.title}</h3>
              <p className="mt-3 text-[13.5px] leading-[1.65] text-ink/70">{c.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button type="button" onClick={startAutoFillCheckout}
            className="group relative inline-flex overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(217,190,130,0.45)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <span className="relative z-10">Auto-fill my reports — $99/mo</span>
            <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
          </button>
          <a
            href="#/apply"
            className="text-[13px] text-ink/55 underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
          >
            Running something larger? Apply for GoldFin Advisory →
          </a>
        </div>
      </div>
    </section>
  );
}

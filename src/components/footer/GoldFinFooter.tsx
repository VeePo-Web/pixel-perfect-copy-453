import { BRAND } from "../../brand";
import GoldFinLogo from "../brand/GoldFinLogo";
import { startAutoFillCheckout } from "../../lib/checkout";

const NAV_GROUPS = [
  {
    label: "Product",
    ariaLabel: "Product navigation",
    links: [
      { label: "How It Works",    href: "/#how-it-works" },
      { label: "Sample Briefing", href: "/sample-briefing" },
      { label: "Templates",       href: "/templates" },
      { label: "Pricing",         href: "/pricing" },
      { label: "Blog",            href: "/blog/" },
    ],
  },
  {
    label: "Compare",
    ariaLabel: "Compare navigation",
    links: [
      { label: "vs. Alternatives",     href: "/compare" },
      { label: "vs. Bookkeeper & CFO", href: "/three-way-compare" },
    ],
  },
  {
    label: "Company",
    ariaLabel: "Company navigation",
    links: [
      { label: "Security & FAQ", href: "/security-faq" },
      { label: "Apply",          href: "/apply" },
    ],
  },
] as const;

const TRUST_PILLS = [
  "No bank connection required",
  "Cancel anytime",
  "47 founders trust GoldFin",
] as const;

const SECURITY_SIGNALS = [
  "No bank connection required",
  "256-bit encryption",
  "Cancel anytime",
] as const;

const LEGAL_LINKS = [
  { label: "Privacy",  href: "/privacy" },
  { label: "Terms",    href: "/terms" },
  { label: "Security", href: "/security-faq" },
  { label: "Data Retention", href: "/data-retention" },
  { label: "Plaid Operations", href: "/plaid-operations" },
  { label: "MFA Policy", href: "/mfa-policy" },
  { label: "MFA Attestation", href: "/mfa-attestation" },
] as const;

export default function GoldFinFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* ── Pre-footer CTA band ──────────────────────────────────────────
          Brunson: the highest-intent visitors on any page are the ones who
          scroll to the bottom. This band is their last conversion moment.
          Rung 1 (free templates) is the primary so there's always a "yes."
          Rung 2 ($150/mo) is ghost-secondary for ready buyers.
          Trust pills kill any remaining objections at the decision point.
      ──────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="footer-cta-heading"
        className="relative overflow-hidden bg-[#080A0E]"
      >
        {/* Champagne hairline at top — visual transition from page content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300/40 to-transparent"
        />
        {/* Warm radial glow — brand signature */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(201,162,74,0.07)_0%,transparent_75%)]"
        />

        <div className="relative mx-auto max-w-2xl px-6 py-20 text-center md:px-10">

          {/* Eyebrow */}
          <p className="mb-3 font-general text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">
            Your reports, automated
          </p>

          {/* Headline — Hormozi: state the transformation, not the feature */}
          <h2
            id="footer-cta-heading"
            className="mb-4 font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.02em] text-white [text-wrap:balance] sm:text-[2.5rem]"
          >
            Stop guessing. Start knowing.
          </h2>

          {/* Sub-headline */}
          <p className="mx-auto mb-9 max-w-[40ch] text-[14.5px] leading-[1.72] text-white/55">
            Monthly financial briefings, auto-generated from your numbers —
            delivered to owner-led businesses.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">

            {/* Gold primary — Rung 1 lead magnet recovery (Wiebe first-person) */}
            <a
              href="/templates"
              className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-8 py-3 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A0E]"
            >
              Get my free templates →
            </a>

            {/* Ghost secondary — Rung 2 direct to checkout */}
            <button
              type="button"
              onClick={startAutoFillCheckout}
              className="rounded-full border border-white/[0.16] px-8 py-3 text-[13.5px] font-medium text-white/80 transition-all duration-200 hover:border-white/[0.32] hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A0E]"
            >
              Or start at $150/mo
            </button>
          </div>

          {/* Trust pills — friction-killers at the decision moment */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {TRUST_PILLS.map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.06] px-3.5 py-1.5 text-[11px] text-white/75"
              >
                <span aria-hidden className="text-[9px] text-champagne-200/90">✓</span>
                {pill}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ── Footer body ─────────────────────────────────────────────────
          Fintech-trust standard: Stripe × Linear × Mercury.
          Brand column carries social proof + security signals so trust
          is present even for visitors who skipped the CTA band.
          Semantic <nav> on every link group for accessibility and SEO.
      ──────────────────────────────────────────────────────────────── */}
      <footer aria-label="Site footer" className="relative border-t border-ink/[0.06] bg-paper-raised">

        {/* Champagne gradient hairline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent"
        />

        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16 lg:px-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

            {/* Brand column */}
            <div className="flex flex-col gap-5">
              <a
                href="/"
                aria-label={`${BRAND.name} — Home`}
                className="group w-fit"
              >
                <GoldFinLogo
                  markClassName="h-8 w-8 transition-opacity duration-200 group-hover:opacity-80"
                  wordmarkClassName="text-[12.5px] uppercase tracking-[0.26em] text-ink transition-opacity duration-200 group-hover:opacity-70"
                />
              </a>

              <p className="max-w-[28ch] text-[13.5px] leading-[1.65] text-ink/55">
                {BRAND.tagline}.
              </p>

              {/* Social proof — star ratings process 60,000× faster than copy */}
              <p className="text-[12.5px] text-champagne-300">
                ★★★★★{" "}
                <span className="font-general text-[11px] tabular-nums text-ink/45">4.9 · 47 founders</span>
              </p>

              {/* Security signals — non-negotiable for a financial product */}
              <ul className="flex flex-col gap-1.5" aria-label="Security assurances">
                {SECURITY_SIGNALS.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 text-[11.5px] text-ink/45"
                  >
                    <span aria-hidden className="text-[9px] text-green-signal">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nav groups — semantic <nav> per group (Victorious SEO standard) */}
            {NAV_GROUPS.map((group) => (
              <nav key={group.label} aria-label={group.ariaLabel}>
                <p className="mb-4 font-general text-[10.5px] uppercase tracking-[0.24em] text-ink/40">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center text-[13.5px] text-ink/60 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/60 focus-visible:ring-offset-2"
                      >
                        <span className="border-b border-transparent pb-px group-hover:border-ink/20">
                          {link.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

          </div>

          {/* Divider */}
          <div className="mt-12 h-px bg-ink/[0.06]" />

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Copyright */}
            <p className="text-[12px] text-ink/45">
              © {year} {BRAND.name}. All rights reserved.
            </p>

            {/* Legal links — required for a financial SaaS product */}
            <nav aria-label="Legal">
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[12px] text-ink/45 transition-colors duration-200 hover:text-ink/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne-300/40 focus-visible:ring-offset-1"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Brand signature — replaces the previously duplicated tagline */}
            <p className="font-general text-[11px] italic text-champagne-300/70 sm:text-right">
              Clarity before complexity.
            </p>

          </div>
        </div>
      </footer>
    </>
  );
}

import { BRAND } from "../../brand";
import GoldFinLogo from "../brand/GoldFinLogo";

const NAV_GROUPS = [
  {
    label: "Product",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Sample Briefing", href: "#/sample-briefing" },
      { label: "Templates", href: "#/templates" },
      { label: "Pricing", href: "#/pricing" },
    ],
  },
  {
    label: "Compare",
    links: [
      { label: "vs. Alternatives", href: "#/compare" },
      { label: "vs. Bookkeeper & CFO", href: "#/three-way-compare" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Security & FAQ", href: "#/security-faq" },
      { label: "Apply", href: "#/apply" },
    ],
  },
] as const;

export default function GoldFinFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="relative border-t border-ink/[0.06] bg-paper-raised"
    >
      {/* Gold hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16 lg:px-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <a href="/" aria-label={BRAND.name} className="group w-fit">
              <GoldFinLogo
                markClassName="h-8 w-8 transition-opacity duration-200 group-hover:opacity-80"
                wordmarkClassName="text-[12.5px] uppercase tracking-[0.26em] text-ink transition-opacity duration-200 group-hover:opacity-70"
              />
            </a>
            <p className="max-w-[28ch] text-[13.5px] leading-[1.65] text-ink/55">
              {BRAND.tagline}.
            </p>
            <p className="text-[12px] leading-[1.6] text-ink/38 sm:max-w-[30ch]">
              Monthly financial reports, auto-generated from your numbers —
              delivered to owner-led businesses.
            </p>
          </div>

          {/* Nav link groups */}
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-champagne-300">
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
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 h-px bg-ink/[0.06]" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-ink/38">
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-[12px] text-ink/32 sm:text-right">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

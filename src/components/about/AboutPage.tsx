import { useEffect } from "react";
import { startAutoFillCheckout } from "../../lib/checkout";

// About page — "A mini Goldman Sachs, built for the people."
// No founder names. Prior-employer references only (past tense, no endorsement).
// Two-rung ladder: Free Vault + $150/mo Auto-Filled Reports.
export default function AboutPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "About — Wall Street playbooks, built for owner-led businesses | GoldFin Desk";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "GoldFin Desk rebuilds the institutional finance playbooks used at Goldman Sachs, Bank of America, RBC, and Merrill Lynch — in plain English, auto-filled from your bank feed, $150/mo.",
    );
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <article className="relative bg-paper pb-24 pt-32 text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "GoldFin Desk",
            url: "https://goldfindesk.com/about",
            description:
              "Institutional finance frameworks, auto-filled from your bank feed and delivered every two weeks in plain English.",
            slogan: "A mini Goldman Sachs, built for the people.",
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[880px] px-6 text-center">
        <div className="mb-5 text-[10px] uppercase tracking-[0.32em] text-champagne-300">
          About GoldFin Desk
        </div>
        <h1 className="font-serif text-[44px] leading-[1.08] tracking-[-0.02em] text-ink md:text-[64px]">
          Wall Street built these tools for hedge funds.
          <br />
          <span className="text-champagne-400">We rebuilt them for you.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-[640px] text-[17px] leading-[1.65] text-ink/70 md:text-[18px]">
          Our team spent years inside Goldman Sachs, Bank of America, Royal Bank
          of Canada, and Merrill Lynch — running the models that ran the money.
          Now we&rsquo;re pointing that firepower at the businesses those banks
          were never built for: yours.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => startAutoFillCheckout()}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-4 text-[15px] font-medium text-navy shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.98]"
          >
            <span className="relative z-10">Auto-fill my reports — $150/mo</span>
          </button>
          <a
            href="/templates"
            className="inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-6 py-[13px] text-[14px] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
          >
            Get the free templates →
          </a>
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ink/40">
          Read-only bank access via Plaid · Cancel anytime · No sales calls
        </p>
      </section>

      {/* ── Origin ── */}
      <section className="mx-auto mt-24 max-w-[720px] px-6">
        <div className="mb-5 text-center text-[10px] uppercase tracking-[0.28em] text-ink/40">
          Where this started
        </div>
        <h2 className="font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
          The idea started on a trading floor.
        </h2>
        <div className="mt-6 space-y-5 text-[16.5px] leading-[1.75] text-ink/75">
          <p>
            Someone on the desk watched a family friend — a plumber running a
            $600k-a-year business — pay $18,000 for an audit that told him
            nothing he didn&rsquo;t already know. That was the moment.
          </p>
          <p>
            The tools inside the bank were 100× better than anything a plumber,
            a dentist, or an agency owner could ever buy. So we took the
            frameworks used to brief institutional clients — cash clarity,
            concentration risk, waste analysis, tax reserving — and rebuilt
            them in plain English, auto-filled from your bank feed, delivered
            every two weeks.
          </p>
          <p className="font-medium text-ink">
            No jargon. No 40-page decks. No $18,000 invoice.
          </p>
        </div>
      </section>

      {/* ── Credentials strip ── */}
      <section className="mx-auto mt-24 max-w-[880px] px-6 text-center">
        <div className="mb-6 text-[10px] uppercase tracking-[0.28em] text-ink/40">
          Where our team learned the craft
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            "Goldman Sachs",
            "Bank of America",
            "Royal Bank of Canada",
            "Merrill Lynch",
          ].map((firm) => (
            <div
              key={firm}
              className="rounded-lg border border-ink/[0.08] bg-white px-4 py-6 font-serif text-[15px] tracking-tight text-ink/70"
            >
              {firm}
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-[600px] text-[11.5px] leading-[1.6] text-ink/40">
          Team experience references prior employment. GoldFin Desk is an
          independent company and is not affiliated with, endorsed by, or a
          partner of any listed institution.
        </p>
      </section>

      {/* ── What "mini Goldman Sachs" means ── */}
      <section className="mx-auto mt-24 max-w-[1080px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-ink/40">
            What &ldquo;mini Goldman Sachs&rdquo; actually means
          </div>
          <h2 className="mx-auto max-w-[720px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
            Institutional discipline. Owner language. Fair price.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Institutional discipline",
              body: "Every number traces to a real bank transaction. No estimates. No vibes. No creative categorization.",
            },
            {
              title: "Owner-language delivery",
              body: "Five bullets on a Monday morning. No dashboards to log into. No jargon you have to translate.",
            },
            {
              title: "Fair pricing",
              body: "$150 a month, not $1,500 an hour. Because you're building a business, not a hedge fund.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-ink/[0.08] bg-white p-7"
            >
              <div className="font-serif text-[20px] text-ink">{c.title}</div>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink/70">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── For the people ── */}
      <section className="mx-auto mt-24 max-w-[720px] px-6">
        <div className="mb-5 text-center text-[10px] uppercase tracking-[0.28em] text-champagne-400">
          Who this is for
        </div>
        <h2 className="text-center font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
          Big banks were never going to build this for you. So we did.
        </h2>
        <ul className="mx-auto mt-8 space-y-4 text-[16.5px] leading-[1.7] text-ink/75">
          {[
            "For the plumber who wonders every Friday if payroll clears.",
            "For the dentist whose books are two months behind.",
            "For the agency owner who hasn't paid herself a salary in three quarters.",
            "For the contractor whose idea of a good year is that the bank account didn't go red.",
          ].map((line) => (
            <li key={line} className="flex gap-3">
              <span className="mt-[10px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-champagne-300" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── What you get for $150/mo ── */}
      <section className="mx-auto mt-24 max-w-[1080px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-ink/40">
            What you get for $150/mo
          </div>
          <h2 className="mx-auto max-w-[720px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
            One bi-weekly briefing. Six things that change how you run the week.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Cash clarity", "How much you actually have, after committed spend."],
            ["Profit-first split", "Owner pay, tax, operating — pre-allocated."],
            ["Concentration tracker", "Which client is quietly becoming your whole business."],
            ["Waste audit", "Recurring charges and price creep, flagged before renewal."],
            ["Tax reserve ledger", "So April never surprises you again."],
            ["Plain-English summary", "Five bullets. What changed. What to do."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-ink/[0.08] bg-white p-6">
              <div className="font-serif text-[18px] text-ink">{title}</div>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-ink/65">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => startAutoFillCheckout()}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-4 text-[15px] font-medium text-navy shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.98]"
          >
            Auto-fill my reports — $150/mo
          </button>
          <div className="mt-3">
            <a href="/sample-briefing" className="text-[13px] text-ink/55 underline decoration-ink/20 underline-offset-[6px] hover:text-ink">
              See a sample briefing first →
            </a>
          </div>
        </div>
      </section>

      {/* ── The promise ── */}
      <section className="mx-auto mt-24 max-w-[720px] px-6 text-center">
        <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-champagne-400">
          Our promise
        </div>
        <p className="font-serif text-[26px] leading-[1.3] tracking-[-0.01em] text-ink md:text-[32px]">
          If your first briefing doesn&rsquo;t surface at least one number that
          changes what you do this week — it&rsquo;s free.
        </p>
      </section>

      {/* ── Final CTA ── */}
      <section className="mx-auto mt-24 max-w-[720px] px-6 text-center">
        <div className="mx-auto mb-8 h-px w-16 bg-champagne-300/60" />
        <h2 className="font-serif text-[34px] leading-[1.12] tracking-[-0.01em] text-ink md:text-[44px]">
          Ready to run your business like the desk sees it?
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => startAutoFillCheckout()}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-8 py-4 text-[15px] font-medium text-navy shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.98]"
          >
            Auto-fill my reports — $150/mo
          </button>
          <a
            href="/templates"
            className="inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-7 py-[13px] text-[14px] text-ink/70 hover:border-ink/30 hover:text-ink"
          >
            Or start free with the templates →
          </a>
        </div>
        <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-ink/40">
          Read-only bank access · Cancel anytime · No sales calls
        </p>
      </section>
    </article>
  );
}

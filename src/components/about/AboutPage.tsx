import { useEffect } from "react";
import { startAutoFillCheckout } from "../../lib/checkout";

// About page — content sourced from the internal pitch decks (Intro_Deck / One_Pager).
// Three-tier ladder: Free · $150/mo Reports · Advisory (custom, contact-only).
// Compliance: past-tense employment references only; explicit non-affiliation disclaimer.
const ADVISORY_EMAIL = "chris@goldfindesk.com";
const ADVISORY_SUBJECT = "Advisory inquiry";
const advisoryMailto = `mailto:${ADVISORY_EMAIL}?subject=${encodeURIComponent(ADVISORY_SUBJECT)}`;

export default function AboutPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title =
      "About — A dedicated thought partner for business owners | GoldFin Desk";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "GoldFin Desk was built by a team with experience at Goldman Sachs, Bank of America, RBC, and Merrill Lynch. Institutional-grade financial thinking, translated into plain English, pointed at owner-led businesses.",
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
              "A dedicated thought partner for business owners. Institutional-grade financial thinking, delivered every two weeks in plain English.",
            founder: [
              {
                "@type": "Person",
                name: "Chris Sam",
                jobTitle: "Founder",
              },
            ],
            member: [
              {
                "@type": "Person",
                name: "Parker G",
                jobTitle: "Partner, Operations",
              },
            ],
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[880px] px-6 text-center">
        <div className="mb-5 text-[10px] uppercase tracking-[0.32em] text-champagne-300">
          About GoldFin Desk
        </div>
        <h1 className="font-serif text-[44px] leading-[1.08] tracking-[-0.02em] text-ink md:text-[64px]">
          A dedicated thought partner
          <br />
          <span className="text-champagne-400">for business owners.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-[640px] text-[17px] leading-[1.65] text-ink/70 md:text-[18px]">
          Institutional-grade financial thinking, pointed at your business —
          every two weeks, in plain English you can act on by Friday.
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
            href="#advisory-contact"
            className="inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-6 py-[13px] text-[14px] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
          >
            Talk to Chris about Advisory →
          </a>
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ink/40">
          Read-only bank access via Plaid · Cancel anytime · No sales calls
        </p>
      </section>

      {/* ── A note from Chris ── */}
      <section className="mx-auto mt-28 max-w-[720px] px-6">
        <div className="mb-5 text-center text-[10px] uppercase tracking-[0.28em] text-ink/40">
          A note to begin
        </div>
        <h2 className="font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
          Why we built this.
        </h2>
        <div className="mt-6 space-y-5 text-[16.5px] leading-[1.75] text-ink/75">
          <p>
            You built a real business. Somewhere along the way it got
            complicated enough that the numbers started keeping secrets from
            you — not because you&rsquo;re not smart, but because nobody ever
            sat down and translated them into decisions.
          </p>
          <p>
            For thirty years, that kind of thinking was reserved for companies
            large enough to afford a finance team. The owner of a $3-million
            business got a shoebox of receipts and a tax bill. The owner of a
            $3-billion business got a room full of analysts asking, every week,
            &ldquo;what is the money actually doing, and what should we do about
            it?&rdquo;
          </p>
          <p className="font-medium text-ink">
            The gap was never the thinking. It was access.
          </p>
          <p>
            That gap is closing. The same discipline — read the numbers, find
            the story, decide — can now be pointed at a business your size, at
            a cost that finally makes sense. That is the entire reason this
            exists: to put a senior financial mind on your side of the table,
            every two weeks, in plain language you can act on by Friday.
          </p>
          <p className="pt-3 text-[14px] uppercase tracking-[0.22em] text-champagne-400">
            — Chris Sam, Founder · ex-Goldman Sachs banker
          </p>
        </div>
      </section>

      {/* ── The information gap ── */}
      <section className="mx-auto mt-24 max-w-[1080px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-ink/40">
            The information gap
          </div>
          <h2 className="mx-auto max-w-[720px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
            The thinking behind big-company decisions was never the hard part.
            Access was.
          </h2>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-ink/[0.08] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="border-b border-ink/[0.08] bg-charcoal-950/[0.02] p-8 md:border-b-0 md:border-r">
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-ink/45">
                A $500M company
              </div>
              <ul className="mt-6 space-y-4 text-[15px] leading-[1.6] text-ink/80">
                <li>A weekly cash and margin review.</li>
                <li>A team that flags a customer going bad before it hurts.</li>
                <li>A model that answers &ldquo;what if&rdquo; in minutes.</li>
                <li>Someone whose whole job is to ask what the numbers mean.</li>
              </ul>
            </div>
            <div className="p-8">
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-400">
                A $3M company
              </div>
              <ul className="mt-6 space-y-4 text-[15px] leading-[1.6] text-ink/70">
                <li>A year-end tax return.</li>
                <li>A bank that calls when it wants to sell something.</li>
                <li>A gut feel about which jobs went well.</li>
                <li>A spreadsheet nobody trusts.</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center font-serif text-[20px] italic leading-[1.4] text-ink/70 md:text-[22px]">
          The thinking isn&rsquo;t different. Access to it is.
        </p>
      </section>

      {/* ── What we are ── */}
      <section className="mx-auto mt-24 max-w-[1080px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-ink/40">
            What we are
          </div>
          <h2 className="mx-auto max-w-[720px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
            A thought partner does three things — and only three things.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Analysis",
              body: "We read your numbers the way a senior finance team would — cash, margin, customers, what's coming — and find the story underneath them.",
            },
            {
              n: "02",
              title: "Translation",
              body: "We turn that into plain English you can act on: what changed, why it matters, and the two or three decisions in front of you.",
            },
            {
              n: "03",
              title: "Judgment",
              body: "We tell you what we'd watch and what we'd do — a point of view, not a dashboard. A senior advisor signs every page.",
            },
          ].map((c) => (
            <div
              key={c.n}
              className="rounded-xl border border-ink/[0.08] bg-white p-7"
            >
              <div className="text-[11px] uppercase tracking-[0.28em] text-champagne-400">
                {c.n}
              </div>
              <div className="mt-3 font-serif text-[22px] text-ink">{c.title}</div>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink/70">
                {c.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[640px] text-center text-[15px] leading-[1.6] text-ink/60">
          Not your accountant, your bank, or a broker. We don&rsquo;t file,
          lend, or sell. We think — with you.
        </p>
      </section>

      {/* ── Who is behind it ── */}
      <section className="mx-auto mt-24 max-w-[1120px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-champagne-400">
            Who is behind it
          </div>
          <h2 className="mx-auto max-w-[760px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[40px]">
            The same analytical standard used on billion-dollar decisions,
            pointed at yours.
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Chris Sam */}
          <div className="rounded-2xl border border-ink/[0.08] bg-white p-8 md:p-10">
            <div className="flex items-start gap-5">
              <div
                aria-hidden
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-champagne-200/60 bg-charcoal-950 font-serif text-[20px] tracking-tight text-champagne-200"
              >
                CS
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-champagne-400">
                  Founder · Analyst
                </div>
                <div className="mt-1 font-serif text-[26px] leading-[1.1] text-ink">
                  Chris Sam
                </div>
                <div className="mt-1 text-[13px] text-ink/55">
                  ex-Goldman Sachs · Vice President, RBC Structured Credit Solutions
                </div>
              </div>
            </div>

            <ol className="mt-8 space-y-6 border-l border-ink/[0.08] pl-6">
              <li>
                <div className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
                  2020
                </div>
                <div className="mt-1 font-serif text-[16px] text-ink">
                  The University of Texas at Austin
                </div>
                <p className="mt-1 text-[14px] leading-[1.6] text-ink/70">
                  B.A. Economics, minor in Business.
                </p>
              </li>
              <li>
                <div className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
                  2021 – 2023
                </div>
                <div className="mt-1 font-serif text-[16px] text-ink">
                  Bank of America Merrill Lynch — Analyst, Leveraged Finance
                  Credit
                </div>
                <p className="mt-1 text-[14px] leading-[1.6] text-ink/70">
                  Underwrote leveraged finance and structured credit for
                  large-cap insurers, BDCs, and aircraft lessors, inside
                  institutional risk frameworks.
                </p>
              </li>
              <li>
                <div className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
                  2023 – 2026
                </div>
                <div className="mt-1 font-serif text-[16px] text-ink">
                  Goldman, Sachs &amp; Co. — Senior Associate, Capital Solutions
                  Group
                </div>
                <p className="mt-1 text-[14px] leading-[1.6] text-ink/70">
                  Opportunistic principal lending: originated, structured, and
                  underwrote senior credit facilities of $300M to $1.5B+ across
                  media, entertainment, professional sports, and hospitality.
                </p>
              </li>
              <li>
                <div className="text-[11px] uppercase tracking-[0.22em] text-champagne-400">
                  2026 →
                </div>
                <div className="mt-1 font-serif text-[16px] text-ink">
                  Royal Bank of Canada — Vice President, Structured Credit
                  Solutions
                </div>
                <p className="mt-1 text-[14px] leading-[1.6] text-ink/70">
                  Based in Los Angeles. Founder of this practice, built for
                  owner-operated businesses.
                </p>
              </li>
            </ol>

            <p className="mt-8 border-l-2 border-champagne-300/60 pl-5 font-serif text-[16px] italic leading-[1.5] text-ink/70">
              &ldquo;The standard I was trained to, pointed at your numbers.
              Read the business. Unlock the value it already holds. Structure
              for the cash flows ahead.&rdquo;
            </p>
          </div>

          {/* Parker G */}
          <div className="rounded-2xl border border-ink/[0.08] bg-white p-8 md:p-10">
            <div className="flex items-start gap-5">
              <div
                aria-hidden
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-champagne-200/60 bg-charcoal-950 font-serif text-[20px] tracking-tight text-champagne-200"
              >
                PG
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-champagne-400">
                  Partner · Operations
                </div>
                <div className="mt-1 font-serif text-[26px] leading-[1.1] text-ink">
                  Parker G
                </div>
                <div className="mt-1 text-[13px] text-ink/55">
                  Canadian business operations — on the ground
                </div>
              </div>
            </div>

            <ul className="mt-8 space-y-5 text-[14.5px] leading-[1.65] text-ink/75">
              <li className="flex gap-3">
                <span className="mt-[9px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-champagne-300" />
                <span>
                  The operator&rsquo;s lens on every file:{" "}
                  <span className="text-ink">
                    crews, scheduling, suppliers, seasonality
                  </span>
                  , and the cash rhythm of payroll, HST installments, and CRA
                  deadlines Canadian owners actually live.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[9px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-champagne-300" />
                <span>
                  <span className="text-ink">
                    On the ground, not on a dashboard.
                  </span>{" "}
                  Parker walks the shop, the sites, and the books with you, so
                  the analysis reflects the business as it runs — not as the
                  statements flatten it.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[9px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-champagne-300" />
                <span>
                  Findings become operating moves:{" "}
                  <span className="text-ink">
                    pricing, staffing, scheduling, collections
                  </span>
                  , sequenced so each change holds.
                </span>
              </li>
            </ul>

            <div className="mt-10 rounded-xl border border-champagne-200/40 bg-champagne-100/20 p-6">
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-500">
                The pairing
              </div>
              <p className="mt-3 font-serif text-[18px] leading-[1.45] text-ink">
                Chris reads the numbers.
                <br />
                Parker reads the operation.
              </p>
              <p className="mt-3 text-[14px] leading-[1.55] text-ink/65">
                → One answer you can act on by Friday. Senior judgment on every
                engagement — never junior work with a senior logo.
              </p>
            </div>
          </div>
        </div>

        {/* Credentials strip */}
        <div className="mt-14">
          <div className="mb-6 text-center text-[10px] uppercase tracking-[0.28em] text-ink/40">
            Where our team learned the craft
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              "Goldman Sachs",
              "Bank of America Merrill Lynch",
              "Royal Bank of Canada",
              "The University of Texas at Austin",
            ].map((firm) => (
              <div
                key={firm}
                className="rounded-lg border border-ink/[0.08] bg-white px-4 py-6 text-center font-serif text-[14.5px] leading-[1.3] tracking-tight text-ink/70"
              >
                {firm}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-[640px] text-center text-[11.5px] leading-[1.6] text-ink/40">
            Team experience references prior employment. GoldFin Desk is an
            independent company and is not affiliated with, endorsed by, or a
            partner of any listed institution.
          </p>
        </div>
      </section>

      {/* ── How we think ── */}
      <section className="mx-auto mt-24 max-w-[1080px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-ink/40">
            How we think
          </div>
          <h2 className="mx-auto max-w-[720px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
            Four questions we ask of every number in your business.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["01 · Where is it?", "The level today — cash on hand, margin, what each customer is worth."],
            ["02 · Where is it going?", "The trend — better or worse than last month, last quarter, last year."],
            ["03 · What's driving it?", "The cause — decompose the total until the real lever is visible."],
            ["04 · What's underneath?", "The distribution — the averages that hide winners, losers, and risk."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-ink/[0.08] bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.24em] text-champagne-400">
                {String(title).split(" · ")[0]}
              </div>
              <div className="mt-2 font-serif text-[17px] text-ink">
                {String(title).split(" · ")[1]}
              </div>
              <p className="mt-2 text-[14px] leading-[1.6] text-ink/65">{body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[600px] text-center text-[14px] italic leading-[1.55] text-ink/55">
          Level, trend, driver, distribution. Every briefing we deliver is
          built on these four questions.
        </p>
      </section>

      {/* ── Clear lines ── */}
      <section className="mx-auto mt-24 max-w-[1080px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-ink/40">
            Clear lines
          </div>
          <h2 className="mx-auto max-w-[720px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
            What we don&rsquo;t do — stated plainly, so there&rsquo;s no
            confusion.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            ["We don't file or audit.", "Your accountant does that. We work from their numbers; we don't replace them."],
            ["We don't lend or manage money.", "We're not a bank and not an investment manager. We don't sell products."],
            ["We don't buy or sell businesses.", "No M&A or capital-raising services. If you need that, we'll refer you to people we trust."],
            ["We don't advise on markets or securities.", "No stocks, no trading, no investment advice — ever. Our lens is your operating business."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-ink/[0.08] bg-white p-6">
              <div className="font-serif text-[18px] text-ink">{title}</div>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-ink/65">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Three ways to work with us ── */}
      <section className="mx-auto mt-24 max-w-[1120px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-champagne-400">
            Three ways to work with us
          </div>
          <h2 className="mx-auto max-w-[720px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
            Start where the questions are sharpest. Grow into standing counsel.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              tag: "Free",
              name: "GoldFin Template Vault",
              price: "Free",
              body: "Seven financial templates owners can use immediately. Cash flow, margin, hiring affordability, subscription audit, tax reserve.",
              cta: { label: "Get the free templates →", href: "/templates" },
              highlight: false,
            },
            {
              tag: "$150 / month",
              name: "GoldFin Reports",
              price: "$150/mo",
              body: "Every template auto-filled from your numbers, plus a bi-weekly plain-English Owner Briefing. Read-only Plaid connection. Cancel anytime.",
              cta: { label: "Auto-fill my reports — $150/mo", href: "#", checkout: true },
              highlight: true,
            },
            {
              tag: "Custom · by conversation",
              name: "GoldFin Advisory",
              price: "Custom",
              body: "Standing counsel with Chris Sam. Everything in Reports, plus a direct line for the calls that move the business — pricing, hiring, cash, planning.",
              cta: { label: "Request a conversation →", href: "#advisory-contact" },
              highlight: false,
            },
          ].map((card) => (
            <div
              key={card.name}
              className={`flex flex-col rounded-2xl border p-7 ${
                card.highlight
                  ? "border-champagne-300/50 bg-white shadow-[0_18px_50px_-24px_rgba(201,162,74,0.35)]"
                  : "border-ink/[0.08] bg-white"
              }`}
            >
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-400">
                {card.tag}
              </div>
              <div className="mt-3 font-serif text-[22px] text-ink">{card.name}</div>
              <div className="mt-2 font-serif text-[28px] text-ink/90">{card.price}</div>
              <p className="mt-4 flex-1 text-[14.5px] leading-[1.6] text-ink/70">{card.body}</p>
              {card.cta.checkout ? (
                <button
                  type="button"
                  onClick={() => startAutoFillCheckout()}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-3 text-[14px] font-medium text-navy shadow-[0_8px_24px_-10px_rgba(201,162,74,0.55)] transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.98]"
                >
                  {card.cta.label}
                </button>
              ) : (
                <a
                  href={card.cta.href}
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-5 py-3 text-[14px] text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
                >
                  {card.cta.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Advisory contact ── */}
      <section id="advisory-contact" className="mx-auto mt-24 max-w-[820px] scroll-mt-32 px-6">
        <div className="rounded-3xl border border-champagne-200/40 bg-charcoal-950 p-10 text-center md:p-14">
          <div className="mb-4 text-[10px] uppercase tracking-[0.32em] text-champagne-300">
            GoldFin Advisory
          </div>
          <h2 className="mx-auto max-w-[620px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[40px]">
            One conversation, then one clear picture of where you stand.
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.65] text-ink/70">
            A 30-minute conversation with Chris Sam. No charge. We learn your
            business and whether we&rsquo;re a fit. If we are, we scope the
            engagement — priced to the business, not to a tier. If we
            aren&rsquo;t, we&rsquo;ll say so.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={advisoryMailto}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-4 text-[15px] font-medium text-navy shadow-[0_8px_28px_-8px_rgba(201,162,74,0.55)] transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.98]"
            >
              Email Chris directly
            </a>
            <a
              href="/sample-briefing"
              className="inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-6 py-[13px] text-[14px] text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
            >
              See a sample briefing first →
            </a>
          </div>
          <p className="mt-6 text-[12px] text-ink/45">
            {ADVISORY_EMAIL}
          </p>
        </div>
      </section>

      {/* ── The honest test / who this is for ── */}
      <section className="mx-auto mt-24 max-w-[1080px] px-6">
        <div className="text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-ink/40">
            The honest test
          </div>
          <h2 className="mx-auto max-w-[720px] font-serif text-[30px] leading-[1.15] tracking-[-0.01em] text-ink md:text-[38px]">
            A clear fit for some owners — and honestly, not for others.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-ink/[0.08] bg-white p-7">
            <div className="text-[11px] uppercase tracking-[0.24em] text-champagne-400">
              A fit if you are…
            </div>
            <ul className="mt-5 space-y-3 text-[15px] leading-[1.6] text-ink/80">
              {[
                "Running a business doing roughly $1M–$10M in revenue.",
                "Owner-operated, making the real decisions yourself.",
                "Past the point where gut feel alone is enough.",
                "Willing to look squarely at what the numbers say.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-[10px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-champagne-300" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-ink/[0.08] bg-white p-7">
            <div className="text-[11px] uppercase tracking-[0.24em] text-ink/45">
              Not a fit if you…
            </div>
            <ul className="mt-5 space-y-3 text-[15px] leading-[1.6] text-ink/65">
              {[
                "Want tax filing, an audit, or bookkeeping.",
                "Are looking for a loan, an investment, or a product.",
                "Want someone to buy or sell a business for you.",
                "Want a dashboard nobody reads instead of a decision.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-[10px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-ink/25" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
            href="#advisory-contact"
            className="inline-flex items-center justify-center rounded-full border border-ink/[0.14] px-7 py-[13px] text-[14px] text-ink/70 hover:border-ink/30 hover:text-ink"
          >
            Or talk to Chris about Advisory →
          </a>
        </div>
        <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-ink/40">
          Read-only bank access · Cancel anytime · No sales calls
        </p>
      </section>
    </article>
  );
}

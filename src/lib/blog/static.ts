import {
  BLOG_BYLINE,
  BLOG_HOST,
  BLOG_PUBLISHED,
  BLOG_UPDATED,
  blogDisclaimer,
  blogHub,
  blogPosts,
  getBlogHubMeta,
  getBlogIndexMeta,
  getBlogPostMeta,
  getCanonical,
  type BlogBlock,
  type BlogPost,
} from "./content";

export type StaticBlogRoute = {
  path: string;
  title: string;
  description: string;
  body: string;
  structuredData: Record<string, unknown>[];
  ogType: "website" | "article";
};

const navHtml =
  '<nav aria-label="GoldFin Desk" class="blog-shell-nav"><a href="/">Home</a><a href="/blog/">Blog</a><a href="/templates">Templates</a><a href="/sample-briefing">Sample briefing</a><a href="/pricing">Pricing</a></nav>';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blockToHtml(block: BlogBlock): string {
  if (block.type === "p") return `<p>${block.html}</p>`;
  if (block.type === "ul") {
    return `<ul>${block.items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }
  if (block.type === "ol") {
    return `<ol>${block.items.map((item) => `<li>${item}</li>`).join("")}</ol>`;
  }
  if (block.type === "callout") {
    return `<aside class="blog-callout"><p class="blog-callout-title">${escapeHtml(block.title)}</p><p>${block.html}</p></aside>`;
  }
  if (block.type === "cta") {
    return `<aside class="blog-cta"><p>${block.text}</p><a href="${escapeHtml(block.href)}">${escapeHtml(block.label)}</a></aside>`;
  }

  const caption = block.caption ? `<caption>${escapeHtml(block.caption)}</caption>` : "";
  return `<div class="blog-table-wrap"><table>${caption}<thead><tr>${block.columns
    .map((column) => `<th>${escapeHtml(column)}</th>`)
    .join("")}</tr></thead><tbody>${block.rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
    )
    .join("")}</tbody></table></div>`;
}

function layoutHtml(inner: string): string {
  return `<div id="root"><main class="blog-static-shell">${navHtml}${inner}</main></div>`;
}

function articleSchema(post: BlogPost) {
  const meta = getBlogPostMeta(post);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: BLOG_PUBLISHED,
    dateModified: BLOG_UPDATED,
    author: { "@type": "Organization", name: BLOG_BYLINE, url: BLOG_HOST },
    publisher: {
      "@type": "Organization",
      name: "GoldFin Desk",
      url: BLOG_HOST,
      logo: { "@type": "ImageObject", url: `${BLOG_HOST}/img/goldfin-logo.svg` },
    },
    mainEntityOfPage: getCanonical(meta.path),
    image: [`${BLOG_HOST}/img/og-card.png`],
  };
}

function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonical(item.path),
    })),
  };
}

function faqSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

function postBody(post: BlogPost): string {
  return layoutHtml(`
    <article class="blog-article">
      <header class="blog-hero">
        <p class="blog-eyebrow">${escapeHtml(post.id)} / ${escapeHtml(blogHub.title)}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="blog-description">${escapeHtml(post.description)}</p>
        <div class="blog-meta">
          <span>By ${escapeHtml(BLOG_BYLINE)}</span>
          <span>Published ${escapeHtml(BLOG_PUBLISHED)}</span>
          <span>${escapeHtml(post.readTime)}</span>
        </div>
      </header>
      <section class="blog-answer" aria-label="Short answer">
        <h2>Short Answer</h2>
        <p>${escapeHtml(post.answer)}</p>
      </section>
      <section class="blog-proof" aria-label="Proof element">
        <p class="blog-proof-label">Proof plan</p>
        <p>${escapeHtml(post.proof)}</p>
      </section>
      ${post.sections
        .map(
          (section) =>
            `<section class="blog-section"><h2>${escapeHtml(section.heading)}</h2>${section.blocks
              .map(blockToHtml)
              .join("")}</section>`,
        )
        .join("")}
      <section class="blog-faq" aria-label="Frequently asked questions">
        <h2>Questions owners ask</h2>
        ${post.faqs
          .map(
            (faq) =>
              `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`,
          )
          .join("")}
      </section>
      <p class="blog-disclaimer">${escapeHtml(blogDisclaimer)}</p>
    </article>
  `);
}

function indexBody(): string {
  return layoutHtml(`
    <section class="blog-hero">
      <p class="blog-eyebrow">GoldFin Desk Blog</p>
      <h1>Monthly financial clarity for owner-led businesses</h1>
      <p class="blog-description">Guides, templates, checklists, and plain-English examples for owners who want to stop guessing from the bank balance.</p>
    </section>
    <section class="blog-section">
      <h2>Start with monthly reporting</h2>
      <p>The first GoldFin blog launch focuses on the category we want to own: plain-English monthly financial clarity. Every guide is built around one owner question, one proof artifact, and one next step.</p>
      <div class="blog-list">
        <a href="/blog/${blogHub.slug}/"><strong>${escapeHtml(blogHub.title)}</strong><span>${escapeHtml(blogHub.description)}</span></a>
      </div>
    </section>
    <section class="blog-section">
      <h2>Featured guides</h2>
      <div class="blog-list">
        ${blogPosts
          .map(
            (post) =>
              `<a href="/blog/${post.slug}/"><strong>${escapeHtml(post.shortTitle)}</strong><span>${escapeHtml(post.description)}</span></a>`,
          )
          .join("")}
      </div>
    </section>
  `);
}

function hubBody(): string {
  return layoutHtml(`
    <section class="blog-hero">
      <p class="blog-eyebrow">Topic hub</p>
      <h1>${escapeHtml(blogHub.title)}</h1>
      <p class="blog-description">${escapeHtml(blogHub.description)}</p>
    </section>
    <section class="blog-answer">
      <h2>Hub promise</h2>
      <p>${escapeHtml(blogHub.promise)}</p>
    </section>
    <section class="blog-section">
      <h2>Guides in this hub</h2>
      <div class="blog-list">
        ${blogPosts
          .map(
            (post) =>
              `<a href="/blog/${post.slug}/"><strong>${escapeHtml(post.title)}</strong><span>${escapeHtml(post.primaryQuery)} / ${escapeHtml(post.intent)}</span></a>`,
          )
          .join("")}
      </div>
    </section>
  `);
}

export function getStaticBlogRoutes(): StaticBlogRoute[] {
  const indexMeta = getBlogIndexMeta();
  const hubMeta = getBlogHubMeta();

  return [
    {
      ...indexMeta,
      body: indexBody(),
      ogType: "website",
      structuredData: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
        ]),
      ],
    },
    {
      ...hubMeta,
      body: hubBody(),
      ogType: "website",
      structuredData: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
          { name: blogHub.title, path: `/blog/${blogHub.slug}/` },
        ]),
      ],
    },
    ...blogPosts.map((post) => {
      const meta = getBlogPostMeta(post);
      return {
        ...meta,
        body: postBody(post),
        ogType: "article" as const,
        structuredData: [
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog/" },
            { name: blogHub.title, path: `/blog/${blogHub.slug}/` },
            { name: post.title, path: meta.path },
          ]),
          faqSchema(post),
        ],
      };
    }),
  ];
}

export function blogStaticStyles(): string {
  return `<style id="blog-static-css">
    .blog-static-shell{max-width:1100px;margin:0 auto;padding:112px 24px 80px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0B0D12;background:#fff}
    .blog-shell-nav{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:56px;font-size:13px}
    .blog-shell-nav a{color:#6B5B2A;text-decoration:none}
    .blog-article{max-width:820px}
    .blog-hero{max-width:820px;margin-bottom:36px}
    .blog-eyebrow,.blog-proof-label{font-size:11px;text-transform:uppercase;letter-spacing:.18em;color:#9A7934;margin:0 0 12px}
    .blog-hero h1{font-size:clamp(38px,7vw,72px);line-height:.96;letter-spacing:-.02em;margin:0 0 20px;font-weight:520}
    .blog-description{font-size:18px;line-height:1.65;color:#4E5563;margin:0}
    .blog-meta{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:22px;color:#6B7280;font-size:13px}
    .blog-answer,.blog-proof,.blog-callout,.blog-cta{border:1px solid rgba(11,13,18,.1);background:#FAF8F1;padding:22px;margin:28px 0}
    .blog-answer h2,.blog-section h2,.blog-faq h2{font-size:28px;line-height:1.15;margin:0 0 14px}
    .blog-section{margin:42px 0}
    .blog-section p,.blog-answer p,.blog-proof p,.blog-callout p,.blog-cta p,.blog-faq p{font-size:16px;line-height:1.72;color:#333B49}
    .blog-section ul,.blog-section ol{padding-left:22px;color:#333B49;line-height:1.72}
    .blog-table-wrap{overflow-x:auto;margin:22px 0;border:1px solid rgba(11,13,18,.1)}
    table{width:100%;border-collapse:collapse;font-size:14px}caption{text-align:left;padding:12px 14px;color:#6B5B2A;font-weight:600}th,td{padding:13px 14px;border-top:1px solid rgba(11,13,18,.08);vertical-align:top;text-align:left}th{background:#F6F1E4;color:#20242C}
    .blog-cta a{display:inline-flex;margin-top:8px;color:#0B0D12;font-weight:700;text-decoration:underline;text-underline-offset:4px}
    .blog-list{display:grid;gap:12px}.blog-list a{display:grid;gap:6px;padding:18px;border:1px solid rgba(11,13,18,.1);color:#0B0D12;text-decoration:none}.blog-list span{color:#5D6472;line-height:1.5}
    .blog-faq details{border-top:1px solid rgba(11,13,18,.12);padding:16px 0}.blog-faq summary{cursor:pointer;font-weight:650}.blog-disclaimer{margin-top:42px;color:#687182;font-size:13px;line-height:1.6}
    @media(max-width:640px){.blog-static-shell{padding:96px 18px 64px}.blog-hero h1{font-size:42px}.blog-description{font-size:16px}}
  </style>`;
}

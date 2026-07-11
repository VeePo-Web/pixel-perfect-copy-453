import { useEffect } from "react";
import {
  BLOG_BYLINE,
  BLOG_PUBLISHED,
  BLOG_UPDATED,
  BLOG_HOST,
  blogDisclaimer,
  blogHub,
  blogPosts,
  getBlogHubMeta,
  getBlogIndexMeta,
  getBlogPostBySlug,
  getBlogPostMeta,
  getCanonical,
  type BlogBlock,
  type BlogPost,
} from "../../lib/blog/content";

type Props = {
  pathname: string;
};

function ensureMeta(attr: "name" | "property", key: string): HTMLMetaElement {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
}

function ensureLink(rel: string): HTMLLinkElement {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  return el;
}

function useBlogHead({
  title,
  description,
  path,
  ogType,
  structuredData,
}: {
  title: string;
  description: string;
  path: string;
  ogType: "website" | "article";
  structuredData: Record<string, unknown>[];
}) {
  useEffect(() => {
    const canonicalUrl = getCanonical(path);
    document.title = title;

    ensureMeta("name", "description").setAttribute("content", description);
    ensureMeta("property", "og:title").setAttribute("content", title);
    ensureMeta("property", "og:description").setAttribute("content", description);
    ensureMeta("property", "og:url").setAttribute("content", canonicalUrl);
    ensureMeta("property", "og:type").setAttribute("content", ogType);
    ensureMeta("name", "twitter:title").setAttribute("content", title);
    ensureMeta("name", "twitter:description").setAttribute("content", description);
    ensureLink("canonical").setAttribute("href", canonicalUrl);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "blog-jsonld";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => script.remove();
  }, [description, ogType, path, structuredData, title]);
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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-paper pt-32 text-ink">
      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
        <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink/45">
          <a href="/" className="hover:text-ink">Home</a>
          <a href="/blog/" className="hover:text-ink">Blog</a>
          <a href="/templates" className="hover:text-ink">Templates</a>
          <a href="/sample-briefing" className="hover:text-ink">Sample briefing</a>
        </nav>
        {children}
      </div>
    </div>
  );
}

function Block({ block }: { block: BlogBlock }) {
  if (block.type === "p") {
    return <p className="text-[16px] leading-[1.75] text-ink/72" dangerouslySetInnerHTML={{ __html: block.html }} />;
  }
  if (block.type === "ul" || block.type === "ol") {
    const Tag = block.type;
    return (
      <Tag className="space-y-2 pl-5 text-[15.5px] leading-[1.7] text-ink/72 marker:text-champagne-300">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </Tag>
    );
  }
  if (block.type === "callout") {
    return (
      <aside className="border border-champagne-300/25 bg-champagne-50/70 p-5">
        <p className="font-general text-[10px] uppercase tracking-[0.22em] text-champagne-300">{block.title}</p>
        <p className="mt-2 text-[15px] leading-[1.7] text-ink/70" dangerouslySetInnerHTML={{ __html: block.html }} />
      </aside>
    );
  }
  if (block.type === "cta") {
    return (
      <aside className="border border-ink/[0.08] bg-[#0B0D12] p-6 text-white">
        <p className="text-[15px] leading-[1.65] text-white/70">{block.text}</p>
        <a
          href={block.href}
          className="mt-4 inline-flex rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-5 py-2.5 text-[13px] font-medium text-ink"
        >
          {block.label}
        </a>
      </aside>
    );
  }

  return (
    <div className="overflow-x-auto border border-ink/[0.08]">
      <table className="min-w-full border-collapse text-left text-[14px]">
        {block.caption && (
          <caption className="bg-champagne-50 px-4 py-3 text-left text-[12px] font-medium uppercase tracking-[0.16em] text-champagne-300">
            {block.caption}
          </caption>
        )}
        <thead className="bg-ink/[0.035]">
          <tr>
            {block.columns.map((column) => (
              <th key={column} className="border-t border-ink/[0.08] px-4 py-3 font-medium text-ink">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell) => (
                <td key={cell} className="border-t border-ink/[0.08] px-4 py-3 align-top leading-[1.55] text-ink/68">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PostPage({ post }: { post: BlogPost }) {
  const meta = getBlogPostMeta(post);
  useBlogHead({
    ...meta,
    ogType: "article",
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
  });

  return (
    <Shell>
      <article className="max-w-3xl">
        <header className="mb-10">
          <p className="mb-4 font-general text-[10px] uppercase tracking-[0.24em] text-champagne-300">
            {post.id} / {blogHub.title}
          </p>
          <h1 className="font-display text-[42px] font-medium leading-[0.98] tracking-[-0.02em] text-ink sm:text-[64px]">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.72] text-ink/62">{post.description}</p>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-general text-[10.5px] uppercase tracking-[0.18em] text-ink/42">
            <span>By {BLOG_BYLINE}</span>
            <span>Published {BLOG_PUBLISHED}</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <section className="mb-8 border border-champagne-300/20 bg-champagne-50/80 p-6">
          <h2 className="font-display text-[28px] font-medium leading-tight text-ink">Short Answer</h2>
          <p className="mt-3 text-[16px] leading-[1.75] text-ink/72">{post.answer}</p>
        </section>

        <section className="mb-10 border-l-2 border-champagne-300 pl-5">
          <p className="font-general text-[10px] uppercase tracking-[0.22em] text-champagne-300">Proof plan</p>
          <p className="mt-2 text-[15px] leading-[1.7] text-ink/64">{post.proof}</p>
        </section>

        <div className="space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-5">
              <h2 className="font-display text-[30px] font-medium leading-tight tracking-[-0.01em] text-ink">
                {section.heading}
              </h2>
              {section.blocks.map((block, index) => (
                <Block key={`${section.heading}-${index}`} block={block} />
              ))}
            </section>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="font-display text-[30px] font-medium leading-tight text-ink">Questions owners ask</h2>
          <div className="mt-5 divide-y divide-ink/[0.08]">
            {post.faqs.map((faq) => (
              <details key={faq.question} className="py-4">
                <summary className="cursor-pointer text-[15px] font-medium text-ink">{faq.question}</summary>
                <p className="mt-3 text-[15px] leading-[1.7] text-ink/65">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-12 text-[12.5px] leading-[1.65] text-ink/42">{blogDisclaimer}</p>
      </article>
    </Shell>
  );
}

function BlogIndex() {
  const meta = getBlogIndexMeta();
  useBlogHead({
    ...meta,
    ogType: "website",
    structuredData: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog/" },
      ]),
    ],
  });

  return (
    <Shell>
      <section className="max-w-4xl">
        <p className="mb-4 font-general text-[10px] uppercase tracking-[0.24em] text-champagne-300">GoldFin Desk Blog</p>
        <h1 className="font-display text-[48px] font-medium leading-[0.98] tracking-[-0.02em] text-ink sm:text-[76px]">
          Monthly financial clarity for owner-led businesses
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-[1.72] text-ink/62">
          Guides, templates, checklists, and plain-English examples for owners who want to stop guessing from the bank balance.
        </p>
      </section>

      <section className="mt-14 max-w-4xl">
        <h2 className="font-display text-[30px] font-medium text-ink">Start with monthly reporting</h2>
        <a href={`/blog/${blogHub.slug}/`} className="mt-5 block border border-ink/[0.08] bg-white p-6 transition-colors hover:border-champagne-300/45">
          <span className="text-[18px] font-medium text-ink">{blogHub.title}</span>
          <span className="mt-2 block text-[15px] leading-[1.65] text-ink/58">{blogHub.description}</span>
        </a>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-[30px] font-medium text-ink">Featured guides</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {blogPosts.map((post) => (
            <a key={post.id} href={`/blog/${post.slug}/`} className="border border-ink/[0.08] bg-white p-5 transition-colors hover:border-champagne-300/45">
              <span className="font-general text-[10px] uppercase tracking-[0.2em] text-champagne-300">{post.id}</span>
              <span className="mt-3 block text-[18px] font-medium leading-tight text-ink">{post.title}</span>
              <span className="mt-3 block text-[14.5px] leading-[1.6] text-ink/58">{post.description}</span>
            </a>
          ))}
        </div>
      </section>
    </Shell>
  );
}

function HubPage() {
  const meta = getBlogHubMeta();
  useBlogHead({
    ...meta,
    ogType: "website",
    structuredData: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog/" },
        { name: blogHub.title, path: `/blog/${blogHub.slug}/` },
      ]),
    ],
  });

  return (
    <Shell>
      <section className="max-w-4xl">
        <p className="mb-4 font-general text-[10px] uppercase tracking-[0.24em] text-champagne-300">Topic hub</p>
        <h1 className="font-display text-[48px] font-medium leading-[0.98] tracking-[-0.02em] text-ink sm:text-[76px]">
          {blogHub.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-[1.72] text-ink/62">{blogHub.description}</p>
      </section>

      <section className="mt-10 max-w-3xl border border-champagne-300/20 bg-champagne-50/80 p-6">
        <h2 className="font-display text-[28px] font-medium text-ink">Hub promise</h2>
        <p className="mt-3 text-[16px] leading-[1.72] text-ink/68">{blogHub.promise}</p>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-[30px] font-medium text-ink">Guides in this hub</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {blogPosts.map((post) => (
            <a key={post.id} href={`/blog/${post.slug}/`} className="border border-ink/[0.08] bg-white p-5 transition-colors hover:border-champagne-300/45">
              <span className="font-general text-[10px] uppercase tracking-[0.2em] text-champagne-300">{post.id}</span>
              <span className="mt-3 block text-[18px] font-medium leading-tight text-ink">{post.title}</span>
              <span className="mt-3 block text-[14px] leading-[1.6] text-ink/54">{post.primaryQuery}</span>
            </a>
          ))}
        </div>
      </section>
    </Shell>
  );
}

export default function BlogRouter({ pathname }: Props) {
  const cleanPath = pathname.replace(/\/+$/, "");
  if (cleanPath === "/blog" || cleanPath === "") return <BlogIndex />;
  if (cleanPath === `/blog/${blogHub.slug}`) return <HubPage />;

  const slug = cleanPath.replace(/^\/blog\//, "");
  const post = getBlogPostBySlug(slug);
  if (post) return <PostPage post={post} />;

  return <BlogIndex />;
}

import { writeFileSync } from "fs";
import { resolve } from "path";
import { getStaticBlogRoutes } from "../src/lib/blog/static";

const BASE_URL = "https://pixel-perfect-copy-453.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().split("T")[0];

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/pricing", changefreq: "weekly", priority: "0.9" },
  { path: "/templates", changefreq: "weekly", priority: "0.9" },
  { path: "/sample-briefing", changefreq: "weekly", priority: "0.8" },
  { path: "/compare", changefreq: "weekly", priority: "0.7" },
  { path: "/compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk", changefreq: "weekly", priority: "0.7" },
  { path: "/security-faq", changefreq: "monthly", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
];

const blogEntries: SitemapEntry[] = getStaticBlogRoutes().map((r) => ({
  path: r.path,
  changefreq: "monthly",
  priority: "0.7",
}));

const entries: SitemapEntry[] = [...staticEntries, ...blogEntries];

function generateSitemap(items: SitemapEntry[]) {
  const urls = items.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);

/**
 * SEO utilities for per-page meta tags.
 * Call setPageMeta() in each page's useEffect to set title, description, and OG tags.
 *
 * Notes:
 * - og:image MUST be an absolute URL. Facebook, LinkedIn, iMessage, WhatsApp,
 *   and Slack will silently drop relative paths and the share card will render
 *   without an image.
 * - og:image:width / :height / :alt and twitter:image:alt improve preview
 *   reliability and accessibility — keep them in sync with the asset.
 */

interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;        // absolute URL preferred; relative paths are auto-resolved against BASE_URL
  ogImageAlt?: string;
}

const BASE_URL = "https://www.hickoryandrose.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const DEFAULT_OG_ALT =
  "Hickory & Rose — refined rustic elegance wedding planning in Edmonton, Alberta";

function toAbsolute(url: string): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function setPageMeta({
  title,
  description,
  path,
  ogImage,
  ogImageAlt = DEFAULT_OG_ALT,
}: PageMeta) {
  const absoluteImage = toAbsolute(ogImage ?? DEFAULT_OG_IMAGE);
  const absoluteUrl = `${BASE_URL}${path}`;

  // Title
  document.title = title;

  // Meta description
  setMetaTag("name", "description", description);

  // Canonical
  setLinkTag("canonical", absoluteUrl);

  // Open Graph
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", description);
  setMetaTag("property", "og:url", absoluteUrl);
  setMetaTag("property", "og:image", absoluteImage);
  setMetaTag("property", "og:image:secure_url", absoluteImage);
  setMetaTag("property", "og:image:alt", ogImageAlt);

  // Twitter
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", description);
  setMetaTag("name", "twitter:image", absoluteImage);
  setMetaTag("name", "twitter:image:alt", ogImageAlt);
}

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Set or update the robots meta tag (e.g. "noindex,follow" on a 404).
 * Pages that call this should reset to "index,follow" on unmount so other
 * routes remain indexable.
 */
export function setRobotsMeta(content: string) {
  setMetaTag("name", "robots", content);
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Inject a single BreadcrumbList JSON-LD script (id="breadcrumb-schema").
 * Replaces any prior breadcrumb schema so route changes stay in sync.
 */
export function setBreadcrumbSchema(items: BreadcrumbItem[]) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };

  let el = document.getElementById("breadcrumb-schema") as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "breadcrumb-schema";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}


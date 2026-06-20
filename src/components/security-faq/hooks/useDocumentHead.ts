import { useEffect } from "react";
import { faqItems } from "../content";

const TITLE = "Security & FAQ | GoldFin Desk";
const DESC =
  "Learn how GoldFin Desk handles previews, applications, bank connection timing, privacy expectations, and common questions for owner-led businesses.";
const CANONICAL = "https://pixel-perfect-copy-453.lovable.app/#/security-faq";

function ensureMeta(attr: "name" | "property", key: string): HTMLMetaElement {
  let el = document.querySelector(
    `meta[${attr}="${key}"]`
  ) as HTMLMetaElement | null;
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

export function useDocumentHead() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = TITLE;

    const desc = ensureMeta("name", "description");
    const prevDesc = desc.getAttribute("content") ?? "";
    desc.setAttribute("content", DESC);

    const ogTitle = ensureMeta("property", "og:title");
    const prevOgTitle = ogTitle.getAttribute("content") ?? "";
    ogTitle.setAttribute("content", TITLE);

    const ogDesc = ensureMeta("property", "og:description");
    const prevOgDesc = ogDesc.getAttribute("content") ?? "";
    ogDesc.setAttribute("content", DESC);

    const ogUrl = ensureMeta("property", "og:url");
    const prevOgUrl = ogUrl.getAttribute("content") ?? "";
    ogUrl.setAttribute("content", CANONICAL);

    const canonical = ensureLink("canonical");
    const prevCanonical = canonical.getAttribute("href") ?? "";
    canonical.setAttribute("href", CANONICAL);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "security-faq-jsonld";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(script);

    return () => {
      document.title = prevTitle;
      desc.setAttribute("content", prevDesc);
      ogTitle.setAttribute("content", prevOgTitle);
      ogDesc.setAttribute("content", prevOgDesc);
      ogUrl.setAttribute("content", prevOgUrl);
      canonical.setAttribute("href", prevCanonical);
      script.remove();
    };
  }, []);
}

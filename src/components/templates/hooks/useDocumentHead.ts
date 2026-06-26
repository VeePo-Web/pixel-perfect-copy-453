import { useEffect } from "react";
import { faq } from "../content";

const TITLE = "Free Financial Templates · GoldFin Desk";
const DESC =
  "Free spreadsheet templates for cash flow, expenses, hiring decisions, monthly reviews, and tax reserves — built for owner-led businesses ready to stop guessing from their bank balance.";
const CANONICAL = "https://goldfindesk.com/templates";

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
    script.id = "templates-faq-jsonld";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
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

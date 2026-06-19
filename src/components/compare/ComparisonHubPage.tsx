import { useEffect } from "react";
import CompareTopBar from "./parts/CompareTopBar";
import ComparisonHero from "./parts/ComparisonHero";
import CoreQuestionSection from "./parts/CoreQuestionSection";
import FitFinderDiagnostic from "./parts/FitFinderDiagnostic";
import CategorySpectrum from "./parts/CategorySpectrum";
import ComparisonCardGrid from "./parts/ComparisonCardGrid";
import FastAnswerTable from "./parts/FastAnswerTable";
import MissingMiddleSection from "./parts/MissingMiddleSection";
import UseCasePaths from "./parts/UseCasePaths";
import SampleBriefingProofBlock from "./parts/SampleBriefingProofBlock";
import ComparisonFAQ from "./parts/ComparisonFAQ";
import ComparisonPageIndex from "./parts/ComparisonPageIndex";
import SoftConversionBridge from "./parts/SoftConversionBridge";
import ComparisonFinalCTA from "./parts/ComparisonFinalCTA";
import MobileStickyCompareCTA from "./parts/MobileStickyCompareCTA";
import { useFitFinder } from "./hooks/useFitFinder";
import { faq } from "./content";

const PAGE_TITLE =
  "Compare Bookkeepers, Dashboards, CFOs & Monthly Finance Desk";
const PAGE_DESC =
  "Not sure if your business needs a bookkeeper, dashboard, fractional CFO, or Monthly Finance Desk? Compare financial support options for owner-led businesses.";

export default function ComparisonHubPage() {
  const finder = useFitFinder();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${PAGE_TITLE} · Monthly Finance Desk`;

    const meta = ensureMeta("description");
    const prevDesc = meta.getAttribute("content") ?? "";
    meta.setAttribute("content", PAGE_DESC);

    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.id = "compare-faq-jsonld";
    faqScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(faqScript);

    return () => {
      document.title = prevTitle;
      meta.setAttribute("content", prevDesc);
      faqScript.remove();
    };
  }, []);

  return (
    <div className="relative pb-24 lg:pb-0">
      <CompareTopBar currentPath="compare" />
      <ComparisonHero />
      <CoreQuestionSection />
      <FitFinderDiagnostic finder={finder} />
      <CategorySpectrum />
      <ComparisonCardGrid />
      <FastAnswerTable />
      <MissingMiddleSection />
      <UseCasePaths />
      <SampleBriefingProofBlock />
      <ComparisonFAQ />
      <ComparisonPageIndex />
      <SoftConversionBridge />
      <ComparisonFinalCTA />
      <MobileStickyCompareCTA recommendation={finder.recommendation} />
    </div>
  );
}

function ensureMeta(name: string): HTMLMetaElement {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  return el;
}

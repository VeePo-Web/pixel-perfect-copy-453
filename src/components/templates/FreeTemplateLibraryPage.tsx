import { useState } from "react";

import TemplateLibraryHero from "./parts/TemplateLibraryHero";
import PainToValueReframe from "./parts/PainToValueReframe";
import TemplateCategoryFilters from "./parts/TemplateCategoryFilters";
import TemplateGrid from "./parts/TemplateGrid";
import RecommendedStartingPaths from "./parts/RecommendedStartingPaths";
import ManualVsMonthlyDesk from "./parts/ManualVsMonthlyDesk";
import FeaturedTemplatePreview from "./parts/FeaturedTemplatePreview";
import SoapOperaPromise from "./parts/SoapOperaPromise";
import TemplateToFinanceDeskBridge from "./parts/TemplateToFinanceDeskBridge";
import TemplateTrustSection from "./parts/TemplateTrustSection";
import TemplateFAQ from "./parts/TemplateFAQ";
import TemplateFinalCTA from "./parts/TemplateFinalCTA";
import MobileStickyTemplateCTA from "./parts/MobileStickyTemplateCTA";
import TemplatePreviewModal from "./parts/TemplatePreviewModal";
import TemplateLeadCaptureModal from "./parts/TemplateLeadCaptureModal";
import { useTemplateFilters } from "./hooks/useTemplateFilters";
import { useLeadCaptureFlow } from "./hooks/useLeadCaptureFlow";
import { useDocumentHead } from "./hooks/useDocumentHead";
import type { TemplateItem } from "./content";
import { templates as allTemplates } from "./content";

export default function FreeTemplateLibraryPage() {
  useDocumentHead();

  const { category, setCategory, highlightPathId, setHighlightPathId, highlightedTemplateIds, visible } =
    useTemplateFilters();
  const { state, open, close, submit, hasDownloaded } = useLeadCaptureFlow();
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

  const handlePreviewGet = () => {
    if (previewTemplate) {
      const t = previewTemplate;
      setPreviewTemplate(null);
      open(t);
    }
  };

  const handleFeaturedGet = () => {
    const cf = allTemplates.find((t) => t.id === "cash-flow-forecast");
    if (cf) open(cf);
  };

  return (
    <div className="relative pb-24 lg:pb-0">
      
      <TemplateLibraryHero />
      <PainToValueReframe />
      <TemplateCategoryFilters active={category} onChange={setCategory} />
      <TemplateGrid
        templates={visible}
        highlightedIds={highlightedTemplateIds}
        onGet={(t) => open(t)}
        onPreview={(t) => setPreviewTemplate(t)}
      />
      <RecommendedStartingPaths activeId={highlightPathId} onSelect={setHighlightPathId} />
      <ManualVsMonthlyDesk />
      <FeaturedTemplatePreview onGet={handleFeaturedGet} />
      <SoapOperaPromise />
      <TemplateToFinanceDeskBridge />
      <TemplateTrustSection />
      <TemplateFAQ />
      <TemplateFinalCTA />

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onGet={handlePreviewGet}
      />
      <TemplateLeadCaptureModal state={state} onClose={close} onSubmit={submit} />
      <MobileStickyTemplateCTA downloaded={hasDownloaded} />
    </div>
  );
}

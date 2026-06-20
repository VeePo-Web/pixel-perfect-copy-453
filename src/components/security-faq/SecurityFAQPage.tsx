import { useEffect } from "react";

import SecurityFAQHero from "./parts/SecurityFAQHero";
import AccessSequence from "./parts/AccessSequence";
import UpfrontRequirementsSection from "./parts/UpfrontRequirementsSection";
import AfterApplySection from "./parts/AfterApplySection";
import PlaidExplanationSection from "./parts/PlaidExplanationSection";
import PrivacyPrinciplesSection from "./parts/PrivacyPrinciplesSection";
import FeaturedFAQPreview from "./parts/FeaturedFAQPreview";
import FAQHub from "./parts/FAQHub";
import ProductBoundariesSection from "./parts/ProductBoundariesSection";
import SecuritySampleBriefingPreview from "./parts/SecuritySampleBriefingPreview";
import SecurityFinalCTA from "./parts/SecurityFinalCTA";
import MobileStickyCTA from "./parts/MobileStickyCTA";
import { useDocumentHead } from "./hooks/useDocumentHead";
import { track } from "./analytics";

export default function SecurityFAQPage() {
  useDocumentHead();

  useEffect(() => {
    track("security_faq_page_viewed");
  }, []);

  return (
    <div className="relative pb-28 lg:pb-0">
      
      <SecurityFAQHero />
      <AccessSequence />
      <UpfrontRequirementsSection />
      <AfterApplySection />
      <PlaidExplanationSection />
      <PrivacyPrinciplesSection />
      <FeaturedFAQPreview />
      <FAQHub />
      <ProductBoundariesSection />
      <SecuritySampleBriefingPreview />
      <SecurityFinalCTA />
      <MobileStickyCTA />
    </div>
  );
}

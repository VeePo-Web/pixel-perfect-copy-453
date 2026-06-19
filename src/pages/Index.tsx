import { useEffect, lazy, Suspense } from "react";
import { setPageMeta } from "@/lib/seo";
import HeroSection from "@/components/wedding/HeroSection";
import BrandPromiseSection from "@/components/wedding/BrandPromiseSection";
import TrustBarSection from "@/components/wedding/TrustBarSection";
import NowBookingSection from "@/components/wedding/NowBookingSection";
import ScrollProgress from "@/components/wedding/ScrollProgress";
import BackToTop from "@/components/wedding/BackToTop";
import SectionIndicator from "@/components/wedding/SectionIndicator";
import venueImage from "@/assets/portfolio-venue.jpg";

// Lazy-load below-fold sections
const ServicesOverviewSection = lazy(() => import("@/components/wedding/ServicesOverviewSection"));
const VendorShowcaseSection = lazy(() => import("@/components/wedding/VendorShowcaseSection"));
const EditorialImageBreak = lazy(() => import("@/components/wedding/EditorialImageBreak"));
const TestimonialSection = lazy(() => import("@/components/wedding/TestimonialSection"));
const EditorialSplitSection = lazy(() => import("@/components/wedding/EditorialSplitSection"));
const EditorialQuoteRibbon = lazy(() => import("@/components/wedding/EditorialQuoteRibbon"));
const GallerySection = lazy(() => import("@/components/wedding/GallerySection"));
const LoveQuoteSection = lazy(() => import("@/components/wedding/LoveQuoteSection"));
const ProcessTeaserSection = lazy(() => import("@/components/wedding/ProcessTeaserSection"));
const FullWidthImage = lazy(() => import("@/components/wedding/FullWidthImage"));
const FounderTeaserSection = lazy(() => import("@/components/wedding/FounderTeaserSection"));
const StatsSection = lazy(() => import("@/components/wedding/StatsSection"));
const PressMentionsSection = lazy(() => import("@/components/wedding/PressMentionsSection"));
const BrandManifestoSection = lazy(() => import("@/components/wedding/BrandManifestoSection"));
const LakeLouiseDiptychSection = lazy(() => import("@/components/wedding/LakeLouiseDiptychSection"));
const FilmstripSection = lazy(() => import("@/components/wedding/FilmstripSection"));
const InstagramSection = lazy(() => import("@/components/wedding/InstagramSection"));
const JournalTeaserSection = lazy(() => import("@/components/wedding/JournalTeaserSection"));
const CTASection = lazy(() => import("@/components/wedding/CTASection"));
const Footer = lazy(() => import("@/components/wedding/Footer"));
const CeremonyInterludeSection = lazy(() => import("@/components/wedding/CeremonyInterludeSection"));
const ReceptionDetailsSection = lazy(() => import("@/components/wedding/ReceptionDetailsSection"));

// LocalBusiness JSON-LD lives in index.html (single source of truth, crawler-safe pre-JS).
// Do NOT inject a duplicate here. No aggregateRating until real reviews exist (8.x honesty).

const Index = () => {
  useEffect(() => {
    setPageMeta({
      title: "Hickory & Rose | Edmonton Luxury Wedding Planner",
      description: "Refined, calm wedding planning in Edmonton & the Canadian Rockies. Day-of, partial, and full-service planning for the day you'll actually live in.",
      path: "/",
    });
  }, []);

  return (
    <main id="main-content" className="overflow-hidden">
      <ScrollProgress />
      <BackToTop />
      <SectionIndicator />
      <HeroSection />
      <BrandPromiseSection />
      <TrustBarSection />
      <NowBookingSection />
      <Suspense fallback={null}>
        <CeremonyInterludeSection />
        <ReceptionDetailsSection />
        <ServicesOverviewSection />
        <EditorialQuoteRibbon
          quote="Your wedding day should be felt, not managed."
          attribution="Hickory & Rose"
          direction="left"
        />
        <GallerySection />
        <EditorialImageBreak />
        <TestimonialSection />
        <EditorialSplitSection />
        <LoveQuoteSection />
        <ProcessTeaserSection />
        <FullWidthImage
          src={venueImage}
          alt=""
          height="h-[50vh] md:h-[60vh]"
          overlay
        />
        <FounderTeaserSection />
        <StatsSection />
        <EditorialQuoteRibbon
          quote="Every detail, placed with intention. Every moment, protected."
          direction="right"
        />
        {/* TODO: re-enable <PressMentionsSection /> when real press features arrive (discovery 5.6). Hidden today to avoid fabricated "As Featured In" claims. */}
        <BrandManifestoSection />
        <LakeLouiseDiptychSection />
        <FilmstripSection />
        <VendorShowcaseSection />
        <CTASection />
        <InstagramSection />
        <JournalTeaserSection />
        <Footer />
      </Suspense>
    </main>
  );
};

export default Index;

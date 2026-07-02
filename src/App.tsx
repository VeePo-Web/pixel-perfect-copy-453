import { Suspense, lazy, useEffect, useState } from "react";
// Homepage is the LCP-critical landing route — keep it eager (no Suspense flash).
import HomeSchema from "./components/home/HomeSchema";
import HomeHero from "./components/home/HomeHero";
import PainClarity from "./components/home/PainClarity";
import VaultPreview from "./components/home/VaultPreview";
import EpiphanyBridge from "./components/home/EpiphanyBridge";
import FounderTrustStrip from "./components/home/FounderTrustStrip";
import ClosingBaitCTA from "./components/home/ClosingBaitCTA";
import HomeMobileStickyCTA from "./components/home/HomeMobileStickyCTA";
// Chrome is shared by every marketing route — keep eager so it paints instantly.
import GlobalTopBar, { type NavKey } from "./components/nav/GlobalTopBar";
import GoldFinFooter from "./components/footer/GoldFinFooter";
import PaymentTestModeBanner from "./components/payments/PaymentTestModeBanner";
import CheckoutMount from "./components/payments/CheckoutMount";
import { useHashRoute, navigate } from "./components/apply/hooks/useHashRoute";
import PortalRouter, { isPortalRoute } from "./portal/PortalRouter";

// Interior routes are code-split: the homepage no longer ships their JS, which
// keeps initial bundle / LCP small (the #1 SEO signal). Each loads on demand.
// Interior routes are code-split.
const SampleBriefingPage = lazy(() => import("./components/sample-briefing/SampleBriefingPage"));
const PricingPage = lazy(() => import("./components/pricing/PricingPage"));
const FreeTemplateLibraryPage = lazy(() => import("./components/templates/FreeTemplateLibraryPage"));
const ComparisonHubPage = lazy(() => import("./components/compare/ComparisonHubPage"));
const BookkeeperVsFractionalCFOPage = lazy(() => import("./components/three-way-compare/BookkeeperVsFractionalCFOPage"));
const SecurityFAQPage = lazy(() => import("./components/security-faq/SecurityFAQPage"));
const AboutPage = lazy(() => import("./components/about/AboutPage"));
const CheckoutReturnPage = lazy(() => import("./components/payments/CheckoutReturnPage"));
const BillingPage = lazy(() => import("./components/payments/BillingPage"));

// Min-height spacer holds the viewport while a route chunk loads, so the footer
// never jumps up (zero CLS) and there is no blank flash.
function RouteFallback() {
  return <div className="min-h-screen" aria-hidden />;
}

function usePathname(): string {
  const [path, setPath] = useState(
    typeof window === "undefined" ? "/" : window.location.pathname,
  );
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return path;
}

const App = () => {
  const route = useHashRoute();
  const pathname = usePathname();

  // Intercept internal <a href="/…"> clicks for instant SPA navigation (no full
  // reload), so path routing keeps the speed of the old hash router. External,
  // new-tab, modified, download, and #anchor links fall through to the browser.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      const target = a.getAttribute("target");
      if ((target && target !== "_self") || a.hasAttribute("download")) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Self-canonical every route to its real path (one indexable URL per page).
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + window.location.pathname;
  }, [pathname]);

  // Portal + legal pages live entirely outside the marketing chrome.
  if (isPortalRoute(pathname)) return <PortalRouter pathname={pathname} />;

  // Path-based routes (Stripe's return URL is a real path, not a hash).
  if (pathname === "/checkout/return") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <CheckoutReturnPage />
      </Suspense>
    );
  }
  if (pathname === "/billing") {
    return (
      <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
        <PaymentTestModeBanner />
        <GlobalTopBar currentPath="home" onDarkHero={false} />
        <Suspense fallback={<RouteFallback />}>
          <BillingPage />
        </Suspense>
        <GoldFinFooter />
        <CheckoutMount />
      </main>
    );
  }

  // Single adaptive GlobalTopBar handles its own spacing:
  //  • The homepage hero is dark + full-bleed; the bar floats transparent over
  //    it (its own padding clears the bar), so the page must NOT add top pad.
  //  • Interior pages are white and ship their own pt-32 heroes that clear the
  //    bar, so no wrapper padding is needed there either.
  // Suspense is universal here; eager home content never suspends, lazy interior
  // routes show the spacer fallback while their chunk loads.
  const wrap = (key: NavKey, children: React.ReactNode) => (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
      <PaymentTestModeBanner />
      <GlobalTopBar currentPath={key} />
      <div id="main-content" tabIndex={-1} className="focus:outline-none">
        <Suspense fallback={<RouteFallback />}>{children}</Suspense>
      </div>
      <GoldFinFooter />
      <CheckoutMount />
    </main>
  );

  // Apply is a focused conversion funnel. It ships its own minimal header
  // (ApplicationHeader), so it must NOT also render the marketing GlobalTopBar —
  // that produced two stacked nav bars. Dropping the marketing nav + footer also
  // removes escape links that leak funnel conversions (CXL / Brunson).
  if (route === "apply" || route === "thank-you") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <ApplicationFunnel />
      </Suspense>
    );
  }
  if (route === "sample-briefing") {
    return wrap("sample-briefing", <SampleBriefingPage />);
  }
  if (route === "pricing") {
    return wrap("pricing", <PricingPage />);
  }
  if (route === "templates") {
    return wrap("templates", <FreeTemplateLibraryPage />);
  }
  if (route === "three-way-compare") {
    return wrap("compare", <BookkeeperVsFractionalCFOPage />);
  }
  if (route === "compare") {
    return wrap("compare", <ComparisonHubPage />);
  }
  if (route === "security-faq") {
    return wrap("security-faq", <SecurityFAQPage />);
  }

  return wrap(
    "home",
    <>
      <HomeSchema />
      <HomeHero />
      <PainClarity />
      <VaultPreview />
      <EpiphanyBridge />
      <FounderTrustStrip />
      <ClosingBaitCTA />
      <HomeMobileStickyCTA />
    </>,
  );
};

export default App;

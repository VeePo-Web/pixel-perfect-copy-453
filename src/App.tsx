import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { lazy, Suspense, useState } from "react";
import SmoothScrollProvider from "./components/wedding/SmoothScrollProvider";
import LoadingScreen from "./components/wedding/LoadingScreen";
import CursorFollower from "./components/wedding/CursorFollower";
import PageTransition from "./components/wedding/PageTransition";

const PasswordGate = lazy(() => import("./components/wedding/PasswordGate"));

// Lazy-loaded routes for code-splitting
const Index = lazy(() => import("./pages/Index"));

const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
const Approach = lazy(() => import("./pages/Approach"));
const Journal = lazy(() => import("./pages/Journal"));
const Inquire = lazy(() => import("./pages/Inquire"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/approach" element={<PageTransition><Approach /></PageTransition>} />
          <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
          <Route path="/inquire" element={<PageTransition><Inquire /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("hr_site_unlocked") === "true"
  );

  if (!unlocked) {
    return (
      <Suspense fallback={null}>
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </Suspense>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <a href="#main-content" className="skip-to-content">Skip to content</a>
            <LoadingScreen>
              <SmoothScrollProvider>
                <CursorFollower />
                <AnimatedRoutes />
              </SmoothScrollProvider>
            </LoadingScreen>
          </BrowserRouter>
        </TooltipProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
};


export default App;

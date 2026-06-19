import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number>(0);
  const { pathname } = useLocation();

  useEffect(() => {
    // Skip smooth scroll on touch devices for better native performance
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Respect reduced-motion preference — Lenis' inertial scroll is itself motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }
    rafIdRef.current = requestAnimationFrame(raf);

    const handleVisibility = () => {
      if (document.hidden) {
        lenis.stop();
        cancelAnimationFrame(rafIdRef.current);
      } else {
        lenis.start();
        rafIdRef.current = requestAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
    };
  }, []);

  // Reset scroll on route change
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
};

export default SmoothScrollProvider;

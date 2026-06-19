import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import heroImage from "@/assets/hero-wedding-premium.jpg";

// Preload LCP hero image as early as possible (before React mounts).
// Vite resolves the import to the hashed asset URL, ensuring dev + prod correctness.
if (typeof document !== "undefined" && !document.querySelector('link[rel="preload"][data-lcp="hero"]')) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = heroImage;
  link.setAttribute("fetchpriority", "high");
  link.setAttribute("data-lcp", "hero");
  document.head.appendChild(link);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

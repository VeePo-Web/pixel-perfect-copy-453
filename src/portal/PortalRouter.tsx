import { lazy, Suspense, useEffect, useState } from "react";

const Login = lazy(() => import("../pages/portal/Login"));
const Signup = lazy(() => import("../pages/portal/Signup"));
const ForgotPassword = lazy(() => import("../pages/portal/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/portal/ResetPassword"));
const AcceptTerms = lazy(() => import("../pages/portal/AcceptTerms"));
const Dashboard = lazy(() => import("../pages/portal/Dashboard"));
const Accounts = lazy(() => import("../pages/portal/Accounts"));
const Settings = lazy(() => import("../pages/portal/Settings"));
const Terms = lazy(() => import("../pages/legal/Terms"));
const PlaidConsent = lazy(() => import("../pages/legal/PlaidConsent"));
const Privacy = lazy(() => import("../pages/legal/Privacy"));

const Fallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-charcoal-950 text-[13px] text-ink/55">
    Loading…
  </div>
);

/**
 * Minimal path-based router for portal + legal routes. Returns null if the
 * current pathname is not portal/legal — the existing marketing App takes over.
 */
export function isPortalRoute(pathname: string) {
  return (
    pathname.startsWith("/portal") ||
    pathname === "/terms" ||
    pathname === "/plaid-consent" ||
    pathname === "/privacy"
  );
}

export default function PortalRouter({ pathname }: { pathname: string }) {
  const [path, setPath] = useState(pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  let node: React.ReactNode = null;
  switch (path) {
    case "/portal":
    case "/portal/":
      node = <Dashboard />;
      break;
    case "/portal/login":
      node = <Login />;
      break;
    case "/portal/signup":
      node = <Signup />;
      break;
    case "/portal/forgot-password":
      node = <ForgotPassword />;
      break;
    case "/portal/reset-password":
      node = <ResetPassword />;
      break;
    case "/portal/accept-terms":
      node = <AcceptTerms />;
      break;
    case "/portal/accounts":
      node = <Accounts />;
      break;
    case "/portal/settings":
      node = <Settings />;
      break;
    case "/terms":
      node = <Terms />;
      break;
    case "/plaid-consent":
      node = <PlaidConsent />;
      break;
    case "/privacy":
      node = <Privacy />;
      break;
    default:
      node = (
        <div className="flex min-h-screen items-center justify-center bg-charcoal-950 text-ink">
          <div className="text-center">
            <p className="text-[14px] text-ink/55">Portal page not found.</p>
            <a href="/portal" className="mt-3 inline-block text-[13px] underline">
              Go to dashboard
            </a>
          </div>
        </div>
      );
  }
  return <Suspense fallback={<Fallback />}>{node}</Suspense>;
}


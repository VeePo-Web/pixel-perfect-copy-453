import { lazy, Suspense, useEffect, useState } from "react";

const Login = lazy(() => import("../pages/portal/Login"));
const AcceptTerms = lazy(() => import("../pages/portal/AcceptTerms"));
const Dashboard = lazy(() => import("../pages/portal/Dashboard"));
const Accounts = lazy(() => import("../pages/portal/Accounts"));
const Report = lazy(() => import("../pages/portal/Report"));
const Settings = lazy(() => import("../pages/portal/Settings"));
const AdminAudit = lazy(() => import("../pages/portal/admin/Audit"));
const Terms = lazy(() => import("../pages/legal/Terms"));
const PlaidConsent = lazy(() => import("../pages/legal/PlaidConsent"));
const Privacy = lazy(() => import("../pages/legal/Privacy"));
const DataRetention = lazy(() => import("../pages/legal/DataRetention"));
const PlaidOperations = lazy(() => import("../pages/legal/PlaidOperations"));
const MfaPolicy = lazy(() => import("../pages/legal/MfaPolicy"));

const Fallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-charcoal-950 text-[13px] text-ink/55">
    Loading…
  </div>
);

export function isPortalRoute(pathname: string) {
  return (
    pathname.startsWith("/portal") ||
    pathname === "/terms" ||
    pathname === "/plaid-consent" ||
    pathname === "/privacy" ||
    pathname === "/data-retention" ||
    pathname === "/plaid-operations" ||
    pathname === "/mfa-policy"
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
    case "/portal/signup":
    case "/portal/forgot-password":
    case "/portal/reset-password":
      // All legacy auth paths now route to the single passwordless login.
      node = <Login />;
      break;
    case "/portal/admin/audit":
      node = <AdminAudit />;
      break;
    case "/portal/accept-terms":
      node = <AcceptTerms />;
      break;
    case "/portal/accounts":
      node = <Accounts />;
      break;
    case "/portal/report":
      node = <Report />;
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
    case "/data-retention":
      node = <DataRetention />;
      break;
    case "/plaid-operations":
      node = <PlaidOperations />;
      break;
    case "/mfa-policy":
      node = <MfaPolicy />;
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

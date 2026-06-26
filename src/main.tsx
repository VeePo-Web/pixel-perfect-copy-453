import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { handleCheckoutReturn } from './lib/checkout'

// Backward-compat: the site migrated from hash routing (#/pricing) to real
// paths (/pricing). Anything still arriving on a legacy "#/…" link (old
// bookmarks, prior index, shared URLs) is rewritten to the path equivalent on
// boot so it never 404s and SEO continuity is preserved.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState({}, '', window.location.hash.slice(1))
}

// Fire the post-Stripe-redirect conversion event (and strip the return param)
// once on boot, before React mounts — runs exactly once, independent of any UI.
handleCheckoutReturn()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

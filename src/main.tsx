import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { handleCheckoutReturn } from './lib/checkout'

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

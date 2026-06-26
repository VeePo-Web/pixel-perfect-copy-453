import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Production canonical host (matches index.html, robots.txt, sitemap.xml and
// per-route canonicals -- keep these four in sync; single source of truth for
// the prerendered <link rel="canonical"> and og:url on every route).
const HOST = 'https://goldfindesk.com'

// Per-route <head> + body fallback. After `vite build`, the plugin below emits
// dist/<route>/index.html — a copy of the SPA shell with this page's real title,
// description, canonical, social tags AND a real <h1> + intro + crawl nav baked
// into the STATIC HTML. Static hosts serve dist/pricing/index.html for /pricing
// (before the SPA fallback), so crawlers and social unfurlers get correct
// per-page metadata AND indexable body content in the first byte — without
// running JS. The app boots with createRoot().render(), which REPLACES this
// fallback on mount (no hydration), so there is no mismatch and no perf cost.
const ROUTE_META: { path: string; title: string; description: string; h1: string }[] = [
  {
    path: 'pricing',
    title: 'Monthly Financial Reports — $99/mo | GoldFin Desk',
    h1: 'Monthly financial reports, done for you — $99/mo',
    description:
      'GoldFin Reports fills your financial templates from your numbers and sends a plain-English monthly briefing — $99/mo, no spreadsheet work, cancel anytime. GoldFin Advisory ($1,500/mo) by application.',
  },
  {
    path: 'templates',
    title: 'Free Financial Templates · GoldFin Desk',
    h1: 'Free financial templates for owner-led businesses',
    description:
      'Free spreadsheet templates for cash flow, expenses, hiring decisions, monthly reviews, and tax reserves — built for owner-led businesses ready to stop guessing from their bank balance.',
  },
  {
    path: 'sample-briefing',
    title: 'Plain-English Finance Briefing (Sample) | GoldFin Desk',
    h1: 'See a plain-English monthly finance briefing',
    description:
      'See what a plain-English monthly finance briefing looks like for your business — cash movement, revenue, expenses, and decisions. No bank connection required.',
  },
  {
    path: 'compare',
    title: 'Compare Bookkeepers, Dashboards, CFOs & GoldFin Desk · GoldFin Desk',
    h1: 'Compare your financial support options',
    description:
      'Not sure if your business needs a bookkeeper, dashboard, fractional CFO, or GoldFin Desk? Compare financial support options for owner-led businesses.',
  },
  {
    path: 'compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk',
    title: 'Bookkeeper vs Fractional CFO vs GoldFin Desk · GoldFin Desk',
    h1: 'Bookkeeper vs Fractional CFO vs GoldFin Desk',
    description:
      'Compare bookkeepers, fractional CFOs, and GoldFin Desk to understand which financial support option fits your owner-led business.',
  },
  {
    path: 'security-faq',
    title: 'Security & FAQ | GoldFin Desk',
    h1: 'Security & FAQ',
    description:
      'Learn how GoldFin Desk handles previews, applications, bank connection timing, privacy expectations, and common questions for owner-led businesses.',
  },
]

// Homepage body fallback (injected into the root index.html).
const HOME = {
  h1: 'Your business finances are not unclear. They are just unorganized.',
  description:
    'GoldFin Desk turns your financial activity into organized spreadsheets and a plain-English monthly briefing — a recurring finance rhythm for owner-led businesses, without hiring a CFO.',
}

function prerenderRouteMeta(): Plugin {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  // A real, crawlable body baked into #root. createRoot().render() replaces it on
  // mount, so JS clients never see it; JS-less crawlers (incl. AI bots) index it.
  const bodyFallback = (h1: string, description: string) =>
    `<div id="root"><main style="max-width:46rem;margin:0 auto;padding:6rem 1.5rem;font-family:system-ui,sans-serif;color:#0B0D12">` +
    `<h1 style="font-size:2rem;line-height:1.15;font-weight:300">${esc(h1)}</h1>` +
    `<p style="margin-top:1rem;color:#5A6170;line-height:1.6">${esc(description)}</p>` +
    `<nav aria-label="GoldFin Desk" style="margin-top:2rem;color:#5A6170">` +
    `<a href="/">Home</a> · <a href="/pricing">Pricing</a> · <a href="/templates">Free templates</a> · ` +
    `<a href="/sample-briefing">Sample briefing</a> · <a href="/compare">Compare</a> · ` +
    `<a href="/security-faq">Security &amp; FAQ</a></nav></main></div>`

  return {
    name: 'prerender-route-meta',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const tplPath = path.join(dist, 'index.html')
      if (!fs.existsSync(tplPath)) return
      const tpl = fs.readFileSync(tplPath, 'utf-8')

      // Interior routes: full <head> + body fallback.
      for (const r of ROUTE_META) {
        const t = esc(r.title)
        const d = esc(r.description)
        const canon = `${HOST}/${r.path}`
        const html = tpl
          .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canon}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canon}$2`)
          .replace('<div id="root"></div>', bodyFallback(r.h1, r.description))
        const outDir = path.join(dist, ...r.path.split('/'))
        fs.mkdirSync(outDir, { recursive: true })
        fs.writeFileSync(path.join(outDir, 'index.html'), html)
      }

      // Homepage: inject the body fallback into the root shell (head already correct).
      const homeHtml = tpl.replace('<div id="root"></div>', bodyFallback(HOME.h1, HOME.description))
      fs.writeFileSync(tplPath, homeHtml)

      // eslint-disable-next-line no-console
      console.log(`prerender-route-meta: wrote ${ROUTE_META.length} route shells + home body`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prerenderRouteMeta()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
})

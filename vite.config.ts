import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Production canonical host (matches index.html, robots.txt, sitemap.xml and
// per-route canonicals -- keep these four in sync; single source of truth for
// the prerendered <link rel="canonical"> and og:url on every route).
const HOST = 'https://goldfindesk.com'

// Per-route <head>. After `vite build`, the plugin below emits
// dist/<route>/index.html — a copy of the SPA shell with this page's real title,
// description, canonical and social tags baked into the STATIC HTML. Static hosts
// serve dist/pricing/index.html for /pricing (before the SPA fallback), so
// crawlers and social unfurlers get correct per-page metadata in the first byte —
// the payoff of path routing — with zero new deps and no runtime/perf cost.
const ROUTE_META: { path: string; title: string; description: string }[] = [
  {
    path: 'pricing',
    title: 'Monthly Financial Reports — $99/mo | GoldFin Desk',
    description:
      'GoldFin Reports fills your financial templates from your numbers and sends a plain-English monthly briefing — $99/mo, no spreadsheet work, cancel anytime. GoldFin Advisory ($1,500/mo) by application.',
  },
  {
    path: 'templates',
    title: 'Free Financial Templates · GoldFin Desk',
    description:
      'Free spreadsheet templates for cash flow, expenses, hiring decisions, monthly reviews, and tax reserves — built for owner-led businesses ready to stop guessing from their bank balance.',
  },
  {
    path: 'sample-briefing',
    title: 'Plain-English Finance Briefing (Sample) | GoldFin Desk',
    description:
      'See what a plain-English monthly finance briefing looks like for your business — cash movement, revenue, expenses, and decisions. No bank connection required.',
  },
  {
    path: 'compare',
    title: 'Compare Bookkeepers, Dashboards, CFOs & GoldFin Desk · GoldFin Desk',
    description:
      'Not sure if your business needs a bookkeeper, dashboard, fractional CFO, or GoldFin Desk? Compare financial support options for owner-led businesses.',
  },
  {
    path: 'compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk',
    title: 'Bookkeeper vs Fractional CFO vs GoldFin Desk · GoldFin Desk',
    description:
      'Compare bookkeepers, fractional CFOs, and GoldFin Desk to understand which financial support option fits your owner-led business.',
  },
  {
    path: 'security-faq',
    title: 'Security & FAQ | GoldFin Desk',
    description:
      'Learn how GoldFin Desk handles previews, applications, bank connection timing, privacy expectations, and common questions for owner-led businesses.',
  },
]

function prerenderRouteMeta(): Plugin {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  return {
    name: 'prerender-route-meta',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const tplPath = path.join(dist, 'index.html')
      if (!fs.existsSync(tplPath)) return
      const tpl = fs.readFileSync(tplPath, 'utf-8')
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
        const outDir = path.join(dist, ...r.path.split('/'))
        fs.mkdirSync(outDir, { recursive: true })
        fs.writeFileSync(path.join(outDir, 'index.html'), html)
      }
      // eslint-disable-next-line no-console
      console.log(`prerender-route-meta: wrote ${ROUTE_META.length} per-route HTML shells`)
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

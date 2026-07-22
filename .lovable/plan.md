# Sitemap Fix — Make `/` Visible in the Lovable Preview Dropdown

## What I found
- `public/sitemap.xml` already lists `/`, but it uses `https://goldfindesk.com/` as the base URL.
- The Lovable preview/project domain is `https://pixel-perfect-copy-453.lovable.app/`.
- Lovable's preview route dropdown matches sitemap entries against the current project domain, so the existing sitemap entries are treated as external and do not appear in the dropdown.
- The current sitemap also contains `/apply` (retired) and is missing `/about` (live).

## Plan

1. **Create a sitemap generator** (`scripts/generate-sitemap.ts`)
   - Set `BASE_URL` to the Lovable project domain: `https://pixel-perfect-copy-453.lovable.app`.
   - Build the `entries` array from the live public routes in `src/App.tsx` and the static blog routes in `src/lib/blog/static.ts`.
   - Include `/` as the first entry with `priority: "1.0"`.
   - Omit `/apply`, `/thank-you`, `/checkout/return`, `/billing`, portal routes, and `*`.
   - Include `/about`.

2. **Wire the generator into the build**
   - Add `"predev": "bunx tsx scripts/generate-sitemap.ts"` to `package.json`.
   - Add `"prebuild": "bunx tsx scripts/generate-sitemap.ts"` to `package.json`.

3. **Regenerate `public/sitemap.xml`**
   - Run the generator so the file is updated with the correct base URL and route set.

4. **Verify**
   - Confirm `public/sitemap.xml` is served at `/sitemap.xml`.
   - Confirm the Lovable preview dropdown now shows `/` (Home) and the other public routes.

## Expected result
The Lovable preview route dropdown will display `/` and all public marketing routes, letting you click straight to the homepage.

## One quick question
Do you want the sitemap to keep pointing at `goldfindesk.com` for the live published site, or should it use the Lovable project domain everywhere? I recommend the Lovable project domain for the sitemap so the dropdown works; the canonical tags in `index.html` and `vite.config.ts` can continue pointing at `goldfindesk.com` for SEO once the custom domain is connected.
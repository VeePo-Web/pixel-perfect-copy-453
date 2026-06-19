
# Reset Project to Zentry Clone (Preserve Personas Only)

## Goal
Completely strip the current Hickory & Rose wedding venue site down to a bare Vite + React + TS + Tailwind shell, preserve only the persona prompt content into a new `personas/` folder, then rebuild the project as a 1:1 reconstruction of the `himanshu-tyd/zentry-clone` GitHub repo.

---

## The Prompt (copy/paste-ready)

> **Full project reset — Hickory & Rose → Zentry clone**
>
> Do this in two strict phases. Do not skip phase 1.
>
> ### Phase 1 — Clean sweep
>
> 1. **Extract and preserve persona prompts first.** Before deleting anything, find every persona-related asset in the project. This includes:
>    - `mem://ux/persona-strategy` (the "Polished Paige" UX persona memory)
>    - Any persona descriptions, voice/tone guidelines, copywriting prompts, or audience-targeting notes embedded in components, comments, content files, or markdown under `src/`, `docs/`, `.lovable/`, or the project root.
>    - The relevant memory entries from `mem://index.md` that describe persona/UX strategy.
>
>    Move all of that content into a **new top-level folder named `personas/`**, organized as plain `.md` files (e.g. `personas/polished-paige.md`, `personas/voice-and-tone.md`, `personas/ux-strategy.md`). Each file should be self-contained — no references back to Hickory & Rose branding, venues, weddings, or Meg Wolodko. Strip venue-specific examples but keep the psychographic, behavioral, and UX-decision-making guidance intact, since that is what makes the site quality high.
>
> 2. **Delete everything else Hickory & Rose related.** This means:
>    - All pages, routes, components, sections, hooks, and utilities tied to the wedding venue site (Home, About, Inquire, Gallery, Veepo link, founder bio, brand watermarks, Cormorant/Jost/Great Vibes typography setup, sage/cream color tokens, custom cursor, Lenis scroll setup, inquiry wizard, sidebar tracking — all of it).
>    - All Hickory & Rose copy, image assets, video assets, and SEO metadata (title, description, OG tags, favicon, `robots.txt`, `sitemap.xml` entries).
>    - All Hickory & Rose-specific entries in `index.html`, `tailwind.config.ts`, `src/index.css` (custom CSS variables, fonts, animations, design tokens), and any `mem://design/*`, `mem://features/*`, `mem://business/*` memory files. Update `mem://index.md` to remove all H&R references — keep only the persona pointers (now pointing at `personas/`).
>
> 3. **Reduce `src/` to a minimal Vite + React 18 + TS + Tailwind v3 + shadcn shell.** Keep: `main.tsx`, an empty `App.tsx`, `index.css` reset, `vite.config.ts`, `tailwind.config.ts` (default theme), `tsconfig*`, `package.json` dependencies that are framework-level. Delete all venue-specific dependencies that aren't needed for a generic site.
>
> 4. Verify the project still builds and renders a blank page before moving on.
>
> ### Phase 2 — Rebuild as Zentry clone
>
> 5. **Source repo:** `https://github.com/himanshu-tyd/zentry-clone` (main branch).
>
> 6. **Port the entire repo into this project** as a faithful reconstruction:
>    - Recreate every section: Hero (with the video-mask hover interaction and "G A M I N G" letter clipping), About, Features (the bento-style cards with the tilting 3D hover), Story (the image-warp / image-tilt effect on scroll), Contact, Footer.
>    - Recreate the navbar with the floating-on-scroll behavior, audio indicator bars, and the show/hide on scroll direction.
>    - Use the exact same component structure (`Hero.jsx`, `About.jsx`, `Features.jsx`, `Story.jsx`, `Contact.jsx`, `Navbar.jsx`, `Footer.jsx`, plus the `Button.jsx`, `AnimatedTitle.jsx`, `BentoCard.jsx`, `VideoPreview.jsx` helpers) — but convert all files to **TypeScript** (`.tsx`) since this project is TS.
>    - Install the same dependencies: `gsap`, `@gsap/react`, `react-use`, `clsx`, `react-icons`. Use the same versions where reasonable.
>    - Recreate the GSAP `ScrollTrigger` animations exactly: hero video swap, clip-path expanding mask on scroll, About title pinning, bento card 3D tilt, Story image distortion on mouse-move, and the animated title word-by-word reveal.
>    - Copy all static assets (videos in `public/videos/`, images in `public/img/`, fonts in `public/fonts/`) from the source repo into this project's `public/` folder at the same paths so imports resolve unchanged.
>    - Reproduce `tailwind.config.js` exactly: custom font families (`zentry`, `general`, `circular-web`, `robert-medium`, `robert-regular`), custom colors (`blue-50/75/100/200/300`, `violet-300`, `yellow-100/300`), and the `font-face` declarations in `index.css`.
>    - Match the visual output pixel-for-pixel against the live demo at `https://zentry-clone-himanshu.vercel.app/` (or whatever the repo's live preview is). Use Playwright screenshots side-by-side to verify.
>
> 7. **Keep `personas/` untouched.** It is reference material for future UX/copy work on top of the Zentry clone — do not import it into the app, do not let it influence the Zentry visual rebuild.
>
> 8. **Update `mem://index.md`** to reflect the new project: "Zentry clone — GSAP-driven gaming landing page. Persona reference material preserved in `/personas/` for future use."
>
> ### Acceptance criteria
>
> - No Hickory & Rose strings, assets, colors, fonts, components, or memory entries remain anywhere in the repo.
> - `personas/` exists at the project root with the persona prompt files, brand-agnostic.
> - The site at `/` renders the Zentry clone hero with autoplay video, GSAP scroll animations work, all sections present, navbar floats on scroll.
> - `npm run build` succeeds with no warnings about missing assets.

---

## Notes on scope

- This is a destructive reset — Lovable's version history is the only undo. The user should confirm they're OK losing all current code before I execute Phase 1.
- The Zentry repo uses JavaScript; converting to TypeScript adds a small amount of typing work but keeps the project consistent with the Vite TS template.
- Asset copying from the GitHub repo will use `curl` against `raw.githubusercontent.com` for each file in `public/`.

## Confirm before I proceed

Reply **"go"** and I'll execute the prompt above start-to-finish in build mode. If you want to tweak the persona extraction rules, the TS conversion, or the target asset fidelity, tell me now.

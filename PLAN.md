# Turnkey Reno — one-page marketing site (Astro + Tailwind)

## Context
New Cleveland home renovation contractor needs a single-page site whose only job is to get homeowners and investors to **call** or **request a free estimate**. `F:\Site` is empty (Node 24.18, npm 11.16, git 2.55 available). Structure follows cfcbuilders.com. The design is our own. All business content lives in one file so the client can swap copy without touching components.

## Stack decisions
- **Astro 5** (static output, `output: 'static'`), **TypeScript strict**
- **Tailwind CSS v4** via `@tailwindcss/vite`, with theme tokens in `src/styles/global.css` (`@theme`)
- **Fonts self-hosted** via `@fontsource-variable/inter` (body) and `@fontsource/barlow-condensed` (bold headings, which suit a contractor look). No external requests.
- **Icons:** inline SVG paths in one `Icon.astro` component, so no icon dependency
- **No JS framework.** Small vanilla TS `<script>` blocks for the mobile menu, lightbox and form validation.
- Deploys as-is to Netlify or Cloudflare Pages (build `npm run build`, publish `dist/`). I'll add a minimal `netlify.toml`; Cloudflare needs no config.

## Design
- Palette: navy `#0f1b2d` / charcoal `#1e293b` surfaces, white and slate-50 light sections, **amber accent `#f59e0b`**. Dark navy text goes on amber buttons for AA contrast; white text on amber fails, so I won't use it.
- Mobile-first with generous spacing (`py-16 md:py-24`), large tap targets (min 44px), visible focus rings (`focus-visible:ring-amber-400`).
- **Mobile:** a sticky header with logo, a phone icon button, a "Free Estimate" button and a hamburger. A **sticky bottom action bar** ("Call" | "Free Estimate") also shows on small screens only, so both actions are always one thumb-tap away.

## File structure
```
F:\Site
├── .gitignore              # node_modules, dist, .astro, .env*, OS/editor files
├── astro.config.mjs        # site URL from site.ts, tailwind vite plugin
├── netlify.toml
├── package.json
├── tsconfig.json           # extends astro/tsconfigs/strict
├── README.md               # how to edit content, swap images, hook up Web3Forms/Formspree, deploy
├── public/
│   ├── favicon.svg         # placeholder "TR" monogram
│   ├── og-image.png        # placeholder 1200x630 (generated once by script)
│   ├── hero-placeholder.svg
│   └── projects/
│       └── project-1.svg … project-8.svg   # labeled solid-color placeholders
├── scripts/
│   └── generate-placeholders.mjs   # creates the SVG placeholders above (re-runnable)
└── src/
    ├── data/
    │   └── site.ts         # ★ ALL business content + types
    ├── styles/global.css   # tailwind import, @theme tokens, base styles
    ├── layouts/
    │   └── BaseLayout.astro    # <head>: SEO, OG/Twitter, canonical, favicon, JSON-LD
    ├── components/
    │   ├── Header.astro        # sticky header + hamburger (aria-expanded, Esc closes)
    │   ├── MobileActionBar.astro
    │   ├── Hero.astro
    │   ├── TrustStrip.astro
    │   ├── Services.astro      # + ServiceCard.astro
    │   ├── About.astro         # Why Choose Us
    │   ├── Projects.astro      # grid + <dialog> lightbox
    │   ├── Tips.astro
    │   ├── EstimateForm.astro
    │   ├── Footer.astro
    │   ├── SectionHeading.astro
    │   └── Icon.astro
    └── pages/
        └── index.astro         # composes sections in order
```

## `src/data/site.ts` (single source of truth)
Typed exports (`as const` with interfaces):
- `company`: name "Turnkey Reno", slogan "You start, we finish.", tagline/subheading, `phoneDisplay: "(440) 337-5140"`, `phoneHref: "tel:+14403375140"`, email (placeholder), address parts (street, suite, city, state, zip), service area text, `siteUrl` (placeholder `https://example.com`, used for canonical, OG and JSON-LD)
- `seo`: title, description, ogImage path
- `nav`: anchor links (`#services`, `#about`, `#projects`, `#tips`, `#estimate`)
- `hero`: heading, subheading, background image path + alt
- `trustPoints[4]`: Free Estimates, Honest Pricing, Quality Materials, Homeowners & Investors (each with an icon key and a short line)
- `services[6]`: `{ id, title, description, icon, placeholder: true }`
- `about`: heading plus the **two paragraphs verbatim** as given
- `projects[]`: `{ src, alt, caption, placeholder: true }`
- `tips[3]`: `{ title, body, placeholder: true }`
- `form`: `action: "#"` placeholder, `method: "POST"`, `accessKeyField` stub for Web3Forms, success/error messages
- No stats, ratings or testimonials anywhere.

Placeholder items render a small, unobtrusive "Placeholder" badge only in dev (`import.meta.env.DEV`), so production stays clean while the content is still clearly marked in `site.ts`. **I can show the badge in production too if you'd prefer.**

## Section details
1. **Header:** `position: sticky; top: env(safe-area-inset-top)` style, backdrop on scroll. Desktop shows logo, nav, tel link and amber "Free Estimate" button. Mobile shows logo, a phone icon (labeled), a compact Estimate button and a hamburger that toggles a panel with `aria-controls`/`aria-expanded`; clicking a link closes it. A skip-to-content link comes first. Sections get `scroll-margin-top` so anchors don't hide under the header.
2. **Hero:** full-bleed background image (placeholder SVG) with a navy gradient overlay for text contrast. H1 is the slogan, followed by the subheading and two CTAs: "Get a Free Estimate" goes to `#estimate` and "Call Now" goes to `tel:`.
3. **Trust strip:** 4 icon + label items. 2×2 on mobile, 4 across on desktop. Navy band.
4. **Services:** 6 cards with icon, h3 and description in a 1/2/3-column grid.
5. **About / Why Choose Us:** verbatim text plus a 3–4 bullet value list derived from the text itself (quality workmanship, honest pricing, reliable service, start-to-finish). No invented claims.
6. **Projects:** responsive grid of `<button>` thumbnails that open a native `<dialog>` lightbox with prev/next, arrow keys, Esc, focus trap (native) and focus returned to the thumbnail. Images use `loading="lazy"`, explicit width/height and alt text from `site.ts`.
7. **Tips corner:** 3 cards.
8. **Estimate form:** name, phone, email, zip, service select (built from `services` plus "Other / Not sure"), message, and a honeypot (`botcheck`, visually hidden, `tabindex=-1`, `autocomplete=off`). `novalidate` plus TS validation: required fields, phone (10 digits), email format, 5-digit zip. Errors are linked via `aria-describedby` and `aria-invalid`, focus moves to the first invalid field, and an `aria-live` status region is included. With the placeholder action, submit shows a "form not connected yet" notice instead of navigating. Correct `autocomplete` and `inputmode` attributes are set (`tel`, `email`, `postal-code`, `numeric`).
9. **Footer:** name, slogan, address in `<address>`, tel link, quick links and `© {new Date().getFullYear()}`. The year is computed at build time; note: rebuild yearly or it's fine since deploys happen often.

## SEO / a11y
- `<title>`, meta description, canonical, `og:*` (type, title, description, url, image, locale), `twitter:card`, `theme-color`
- **JSON-LD** `HomeAndConstructionBusiness` (a LocalBusiness subtype) with name, telephone, PostalAddress, `areaServed` (Cleveland, OH and suburbs), url and image, built from `site.ts`
- Semantic landmarks (`header`/`nav`/`main`/`section aria-labelledby`/`footer`), one H1, logical heading order, alt text on every image, keyboard-navigable throughout, `prefers-reduced-motion` respected (no smooth scroll when reduced)

## ⚠️ Content flag
The footer address you gave is in **Canton, OH 44721**, about 60 miles south of Cleveland, while the copy says "Cleveland-based". I'll use it exactly as given (footer plus JSON-LD), but you may want to confirm it with the client, since a Canton address in LocalBusiness schema can affect local search for "Cleveland".

## Build steps (after approval)
1. `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`, then `npm i`, then `npx astro add tailwind -y`, then install fontsource packages
2. Write `site.ts`, styles, layout and components; run the placeholder generator script
3. `git init` with `.gitignore`, then an initial commit (with the Co-Authored-By attribution)
4. `npm run build` to confirm a clean static build, and `npx astro check` for types
5. Start `npm run dev` in the background and report the local URL (normally `http://localhost:4321`)

## Verification
- `astro check` reports 0 errors, and `npm run build` succeeds with `dist/index.html` produced
- Dev server loads and every nav anchor scrolls to its section
- Mobile menu opens and closes via click and keyboard (Esc)
- Lightbox works with keyboard
- Form: empty submit shows inline errors and focuses the first invalid field; valid submit shows the placeholder notice
- JSON-LD parses as valid JSON in the built HTML

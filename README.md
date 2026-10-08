# Turnkey Reno: marketing site

One-page static site for a Cleveland home renovation company. The site has one goal: get visitors to **call** or **request a free estimate**.

**Stack:** Astro 7 · Tailwind CSS 4 · TypeScript (strict) · fully static output, no backend.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs static site to dist/
npm run preview    # serve the built site locally
npx astro check    # type-check
```

Node 22.12+ is required.

## Editing content

**All business content lives in [`src/data/site.ts`](src/data/site.ts).** That includes the company name, phone, address, slogan, services, about text, projects, tips, form copy and SEO text. Components only read from it.

| Want to change…           | Edit in `site.ts`                         |
| ------------------------- | ----------------------------------------- |
| Phone / address / email   | `company`                                 |
| Hero text and buttons     | `hero` (headline = `company.slogan`)      |
| Services                  | `services` (icon names: see `IconName`)   |
| About / Why choose us     | `about`                                   |
| Gallery                   | `projects`                                |
| Tips                      | `tips`                                    |
| Page title, description   | `seo`                                     |
| Form backend              | `formConfig`                              |
| Placeholder badges, noindex | `settings`                              |

Items marked `placeholder: true` display a small **Placeholder** badge while `settings.showPlaceholderBadges` is `true`.

## Images

Images live in **`src/assets/`** and are referenced from `site.ts` by path relative to that folder. Astro resizes them and converts JPG/PNG to WebP at build time, with responsive `srcset`. SVGs are passed through unchanged.

- **Project photos:** drop files into `src/assets/projects/` (e.g. `kitchen-1.jpg`), then update the `image` paths in `projects`. Any number of photos works; the grid repeats its layout pattern every 8 images. Aim for ≥ 1600px wide, landscape.
- **Hero background:** replace `hero.image.src` with a wide photo (≥ 2400px). The dark overlay keeps text readable.
- **Logo:** `brand.logo.src` (currently `logo.svg`, a placeholder). Wide wordmarks and square marks both fit. For a mark without the company name in it, set `brand.logo.showNameNextToLogo: true`.
- **Favicon:** `public/favicon.svg`. It's a placeholder that matches the logo mark.
- **Social preview (OG image):** `public/og-image.png` is a simple placeholder with no text. Replace it with a real **1200×630 PNG or JPG** once the logo is final.

A missing image path fails the build with a message listing the available files.

`scripts/generate-placeholders.mjs` regenerates the placeholder hero, project images and OG image (`node scripts/generate-placeholders.mjs`).

## Connecting the estimate form

The form currently has no backend. Submitting a valid form shows a "not connected yet" notice. To connect it, fill in `formConfig` in `site.ts`:

**Web3Forms**
```ts
action: 'https://api.web3forms.com/submit',
accessKey: '<your access key>',
honeypotName: 'botcheck',
```

**Formspree**
```ts
action: 'https://formspree.io/f/<form-id>',
accessKey: '',
honeypotName: '_gotcha',
```

The form validates on the client (name, phone, email, 5-digit zip and service are required) and then submits via `fetch` with an inline success/error message. Without JavaScript it falls back to a normal POST. A hidden honeypot field catches basic spam bots.

## Deploying

The output is plain static files in `dist/`.

- **Netlify:** connect the repo. `netlify.toml` already sets `npm run build` and `dist`.
- **Cloudflare Pages:** framework preset "Astro", build command `npm run build`, output directory `dist`, and set environment variable `NODE_VERSION=22`.

## Search engines (noindex)

While `settings.noindex` is `true` (the default until launch), every page has `<meta name="robots" content="noindex, nofollow">` and `/robots.txt` disallows all crawlers. This keeps preview deploys out of Google.

**At launch, flip `settings.noindex` to `false` and set `company.siteUrl` to the real domain, together.** `siteUrl` drives the canonical URL, Open Graph URLs and the LocalBusiness schema.

## Before launch checklist

- [ ] `company.siteUrl` set to the real domain (no trailing slash)
- [ ] `settings.noindex` → `false` (meta robots tag and robots.txt both update)
- [ ] `settings.showPlaceholderBadges` → `false`, and placeholder content replaced
- [ ] Form connected (`formConfig.action` + key), with a test submission received
- [ ] Privacy policy page added and linked in the footer (needed once the form collects data)
- [ ] Sitemap added (`npx astro add sitemap`), then uncomment the `Sitemap:` line in `src/pages/robots.txt.ts`
- [ ] Real OG image: 1200×630 PNG/JPG at `public/og-image.png`
- [ ] Real project photos and hero photo in `src/assets/`
- [ ] Real logo and favicon
- [ ] Confirm the business address. The listed address is in Canton, OH while the copy says "Cleveland-based", and the address feeds the LocalBusiness schema used by local search.
- [ ] Test on a real phone: call button, menu, gallery, form

## Project structure

```
src/
  data/site.ts          ← all content
  assets/               ← logo, hero and project images (optimized at build)
  components/           ← one component per section, plus Icon/Logo/etc.
  layouts/BaseLayout    ← <head>: SEO, Open Graph, JSON-LD, fonts
  lib/images.ts         ← resolves site.ts image paths to optimized assets
  pages/index.astro     ← assembles the page
  pages/robots.txt.ts   ← generated robots.txt (follows settings.noindex)
  styles/global.css     ← Tailwind theme tokens, buttons, textures, motion
public/                 ← favicon, OG image (copied as-is)
scripts/                ← placeholder image generator
```

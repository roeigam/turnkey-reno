# Turnkey Reno: marketing site

One-page static site for a Northeast Ohio home renovation company. The site has one goal: get visitors to **call** or **request a free estimate**.

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
A missing image path fails the build with a message listing the available files.

`scripts/generate-placeholders.mjs` regenerates the placeholder hero and project images (`node scripts/generate-placeholders.mjs`).

## Logo

The client's original artwork is in `src/assets/brand/logo-original-{dark,light}.jpeg`. It's **reference only**: those files are excluded from the build. The site uses clean vector SVGs recreated from them by **`scripts/build-logo.mjs`**:

| File (`src/assets/brand/`) | What | Used for |
|---|---|---|
| `logo-full-{dark,light}.svg` | Original layout with tagline (metallic gold) | Footer |
| `logo-compact-{dark,light}.svg` | Original layout, no tagline | Optional header (`brand.headerLogo: 'compact'`) |
| `logo-lockup-{dark,light}.svg` | Mark + "TURNKEY RENO" on one line | Header (default, most legible small) |
| `logo-icon-{dark,light}.svg` | Roof + chimney + window | Favicon base |
| `logo-mark-{dark,light}.svg` | Roof + window + key-T | Lockup mark |

`dark` = for dark backgrounds (white text), `light` = for light backgrounds (dark text). Text is Montserrat (ExtraBold for "URNKEY", Medium for the tagline, widened Medium for "RENO"), converted to outlines, so no font loads.

The script also writes `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `logo.png` (used by the LocalBusiness schema) and `og-image.png` (1200×630 social preview). To change geometry, colours or weights, edit the constants at the top of the script and run:

```bash
node scripts/build-logo.mjs
```

It uses `opentype.js` and `@fontsource/montserrat` (dev-only) plus `sharp`, which ships with Astro.

**Brand colours:** UI gold `#dba84f` (sampled from the logo), dark gold `#86601a` for small text on light backgrounds, logo gradient `#c79641 → #f3c874 → #c49343`.

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

The form validates on the client (name, phone, 5-digit zip and service are required; email, budget and "I am a…" are optional, and email is format-checked only when filled in) and then submits via `fetch` with an inline success/error message. Without JavaScript it falls back to a normal POST. A hidden honeypot field catches basic spam bots.

## Deploying

The output is plain static files in `dist/`.

- **Netlify:** connect the repo. `netlify.toml` already sets `npm run build` and `dist`.
- **Cloudflare Pages:** framework preset "Astro", build command `npm run build`, output directory `dist`, and set environment variable `NODE_VERSION=22`.

## Search engines (noindex)

While `settings.noindex` is `true` (the default until launch), every page has `<meta name="robots" content="noindex, nofollow">` and `/robots.txt` disallows all crawlers. This keeps preview deploys out of Google.

**At launch, flip `settings.noindex` to `false` and set `company.siteUrl` to the real domain, together.** `siteUrl` drives the canonical URL, Open Graph URLs and the LocalBusiness schema.

## Releases

All release notes live in one file, [`CHANGELOG.md`](CHANGELOG.md) ([Keep a Changelog](https://keepachangelog.com/) format, newest version first). Each release has a version number ([Semantic Versioning](https://semver.org/)) and an annotated git tag (`vX.Y.Z`).

- `0.x.y` = pre-launch; `1.0.0` = public launch on the real domain.
- **Minor** bump: new section, feature, design change or new assets. **Patch** bump: bug fix, copy fix or small style tweak.
- `package.json` `version` always matches the latest release.
- Each release is two commits: the changes, then a "Release vX.Y.Z" commit that adds the new version section at the top of `CHANGELOG.md` (referencing the changes commit hash), updates `package.json`, and gets the tag. Older entries are only edited to correct factual errors.

## Before launch checklist

- [ ] `company.siteUrl` set to the real domain (no trailing slash)
- [ ] `settings.noindex` → `false` (meta robots tag and robots.txt both update)
- [ ] `settings.showPlaceholderBadges` → `false`, and placeholder content replaced
- [ ] Form connected (`formConfig.action` + key), with a test submission received
- [ ] Privacy policy page added and linked in the footer (needed once the form collects data)
- [ ] Sitemap added (`npx astro add sitemap`), then uncomment the `Sitemap:` line in `src/pages/robots.txt.ts`
- [ ] OG image: `public/og-image.png` now uses the real logo. Optionally swap in a branded photo version (1200×630)
- [ ] Real project photos and hero photo in `src/assets/`, with real captions in `projects[]` (format: "Kitchen Remodel · North Canton, OH")
- [x] Real logo and favicon (recreated as SVG from the client artwork)
- [ ] Re-enable credentials advantage once license + insurance are obtained (see site.ts)
- [ ] Confirm the "within 24 hours" response promise (estimate section intro) is realistic
- [ ] Consider a domain email (e.g. info@yourdomain.com) instead of the Gmail address
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

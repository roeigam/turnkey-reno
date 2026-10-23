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
| Projects (before/after)   | `projects`                                |
| Tips                      | `tips`                                    |
| Page title, description   | `seo`                                     |
| Form backend (Web3Forms key) | `form.web3formsKey`                    |
| Placeholder badges, noindex | `settings`                              |

Items marked `placeholder: true` display a small **Placeholder** badge while `settings.showPlaceholderBadges` is `true`.

## Images

Images live in **`src/assets/`** and are referenced from `site.ts` by path relative to that folder. Astro resizes them and converts JPG/PNG to WebP at build time, with responsive `srcset`. SVGs are passed through unchanged.

- **Projects:** use one folder per project, `src/assets/projects/<id>/` (`before-1.jpg`, `after-1.jpg`, …). Each entry in `projects` (site.ts) has:
  - `title` and `workType`;
  - `city`: the caption shows "Work type · City, OH", or just the work type while `city` is empty;
  - `before[]` and `after[]` images, each with alt text;
  - `matchedPair: true` when before and after are shot from the same angle, which gives an interactive comparison slider. Otherwise the card shows before | after side by side;
  - `featured: true` for the large card (one project);
  - `enabled: false` to keep a project in the data without showing it. Put its images in `src/assets/_disabled/`, which is excluded from the build. Every image in the regular asset folders is bundled into `dist/` even when unused, so this keeps disabled content from shipping. To enable it, move the files back under `src/assets/projects/` and update the paths. The build stops with a clear message if an enabled item still points into `_disabled/`.

  The lightbox shows all of a project's photos, befores first, each labelled Before/After.
- **Project photo sources:** the client's social-media composites and reels live in `src/assets/projects/source/` and are **never shipped**, because they're excluded from the image glob. The videos (`*.mp4`) are also kept out of git because of their size. `node scripts/extract-project-photos.mjs` crops the clean photos out of the composites. It only crops (no resizing or edits), every crop box is documented in the script, and it pulls the roof frames from the reel with `ffmpeg-static`, which needs the video present locally.
- **Service card photos:** each service can have an optional `image`. These only render when `settings.showServiceImages` is `true`. Turn it on once every service card has a photo, so the grid stays consistent.
- **Hero background:** replace `hero.image.src` with a wide photo (≥ 2400px). The dark overlay keeps text readable.

A missing image path fails the build with a message listing the available files.

`scripts/generate-placeholders.mjs` regenerates the placeholder hero image (`node scripts/generate-placeholders.mjs`).

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

The form sends requests through [Web3Forms](https://web3forms.com). The only setting is the access key, in one place in `site.ts`:

```ts
export const form = {
  web3formsKey: '<your access key>',
};
```

- **To connect or change it:** paste the key into `form.web3formsKey`, then rebuild and deploy. To disconnect, set it back to `''`.
- **Where submissions go:** Web3Forms emails each request to the address the access key was created with. To send them to a different inbox, create a new key for that address at web3forms.com and replace the old one.
- **The key is public by design.** Web3Forms access keys are meant to be in the page HTML, so it lives in `site.ts` and doesn't need an environment variable or a secret.
- **While the key is empty** the form is not connected: a valid submission shows a "not connected yet" notice and nothing is sent.

How it works: the form validates in the browser (name, phone, 5-digit zip and service are required; email, budget and "I am a…" are optional, and email is format-checked only when filled in). It then posts JSON to `https://api.web3forms.com/submit` without reloading the page. The email lists every field with a readable label (Name, Phone, Email, Zip code, I am a, Service, Budget, Message; empty optional fields say "Not provided"), with the subject "New estimate request: {service} ({zip})", sender name "Turnkey Reno website", and reply-to set to the customer's email when they gave one.

- While sending, the button is disabled and reads "Sending...".
- On success, a thank-you message replaces the form.
- On an error or network failure, everything the visitor typed stays in place and an error message offers the phone number as a fallback.
- Spam: a hidden `botcheck` field (Web3Forms' own honeypot) catches basic bots.
- Without JavaScript, the form falls back to a normal POST to Web3Forms.

## Deploying

The output is plain static files in `dist/`.

- **Netlify:** connect the repo. `netlify.toml` already sets `npm run build` and `dist`.
- **Cloudflare Pages:** framework preset "Astro", build command `npm run build`, output directory `dist`, and set environment variable `NODE_VERSION=22`.

**About `ffmpeg-static`:** this package is used only by `scripts/extract-project-photos.mjs`, never by the site build. Its install script downloads an ~80 MB ffmpeg binary from GitHub. It's listed under `optionalDependencies`, so if that download fails or is blocked (on Netlify, Cloudflare or locally), `npm install` still succeeds and the package is simply skipped; the build doesn't need it. Locally, if the crop script reports ffmpeg as missing, run `npm install ffmpeg-static`. If npm asks you to approve install scripts, run `npm approve-scripts ffmpeg-static`.

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
- [ ] Form connected (`form.web3formsKey` set), with a test submission received at the client's inbox
- [ ] Privacy policy page added and linked in the footer (needed once the form collects data)
- [ ] Sitemap added (`npx astro add sitemap`), then uncomment the `Sitemap:` line in `src/pages/robots.txt.ts`
- [ ] OG image: `public/og-image.png` now uses the real logo. Optionally swap in a branded photo version (1200×630)
- [ ] Confirm the city for each project (`city` in `projects`, currently empty), and add more projects as photos arrive
- [ ] Real hero photo: the background is still the blueprint placeholder, and none of the project photos is large enough
- [ ] Basement foundation project: show it only if the client confirms the photos are of his own job (`enabled: false` in `projects`)
- [x] Real logo and favicon (recreated as SVG from the client artwork)
- [ ] Re-enable credentials advantage once license + insurance are obtained (see site.ts)
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

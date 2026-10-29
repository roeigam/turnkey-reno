# Turnkey Reno: marketing site

One-page static site (plus a privacy page) for Turnkey Reno LLC, a Northeast Ohio home renovation company, live at **https://turnkeyrenollc.com**. The site has one goal: get visitors to **call** or **request a free estimate**.

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

**All business content lives in [`src/data/site.ts`](src/data/site.ts).** That includes the company name, phone, address, slogan, services, about text, the How We Work steps, tips, form copy and SEO text. Components only read from it.

| Want to change…           | Edit in `site.ts`                         |
| ------------------------- | ----------------------------------------- |
| Phone / address / email   | `company`                                 |
| Hero text and buttons     | `hero` (headline = `company.slogan`)      |
| Services                  | `services` (icon names: see `IconName`)   |
| About / Why choose us     | `about`                                   |
| How We Work (4 steps)     | `howWeWork`                               |
| Projects gallery (off)    | `projects`, `settings.showProjects`       |
| Tips                      | `tips`                                    |
| Page title, description   | `seo`                                     |
| Form backend (Web3Forms key) | `form.web3formsKey`                    |
| Placeholder badges, noindex, hero background, section switches | `settings` |

Items marked `placeholder: true` display a small **Placeholder** badge while `settings.showPlaceholderBadges` is `true`.

## Images

Images live in **`src/assets/`** and are referenced from `site.ts` by path relative to that folder. Astro resizes them and converts JPG/PNG to WebP at build time, with responsive `srcset`. SVGs are passed through unchanged.

**Only publish the company's own photos or properly licensed stock.** No photos of other companies' work (legal).

- **`src/assets/_disabled/` (never published):** photos from a different company's projects: the former project gallery crops, the former photo hero, and their source composites and videos. They're kept for reference only and **must not be published on this site** (see the README in that folder). The image loader excludes the whole folder, and the build stops with an error if `site.ts` points into it. The videos are also kept out of git.
- **Projects gallery (off):** `settings.showProjects` is `false`. The section and its "Projects" nav link are left out, and "How We Work" takes their place. The gallery code (before/after cards, comparison slider, lightbox) and the `Project` data structure are kept. **Re-enable only with photos of Turnkey Reno's own completed projects:**
  1. Put them in `src/assets/projects/<id>/` (`before-1.jpg`, `after-1.jpg`, …).
  2. Add entries to `projects` (there's a commented example in site.ts). Each has `title`, `workType`, `city` (caption "Work type · City, OH"), `before[]`/`after[]` with alt text, `matchedPair` (same angle → comparison slider) and an optional `featured` (full-width card).
  3. Set `settings.showProjects` to `true`.
- **Stock images:** put them in `src/assets/stock/` and add an entry for each to [`src/assets/stock/CREDITS.md`](src/assets/stock/CREDITS.md) (source URL, photographer, license, download date) **before** it goes on the site.
- **How We Work side image:** `howWeWork.image` + `settings.showHowWeWorkImage` (off). When on, the section shows the image on the left and the steps as a vertical timeline on the right.
- **Hero background:** `settings.heroImage` picks one of `hero.images`. Currently that's `'blueprint'`, the blueprint illustration, which is the intended design for now and shows no badge.
  - Each option has a `position` (CSS object-position) for phones and desktop.
  - A photo option gets a navy overlay that keeps all hero text at WCAG AA.
  - To add one (own photo or licensed stock, ideally ≥ 2400px wide): put it in `src/assets/hero/` or `src/assets/stock/`, add it to `hero.images`, select it, and re-check the contrast.
- **Service card photos:** each service can have an optional `image`. These only render when `settings.showServiceImages` is `true`. Turn it on once every service card has a photo, so the grid stays consistent.

A missing image path fails the build with a message listing the available files.

`scripts/generate-placeholders.mjs` regenerates the blueprint placeholder hero image (`node scripts/generate-placeholders.mjs`).

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

The form sends requests through [Web3Forms](https://web3forms.com). **It's connected since v1.2.0:** requests are emailed to **turnkeyrenousa@gmail.com**, the account the access key was created with. The only setting is the access key, in one place in `site.ts`:

```ts
export const form = {
  web3formsKey: '<your access key>',
};
```

- **To connect or change it:** paste the key into `form.web3formsKey`, then rebuild and deploy. To disconnect, set it back to `''`.
- **Where submissions go:** Web3Forms emails each request to the address the access key was created with. To send them to a different inbox, create a new key for that address at web3forms.com and replace the old one.
- **The key is public by design.** Web3Forms access keys are meant to be in the page HTML, so it lives in `site.ts` and doesn't need an environment variable or a secret.
- **While the key is empty** the form is not connected and nothing is sent. A valid submission shows a friendly note instead (`estimate.notConnectedMessage`): "Online requests are almost ready. In the meantime, call us at … or email … and we'll set up your free estimate." The phone number is a tap-to-call link, and the email link opens a message pre-filled with what the visitor typed. Their entries stay in the form.

How it works: the form validates in the browser (name, phone, 5-digit zip and service are required; email, budget and "I am a…" are optional, and email is format-checked only when filled in). It then posts JSON to `https://api.web3forms.com/submit` without reloading the page. The email lists every field with a readable label (Name, Phone, Email, Zip code, I am a, Service, Budget, Message; empty optional fields say "Not provided"), with the subject "New estimate request: {service} ({zip})", sender name "Turnkey Reno website", and reply-to set to the customer's email when they gave one.

- While sending, the button is disabled and reads "Sending...".
- On success, a thank-you message replaces the form.
- On an error or network failure, everything the visitor typed stays in place and an error message offers the phone number as a fallback.
- Spam: a hidden `botcheck` field (Web3Forms' own honeypot) catches basic bots.
- Without JavaScript, the form falls back to a normal POST to Web3Forms.

## Hosting & domain

The site is live at **https://turnkeyrenollc.com**. `www.turnkeyrenollc.com` and `http://` both redirect there.

**Hosting: Netlify**
- Netlify project subdomain: `turnkey-reno.netlify.app`. The build settings are in `netlify.toml` (`npm run build`, publish `dist`, Node 22).
- Free plan, credit-based: **every production deploy uses credits** from a monthly allowance. Group changes and push them in batches rather than one small push at a time.
- The free plan adds a "Powered by Netlify" badge in the bottom-right corner. It can't be hidden on this plan, and the site doesn't touch it. Instead, the mobile action bar (Call / Free Estimate) detects the badge and sits just above it, so both buttons stay tappable. Without the badge (locally, or on a paid plan) the bar sits at the very bottom as usual.
- **How a change goes live:** push to the `main` branch on GitHub. Netlify builds and deploys automatically, usually within a couple of minutes.
- **Rollback:** in Netlify, open Deploys, pick an earlier deploy and choose "Publish deploy". Or `git revert` the change and push.

**Domain: turnkeyrenollc.com**
- Registered at **Northwest Registered Agent**, owned by **Turnkey Reno LLC**. DNS is managed there.
- DNS records changed for the website:
  - `A` record for `@` → `75.2.60.5` (Netlify's load balancer)
  - `CNAME` record for `www` → `turnkey-reno.netlify.app`
  - the old `A` record for `www` was removed.
- **Do not touch** these records. They belong to the Northwest email setup, and changing them can break email:
  - `MX` records
  - `TXT` records (SPF, DKIM, DMARC)
  - `CNAME` `psrp`
  - the `mail` `A` record
- HTTPS certificates are issued and renewed automatically by Netlify.

## Deploying elsewhere

The output is plain static files in `dist/`.

- **Cloudflare Pages:** framework preset "Astro", build command `npm run build`, output directory `dist`, and set environment variable `NODE_VERSION=22`.

## Search engines

Indexing is **on** (`settings.noindex: false`).
- `/robots.txt` allows all crawlers and points to `/sitemap.xml`.
- `/sitemap.xml` lists the public pages (`src/pages/sitemap.xml.ts`). Add new pages to its list.
- `company.siteUrl` (`https://turnkeyrenollc.com`) drives the canonical URLs, Open Graph URLs and image, the LocalBusiness schema (home page), robots.txt and the sitemap.
- Setting `settings.noindex` back to `true` would add `<meta name="robots" content="noindex, nofollow">` and a disallow-all robots.txt (for example, on a test copy of the site).

## Privacy policy

`/privacy` (`src/pages/privacy.astro`) is linked from the footer and from the note under the estimate form. It's a short, plain-English **general template written for what this site actually does**:
- what the estimate form collects;
- that it's delivered by email through Web3Forms;
- that it's used only to respond to the request, and not sold or shared for marketing;
- that the site uses no cookies or analytics.

**It is not legal advice.** Have it reviewed if the business needs that certainty. Update it (and `EFFECTIVE_DATE` at the top of the file) if the site starts collecting more, for example by adding analytics, a chat widget or a newsletter.

## Releases

All release notes live in one file, [`CHANGELOG.md`](CHANGELOG.md) ([Keep a Changelog](https://keepachangelog.com/) format, newest version first). Each release has a version number ([Semantic Versioning](https://semver.org/)) and an annotated git tag (`vX.Y.Z`).

- `0.x.y` = pre-launch; `1.0.0` = public launch on the real domain.
- **Minor** bump: new section, feature, design change or new assets. **Patch** bump: bug fix, copy fix or small style tweak.
- `package.json` `version` always matches the latest release.
- Each release is two commits: the changes, then a "Release vX.Y.Z" commit that adds the new version section at the top of `CHANGELOG.md` (referencing the changes commit hash), updates `package.json`, and gets the tag. Older entries are only edited to correct factual errors.

## Launch checklist (done at launch, v1.0.0)

- [x] `company.siteUrl` set to `https://turnkeyrenollc.com`
- [x] `settings.noindex` → `false` (no robots meta tag; robots.txt allows crawling)
- [x] `settings.showPlaceholderBadges` → `false` (no placeholder content left on the page)
- [x] Privacy policy page (`/privacy`), linked in the footer and under the form
- [x] Sitemap (`/sitemap.xml`), referenced from robots.txt
- [x] OG image `public/og-image.png` with the real logo, absolute URL on the domain
- [x] ~~Hero photo~~: removed in v1.1.0 (it showed another company's project); the hero is the blueprint illustration again
- [x] Real logo and favicon (recreated as SVG from the client artwork)
- [x] "Within 24 hours" response promise removed (the client doesn't commit to a response time)
- [x] Form shows a customer-friendly "call or email us" note while it isn't connected

## After launch

- [x] Connect the form: `form.web3formsKey` set in v1.2.0, and one test submission sent through the live form (see CHANGELOG 1.2.0)
- [ ] Client to confirm the test submission ("TEST - website form check") arrived in turnkeyrenousa@gmail.com, including the spam folder
- [ ] Client approval of the "How We Work" copy (`howWeWork` in site.ts, marked PENDING CLIENT APPROVAL)
- [ ] Photos of Turnkey Reno's **own** completed projects, then re-enable the gallery (`settings.showProjects`, see Images)
- [ ] Licensed stock images (with entries in `src/assets/stock/CREDITS.md`): How We Work side image (`settings.showHowWeWorkImage`), and optionally a hero photo (≥ 2400px wide)
- [ ] Re-enable the credentials advantage once license and insurance are obtained (see site.ts)
- [ ] Test on a real phone: call button, menu, mobile bar (with the Netlify badge), form
- [ ] Submit `https://turnkeyrenollc.com/sitemap.xml` in Google Search Console
- [ ] Netlify: delete old deploys that still contain the removed photos (Deploys tab), and if Google indexed any of those images, request their removal in Search Console
- [ ] Optional: a branded photo version of the OG image (1200×630), from licensed or own photos only
- [ ] Optional: a domain email (e.g. info@turnkeyrenollc.com) instead of the Gmail address. Set it up with the Northwest email service, without touching the website's DNS records

## Project structure

```
src/
  data/site.ts          ← all content
  assets/               ← logo and hero (optimized at build); stock/ (+ CREDITS.md); _disabled/ (never published)
  components/           ← one component per section, plus Icon/Logo/etc.
  layouts/BaseLayout    ← <head>: SEO, Open Graph, JSON-LD (home page), fonts; per-page title/description/path
  lib/images.ts         ← resolves site.ts image paths to optimized assets
  pages/index.astro     ← assembles the home page
  pages/privacy.astro   ← privacy policy (/privacy)
  pages/sitemap.xml.ts  ← generated sitemap (home + privacy)
  pages/robots.txt.ts   ← generated robots.txt (follows settings.noindex)
  styles/global.css     ← Tailwind theme tokens, buttons, textures, motion
public/                 ← favicon, OG image (copied as-is)
scripts/                ← logo and placeholder image generators
```

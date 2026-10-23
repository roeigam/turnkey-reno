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
| Placeholder badges, noindex, hero background | `settings`             |

Items marked `placeholder: true` display a small **Placeholder** badge while `settings.showPlaceholderBadges` is `true`.

## Images

Images live in **`src/assets/`** and are referenced from `site.ts` by path relative to that folder. Astro resizes them and converts JPG/PNG to WebP at build time, with responsive `srcset`. SVGs are passed through unchanged.

- **Projects:** use one folder per project, `src/assets/projects/<id>/` (`before-1.jpg`, `after-1.jpg`, …). Each entry in `projects` (site.ts) has:
  - `title` and `workType`;
  - `city`: the caption shows "Work type · City, OH", or just the work type while `city` is empty;
  - `before[]` and `after[]` images, each with alt text;
  - `matchedPair: true` when before and after are shot from the same angle, which gives an interactive comparison slider. Otherwise the card shows before | after side by side;
  - `featured: true` for the large card (one project). On desktop it spans the full width and the other projects share the row below it evenly (3 projects → three columns);
  - `enabled: false` to keep a project in the data without showing it. Put its images in `src/assets/_disabled/`, which is excluded from the build. Every image in the regular asset folders is bundled into `dist/` even when unused, so this keeps disabled content from shipping. To enable it, move the files back under `src/assets/projects/` and update the paths. The build stops with a clear message if an enabled item still points into `_disabled/`.

  The lightbox shows all of a project's photos, befores first, each labelled Before/After.
- **Project photo sources:** the client's social-media composites and reels live in `src/assets/projects/source/` and are **never shipped**, because they're excluded from the image glob. The videos (`*.mp4`) are also kept out of git because of their size. `node scripts/extract-project-photos.mjs` crops the clean photos out of the composites. It only crops (no resizing or edits), every crop box is documented in the script, and it pulls the roof frames from the reel with `ffmpeg-static`, which needs the video present locally.
- **Sunroom (comparison slider):** the client's photos are clean, but the after photo was shot with an ultra-wide lens, so the room appears smaller. To line them up for the slider, the script fits a uniform scale and offset to landmarks measured in both photos (room corner, door edge). It then crops the after photo and downscales the before photo to the same size. Nothing is warped or lens-corrected, so the far-left wall still steps a little at the slider handle. The full, uncropped after photo is written to `src/assets/hero/sunroom-after.jpg` for the hero.
- **Service card photos:** each service can have an optional `image`. These only render when `settings.showServiceImages` is `true`. Turn it on once every service card has a photo, so the grid stays consistent.
- **Hero background:** `settings.heroImage` picks one of `hero.images`:
  - `'sunroom'` (default): the sunroom after photo under a navy overlay;
  - `'blueprint'`: the original placeholder, which shows a Placeholder badge.

  Each option has a `position` (CSS object-position) for phones and for desktop, which sets the focal point. To use a new photo, put it in `src/assets/hero/` (ideally ≥ 2400px wide; the sunroom photo is 1448px), add an entry to `hero.images`, and select it. The overlay is tuned so all hero text meets WCAG AA contrast on the sunroom photo. Re-check the contrast if you swap in a much brighter photo.

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

The form sends requests through [Web3Forms](https://web3forms.com). The only setting is the access key, in one place in `site.ts`:

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

**About `ffmpeg-static`:** this package is used only by `scripts/extract-project-photos.mjs`, never by the site build. Its install script downloads an ~80 MB ffmpeg binary from GitHub. It's listed under `optionalDependencies`, so if that download fails or is blocked (on Netlify, Cloudflare or locally), `npm install` still succeeds and the package is simply skipped; the build doesn't need it. Locally, if the crop script reports ffmpeg as missing, run `npm install ffmpeg-static`. If npm asks you to approve install scripts, run `npm approve-scripts ffmpeg-static`.

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
- [x] Real hero photo: the sunroom after photo (`settings.heroImage: 'sunroom'`)
- [x] Real logo and favicon (recreated as SVG from the client artwork)
- [x] "Within 24 hours" response promise removed (the client doesn't commit to a response time)
- [x] Form shows a customer-friendly "call or email us" note while it isn't connected

## After launch

- [ ] **Connect the form:** set `form.web3formsKey`, push, then send a test request and confirm it arrives in the client's inbox
- [ ] Confirm the city for each project (`city` in `projects`, currently empty for all four: sunroom, attic, roof, concrete), and add more projects as photos arrive
- [ ] Re-enable the credentials advantage once license and insurance are obtained (see site.ts)
- [ ] Basement foundation project: show it only if the client confirms the photos are of his own job (`enabled: false` in `projects`)
- [ ] Test on a real phone: call button, menu, gallery, sliders, form
- [ ] Submit `https://turnkeyrenollc.com/sitemap.xml` in Google Search Console
- [ ] Optional: a sharper hero photo (≥ 2400px wide) for large and retina screens
- [ ] Optional: higher-resolution project photos (several sources are small, see CHANGELOG 0.4.0)
- [ ] Optional: a branded photo version of the OG image (1200×630)
- [ ] Optional: a domain email (e.g. info@turnkeyrenollc.com) instead of the Gmail address. Set it up with the Northwest email service, without touching the website's DNS records

## Project structure

```
src/
  data/site.ts          ← all content
  assets/               ← logo, hero and project images (optimized at build)
  components/           ← one component per section, plus Icon/Logo/etc.
  layouts/BaseLayout    ← <head>: SEO, Open Graph, JSON-LD (home page), fonts; per-page title/description/path
  lib/images.ts         ← resolves site.ts image paths to optimized assets
  pages/index.astro     ← assembles the home page
  pages/privacy.astro   ← privacy policy (/privacy)
  pages/sitemap.xml.ts  ← generated sitemap (home + privacy)
  pages/robots.txt.ts   ← generated robots.txt (follows settings.noindex)
  styles/global.css     ← Tailwind theme tokens, buttons, textures, motion
public/                 ← favicon, OG image (copied as-is)
scripts/                ← logo, placeholder and project-photo scripts
```

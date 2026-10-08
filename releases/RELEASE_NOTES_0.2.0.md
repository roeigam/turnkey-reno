# Release Notes: v0.2.0

| Field | Value |
|---|---|
| Version | 0.2.0 |
| Release date | 2026-10-08 |
| Release type | Minor |
| Previous version | 0.1.0 |
| Git commit | deaedac |
| Git tag | v0.2.0 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-08) |
| Status | Pre-launch |

## Summary
The site now uses Turnkey Reno's real logo instead of the temporary "TR" mark. It was redrawn as a sharp vector file so it stays crisp on any screen and sits cleanly on the site's navy background. A one-line version keeps the name readable in the header on phones, and the full logo with the tagline appears in the footer. The site's accent color was changed from orange-amber to the gold of the logo, and text and keyboard-focus colors were rechecked so everything stays easy to read.

## Added
- `scripts/build-logo.mjs`: rebuilds the logo from measured geometry, with Montserrat lettering converted to outlines (ExtraBold for "URNKEY", Medium for the tagline, a widened Medium for "RENO").
- Logo files in `src/assets/brand/`, each with a `-dark` and `-light` version and a transparent background:
  - `logo-full-*.svg`: original layout with tagline and metallic gold gradient;
  - `logo-compact-*.svg`: original layout without the tagline;
  - `logo-lockup-*.svg`: one-line mark + "TURNKEY RENO";
  - `logo-icon-*.svg`: roof, chimney and window;
  - `logo-mark-*.svg`: roof, window and key-shaped T.
- Client originals `logo-original-dark.jpeg` and `logo-original-light.jpeg` stored as reference (excluded from the build).
- `public/favicon-32.png` and `public/apple-touch-icon.png` (180×180), with `<link>` tags in `BaseLayout.astro`.
- `public/logo.png` (600px wide), used as the `logo` in the LocalBusiness JSON-LD.
- `brand.headerLogo` option in `site.ts` (`'lockup'` or `'compact'`).
- `.on-dark` focus scope in `global.css`, applied to the header, hero, About, Tips, estimate panel, footer, mobile bar and lightbox.
- Dev dependencies: `opentype.js`, `@fontsource/montserrat` (used only by the logo script).

## Changed
- Header: placeholder logo replaced with the horizontal lockup (`logo-lockup-dark.svg`), 40px tall on mobile and 56px on desktop.
- Footer: placeholder logo replaced with the full logo (`logo-full-dark.svg`) at 112–128px.
- Accent colors in `global.css`, sampled from the logo:
  - `--color-accent` `#f5a524` → `#dba84f`;
  - `-300` → `#f0cf8c`, `-400` → `#e6bd6c`, `-600` → `#c18e38`;
  - `-700` (text on light backgrounds) `#9a5b05` → `#86601a`;
  - the button glow was retinted to match.
- Focus outline: dark gold `#86601a` on light sections, gold `#dba84f` on dark sections (was amber everywhere).
- `public/favicon.svg`: gold roof-and-window icon on a navy tile.
- `public/og-image.png`: full logo on navy with a blueprint grid, plus "HOME RENOVATION · CLEVELAND, OHIO" (now built by `build-logo.mjs`).
- `Logo.astro`: takes `variant` (`full` / `compact` / `lockup` / `icon`) and `tone` (`dark` / `light`), reading paths from `brand.logo` in `site.ts`.
- Placeholder hero and project images regenerated in the new gold.
- `src/lib/images.ts`: the image glob skips `*-original*` files.
- `PlaceholderBadge.astro`: dark-variant class renamed `on-dark` → `is-dark` (avoids clashing with the focus scope).
- `README.md`: new "Logo" section; launch checklist updated.

## Fixed
- Keyboard focus outline contrast on light sections: was ~1.8:1 (amber on paper), now 5.12:1 (dark gold on paper).

## Removed
- `src/assets/logo.svg` (placeholder "TR" logo).
- Footer: the separate "You start, we finish." text line (the full logo now carries the tagline).
- OG image generation from `scripts/generate-placeholders.mjs` (moved to `build-logo.mjs`).

## Content status
- Replaced in this release: logo (client artwork, recreated as vector), favicon, OG image.
- Still placeholder: hero photo, 8 project photos, 6 service descriptions, 3 tips, business email, form service account.
- Not yet set: production domain, privacy policy page.
- To confirm with client: Canton, OH address vs "Cleveland-based" copy.

## Verification
- Logo accuracy: the SVG was rendered at the original's pixel coordinates and compared pixel by pixel. Overlap (intersection over union) was 0.929 for the white elements and 0.904 for the gold.
- Font choice by overlap against the original:
  - "URNKEY": Montserrat 800 scored 0.948 (next best: 900 at 0.860);
  - tagline: 500 scored 0.787;
  - "RENO": 500 stretched per letter scored 0.754 (best of 500–800).
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built; `dist/` contains no `*-original*` files.
- Contrast, computed from the final colors (WCAG formula). All 12 pairs pass:
  - navy on gold button 8.95:1, on hover 10.91:1;
  - gold on navy-950 8.95:1, on navy-900 8.41:1;
  - dark gold on paper 5.12:1, on white 5.67:1;
  - placeholder badge on light 5.10:1, on dark 12.11:1;
  - focus outline 5.12 / 5.67 / 8.95 / 8.41:1 (3:1 required).
- Focus outline colors measured in the browser after the transition: `rgb(134, 96, 26)` on a light section, `rgb(219, 168, 79)` in the header.
- Screenshots reviewed (Playwright driving Microsoft Edge): desktop 1440×900 header, footer and focus states; mobile 390×844 at 3× header and footer.
- Header options compared at real size: in the compact logo "RENO" is about 8px tall at 44px height on mobile, so the lockup was chosen.
- Favicon viewed at 16px and 32px; OG image checked visually. While doing so, a bug in the OG subtitle (coordinates printed as `NaN`) was found and fixed, and every generated SVG was checked for `NaN` (none).
- Not checked in this release: Lighthouse, real phones, browsers other than Edge.

## Known issues
- When focusing a link that has a color transition, the focus outline fades from the link's text color to gold over about 150ms before settling.
- All logo variants are copied into `dist/_astro/` even when unused (a few KB each, not linked from the page).

## Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-08. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.1.0`.

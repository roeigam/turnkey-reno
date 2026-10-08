# Turnkey Reno: real logo → SVG system + gold accent

## Context
The client sent their real logo as two JPEGs: `src/assets/brand/logo-original-dark.jpeg` (gold and white on black) and `logo-original-light.jpeg` (gold and black on white). Both are 1536×1024, compressed, with solid backgrounds. Note that they are **.jpeg, not PNG**.

The site currently uses a placeholder "TR" mark, and its accent is amber `#f5a524`, which doesn't match the logo's metallic gold. The goal is to:
- recreate the logo as clean vector SVG in 3 layouts × 2 background tones;
- swap it in everywhere;
- retune the accent to the logo gold, keeping WCAG AA.

The original JPEGs stay untouched as reference only.

## What I observed in the originals
- **Layout (dark version, px):**
  - The roof spans x≈150→1370; its ridge is at y≈160 and its eaves flare out thin to y≈360.
  - The chimney is on the right slope.
  - A 4-pane window sits under the ridge.
  - The key-T spans x≈120→340, y≈380→695. Its crossbar has a slanted left end, and the stem has 4 teeth on the left and a chevron point at the bottom.
  - "URNKEY" spans x≈345→1420 with a cap height of about 185px.
  - "RENO" is gold, widely tracked, with a gold line on each side.
  - The tagline "YOU START WE FINISH" is widely tracked with gold side lines.
- **Typeface:** geometric sans with straight-legged R, round U and O, and a wide E. This is **Montserrat**: ExtraBold or Black for URNKEY, SemiBold or Bold for RENO, Medium for the tagline. I'll pick each weight by overlaying it on the original.
- **The two originals differ slightly.** The chimney position, the window size and the key teeth aren't identical, which suggests AI-generated artwork. I'll use the **dark version as the primary reference**.
- **Sampled gold:**
  - dark version: p10 `#c19244`, median `#e1af56`, p90 `#f3c874`;
  - light version: median `#c18e38`.

## A. Recreate as SVG: `scripts/build-logo.mjs` (re-runnable, source of truth)
- **Geometry as code:** the roof, chimney and 4-pane window are polygons and rects in a shared coordinate space measured from the dark original. The key-T is one path: a slanted-end crossbar, a stem with 4 teeth and a chevron tip. The side lines are rects.
- **Text converted to outlined paths** with `opentype.js`, reading Montserrat `.woff` files from `@fontsource/montserrat`. The SVGs then render identically everywhere, including inside `<img>` tags and the OG renderer, with no font loading. Tracking and positions are calibrated to the measured bounding boxes of the original.
- **New devDependencies:** `opentype.js` and `@fontsource/montserrat`. They are used only by the script and never shipped to the browser.
- **Gold in the logo:**
  - The **full** logo uses a subtle 3-stop metallic gradient (`#c18e38` → `#f3c874` → `#c19244`, sampled) so it looks close to the original at large sizes.
  - The **compact** and **icon** versions use **solid gold**, which stays crisp at small sizes.
  - One constant in the script switches the full logo to solid as well.

## B. Outputs: transparent backgrounds, `src/assets/brand/`
| File | Contents | Used for |
|---|---|---|
| `logo-full-{dark,light}.svg` | roof + window + key-T + URNKEY + RENO with lines + tagline with lines | footer, large uses |
| `logo-compact-{dark,light}.svg` | roof + window + key-T + URNKEY + RENO with lines, no tagline, viewBox cropped tight | header (desktop and mobile) |
| `logo-icon-{dark,light}.svg` | **roof + chimney + 4-pane window** (reads as "home" at 32px; the key-T alone reads as just a letter T) | favicon base, small uses |

- **`-dark`** files are for dark backgrounds: white text and window. **`-light`** files are for light backgrounds: near-black `#111` text and window. Gold stays the same in both.
- **The script also writes:**
  - `public/favicon.svg`: the icon on a rounded navy tile, so it reads in both light and dark browser tabs;
  - `public/favicon-32.png` and `public/apple-touch-icon.png` (180×180);
  - `public/og-image.png`: the new OG image (see E).
- **Rasterizing:** the PNGs are rendered with `sharp`, which is **already installed as Astro's dependency**. Nothing new is added for this.
- **Originals:** I'll exclude `*-original*` from the image glob in [src/lib/images.ts](src/lib/images.ts) so the JPEGs never reach `dist/`. They stay in the folder untouched.
- **Old placeholder:** I'll delete `src/assets/logo.svg`.

## C. Wire into site.ts + Logo component
- **`src/data/site.ts`, `brand.logo`:**
  ```ts
  logo: {
    alt: 'Turnkey Reno',
    full:    { dark: 'brand/logo-full-dark.svg',    light: 'brand/logo-full-light.svg' },
    compact: { dark: 'brand/logo-compact-dark.svg', light: 'brand/logo-compact-light.svg' },
    icon:    { dark: 'brand/logo-icon-dark.svg',    light: 'brand/logo-icon-light.svg' },
  }
  ```
- **[Logo.astro](src/components/Logo.astro):** takes the props `variant: 'full' | 'compact' | 'icon'` and `tone: 'dark' | 'light'`. It keeps the existing sizing approach: height-constrained, width auto, max-width cap. The `showNameNextToLogo` option is dropped because the real artwork contains the name.
- **Header:** compact/dark at about 52px tall on desktop and about 44px on mobile (around 105–125px wide). I'll check it on a 390px screenshot. If URNKEY is illegible on mobile, the mobile header switches to icon + compact; otherwise it stays compact.
- **Footer:** full/dark at about 120px tall.
- **JSON-LD `logo`:** points to a raster `public/logo.png` (full-light, 600px wide, also generated by the script). Google prefers a raster logo on a light background.

## D. Accent → logo gold (solid), with a contrast recheck
Tokens in [src/styles/global.css](src/styles/global.css):
| Token | Old | New | Use | Contrast |
|---|---|---|---|---|
| `--color-accent` | `#f5a524` | **`#dba84f`** (between the two sampled medians) | buttons, rules, icons on dark | navy text on gold **8.95:1**; gold on navy **8.9:1** |
| `--color-accent-400` | `#f8b84e` | `#e6bd6c` | button hover | navy on it ≈ 10:1 |
| `--color-accent-300` | `#fbc867` | `#f0cf8c` | badge text on dark | 11:1 or more |
| `--color-accent-600` | `#d98a0b` | `#c18e38` | form focus border | — |
| `--color-accent-700` | `#9a5b05` | **`#86601a`** | eyebrows, asterisks and badge text on light | **5.12:1** on paper, 5.67:1 on white |

- **Focus ring fix:** gold on paper is only about 2:1, below the 3:1 a focus indicator needs. The current amber also fails. The new `:focus-visible` uses a `--ring` variable:
  - `accent-700` by default, for light sections (5.1:1);
  - bright gold inside dark areas (8.9:1), set via an `.on-dark` class on the header, hero, About, Tips, the estimate panel, the footer, the mobile bar and the lightbox.
- **Hardcoded amber:** the remaining `rgb(245 165 36 …)` values (button glow, `::selection`) and the amber in the placeholder hero and project SVGs are updated in [scripts/generate-placeholders.mjs](scripts/generate-placeholders.mjs). The placeholders are then regenerated. The OG block moves out of that script into `build-logo.mjs`.

## E. Favicon + OG image
- **Favicon:** the gold roof and window icon on a navy rounded tile (SVG), plus 32px and 180px PNG fallbacks. These get `<link>` tags in [BaseLayout.astro](src/layouts/BaseLayout.astro).
- **OG image (1200×630 PNG):** a navy background with a faint blueprint grid, the full dark logo centered, and a gold bar along the bottom. It's rendered from SVG by sharp.

## Comparison for review
I'll build a local page, `scratchpad/logo-compare.html`, showing for each original:
1. the original JPEG;
2. my SVG on the same background;
3. a 50% overlay of the two, for checking alignment.

It also includes the compact and icon versions at real sizes (header ~52px, 32px and 16px favicon), on both navy and white. I'll screenshot it, review the result myself, and open it in your browser. It stays local, since these are the client's brand assets.

## Files touched
- **New:**
  - `scripts/build-logo.mjs`
  - `src/assets/brand/logo-{full,compact,icon}-{dark,light}.svg`
  - `public/{favicon-32.png, apple-touch-icon.png, logo.png}`
- **Edited:**
  - `src/data/site.ts`, `src/components/Logo.astro`, `Header.astro`, `Footer.astro`
  - `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `src/lib/images.ts`
  - `scripts/generate-placeholders.mjs`, `public/favicon.svg`, `public/og-image.png`
  - `README.md` (logo section, the logo script, "regenerate with `node scripts/build-logo.mjs`")
  - `package.json` (2 devDependencies)
- **Deleted:** `src/assets/logo.svg`
- **Commit:** one commit, with no Co-Authored-By line.

## Verification
- Overlay comparison: the SVG matches the original's proportions and letter shapes within a few pixels at full size.
- `npx astro check` reports 0 errors, and `npm run build` is clean.
- `dist/` contains no `*-original*` files.
- The contrast table is recomputed from the final tokens; every text pairing is ≥ 4.5:1 and focus rings are ≥ 3:1.
- Playwright screenshots (desktop and 390px mobile) of the header, footer and focus states on light and dark sections.
- The favicon renders at 16 and 32px, and the OG PNG is checked visually.
- The dev server keeps running at http://localhost:4321.

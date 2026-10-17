/**
 * Generates the placeholder hero image (project photos are real now: see extract-project-photos.mjs):
 *   src/assets/hero/hero.svg          hero background (blueprint-style house elevation)
 *   (the OG image and favicons are built by scripts/build-logo.mjs)
 *
 * Run: node scripts/generate-placeholders.mjs
 * Safe to re-run; only overwrites the files listed above.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const write = (rel, data) => {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  console.log('wrote', rel);
};

const FONT = "'Barlow Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif";

/* ── Blueprint grid pattern ───────────────────────────────────────────────── */
const grid = (id, size, opacity) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
    <path d="M${size} 0H0V${size}" fill="none" stroke="#fff" stroke-opacity="${opacity}" stroke-width="1"/>
  </pattern>
  <pattern id="${id}-major" width="${size * 5}" height="${size * 5}" patternUnits="userSpaceOnUse">
    <path d="M${size * 5} 0H0V${size * 5}" fill="none" stroke="#fff" stroke-opacity="${opacity * 2}" stroke-width="1.5"/>
  </pattern>`;

/* ── Hero ─────────────────────────────────────────────────────────────────── */
const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1400" viewBox="0 0 2400 1400">
  <!-- PLACEHOLDER hero image. Replace with a real project photo and update hero.image.src in src/data/site.ts -->
  <defs>
    <radialGradient id="glow" cx="72%" cy="55%" r="60%">
      <stop offset="0" stop-color="#1f3657"/>
      <stop offset="1" stop-color="#070e1a"/>
    </radialGradient>
    ${grid('g', 40, 0.035)}
  </defs>
  <rect width="2400" height="1400" fill="url(#glow)"/>
  <rect width="2400" height="1400" fill="url(#g)"/>
  <rect width="2400" height="1400" fill="url(#g-major)"/>
  <g fill="none" stroke="#fff" stroke-opacity=".32" stroke-width="3" stroke-linejoin="round">
    <path d="M1300 720 1750 400l450 320"/>
    <path d="M1360 680v520h780V680"/>
    <path d="M1950 540V460h70v130"/>
    <rect x="1690" y="960" width="120" height="240"/>
    <circle cx="1785" cy="1085" r="6"/>
    <rect x="1440" y="820" width="160" height="180"/><path d="M1520 820v180M1440 910h160"/>
    <rect x="1900" y="820" width="160" height="180"/><path d="M1980 820v180M1900 910h160"/>
    <circle cx="1750" cy="600" r="48"/><path d="M1702 600h96M1750 552v96"/>
    <path d="M1150 1200h1250" stroke-opacity=".5"/>
  </g>
  <g fill="none" stroke="#dba84f" stroke-opacity=".7" stroke-width="2">
    <path d="M1300 330h900M1300 315v30M2200 315v30"/>
    <path d="M2290 720v480M2275 720h30M2275 1200h30"/>
    <path d="M1360 1260h780M1360 1245v30M2140 1245v30"/>
  </g>
  <g fill="#dba84f" fill-opacity=".85" font-family="${FONT}" font-size="30" font-weight="600" letter-spacing="2">
    <text x="1750" y="312" text-anchor="middle">32'-0"</text>
    <text x="2318" y="970" transform="rotate(90 2318 970)" text-anchor="middle">18'-6"</text>
    <text x="1750" y="1300" text-anchor="middle">FRONT ELEVATION</text>
  </g>
  <text x="2360" y="1370" text-anchor="end" fill="#fff" fill-opacity=".25" font-family="${FONT}" font-size="22" letter-spacing="3">PLACEHOLDER: REPLACE WITH HERO PHOTO</text>
</svg>
`;
write('src/assets/hero/hero.svg', hero);


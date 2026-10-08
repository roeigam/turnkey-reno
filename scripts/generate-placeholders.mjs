/**
 * Generates placeholder images:
 *   src/assets/hero/hero.svg          hero background (blueprint-style house elevation)
 *   src/assets/projects/project-N.svg gallery placeholders
 *   public/og-image.png               1200×630 social preview (no text; replace before launch)
 *
 * Run: node scripts/generate-placeholders.mjs
 * Safe to re-run; only overwrites the files listed above.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';
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
  <g fill="none" stroke="#f5a524" stroke-opacity=".7" stroke-width="2">
    <path d="M1300 330h900M1300 315v30M2200 315v30"/>
    <path d="M2290 720v480M2275 720h30M2275 1200h30"/>
    <path d="M1360 1260h780M1360 1245v30M2140 1245v30"/>
  </g>
  <g fill="#f5a524" fill-opacity=".85" font-family="${FONT}" font-size="30" font-weight="600" letter-spacing="2">
    <text x="1750" y="312" text-anchor="middle">32'-0"</text>
    <text x="2318" y="970" transform="rotate(90 2318 970)" text-anchor="middle">18'-6"</text>
    <text x="1750" y="1300" text-anchor="middle">FRONT ELEVATION</text>
  </g>
  <text x="2360" y="1370" text-anchor="end" fill="#fff" fill-opacity=".25" font-family="${FONT}" font-size="22" letter-spacing="3">PLACEHOLDER: REPLACE WITH HERO PHOTO</text>
</svg>
`;
write('src/assets/hero/hero.svg', hero);

/* ── Project placeholders ─────────────────────────────────────────────────── */
const projects = [
  ['Kitchen Remodel', '#14243b', '#1f3a5c'],
  ['Bathroom Renovation', '#1c2129', '#2e3642'],
  ['Basement Finishing', '#2a241c', '#46392a'],
  ['Flooring Installation', '#162a2e', '#24454a'],
  ['Interior Remodel', '#1b1f2e', '#2f3550'],
  ['Open Living Space', '#26221f', '#3f3832'],
  ['Walk-in Shower', '#12202c', '#21384d'],
  ['Drywall & Framing', '#22262c', '#3a4049'],
];

projects.forEach(([label, from, to], i) => {
  const n = i + 1;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <!-- PLACEHOLDER project photo. Replace with a real photo and update projects[] in src/data/site.ts -->
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${to}"/><stop offset="1" stop-color="${from}"/>
    </linearGradient>
    ${grid('g', 40, 0.03)}
  </defs>
  <rect width="1600" height="1200" fill="url(#bg)"/>
  <rect width="1600" height="1200" fill="url(#g)"/>
  <g fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="3">
    <rect x="460" y="330" width="680" height="480"/>
    <path d="M0 0l460 330M1600 0l-460 330M0 1200l460-390M1600 1200l-460-390"/>
    <path d="M300 1200l280-390M650 1200l140-390M950 1200l-140-390M1300 1200l-280-390"/>
  </g>
  <!-- ${label.replace(/&/g, 'and')} -->
  <path d="M740 520h120" stroke="#f5a524" stroke-width="4"/>
  <text x="800" y="590" text-anchor="middle" fill="#f5a524" font-family="${FONT}" font-size="40" font-weight="600" letter-spacing="8">PROJECT ${String(n).padStart(2, '0')}</text>
  <text x="800" y="650" text-anchor="middle" fill="#fff" fill-opacity=".5" font-family="${FONT}" font-size="30" letter-spacing="5">PLACEHOLDER IMAGE</text>
</svg>
`;
  write(`src/assets/projects/project-${n}.svg`, svg);
});

/* ── OG image (PNG, encoded by hand so no image library is needed) ─────────── */
function png(width, height, pixel) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 3 + 1);
    raw[row] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixel(x, y);
      raw.set([r, g, b], row + 1 + x * 3);
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.set([8, 2, 0, 0, 0], 8); // 8-bit RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const NAVY = [7, 14, 26], LINE = [20, 34, 56], MAJOR = [30, 48, 76], AMBER = [245, 165, 36], INK = [11, 22, 38];
// Simple geometry: grid background, amber tile with roof + "TR" strokes, amber base bar.
const inRect = (x, y, x0, y0, w, h) => x >= x0 && x < x0 + w && y >= y0 && y < y0 + h;
const nearSeg = (x, y, ax, ay, bx, by, t) => {
  const dx = bx - ax, dy = by - ay;
  const k = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (ax + k * dx), y - (ay + k * dy)) <= t;
};
// Mark: 240px tile at (480,160); scale 5 from the 48px logo mark.
const M = (v) => v * 5;
const mx = 480, my = 160, s = 8.75;
const markStrokes = [
  [10, 20.5, 24, 9.5], [24, 9.5, 38, 20.5],
  [10, 26.25, 22, 26.25], [16, 26.25, 16, 38.5],
  [26.75, 26.25, 26.75, 38.5], [26.75, 26.25, 33, 26.25], [26.75, 33.75, 33, 33.75], [31.5, 33.75, 36.5, 38.5],
];
const og = png(1200, 630, (x, y) => {
  if (inRect(x, y, mx, my, 240, 240)) {
    const lx = x - mx, ly = y - my;
    // R bowl (half circle on the right)
    const bowl = Math.abs(Math.hypot(lx - M(33), ly - M(30)) - M(3.75)) <= s && lx >= M(33);
    if (bowl || markStrokes.some(([a, b, c, d]) => nearSeg(lx, ly, M(a), M(b), M(c), M(d), s))) return INK;
    return AMBER;
  }
  if (y >= 600) return AMBER;
  if (x % 150 === 0 || y % 150 === 0) return MAJOR;
  if (x % 30 === 0 || y % 30 === 0) return LINE;
  return NAVY;
});
write('public/og-image.png', og);

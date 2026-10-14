/**
 * Builds the Turnkey Reno logo system from code.
 *
 * Geometry was measured from the client's original artwork
 * (src/assets/brand/logo-original-dark.jpeg, 1536×1024 px). Coordinates below are
 * in that pixel space, so the vector recreation lines up 1:1 with the original.
 * Text is Montserrat, converted to outlined paths so the SVGs render identically
 * everywhere (inside <img>, OG renderers, etc.) with no font loading.
 *
 * Outputs:
 *   src/assets/brand/logo-full-{dark,light}.svg     full logo with tagline
 *   src/assets/brand/logo-compact-{dark,light}.svg  no tagline
 *   src/assets/brand/logo-lockup-{dark,light}.svg   one-line horizontal lockup (mark + TURNKEY RENO)
 *   src/assets/brand/logo-icon-{dark,light}.svg     roof + chimney + window
 *   src/assets/brand/logo-mark-{dark,light}.svg     roof + window + key-T (lockup mark on its own)
 *   public/favicon.svg, public/favicon-32.png, public/apple-touch-icon.png
 *   public/logo.png (for schema.org), public/og-image.png
 *
 * Run: node scripts/build-logo.mjs
 * "dark" = for dark backgrounds (white text); "light" = for light backgrounds (dark text).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp'; // already installed as an Astro dependency

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const write = (rel, data) => {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  console.log('wrote', rel);
};
const loadFont = (weight) => {
  const buf = readFileSync(join(root, `node_modules/@fontsource/montserrat/files/montserrat-latin-${weight}-normal.woff`));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};

/* ── Brand constants ──────────────────────────────────────────────────────── */
// Chosen by pixel overlap (IoU) against the original: URNKEY 800 → 0.95, tagline 500 → 0.79,
// RENO 500 stretched per glyph → 0.75 (the original RENO is wider than stock Montserrat).
const WEIGHTS = { name: 800, reno: 500, tagline: 500 };
const METALLIC_FULL_LOGO = true; // full logo uses a subtle metallic gradient; set false for solid gold

const COLORS = {
  dark: { text: '#ffffff', gold: '#dba84f', metal: ['#c79641', '#f3c874', '#d9a64e', '#efc26c', '#c49343'] },
  light: { text: '#141414', gold: '#c18e38', metal: ['#a8741f', '#d8aa58', '#bf8b34', '#d6a752', '#ad7823'] },
};
const NAVY = '#070e1a';

const fonts = Object.fromEntries(Object.entries(WEIGHTS).map(([k, w]) => [k, loadFont(w)]));
// The one-line lockup is used small (header), so its RENO is a touch heavier for legibility.
const lockupRenoFont = loadFont(600);
const capUnits = (font) => font.tables.os2.sCapHeight;
/** Serialize a glyph path with rounded coordinates (opentype.js prints tiny floats like 1e-16 as NaN). */
const pathData = (path) => {
  const r = (v) => Math.round(v * 100) / 100 + 0;
  for (const c of path.commands) for (const k of ["x", "y", "x1", "y1", "x2", "y2"]) if (k in c) c[k] = r(c[k]);
  return path.toPathData(2);
};

/**
 * Place each glyph so its ink starts exactly at the measured left edge.
 * With `rights`, each glyph is also stretched horizontally to the measured width
 * (the original's "RENO" is a widened geometric sans).
 */
function placeGlyphs(font, chars, lefts, capTop, baseline, rights) {
  const size = ((baseline - capTop) / capUnits(font)) * font.unitsPerEm;
  const k = size / font.unitsPerEm;
  return [...chars]
    .map((ch, i) => {
      const g = font.charToGlyph(ch);
      const bb = g.getBoundingBox();
      const path = g.getPath(0, baseline, size);
      const sx = rights ? (rights[i] - lefts[i] + 1) / ((bb.x2 - bb.x1) * k) : 1;
      const tx = (x) => lefts[i] + (x - bb.x1 * k) * sx;
      for (const c of path.commands) {
        if ('x' in c) c.x = tx(c.x);
        if ('x1' in c) c.x1 = tx(c.x1);
        if ('x2' in c) c.x2 = tx(c.x2);
      }
      return pathData(path);
    })
    .join('');
}

/** Lay out a string with tracking; returns path data and ink width. */
function setText(font, str, x, baseline, cap, tracking = 0) {
  const size = (cap / capUnits(font)) * font.unitsPerEm;
  const k = size / font.unitsPerEm;
  let cx = x;
  let d = '';
  let first = true;
  let inkRight = x;
  for (const ch of str) {
    const g = font.charToGlyph(ch);
    if (ch !== ' ') {
      const bb = g.getBoundingBox();
      if (first) {
        cx -= bb.x1 * k; // align ink (not side bearing) to x
        first = false;
      }
      d += pathData(g.getPath(cx, baseline, size));
      inkRight = cx + bb.x2 * k;
    }
    cx += g.advanceWidth * k + tracking;
  }
  return { d, width: inkRight - x };
}

/* ── Geometry (original pixel space) ──────────────────────────────────────── */
const roofPath =
  'M152 362 L437 326 L766 158 L905 230 L905 192 L961 192 L961 260 L1095 326 L1360 362 L1077 362 L766 197 L449 362 Z';
const windowRects = [
  [714, 263], [770, 263],
  [714, 318], [770, 318],
].map(([x, y]) => `<rect x="${x}" y="${y}" width="44" height="43"/>`).join('');

// Key-shaped "T": slanted crossbar, stem with 4 notches on the left, chevron tip.
// Notches climb from y=650 to y=566 in four 21px steps, each cutting 12px into the stem.
const keyT = (() => {
  const notches = [];
  for (let y = 650; y > 566; y -= 21) notches.push(`L219 ${y - 10.5} L207 ${y - 21}`);
  return `M150 381 L336 381 L336 424 L266 424 L266 666 L237 694 L207 666 L207 650 ${notches.join(' ')} L207 424 L121 424 Z`;
})();

// Measured glyph left edges and cap lines.
const NAME = { chars: 'URNKEY', lefts: [349, 535, 714, 908, 1094, 1239], top: 398, base: 571 };
const RENO = { chars: 'RENO', lefts: [500, 653, 793, 943], rights: [601, 743, 896, 1061], top: 612, base: 710 };
const TAG = {
  chars: 'YOUSTARTWEFINISH',
  lefts: [300, 355, 420, 507, 558, 606, 670, 723, 805, 888, 970, 1021, 1052, 1113, 1143, 1198],
  top: 755,
  base: 797,
};
const renoLines = `<rect x="300" y="649" width="158" height="15"/><rect x="1096" y="649" width="158" height="15"/>`;
const tagLines = `<rect x="125" y="771" width="131" height="8"/><rect x="1279" y="771" width="131" height="8"/>`;

const namePath = placeGlyphs(fonts.name, NAME.chars, NAME.lefts, NAME.top, NAME.base);
const renoPath = placeGlyphs(fonts.reno, RENO.chars, RENO.lefts, RENO.top, RENO.base, RENO.rights);
const tagPath = placeGlyphs(fonts.tagline, TAG.chars, TAG.lefts, TAG.top, TAG.base);

const metalGradient = (tone, id = 'gold') => {
  const s = COLORS[tone].metal;
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="121" y1="158" x2="1421" y2="798">${s
    .map((c, i) => `<stop offset="${(i / (s.length - 1)).toFixed(2)}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;
};

const svg = (viewBox, body, { title = 'Turnkey Reno', defs = '' } = {}) => {
  const [, , w, h] = viewBox.split(' ').map(Number);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${Math.round(w)}" height="${Math.round(h)}" role="img" aria-label="${title}">
<title>${title}</title>${defs ? `<defs>${defs}</defs>` : ''}
${body}
</svg>
`;
};

/* ── Full + compact ───────────────────────────────────────────────────────── */
function fullLogo(tone, { tagline = true, metallic = METALLIC_FULL_LOGO } = {}) {
  const c = COLORS[tone];
  const gold = metallic ? 'url(#gold)' : c.gold;
  const body = `<g fill="${gold}"><path d="${roofPath}"/><path d="${keyT}"/><path d="${renoPath}"/>${renoLines}${tagline ? tagLines : ''}</g>
<g fill="${c.text}">${windowRects}<path d="${namePath}"/>${tagline ? `<path d="${tagPath}"/>` : ''}</g>`;
  const viewBox = tagline ? '109 146 1324 664' : '109 146 1324 578';
  return svg(viewBox, body, { title: tagline ? 'Turnkey Reno: You start, we finish' : 'Turnkey Reno', defs: metallic ? metalGradient(tone) : '' });
}

/* ── Icon: roof + chimney + 4-pane window (100×100) ───────────────────────── */
function iconBody(tone, { tile = false } = {}) {
  const c = COLORS[tone];
  // Roof band: outer apex (50,14), slope 0.72; vertical band thickness 11.
  const roof = 'M3 48 L50 14 L67 26.3 L67 15 L78 15 L78 34.3 L97 48 L97 59 L50 25 L3 59 Z';
  const panes = [
    [37, 40], [51.5, 40],
    [37, 54.5], [51.5, 54.5],
  ].map(([x, y]) => `<rect x="${x}" y="${y}" width="11.5" height="11.5"/>`).join('');
  const t = tile ? `<rect width="100" height="100" rx="18" fill="${NAVY}"/>` : '';
  // Shift so the composition is optically centered in the square.
  return `${t}<g transform="translate(0 12)"><path fill="${c.gold}" d="${roof}"/><g fill="${tile ? '#ffffff' : c.text}">${panes}</g></g>`;
}
const iconSvg = (tone) => svg('0 0 100 100', iconBody(tone), { title: 'Turnkey Reno' });

/* ── Mark: roof + window + key-T, for the horizontal lockup (100×110) ─────── */
function markBody(tone) {
  const c = COLORS[tone];
  const roof = 'M2 40 L50 6 L66 17.3 L66 8 L76 8 L76 24.4 L98 40 L98 49 L50 15 L2 49 Z';
  const panes = [
    [43.5, 25], [50.8, 25],
    [43.5, 32.3], [50.8, 32.3],
  ].map(([x, y]) => `<rect x="${x}" y="${y}" width="5.7" height="5.7"/>`).join('');
  // Key-T from the original, scaled and centred under the roof.
  const s = 0.19;
  const tx = 50 - 236.5 * s;
  const ty = 52 - 381 * s;
  return `<g fill="${c.gold}"><path d="${roof}"/><path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s})" d="${keyT}"/></g><g fill="${c.text}">${panes}</g>`;
}
const markSvg = (tone) => svg('0 0 100 112', markBody(tone), { title: 'Turnkey Reno' });

/* ── Horizontal lockup: mark + "TURNKEY RENO" on one line ─────────────────── */
function lockupSvg(tone) {
  const c = COLORS[tone];
  const cap = 34;
  const baseline = 79; // vertically centred against the mark
  const x0 = 120;
  const name = setText(fonts.name, 'TURNKEY', x0, baseline, cap, 1.5);
  const renoX = x0 + name.width + 16;
  const reno = setText(lockupRenoFont, 'RENO', renoX, baseline, cap, 6);
  const width = renoX + reno.width + 4;
  const body = `${markBody(tone)}<path fill="${c.text}" d="${name.d}"/><path fill="${c.gold}" d="${reno.d}"/>`;
  return svg(`0 0 ${width.toFixed(1)} 112`, body, { title: 'Turnkey Reno' });
}

/* ── Write SVGs ───────────────────────────────────────────────────────────── */
for (const tone of ['dark', 'light']) {
  write(`src/assets/brand/logo-full-${tone}.svg`, fullLogo(tone));
  write(`src/assets/brand/logo-compact-${tone}.svg`, fullLogo(tone, { tagline: false, metallic: false }));
  write(`src/assets/brand/logo-lockup-${tone}.svg`, lockupSvg(tone));
  write(`src/assets/brand/logo-icon-${tone}.svg`, iconSvg(tone));
  write(`src/assets/brand/logo-mark-${tone}.svg`, markSvg(tone));
}

const favicon = svg('0 0 100 100', iconBody('dark', { tile: true }), { title: 'Turnkey Reno' });
write('public/favicon.svg', favicon);

/* ── Raster outputs ───────────────────────────────────────────────────────── */
const png = async (svgText, width, height, rel) => {
  const buf = await sharp(Buffer.from(svgText), { density: 300 }).resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  write(rel, buf);
};
await png(favicon, 32, 32, 'public/favicon-32.png');
// iOS applies its own rounded mask, so the touch icon is a full-bleed square.
await png(svg('0 0 100 100', `<rect width="100" height="100" fill="${NAVY}"/><g transform="translate(14 14) scale(.72)">${iconBody('dark')}</g>`), 180, 180, 'public/apple-touch-icon.png');
await png(fullLogo('light'), 600, null, 'public/logo.png');

// OG image: navy, blueprint grid, full logo centred, gold base bar.
const full = fullLogo('dark').replace(/<svg [^>]*>/, '<svg x="300" y="95" width="600" height="301" viewBox="109 146 1324 664" xmlns="http://www.w3.org/2000/svg">');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <pattern id="minor" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#fff" stroke-opacity=".045"/></pattern>
  <pattern id="major" width="150" height="150" patternUnits="userSpaceOnUse"><path d="M150 0H0V150" fill="none" stroke="#fff" stroke-opacity=".07"/></pattern>
  <radialGradient id="glow" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#16263d"/><stop offset="1" stop-color="${NAVY}"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#glow)"/>
<rect width="1200" height="630" fill="url(#minor)"/>
<rect width="1200" height="630" fill="url(#major)"/>
${full}
<path d="${setText(fonts.tagline, 'HOME RENOVATION  ·  NORTHEAST OHIO', 0, 0, 18, 5).d}" fill="#cbd5e1" transform="translate(${(600 - setText(fonts.tagline, 'HOME RENOVATION  ·  NORTHEAST OHIO', 0, 0, 18, 5).width / 2).toFixed(1)} 470)"/>
<rect x="0" y="606" width="1200" height="24" fill="${COLORS.dark.gold}"/>
</svg>`;
await png(og, 1200, 630, 'public/og-image.png');

/**
 * Extracts clean project photos from the client's social-media composites and
 * the roof reel in src/assets/projects/source/ (reference only; excluded from the build).
 *
 * Crop only: no resizing, sharpening or other edits, except the sunroom before photo, which is
 * uniformly downscaled to match the after photo's scale (see below). Crops are re-encoded as
 * JPEG quality 95 with 4:4:4 chroma; Astro then resizes/converts them at build time.
 * Every box below was measured on the source pixels; the comments say what each one avoids.
 *
 * Run: node scripts/extract-project-photos.mjs
 * Requires: sharp (ships with Astro), and ffmpeg-static for the video frames. ffmpeg-static is an
 * optionalDependency: if its binary download failed during npm install, run `npm install ffmpeg-static`.
 * The video itself (roof-video.mp4) is git-ignored; it must be present locally.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => join(root, 'src/assets/projects/source', f);
const out = (p) => join(root, 'src/assets', p);

const save = async (input, box, target) => {
  mkdirSync(dirname(out(target)), { recursive: true });
  const info = await sharp(input)
    .extract(box)
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(out(target));
  console.log(`${target.padEnd(38)} ${info.width}×${info.height}`);
};

/* ── Attic bedroom: attic-bedroom-wide.jpeg (1536×1024) ─────────────────────
 * Panels: before x0–761, after x768–1536 (divider x762–767), y≈206–898 (gold border from y899).
 * BEFORE/AFTER tags end at y291, so crops start at y300. Both boxes are the same size so the
 * comparison slider lines up. The square version is not used (smaller panels: ~533×488). */
await save(src('attic-bedroom-wide.jpeg'), { left: 0, top: 300, width: 756, height: 596 }, 'projects/attic-bedroom/before-1.jpg');
await save(src('attic-bedroom-wide.jpeg'), { left: 776, top: 300, width: 756, height: 596 }, 'projects/attic-bedroom/after-1.jpg');

/* ── Concrete walkway: concrete-walkway.jpeg (1399×980) ─────────────────────
 * Black frame: x<40, x>1358, y<40, y≥940; divider x669–684. Tags end at y≈127, crops start at y134. */
await save(src('concrete-walkway.jpeg'), { left: 40, top: 134, width: 629, height: 806 }, 'projects/concrete-walkway/before-1.jpg');
await save(src('concrete-walkway.jpeg'), { left: 685, top: 134, width: 674, height: 806 }, 'projects/concrete-walkway/after-1.jpg');

/* ── Basement foundation: basement-foundation.jpeg (1536×1024) ──────────────
 * Diagonal gold split runs from x≈828 at y200 to x≈666 at y900.
 * Before: below the logo box (ends y233), above the BEFORE tag (starts y802), left of the split at y796 (x≈690).
 * After: below the header (ends y186), above the AFTER tag's gold top line (from y≈797), right of the split at y194 (x≈833).
 * Stored but not shown: written to src/assets/_disabled/ (excluded from the build, see site.ts). */
await save(src('basement-foundation.jpeg'), { left: 0, top: 240, width: 684, height: 556 }, '_disabled/projects/basement-foundation/before-1.jpg');
await save(src('basement-foundation.jpeg'), { left: 840, top: 194, width: 696, height: 600 }, '_disabled/projects/basement-foundation/after-1.jpg');

/* ── Sunroom: sunroom-before.png (1672×941) and sunroom-after.png (1448×1086) ──
 * Clean photos (no logos or labels), shot from about the same spot; the after photo uses an
 * ultra-wide lens, so the room appears smaller in it. For the comparison slider the two are
 * aligned by a uniform scale and a crop only: no warping, lens correction or rotation.
 * The after photo was also tilted slightly upward, so verticals near its edges lean ~3°; that
 * residual can't be removed without warping and is left as is.
 *
 * Landmarks [before x, y] → [after x, y], measured on 2–3× zoomed source crops. The room corner and
 * the door get two points each, so the fit weighs the two structures the slider handle crosses
 * equally. What remains is mostly vertical (camera height/tilt differ): about ±30 px, split evenly
 * between the corner (before sits higher) and the door (before sits lower). Horizontal error ≤ 15 px.
 * Hinge positions (before → after: y287→312, y467→450, y660→580) were used to check the scale. */
const sunroomLandmarks = [
  [[955, 513], [850, 533]], // room corner where the window sill meets the wall
  [[955, 600], [851, 602]], // room corner at the floor
  [[1459, 232], [1199, 272]], // door slab, top of the hinge edge
  [[1455, 735], [1220, 630]], // door slab, bottom of the hinge edge
];
// Least-squares uniform scale + offset mapping before → after coordinates.
const mean = (pts) => pts.reduce(([x, y], [px, py]) => [x + px / pts.length, y + py / pts.length], [0, 0]);
const [bx, by] = mean(sunroomLandmarks.map(([b]) => b));
const [ax, ay] = mean(sunroomLandmarks.map(([, a]) => a));
let num = 0;
let den = 0;
for (const [[x1, y1], [x2, y2]] of sunroomLandmarks) {
  num += (x1 - bx) * (x2 - ax) + (y1 - by) * (y2 - ay);
  den += (x1 - bx) ** 2 + (y1 - by) ** 2;
}
const scale = num / den;
const offset = [ax - scale * bx, ay - scale * by];
// The whole before frame, scaled, lands inside the after photo: crop the after photo to it and
// downscale the before photo to exactly the same size (never upscaled).
const sunroomBox = {
  left: Math.round(offset[0]),
  top: Math.round(offset[1]),
  width: Math.round(1672 * scale),
  height: Math.round(941 * scale),
};
const residuals = sunroomLandmarks.map(([[x1, y1], [x2, y2]]) => Math.hypot(scale * x1 + offset[0] - x2, scale * y1 + offset[1] - y2));
console.log(`sunroom fit: scale ${scale.toFixed(4)}, after crop ${JSON.stringify(sunroomBox)}, landmark error ${residuals.map((r) => r.toFixed(1)).join('/')} px`);
{
  const target = 'projects/sunroom/before-1.jpg';
  mkdirSync(dirname(out(target)), { recursive: true });
  const info = await sharp(src('sunroom-before.png'))
    .resize(sunroomBox.width, sunroomBox.height, { fit: 'fill', kernel: 'lanczos3' }) // uniform: aspect differs by < 0.1%
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(out(target));
  console.log(`${target.padEnd(38)} ${info.width}×${info.height}`);
}
await save(src('sunroom-after.png'), sunroomBox, 'projects/sunroom/after-1.jpg');
// Hero background: the full after frame, uncropped (the hero picks its focal point in CSS).
await save(src('sunroom-after.png'), { left: 0, top: 0, width: 1448, height: 1086 }, 'hero/sunroom-after.jpg');

/* ── Roof replacement: frames from roof-video.mp4 (1080×1920, 30 fps, 21 s) ──
 * Frames chosen by content, then the sharpest frame (Laplacian variance) within ±8 frames.
 * The logo badge (top left) and BEFORE/AFTER label (top right) end at y≈225, so crops start at y240. */
const roofFrames = [
  [88, 'projects/roof-replacement/before-1.jpg'], //  2.93 s: worn ridge cap with moss
  [278, 'projects/roof-replacement/before-2.jpg'], // 9.27 s: rotted shingle edge at the gutter
  [292, 'projects/roof-replacement/before-3.jpg'], // 9.73 s: broken shingle with a gap
  [368, 'projects/roof-replacement/after-1.jpg'], // 12.27 s: new shingles, blue sky
  [472, 'projects/roof-replacement/after-2.jpg'], // 15.73 s: new shingles, neighboring houses
];
const ffmpeg = await import('ffmpeg-static').then((m) => m.default).catch(() => null);
if (!ffmpeg || !existsSync(ffmpeg)) {
  console.error('ffmpeg-static is missing (optional dependency). Run: npm install ffmpeg-static');
  process.exit(1);
}
if (!existsSync(src('roof-video.mp4'))) {
  console.error('roof-video.mp4 not found in src/assets/projects/source/ (videos are kept out of git).');
  process.exit(1);
}
const tmp = mkdtempSync(join(tmpdir(), 'roof-'));
try {
  for (const [n, target] of roofFrames) {
    const frame = join(tmp, `n${n}.png`); // lossless intermediate
    execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', src('roof-video.mp4'),
      '-vf', `select='eq(n\\,${n})'`, '-vsync', '0', '-frames:v', '1', frame]);
    await save(frame, { left: 0, top: 240, width: 1080, height: 1680 }, target);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

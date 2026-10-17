/**
 * Extracts clean project photos from the client's social-media composites and
 * the roof reel in src/assets/projects/source/ (reference only; excluded from the build).
 *
 * Crop only: no resizing, sharpening or other edits. Crops are re-encoded as
 * JPEG quality 95 with 4:4:4 chroma; Astro then resizes/converts them at build time.
 * Every box below was measured on the source pixels; the comments say what each one avoids.
 *
 * Run: node scripts/extract-project-photos.mjs
 * Requires: sharp (ships with Astro), ffmpeg-static (devDependency) for the video frames.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => join(root, 'src/assets/projects/source', f);
const out = (p) => join(root, 'src/assets/projects', p);

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
await save(src('attic-bedroom-wide.jpeg'), { left: 0, top: 300, width: 756, height: 596 }, 'attic-bedroom/before-1.jpg');
await save(src('attic-bedroom-wide.jpeg'), { left: 776, top: 300, width: 756, height: 596 }, 'attic-bedroom/after-1.jpg');

/* ── Concrete walkway: concrete-walkway.jpeg (1399×980) ─────────────────────
 * Black frame: x<40, x>1358, y<40, y≥940; divider x669–684. Tags end at y≈127, crops start at y134. */
await save(src('concrete-walkway.jpeg'), { left: 40, top: 134, width: 629, height: 806 }, 'concrete-walkway/before-1.jpg');
await save(src('concrete-walkway.jpeg'), { left: 685, top: 134, width: 674, height: 806 }, 'concrete-walkway/after-1.jpg');

/* ── Basement foundation: basement-foundation.jpeg (1536×1024) ──────────────
 * Diagonal gold split runs from x≈828 at y200 to x≈666 at y900.
 * Before: below the logo box (ends y233), above the BEFORE tag (starts y802), left of the split at y796 (x≈690).
 * After: below the header (ends y186), above the AFTER tag's gold top line (from y≈797), right of the split at y194 (x≈833).
 * Stored but not shown as a project (see site.ts). */
await save(src('basement-foundation.jpeg'), { left: 0, top: 240, width: 684, height: 556 }, 'basement-foundation/before-1.jpg');
await save(src('basement-foundation.jpeg'), { left: 840, top: 194, width: 696, height: 600 }, 'basement-foundation/after-1.jpg');

/* ── Roof replacement: frames from roof-video.mp4 (1080×1920, 30 fps, 21 s) ──
 * Frames chosen by content, then the sharpest frame (Laplacian variance) within ±8 frames.
 * The logo badge (top left) and BEFORE/AFTER label (top right) end at y≈225, so crops start at y240. */
const roofFrames = [
  [88, 'roof-replacement/before-1.jpg'], //  2.93 s: worn ridge cap with moss
  [278, 'roof-replacement/before-2.jpg'], // 9.27 s: rotted shingle edge at the gutter
  [292, 'roof-replacement/before-3.jpg'], // 9.73 s: broken shingle with a gap
  [368, 'roof-replacement/after-1.jpg'], // 12.27 s: new shingles, blue sky
  [472, 'roof-replacement/after-2.jpg'], // 15.73 s: new shingles, neighboring houses
];
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

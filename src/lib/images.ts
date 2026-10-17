import type { ImageMetadata } from 'astro';

/**
 * Every image in src/assets/, keyed by its path relative to that folder.
 * This lets src/data/site.ts reference images by plain string paths, so swapping
 * a placeholder SVG for a real JPG/PNG is a content-only change.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  [
    '/src/assets/**/*.{jpg,jpeg,png,webp,avif,gif,svg,JPG,JPEG,PNG,WEBP,AVIF}',
    // Client's original logo files are reference material only; keep them out of the build.
    '!/src/assets/brand/*-original*',
    // Client's social-media composites and reels: crop sources only (see scripts/extract-project-photos.mjs).
    '!/src/assets/projects/source/**',
    // Assets for disabled content (e.g. projects with enabled: false). Every globbed image is
    // bundled into dist/ even if unused, so these are excluded to keep them from shipping.
    '!/src/assets/_disabled/**',
  ],
  { eager: true },
);

const assets = new Map(
  Object.entries(modules).map(([key, mod]) => [key.replace('/src/assets/', ''), mod.default]),
);

export function asset(path: string): ImageMetadata {
  const key = path.replace(/^\/?(src\/)?assets\//, '').replace(/^\//, '');
  const image = assets.get(key);
  if (!image && key.startsWith('_disabled/')) {
    throw new Error(
      `Image "${path}" is in src/assets/_disabled/, which is excluded from the build.\n` +
        `To show it, move the file out of _disabled/ (e.g. to src/assets/projects/...) and update the path in src/data/site.ts.`,
    );
  }
  if (!image) {
    throw new Error(
      `Image "${path}" not found in src/assets/. Check the path in src/data/site.ts.\n` +
        `Available images:\n  ${[...assets.keys()].join('\n  ')}`,
    );
  }
  return image;
}

export const isSvg = (image: ImageMetadata) => image.format === 'svg';

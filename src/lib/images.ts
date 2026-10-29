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
    // Material that must never ship, e.g. photos of a different company's projects (legal; see the
    // README in that folder). Every globbed image is bundled into dist/ even if unused, so the
    // whole folder is excluded.
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
      `Image "${path}" is in src/assets/_disabled/, which is excluded from the build and must not be published.\n` +
        `Use a different image (see src/assets/_disabled/README.md).`,
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

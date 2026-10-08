import type { ImageMetadata } from 'astro';

/**
 * Every image in src/assets/, keyed by its path relative to that folder.
 * This lets src/data/site.ts reference images by plain string paths, so swapping
 * a placeholder SVG for a real JPG/PNG is a content-only change.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,avif,gif,svg,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

const assets = new Map(
  Object.entries(modules).map(([key, mod]) => [key.replace('/src/assets/', ''), mod.default]),
);

export function asset(path: string): ImageMetadata {
  const key = path.replace(/^\/?(src\/)?assets\//, '').replace(/^\//, '');
  const image = assets.get(key);
  if (!image) {
    throw new Error(
      `Image "${path}" not found in src/assets/. Check the path in src/data/site.ts.\n` +
        `Available images:\n  ${[...assets.keys()].join('\n  ')}`,
    );
  }
  return image;
}

export const isSvg = (image: ImageMetadata) => image.format === 'svg';

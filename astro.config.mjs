// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { company } from './src/data/site.ts';

// https://astro.build/config
export default defineConfig({
  // Canonical / Open Graph URLs are built from this. Set the real domain in src/data/site.ts.
  site: company.siteUrl,
  output: 'static',
  // privacy.html instead of privacy/index.html: Netlify serves /privacy directly (no redirect to /privacy/).
  build: { format: 'file' },
  vite: {
    plugins: [tailwindcss()],
  },
});

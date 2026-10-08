import type { APIRoute } from 'astro';
import { company, settings } from '../data/site';

// Mirrors settings.noindex in src/data/site.ts. Flip that flag at launch.
export const GET: APIRoute = () => {
  const body = settings.noindex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\n# Sitemap: ${company.siteUrl}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

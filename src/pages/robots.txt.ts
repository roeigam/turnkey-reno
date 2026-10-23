import type { APIRoute } from 'astro';
import { company, settings } from '../data/site';

// Follows settings.noindex in src/data/site.ts (false since launch).
export const GET: APIRoute = () => {
  const body = settings.noindex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${company.siteUrl}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

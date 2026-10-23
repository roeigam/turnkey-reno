import type { APIRoute } from 'astro';
import { company } from '../data/site';

/** Public pages. Add new pages here so search engines find them. */
const pages = ['/', '/privacy'];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10); // build date
  const urls = pages
    .map((path) => `  <url>\n    <loc>${new URL(path, company.siteUrl).href}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

# Release Notes: v0.1.0

| Field | Value |
|---|---|
| Version | 0.1.0 |
| Release date | 2026-10-08 |
| Release type | Minor |
| Previous version | None (first release) |
| Git commit | a34541a |
| Git tag | v0.1.0 |
| Environment | Not deployed (local builds only; no Netlify site was live at the time) |
| Status | Pre-launch |

## Summary
This is the first complete version of the Turnkey Reno website: a single page built to get homeowners and investors to call or request a free estimate. It includes every planned section: header, hero, trust points, services, about, project gallery, tips, estimate form and footer. It works on phones, with call and estimate buttons always in reach. Photos, service descriptions, tips and the logo are temporary placeholders until the final content arrives.

## Added
- Project: Astro 7 + Tailwind CSS 4 + TypeScript (strict), fully static output; `netlify.toml` build config; `.gitignore`.
- Content: `src/data/site.ts` holds all business content (company, contact, services, about, projects, tips, form copy, SEO) plus the `settings.showPlaceholderBadges` and `settings.noindex` switches.
- Header (`Header.astro`): sticky navy bar with anchor nav, active-section highlight, click-to-call phone and "Free Estimate" button; hamburger menu below 1024px (closes on link click, outside click and Esc).
- Mobile action bar (`MobileActionBar.astro`): fixed "Call | Free Estimate" bar below 1024px.
- Hero (`Hero.astro`): "You start, we finish." headline, subheading, "Get a Free Estimate" and "Call Now" buttons, placeholder background (`src/assets/hero/hero.svg`).
- Trust strip (`TrustStrip.astro`): Free Estimates, Honest Pricing, Quality Materials, Homeowners & Investors.
- Services (`Services.astro`): 6 service cards with icons in a staggered two-column layout.
- About / Why Choose Us (`About.astro`): client-supplied text (verbatim) plus four value points.
- Projects (`Projects.astro`): portfolio grid with 8 placeholder images and a lightbox (`<dialog>`, arrow keys, Esc, swipe, focus returns to the thumbnail).
- Tips corner (`Tips.astro`): 3 tip panels.
- Free estimate form (`EstimateForm.astro`): name, phone, email, zip, service dropdown, message; client-side validation with inline errors; honeypot spam field; ready for Web3Forms or Formspree via `formConfig`; shows a "not connected yet" notice while no form service is set.
- Footer (`Footer.astro`): logo, quick links, phone (tel: link), address, copyright year.
- SEO (`BaseLayout.astro`): title, description, canonical, Open Graph and Twitter tags, `HomeAndConstructionBusiness` JSON-LD with address and phone.
- `src/pages/robots.txt.ts`: robots.txt generated from `settings.noindex`.
- Images (`src/lib/images.ts`): images referenced from `site.ts` by path; JPG/PNG are resized and converted to WebP at build time.
- Placeholder assets: "TR" logo, favicon, OG image, hero and project images; `scripts/generate-placeholders.mjs` regenerates them.
- Motion: scroll fade-in and hero entrance, disabled under `prefers-reduced-motion`.
- `README.md`: content editing, images, form hookup, deployment and a "Before launch" checklist.

## Content status
- Approved and in place: About text (client-supplied, verbatim), slogan, phone (440) 337-5140, address as provided.
- Placeholder (waiting on client): logo, hero photo, 8 project photos, 6 service descriptions, 3 tips, business email, form service account.
- Not yet set: production domain (`siteUrl` is `https://example.com`), privacy policy page.
- To confirm with client: the address is in Canton, OH while the copy says "Cleveland-based".

## Verification
- `npx astro check`: 0 errors, 0 warnings (one type error in `Header.astro` was found and fixed before release).
- `npm run build`: pass, 1 page built.
- Automated browser checks (Playwright driving Microsoft Edge) at 1440×900 desktop and 390×844 mobile:
  - mobile menu opens, closes, and closes on Esc;
  - lightbox opens, ArrowRight advances (counter showed "4 / 8"), Esc closes, focus returns to the thumbnail;
  - estimate form: an empty submit flagged all 5 required fields and focused "Full name"; a valid submit showed the "not connected" notice;
  - no horizontal overflow at 390px wide (0px);
  - no console or page errors.
- Image pipeline: a test PNG in the gallery was converted to WebP at 480px, 800px and the lightbox size. The test file was then removed.
- Built HTML: `<meta name="robots" content="noindex, nofollow">` present, `robots.txt` = `Disallow: /`, JSON-LD parses as valid JSON.
- Visual review of every section on desktop and mobile. Two issues were found and fixed before release: an invalid entity in the project-8 placeholder SVG, and a translucent header showing grey over the light page.
- Not checked in this release: color contrast measurements, Lighthouse, real phones, browsers other than Edge.

## Known issues
- Keyboard focus outline (amber `#f5a524`) is about 1.8:1 against the light sections, below the 3:1 WCAG minimum (found later; fixed in 0.2.0).
- The estimate form is not connected to a form service yet (by design until an account is set up).

## Deployment and rollback
Not deployed: no Netlify site was connected for this version. Once Netlify is connected to the GitHub repo, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to the previous tag.

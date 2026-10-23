# Changelog: Turnkey Reno website

**Current version: 0.4.2**

All notable changes to this project are documented in this file, newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (`0.x.y` = pre-launch, `1.0.0` = public launch on the real domain).

## [0.4.2] - 2026-10-23

| Field | Value |
|---|---|
| Release type | Patch |
| Previous version | 0.4.1 |
| Git commit | c1c02f9 |
| Git tag | v0.4.2 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-23) |
| Status | Pre-launch |

### Summary
The estimate section no longer promises a reply within 24 hours; it now simply says we'll get back to you. The estimate form is ready to send requests by email through Web3Forms. It switches on as soon as the access key is added, and until then it still shows the "not connected yet" notice. Once connected, visitors see a thank-you message after sending, and if anything goes wrong their details stay in the form along with the phone number to call instead.

### Changed
- `site.ts` `estimate.text`: "within 24 hours" removed, along with its "CONFIRM WITH CLIENT" comment. It now reads "Send us a few details and we'll get back to you to talk through your project and set up your free estimate."
- `site.ts`: `formConfig` (`action`, `accessKey`, `honeypotName`, `subject`) replaced by `form.web3formsKey`, the single setting for the form backend (empty = not connected).
- `site.ts` `estimate`: new `sendingLabel` ("Sending..."). `successMessage` is now "Thanks! We received your request and will contact you soon." `errorMessage` now includes the phone number via a `{phone}` token.
- `EstimateForm.astro`: with a key set, the form posts JSON to `https://api.web3forms.com/submit` via `fetch` (no page reload), with these fields:
  - readable labels: Name, Phone, Email, Zip code, I am a, Service, Budget, Message (empty optional fields are sent as "Not provided");
  - `subject` "New estimate request: {service} ({zip})";
  - `from_name` "Turnkey Reno website";
  - `replyto` set to the customer's email only when they gave one.
- `EstimateForm.astro`: while sending, the button is disabled and reads "Sending...". On success, a thank-you panel replaces the form and receives focus. On an API error (`success: false`), a non-OK HTTP status or a network failure, the typed values are kept and the error message shows a tap-to-call link.
- `EstimateForm.astro`: honeypot field hard-coded as `botcheck` (Web3Forms' own honeypot). A filled honeypot shows the thank-you panel and sends nothing.
- README: "Connecting the estimate form" rewritten:
  - how to set or change the key;
  - submissions go to the email address the key was created with;
  - the key is public by design, so it isn't an environment variable;
  - what's sent and how the form behaves.
- README launch checklist: the 24-hour item removed; the form item now refers to `form.web3formsKey`.

### Removed
- The 24-hour response promise and its launch-checklist item (the client won't commit to a response time).
- Formspree configuration notes (Web3Forms is the chosen service).

### Content status
- Still placeholder: hero background photo.
- Client to confirm: project cities; whether the basement photos are of his own job; license and insurance before re-enabling the credentials advantage.
- Not yet set: Web3Forms access key (the client is creating it), production domain, privacy policy page.
- Unchanged: basement project disabled, captions without cities, no new services, credentials advantage off.

### Verification
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built.
- Search across the project (excluding older CHANGELOG entries): no remaining "24 hour", "24-hour" or "within 24" text, and no `formConfig` / `honeypotName` references.
- Built `dist/index.html` with an empty key: the form has no `action`, there's no `access_key` input, and the honeypot is named `botcheck`.
- Browser checks (Playwright driving Microsoft Edge against the dev server):
  - **Key empty:** an empty submit flags 4 required fields and focuses Full name. A valid submit shows the "not connected" notice, keeps the values and makes 0 requests.
  - **Key set** (temporary dummy key `TEST-KEY-0000`, reverted before commit; Web3Forms endpoint intercepted, so nothing reached Web3Forms):
    - the form's `action` is the Web3Forms URL and the `access_key` input carries the key;
    - the request is a `POST` with `Content-Type: application/json`, and the payload has the labelled fields, subject "New estimate request: Kitchen Remodeling (44721)", from_name "Turnkey Reno website" and `replyto` = the entered email;
    - with email, budget, "I am a" and message left empty, there's no `replyto` and those fields read "Not provided";
    - while waiting for a response the button is disabled and reads "Sending...";
    - on success the thank-you panel replaces the form and gets focus, with no page navigation;
    - API `success: false`, HTTP 500 with a non-JSON body, and an aborted request each show the error message with a `tel:+14403375140` link, keep all typed values and re-enable the button. A retry after a network failure succeeds without retyping;
    - a filled honeypot sends 0 requests and shows the thank-you panel;
    - screenshots of the sending, error and success states at 1440px, and of error and success at 390px. No horizontal overflow on mobile and no console errors.
- Not checked: a real submission to Web3Forms (no access key yet). Once the key is in, send a test request and confirm it arrives in the client's inbox.

### Known issues
- Without JavaScript, the fallback POST goes to Web3Forms with the raw field names and a generic subject ("New estimate request"), and the visitor leaves the site for Web3Forms' response page. This path was not tested.
- Carried over: unused logo variants are still copied into `dist/_astro/`; the focus outline fades in from the text color (~150ms); the hero "Placeholder" badge sits close to the trust strip on desktop; source photo resolution limits (see 0.4.0).

### Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-23. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.4.1`.

## [0.4.1] - 2026-10-17

| Field | Value |
|---|---|
| Release type | Patch |
| Previous version | 0.4.0 |
| Git commit | 64beb86 |
| Git tag | v0.4.1 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-17) |
| Status | Pre-launch |

### Summary
Nothing visible on the website changed. The basement photos that are on hold are now kept completely out of the published site files, not just hidden from the page. A photo tool used only behind the scenes can also no longer cause a website build to fail if its download is unavailable.

### Changed
- Basement foundation crops moved from `src/assets/projects/basement-foundation/` to `src/assets/_disabled/projects/basement-foundation/`. `src/lib/images.ts` excludes `src/assets/_disabled/**` from the image glob, so these files are no longer emitted to `dist/`.
- `src/lib/images.ts`: `asset()` throws a specific message when an enabled item points into `_disabled/`, explaining how to move the files out.
- `site.ts`: basement project and Basement Finishing card image paths updated to `_disabled/…`, with comments to move the files out before enabling.
- `ffmpeg-static` moved from `devDependencies` to `optionalDependencies`: if its install-time binary download fails, `npm install` / `npm ci` still succeed and the package is skipped. The site build never uses it.
- `scripts/extract-project-photos.mjs`: loads `ffmpeg-static` on demand, with clear errors if it or the git-ignored `roof-video.mp4` is missing; writes the basement crops to `_disabled/`.
- README: `_disabled/` convention for disabled content; deployment note on `ffmpeg-static` (optional, what to do if missing or if npm asks to approve its install script); videos kept out of git.

### Fixed
- The disabled basement crops were emitted to `dist/_astro/` as unreferenced files (known issue in 0.4.0).
- Risk of a failed CI build: `ffmpeg-static`'s install script downloads an ~80 MB binary from GitHub and exits with an error if the download fails. As a devDependency, that failure aborted `npm install`.

### Content status
No content changes. Still placeholder: hero background photo. Client to confirm: project cities; whether the basement photos are of his own job; the 24-hour response promise; license and insurance before re-enabling the credentials advantage. Not yet set: production domain, privacy policy page, form service account.

### Verification
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built.
- `dist/_astro`:
  - 29 raster files, none matching the basement crops' dimensions (684×556, 696×600);
  - no file name containing "basement" or "_disabled";
  - no built text file (HTML/JS/CSS/JSON) mentioning `basement-foundation`.
  - Before this change, two unreferenced basement JPEGs were present.
- `ffmpeg-static` failure simulation (local npm 11.16, Node 24), with the download URL pointed at an unreachable address:
  - minimal package with it as a devDependency: `npm install` exited 1;
  - as an optionalDependency: `npm install` exited 0.
- End-to-end CI simulation:
  - a clean copy of the repository (tracked files only, no `node_modules`) was installed with `CI=true npm ci` and the ffmpeg download blocked;
  - `npm ci` exited 0, with `ffmpeg-static` skipped;
  - `npm run build` then succeeded (1 page built).
- `scripts/extract-project-photos.mjs` re-run: all 11 crops written with identical dimensions, and git showed no content changes (byte-identical output); basement files went to `_disabled/`.
- Not checked: an actual Netlify build (no Netlify site is connected yet; Netlify's default npm for Node 22 is npm 10, while the simulation used npm 11). No site code that affects the page changed, so browser checks were not repeated.

### Known issues
- Carried over: unused logo variants are still copied into `dist/_astro/` (a few KB each, not linked); the focus outline fades in from the text color (~150ms); the hero "Placeholder" badge sits close to the trust strip on desktop; source photo resolution limits (see 0.4.0).

### Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-17. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.4.0`.

## [0.4.0] - 2026-10-17

| Field | Value |
|---|---|
| Release type | Minor |
| Previous version | 0.3.1 |
| Git commit | e8ff551 |
| Git tag | v0.4.0 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-17) |
| Status | Pre-launch |

### Summary
The Projects section now shows real before-and-after photos of Turnkey Reno's work instead of grey placeholders: an attic bedroom makeover, a roof replacement and a concrete walkway. On the attic project, visitors can drag a slider across the photo to compare the room before and after. Clicking a project opens all of its photos, each clearly marked "Before" or "After". The photos were cleanly cropped out of the social-media graphics, so no logos, frames or slogans appear on the site.

### Added
- `scripts/extract-project-photos.mjs`: re-runnable crop script. It only crops (no resizing, sharpening or edits; JPEG quality 95, 4:4:4), every crop box is documented, and it extracts roof frames from the reel with `ffmpeg-static`.
- Clean project photos in `src/assets/projects/<id>/`:
  - attic bedroom: 2 photos (756×596 each);
  - roof replacement: 5 frames (1080×1680 each);
  - concrete walkway: 2 photos (629×806 and 674×806);
  - basement foundation: 2 photos (684×556 and 696×600), stored but not shown.
- `BeforeAfterSlider.astro`: before/after comparison for same-angle photos.
  - Native range input for keyboard use (arrow keys, Home/End), with `aria-valuetext`.
  - Pointer handling for mouse, pen and touch; `touch-action: pan-y` keeps page scrolling on phones.
  - Gold handle with a focus ring when focused by keyboard; HTML "Before"/"After" labels.
  - No animation; the knob's hover scale is off under reduced motion.
- Projects data model in `site.ts`:
  - fields `id`, `title`, `workType`, `city`, `before[]`, `after[]` (with alt text), `matchedPair`, `featured`, `enabled`;
  - `projectCaption()` gives "Work type · City, OH", or just the work type while `city` is empty.
- Lightbox per project: befores then afters, each with a Before/After label chip, the project title, the caption and an "n / N" counter.
- Optional `image` on services, rendered only when the new `settings.showServiceImages` is `true` (default `false`, with the comment "Enable once every service card has a photo, so the grid stays consistent"). Basement Finishing has its image set.
- `ffmpeg-static` devDependency (used only by the crop script).

### Changed
- Projects (`Projects.astro`) rebuilt around real projects:
  - Attic Bedroom Makeover: the featured card, with the slider.
  - Roof Replacement and Concrete Walkway: side-by-side before | after cards.
  - Desktop: featured card on the left (7/12) with the other two stacked on the right. Mobile: one column.
  - Each card has a navy caption bar with a gold rule, the work type, the title and a "Photos (N)" button.
- `src/lib/images.ts`: `src/assets/projects/source/**` excluded from the image glob, like the logo originals.
- `scripts/generate-placeholders.mjs`: now generates only the hero placeholder.
- README: projects format, photo sources and extraction script, service photos flag, and an updated launch checklist (project cities, hero photo, basement confirmation).
- `.gitignore`: client source videos (`src/assets/projects/source/*.mp4`) kept out of git (44 MB + 4 MB).

### Removed
- The 8 placeholder project images (`project-1.svg` to `project-8.svg`), the old single-image `Project` fields (`image`, `caption`, `placeholder`), and the placeholder generator's project block.

### Content status
- New in this release: 3 real projects (attic bedroom, roof replacement, concrete walkway).
- Client to confirm: the city for each project (empty, so captions show only the work type).
- Held back:
  - Basement foundation project (`enabled: false`): its images look computer-generated, so it's shown only if the client confirms they are photos of his own job;
  - its "after" image on the Basement Finishing card stays hidden while `settings.showServiceImages` is off.
- Not used this round: both videos (the roof reel was used only as a frame source); `attic-bedroom-square.jpeg` (smaller panels, about 533×488, than the wide version); `roof-strip.jpeg` (the video frames are sharper).
- Still placeholder: hero background photo (none of the new photos is large enough for full width).
- Services list unchanged (roofing and concrete not added, pending client confirmation).

### Verification
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built.
- `dist/`: no files from `src/assets/projects/source/` (no composites, strip or videos) and no `project-N` SVGs.
- Crops:
  - each reviewed visually at full size: no logos, gold frames, BEFORE/AFTER tags or text bars ("WARRANTY", "Expert Foundation Solutions", "Quality Work", "Fair Pricing", "Dry / Clean / Protected");
  - edge rows and columns scanned for leftover gold frame pixels. This caught a 1–2px sliver of the AFTER tag's gold line at the bottom of the basement "after" crop, which was trimmed (height 609 → 600) and re-checked;
  - the gold-colored pixels flagged at the top of that crop are the wooden ceiling joists.
- Roof frames:
  - picked from a contact sheet of 42 frames (one per 0.5 s);
  - for each, the sharpest of ±8 frames (Laplacian variance) was chosen: frames 88, 278, 292, 368 and 472;
  - the logo badge and label overlays end at y≈225, and crops start at y240.
- Browser checks (Playwright driving Microsoft Edge):
  - Projects: 3 cards. Desktop boxes: featured 690×676, the other two 486×326 each with aligned bottoms. Mobile: one column, 350px wide.
  - Slider keyboard: from 50, 5× ArrowRight gives 55, Home gives 0, End gives 100, ArrowLeft gives 99; `--pos`, the clip-path (`inset(0px 1% 0px 0px)` at 99) and `aria-valuetext` follow; the knob ring shows on keyboard focus.
  - Slider mouse: drag to 25% gives 25, drag to 70% then release gives 70, moving after release changes nothing.
  - Slider touch (390×844 emulation): tap at 80% gives 80, touch drag 80% → 20% gives 20.
  - Reduced motion: knob `transition-duration` is 0s (0.15s otherwise).
  - Lightbox (roof): opens at "1 / 5 Before"; ArrowRight goes 2 Before, 3 Before, 4 After, 5 After, then wraps to 1; Esc closes and focus returns to the opener. Attic opens at "1 / 2 Before".
  - Basement: not in the page text, no basement image rendered, absent from the lightbox data.
  - Service images: 0 rendered with the flag off; with the flag temporarily on, 1 image on the Basement Finishing card with the correct alt text, then the flag was set back to off.
  - Horizontal overflow 0px on desktop and mobile; no console errors.
- Screenshots reviewed: Projects at 1440px and 390px; lightbox open on the roof project at both sizes.
- Not checked in this release: Lighthouse, real phones, browsers other than Edge, and screen-reader output for the slider (checked via ARIA attributes only).

### Known issues
- The disabled basement crops are emitted into `dist/_astro/` as unreferenced files (`before-1.*.jpg` 684×556, `after-1.*.jpg` 696×600). The page never links them, but they'd be reachable by URL. This is the same build behavior as the unused logo variants (all images in `src/assets/` are bundled).
- Source photo quality: the concrete and attic photos are small (about 630–760px wide) and show social-media compression, which is fine at card size but soft when enlarged in the lightbox.
- The attic before/after photos are from nearly, but not exactly, the same spot, so the slider comparison isn't pixel-aligned.
- Carried over: focus outline fades in from the text color (~150ms); hero "Placeholder" badge sits close to the trust strip on desktop.

### Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-17. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.3.1`.

## [0.3.1] - 2026-10-14

| Field | Value |
|---|---|
| Release type | Patch |
| Previous version | 0.3.0 |
| Git commit | 94b681d |
| Git tag | v0.3.1 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-14) |
| Status | Pre-launch |

### Summary
The website no longer says the company is licensed, insured or guaranteed, because those credentials aren't in place yet. In "Why Us", that point is replaced with "We stand behind our work", so the section still shows eight advantages. The original wording is saved and can be switched back on once the license and insurance are obtained. The business email, turnkeyrenousa@gmail.com, was checked everywhere it appears.

### Changed
- Why Us (`site.ts` `about.values`, `About.astro`): advantage 8 "Licensed, insured & guaranteed" replaced on the page by "We stand behind our work: We stay on the job until it's done right and you're satisfied." The grid stays at 8 items (2 × 4 desktop, 1 column mobile).
- `site.ts`: the original credentials entry is kept with `enabled: false` and the comment "Re-enable only once the client has an actual contractor license and insurance." `About.astro` filters out disabled advantages, so the text is not in the built HTML.
- README "Before launch" checklist: "Confirm 'Licensed, insured & guaranteed'…" replaced by "Re-enable credentials advantage once license + insurance are obtained (see site.ts)".

### Removed
- All credential claims (licensed, insured, guaranteed) from the live page.

### Content status
- Removed until obtained: contractor license and insurance claims (stored, disabled, in `site.ts`).
- Business email turnkeyrenousa@gmail.com confirmed by the client as official.
- Still placeholder: 8 project photos (captions to come) and the hero background photo.
- To confirm with client before launch: the 24-hour response promise.
- Not yet set: production domain, privacy policy page, form service account.

### Verification
- Search for licensed, license, insured, insurance, certified, bonded, guaranteed and guarantee across the project (excluding `node_modules`, `dist`, and `package-lock.json`, whose `"license"` fields are open-source software licenses):
  - matches only in `site.ts` (now the disabled entry and its comment), `README.md` (checklist line, replaced) and the 0.3.0 CHANGELOG entry (historical, kept);
  - none in meta tags, JSON-LD, OG image text, alt texts or other components.
- Built `dist/index.html`: no matches for those terms; the rendered page text also contains none (checked in the browser).
- Email, from the single `company.email` value:
  - estimate section and footer each show `turnkeyrenousa@gmail.com` with `href="mailto:turnkeyrenousa@gmail.com"`, and computed `text-transform` is `none` (displays lowercase);
  - JSON-LD has `"email":"turnkeyrenousa@gmail.com"`;
  - no inconsistencies found, so no fixes were needed.
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built.
- Browser checks (Playwright driving Microsoft Edge):
  - Why Us: 8 items in 2 columns × 4 rows at 1440×900, and 1 column × 8 rows at 390×844;
  - item 8 reads "We stand behind our work";
  - horizontal overflow 0px; no console errors.
- Not checked in this release: Lighthouse, real phones, browsers other than Edge.

### Known issues
- Carried over from 0.2.0: the focus outline briefly fades in from the text color (~150ms); unused logo variants are copied into `dist/_astro/`.
- Carried over from 0.3.0: on desktop, the hero "Placeholder" badge sits close to the right edge of the trust strip until the real hero photo is in.

### Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-14. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.3.0`.

## [0.3.0] - 2026-10-14

| Field | Value |
|---|---|
| Release type | Minor |
| Previous version | 0.2.2 |
| Git commit | 30759d5 |
| Git tag | v0.3.0 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-14) |
| Status | Pre-launch |

### Summary
The website now carries Turnkey Reno's final wording throughout and describes the service area as Northeast Ohio instead of Cleveland. "Why Us" lists eight concrete advantages, and the Tips section has six practical tips with topic labels. The estimate form now asks whether the visitor is a homeowner or an investor and their rough budget, both optional, and email is no longer required. The business email appears next to the phone number. The only content still waiting are the real project photos and the main background photo.

### Added
- Why Us (`About.astro`): 8 advantages in a 2-column grid on desktop (1 column on mobile); the left column (heading, phone) is now sticky on desktop and gains a "Get a Free Estimate" button.
- Tips (`Tips.astro`): 3 new tips (Fix water issues first, Plan around the seasons, Spend where it counts); a category tag on each tip (`tip.tag` in `site.ts`), styled as a square outline label, distinct from the placeholder badge; grid is 3 × 2 on desktop, 2 columns on tablet, 1 on mobile.
- Projects (`Projects.astro`): optional caption per photo (`projects[].caption`, format "Kitchen Remodel · North Canton, OH"), shown as work type + location over the thumbnail and in the lightbox. Captions are empty until real photos arrive; empty captions render no overlay and no lightbox caption row.
- Estimate form (`EstimateForm.astro`):
  - optional "I am a…" choice (Homeowner / Real estate investor), sent as `customer_type`;
  - optional "Estimated budget" select (Under $10k / $10k–$25k / $25k–$50k / $50k+ / Not sure), sent as `budget`.
- Estimate section: business email (mailto link) and "Serving Northeast Ohio" under the "Prefer to talk?" phone number.
- `company.email` = turnkeyrenousa@gmail.com, now shown in the footer contact block and included in the LocalBusiness JSON-LD.
- `site.ts`: "CONFIRM WITH CLIENT before launch" comments on advantage 8 (licensed, insured & guaranteed) and on the 24-hour response promise.
- README launch checklist: confirm "Licensed, insured & guaranteed", confirm the 24-hour response, real project photos with captions, consider a domain email instead of Gmail.

### Changed
- Service area "Cleveland" → "Northeast Ohio" in:
  - `seo.title` and `seo.description`, `seo.ogImageAlt`;
  - `company.serviceArea` (footer and estimate "Serving …" lines);
  - `company.areaServed`;
  - `hero.eyebrow`, `about.paragraphs[0]`, `footer.blurb`;
  - the OG image subtitle in `scripts/build-logo.mjs` (`public/og-image.png` regenerated);
  - the README intro line.
- JSON-LD `areaServed`: type `City` → `AdministrativeArea` (Northeast Ohio is a region, not a city).
- Hero: new subheadline; trust line now has 3 items (added "Budget-based planning").
- Services: new intro text; Basement Finishing description updated.
- Why Us: both paragraphs replaced with client-final text; the 4 value points replaced by the 8 advantages.
- Projects: new subheadline; placeholder alt texts made neutral ("Placeholder project photo 1–8").
- Tips: new subheadline; tighter padding and type size on mobile.
- Estimate section: intro now promises a reply within 24 hours; step 3 text updated.
- Estimate form:
  - email is optional, and its format is checked only when filled in;
  - "Service needed" and "Estimated budget" sit side by side;
  - the message placeholder text no longer asks about owner/investor;
  - the submit button stays on one line on mobile (full width, reduced padding).
- `PlaceholderBadge.astro`: now hidden unless `show` is explicitly true.
- README: form validation note updated (email optional).

### Fixed
- Placeholder badges appeared on every service card and tip once their `placeholder` flags were removed (the badge's `show` prop defaulted to true). Found during this round's checks, before release.

### Removed
- Placeholder flags on all 6 services and all tips (client-approved).
- Projects section-level "Placeholder" badge.
- Project captions invented for the placeholder images ("Kitchen Remodel", etc.).
- README checklist item about the Canton address vs "Cleveland-based" copy: Canton is in Northeast Ohio, so the conflict no longer exists.

### Content status
- Client-final in this release: hero copy, services (all 6 + intro), Why Us paragraphs and 8 advantages, projects subheadline, all 6 tips, estimate intro and steps, business email, service area.
- Still placeholder: 8 project photos (with captions to come) and the hero background photo. There is no owner photo on the site.
- To confirm with client before launch: "Licensed, insured & guaranteed" is accurate; the 24-hour response promise is realistic.
- Not yet set: production domain, privacy policy page, form service account.

### Verification
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built.
- "Cleveland" search: no matches left in source, README or the built `dist/index.html`. The only matches are in older CHANGELOG entries, which are kept as written.
- Built JSON-LD contains `"email":"turnkeyrenousa@gmail.com"` and `areaServed` `[{"@type":"AdministrativeArea","name":"Northeast Ohio"}]`.
- OG image regenerated and checked visually ("HOME RENOVATION · NORTHEAST OHIO").
- Automated browser checks (Playwright driving Microsoft Edge), desktop 1440×900 and mobile 390×844:
  - horizontal overflow 0px on both, and no elements past the right edge;
  - Why Us shows 8 items, Tips shows 6 items;
  - visible placeholder badges: 1 on desktop (hero photo), 0 on mobile;
  - no console or page errors.
- Section heights:

  | Section | Desktop | Mobile |
  |---|---|---|
  | Hero | 899px | 828px |
  | Why Us | 1286px | 1860px |
  | Tips | 1142px | 1688px (was 2048px before tightening) |
  | Estimate | 1123px | 2129px |

- Projects: no caption overlays render while captions are empty, and the lightbox caption row is hidden.
- Estimate form:
  - an empty submit flags exactly name, phone, zip and service, and focuses name;
  - an invalid email is flagged;
  - with email left empty, the submit passes validation and shows the "not connected" notice;
  - the submitted data includes `customer_type` "Real estate investor", `budget` "$10k–$25k" and the selected service.
- Screenshots reviewed: hero, Why Us, Tips and Estimate on desktop and 390px mobile.
- Not checked in this release: Lighthouse, real phones, browsers other than Edge, contrast of the new tag label (slate-300 text on navy, the same pairing used elsewhere).

### Known issues
- Carried over from 0.2.0: the focus outline briefly fades in from the text color (~150ms); unused logo variants are copied into `dist/_astro/`.
- On desktop, the hero "Placeholder" badge sits close to the right edge of the trust strip. It goes away once the real hero photo replaces the placeholder.

### Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-14. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.2.2`.

## [0.2.2] - 2026-10-08

| Field | Value |
|---|---|
| Release type | Patch |
| Previous version | 0.2.1 |
| Git commit | 8e49439 |
| Git tag | v0.2.2 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-08) |
| Status | Pre-launch |

### Summary
Nothing on the website changed in this release. The project's update history now lives in a single document, this changelog, with the newest version at the top. That makes the full history easy to read in one place.

### Added
- `CHANGELOG.md`: single Keep a Changelog file containing every release, newest first, with version compare links at the bottom.

### Changed
- `README.md`: "Releases" section now points to `CHANGELOG.md` and describes adding each new version at the top.

### Removed
- `releases/` folder: `RELEASE_NOTES_0.1.0.md`, `RELEASE_NOTES_0.2.0.md`, `RELEASE_NOTES_0.2.1.md` and the `README.md` index. Their content was moved into `CHANGELOG.md`.

### Content status
No content changes. Still placeholder: hero photo, 8 project photos, 6 service descriptions, 3 tips, business email, form service account. Not yet set: production domain, privacy policy page. To confirm with client: Canton, OH address vs "Cleveland-based" copy.

### Verification
- The 0.1.0, 0.2.0 and 0.2.1 sections of `CHANGELOG.md` were compared by script against the original files at commit 9f24aff. Body text is identical apart from heading levels, and all metadata rows are present.
- No remaining links to `releases/` in tracked files. The 0.2.1 entry still names the folder, because it records what that release added.
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built.
- No site code changed, so the browser checks from 0.2.0 were not repeated.

### Known issues
- Carried over from 0.2.0: the focus outline briefly fades in from the text color (~150ms); unused logo variants are copied into `dist/_astro/`.

### Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-08. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.2.1`.

## [0.2.1] - 2026-10-08

| Field | Value |
|---|---|
| Release type | Patch |
| Previous version | 0.2.0 |
| Git commit | 0a2371a |
| Git tag | v0.2.1 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-08) |
| Status | Pre-launch |

### Summary
Nothing visible on the website changed in this release. It sets up a release-notes process: every update now gets a version number and a short write-up of what changed, what was checked, and what is still waiting on content. That makes it easy to see the project's progress and to roll back if needed.

### Added
- `releases/`: one release notes file per version (`RELEASE_NOTES_0.1.0.md`, `RELEASE_NOTES_0.2.0.md`, `RELEASE_NOTES_0.2.1.md`) and `releases/README.md`, an index of all versions.
- Annotated git tags `v0.1.0` (a34541a), `v0.2.0` (deaedac) and `v0.2.1`.
- `README.md`: "Releases" section describing the versioning rules.

### Changed
- `package.json`: `version` `0.0.1` → `0.2.1`. It now tracks the latest release.

### Removed
- Repository: stopped tracking four local-only working files (two planning notes and two editor instruction files from the starter template). They remain on the developer's machine and are excluded locally; past commits are unchanged.

### Content status
No content changes. Still placeholder: hero photo, 8 project photos, 6 service descriptions, 3 tips, business email, form service account. Not yet set: production domain, privacy policy page. To confirm with client: Canton, OH address vs "Cleveland-based" copy.

### Verification
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built. `dist/` contents unchanged in kind (`index.html`, `robots.txt`, favicons, `logo.png`, `og-image.png`, `_astro/`).
- `git ls-files` confirms the four working files are no longer tracked; they still exist on disk.
- Commit history checked: both earlier commits are authored and committed by the developer's own identity, with no co-author trailers.
- No site code changed, so the browser checks from 0.2.0 were not repeated.

### Known issues
- Carried over from 0.2.0: the focus outline briefly fades in from the text color (~150ms); unused logo variants are copied into `dist/_astro/`.

### Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-08. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.2.0`.

## [0.2.0] - 2026-10-08

| Field | Value |
|---|---|
| Release type | Minor |
| Previous version | 0.1.0 |
| Git commit | deaedac |
| Git tag | v0.2.0 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-08) |
| Status | Pre-launch |

### Summary
The site now uses Turnkey Reno's real logo instead of the temporary "TR" mark. It was redrawn as a sharp vector file so it stays crisp on any screen and sits cleanly on the site's navy background. A one-line version keeps the name readable in the header on phones, and the full logo with the tagline appears in the footer. The site's accent color was changed from orange-amber to the gold of the logo, and text and keyboard-focus colors were rechecked so everything stays easy to read.

### Added
- `scripts/build-logo.mjs`: rebuilds the logo from measured geometry, with Montserrat lettering converted to outlines (ExtraBold for "URNKEY", Medium for the tagline, a widened Medium for "RENO").
- Logo files in `src/assets/brand/`, each with a `-dark` and `-light` version and a transparent background:
  - `logo-full-*.svg`: original layout with tagline and metallic gold gradient;
  - `logo-compact-*.svg`: original layout without the tagline;
  - `logo-lockup-*.svg`: one-line mark + "TURNKEY RENO";
  - `logo-icon-*.svg`: roof, chimney and window;
  - `logo-mark-*.svg`: roof, window and key-shaped T.
- Client originals `logo-original-dark.jpeg` and `logo-original-light.jpeg` stored as reference (excluded from the build).
- `public/favicon-32.png` and `public/apple-touch-icon.png` (180×180), with `<link>` tags in `BaseLayout.astro`.
- `public/logo.png` (600px wide), used as the `logo` in the LocalBusiness JSON-LD.
- `brand.headerLogo` option in `site.ts` (`'lockup'` or `'compact'`).
- `.on-dark` focus scope in `global.css`, applied to the header, hero, About, Tips, estimate panel, footer, mobile bar and lightbox.
- Dev dependencies: `opentype.js`, `@fontsource/montserrat` (used only by the logo script).

### Changed
- Header: placeholder logo replaced with the horizontal lockup (`logo-lockup-dark.svg`), 40px tall on mobile and 56px on desktop.
- Footer: placeholder logo replaced with the full logo (`logo-full-dark.svg`) at 112–128px.
- Accent colors in `global.css`, sampled from the logo:
  - `--color-accent` `#f5a524` → `#dba84f`;
  - `-300` → `#f0cf8c`, `-400` → `#e6bd6c`, `-600` → `#c18e38`;
  - `-700` (text on light backgrounds) `#9a5b05` → `#86601a`;
  - the button glow was retinted to match.
- Focus outline: dark gold `#86601a` on light sections, gold `#dba84f` on dark sections (was amber everywhere).
- `public/favicon.svg`: gold roof-and-window icon on a navy tile.
- `public/og-image.png`: full logo on navy with a blueprint grid, plus "HOME RENOVATION · CLEVELAND, OHIO" (now built by `build-logo.mjs`).
- `Logo.astro`: takes `variant` (`full` / `compact` / `lockup` / `icon`) and `tone` (`dark` / `light`), reading paths from `brand.logo` in `site.ts`.
- Placeholder hero and project images regenerated in the new gold.
- `src/lib/images.ts`: the image glob skips `*-original*` files.
- `PlaceholderBadge.astro`: dark-variant class renamed `on-dark` → `is-dark` (avoids clashing with the focus scope).
- `README.md`: new "Logo" section; launch checklist updated.

### Fixed
- Keyboard focus outline contrast on light sections: was ~1.8:1 (amber on paper), now 5.12:1 (dark gold on paper).

### Removed
- `src/assets/logo.svg` (placeholder "TR" logo).
- Footer: the separate "You start, we finish." text line (the full logo now carries the tagline).
- OG image generation from `scripts/generate-placeholders.mjs` (moved to `build-logo.mjs`).

### Content status
- Replaced in this release: logo (client artwork, recreated as vector), favicon, OG image.
- Still placeholder: hero photo, 8 project photos, 6 service descriptions, 3 tips, business email, form service account.
- Not yet set: production domain, privacy policy page.
- To confirm with client: Canton, OH address vs "Cleveland-based" copy.

### Verification
- Logo accuracy: the SVG was rendered at the original's pixel coordinates and compared pixel by pixel. Overlap (intersection over union) was 0.929 for the white elements and 0.904 for the gold.
- Font choice by overlap against the original:
  - "URNKEY": Montserrat 800 scored 0.948 (next best: 900 at 0.860);
  - tagline: 500 scored 0.787;
  - "RENO": 500 stretched per letter scored 0.754 (best of 500–800).
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built; `dist/` contains no `*-original*` files.
- Contrast, computed from the final colors (WCAG formula). All 12 pairs pass:
  - navy on gold button 8.95:1, on hover 10.91:1;
  - gold on navy-950 8.95:1, on navy-900 8.41:1;
  - dark gold on paper 5.12:1, on white 5.67:1;
  - placeholder badge on light 5.10:1, on dark 12.11:1;
  - focus outline 5.12 / 5.67 / 8.95 / 8.41:1 (3:1 required).
- Focus outline colors measured in the browser after the transition: `rgb(134, 96, 26)` on a light section, `rgb(219, 168, 79)` in the header.
- Screenshots reviewed (Playwright driving Microsoft Edge): desktop 1440×900 header, footer and focus states; mobile 390×844 at 3× header and footer.
- Header options compared at real size: in the compact logo "RENO" is about 8px tall at 44px height on mobile, so the lockup was chosen.
- Favicon viewed at 16px and 32px; OG image checked visually. While doing so, a bug in the OG subtitle (coordinates printed as `NaN`) was found and fixed, and every generated SVG was checked for `NaN` (none).
- Not checked in this release: Lighthouse, real phones, browsers other than Edge.

### Known issues
- When focusing a link that has a color transition, the focus outline fades from the link's text color to gold over about 150ms before settling.
- All logo variants are copied into `dist/_astro/` even when unused (a few KB each, not linked from the page).

### Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-08. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.1.0`.

## [0.1.0] - 2026-10-08

| Field | Value |
|---|---|
| Release type | Minor |
| Previous version | None (first release) |
| Git commit | a34541a |
| Git tag | v0.1.0 |
| Environment | Not deployed (local builds only; no Netlify site was live at the time) |
| Status | Pre-launch |

### Summary
This is the first complete version of the Turnkey Reno website: a single page built to get homeowners and investors to call or request a free estimate. It includes every planned section: header, hero, trust points, services, about, project gallery, tips, estimate form and footer. It works on phones, with call and estimate buttons always in reach. Photos, service descriptions, tips and the logo are temporary placeholders until the final content arrives.

### Added
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

### Content status
- Approved and in place: About text (client-supplied, verbatim), slogan, phone (440) 337-5140, address as provided.
- Placeholder (waiting on client): logo, hero photo, 8 project photos, 6 service descriptions, 3 tips, business email, form service account.
- Not yet set: production domain (`siteUrl` is `https://example.com`), privacy policy page.
- To confirm with client: the address is in Canton, OH while the copy says "Cleveland-based".

### Verification
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

### Known issues
- Keyboard focus outline (amber `#f5a524`) is about 1.8:1 against the light sections, below the 3:1 WCAG minimum (found later; fixed in 0.2.0).
- The estimate form is not connected to a form service yet (by design until an account is set up).

### Deployment and rollback
Not deployed: no Netlify site was connected for this version. Once Netlify is connected to the GitHub repo, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to the previous tag.

[0.4.2]: https://github.com/roeigam/turnkey-reno/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/roeigam/turnkey-reno/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/roeigam/turnkey-reno/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/roeigam/turnkey-reno/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/roeigam/turnkey-reno/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/roeigam/turnkey-reno/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/roeigam/turnkey-reno/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/roeigam/turnkey-reno/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/roeigam/turnkey-reno/releases/tag/v0.1.0

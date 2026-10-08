# Release Notes: v0.2.1

| Field | Value |
|---|---|
| Version | 0.2.1 |
| Release date | 2026-10-08 |
| Release type | Patch |
| Previous version | 0.2.0 |
| Git commit | 0a2371a |
| Git tag | v0.2.1 |
| Environment | Not deployed (local builds only; turnkey-reno.netlify.app returned 404 on 2026-10-08) |
| Status | Pre-launch |

## Summary
Nothing visible on the website changed in this release. It sets up a release-notes process: every update now gets a version number and a short write-up of what changed, what was checked, and what is still waiting on content. That makes it easy to see the project's progress and to roll back if needed.

## Added
- `releases/`: one release notes file per version (`RELEASE_NOTES_0.1.0.md`, `RELEASE_NOTES_0.2.0.md`, `RELEASE_NOTES_0.2.1.md`) and `releases/README.md`, an index of all versions.
- Annotated git tags `v0.1.0` (a34541a), `v0.2.0` (deaedac) and `v0.2.1`.
- `README.md`: "Releases" section describing the versioning rules.

## Changed
- `package.json`: `version` `0.0.1` → `0.2.1`. It now tracks the latest release.

## Removed
- Repository: stopped tracking four local-only working files (two planning notes and two editor instruction files from the starter template). They remain on the developer's machine and are excluded locally; past commits are unchanged.

## Content status
No content changes. Still placeholder: hero photo, 8 project photos, 6 service descriptions, 3 tips, business email, form service account. Not yet set: production domain, privacy policy page. To confirm with client: Canton, OH address vs "Cleveland-based" copy.

## Verification
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: pass, 1 page built. `dist/` contents unchanged in kind (`index.html`, `robots.txt`, favicons, `logo.png`, `og-image.png`, `_astro/`).
- `git ls-files` confirms the four working files are no longer tracked; they still exist on disk.
- Commit history checked: both earlier commits are authored and committed by the developer's own identity, with no co-author trailers.
- No site code changed, so the browser checks from 0.2.0 were not repeated.

## Known issues
- Carried over from 0.2.0: the focus outline briefly fades in from the text color (~150ms); unused logo variants are copied into `dist/_astro/`.

## Deployment and rollback
Not deployed: turnkey-reno.netlify.app returned 404 on 2026-10-08. The code is on GitHub (`main`). Once Netlify is connected, pushes to `main` deploy automatically. Rollback: redeploy the previous deploy from the Netlify Deploys tab, or `git revert` back to tag `v0.2.0`.

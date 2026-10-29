# Not for publication

**Photos from a different company's projects. Must NOT be published on this site (legal). Kept for reference only.**

Nothing in this folder ever reaches the build: the image loader (`src/lib/images.ts`) excludes `src/assets/_disabled/**`, and `asset()` stops the build with an error if `src/data/site.ts` points at a file in here.

| Folder / file | What it is |
|---|---|
| `projects/sunroom/`, `attic-bedroom/`, `roof-replacement/`, `concrete-walkway/`, `basement-foundation/` | Before/after crops that were shown in the Projects gallery until v1.1.0 |
| `hero/sunroom-after.jpg` | The hero background used in v0.5.0 – v1.0.0 |
| `projects/source/` | The social-media composites and source photos the crops were cut from. The `.mp4` reels are git-ignored and exist only locally |
| `extract-project-photos.mjs` | The script that produced the crops (reads and writes only inside this folder) |

Don't move anything out of this folder. The Projects section (`settings.showProjects`) may only be re-enabled with photos of Turnkey Reno's own completed projects.

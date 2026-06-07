# PNGtoSTL GitHub Resource-List PR Prep — awesome-3d-printing

Updated: 2026-06-07

Target repository:

```text
https://github.com/ad-si/awesome-3d-printing
```

Current status:

```text
manual_required / branch_pushed / PR creation blocked by GitHub token permission
```

This document prepared an owner-reviewable PR plan. After owner approval on 2026-06-07, the fork branch was created and pushed, but the PR itself was not opened because the available GitHub token lacks `createPullRequest` permission and the browser compare page was signed out.

Execution result after owner approval:

```text
Fork: https://github.com/Amber-Mr-chen/awesome-3d-printing
Branch: add-pngtostl-online-tool
Commit: f062beb Add PNGtoSTL to Online Tools
Compare URL: https://github.com/ad-si/awesome-3d-printing/compare/main...Amber-Mr-chen:awesome-3d-printing:add-pngtostl-online-tool?expand=1
Compare state: Able to merge
PR status: not opened; manual_required
Blocker: gh pr create failed with GraphQL Resource not accessible by personal access token (createPullRequest); browser compare page showed signed-out GitHub session.
```

No upstream PR, upstream write, payment, CAPTCHA bypass, or reciprocal action has been executed.

## Repository Signals

Repository metadata checked with `gh repo view`:

```text
repo: ad-si/awesome-3d-printing
default branch: main
description: A curated list of awesome 3D printing resources
pushedAt: 2026-06-02T10:10:07Z
open issues: 1
open PRs: 1
```

Browser-visible activity:

```text
Latest visible commit: Add Gridfinity Layout Tool to Online Tools (#89)
Visible recency: 5 days ago
```

Contribution rules from `contributing.md`:

- Search previous suggestions before making a new one.
- Make sure the resource is useful before submitting.
- Make an individual pull request for each suggestion.
- Use AP-style title casing.
- Use the format: `[Resource Name](link) - Description text.`
- Check spelling/grammar and avoid trailing whitespace.
- Use a useful PR/commit title.

## Duplicate / Fit Check

README search results:

```text
PNGtoSTL: 0
png to stl: 0
png-to-stl: 0
image to stl: 0
image-to-stl: 0
lithophane: 0
heightmap: 0
relief: 0
```

GitHub issue/PR search:

```text
No returned issues or PRs for PNGtoSTL / "image to STL" / lithophane / heightmap.
```

Relevant neighboring entries in `Online Tools`:

```markdown
- [Gridfinity Layout Tool] - Browser-based tool to plan Gridfinity drawer layouts and export STL, STEP, and 3MF files for 3D printing.
- [Polyvia3D] - Browser-based 3D file converter, viewer, and repair tool supporting OBJ, STL, GLB, PLY, and 3MF. Runs locally via WebAssembly.
- [QRCode2STL] - Browser-based generator for 3D printable QR codes, Spotify codes, and text tags.
```

Fit conclusion:

```text
Good fit for Online Tools. PNGtoSTL fills an image-to-STL / relief / lithophane / heightmap gap that is not currently represented by name or obvious duplicate wording.
```

## Proposed Entry

Preferred entry:

```markdown
- [PNGtoSTL] - Browser-based image-to-STL workspace for reliefs, lithophanes, logo badges, and heightmap surfaces, with real downloadable STL examples.
```

Reference link:

```markdown
[PNGtoSTL]: https://pngtostl.net/samples?utm_source=github_awesome_3d_printing&utm_medium=referral&utm_campaign=sample_gallery&utm_content=resource_list_pr
```

Why `/samples`:

- The list audience is evaluating resource usefulness.
- `/samples` proves real source images, previews, mesh metrics, and downloadable STL outputs.
- It avoids sending reviewers to a generic homepage before they see proof.

## Suggested Insertion Point

Insert the entry in the `Online Tools` list after `Polyvia3D` and before `QRCode2STL`:

```markdown
- [Polyvia3D] - Browser-based 3D file converter, viewer, and repair tool supporting OBJ, STL, GLB, PLY, and 3MF. Runs locally via WebAssembly.
- [PNGtoSTL] - Browser-based image-to-STL workspace for reliefs, lithophanes, logo badges, and heightmap surfaces, with real downloadable STL examples.
- [QRCode2STL] - Browser-based generator for 3D printable QR codes, Spotify codes, and text tags.
```

Reason:

```text
The section is roughly grouped by resource/tool name but not strictly alphabetized near the end. Placing PNGtoSTL between Polyvia3D and QRCode2STL preserves alphabetical order for that local run and keeps it near similar browser-based STL tools.
```

Insert the reference definition after `Polyvia3D` and before `PROLED3D`:

```markdown
[Polyvia3D]: https://polyvia3d.com
[PNGtoSTL]: https://pngtostl.net/samples?utm_source=github_awesome_3d_printing&utm_medium=referral&utm_campaign=sample_gallery&utm_content=resource_list_pr
[PROLED3D]: https://proled3d.com
```

## Owner-Review Patch

Patch against upstream `readme.md`:

```diff
diff --git a/readme.md b/readme.md
--- a/readme.md
+++ b/readme.md
@@ -363,6 +363,7 @@
 - [HelloTriangle] - Cloud-based 3D modeling using Python.
 - [OctoEverywhere] - Remotely monitor your OctoPrint.
 - [Polyvia3D] - Browser-based 3D file converter, viewer, and repair tool supporting OBJ, STL, GLB, PLY, and 3MF. Runs locally via WebAssembly.
+- [PNGtoSTL] - Browser-based image-to-STL workspace for reliefs, lithophanes, logo badges, and heightmap surfaces, with real downloadable STL examples.
 - [QRCode2STL] - Browser-based generator for 3D printable QR codes, Spotify codes, and text tags.
 - [Vectary] - Browser-based 3D modeling.
 - [Vectiler] - Online tool to generate 3D printable map and terrain models from real-world geographic data.
@@ -386,6 +387,7 @@
 [OctoEverywhere]: https://octoeverywhere.com
 [Open Filament Database]: https://github.com/OpenFilamentCollective/open-filament-database
 [Polyvia3D]: https://polyvia3d.com
+[PNGtoSTL]: https://pngtostl.net/samples?utm_source=github_awesome_3d_printing&utm_medium=referral&utm_campaign=sample_gallery&utm_content=resource_list_pr
 [PROLED3D]: https://proled3d.com
 [QRCode2STL]: https://qrcode2stl.printer.tools
 [Vectary]: https://www.vectary.com/
```

## Suggested Branch / Commit / PR

Branch name:

```text
add-pngtostl-online-tool
```

Commit title:

```text
Add PNGtoSTL to Online Tools
```

PR title:

```text
Add PNGtoSTL to Online Tools
```

PR body:

```markdown
## Summary

Adds PNGtoSTL to the Online Tools section.

PNGtoSTL is a browser-based image-to-STL workspace for practical 3D printing outputs such as reliefs, lithophanes, logo badges, and heightmap surfaces. The linked examples page includes source images, previews, mesh metrics, and downloadable STL examples.

## Checklist

- [x] Searched the README for PNGtoSTL, image-to-STL, lithophane, heightmap, and relief duplicates.
- [x] Added one resource only.
- [x] Used the existing `[Resource Name] - Description text.` format.
- [x] Placed the entry in the Online Tools section near similar browser-based STL tools.
```

## Pre-PR Checklist

Before opening any PR:

- [ ] Owner explicitly approves GitHub account/fork/branch/PR action.
- [ ] Re-run duplicate search against current upstream README, issues, and open PRs.
- [ ] Confirm upstream has not changed the `Online Tools` section since this prep.
- [ ] Confirm UTM link is acceptable for an awesome list; if not, use canonical `https://pngtostl.net/samples`.
- [ ] Apply only the two-line README patch above.
- [ ] Run repository formatting/checks if documented by upstream.
- [ ] Open PR with the prepared title/body.

## Stop Conditions

Do not open the PR if:

- A duplicate or close substitute appears in README, open issues, or open PRs.
- The maintainer rules prohibit product/self-submission or tracked URLs.
- The owner does not approve GitHub account/fork/PR action.
- The list section changes in a way that makes the insertion point or category unclear.

# Cold-start Launch Assets and UTM Plan — pngtostl.net

Updated: 2026-06-07 15:45 CST

## Launch positioning

One-line pitch:

> PNGtoSTL is a browser-based image-to-STL workspace for practical reliefs, logo badges, lithophanes, and heightmap surfaces, with real downloadable STL examples.

Short directory description:

> Convert images into STL-style relief, logo badge, lithophane, and heightmap outputs directly in the browser. Includes a live converter, real sample workflows, STL downloads, and honest limits for 2D-to-3D conversion.

Long description:

> PNGtoSTL helps makers turn images into practical STL outputs for 3D printing workflows: flat reliefs, logo badges, lithophanes, and heightmap-style surfaces. Upload an image, choose a workflow, inspect mesh metrics, and download an STL. The site also includes a real examples gallery with source images, previews, triangle counts, file sizes, and downloadable STL files, so users can judge output quality before trying their own image.

Do not overclaim:

- Do not say it reconstructs a full 3D object from one photo.
- Do not say STL preserves image color.
- Do not say every output is printer-ready without slicer inspection.
- Do not imply the tool replaces slicer inspection, supports all image inputs equally, or guarantees commercial print quality.

## Source-of-truth URLs

Use canonical HTTPS apex only:

- Homepage/tool hub: `https://pngtostl.net/`
- Main task-first tool: `https://pngtostl.net/image-to-stl`
- PNG-specific entry: `https://pngtostl.net/png-to-stl`
- Real examples gallery: `https://pngtostl.net/samples`
- Lithophane entry: `https://pngtostl.net/lithophane-generator`
- Heightmap entry: `https://pngtostl.net/heightmap-to-stl`

Avoid:

- `http://` links.
- `www.` links.
- Old or invented paths.
- Sending all channels to homepage by default when a more relevant tool/sample URL exists.

## Screenshots to prepare

Required before high-visibility submissions such as Product Hunt / Show HN:

- Homepage upload-first hero.
- `/image-to-stl` workspace before upload.
- `/image-to-stl` after successful STL generation with metrics.
- `/samples` workflow examples.
- A generated STL preview / downloaded file evidence.

For low-risk directories, a screenshot is optional unless the directory form requires one.

## UTM conventions

Fields:

- `utm_source`: directory slug or platform slug, e.g. `x`, `reddit`, `hn`, `makerworld`, `tool-directory`.
- `utm_medium`: `listing`, `community`, `post`, `social`, `newsletter`, `referral`.
- `utm_campaign`: `launch_v1`, `sample_gallery`, `lithophane_push`, `logo_badge_push`.
- `utm_content`: optional precise placement, e.g. `profile`, `directory_form`, `showcase_post`, `comment_website_field`.

Canonical UTM examples:

- General directory listing:
  - `https://pngtostl.net/?utm_source=directory&utm_medium=listing&utm_campaign=launch_v1&utm_content=directory_form`
- Maker/community post centered on examples:
  - `https://pngtostl.net/samples?utm_source=maker_forum&utm_medium=post&utm_campaign=sample_gallery&utm_content=real_examples`
- Reddit/helpful comment website field only:
  - `https://pngtostl.net/image-to-stl?utm_source=reddit&utm_medium=community&utm_campaign=launch_v1&utm_content=website_field`
- X soft-launch post:
  - `https://pngtostl.net/samples?utm_source=x&utm_medium=social&utm_campaign=sample_gallery&utm_content=soft_launch_post`
- HN / Show HN if approved later:
  - `https://pngtostl.net/image-to-stl?utm_source=hn&utm_medium=post&utm_campaign=launch_v1&utm_content=show_hn`
- Lithophane-specific channel:
  - `https://pngtostl.net/lithophane-generator?utm_source=directory&utm_medium=listing&utm_campaign=lithophane_push&utm_content=directory_form`
- Logo/badge-specific channel:
  - `https://pngtostl.net/logo-to-stl?utm_source=directory&utm_medium=listing&utm_campaign=logo_badge_push&utm_content=directory_form`

## Safe launch channels

### Priority 1 — low-risk discovery links

Use first because they usually allow product/tool URLs without needing aggressive posting.

- Relevant 3D printing / maker tool directories.
- AI/tool/SaaS directories that accept free tool submissions.
- Indie maker directories or personal profile website fields.
- GitHub/resource lists only if the list explicitly accepts contributions and the tool is relevant.
- Newsletter submission forms that ask for maker/dev tools.

Rules:

- Submit at most 3-5 candidates per day.
- Record every attempt in `ops/coldstart-submission-log.md`.
- Skip paid, reciprocal-link, login-only, CAPTCHA-blocked, or unclear-rule targets unless owner approves.
- Do not create fake reviews or ask for votes.

### Priority 2 — community discovery without spam

Use only when there is a real discussion fit.

- Reddit: default no link in comment body. Use website field only where available, or mention the tool only when OP explicitly asks for a tool and subreddit rules allow it.
- Hacker News: Show HN only after owner approval and screenshots are ready.
- Product Hunt: wait until owner wants a coordinated launch; do not submit casually.
- X/Twitter: safest daily link touchpoint if the account is ready; one natural scenario post, no repeated angle.

### Priority 3 — deferred

- Paid directories.
- Reciprocal badge/link directories.
- Forums requiring account age/karma before posting.
- Mass blog comments.
- Generic AI tool lists unrelated to 3D printing/maker workflows.

## First 7-day low-risk sequence

Day 0:

- Verify GSC/Bing/sitemap/crawler gates.
- Prepare screenshots and this launch asset pack.
- Submit 1-2 genuinely relevant free directories if owner has account/login ready.

Day 1:

- One X soft-launch post pointing to `/samples` with `sample_gallery` UTM.
- Submit 1-2 directory/profile listings.

Day 2:

- Scan Reddit/maker forums for real questions about image-to-STL, lithophanes, logo badges, or relief prints.
- Comment only if helpful without a product link, or use website field where allowed.

Day 3:

- Submit 1-2 additional directories/newsletter forms.
- Recheck GA4 referrers and `sample_proof_*` / converter events.

Day 4:

- If there is visible usage or good screenshots, prepare Show HN/Product Hunt draft for owner review; do not publish yet.

Day 5-7:

- Follow up on pending listings.
- Check GSC/Bing indexed pages and query impressions.
- Decide whether to scale, iterate examples, or pause based on actual data.

## Launch copy templates

### Directory title options

1. `PNGtoSTL — Image to STL converter for reliefs, lithophanes, logos, and heightmaps`
2. `PNGtoSTL: browser-based image-to-STL workspace with real downloadable examples`
3. `Convert images into STL relief workflows with PNGtoSTL`

### Short pitch

> Browser-based image-to-STL workspace for reliefs, logo badges, lithophanes, and heightmap surfaces, with real sample STL downloads.

### Directory body

> PNGtoSTL turns images into practical STL-style outputs for maker and 3D printing workflows. It supports relief-style image-to-STL, logo badges, lithophanes, and heightmap surfaces. The site includes a live converter plus a real examples gallery showing source images, output previews, triangle counts, file sizes, recommended settings, and downloadable STL samples. It is designed for practical 2D-to-relief workflows, not full 3D object reconstruction from a single photo.

### X soft-launch draft

> I’ve been testing a small browser-based image-to-STL workspace for practical 3D printing outputs: reliefs, logo badges, lithophanes, and heightmap tiles. The examples page includes real source images, STL previews, triangle counts, and downloadable STL files: https://pngtostl.net/samples?utm_source=x&utm_medium=social&utm_campaign=sample_gallery&utm_content=soft_launch_post

### Maker forum draft

> I built a browser-based image-to-STL workspace focused on practical outputs rather than full 3D reconstruction: reliefs, logo badges, lithophanes, and heightmap-style surfaces. The examples page shows the source image, output preview, STL download, triangle count, and settings notes for each workflow. I’m looking for feedback on whether the example outputs/settings are useful for real print prep: https://pngtostl.net/samples?utm_source=maker_forum&utm_medium=post&utm_campaign=sample_gallery&utm_content=feedback_request

### Reddit-safe non-link comment pattern

Use only on relevant threads. Prefer no link in body.

> For image-to-STL workflows, the biggest thing is matching the source image to the output type. High-contrast logos usually work better as shallow reliefs or badges, while photos tend to need lithophane-style settings rather than expecting a full 3D object. I’d also check the STL in a slicer before printing because thin ridges and tiny islands can fail even when the mesh exports cleanly.

If the OP explicitly asks for a tool and rules allow:

> I’ve been testing a browser-based image-to-STL workflow that shows source images, STL previews, and triangle/file-size notes. It may help as a reference, but I’d still inspect the exported STL in your slicer before printing.

Put the URL in the website/profile field where possible rather than the comment body.

## Candidate evaluation checklist

For every directory/community candidate:

- Relevance: high / medium / low.
- Submission allowed: yes / no / unclear.
- Cost: free / paid / unknown.
- Login required: yes / no.
- CAPTCHA/security challenge: yes / no.
- Reciprocal backlink/badge required: yes / no.
- Target URL selected.
- UTM URL generated.
- Status logged.

Skip if:

- Paid-only without owner approval.
- Requires reciprocal site changes.
- Irrelevant to 3D printing, maker tools, image conversion, or developer tools.
- Requires fake review, voting, or undisclosed promotion.
- Form is behind CAPTCHA/security challenge and owner is not present.

## Launch gates

Current verified status from ops docs:

- [x] Public crawl gates pass: robots, sitemap, llms.txt, canonical, index/follow.
- [x] Sitemap contains 20 URLs and full Googlebot sampling passed 20/20.
- [x] GSC sitemap was previously submitted and read with 0 warnings/errors.
- [x] Bing sitemap was previously confirmed successful with 20 discovered URLs.
- [x] GA4 installed and production events verified.
- [x] Real samples and proof events are live.
- [ ] Owner approval before any public post, directory submission, Show HN, Product Hunt, or account action.
- [ ] Screenshots prepared before high-visibility launch.

## Tracking and follow-up

Record every attempt in:

- `ops/coldstart-submission-log.md`

Review performance in:

- `ops/weekly-data-review-template.md`
- `ops/first-week-data-review-plan.md`

Key early metrics:

- Referrers / UTM sources.
- Landing pages.
- `sample_proof_view`.
- `sample_proof_open_workflow`.
- `sample_proof_download`.
- `pngtostl_upload_selected`.
- `pngtostl_generate_success`.
- `pngtostl_download_clicked`.
- GSC/Bing impressions and indexed pages.

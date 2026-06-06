# pngtostl.net samples funnel polish checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `f7fded21-15cf-46ed-a044-8bb407d82a62`

## Goal

Continue the post-real-assets polish with small conversion-path improvements, not another broad visual redesign:

1. Add a homepage proof-strip CTA to `/samples`.
2. Add a `/samples` workflow filter.
3. Show sample STL file sizes near download actions.
4. Verify local and production behavior.

## Changes

- `src/app/page.tsx`
  - Added `View all examples` CTA in homepage proof strip.

- `src/components/SampleGalleryFilter.tsx`
  - New client component for `/samples` filtering.
  - Filters: All examples, Relief, Logo badge, Lithophane, Heightmap.
  - Keeps real Source → Generated STL preview cards.
  - Shows category, metrics, file size label, primary `Open workflow`, secondary `Download sample STL <size>`.

- `src/app/[slug]/page.tsx`
  - Replaced inline samples gallery with `SampleGalleryFilter`.
  - Removed unused `next/image` import from dynamic page.

- `src/lib/tools.ts`
  - Added `category`, `categoryLabel`, and `fileSizeLabel` to `sampleWorkflows`.

- `src/app/globals.css`
  - Added homepage proof CTA styling.
  - Added sample filter bar / tabs styling.
  - Added download file-size label styling.
  - Added responsive rules for filter tabs and proof CTA.

## Local verification

Command:

```bash
npm run lint && npm run build && node scripts/home_responsive_qa.js && python3 scripts/step11_core_tool_qa.py
```

Result: PASS.

Responsive QA:

- issueCount: 0
- desktop overflow: false
- tablet overflow: false
- mobile overflow: false
- mobile scrollWidth: 390
- hasSlider: true
- tabCount: 3

Core STL QA:

- transparentCoverage: 0.0771
- whiteBgCoverage: 0.1406
- detail96: 96 × 48, 5068 triangles, 253,484 bytes
- detail320: 256 × 128, 26,620 triangles, 1,331,084 bytes

Browser QA:

Homepage:

- `/` contains `View all examples` in the proof strip.

Samples:

- `/samples` contains filter tabs.
- Default shows all 4 cards.
- Clicking `Lithophane` leaves only `Backlit lithophane panel`.
- Download button shows `Download sample STL 3.1 MB`.

Converter:

- `/image-to-stl?filter-update=upload-final`
- beforeDisabled: true
- afterDisabled: false
- buttonText: `Generate STL`
- downloadDisplay: `block`
- hasBlob: true
- message: STL ready
- metrics visible: triangles, file size, coverage

## Production deployment

Command:

```bash
npm run cf:build && npm run cf:deploy
```

Result: PASS.

Cloudflare Worker Version:

```text
f7fded21-15cf-46ed-a044-8bb407d82a62
```

## Production verification

HTTP:

- `http://pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/` → code 200
- `https://www.pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/samples` → code 200
- `https://pngtostl.net/samples/logo-badge.stl` → code 200, `model/stl`

Content:

- Homepage contains `View all examples` and `/samples`.
- `/samples` contains `Workflow filter`, `Download sample STL`, `3.1 MB`, `logo-badge.stl`.
- `/samples/manifest.json` still served.
- `/sitemap.xml` still served and includes `/samples`.

Production filter QA:

- `/samples?filter=prod`
- Clicking `Lithophane` leaves only `Backlit lithophane panel`.
- Selected tab is `Lithophane`.
- Download text: `Download sample STL 3.1 MB`.

Production API:

- `POST https://pngtostl.net/api/stl/convert`
- status 200: true
- content-type STL: true
- bytes: 1,843,084
- triangle header present: true

Production browser upload QA:

- `/image-to-stl?filter-update=prod-upload-final`
- beforeDisabled: true
- afterDisabled: false
- buttonText: `Generate STL`
- downloadDisplay: `block`
- hasBlob: true
- message: STL ready
- metrics visible: triangles, file size, coverage

## Status

DONE. The `/samples` page now has a clearer conversion funnel and a workflow filter while preserving the real generated sample assets.

# pngtostl.net real generated sample assets checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `c0949a8d-d900-457c-babf-a0291ecf07c1`

## Goal

Continue the visual maturity work by replacing CSS-only symbolic samples with real generated assets:

- Generate real source PNGs.
- Convert them through the actual PNGtoSTL API into STL files.
- Render STL preview PNGs from the generated mesh.
- Wire source/preview/STL assets into homepage proof strip and `/samples`.
- Verify local and production behavior.

## Assets generated

Script:

```bash
python3 scripts/generate_real_sample_assets.py
```

Generated static assets in `public/samples/`:

- `logo-badge-source.png`
- `logo-badge-preview.png`
- `logo-badge.stl`
- `universal-relief-source.png`
- `universal-relief-preview.png`
- `universal-relief.stl`
- `lithophane-panel-source.png`
- `lithophane-panel-preview.png`
- `lithophane-panel.stl`
- `heightmap-surface-source.png`
- `heightmap-surface-preview.png`
- `heightmap-surface.stl`
- `manifest.json`

Manifest result:

- `logo-badge`: 17,940 triangles, 897,084 bytes
- `universal-relief`: 65,532 triangles, 3,276,684 bytes
- `lithophane-panel`: 65,532 triangles, 3,276,684 bytes
- `heightmap-surface`: 65,532 triangles, 3,276,684 bytes

## Code changes

- `src/app/page.tsx`
  - Added real source/preview images in homepage proof strip.
  - Replaced CSS-only proof symbols with `next/image` assets.

- `src/app/[slug]/page.tsx`
  - Added real source → generated STL preview layout on `/samples`.
  - Added `Download sample STL` link per sample.
  - Used `next/image`.

- `src/lib/tools.ts`
  - Added real asset paths and accurate sample metrics to `sampleWorkflows`.

- `src/app/globals.css`
  - Added real image card styles.
  - Improved proof strip image readability.
  - Changed `/samples` preview card to clearer Source → Generated STL preview two-column layout.
  - Changed preview images to `object-fit: contain` to avoid cropping.
  - Made `Open workflow` primary and `Download sample STL` secondary.
  - Added mobile responsive rules for real sample cards.

- `scripts/generate_real_sample_assets.py`
  - New reusable script to generate source PNG, call `/api/stl/convert`, parse STL triangles, and render static preview PNGs.

## Local verification

Command:

```bash
npm run lint && npm run build && node scripts/home_responsive_qa.js && python3 scripts/step11_core_tool_qa.py
```

Result: PASS.

Responsive QA:

- `issueCount`: 0
- desktop overflow: false
- tablet overflow: false
- mobile overflow: false
- mobile scrollWidth: 390
- mobile heroHeight: 698
- hasSlider: true
- tabCount: 3

Core STL QA:

- transparentCoverage: 0.0771
- whiteBgCoverage: 0.1406
- detail96: 96 × 48, 5068 triangles, 253,484 bytes
- detail320: 256 × 128, 26,620 triangles, 1,331,084 bytes

## Visual QA

Homepage:

- Real source PNG and generated STL preview images appear in proof strip.
- Visual review: no blocking issue; more mature than CSS-only proof.
- Minor tuning applied after review: lighter grid and slightly larger preview image.

Samples page:

- Initial review found source→preview relationship insufficiently clear and preview cropping risk.
- Fixed by using explicit Source image → Generated STL preview layout.
- Switched preview image to `contain`.
- Made `Open workflow` primary CTA and `Download sample STL` secondary.
- Follow-up visual review: no blocking issue.

Local browser upload QA:

- `/image-to-stl?real-assets=upload-final`
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
c0949a8d-d900-457c-babf-a0291ecf07c1
```

Static assets uploaded to Cloudflare included:

- source PNGs
- preview PNGs
- sample STL files
- manifest JSON

## Production verification

URL checks:

- `http://pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/` → code 200
- `https://www.pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/samples` → code 200
- `https://pngtostl.net/samples/logo-badge-preview.png` → code 200, image/png
- `https://pngtostl.net/samples/logo-badge.stl` → code 200, model/stl

Content checks:

- Homepage contains real asset paths.
- `/samples` contains real asset paths and sample STL links.
- `/samples/manifest.json` served with real asset metadata.
- `/sitemap.xml` served correctly; it is expected not to include image/STL asset URLs.

Production API smoke:

- `POST https://pngtostl.net/api/stl/convert`
- status 200: true
- content-type STL: true
- output bytes: 1,843,084
- triangle header present: true
- header starts with `pngtostl relief 96x96`

Production browser upload QA:

- `/image-to-stl?real-assets=prod-upload-final`
- beforeDisabled: true
- afterDisabled: false
- buttonText: `Generate STL`
- downloadDisplay: `block`
- hasBlob: true
- message: STL ready
- metrics visible: triangles, file size, coverage

## Current status

DONE. The site now uses real generated PNG→STL sample assets rather than only CSS symbolic illustrations.

## Next optional improvement

If continuing design polish later:

1. Add a direct homepage proof-strip link to `/samples`.
2. Add a small gallery filter on `/samples` by workflow type.
3. Generate one or two more visually distinct source images from real public-domain-like patterns, but keep file sizes controlled.
4. Consider converting sample STL downloads to compressed `.zip` only if bandwidth becomes a concern.

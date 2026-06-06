# pngtostl.net real-sample gallery polish checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `81b93e78-3e99-421d-9521-e15f9f104b1e`

## Goal

Continue after the mature visual redesign by improving the site with more realistic tool/product proof:

- Unify upload CTA wording.
- Add a homepage proof strip with concrete source → output examples.
- Upgrade `/samples` from text-heavy example cards to professional source → mesh case cards.
- Reduce mobile risk by shortening metrics labels and widening mobile CTAs.

## Changes shipped

### Homepage

- Unified hero dropzone CTA from `Choose image` to `Upload image`.
- Added proof strip after the hero:
  - Logo badge: `transparent PNG → 95 mm raised plate`, `18k–42k triangles`.
  - Photo lithophane: `portrait JPG → 0.8–3.2 mm panel`, `thickness preview`.
  - Heightmap surface: `grayscale PNG → terrain-like relief`, `detail-scaled mesh`.
- Added proof strip heading:
  - `Pick an output type`
  - `Start from the print result you want.`
- Added source → arrow → mesh mini visuals for each proof card.

### Samples page

- Upgraded `/samples` cards to `proSampleCard` layout.
- Added large source → mesh visual area per workflow.
- Added compact metrics pills.
- Added route-specific visual styling for:
  - `/logo-to-stl`
  - `/image-to-stl`
  - `/lithophane-generator`
  - `/heightmap-to-stl`
- Mobile tuning:
  - Cards fold to single column.
  - Metrics labels shortened.
  - `Open workflow` CTA becomes full-width on smaller screens.

### Metrics wording shortened

- Logo: `18k–42k triangles · STL only`
- Universal relief: `Triangles · file size · coverage`
- Lithophane: `Thickness: 0.8–3.2 mm`
- Heightmap: `Detail affects STL size`

## Verification

### Local quality gate

Command:

```bash
npm run lint && npm run build && node scripts/home_responsive_qa.js && python3 scripts/step11_core_tool_qa.py
```

Result: PASS.

Responsive QA:

- issueCount: 0
- Desktop overflow: false
- Tablet overflow: false
- Mobile overflow: false
- Mobile scrollWidth: 390
- Mobile heroHeight: 698
- Slider present: true
- Tabs count: 3

Core STL QA:

- transparentCoverage: 0.0771
- whiteBgCoverage: 0.1406
- detail96: 96 × 48, 5068 triangles, 253484 bytes
- detail320: 256 × 128, 26620 triangles, 1331084 bytes

### Local browser upload QA

Route:

```text
http://localhost:3030/image-to-stl?proof=upload-final
```

Result:

- Button disabled before upload: true
- Button enabled after upload: true
- Generate button text: `Generate STL`
- Download display: block
- Blob download URL: true
- Message: STL ready
- Metrics visible: triangles, file size, coverage

### Production deployment

Command:

```bash
npm run cf:build && npm run cf:deploy
```

Result: PASS.

Cloudflare Worker Version:

```text
81b93e78-3e99-421d-9521-e15f9f104b1e
```

### Production URL checks

- `http://pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/` → code 200
- `https://www.pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/samples` → code 200
- `https://pngtostl.net/image-to-stl` → code 200

Content checks:

- Homepage contains `Pick an output type` and `Start from the print result you want`.
- `/samples` contains `18k–42k triangles` and `sampleSourceShape`.
- `/image-to-stl` contains `Preview, validate, download`.
- `/sitemap.xml` contains `/samples`, `/image-to-stl`, `/png-to-stl`.

### Production API smoke

Endpoint:

```text
POST https://pngtostl.net/api/stl/convert
```

Result:

- status 200: true
- content-type STL: true
- bytes: 1843084
- triangle header present: true
- header starts with: `pngtostl relief 96x96`

### Production browser upload QA

Route:

```text
https://pngtostl.net/image-to-stl?proof=prod-upload-final
```

Result:

- Button disabled before upload: true
- Button enabled after upload: true
- Generate button text: `Generate STL`
- Download display: block
- Blob download URL: true
- Message: STL ready
- Metrics visible: triangles, file size, coverage

## Files changed

- `src/app/page.tsx`
- `src/app/[slug]/page.tsx`
- `src/app/globals.css`
- `src/lib/tools.ts`

## Next suggested design improvement

The site is now stronger visually, but for another maturity step it should use actual generated STL screenshots/assets instead of CSS-only symbolic shapes:

1. Generate 3–6 real sample STL outputs.
2. Capture front/top preview screenshots from the lightweight canvas or a slicer/viewer.
3. Replace some CSS symbols with real output images.
4. Add a compact `Examples` link/anchor from the homepage proof strip to `/samples`.

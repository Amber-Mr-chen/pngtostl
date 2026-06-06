# pngtostl.net natural workflow examples redesign checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `e1cccec6-6997-4de2-b87e-ab2c097b6895`

## Owner feedback

Owner reported the homepage example/showcase area was still not acceptable:

- "一点都不真实、自然、整齐"
- Previous tabs + 4-stage thumbnails + comparison slider felt artificial and messy.
- The examples needed to be fully re-optimized, not patched incrementally.

## Decision

Replaced the old HomeShowcase interaction model instead of continuing CSS patches:

- Removed tabs.
- Removed 4-stage mini workflow row.
- Removed comparison slider.
- Rebuilt the section as 3 consistent real workflow cards:
  - Input image pane
  - Arrow
  - Generated STL preview pane
  - Workflow copy, output, mesh metrics, CTA

This is closer to a mature SaaS/tool-site sample section and avoids translated label overlap, small thumbnails, and artificial slider UI.

## Code changes

### `src/components/HomeShowcase.tsx`

- Rewritten as static real workflow cards.
- Uses real sample assets:
  - `/samples/logo-badge-source.png`
  - `/samples/logo-badge-preview.png`
  - `/samples/lithophane-panel-source.png`
  - `/samples/lithophane-panel-preview.png`
  - `/samples/heightmap-surface-source.png`
  - `/samples/heightmap-surface-preview.png`
- Keeps `MiniToolExample` for the other homepage tool cards.

### `src/app/globals.css`

- Added `.naturalShowcase`, `.naturalWorkflowGrid`, `.naturalWorkflowCard`, `.naturalWorkflowVisual`, `.naturalImagePane`, `.inputPane`, `.previewPane`, `.naturalWorkflowCopy`, `.naturalShowcaseFooter`.
- Removed old HomeShowcase override block for tabs/stages/compare slider.
- Added mobile rules so input and preview images remain visible and do not collapse.
- Added special heightmap visual treatment to increase contrast and prevent blank/unfinished appearance.

### `scripts/home_responsive_qa.js`

- Updated QA from old tab/slider assumptions to new workflow card checks:
  - 3 `.naturalWorkflowCard` cards exist.
  - Each card has at least two images.
  - Each card has CTA href.
  - Images are not collapsed below 40px.
  - No horizontal overflow.

### Sample assets and metrics

- Re-ran real sample asset generation through local API.
- Rewrote sample STL files and manifest for consistency.
- Confirmed manifest and STL headers match.
- Synchronized Logo metric from stale `21,744 triangles · 1.1 MB` back to current real generated value:
  - `17,940 triangles · 897 KB STL`

Files updated include:

- `public/samples/*.png`
- `public/samples/*.stl`
- `public/samples/manifest.json`
- `scripts/polish_sample_visual_assets.py`
- `src/app/page.tsx`
- `src/lib/tools.ts`

## Local verification

Commands passed:

- `npm run lint`
- `npm run build`
- `node scripts/home_responsive_qa.js`
- `python3 scripts/step11_core_tool_qa.py`
- Manifest/STL consistency Python check

Results:

- Responsive QA issue count: `0`
- Core tool QA: `PASS`
- Manifest/STL consistency: `PASS`

Local responsive metrics:

- Desktop:
  - 3 workflow cards
  - card width about `1180px`
  - no overflow
- Tablet:
  - 3 workflow cards
  - no overflow
- Mobile:
  - 3 workflow cards
  - input images no longer collapse
  - preview images visible
  - no overflow

Manifest/STL values:

- `logo-badge`: `17,940 triangles`, `897,084 bytes`
- `universal-relief`: `65,532 triangles`, `3,276,684 bytes`
- `lithophane-panel`: `65,532 triangles`, `3,276,684 bytes`
- `heightmap-surface`: `65,532 triangles`, `3,276,684 bytes`

## Production verification

Deployment:

- Cloudflare Worker version: `e1cccec6-6997-4de2-b87e-ab2c097b6895`

Production HTTP checks:

- `/`: `200 text/html`
- `/samples/manifest.json`: `200 application/json`
- `/samples/heightmap-surface-source.png`: `200 image/png`
- `/samples/heightmap-surface-preview.png`: `200 image/png`
- `/samples/heightmap-surface.stl`: `200 model/stl`

Production browser metrics:

- Old UI removed:
  - tabs: `0`
  - slider: `false`
  - workflow stages: `0`
- New cards: `3`
- Logo metric present: `17,940 triangles`
- Stale `21,744` metric: `false`
- Horizontal overflow: `false`
- After lazy loading, Heightmap images display normally:
  - source: `164x164`
  - preview: `364x235`

Production API regression:

- `POST /api/stl/convert`: `200`
- Content type: `model/stl`
- Bytes: `1,843,084`
- STL header present: true

Production visual check:

- Real workflow examples are now realistic, natural, and orderly.
- Three workflow cards clearly show input -> STL preview.
- Heightmap no longer looks blank/unloaded.
- No major blocking visual issue remains.
- Optional future polish: slightly increase lithophane/heightmap preview contrast.

## Status

DONE for this rework and deployed.

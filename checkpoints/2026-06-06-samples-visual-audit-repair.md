# pngtostl.net samples visual audit and repair checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `8425db8d-8b7e-4f6e-9f7a-9a1a8950ea89`

## User finding

Owner reported that `/samples` example images did not feel right. Screenshot showed the four sample cards looking like decorative icons rather than credible image-to-STL workflow examples.

## Diagnosis

- Code already rendered `sourceImage -> previewImage`, but visual treatment made previews feel small/decorative.
- Old `.sampleArt span` CSS polluted real sample labels, making image areas feel like legacy icon placeholders.
- Source/preview/STL needed to remain consistent after improving source assets.
- Logo preview was mostly acceptable; universal relief, lithophane, and heightmap needed stronger real-output cues.

## Changes

### Assets

Added script:

- `scripts/polish_sample_visual_assets.py`

Regenerated/polished:

- `public/samples/logo-badge-source.png`
- `public/samples/logo-badge-preview.png`
- `public/samples/logo-badge.stl`
- `public/samples/universal-relief-source.png`
- `public/samples/universal-relief-preview.png`
- `public/samples/universal-relief.stl`
- `public/samples/lithophane-panel-source.png`
- `public/samples/lithophane-panel-preview.png`
- `public/samples/lithophane-panel.stl`
- `public/samples/heightmap-surface-source.png`
- `public/samples/heightmap-surface-preview.png`
- `public/samples/heightmap-surface.stl`
- `public/samples/manifest.json`

Source/STL/preview are now aligned from the same regenerated source files.

Manifest / real STL metrics:

- `logo-badge`: 21,744 triangles, 1,087,284 bytes
- `universal-relief`: 65,532 triangles, 3,276,684 bytes
- `lithophane-panel`: 65,532 triangles, 3,276,684 bytes
- `heightmap-surface`: 65,532 triangles, 3,276,684 bytes

### Code / layout

- `src/lib/tools.ts`
  - Updated logo metrics from old `17,940 triangles · 876 KB STL` to `21,744 triangles · 1.1 MB STL`.

- `src/components/SampleGalleryFilter.tsx`
  - Renamed visual labels from `Source` / `Generated STL preview` to `Input image` / `Generated STL`.
  - Increased preview image intrinsic size to `720x492`.

- `src/app/globals.css`
  - `/samples` gallery changed to one-column large sample cards.
  - `proSampleCard` visual area enlarged.
  - Preview image now dominates the sample art area; source image is a smaller input comparison.
  - Removed decorative checkerboard dominance.
  - Reset inherited `.sampleArt span` width/height/transform for real sample labels.

## Local verification

Commands passed:

- `npm run lint`
- `npm run build`
- `node scripts/home_responsive_qa.js`
- `python3 scripts/step11_core_tool_qa.py`
- sample asset manifest/STL consistency script

Local `/samples` browser geometry:

- All four cards: art width 655px
- Source image: 146x146px
- Generated STL preview: 405x277px
- Preview share: 0.62 of art width

## Production verification

Deployment:

- Worker version: `8425db8d-8b7e-4f6e-9f7a-9a1a8950ea89`

HTTP checks:

- `/samples`: 200
- `/samples/manifest.json`: 200 application/json
- all four source PNGs: 200 image/png
- all four preview PNGs: 200 image/png
- all four STL downloads: 200 model/stl

Production manifest/STL consistency passed:

- `logo-badge 21744 1087284`
- `universal-relief 65532 3276684`
- `lithophane-panel 65532 3276684`
- `heightmap-surface 65532 3276684`

Production browser geometry after image load:

- All four cards: art width 655px
- Source image: 146x146px
- Generated STL preview: 405x277px
- Preview share: 0.62
- Natural preview images: 1200x820

Production API regression:

- `POST /api/stl/convert`: 200
- content type: `model/stl`
- returned binary has STL triangle header

## Remaining notes

- Lithophane is much more credible now because it shows STL thin plate, mesh, warm backlight, and principle text; portrait detail is still stylized rather than photo-realistic.
- Universal relief now shows a real generated-STL view, but could be further improved later with a more recognizable relief subject if owner wants high-fidelity examples.

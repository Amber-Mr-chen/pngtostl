# pngtostl.net homepage showcase real-sample sync checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `743c9de0-24c3-415c-b904-b3fdb60c3820`

## User finding

Owner shared a screenshot of the homepage mid-page examples area. The page still looked wrong because it showed the old decorative eye/logo mock in the live-style examples, and the proof strip still displayed the old logo metric `17,940 triangles`.

## Diagnosis

- `/samples` had already been repaired with real `Input image -> Generated STL` assets.
- Homepage `proofSamples` referenced the real image paths, but logo metric was stale.
- `HomeShowcase.tsx` still used CSS-only mock artwork (`logoSample`, `lithoSample`, `terrainSample`) instead of the repaired `/samples/*` source/preview assets.
- Proof strip thumbnails used real images but were visually distorted by fixed `height: 76px` and `object-fit: cover`.

## Changes

- `src/app/page.tsx`
  - Updated logo proof metric from `17,940 triangles` to `21,744 triangles`.

- `src/components/HomeShowcase.tsx`
  - Added `next/image` usage.
  - Added real source/preview paths for logo, lithophane, and heightmap samples.
  - Replaced CSS-only mock `DemoArt` with real image rendering using `/samples/*-source.png` and `/samples/*-preview.png`.
  - Keeps tab/slider interaction, but visuals now come from real sample assets.

- `src/app/globals.css`
  - Added `.realDemoArt`, `.demoArtImage`, `.demoArtLabel` styles for real image display in the showcase comparison.
  - Adjusted proof card grid and thumbnail treatment.
  - Fixed proof thumbnails to preserve source square and preview landscape aspect ratios.
  - Removed preview thumbnail scale distortion.

## Local verification

Commands passed:

- `npm run lint`
- `npm run build`
- `node scripts/home_responsive_qa.js`
- `python3 scripts/step11_core_tool_qa.py`

Browser local checks:

- `document.body.innerText.includes('17,940') === false`
- `.logoSample,.lithoSample,.terrainSample` count: `0`
- `.realDemoArt` count: `9`
- homepage proof images use `/samples/*-source.png` and `/samples/*-preview.png`
- homepage showcase images use `/samples/*-source.png` and `/samples/*-preview.png`
- no horizontal overflow

## Production verification

Deployment:

- Worker version: `743c9de0-24c3-415c-b904-b3fdb60c3820`

HTTP:

- `/`: 200 text/html
- `/samples`: 200 text/html
- `/samples/logo-badge-preview.png`: 200 image/png

Production browser checks:

- old metric `17,940`: false
- `.logoSample,.lithoSample,.terrainSample` count: 0
- `.realDemoArt` count: 9
- proof/showcase images loaded from `/samples/*`
- proof image natural sizes: source 512x512, preview 1200x820
- showcase image natural sizes: source 512x512, preview 1200x820
- no horizontal overflow

Production API regression:

- `POST /api/stl/convert`: 200
- content type: `model/stl`
- bytes: 1,843,084
- STL triangle header present: true

## Notes

The screenshot area should now match the repaired `/samples` page: homepage proof/showcase visuals are no longer decorative mock artwork and no longer use stale logo metrics.

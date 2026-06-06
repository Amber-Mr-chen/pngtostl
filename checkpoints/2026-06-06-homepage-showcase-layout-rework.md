# pngtostl.net homepage HomeShowcase layout rework checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `c292599e-21d9-4f4a-a9e2-a506af385683`

## User finding

Owner shared a screenshot of the homepage HomeShowcase area and reported:

- Text overlapping inside example images.
- Sample images not fully visible.
- The upper row of four example cards was not aligned.
- Requested all examples be re-optimized.

## Root cause

- `HomeShowcase.tsx` had real sample images but still rendered an internal `.demoArtLabel` over each image.
- Chrome/Chinese translation expanded labels like `Flat logo image` / `Raised STL preview`, causing text to overlap inside small thumbnails and duplicate with compare labels.
- Stage cards used old fixed/min-height rules and inherited mock-art assumptions, so real images were too small or visually inconsistent.
- Compare frame was constrained by later CSS overrides to `760x350`, reducing available room for real sample assets.

## Changes

- `src/components/HomeShowcase.tsx`
  - Removed internal `.demoArtLabel` rendering from `DemoArt`.
  - The showcase now relies only on stage captions and the top compare labels.

- `src/app/globals.css`
  - Added HomeShowcase-specific visual QA override.
  - Stage cards now use consistent aspect ratio and min-height.
  - Stage images use `object-fit: contain` and complete image display.
  - Stage grid thumbnails have consistent padding and sizing.
  - Compare frame restored to `860x420` desktop.
  - Compare images fit inside the frame without crop.
  - `.demoArtLabel` forcibly hidden to prevent translated text overlap.
  - Added responsive 2-column tablet and 1-column mobile stage layouts.

## Local verification

Commands passed:

- `npm run lint`
- `npm run build`
- `node scripts/home_responsive_qa.js`
- `python3 scripts/step11_core_tool_qa.py`

Local browser metrics after fix:

- `.demoArtLabel` count: `0`
- Stage cards: four cards all `235x183`, same top coordinate.
- Stage images:
  - Source: `124x124`
  - Relief mesh: `202x138`
  - Print preview: `202x138`
  - Workflow grid thumbnails displayed inside card.
- Compare frame: `860x420`
- Compare images: source `252x252`, preview `640x394`
- Horizontal overflow: `false`

Local visual check:

- Four upper cards aligned.
- Images complete and not cropped.
- No text overlap.
- Compare labels separated and readable.

## Production verification

Deployment:

- Worker version: `c292599e-21d9-4f4a-a9e2-a506af385683`

Production browser metrics:

- `.demoArtLabel` count: `0`
- Stage cards: four cards all `235x183`, same top coordinate.
- Compare frame: `860x420`
- Horizontal overflow: `false`

Production visual check:

- No visible text overlap.
- Upper four example cards aligned.
- Example images display completely.
- Large compare image labels do not overlap.
- Large compare images fit inside frame.

Production API regression:

- `POST /api/stl/convert`: `200`
- Content type: `model/stl`
- Bytes: `1,843,084`
- STL header present: true

## Notes

This fixes the exact screenshot complaint by removing translated text from image interiors and making the example display system stable for real sample assets instead of old CSS mock assumptions.

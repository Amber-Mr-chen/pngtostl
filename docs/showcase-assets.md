# PNGtoSTL Showcase Asset Reproducibility

This project keeps the public assets required by the live site in `public/samples/`.
Large source/reference files and historical render experiments are not committed to the app repository.

There are two asset groups:

- Homepage showcase assets: the Golden Temple GLB plus the six WebP posters and six MP4 turntable videos.
- `/samples` workflow assets: tracked STL/source/preview files referenced by `sampleWorkflows` in `src/lib/tools.ts`. These are used by the Examples page, JSON-LD, and `llms.txt`, so do not delete them just because they are not referenced by homepage JSX.

## Live showcase assets

The homepage currently references:

- `public/samples/golden-temple-web-preview.glb`
- `public/samples/showcase-unified-*.webp`
- `public/samples/showcase-turntable-*.mp4`

These files are intentionally kept because the production homepage and model/video showcase depend on them.

## Regeneration scripts

Keep these scripts with the repo because they document the current asset pipeline:

- `scripts/export_golden_temple_web_preview.py`
  - Rebuilds the compressed Golden Temple web GLB from the original local source asset.
  - The source GLB is not committed; it is kept as a local/reference asset outside the repo.
- `scripts/generate_unified_showcase_images.py`
  - Generates the unified light-background WebP poster/fallback images.
- `scripts/generate_showcase_turntable_videos.py`
  - Generates the 10s/30fps H.264 turntable MP4 videos from the unified WebP images.

## Local backup location

Historical source assets and experimental scripts were moved outside the repo under:

- `/root/projects/_asset-backups/pngtostl/`

Do not add those backup directories back to git unless a specific source asset must become part of a reproducible release package.

## Deployment check

After changing showcase assets, run:

```bash
npm run build && npm run cf:build && npm run cf:deploy
```

Then verify the production asset URLs on `https://pngtostl.net/` return `200`.

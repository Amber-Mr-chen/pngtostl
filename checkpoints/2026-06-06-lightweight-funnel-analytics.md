# pngtostl.net lightweight funnel analytics checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `1beacc7f-8a7f-42cb-ab51-ca181dc4f600`

## Goal

Add lightweight, GA-compatible funnel events after the real sample gallery and workflow filter were shipped.

Target events:

- `homepage_view_examples_click`
- `samples_filter_click`
- `sample_open_workflow_click`
- `sample_download_click`
- `converter_generate_success`
- `converter_download_click`

## Implementation

- Added `src/lib/analytics.ts`
  - `trackEvent(event, payload)` helper.
  - Writes to `window.pngtostlEvents` for browser QA/debug.
  - Calls `window.gtag('event', ...)` if GA/gtag exists.
  - Pushes to `window.dataLayer` if available.
  - No-op on server.

- Added `src/components/TrackedLink.tsx`
  - Client-side wrapper around Next `Link`.
  - Used for homepage `View all examples` CTA.

- Updated `src/app/page.tsx`
  - Tracks `homepage_view_examples_click` with `{ location: 'home_proof_strip' }`.

- Updated `src/components/SampleGalleryFilter.tsx`
  - Tracks `samples_filter_click` with filter key/label.
  - Tracks `sample_open_workflow_click` with sample/category/route.
  - Tracks `sample_download_click` with sample/category/stl_path/file_size_label.

- Updated `public/converter.js`
  - Existing public converter bootstrap is the live browser path.
  - Upgraded track helper to also write `window.pngtostlEvents` and call `gtag` if present.
  - Tracks `converter_generate_success` after successful `/api/stl/convert` response.
  - Tracks `converter_download_click` when the generated STL download button is clicked.
  - Does not include raw file name in the success/download event payload.

- Updated `src/lib/converter-bootstrap.ts`
  - Added compatible success event for the inline bootstrap path, though current live route uses `public/converter.js`.

## Privacy note

Converter success/download events intentionally do not include raw file names or image content.
Payloads include only:

- tool
- mode
- path
- output_kind
- bytes
- triangles
- coverage

Legacy low-risk events still include file type and approximate input file size only.

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

Browser event QA:

Homepage:

- `homepage_view_examples_click` emitted with `{ location: 'home_proof_strip' }`.

Samples:

- `samples_filter_click` emitted for Lithophane.
- Filter leaves only `Backlit lithophane panel`.
- `sample_download_click` emitted with category `lithophane`, file size `3.1 MB`, and STL path.
- `sample_open_workflow_click` emitted with sample/category/route.

Converter:

- Real PNG upload and `/api/stl/convert` succeeded.
- `converter_generate_success` emitted.
- `converter_download_click` emitted.
- Generated download link uses blob URL.
- Event payload does not contain the test file name.

## Production deployment

Command:

```bash
npm run cf:build && npm run cf:deploy
```

Result: PASS.

Cloudflare Worker Version:

```text
1beacc7f-8a7f-42cb-ab51-ca181dc4f600
```

## Production verification

HTTP:

- `http://pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/` → code 200
- `https://www.pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/samples` → code 200
- `https://pngtostl.net/converter.js` → code 200, `text/javascript`

API:

- `POST https://pngtostl.net/api/stl/convert`
- status 200: true
- content-type STL: true
- bytes: 1,843,084
- triangle header present: true

Production browser event QA:

Homepage:

- `homepage_view_examples_click` emitted.

Samples:

- `samples_filter_click` emitted.
- Lithophane filter leaves only `Backlit lithophane panel`.
- `sample_download_click` emitted.

Converter:

- real upload/generate/download flow passed.
- `converter_generate_success` emitted with bytes `1843084`, triangles `36860`, coverage `0.2467`.
- `converter_download_click` emitted.
- generated download link displayed and uses blob URL.
- payload did not contain raw test file name.

## Status

DONE. Lightweight funnel events are now in place without requiring GA configuration to function or breaking the no-signup converter flow.

# First-week Data Review Plan — pngtostl.net

## Goal

Use real behavior to decide whether to iterate, expand content, or add monetization. Do not add pricing/API/login before usage shows demand.

Companion review template:

- `ops/weekly-data-review-template.md`

## Events already emitted by frontend

Verified in production on 2026-06-07 13:25 CST after deploy version `0ee4c66c-316e-4f4a-a69c-4859a97e555e`.

Events:

Core converter funnel:

- `pngtostl_upload_selected`
- `pngtostl_generate_clicked`
- `pngtostl_generate_success`
- `pngtostl_generate_error`
- `pngtostl_download_clicked`

Sample gallery events:

- `samples_filter_click`
- `sample_open_workflow_click`
- `sample_download_click`

Tool-page proof events:

- `sample_proof_view`
- `sample_proof_open_workflow`
- `sample_proof_download`

Each event should include:

- `tool`
- `mode`
- `path`
- optional `fileType`, `fileSizeKb`, `bytes`, `triangles`, `coverage`, `reason`

## No-data-stage baseline improvements

Completed before waiting for real traffic data:

- Per-tool guidance blocks now explain best inputs, inputs to avoid, and print checks.
- Per-tool FAQ details and FAQPage JSON-LD are available on tool pages.
- Top navigation now has grouped active states so format/helper pages still orient users to the parent workflow.
- Production verification deploy: `a8f31104-355a-463b-9bde-74279fb91a25`.
- `/samples` expanded from 4 baseline workflows to 10 real-world examples on 2026-06-07:
  - Deploy version: `dc0c0302-6a93-46a2-9054-2f36eb51fafd`.
  - Added rubber stamp relief, coin relief medallion, workshop sign plate, pet photo relief, portrait lithophane night light, and terrain heightmap tile.
  - Each expanded sample has source PNG, generated STL, STL-preview PNG, settings, best-for guidance, avoid guidance, and download CTA.
  - Production verified: `/samples` shows 10 cards, 10 STL download links, 20 sample images; browser `fetch` returned HTTP 200 for representative expanded PNG/STL resources; Relief filter shows Universal image relief, Coin relief medallion, and Pet photo relief.
- Tool pages now reuse `/samples` proof assets directly in the conversion flow:
  - Deploy version: `ba8e79e0-87d2-49cf-970a-9940905a5a0b`.
  - Added a "Real output proof" block after the converter/guidance area on relevant tool pages.
  - Each block shows source image, generated STL preview, triangle/file metrics, best-for/avoid notes, an Open workflow link, and a Download STL link.
  - Production verified route-to-proof matching: `/png-to-stl` shows Workshop sign plate + Logo badge relief; `/logo-to-stl` shows Logo badge relief + Rubber stamp relief; `/lithophane-generator` shows Backlit lithophane panel + Portrait lithophane night light; `/heightmap-to-stl` shows Heightmap surface + Terrain heightmap tile; `/jpg-to-stl` shows Pet photo relief + Universal image relief.
  - QA passed: `npm run lint`, `npm run build`, `npm run cf:build`, `npm run cf:deploy`, and homepage responsive QA.
- Tool proof analytics events now track whether examples help conversion:
  - Deploy version: `5847a079-95c6-4367-9b3c-61cd3905b6f6`.
  - Added `sample_proof_view`, `sample_proof_open_workflow`, and `sample_proof_download`.
  - Refactored the proof block into a client component so visibility and click events are captured without changing the server-rendered page content.
  - Production verified on `/png-to-stl`: `sample_proof_view`, `sample_proof_open_workflow`, and `sample_proof_download` reached both `window.pngtostlEvents` and GA4 `dataLayer` with tool, sample, route/category, STL path, and position/sample-count payloads.
  - QA passed: `npm run lint`, `npm run build`, `npm run cf:build`, `npm run cf:deploy`, and homepage responsive QA.

Next no-data-stage candidates, if more work is needed before search data arrives:

- Add comparison/alternative pages only after keyword/SERP validation.
- Consider outbound email setup only if support replies need to come from `support@pngtostl.net`.

## Daily metrics

Acquisition:

- Page views by path.
- Referrers and UTM sources.
- GSC impressions/clicks once available.

Activation:

- Upload selected rate = `pngtostl_upload_selected` / page views on converter pages.
- Generate clicked rate = `pngtostl_generate_clicked` / `pngtostl_upload_selected`.
- Generate success rate = `pngtostl_generate_success` / `pngtostl_generate_clicked`.
- Download rate = `pngtostl_download_clicked` / `pngtostl_generate_success`.

Proof-assisted activation:

- Proof visibility rate = `sample_proof_view` / page views on pages with proof blocks.
- Proof open workflow rate = `sample_proof_open_workflow` / `sample_proof_view`.
- Proof sample download rate = `sample_proof_download` / `sample_proof_view`.
- Proof-to-upload assisted signal = converter uploads on proof pages / `sample_proof_view`.
- Best proof sample by intent = top `sample` by `sample_proof_open_workflow` plus `sample_proof_download`.
- Weak proof sample = visible sample with near-zero open/download events after enough page views.

Sample gallery activation:

- Gallery filter engagement = `samples_filter_click` / `/samples` page views.
- Gallery workflow click rate = `sample_open_workflow_click` / `/samples` page views.
- Gallery STL download rate = `sample_download_click` / `/samples` page views.

Quality:

- Error count and top error reasons.
- Median STL bytes.
- Median triangle count.
- Most used mode.

Decision rules

Core funnel:

- If upload rate is low: improve hero, examples, and first-screen CTA.
- If generate rate is low: simplify controls and defaults.
- If success rate is low: inspect errors, file size limits, and unsupported formats.
- If download rate is low: improve preview confidence and output explanation.
- If a workflow dominates: make that workflow the next content/SEO priority.

Proof and sample decisions:

- If proof visibility is low on a page with traffic: move the proof block higher, tighten above-the-fold copy, or add a jump link near the converter.
- If proof visibility is healthy but proof open/download is low: replace the first proof card with a more direct use case for that route.
- If a proof sample gets high downloads but low converter uploads: turn that sample into a stronger downloadable-example CTA and add an adjacent "try your own image" CTA.
- If proof open workflow clicks are high for a sample category: prioritize that category for the next SEO/supporting page only after SERP validation.
- If `/samples` gallery downloads are high but tool-page proof downloads are low: cross-link more aggressively from gallery winners back to their converter pages.
- If proof events are absent while page views exist: treat analytics as broken before making content decisions.
- Do not reorder samples based on fewer than 100 proof views per route unless there is a clear bug or owner-reported confusion.

## Monetization checkpoint

Only consider pricing/Pro/API after at least one of:

- Consistent downloads from multiple external referrers.
- Repeated large-file or batch workflow requests.
- Contact requests asking for API/commercial use.
- Clear ad/affiliate opportunity from 3D printing traffic.

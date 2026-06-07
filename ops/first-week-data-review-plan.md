# First-week Data Review Plan — pngtostl.net

## Goal

Use real behavior to decide whether to iterate, expand content, or add monetization. Do not add pricing/API/login before usage shows demand.

## Events already emitted by frontend

Verified in production on 2026-06-07 13:25 CST after deploy version `0ee4c66c-316e-4f4a-a69c-4859a97e555e`.

Events:

- `pngtostl_upload_selected`
- `pngtostl_generate_clicked`
- `pngtostl_generate_success`
- `pngtostl_generate_error`
- `pngtostl_download_clicked`

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

Next no-data-stage candidates, if more work is needed before search data arrives:

- Expand `/samples` with pet photo relief, stamp, coin relief, sign plate, and terrain use cases.
- Add comparison/alternative pages only after keyword/SERP validation.
- Consider outbound email setup only if support replies need to come from `support@pngtostl.net`.

## Daily metrics

Acquisition:

- Page views by path.
- Referrers and UTM sources.
- GSC impressions/clicks once available.

Activation:

- Upload selected rate = upload_selected / page_view.
- Generate clicked rate = generate_clicked / upload_selected.
- Generate success rate = generate_success / generate_clicked.
- Download rate = download_clicked / generate_success.

Quality:

- Error count and top error reasons.
- Median STL bytes.
- Median triangle count.
- Most used mode.

Decision rules

- If upload rate is low: improve hero, examples, and first-screen CTA.
- If generate rate is low: simplify controls and defaults.
- If success rate is low: inspect errors, file size limits, and unsupported formats.
- If download rate is low: improve preview confidence and output explanation.
- If a workflow dominates: make that workflow the next content/SEO priority.

## Monetization checkpoint

Only consider pricing/Pro/API after at least one of:

- Consistent downloads from multiple external referrers.
- Repeated large-file or batch workflow requests.
- Contact requests asking for API/commercial use.
- Clear ad/affiliate opportunity from 3D printing traffic.

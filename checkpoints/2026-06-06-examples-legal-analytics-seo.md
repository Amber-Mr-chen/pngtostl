# pngtostl.net checkpoint — examples, legal pages, analytics, differentiated SEO

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Cloudflare Worker: `pngtostl`
Cloudflare Version ID: `792032fe-4bf7-44d2-8c48-b8f9eaa25d51`

## Goal
Continue the maturity pass after the converter workspace upgrade:

- Add real workflow sample gallery.
- Add Privacy, Terms, and Contact pages.
- Add footer links to legal/support pages.
- Add lightweight frontend analytics events for upload/generate/download/error without sending image contents.
- Differentiate PNG/JPG/Image SEO content and FAQ so format pages are not thin title swaps.
- Keep GSC/Bing submission out of scope until owner wants to use login state.

## Implemented

### Sample gallery
Route: `/samples`

Added four crawlable workflow examples:

- Logo badge relief
- Universal image relief
- Backlit lithophane panel
- Heightmap surface

Each sample includes:

- input type
- output type
- recommended settings
- best-for cases
- avoid/failure cases
- link to matching workflow

### Legal/support pages
Routes added:

- `/privacy`
- `/terms`
- `/contact`

Content is aligned with current product behavior:

- conversion endpoint receives selected file for request processing
- no public hosting/account storage claim
- generated STL returned to browser
- analytics events do not need image contents
- user owns responsibility for source image rights and printability checks
- no guaranteed printability claim
- support email: `support@pngtostl.net`

### Footer and sitemap
Footer now links:

- Image to STL
- Logo to STL
- Lithophane
- Heightmap
- Examples
- FAQ
- Privacy
- Terms
- Contact
- Sitemap

Sitemap now includes:

- `/samples`
- `/privacy`
- `/terms`
- `/contact`

### Analytics hooks
`public/converter.js` now emits events via both:

- `window.dispatchEvent(new CustomEvent('pngtostl:event', ...))`
- `window.dataLayer.push(...)`

Events:

- `pngtostl_upload_selected`
- `pngtostl_generate_clicked`
- `pngtostl_generate_success`
- `pngtostl_generate_error`
- `pngtostl_download_clicked`

Payload avoids image contents and includes practical product metadata:

- tool route
- mode
- path
- file type
- file size KB
- output kind
- bytes
- triangle count
- coverage
- error reason/status when relevant

### SEO/content differentiation
Strengthened PNG/JPG/Image pages:

- `/png-to-stl`: transparent PNG, alpha handling, icons, emojis, silhouettes, flat graphics.
- `/jpg-to-stl`: photo/JPG caveats, lithophane vs relief decision, noisy photo relief limitations.
- `/image-to-stl`: universal workflow chooser, mode selection guidance, STL color limitation.

## Verification

Local:

- `npm run build`: passed
- `node scripts/home_responsive_qa.js`: passed, `issueCount: 0`
- `python3 scripts/step11_core_tool_qa.py`: passed

Production deploy:

- `npm run cf:build && npm run cf:deploy`: passed
- Worker Version ID: `792032fe-4bf7-44d2-8c48-b8f9eaa25d51`

Production route checks:

- `/`: 200
- `/samples`: 200, contains `Logo badge relief`
- `/privacy`: 200, contains `Analytics events`
- `/terms`: 200, contains `Output limitations`
- `/contact`: 200, contains `support@pngtostl.net`
- `/png-to-stl`: 200, contains transparent PNG-specific FAQ
- `/jpg-to-stl`: 200, contains JPG vs lithophane FAQ
- `/image-to-stl`: 200, contains mode-selection FAQ
- `/sitemap.xml`: 200 and contains static pages

Production API smoke:

- `POST /api/stl/convert`: HTTP/2 200
- STL content type: true
- output bytes: 204684

Production browser analytics verification:

- Synthetic PNG selected on `/image-to-stl`
- Status reached `STL ready`
- Download visible
- `window.dataLayer` contained:
  - `pngtostl_upload_selected`
  - `pngtostl_generate_clicked`
  - `pngtostl_generate_success`
- custom `pngtostl:event` listener received the same events

Compliance scan:

- No visible high-risk guarantee terms found in TSX content for:
  - guaranteed
  - 100% accurate
  - official
  - unlimited free
  - never upload
  - delete immediately
  - instant/instantly

## Remaining future work

- GSC/Bing sitemap submission when login state is available.
- Optional: connect GA4/Clarity/Bing UET to `dataLayer` events.
- Optional: add real sample input images/screenshots/STL thumbnails instead of abstract sample cards.
- Optional: add Cookie notice only if future analytics setup introduces cookies requiring notice.

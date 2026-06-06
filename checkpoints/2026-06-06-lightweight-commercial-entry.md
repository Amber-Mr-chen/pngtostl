# pngtostl.net lightweight commercial entry checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `c87b89d7-54ad-4485-8d1e-4b23c63d676c`

## Goal

Add lightweight commercial-demand capture without adding login/register/profile or fake payment flows.

## Implemented

- Added `/developers`
  - API and batch workflow lead capture.
  - Commercial use request copy.
  - `mailto:` CTA with structured request body.
  - Honest wording: API access is not self-serve yet.

- Added `/pricing`
  - Free converter available now.
  - Pro planned, not active.
  - Batch by request.
  - API early-access interest.
  - Explicitly says no payment is collected on the page.
  - Explains why there is no forced account yet.

- Updated `/contact`
  - Added API, batch, and commercial use card.
  - Added links to `/developers` and `/pricing`.
  - Updated page description and static metadata.

- Updated homepage navigation/footer
  - Added Pricing and API links to top navigation.
  - Added Pricing and API links to footer.

- Updated `staticPages`
  - `/developers` and `/pricing` now included in generated static params and sitemap.

## Rationale

No login/register/profile was added because the current core task is one-shot conversion:

- upload image
- generate STL
- download STL

Adding account friction before saved history, quota, API keys, billing, or commercial usage signals would likely reduce SEO conversion. This change captures commercial/API/batch demand first.

## Local verification

Command:

```bash
npm run lint && npm run build && node scripts/home_responsive_qa.js && python3 scripts/step11_core_tool_qa.py
```

Result: PASS.

Build now prerenders 26 pages.

Responsive QA:

- issueCount: 0
- desktop overflow: false
- tablet overflow: false
- mobile overflow: false
- mobile scrollWidth: 390
- hasSlider: true
- tabCount: 3

Core STL QA:

- PASS
- detail96: 96 × 48, 5068 triangles, 253,484 bytes
- detail320: 256 × 128, 26,620 triangles, 1,331,084 bytes

Browser local QA:

- `/developers` renders heading, Request API access, View planned options, batch/API/commercial cards.
- `/pricing` renders Free/Pro/Batch/API and states no payment is collected.
- `/contact` renders API, batch, or commercial use card and links to developers/pricing.
- `/sitemap.xml` contains `/developers` and `/pricing`.
- `/image-to-stl` real browser upload/generate regression passed.

## Production deployment

Command:

```bash
npm run cf:build && npm run cf:deploy
```

Result: PASS.

Cloudflare Worker Version:

```text
c87b89d7-54ad-4485-8d1e-4b23c63d676c
```

## Production verification

HTTP:

- `http://pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/` → code 200
- `https://www.pngtostl.net/` → `https://pngtostl.net/`, code 200, redirects 1
- `https://pngtostl.net/developers` → code 200
- `https://pngtostl.net/pricing` → code 200
- `https://pngtostl.net/contact` → code 200
- `https://pngtostl.net/sitemap.xml` → code 200, application/xml

Content checks:

- Homepage contains `/developers` and `/pricing` links.
- `/developers` contains `Developers, batch conversion` and `Request API access`.
- `/pricing` contains `PNGtoSTL pricing`, `No payment is collected`, and `No signup required`.
- `/contact` contains `API, batch, or commercial use`.
- `/sitemap.xml` contains `/developers` and `/pricing`.

API:

- `POST https://pngtostl.net/api/stl/convert`
- status 200: true
- content-type STL: true
- bytes: 1,843,084
- triangle header present: true

Production browser QA:

- `/developers` rendered correctly.
- `/pricing` rendered correctly.
- `/contact` rendered correctly.
- `/image-to-stl` real browser upload/generate regression passed.
- Generated STL download link displayed and used blob URL.
- Events included `pngtostl_upload_selected`, `pngtostl_generate_clicked`, `converter_generate_success`.

## Status

DONE. Lightweight commercial capture is live without adding account/paywall friction.

# pngtostl.net checkpoint — 13-skill audit optimizations

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Cloudflare Worker: `pngtostl`
Deployment Version ID: `2ec7b2a8-05e2-4949-9ae7-fed0042a301c`

## User request

Apply all optimizations from the 13-skill ShipSolo audit in recommended order.

## Implemented

### P1 fixed

- Replaced homepage raw anchor with Next.js `<Link>`:
  - `src/app/page.tsx`
  - Fixes `npm run lint` failure.
- Added canonical HTTP/HTTPS/www middleware handling:
  - `http://pngtostl.net/` -> `https://pngtostl.net/`
  - `http://www.pngtostl.net/` -> `https://pngtostl.net/`
  - `https://www.pngtostl.net/` -> `https://pngtostl.net/`
  - `middleware.ts`

### Schema fixed

- Removed `SearchAction` from root WebSite JSON-LD because there is no actual search feature yet.
- Added honest WebSite description instead.

### Samples improved

- Added source preview/result preview/expected metrics fields to sample workflows.
- Rendered evidence blocks on `/samples`.
- Added sample evidence styling.

### Legal/contact thickened

- `/privacy`: Last updated, server/platform logs, no project library, analytics/cookie future-provider note, IP complaint guidance.
- `/terms`: Last updated, geometry/no color limitation, slicer/scale/printer responsibility, availability/paid terms, no professional advice, abuse/access clause.
- `/contact`: support, bug report template, rights/IP concerns, useful links.

### Mobile improved

- Compressed mobile homepage hero and upload panel:
  - smaller title
  - reduced upload panel height
  - reduced spacing
  - hidden extra tool panel note on mobile
- QA mobile hero height improved from previous audit value 1314 to 1043.

### Ops/data docs added

- `ops/gsc-bing-submission-checklist.md`
- `ops/coldstart-assets-utm-plan.md`
- `ops/first-week-data-review-plan.md`

## Local verification

Command:

```bash
npm run lint && npm run build && node scripts/home_responsive_qa.js && python3 scripts/step11_core_tool_qa.py
```

Result: PASS.

Evidence:

- lint: PASS
- Next build: PASS
- responsive QA: `issueCount: 0`
- mobile scrollWidth: 390 / width: 390, no overflow
- mobile heroHeight: 1043
- core STL QA: PASS
- transparentCoverage: 0.0771
- whiteBgCoverage: 0.1406
- detail96 triangles: 5068
- detail320 triangles: 26620

## Production verification

Domain redirects:

- `http://pngtostl.net/` -> `https://pngtostl.net/`, redirects=1, code=200
- `http://www.pngtostl.net/` -> `https://pngtostl.net/`, redirects=1, code=200
- `https://www.pngtostl.net/` -> `https://pngtostl.net/`, redirects=1, code=200
- `https://pngtostl.net/` -> code=200, redirects=0

Route/content checks:

- `/`: 200, contains `Start converting`
- `/samples`: 200, contains `Expected metrics`
- `/privacy`: 200, contains `Last updated: 2026-06-06`
- `/terms`: 200, contains `Abuse and access`
- `/contact`: 200, contains `Bug report template`
- `/image-to-stl`: 200, contains `Preview, validate, download`
- `/sitemap.xml`: 200, contains contact URL
- `/robots.txt`: 200, points to sitemap
- `/llms.txt`: 200, contains PNGtoSTL

Production API:

- `POST https://pngtostl.net/api/stl/convert`: HTTP/2 200
- content-type: `model/stl`
- bytes: 1843084
- triangle-count: 36860
- occupied ratio: 0.2657
- STL header: `pngtostl relief 96x96`

Browser verification:

- `/image-to-stl?verify=final` loaded.
- Button disabled before upload, enabled after upload.
- Synthetic PNG upload and generate succeeded.
- Download STL visible and href is blob URL.
- dataLayer events:
  - `pngtostl_upload_selected`
  - `pngtostl_generate_clicked`
  - `pngtostl_generate_success`
- custom events also fired.
- SearchAction JSON-LD absent.

## Remaining external/manual items

- Submit sitemap in GSC/Bing after owner/account login.
- Connect GA4/Clarity/Cloudflare Web Analytics if desired.
- Prepare real screenshots and community launch assets using the new ops docs.

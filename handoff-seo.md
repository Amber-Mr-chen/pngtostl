# SEO Stage Handoff

## Current Conclusion
- Status: DONE_LOCAL / BLOCKED_LIVE_SUBMISSION
- Summary: Local technical SEO basics are now present: sitemap, robots, canonical alternates, language alternates, SoftwareApplication JSON-LD, and FAQPage JSON-LD. Live SEO submission is blocked until deployment, Cloudflare/DNS, GSC/Bing access, and owner approval are confirmed.

## Key Inputs
- Project: pngtostl.net
- Stage: 10-seo
- Upstream files: PRD.md, PAGE_MATRIX.md, COPY_FREEZE.md, COMPLIANCE.md, DESIGN_HANDOFF.md, CONTENT_FIT_MATRIX.md

## Deliverables
- SEO_RECHECK.md
- Metadata/canonical updates in app routes
- SoftwareApplication JSON-LD on `/`
- FAQPage JSON-LD on `/faq`

## Confirmed Locally
- `/api/convert` is excluded from sitemap.
- Public routes are listed in sitemap.
- Page copy avoids live-STL claims.
- `npm run lint` and `npm run build` passed after SEO changes.

## Waiting
- Production URL verification
- HTTP -> HTTPS and www -> non-www redirect verification
- GSC and Bing Webmaster sitemap submission
- Rendered browser/mobile SEO checks

## Risks
- P0: public launch remains blocked without deployment and search console access.
- P1: `/image-to-stl` is thin and should be reviewed before first crawl wave.
- P2: FAQ schema should be rechecked after any answer wording changes.

[BLOCKED_LIVE_SUBMISSION]

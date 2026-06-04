# Backend Stage Handoff

## Current Conclusion
- Status: DONE_LOCAL / NEEDS_RUNTIME_REVIEW
- Summary: `/api/convert` now performs a real local PNG-to-STL conversion and returns an in-memory ASCII STL file. It does not persist uploaded PNGs or generated STL files. Production deploy still needs Cloudflare/OpenNext runtime verification.

## Key Inputs
- Project: pngtostl.net
- Stage: 08-backend
- Upstream files: PRD.md, PAGE_MATRIX.md, COPY_FREEZE.md, COMPLIANCE.md, DATA_CONTRACT.md

## Deliverables
- `src/lib/png-to-stl.ts`: PNG luminance/alpha to relief mesh generator.
- `src/app/api/convert/route.ts`: multipart PNG validation and `model/stl` response.
- `DATA_CONTRACT.md`: updated machine-readable response contract and limitations.
- Frontend converter now posts to `/api/convert` and downloads the returned STL blob.

## Confirmed Locally
- Valid endpoint compiles in Next.js build.
- Frontend build compiles after API integration.
- No D1, R2, auth, payment, queue, or durable storage is introduced.

## Waiting
- Runtime smoke test with actual PNG request.
- Browser download QA on desktop/mobile.
- Cloudflare/OpenNext compatibility check for `pngjs` and Buffer.
- Updated legal/SEO copy review after this backend upgrade.

## Risks
- P0: do not deploy until runtime smoke passes in the target Cloudflare environment.
- P1: output is simple relief STL, not CAD-grade or guaranteed printable.
- P2: large/complex PNGs are downsampled to capped mesh resolution.

[NEEDS_RUNTIME_REVIEW]

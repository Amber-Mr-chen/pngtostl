# Backend Smoke Test

## Status
- Result: PASS_LOCAL_HTTP
- Date: 2026-06-04
- Runtime: local Next.js dev server on `127.0.0.1:3027`
- Endpoint: `POST /api/convert`

## Valid PNG Test
- Fixture: `tmp/test.png`
- Size: 8 x 8 PNG RGBA
- Command shape: `curl -F file=@tmp/test.png http://127.0.0.1:3027/api/convert`
- HTTP status: 200
- Content-Disposition: `attachment; filename="test.stl"`
- Content-Type: `model/stl; charset=utf-8`
- Source headers: 8 x 8
- Mesh headers: 8 x 8
- Triangle count header: 320
- STL body starts with: `solid pngtostl_relief`
- STL body facet count: 320
- Output size: 65819 bytes

## Error Tests
- Non-multipart POST: HTTP 400, `Expected multipart/form-data with a PNG file.`
- Non-PNG multipart upload: HTTP 400, `Only PNG files are accepted.`

## Not Yet Verified
- Cloudflare/OpenNext production runtime compatibility.
- Browser-initiated download on desktop/mobile.
- Oversized upload response with real >10 MB fixture.
- Malformed `.png` file with PNG extension but invalid content.

## Gate Impact
- Backend/data contract can move to DONE_LOCAL / NEEDS_RUNTIME_REVIEW.
- QA and launch remain blocked until target runtime and browser QA pass.

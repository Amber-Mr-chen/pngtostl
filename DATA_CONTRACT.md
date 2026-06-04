# Data Contract

Project: pngtostl
Stage: 08-backend/data
Status: REAL_STL_LOCAL_V0
Updated: 2026-06-04

## Current Architecture
- Runtime: Next.js App Router API route
- Endpoint: `/api/convert`
- Method: `POST`
- Input type: `multipart/form-data`
- Required field: `file`
- Accepted file type: PNG only
- Max upload size: 10 MB
- Current output: in-memory ASCII STL file response
- Storage: no intentional persistence of uploaded PNG or generated STL in app storage
- Conversion model: simple height-map relief based on PNG luminance and alpha

## Request Contract

```ts
type ConvertRequest = FormData & {
  file: File; // image/png or .png file name, <= 10 MB
};
```

## Successful Response

The endpoint returns an STL file directly instead of JSON.

```http
HTTP/1.1 200 OK
Content-Type: model/stl; charset=utf-8
Content-Disposition: attachment; filename="example.stl"
X-PNGToSTL-Source-Width: 512
X-PNGToSTL-Source-Height: 512
X-PNGToSTL-Mesh-Width: 96
X-PNGToSTL-Mesh-Height: 96
X-PNGToSTL-Triangle-Count: 37632
```

Body: ASCII STL beginning with:

```stl
solid pngtostl_relief
  facet normal ...
```

## Error Responses

### Missing multipart form data

```json
{
  "ok": false,
  "error": "Expected multipart/form-data with a PNG file."
}
```

HTTP status: `400`

### Missing file field

```json
{
  "ok": false,
  "error": "Missing file field named file."
}
```

HTTP status: `400`

### File too large

```json
{
  "ok": false,
  "error": "File is too large. Limit is 10 MB."
}
```

HTTP status: `413`

### Non-PNG file

```json
{
  "ok": false,
  "error": "Only PNG files are accepted."
}
```

HTTP status: `400`

### Invalid or unreadable PNG

```json
{
  "ok": false,
  "error": "Could not parse the PNG file."
}
```

HTTP status: `400`

## Frontend Rules
- The frontend may call this endpoint and download the returned STL blob.
- The frontend must describe the result as a simple in-memory relief STL, not a guaranteed production-ready model.
- No persistent download URL exists in v0.
- QA must test valid PNG, non-PNG, oversized file, malformed PNG, and successful STL response.

## Security and Compliance
- Do not log raw uploaded file content.
- Do not persist uploads unless Privacy is updated with storage and retention details.
- If R2 storage is added, define bucket, retention, deletion, and signed URL policy before launch.
- If queue/job processing is added, define rate limits and abuse controls.
- Current v0 avoids auth, payments, D1, R2, queues, and durable object storage.

## Production Limitations
- The STL is a simple height-map relief, not CAD-grade reconstruction.
- Mesh resolution is capped to protect runtime and output size.
- Output may require slicer/CAD inspection before printing.
- Cloudflare Worker compatibility must be verified before deploy because the implementation uses `pngjs` and Node-compatible Buffer behavior.

## Gate Result
- Data Contract Gate: DONE_LOCAL for simple in-memory STL v0.
- Production Conversion Gate: NEEDS_REVIEW until Cloudflare/OpenNext runtime compatibility and browser QA are verified.

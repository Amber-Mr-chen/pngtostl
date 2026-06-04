# Compliance Report

Project: pngtostl
Stage: 04-compliance
Status: NEEDS_REVIEW
Updated: 2026-06-04

## One-Line Decision
The site can continue as a free tool-shell only if Privacy/Terms clearly match the actual upload flow. A real conversion backend requires a compliance recheck before launch.

## Data Inventory

### User-provided data
- PNG file selected in browser preview.
- Future: uploaded PNG sent to `/api/convert`.
- Future: generated STL file or job result, if real backend is connected.

### Automatically collected data
- Standard server logs from hosting provider: IP address, user agent, request path, timestamp [待确认 by deployment platform].
- Analytics events: not currently configured in project files.

### Account/payment data
- None for v0.

### Cookies
- No app-level cookies identified for v0.
- Future analytics may set cookies depending on provider.

## Third-Party / Infrastructure Mapping
- Next.js / hosting platform: serves site and API route.
- Cloudflare: likely future DNS/hosting/CDN provider [待确认].
- R2 or object storage: not currently configured; must be disclosed if added.
- Analytics: not currently configured; must be disclosed if GA4/Clarity/etc. is added.
- Payment: none for v0.

## Legal Route Contract
- `/privacy`: required and present.
- `/terms`: required and present.
- `/contact`: required and present.
- `/refund`: not required for free v0; required if paid plans launch.
- `/cookie-policy`: not required while no non-essential cookies/analytics are active; revisit before analytics launch.

## Required Claims
Privacy must say:
- Whether files are processed locally or uploaded.
- Whether uploaded files are stored.
- Retention period if files are stored.
- Whether generated STL files are publicly accessible or signed/private.
- Contact method for deletion/support if storage exists.

Terms must say:
- User is responsible for upload rights/IP.
- Output suitability for 3D printing is not guaranteed.
- Tool may have file size/type limits.
- No professional engineering/manufacturing guarantee.

## Forbidden / Risky Claims
- `guaranteed printable`
- `100% accurate`
- `unlimited free conversions`
- `we never upload your file` unless conversion is fully local and verified
- `we delete immediately` unless backend retention behavior is implemented and verified
- `official` or any brand affiliation claim

## Risk Register
- P0: If real conversion uploads files to server/R2, Privacy must be updated before launch.
- P0: Do not claim real STL downloads until backend produces actual files.
- P1: Add file size, accepted type, and output limitations near upload UI.
- P1: Add analytics disclosure before enabling analytics scripts.
- P2: Add cookie policy only if non-essential cookies are introduced.

## Compliance Gate
- Result: DONE_LOCAL / NEEDS_PRE_LAUNCH_RECHECK.
- Passed: free v0 avoids payment/refund complexity.
- Passed: legal routes exist.
- Passed: `/privacy`, `/terms`, `/contact`, `/faq`, and `/how-it-works` now disclose simple in-memory STL generation / no persistent storage and avoid guaranteed output claims.
- Needs pre-launch recheck: final backend storage/retention decision, production support contact, analytics/cookie disclosure if analytics is added.

[DONE_LOCAL]

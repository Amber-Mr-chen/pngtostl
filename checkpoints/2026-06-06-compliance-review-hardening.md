# pngtostl.net compliance review and hardening checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `58f8f4ca-6d54-4961-a851-5a9dcd639c27`

## Goal

Run compliance-skill review after adding lightweight commercial entry pages, then fix low-risk compliance gaps without adding login, payment, storage, or account features.

## Skill used

- `student-site-compliance-pipeline`
- `frontend-site-automation`

## Findings

P0:

- None found.
- Public Privacy/Terms/Contact pages exist and return 200.
- Upload behavior is disclosed.
- Analytics event behavior is disclosed.
- Pricing page does not collect payment or fake a live checkout.
- API page says access is not self-serve yet.
- Terms disclose output limitations and no professional advice.

P1 fixed:

- Removed public wording `guaranteed uptime` from `/developers` because it can be misread even in a "Not promised yet" section.
- Added Privacy `Service providers` section for hosting/edge infrastructure and future named analytics/email/payment/auth/storage/API-key providers.
- Added Terms wording that PNGtoSTL does not currently collect payment for the public single-file converter; future paid features require published pricing/cancellation/refund terms before purchase.
- Added shared `LegalSupportLinks` nav to static info pages so Privacy, Terms, Contact, Pricing, and API/batch access are easy to reach.

P2 remaining / monitor:

- If GA4, Clarity, email provider, auth, payment, persistent storage, account history, or API keys are added, Privacy/Terms must be updated with named provider and retention/opt-out behavior before launch.
- If paid features launch, add refund/cancellation/billing terms before accepting payment.
- If generated files are stored or made shareable, add file retention/deletion/user-control disclosure.

## Files changed

- `src/app/[slug]/page.tsx`
  - Privacy provider disclosure.
  - Terms no-current-payment wording.
  - Safer developers wording.
  - Shared Legal/Support links.

- `src/app/globals.css`
  - Styles for `.legalSupportLinks`.

## Local verification

Compliance scan:

- forbidden_found: []
- has_service_providers: true
- has_no_current_payment_terms: true
- has_legal_support_links: true

Quality gate:

```bash
npm run lint && npm run build && node scripts/home_responsive_qa.js && python3 scripts/step11_core_tool_qa.py
```

Result: PASS.

Build:

- 26 static/generated pages.

Responsive:

- issueCount: 0
- desktop overflow: false
- tablet overflow: false
- mobile overflow: false
- mobile scrollWidth: 390
- hasSlider: true
- tabCount: 3

Core STL QA:

- PASS
- detail96: 96 x 48, 5068 triangles, 253,484 bytes
- detail320: 256 x 128, 26,620 triangles, 1,331,084 bytes

Local browser QA:

- `/privacy` displays Service providers and Legal and support links.
- `/developers` displays Legal and support links and no longer contains `guaranteed uptime`.

## Production deployment

Command:

```bash
npm run cf:build && npm run cf:deploy
```

Result: PASS.

Cloudflare Worker Version:

```text
58f8f4ca-6d54-4961-a851-5a9dcd639c27
```

## Production verification

Content checks on:

- `/privacy`
- `/terms`
- `/developers`
- `/pricing`
- `/contact`
- `/samples`
- `/sitemap.xml`

Passed:

- Privacy has `Service providers`.
- Terms has `does not currently collect payment`.
- Static info pages have `Legal and support links`.
- Privacy/Terms/Contact/Developers/Pricing links exist.
- `guaranteed uptime` absent.
- Forbidden phrases absent:
  - `100% accurate`
  - `unlimited free`
  - `we never upload`
  - `delete immediately`
  - `Download your STL instantly`

API regression:

- `POST https://pngtostl.net/api/stl/convert`
- status 200: true
- content-type STL: true
- bytes: 1,843,084
- triangle header present: true

Production browser QA:

- `/privacy` renders Service providers and Legal/Support links.
- `/developers` renders API/batch/commercial content and Legal/Support links.

## Status

DONE. Compliance review found no P0 blockers; P1/P2 copy/link hardening has been deployed and verified.

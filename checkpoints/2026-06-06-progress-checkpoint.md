# pngtostl.net progress checkpoint

Time: 2026-06-07 10:13:55 CST
Project: `/root/projects/pngtostl`
Production: https://pngtostl.net/
Branch: `main`

## Current status

Completed and deployed:

1. Premium v4 real sample assets
   - Homepage proof strip and workflow examples use `premium-v4` source/preview images.
   - `/samples` uses real source → generated STL preview evidence cards.

2. Sticky home navigation and compact typography
   - Tool pages, information pages, helper pages, and `/samples` have a fixed/sticky `PNGtoSTL` home entry.
   - `/samples` header was reduced from ~109px to ~59px.
   - Oversized page headings were reduced across homepage, tool pages, samples, pricing, and FAQ.
   - FAQ now opens the first 6 answers by default so the page is not thin on first view.

3. ShipSolo launch audit pass: support/feedback readiness
   - Added a global floating `Feedback` launcher on all pages.
   - Feedback panel includes:
     - `Email support` mailto link to `support@pngtostl.net`
     - current page URL in the email body template
     - warning not to send private files/passwords/secrets
     - link to `/contact`
   - Added lightweight feedback analytics events:
     - `feedback_panel_open`
     - `feedback_panel_close`
     - `feedback_email_click`
     - `feedback_contact_click`
   - Updated `/llms.txt` Contact section with support email and feedback path.

## Production deploys

Latest deployed version:

```text
347278da-0941-427a-b17f-23457cc72b27
```

Previous recent deploys:

```text
f39fcbe5-6747-4937-9b22-85f76531604e
6b8f98da-8534-48d9-89be-09b249187532
9ccbb952-d6a5-49b8-b9b8-3cc4f347a4bf
```

## Verified today

Build / QA:

```text
npm run lint
npm run build
node scripts/home_responsive_qa.js
npm run cf:build
npm run cf:deploy
```

Production checks:

- `https://pngtostl.net/` has floating Feedback launcher.
- Feedback button opens panel in production.
- `mailto:` points to `support@pngtostl.net` and includes current page URL.
- `window.pngtostlEvents` receives `feedback_panel_open`.
- No horizontal overflow on homepage production check.
- Feedback launcher exists on:
  - `/`
  - `/samples`
  - `/image-to-stl`
  - `/pricing`
  - `/faq`
  - `/contact`
- `/llms.txt` now includes support email and feedback guidance.
- Core conversion API smoke with real sample image:
  - endpoint: `POST /api/stl/convert`
  - status: `200`
  - content-type: `model/stl`
  - output size: ~2.88MB
  - triangles: `57596`

## Audit facts

Passed / acceptable:

- HTTP → HTTPS redirect works.
- `www.pngtostl.net` → `https://pngtostl.net/` redirect works.
- `/robots.txt`, `/sitemap.xml`, `/llms.txt` return 200.
- Sitemap contains 20 URLs including core tools, samples, legal/support pages, FAQ.
- Core metadata/H1/canonical/schema exists on checked pages.
- Privacy/Terms/Contact/Pricing/Developers/Samples/FAQ return 200.
- Domain has MX records and SPF for Namecheap email forwarding.

Remaining gaps / follow-up:

P1:
- Domain email DNS is incomplete for mature outbound deliverability:
  - MX exists.
  - SPF exists: `v=spf1 include:spf.efwd.registrar-servers.com ~all`.
  - DMARC TXT missing for `_dmarc.pngtostl.net`.
  - DKIM TXT not detected for common selectors.
  - If support email is only forwarding, outbound sending identity still needs setup.
- GSC/Bing Webmaster/analytics provider installation still needs final owner/backend verification.
- Need browser/mobile screenshot QA after feedback launcher to confirm it does not cover critical upload/download controls on small phones.

P2:
- Add current nav active state.
- Add richer FAQ answers and intent-specific FAQs to format pages.
- Add visible support note in footer if desired.
- Add DMARC policy gradually, starting `p=none`.
- Add outbound support mailbox provider if emails should be sent as `support@pngtostl.net` rather than only forwarded.

## Skill/process update

Patched skill reference:

```text
frontend-site-automation / references/tool-site-operational-maturity-after-workspace.md
```

Added support/feedback/domain-email readiness as a mandatory operational maturity check, so future tool sites should not miss floating feedback/support and DNS email basics.

## Next recommended step

1. Commit/push the current site code.
2. Configure domain email maturity:
   - Add DMARC TXT.
   - Confirm forwarding destination for `support@pngtostl.net`.
   - Decide whether outbound sending should use Google Workspace / Namecheap Private Email / Resend.
3. Run GSC/Bing/analytics readiness check.
4. Do mobile screenshots for `/`, `/image-to-stl`, `/samples`, `/faq` after feedback launcher.

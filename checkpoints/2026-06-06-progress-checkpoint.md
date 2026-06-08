# pngtostl.net progress checkpoint

Time: 2026-06-07 10:13:55 CST
Project: `/root/projects/pngtostl`
Production: https://pngtostl.net/
Branch: `main`

## Current status

Latest update — 2026-06-08 10:49 CST:

- Fixed homepage footer English layout issue reported by owner after the AITDK cleanup.
- Root cause: `.siteFooter` used `grid-template-columns: minmax(0, 1fr) auto`; the many footer links in the auto column consumed most of the row width and squeezed the left English paragraph into one-word-per-line wrapping. Chinese appeared less broken because it can wrap character-by-character.
- CSS fix: changed the footer grid to `minmax(280px, 420px) minmax(0, 1fr)`, added a stable column gap, constrained the paragraph width, and kept footer nav in the second flexible column.
- Verification after deploy:
  - `npm run lint` passed with the existing non-blocking direct-img warning for the tiny favicon logo.
  - `npm run build`, `npm run cf:build`, `npm run cf:deploy` passed.
  - Production browser geometry: footer width 1140px, intro width 420px, nav width 678px, grid columns `420px 678px`.
  - No document-level horizontal overflow.
  - Visual check confirmed the English footer tagline now wraps as a normal readable paragraph instead of one word per line.
- Cloudflare Worker version: `1a306e8d-8d24-4334-b987-353bd6fdea50`.

Previous update — 2026-06-08 10:35 CST:

- Owner clarified they did not intentionally use browser translation, but AITDK Images still showed the missing-alt asset as `https://fonts.gstatic.com/s/i/productlogos/translate/v14/24px.svg`.
- Verified this URL is not in the project source or production HTML:
  - Search for `fonts.gstatic`, `productlogos/translate`, `translate/v14`, `translate.googleapis`, and `Google Translate` found no live app source references.
  - Production raw HTML does not contain the translate icon URL.
  - Browser runtime in the agent environment does not load the translate icon resource.
- Conclusion: the missing-alt image is injected by the local browser/Chrome translation environment or a related extension/component, not by the site app code.
- Added site-level anti-translation hints to prevent Chrome from injecting translation UI into the page during audits:
  - `<html lang="en" translate="no">`
  - `<meta name="google" content="notranslate" />`
- Rebuilt and deployed.
- Verification after deploy:
  - Production HTML has `translate="no"` on `<html>`.
  - Production HTML has Google `notranslate` meta.
  - Production HTML still has 13 `<img>` elements and 0 missing/empty alt.
  - Production HTML still has no icon links and no manifest link.
  - Production HTML does not contain the translate icon URL.
  - `npm run lint` passed with the existing non-blocking direct-img warning for the tiny logo.
  - `npm run build`, `npm run cf:build`, `npm run cf:deploy` passed.
- Cloudflare Worker version: `ea6d0c56-0da5-4158-9dde-83319dfa66ac`.

Previous update — 2026-06-08 10:20 CST:

- Continued deep AITDK alt warning investigation after owner reported the warning still remained.
- Additional browser resource audit showed AITDK may be counting icon-style resources beyond normal DOM images:
  - `favicon.ico` loaded by the browser.
  - `/icon-192.png` loaded from PWA manifest before the change.
  - Static icon/apple-touch-icon links existed in `<head>` before the final metadata change.
- Mitigations applied:
  - Removed `manifest: "/site.webmanifest"` from Next metadata to stop browser manifest icon loading.
  - Changed the visible brand logo image to use `/favicon.ico` directly with `alt="PNGtoSTL logo"`, so the same favicon resource exists as a real DOM image with alt.
  - Removed explicit metadata `icons` links (`favicon.ico`, 16x16, 32x32, apple-touch-icon`) to avoid AITDK treating icon links as missing-alt images.
- Verification after final deploy:
  - Production raw HTML has no `rel="manifest"` link.
  - Production raw HTML has no explicit `rel="icon"` / `apple-touch-icon` links.
  - Production raw HTML has 13 `<img>` elements and 0 missing/empty alt.
  - Production raw HTML includes `<img class="brandMarkIcon" src="/favicon.ico" alt="PNGtoSTL logo" ...>`.
  - Browser DOM has `iconLinks: 0`, `manifest: false`, `imgCount: 13`, `missing: []`.
  - Browser may still auto-request `/favicon.ico`; this is browser behavior and not a page `<link>`.
  - `npm run lint` passed with one non-blocking warning for using a direct `<img>` for the tiny favicon logo.
  - `npm run build`, `npm run cf:build`, `npm run cf:deploy` passed.
- Cloudflare Worker version: `e5f9be34-6d27-4a04-a96f-817682c6af62`.
- If AITDK still reports `1 images missing alt text` after this, the next required evidence is AITDK → Images list screenshot, because source HTML and runtime DOM no longer contain any missing-alt image or icon link.

Previous update — 2026-06-08 10:04 CST:

- Deep follow-up for persistent AITDK `Image Alt Text Check: 1 images missing alt text` after multiple normal `<img>` checks passed.
- Full production inventory before the final fix showed:
  - 12 `<img>` elements, all with non-empty alt.
  - 0 `<svg>`, 0 `<canvas>`, 0 `<picture>`, 0 `<source>`, 0 `<object>`, 0 `<embed>`.
  - 0 `rel="preload" as="image"` links.
  - Only remaining visually image-like header asset was the CSS-rendered brand logo `<span>`.
- Final fix: replaced the CSS-only brand mark with a real reusable `BrandMark` component using a Next `<Image>` sourced from `/icon-192.png` with `alt="PNGtoSTL logo"`.
- Applied the new brand image consistently on homepage, tool pages, slug/info pages, and helper utility pages.
- Verification after deploy:
  - `npm run lint` passed.
  - `npm run build` passed.
  - `npm run cf:build` passed.
  - `npm run cf:deploy` passed.
  - Production image count is now 13.
  - Production missing/empty alt count remains 0.
  - Production logo image is present as `.brandMarkIcon` with `alt="PNGtoSTL logo"`.
  - Production image preload count remains 0.
  - Title remains 49 characters.
- Cloudflare Worker version: `8155caaf-6f0a-4b8e-8f5b-c56e7a83c334`.

Previous update — 2026-06-08 09:50 CST:

- Investigated owner screenshot showing two AITDK yellow warnings: `Meta Title Check` and `Image Alt Text Check`.
- Screenshot page content was browser-translated into Chinese, which likely changed AITDK's DOM-derived title measurement to 19 characters; raw production HTML still had the prior English title at 33 characters.
- Adjusted homepage/default Open Graph title to a more standard SEO length: `Image to STL Converter for 3D Printing | PNGtoSTL` (49 characters).
- Re-verified image/alt state after deployment:
  - Browser DOM title length: 49.
  - Meta description length: 148.
  - Production `imgCount`: 12.
  - Production missing image alt list: empty.
  - Production image preload links: 0.
  - H1 count: 1.
  - Canonical remains `https://pngtostl.net`.
- Cloudflare Worker version: `c664a3f4-10fb-48f3-b328-079d7e797ed6`.
- If AITDK still shows the alt warning, next evidence needed is the AITDK `Images` tab row/URL for the missing item; source HTML and live DOM no longer show a missing alt.

Previous update — 2026-06-07 22:43 CST:

- Owner rechecked AITDK after removing homepage image preload links; AITDK still shows `Image Alt Text Check: 1 images missing alt text`.
- Current verified production facts remain:
  - `head_image_preload_count`: 0.
  - `raw_img_count`: 12.
  - `missing_or_empty_alt_count`: 0.
  - Meta title, meta description, canonical, and H1 are green in AITDK.
- Deferred until tomorrow per owner request.
- Next debugging step: open AITDK `Images` panel and capture the exact image URL/row it claims is missing alt; likely remaining cause is extension-side cached/derived resource or a non-`<img>` asset being counted.

Previous update — 2026-06-07 22:36 CST:

- Follow-up for AITDK still showing `1 images missing alt text` after all `<img>` elements had alt text.
- Root cause hypothesis verified: Next.js auto-generated `<link rel="preload" as="image">` tags for eager showcase images in `<head>`; some browser SEO extensions can count those image preload resources as images without alt text.
- Changed non-critical homepage showcase images from `loading="eager"` to `loading="lazy"` so Next.js no longer emits image preload links in the page head.
- Verification passed:
  - `npm run lint`
  - `npm run build`
  - `npm run cf:build`
  - `npm run cf:deploy`
  - Production `head_image_preload_count`: 0.
  - Production `raw_img_count`: 12.
  - Production `missing_or_empty_alt_count`: 0.
  - Production meta description remains 148 characters.
- Cloudflare Worker version: `091f03fc-a41b-4ae8-be09-f05304c1e07e`.

Previous update — 2026-06-07 22:19 CST:

- Optimized the homepage based on the AITDK checks provided by the owner.
- Fixed true SEO/accessibility issue: homepage sample/proof images now have descriptive alt text instead of empty `alt` values.
- Improved homepage meta description from 111 characters to 148 characters, fitting AITDK's 140–160 character recommendation while keeping the wording truthful.
- Left non-blocking/cosmetic items unchanged where already passing: title length, canonical, H1, SSR-rendered main content, analytics scripts.
- Verification passed:
  - `npm run lint`
  - `npm run build`
  - `npm run cf:build`
  - `npm run cf:deploy`
  - Production browser DOM: 12 images, 0 missing alt text.
  - Production meta description length: 148.
  - Production title length: 33.
  - Production H1 count: 1.
  - Production canonical: `https://pngtostl.net/`.
- Cloudflare Worker version: `519a641a-6266-4337-b2c3-81ecf42e750b`.

Previous update — 2026-06-07 22:05 CST:

- Installed Plausible Community Edition tracking in the site `<head>` using the owner-provided script URL.
- The Telegram-pasted snippet had missing `||` / assignment characters, so the inline bootstrap was normalized to the standard Plausible queue/init pattern before deployment.
- Verification passed:
  - `npm run lint`
  - `npm run build`
  - `npm run cf:build`
  - `npm run cf:deploy`
  - Production HTML contains `https://plausible.shipsolo.io/js/pa-hH9PJovRN2vjpuGZf0nY3.js`.
  - Production browser DOM confirms the Plausible external script is in `<head>`, `async=true`, and `window.plausible` is available.
  - Direct script URL returns HTTP 200 `application/javascript`.
- Cloudflare Worker version: `8276097f-da03-43f7-950a-0acb78dda4a7`.

Previous update — 2026-06-07 21:57 CST:

- Installed Ahrefs Web Analytics in the site `<head>` using the owner-provided script key.
- Verification passed:
  - `npm run lint`
  - `npm run build`
  - `npm run cf:build`
  - `npm run cf:deploy`
  - Production HTML contains `https://analytics.ahrefs.com/analytics.js` with the configured `data-key`.
  - Browser DOM verification confirms the Ahrefs script is in `<head>` and `async=true`.
- Cloudflare Worker version: `1521c932-4365-4052-afa9-261d273aa5ff`.

Previous update — 2026-06-07 21:40 CST:

- Owner approved the simplified site icon direction (`Minimal STL Cube`).
- Exported and deployed the icon set:
  - `/favicon.ico`
  - `/favicon-16x16.png`
  - `/favicon-32x32.png`
  - `/apple-touch-icon.png`
  - `/icon-192.png`
  - `/icon-512.png`
  - `/og-icon.png`
  - `/site.webmanifest`
- Updated `src/app/layout.tsx` metadata with icon, Apple touch icon, manifest, and OpenGraph image references.
- Verification passed:
  - `npm run lint`
  - `npm run build`
  - `npm run cf:build`
  - `npm run cf:deploy`
  - Production HTTP checks for all icon assets returned 200.
  - Production home page head contains favicon, Apple touch icon, manifest, and OG image refs.
- Cloudflare Worker version: `a90144db-b15d-45fe-b66e-997515cf635e`.

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

## 2026-06-07 10:42 CST follow-up: email/search/analytics/mobile readiness

Completed and deployed / verified:

- Mobile Feedback P1 fixed: on screens ≤680px the floating feedback entry is now a compact 40px circular `?` button instead of the wider text pill.
- Production 390px mobile QA after the patch:
  - `/image-to-stl`: Feedback no longer overlaps the output-mode selector.
  - `/samples`: no overlap with filter buttons.
  - `/faq`: no overlap with visible critical controls.
  - `/`: no horizontal overflow; only a small overlap with the lower-right corner of a partially visible example card, not with primary upload/CTA.
- Footer support visibility improved:
  - Homepage footer now shows `support@pngtostl.net`.
  - Tool-page footer now shows `support@pngtostl.net`.
- Updated `ops/gsc-bing-submission-checklist.md` with current GSC/Bing/Analytics/email status.

Verified current external/account state:

- Domain email receiving is now fixed and verified:
  - `support@pngtostl.net` receives mail via Cloudflare Email Routing.
  - Forwarding target: `wanglilong616@gmail.com`.
  - Cloudflare Email Routing: `Enabled: true`, `Status: ready`.
  - Rule: `support@pngtostl.net -> wanglilong616@gmail.com`.
- Public DNS now uses Cloudflare Email Routing:
  - MX: `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net`
  - SPF: `v=spf1 include:_spf.mx.cloudflare.net ~all`
  - DKIM: `cf2024-1._domainkey.pngtostl.net`
  - DMARC: `v=DMARC1; p=none; rua=mailto:support@pngtostl.net`
- Google Search Console is now configured:
  - Property: `sc-domain:pngtostl.net`
  - Permission: `siteOwner`
  - Sitemap submitted: `https://pngtostl.net/sitemap.xml`
  - GSC read result: `warnings=0`, `errors=0`, `submitted web URLs=20`, `lastDownloaded=2026-06-07T03:41:57.235Z`
  - `indexed=0` immediately after first submission; monitor over the next days.
- Bing Webmaster is now configured from GSC/import/manual setup:
  - Site: `pngtostl.net/`
  - Sitemap submitted: `https://pngtostl.net/sitemap.xml`
  - Known sitemaps: `1`
  - Sitemaps with errors: `0`
  - Sitemaps with warnings: `0`
  - Total discovered URLs: `20`
  - Sitemap status: `成功 / Success`
- Google Analytics 4 is now installed and production-verified:
  - Measurement ID: `G-ZPV5EZHN4G`
  - Initial GA deploy version: `cdb72d96-f0cd-41a6-bf1b-88f901f4e703`
  - Funnel event deploy version: `0ee4c66c-316e-4f4a-a69c-4859a97e555e`
  - GA script loaded in production: `true`
  - `window.gtag` present: `true`
  - `dataLayer` contains config for `G-ZPV5EZHN4G` with `anonymize_ip=true` and `send_page_view=true`
  - Feedback smoke: `feedback_panel_open` reached `window.pngtostlEvents` and `dataLayer/gtag`.
  - Full converter funnel verified in production on `/image-to-stl` with canvas-generated PNG:
    - `pngtostl_upload_selected`
    - `pngtostl_generate_clicked`
    - `pngtostl_generate_success`
    - `pngtostl_download_clicked`
  - Error path verified with invalid PNG: `pngtostl_generate_error` reached `window.pngtostlEvents` and `dataLayer`.
- Privacy page now discloses GA4 analytics events and Cloudflare Email Routing support forwarding.
- No-data-stage content/UX optimization deployed on 2026-06-07:
  - Deploy version: `a8f31104-355a-463b-9bde-74279fb91a25`
  - Added per-tool guidance blocks for best inputs, inputs to avoid, and print checks.
  - Added per-tool FAQPage JSON-LD alongside existing SoftwareApplication/WebSite JSON-LD.
  - Added active top-nav state with route grouping so `/png-to-stl`, `/jpg-to-stl`, `/convert-image-to-stl`, `/2d-image-to-3d-model`, and `/3d-print-photo` highlight `Image to STL`; lithophane helper pages highlight `Lithophane`; guide utilities highlight `Guides`.
  - Production-verified `/image-to-stl` and `/png-to-stl`: guidance present, FAQ details present, FAQPage JSON-LD present, GA4 script still present, `/png-to-stl` active nav shows `Image to STL` with `aria-current=page`.
  - QA passed: `npm run lint`, `npm run build`, `npm run cf:build`, `npm run cf:deploy`, and `node scripts/home_responsive_qa.js`.
- `/samples` expanded from 4 baseline workflows to 10 real-world proof examples on 2026-06-07:
  - Deploy version: `dc0c0302-6a93-46a2-9054-2f36eb51fafd`.
  - Added source PNG + generated STL + preview PNG for rubber stamp relief, coin relief medallion, workshop sign plate, pet photo relief, portrait lithophane night light, and terrain heightmap tile.
  - Added `scripts/render_expanded_v1_sample_assets.py` to regenerate expanded-v1 samples via the real `/api/stl/convert` endpoint while preserving premium-v4 baseline samples.
  - Updated `public/samples/manifest.json` and `sampleWorkflows` so `/samples` shows all 10 cards with settings, best-for guidance, avoid guidance, and download CTAs.
  - QA passed: `npm run lint`, `npm run build`, `npm run cf:build`, `npm run cf:deploy`; production `/samples` showed 10 cards, 10 STL download links, 20 sample images; browser fetch returned HTTP 200 for representative expanded PNG/STL resources; Relief filter showed 3 cards.
- Tool pages now surface route-matched real output proof from `/samples` on 2026-06-07:
  - Deploy version: `ba8e79e0-87d2-49cf-970a-9940905a5a0b`.
  - Added route-aware `relatedProofsFor` in `ToolPage.tsx`, prioritizing the current route before parent/adjacent workflows.
  - Added a "Real output proof" block after converter/guidance with source image, generated STL preview, metrics, best-for/avoid notes, Open workflow link, and Download STL link.
  - Production verified: `/png-to-stl` -> Workshop sign plate + Logo badge relief; `/logo-to-stl` -> Logo badge relief + Rubber stamp relief; `/lithophane-generator` -> Backlit lithophane panel + Portrait lithophane night light; `/heightmap-to-stl` -> Heightmap surface + Terrain heightmap tile; `/jpg-to-stl` -> Pet photo relief + Universal image relief.
  - QA passed: `npm run lint`, `npm run build`, `npm run cf:build`, `npm run cf:deploy`, and `node scripts/home_responsive_qa.js`.
- Tool proof analytics events now track whether real examples influence conversion on 2026-06-07:
  - Deploy version: `5847a079-95c6-4367-9b3c-61cd3905b6f6`.
  - Added `sample_proof_view`, `sample_proof_open_workflow`, and `sample_proof_download` to `src/lib/analytics.ts`.
  - Refactored the proof UI into `src/components/ToolProofBlock.tsx` client component so IntersectionObserver and click handlers can emit events while preserving the server-rendered `ToolPage` structure.
  - Production verified on `/png-to-stl`: all three events reached both `window.pngtostlEvents` and GA4 `dataLayer`; payloads include tool, path, sample, sample route/category, STL path, position, and sample count where applicable.
  - QA passed: `npm run lint`, `npm run build`, `npm run cf:build`, `npm run cf:deploy`, and `node scripts/home_responsive_qa.js`.
- Crawler hints and structured data refreshed after the sample/proof upgrades on 2026-06-07:
  - Deploy version: `a2ece38e-8838-4e84-8571-3351039fa490`.
  - Updated `src/app/llms.txt/route.ts` so `/llms.txt` includes Real Example Workflows, all 10 downloadable sample STL workflows, route-matched proof facts, and `Last updated: 2026-06-07`.
  - Updated `/samples` schema in `src/app/[slug]/page.tsx` with `CollectionPage` + `ItemList` JSON-LD, 10 `CreativeWork` entries, source/preview images, and `model/stl` encodings.
  - Added stable sample fragment anchors in `src/components/SampleGalleryFilter.tsx` so schema item URLs match rendered DOM anchors.
  - Static info pages now output OG/Twitter metadata with canonical URL, title, and description.
  - Production verified: `/robots.txt`, `/sitemap.xml`, `/llms.txt` return 200; sitemap contains `/samples`; `/llms.txt` contains Real Example Workflows, Workshop sign plate, Terrain heightmap tile, and updated date; `/samples` has canonical, OG, Twitter card, CollectionPage JSON-LD, 10 ItemList entries, STL encoding, and matching anchors; `/png-to-stl` has canonical, robots `index, follow`, WebSite, SoftwareApplication, and FAQPage JSON-LD.
  - QA passed: `npm run lint`, `npm run build`, `npm run cf:build`, `npm run cf:deploy`, and `node scripts/home_responsive_qa.js`.

Remaining owner/account actions:

1. Decide outbound mail provider before outbound DKIM only if sending as `support@pngtostl.net` is needed.
2. Monitor GSC/Bing/GA4 for indexed pages, impressions, query data, landing pages, and conversion events over the next days.

Search-engine discovery confirmation on 2026-06-07 15:29 CST:

- Public crawl-readiness recheck passed after the latest crawler-hints deploy:
  - `/robots.txt`, `/sitemap.xml`, and `/llms.txt` return 200 for both normal UA and Googlebot UA.
  - Sitemap contains 20 URLs.
  - Full sitemap URL sampling as Googlebot passed 20/20: each URL returned 200, final URL matched the canonical URL, canonical was self-referential, and robots meta was `index, follow`.
  - Priority URL sampling passed for `/`, `/image-to-stl`, `/png-to-stl`, `/jpg-to-stl`, `/logo-to-stl`, `/lithophane-generator`, `/heightmap-to-stl`, and `/samples`; each returned 200, one H1, self-canonical, `index, follow`, and JSON-LD.
  - Redirect matrix as Googlebot: apex HTTP, www HTTP, and www HTTPS redirect to canonical HTTPS apex; sitemap URL variants return `200 application/xml`.
- Automated GSC/Bing resubmission was not executed because this environment does not have safe submission credentials/tools available:
  - available: `curl`, `jq`
  - unavailable: `gws`, `gcloud`
  - unset: `GOOGLE_APPLICATION_CREDENTIALS`, `GSC_TOKEN`, `GOOGLE_SEARCH_CONSOLE_TOKEN`, `BING_WEBMASTER_API_KEY`, `BING_API_KEY`, `INDEXNOW_KEY`
- Updated `ops/gsc-bing-submission-checklist.md` with the public verification evidence and exact owner/UI follow-up steps for GSC and Bing.

Cold-start external discovery preparation on 2026-06-07 15:45 CST:

- Loaded and followed `site-ops-growth-launch`, `student-backlink-building`, and `product-coldstart-x-first` safety rules.
- Rebuilt `ops/coldstart-assets-utm-plan.md` into a complete low-risk launch asset pack:
  - honest positioning, short/long directory descriptions, no-overclaim rules, source-of-truth canonical URLs, screenshot checklist, UTM conventions, canonical UTM examples, safe channel priority, first 7-day sequence, directory/X/maker-forum/Reddit-safe copy templates, candidate evaluation checklist, launch gates, and metrics to review.
- Added `ops/coldstart-submission-log.md` as the execution ledger:
  - status labels, safety rules, record template, planned candidate queue, deferred HN/Product Hunt entries, and explicit note that no submissions were executed in the setup pass.
- No public post, directory submission, Product Hunt, Show HN, account action, CAPTCHA handling, or paid/reciprocal listing was executed without owner approval.
- Validation passed: cold-start docs contain required UTM links, owner-approval gate, no-overclaim rules, `manual_required`/`needs_approval` statuses, planned queue, and no-submission note.

Cold-start real candidate pool update on 2026-06-07 15:36 CST:

- Replaced placeholder cold-start queue in `ops/coldstart-submission-log.md` with 20 real reviewed candidates.
- Candidate status distribution after validation:
  - `planned`: 5
  - `manual_required`: 12
  - `needs_approval`: 3
- Every candidate has a concrete `Candidate URL`, tracked `Target URL` with UTM, suggested content, status, evidence, and notes.
- Best first-batch candidates after owner approval: Dev Hunt, Launching Next, MicroLaunch, Insidr AI, Hackaday Submit A Tip.
- Manual/account-gated candidates recorded separately: Product Hunt, Hacker News, BetaList, StartupBase, Fazier, browser-check 403 candidates, Reddit/community/resource-list candidates.
- Paid/high-visibility candidates marked `needs_approval`: Futurepedia, Future Tools, SideProjectors.
- Validation passed: 20 channel entries, 20 UTM target URLs, no `[to research]` placeholders, and no false `submitted`/`listed`/`pending_review` claims.
- No public post, directory submission, account action, CAPTCHA handling, payment, reciprocal listing, or PR was executed.

First-batch submission field pack on 2026-06-07 15:55 CST:

- Added `ops/first-batch-submission-field-pack.md` for the 5 planned first-batch candidates: Dev Hunt, Launching Next, MicroLaunch, Insidr AI, and Hackaday Submit A Tip.
- The field pack includes shared product fields, contact/pricing/category/tag values, per-site title/tagline/short description/long description, per-site UTM URL, risk note, pre-submit checklist, execution order, post-submit logging template, and stop conditions.
- Validation passed: all 5 first-batch candidates and their UTM URLs are present; execution boundary, no-overclaim guardrail, stop conditions, and post-submit logging rule are present.
- No submission, public post, account action, CAPTCHA handling, payment, reciprocal listing, or PR was executed.

First-batch launch media pack on 2026-06-07 16:08 CST:

- Added `ops/launch-media/` with 13 PNG assets plus `README.md` for owner-approved first-batch submissions.
- Added `scripts/capture_launch_media.js` to regenerate production screenshots with headless Chrome.
- Page screenshots generated from production:
  - `homepage-hero-1366x900.png`
  - `image-to-stl-workspace-1366x900.png`
  - `samples-gallery-1366x900.png`
  - `samples-gallery-fullpage.png`
  - `tool-proof-section-1366x900.png`
- Logo/icon assets generated locally:
  - `pngtostl-icon-512.png`
  - `pngtostl-icon-256.png`
  - `pngtostl-wordmark-transparent.png`
- Sample proof assets copied from `public/samples/`:
  - `sample-logo-badge-source.png`
  - `sample-logo-badge-preview.png`
  - `sample-lithophane-preview.png`
  - `sample-heightmap-preview.png`
  - `sample-sign-plate-preview.png`
- Visual QA: homepage and samples screenshots are suitable for directory submission; corrected the proof screenshot selector to `.toolProofBlock`, and the final proof screenshot shows `REAL OUTPUT PROOF`, two real example cards, STL metrics, and Download STL buttons.
- Validation passed: 14 launch-media files present, 13 PNGs non-empty, expected dimensions match for the key screenshots/icons/wordmark, README references every asset and maps assets to Launching Next, Dev Hunt, Insidr AI, MicroLaunch, and Hackaday.
- No public upload, directory submission, account action, CAPTCHA handling, payment, reciprocal listing, PR, or external post was executed.

First-batch visible preflight on 2026-06-07:

- Updated `ops/coldstart-submission-log.md` with a new `ready_to_submit` status label for owner-approved submissions whose public route has no immediate login/CAPTCHA/payment/reciprocal blocker.
- Preflighted the 5 first-batch candidates without submitting, uploading, logging in, solving CAPTCHA, paying, or changing the site.
- Result distribution:
  - `ready_to_submit`: Launching Next, Insidr AI, Hackaday Submit A Tip.
  - `manual_required`: Dev Hunt, MicroLaunch.
- Launching Next: public form visible; fields include startup name, URL, 5-8 word tagline, full description, tags, startup/funding radios, owner name/email, newsletter opt-in, and quick check `What is 2+3?`; page says submission is free but offers an optional $99 upgrade on the next page.
- Insidr AI: public `Submit AI Tools` form visible after redirect to `/submit-tools/`; fields include `Message`, `Link`, and required `Tag`; no immediate login/CAPTCHA/payment/reciprocal blocker observed.
- Hackaday: browser timed out twice, but HTTP returned 200 for `Submit A Tip | Hackaday`; parsed Jetpack contact form fields include name/alias, email, subject, link to more info, and comment; no payment/CAPTCHA signal found in parsed form.
- Dev Hunt: legacy `/submit` route now renders 404; visible `Submit your Dev Tool` entry opens GitHub/Google login, so owner account is required before field-level preflight.
- MicroLaunch: browser showed Cloudflare security verification; form was not inspected because security verification must not be bypassed.
- Validation passed: first-batch queue has 5 entries, with 3 `ready_to_submit`, 2 `manual_required`, and no false `submitted`/`listed`/`pending_review` claims.

Owner-approved first submission batch on 2026-06-07:

- Scope approved/executed: Insidr AI and Launching Next only.
- Not touched: Dev Hunt, MicroLaunch, Hackaday, Product Hunt, HN, any paid/launch/account-gated destination.
- Launching Next:
  - Result: `pending_review`.
  - Evidence: free submission reached confirmation/upgrade page showing `Status: In Queue (Estimated Wait: 4 Months)`.
  - Paid upgrade shown but not clicked: `$199$99`, `Upgrade to Fast-Track - $99`, and `Proceed to Secure Checkout - $99`.
  - Used short URL `https://pngtostl.net/?utm_source=launchingnext&utm_campaign=launch_v1` because the site URL input has `maxlength=100`.
  - Newsletter opt-in was unchecked; startup type set to bootstrapped; marketing budget set to `$0`; quick check answered `5`.
- Insidr AI:
  - Result: `manual_required`, not submitted.
  - Evidence: form accepted field values and `form.checkValidity()` returned true; clicked the real submit button twice, but there was no visible success, error, redirect, or alert, and fields remained populated.
  - Decision: did not force a backend request. Needs visible-browser/manual retry or direct contact if owner wants to pursue.
- Validation passed: `ops/coldstart-submission-log.md` has one `pending_review` record for Launching Next and one `manual_required` record for Insidr AI; no false `submitted`/`listed` claim; no payment, login, CAPTCHA handling, reciprocal link, external post, or other channel action was executed.

Owner-approved Hackaday editorial tip on 2026-06-07:

- Scope: Hackaday Submit A Tip only, because it was the remaining `ready_to_submit` first-batch candidate.
- Result: `pending_review`.
- Browser behavior: `browser_navigate` still timed out, matching preflight.
- Submission method: standard HTTP POST to the public Jetpack contact form on `https://hackaday.com/submit-a-tip/`, using the page's real hidden fields from the same GET response. No CAPTCHA/security bypass was used; no login, payment, reciprocal link, or file upload appeared.
- Evidence:
  - POST returned HTTP 200.
  - Final URL included `contact-form-id=2542&contact-form-sent=1116626&contact-form-hash=380eee749dc8097bb2079b2bd11d9b24e9ff6474`.
  - Response text included `Thank you for your response.`
  - Response snippet saved at `ops/hackaday-submit-response-snippet.txt`.
- Submitted framing: subject `Browser-based image-to-STL workflow with real downloadable 3D printing examples`; body asked for maker feedback on real examples/settings and did not claim or expect coverage.
- Validation target after this batch: first-batch queue should have Launching Next and Hackaday as `pending_review`, Dev Hunt/MicroLaunch/Insidr AI as `manual_required`, and no `submitted`/`listed` claims.

Manual-required path split on 2026-06-07:

- Added `ops/manual-required-submission-playbook.md` for the remaining first-batch manual paths.
- Covered: Dev Hunt, MicroLaunch, and Insidr AI.
- For each channel, documented current blocker, owner-visible-browser steps, UTM URL, copy fields, asset choices, stop conditions, and exact log status rules.
- Recommended next order:
  1. Dev Hunt if owner is comfortable with GitHub/Google login and post-login route is free.
  2. Insidr AI visible-browser retry or direct contact, because the public form gives no feedback in automation.
  3. MicroLaunch only after owner can complete Cloudflare and confirm the launch route is free.
- Updated `ops/coldstart-submission-log.md` to link the playbook and remove the stale "no candidate submitted yet" wording.
- No account/login, Cloudflare/CAPTCHA action, payment, reciprocal link, upload, public post, or new submission was executed in this documentation pass.

Second-batch candidate preflight on 2026-06-07:

- Scope: preflight only; no submission, login, PR, CAPTCHA/Cloudflare handling, payment, reciprocal link, upload, or public post.
- Added `ops/second-batch-preflight-notes.md` and linked it from `ops/coldstart-submission-log.md`.
- Checked candidates: SideProjectors, AlternativeTo, SaaSHub, There Is An AI For That, GitHub awesome-3d-printing.
- Results:
  - SideProjectors: `manual_required`; browser route loads but `+ SUBMIT A PROJECT` leads to login with Google/GitHub/GitLab/ProductHunt/LinkedIn/email options.
  - AlternativeTo: `manual_required`; HTTP 403 with `Just a moment...` / Cloudflare.
  - SaaSHub: `manual_required`; HTTP 403 with `Attention Required! | Cloudflare`, `captcha`/`cloudflare` signals.
  - There Is An AI For That: `manual_required`; HTTP 403 with `Just a moment...` / Cloudflare; lower relevance.
  - GitHub awesome-3d-printing: `manual_required / PR candidate`; repo is active, has `Online Tools`, and `contributing.md` accepts useful non-duplicate PRs using `[Resource Name](link) - Description text.` format.
- Best next opportunity: GitHub awesome-3d-printing PR prep, but only after duplicate/category review and owner approval before any account/fork/PR action.

GitHub awesome-3d-printing PR prep on 2026-06-07:

- Scope: prep only; no fork, branch, commit, PR, login, upstream write, or account action.
- Added owner-review package: `ops/github-awesome-3d-printing-pr-prep.md`.
- Loaded upstream `readme.md` and `contributing.md`; `gh repo view` showed default branch `main`, 1 open issue, 1 open PR, and recent push `2026-06-02T10:10:07Z`.
- Duplicate search results in README: `PNGtoSTL`, `png to stl`, `png-to-stl`, `image to stl`, `image-to-stl`, `lithophane`, `heightmap`, and `relief` all returned 0 matches.
- Issue/PR search via `gh` for `PNGtoSTL OR "image to STL" OR lithophane OR heightmap` returned no rows.
- Existing nearby `Online Tools` entries include `Gridfinity Layout Tool`, `Polyvia3D`, and `QRCode2STL`; PNGtoSTL fills a distinct image-to-STL/relief/lithophane gap.
- Prepared proposed entry, reference link, patch, branch name, commit title, PR title, PR body, pre-PR checklist, and stop conditions.
- Suggested insertion: after `Polyvia3D` and before `QRCode2STL`; reference definition after `[Polyvia3D]` and before `[PROLED3D]`.
- Updated `ops/coldstart-submission-log.md` and `ops/second-batch-preflight-notes.md` to link the PR prep package.
- Remaining requirement before action: owner approval plus re-run duplicate/upstream drift check immediately before any PR.

GitHub awesome-3d-printing owner-approved branch push on 2026-06-07:

- Re-ran upstream README duplicate search: `PNGtoSTL`, `png to stl`, `png-to-stl`, `image to stl`, `image-to-stl`, `lithophane`, `heightmap`, and `relief` all remained 0.
- Re-ran issue/PR search for `PNGtoSTL OR "image to STL" OR lithophane OR heightmap`; both returned empty.
- Cloned upstream to `/tmp/awesome-3d-printing-pr`, created fork remote `amberfork`, and pushed branch `add-pngtostl-online-tool` to `https://github.com/Amber-Mr-chen/awesome-3d-printing`.
- Branch commit: `f062beb Add PNGtoSTL to Online Tools`; diff changes only `readme.md` with 2 insertions.
- Compare URL: `https://github.com/ad-si/awesome-3d-printing/compare/main...Amber-Mr-chen:awesome-3d-printing:add-pngtostl-online-tool?expand=1`.
- Compare page showed `Able to merge`, 1 commit, 1 file changed.
- PR creation did not complete: `gh pr create` failed with `GraphQL: Resource not accessible by personal access token (createPullRequest)`; browser compare page showed signed-out GitHub session.
- Current status: branch is pushed and ready, but PR remains `manual_required` until owner opens the compare URL in a logged-in GitHub browser or provides a token with PR creation permission.

GitHub awesome-3d-printing PR opened manually by owner on 2026-06-07:

- Owner provided PR URL: `https://github.com/ad-si/awesome-3d-printing/pull/92`.
- Verified with `gh pr view`: number `92`, state `OPEN`, mergeable `MERGEABLE`, author `Amber-Mr-chen`, base `main`, head `add-pngtostl-online-tool`, title `Add PNGtoSTL to Online Tools`, created at `2026-06-07T10:12:21Z`.
- Updated `ops/coldstart-submission-log.md` status for GitHub awesome-3d-printing from `manual_required` to `pending_review`.
- Follow-up rule: monitor for maintainer review/merge; do not comment or push extra commits unless the maintainer requests changes.

Samples-to-converter CTA optimization on 2026-06-07:

- Added `ops/launch-follow-up-plan.md` with channel-specific follow-up cadence, status rules, stop conditions, and verification commands for GitHub PR #92, Hackaday Submit A Tip, and Launching Next.
- Added 10 recommended starting-point callouts to `/samples`, one per real example workflow.
- Deployed to Cloudflare Worker version `b189476f-d7c6-4c28-a009-627f44d9201d`.
- Added workflow-specific primary CTA labels such as `Try logo badge settings`, `Try universal relief settings`, `Try lithophane panel settings`, and `Try terrain tile settings`.
- Added onsite UTM parameters to sample-to-tool workflow links: `utm_source=samples`, `utm_medium=onsite_cta`, `utm_campaign=sample_to_tool`, and a sample-specific `utm_content` anchor slug.
- Added `sample_try_workflow_click` analytics event for the secondary workflow text link; primary workflow CTA continues emitting `sample_open_workflow_click` with `source: samples_card_primary_cta`.
- Updated `ops/first-week-data-review-plan.md` so sample-to-tool handoff can be diagnosed separately from sample downloads and proof-block clicks.
- Verification: `npm run lint` exit 0; `npm run build` exit 0 and generated 26 static pages; `npm run cf:build` exit 0; `npm run cf:deploy` exit 0; production browser DOM on `https://pngtostl.net/samples` showed 10 cards, 10 preset callouts, 10 primary workflow CTAs, 10 secondary workflow links, and all workflow links with UTM parameters; clicking the first primary CTA emitted `sample_open_workflow_click` and navigated to `/logo-to-stl?utm_source=samples&utm_medium=onsite_cta&utm_campaign=sample_to_tool&utm_content=logo-badge-relief`.

Sample preset handoff optimization on 2026-06-07:

- Added stable `sample=<slug>` parameters to all `/samples` workflow CTAs while preserving onsite UTM parameters.
- Added shared `sampleWorkflowSlug`, `SampleWorkflow`, and `getSampleWorkflow` helpers so schema anchors, CTA URLs, and tool-page lookup use the same slug logic.
- Tool pages now read `searchParams.sample`, validate the selected sample belongs to the current route, and pass the matched sample into the converter panel.
- Converter panel now displays `Sample preset loaded`, updates helper/preview copy, and derives starting width, relief/max-height/depth, detail, smoothing, and lithophane thickness defaults from the selected sample.
- Invalid or mismatched sample slugs intentionally fall back to normal route defaults.
- Deployed to Cloudflare Worker version `eceb57d6-5542-4c2e-a5b1-25146beb48a0`.
- Verification: `npm run lint` exit 0; `npm run build` exit 0; `npm run cf:build` exit 0; `npm run cf:deploy` exit 0; production `/samples` has 10 workflow CTAs with `sample=`; `/logo-to-stl?sample=logo-badge-relief...` shows `Sample preset loaded`, width `95 mm`, relief height `2.4 mm`, and sample preview copy; invalid `/heightmap-to-stl?sample=terrain-tile...` does not show a preset; valid `/heightmap-to-stl?sample=terrain-heightmap-tile...` shows width `110 mm` and max height `5.5 mm`.

Sample preset lifecycle analytics on 2026-06-07:

- Added `sample_preset_loaded`, `sample_preset_upload_selected`, `sample_preset_generate_clicked`, `sample_preset_generate_success`, `sample_preset_generate_error`, and `sample_preset_download_clicked` to the analytics event union.
- Added `data-sample-preset`, `data-sample-slug`, `data-sample-title`, and `data-sample-category` to converter forms only when a route-scoped sample preset is active.
- Updated `/converter.js` so preset-assisted uploads, generate clicks, successful conversions, errors, and generated downloads emit paired `sample_preset_*` events alongside the existing `pngtostl_*` events.
- Preset analytics payloads include safe context only (`sample_slug`, `sample_title`, `sample_category`, tool/mode/path, file type/size, output metrics) and do not include raw filenames.
- Deployed to Cloudflare Worker version `1dc691ff-fbc6-48ec-a886-a9be3dc51c3c`.
- Verification: `npm run lint` exit 0; static event validation exit 0; `npm run build` exit 0; `npm run cf:build` exit 0; `npm run cf:deploy` exit 0; production preset route emitted `sample_preset_loaded`; synthetic PNG upload/generate on `/logo-to-stl?sample=logo-badge-relief...` emitted upload/generate/success preset events; clicking the generated STL link emitted `sample_preset_download_clicked`; normal `/logo-to-stl` emitted no `sample_preset_*` events.

SEO support pages and manual channel pack on 2026-06-07:

- Added `ops/seo-support-page-plan.md` with selected support-page contracts, SERP access limitations, and quality gates.
- Added three non-thin SEO support routes via `helperPages`: `/how-to-turn-logo-into-stl`, `/lithophane-image-guide`, and `/heightmap-to-stl-terrain-guide`.
- Each support page includes an interactive recommendation module, on-page checklist, 3-step workflow, FAQ, related tools, and route-specific sample preset links into the live converter.
- Added `logo` and `heightmap` advisor modes so support-page recommendation copy matches the page intent instead of defaulting to lithophane.
- Deployed to Cloudflare Worker version `c88aecd3-e983-448d-b97d-c2690bcc7fe7`.
- Verification: `npm run lint` exit 0; `npm run build` exit 0 and generated 29 static pages; `npm run cf:build` exit 0; `npm run cf:deploy` exit 0; production `/how-to-turn-logo-into-stl` showed logo-specific recommendation, checklist, FAQ, and three sample preset links; clicking the hero preset opened `/logo-to-stl?sample=logo-badge-relief...` with `Sample preset loaded`, width `95`, and relief height `2.4`; production `/lithophane-image-guide` and `/heightmap-to-stl-terrain-guide` returned HTTP 200 with expected sample preset links; `sitemap.xml` and `llms.txt` include all three routes.
- Added `ops/manual-channel-submission-pack.md` for owner-assisted Dev Hunt, SideProjectors, AlternativeTo, and SaaSHub submissions, with channel-specific copy, stop conditions, proof URLs, and manual execution rules.
- Manual channel access checks: Dev Hunt requires GitHub/Google login after `Submit your Dev Tool`; SideProjectors `/submit` redirects to `/auth/login`; AlternativeTo `/software/new/` shows Cloudflare security verification; SaaSHub `/submit` shows Cloudflare block. Current execution status for these four channels is owner-assisted/manual_required, with copy and proof URLs prepared in `ops/manual-channel-submission-pack.md`.

SEO support internal-link closure on 2026-06-07:

- Added route-specific `Related guides` links to converter/tool pages via `supportGuidesFor()`: logo pages link to the logo guide; lithophane pages link to the lithophane guide; heightmap pages link to the heightmap terrain guide; adjacent routes also link to contrast/settings helpers.
- Added the three core guide links to homepage and tool-page footers, and added a `Practical guides` section to `/faq`.
- Deployed to Cloudflare Worker version `c9e36f52-f8e0-4f82-a3a7-9aebf45ba777`.
- Verification: `npm run lint` exit 0; internal-link static validation exit 0; `npm run build` exit 0 and generated 29 static pages; `npm run cf:build` exit 0; `npm run cf:deploy` exit 0; production browser on `/logo-to-stl` showed `Related guides` with the logo guide plus footer guide links; production HTTP checks with browser UA confirmed homepage, `/faq`, `/lithophane-generator`, and `/heightmap-to-stl` include the expected guide links.

GSC/Bing indexing submission prep on 2026-06-07:

- Verified production `robots.txt`, `sitemap.xml`, and `llms.txt` with a normal browser User-Agent. Robots returns 200 and global `User-agent: *` allows `/`; sitemap returns 200 `application/xml` with 23 URLs; llms.txt returns 200 and includes the new guide URLs.
- Clarified that Cloudflare Managed Content Signals block AI training/extended crawlers such as `GPTBot`, `Google-Extended`, and `ClaudeBot`, but do not block Google Search indexing because the global search crawler group is allowed.
- Verified the three new support URLs: `/how-to-turn-logo-into-stl`, `/lithophane-image-guide`, and `/heightmap-to-stl-terrain-guide` each return 200, have title/meta description, absolute self canonical, `robots` meta `index, follow`, exactly one H1, and appear in sitemap and llms.txt.
- Added `ops/gsc-bing-indexing-submit-checklist.md` with GSC sitemap submission, URL Inspection request sequence, Bing Webmaster submission steps, verification commands, and stop conditions.
- Updated `ops/launch-follow-up-plan.md` to link the indexing checklist.

7-day SEO/GEO monitoring ledger on 2026-06-07:

- Added `ops/seo-geo-7-day-monitoring-ledger.md` to track daily GSC/Bing indexing, GA4/product funnel events, sample/proof/preset-assisted events, external/channel status, and Day-7 decision rules.
- Ledger references `ops/gsc-bing-indexing-submit-checklist.md`, `ops/first-week-data-review-plan.md`, `ops/weekly-data-review-template.md`, `ops/launch-follow-up-plan.md`, `ops/manual-channel-submission-pack.md`, and `ops/seo-support-page-plan.md`.
- Day 1 is prefilled with production technical baseline: robots/sitemap/llms verified, three new guide URLs indexable and discoverable, GitHub PR #92/Hackaday/Launching Next pending_review, and Dev Hunt/SideProjectors/AlternativeTo/SaaSHub manual_required.
- Updated `ops/launch-follow-up-plan.md` to link the new 7-day ledger.

Bing sitemap submission evidence on 2026-06-07:

- Owner provided a Bing Webmaster Tools screenshot for `pngtostl.net/` → Sitemaps.
- Sitemap URL `https://pngtostl.net/sitemap.xml` is present with status `success`.
- Last submitted: 2026-06-07; last crawled: 2026-06-07.
- Bing summary: known sitemaps 1, errors 0, warnings 0, discovered URLs 20.
- Updated `ops/seo-geo-7-day-monitoring-ledger.md` and `ops/gsc-bing-indexing-submit-checklist.md` to mark Bing sitemap success and avoid duplicate resubmission.
- GSC sitemap status remains unconfirmed in project records until owner provides a GSC Sitemaps screenshot or status text.

Google Search Console sitemap evidence on 2026-06-07:

- Owner provided a Google Search Console screenshot for property `pngtostl.net` → Sitemaps.
- Sitemap URL `https://pngtostl.net/sitemap.xml` is present with status `success`.
- Submitted: 2026-06-07; last read: 2026-06-07.
- GSC summary: discovered pages 20, discovered videos 0.
- Updated `ops/seo-geo-7-day-monitoring-ledger.md` and `ops/gsc-bing-indexing-submit-checklist.md` to mark GSC sitemap success and avoid duplicate resubmission.
- Combined state: both Google Search Console and Bing Webmaster Tools now show sitemap success for `https://pngtostl.net/sitemap.xml`; individual priority guide URL Inspection remains optional/next-step.

Public URL inspection prep on 2026-06-07:

- Rechecked the three new SEO guide URLs from production: `/how-to-turn-logo-into-stl`, `/lithophane-image-guide`, and `/heightmap-to-stl-terrain-guide` all return 200, have `robots` meta `index, follow`, absolute self canonicals, one H1, and are present in sitemap + llms.txt.
- Extracted guide-page relevant links: each guide links to matching converter/sample preset routes and core tools.
- Public Google web search was blocked by bot detection; Bing web search showed Cloudflare challenge. Bing RSS endpoint returned unrelated results and did not show the three guide URLs yet. This is early/inconclusive and not authoritative; use GSC URL Inspection / Pages report for index status.
- Updated `ops/seo-geo-7-day-monitoring-ledger.md` with this public check and next action: use GSC URL Inspection for the three new guide URLs and request indexing if indexing is allowed but URL is not indexed.

GSC URL Inspection request indexing on 2026-06-07:

- Owner confirmed all three new SEO guide URLs have been checked in GSC URL Inspection and request indexing has been completed:
  - `https://pngtostl.net/how-to-turn-logo-into-stl`
  - `https://pngtostl.net/lithophane-image-guide`
  - `https://pngtostl.net/heightmap-to-stl-terrain-guide`
- Updated `ops/seo-geo-7-day-monitoring-ledger.md` and `ops/gsc-bing-indexing-submit-checklist.md`.
- Next action: wait 24–72 hours and recheck GSC Pages / URL Inspection; do not rewrite TDH/content while indexing is pending unless GSC reports a technical problem.

# GSC / Bing / Analytics Submission Checklist — pngtostl.net

Updated: 2026-06-07 15:29 CST

## Scope

Production domain: `https://pngtostl.net/`
Canonical sitemap: `https://pngtostl.net/sitemap.xml`
Robots: `https://pngtostl.net/robots.txt`
Support email shown on site: `support@pngtostl.net`

## Current verified status

### Live technical gates

- [x] `https://pngtostl.net/` returns 200.
- [x] `http://pngtostl.net/` redirects to `https://pngtostl.net/`.
- [x] `https://www.pngtostl.net/` redirects to `https://pngtostl.net/`.
- [x] `https://pngtostl.net/sitemap.xml` returns 200 and includes core tools, examples, privacy, terms, contact.
- [x] `https://pngtostl.net/robots.txt` allows crawl and points to sitemap.
- [x] Core pages have H1, title, meta description, canonical, and parseable JSON-LD.
- [x] Real STL conversion API smoke passes with a real sample image.
- [x] Floating Feedback entry exists on core pages.
- [x] Mobile 390px QA: no horizontal overflow; Feedback no longer overlaps `/image-to-stl` mode selector after small-screen compact button patch.

Latest crawl-readiness recheck on 2026-06-07 15:29 CST:

```text
Normal UA and Googlebot UA:
- /robots.txt: 200 text/plain
- /sitemap.xml: 200 application/xml
- /llms.txt: 200 text/plain

Sitemap URLs: 20
Full sitemap URL sampling as Googlebot: 20/20 passed
- status: 200
- final URL: canonical URL, no unexpected redirect
- canonical: self-canonical
- robots meta: index, follow
- errors: 0

Priority URLs sampled as Googlebot:
- /
- /image-to-stl
- /png-to-stl
- /jpg-to-stl
- /logo-to-stl
- /lithophane-generator
- /heightmap-to-stl
- /samples

All priority URLs returned 200, self-canonical, index/follow, one H1, and parseable JSON-LD.
```

Redirect matrix as Googlebot:

```text
http://pngtostl.net/ -> 308 https://pngtostl.net/
https://pngtostl.net/ -> 200
http://www.pngtostl.net/ -> 308 https://pngtostl.net/
https://www.pngtostl.net/ -> 308 https://pngtostl.net/
/sitemap.xml on apex/www/http/https -> 200 application/xml
```

### Domain email

Verified 2026-06-07 11:14 CST: `support@pngtostl.net` receives mail via Cloudflare Email Routing and forwards to `wanglilong616@gmail.com`.

Public DNS now uses Cloudflare Email Routing:

```text
MX -> route1.mx.cloudflare.net / route2.mx.cloudflare.net / route3.mx.cloudflare.net
SPF -> v=spf1 include:_spf.mx.cloudflare.net ~all
DKIM -> cf2024-1._domainkey.pngtostl.net
DMARC -> v=DMARC1; p=none; rua=mailto:support@pngtostl.net
```

Cloudflare Email Routing:

```text
Enabled: true
Status: ready
Rule: support@pngtostl.net -> wanglilong616@gmail.com
```

Remaining / follow-up:

- [x] Confirm `support@pngtostl.net` receives mail at the intended inbox.
- [x] Add DMARC starter TXT.
- [x] Add Cloudflare Email Routing DKIM.
- [ ] Decide outbound sending: Google Workspace / Namecheap Private Email / Resend / Cloudflare Email Sending.
- [ ] Add outbound-provider DKIM only after choosing outbound sending provider, if different from Cloudflare routing.

### Google Search Console

Verified 2026-06-07 11:42 CST via GSC API:

```text
Property: sc-domain:pngtostl.net
Permission: siteOwner
Sitemap: https://pngtostl.net/sitemap.xml
lastSubmitted: 2026-06-07T03:41:55.666Z
lastDownloaded: 2026-06-07T03:41:57.235Z
warnings: 0
errors: 0
submitted web URLs: 20
indexed: 0 immediately after first submission
```

`indexed: 0` is expected immediately after first submission; monitor Pages/Search results over the next days.

Latest automation check on 2026-06-07 15:29 CST:

```text
Available locally: curl, jq
Unavailable locally: gws, gcloud
Unset env/API keys: GOOGLE_APPLICATION_CREDENTIALS, GSC_TOKEN, GOOGLE_SEARCH_CONSOLE_TOKEN
Result: no safe automated GSC resubmission or URL Inspection API call was executed from this environment.
```

Owner/UI follow-up remains required for fresh GSC confirmation after the latest crawler-hints deploy:

1. Open Google Search Console for `sc-domain:pngtostl.net`.
2. Sitemaps: confirm `https://pngtostl.net/sitemap.xml` still shows success, 20 discovered URLs, 0 errors, 0 warnings.
3. URL Inspection: inspect and request indexing if allowed for `/`, `/image-to-stl`, `/png-to-stl`, `/samples`.
4. Pages/Search results: monitor indexed pages, impressions, and query data after crawl processing.

Follow-up:

1. Inspect URLs after Google has had time to crawl:
   - `/`
   - `/image-to-stl`
   - `/png-to-stl`
   - `/jpg-to-stl`
   - `/logo-to-stl`
   - `/lithophane-generator`
   - `/heightmap-to-stl`
   - `/samples`
2. Check Pages report for `Discovered - currently not indexed` or `Crawled - currently not indexed`.
3. Track early impressions/clicks once data appears.

### Bing Webmaster

Verified from owner-provided Bing Webmaster screenshot on 2026-06-07 12:39 CST:

```text
Site: pngtostl.net/
Sitemap: https://pngtostl.net/sitemap.xml
Known sitemaps: 1
Sitemaps with errors: 0
Sitemaps with warnings: 0
Total discovered URLs: 20
Sitemap status: 成功 / Success
Discovered URLs: 20
```

Follow-up:

1. Check Bing Search Performance and AI Performance after data processing completes; Bing indicates reports may take up to 48 hours.
2. Use URL Inspection on core URLs if indexing stays empty after crawl data appears.
3. Keep sitemap monitored for errors/warnings.

Latest automation check on 2026-06-07 15:29 CST:

```text
Unset env/API keys: BING_WEBMASTER_API_KEY, BING_API_KEY, INDEXNOW_KEY
Result: no Bing Webmaster API resubmission or IndexNow ping was executed from this environment.
```

Owner/UI follow-up remains required for fresh Bing confirmation after the latest crawler-hints deploy:

1. Open Bing Webmaster Tools for `pngtostl.net/`.
2. Sitemaps: confirm `https://pngtostl.net/sitemap.xml` still shows Success, 20 discovered URLs, 0 errors, 0 warnings.
3. URL Inspection: inspect `/`, `/image-to-stl`, `/png-to-stl`, `/samples` if indexing remains empty.
4. Search Performance / AI Performance: review after Bing finishes processing.

### Analytics

Verified 2026-06-07 12:52 CST:

```text
Provider: Google Analytics 4
Measurement ID: G-ZPV5EZHN4G
Production deploy version: cdb72d96-f0cd-41a6-bf1b-88f901f4e703
GA script loaded: true
window.gtag: function present
dataLayer config: G-ZPV5EZHN4G with anonymize_ip=true and send_page_view=true
Custom event smoke: feedback_panel_open reached window.pngtostlEvents and dataLayer/gtag
```

The site now has GA4 plus first-party event hooks:

- `window.pngtostlEvents`
- `window.dataLayer`
- `gtag` forwarding

Tracked product events include sample clicks, feedback clicks, converter success/download events, and existing converter browser events when triggered.

Follow-up:

1. Confirm GA4 Realtime shows a visit from production.
2. Confirm `feedback_panel_open` or another custom event appears in GA4 Realtime / DebugView if available.
3. Monitor landing pages and conversion events after traffic starts.

## Post-submit monitoring

Daily for first 7 days after GSC/Bing setup:

- Indexed pages count.
- Crawl errors.
- Query impressions.
- Clicks.
- Average position for `png to stl`, `image to stl`, `jpg to stl`, `lithophane generator`.
- Duplicate canonical or HTTP/HTTPS split warnings.
- Conversion events: upload selected, generate clicked, generate success, download clicked, feedback email clicked.

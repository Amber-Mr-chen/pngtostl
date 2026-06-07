# GSC and Bing indexing submission checklist — pngtostl.net

Date: 2026-06-07

## Live technical status

Validated from production `https://pngtostl.net` with a normal browser User-Agent.

- `https://pngtostl.net/robots.txt`: 200, `Content-Type: text/plain`, global `User-agent: *` allows `/`, sitemap declared.
- `https://pngtostl.net/sitemap.xml`: 200, `Content-Type: application/xml`, 23 canonical URLs listed.
- `https://pngtostl.net/llms.txt`: 200, factual site summary and core/support URLs included.
- Cloudflare Managed Content Signals block several AI training/extended crawlers such as `GPTBot`, `Google-Extended`, and `ClaudeBot`; this is not a Google Search indexing block because the global `User-agent: *` group allows `/` and declares search content signal as allowed.

## New support URLs to submit / inspect

Submit or inspect these in priority order:

1. `https://pngtostl.net/how-to-turn-logo-into-stl`
2. `https://pngtostl.net/lithophane-image-guide`
3. `https://pngtostl.net/heightmap-to-stl-terrain-guide`

Supporting discovery URLs:

- `https://pngtostl.net/`
- `https://pngtostl.net/faq`
- `https://pngtostl.net/logo-to-stl`
- `https://pngtostl.net/lithophane-generator`
- `https://pngtostl.net/heightmap-to-stl`
- `https://pngtostl.net/sitemap.xml`

## Page-level validation summary

### `how-to-turn-logo-into-stl`

- HTTP: 200
- Title length: 57
- Title: `How to Turn a Logo into an STL for 3D Printing | PNGtoSTL`
- Meta description length: 141
- Canonical: `https://pngtostl.net/how-to-turn-logo-into-stl`
- Robots meta: `index, follow`
- H1 count: 1
- In sitemap: yes
- In llms.txt: yes

### `lithophane-image-guide`

- HTTP: 200
- Title length: 46
- Title: `Best Image for Lithophane 3D Prints | PNGtoSTL`
- Meta description length: 136
- Canonical: `https://pngtostl.net/lithophane-image-guide`
- Robots meta: `index, follow`
- H1 count: 1
- In sitemap: yes
- In llms.txt: yes

### `heightmap-to-stl-terrain-guide`

- HTTP: 200
- Title length: 41
- Title: `Heightmap to STL Terrain Guide | PNGtoSTL`
- Meta description length: 130
- Canonical: `https://pngtostl.net/heightmap-to-stl-terrain-guide`
- Robots meta: `index, follow`
- H1 count: 1
- In sitemap: yes
- In llms.txt: yes

## Google Search Console manual steps

Current GSC status from owner screenshot on 2026-06-07:

- Property: `pngtostl.net`
- Sitemap URL: `https://pngtostl.net/sitemap.xml`
- Submitted: 2026-06-07
- Last read: 2026-06-07
- Status: success
- Discovered pages: 20
- Discovered videos: 0

Because GSC already shows `success`, do not submit a duplicate sitemap unless the row disappears or status changes. Continue with URL Inspection only for priority pages.

### URL Inspection sequence

For each URL below:

1. Paste the full URL into the top URL Inspection bar.
2. Wait for live inspection result.
3. Confirm:
   - URL is available to Google
   - Page fetch succeeds
   - Indexing allowed: yes
   - User-declared canonical equals inspected URL
   - Google-selected canonical is either pending/unknown or the same URL
4. Click **Request indexing** if available.

Inspect in this order:

```text
https://pngtostl.net/how-to-turn-logo-into-stl
https://pngtostl.net/lithophane-image-guide
https://pngtostl.net/heightmap-to-stl-terrain-guide
```

Current owner-confirmed status on 2026-06-07: request indexing completed for all three priority guide URLs. Next check should wait 24–72 hours and look for indexed / discovered / crawled statuses rather than submitting again immediately.

### 3. After 24–72 hours

Check **Pages** and **Search results** for:

- Whether the three URLs are indexed.
- Whether any show `Discovered - currently not indexed` or `Crawled - currently not indexed`.
- Whether impressions start appearing for guide/task queries.

Do not rewrite titles or H1 immediately if pages are not indexed within one day. New pages can take days/weeks.

## Bing Webmaster Tools manual steps

Current Bing status from owner screenshot on 2026-06-07:

- Site: `pngtostl.net/`
- Sitemap URL: `https://pngtostl.net/sitemap.xml`
- Last submitted: 2026-06-07
- Last crawled: 2026-06-07
- Status: success
- Known sitemaps: 1
- Sitemaps with errors: 0
- Sitemaps with warnings: 0
- Discovered URLs: 20

Because Bing already shows `success`, do not submit a duplicate sitemap unless the status later changes or the sitemap URL disappears.

For future checks, use Bing Webmaster Tools → `pngtostl.net/` → Sitemaps and verify the same row remains successful. If individual guide checks are needed, use URL Inspection for:

```text
https://pngtostl.net/how-to-turn-logo-into-stl
https://pngtostl.net/lithophane-image-guide
https://pngtostl.net/heightmap-to-stl-terrain-guide
```

## Verification commands used

```bash
curl -fsSLI -A 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/125 Safari/537.36' https://pngtostl.net/robots.txt
curl -fsSLI -A 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/125 Safari/537.36' https://pngtostl.net/sitemap.xml
curl -fsSLI -A 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/125 Safari/537.36' https://pngtostl.net/llms.txt
```

Script result:

```text
ROBOTS_HAS_GLOBAL_ALLOW True
ROBOTS_HAS_SITEMAP True
SITEMAP_URL_COUNT 23
indexability_validation_ok
```

## Stop conditions

Pause and report before changing the site if GSC/Bing shows:

- `Blocked by robots.txt` for Googlebot/Bingbot.
- `Alternate page with proper canonical` pointing away from these URLs.
- `Duplicate without user-selected canonical`.
- Live inspection fetch failure or 403 for Googlebot/Bingbot.
- Manual action or security issue.

If the only status is `Discovered - currently not indexed`, wait and improve external discovery/internal links before rewriting page content.

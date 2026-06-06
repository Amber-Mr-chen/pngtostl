# GSC / Bing Submission Checklist — pngtostl.net

## Scope

Production domain: `https://pngtostl.net/`
Canonical sitemap: `https://pngtostl.net/sitemap.xml`
Robots: `https://pngtostl.net/robots.txt`

## Pre-submit gates

- [ ] `https://pngtostl.net/` returns 200.
- [ ] `http://pngtostl.net/` redirects to `https://pngtostl.net/` with 301/308.
- [ ] `https://www.pngtostl.net/` redirects to `https://pngtostl.net/` with 301/308.
- [ ] `https://pngtostl.net/sitemap.xml` returns 200 and includes core tools, examples, privacy, terms, contact.
- [ ] `https://pngtostl.net/robots.txt` allows crawl and points to sitemap.
- [ ] Core pages have one H1, title, meta description, canonical, and parseable JSON-LD.
- [ ] Real browser upload -> generate -> download works on `/image-to-stl`.
- [ ] `npm run lint`, `npm run build`, responsive QA, and STL API QA pass locally.

## Google Search Console

1. Add property: Domain property preferred if DNS verification is easy; otherwise URL-prefix `https://pngtostl.net/`.
2. Verify ownership.
3. Submit sitemap: `https://pngtostl.net/sitemap.xml`.
4. Inspect these URLs after submission:
   - `/`
   - `/image-to-stl`
   - `/png-to-stl`
   - `/jpg-to-stl`
   - `/logo-to-stl`
   - `/lithophane-generator`
   - `/heightmap-to-stl`
   - `/samples`
5. Record first discovered date, coverage state, and any crawl/index errors.

## Bing Webmaster

1. Import from GSC when available, or add site manually.
2. Submit sitemap: `https://pngtostl.net/sitemap.xml`.
3. Verify `robots.txt` and crawl diagnostics.
4. If IndexNow is added later, document API key and endpoint separately.

## Post-submit monitoring

Daily for first 7 days:

- Indexed pages count.
- Crawl errors.
- Query impressions.
- Clicks.
- Average position for `png to stl`, `image to stl`, `jpg to stl`, `lithophane generator`.
- Any duplicate canonical or HTTP/HTTPS split warnings.

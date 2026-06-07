# GSC / Bing / Analytics Submission Checklist — pngtostl.net

Updated: 2026-06-07 10:41 CST

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

Google monitor token was refreshed successfully and queried GSC API.
Current account-visible properties:

```text
https://tattooideasai.net/
sc-domain:tarotrealm.xyz
sc-domain:aihumanizer.life
```

`pngtostl.net` is **not present** in current GSC account, so sitemap submission cannot be completed from this agent yet.

Owner action required:

1. Open Google Search Console.
2. Add property, preferably Domain property: `pngtostl.net`.
3. If using URL-prefix instead, add `https://pngtostl.net/`.
4. Verify ownership.
5. Submit sitemap: `https://pngtostl.net/sitemap.xml`.
6. Inspect URLs:
   - `/`
   - `/image-to-stl`
   - `/png-to-stl`
   - `/jpg-to-stl`
   - `/logo-to-stl`
   - `/lithophane-generator`
   - `/heightmap-to-stl`
   - `/samples`

### Bing Webmaster

No live Bing verification meta tag is present in production HTML:

```text
msvalidate.01: missing
```

Owner action required:

1. Open Bing Webmaster Tools.
2. Import from GSC after `pngtostl.net` is added there, or add the site manually.
3. Submit sitemap: `https://pngtostl.net/sitemap.xml`.
4. Verify crawl diagnostics.

### Analytics

Production HTML currently has no third-party analytics provider script:

```text
gtag/googletagmanager: missing
plausible: missing
umami: missing
clarity: missing
```

The site does have lightweight first-party event hooks in code:

- `window.pngtostlEvents`
- `window.dataLayer` when present
- `gtag` forwarding when present

But no GA4/GTM/Plausible/Umami provider is installed yet.

Google Analytics Admin API query only showed account:

```text
TarotRealm
```

No `pngtostl.net` GA property was visible to the current token.

Owner action required:

1. Create/select analytics provider.
2. If GA4: create property for `pngtostl.net` and provide Measurement ID `G-...`.
3. Add provider script to `src/app/layout.tsx` or via a lightweight env-based component.
4. Realtime test one normal browser visit and one conversion event.

## Post-submit monitoring

Daily for first 7 days after GSC/Bing setup:

- Indexed pages count.
- Crawl errors.
- Query impressions.
- Clicks.
- Average position for `png to stl`, `image to stl`, `jpg to stl`, `lithophane generator`.
- Duplicate canonical or HTTP/HTTPS split warnings.
- Conversion events: upload selected, generate clicked, generate success, download clicked, feedback email clicked.

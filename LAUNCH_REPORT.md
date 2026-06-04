# Launch Report

## Status
- Project: pngtostl.net
- Date: 2026-06-04
- Result: DEPLOYED_CUSTOM_DOMAIN_GO

## Source Control
- GitHub repository: https://github.com/Amber-Mr-chen/pngtostl
- Branch: `main`
- Initial commit: `e9b60f8`

## Cloudflare Deployment
- Worker name: `pngtostl`
- Deployed URL: `https://pngtostl.wanglilong616.workers.dev`
- Cloudflare version ID: `75890107-2a15-4e21-bb05-56d3f7af1bac`
- Deployment command: `npm run cf:deploy`
- OpenNext: `@opennextjs/cloudflare@1.19.11`
- Wrangler: `4.97.0`

## Production Smoke On Workers.dev
- `/`: 200
- `/robots.txt`: 200
- `/sitemap.xml`: 200
- `/faq`: 200
- `/privacy`: 200
- `/terms`: 200
- `POST /api/convert` valid PNG: 200
- API Content-Type: `model/stl; charset=utf-8`
- API Content-Disposition: `attachment; filename="test.stl"`
- API triangle count header: `320`
- STL first line: `solid pngtostl_relief`

## Custom Domain Status
- Target domains: `pngtostl.net`, `www.pngtostl.net`
- Result: both domains are deployed as Worker custom domains.
- Current DNS evidence:
  - NS: `huxley.ns.cloudflare.com`, `luciana.ns.cloudflare.com`
  - Authoritative A for root: Cloudflare proxy IPs
  - Authoritative A for www: Cloudflare proxy IPs
- Production checks:
  - `https://pngtostl.net/`: 200
  - `https://www.pngtostl.net/`: 200
  - `https://pngtostl.net/sitemap.xml`: 200
  - `https://www.pngtostl.net/sitemap.xml`: 200
  - `POST /api/convert` on both domains: 200, `model/stl`, triangle count `320`
- Conclusion: custom domain launch is complete.

## Remaining Launch Tasks
- Submit `https://pngtostl.net/sitemap.xml` to GSC and Bing.
- Run mobile screenshot matrix on production domain.
- Decide whether `www.pngtostl.net` should remain directly accessible or redirect to root.

## Dependency Audit
- `npm audit --omit=dev` reports a moderate PostCSS advisory through Next.
- `npm audit fix --force` would downgrade/install `next@9.3.3`, so it was not run.
- Recommended action: monitor Next patched release and upgrade without force downgrade.

[DONE_CUSTOM_DOMAIN_GO]

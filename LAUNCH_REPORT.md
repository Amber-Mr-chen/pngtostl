# Launch Report

## Status
- Project: pngtostl.net
- Date: 2026-06-04
- Result: DEPLOYED_WORKERS_DEV / CUSTOM_DOMAIN_BLOCKED_DNS

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
- Target domain: `pngtostl.net`
- Current DNS evidence:
  - NS: `dns1.registrar-servers.com`, `dns2.registrar-servers.com`
  - A: `162.255.119.233`
- Current HTTPS check: failed to connect to `https://pngtostl.net/`.
- Conclusion: `pngtostl.net` is not yet managed by Cloudflare and is not routed to the deployed Worker.

## Required Domain Action
Choose one:
1. Move `pngtostl.net` DNS to Cloudflare nameservers, then attach the Worker as a custom domain.
2. Keep current registrar DNS and add the records/routes required by Cloudflare after the zone is created.

## Remaining Launch Tasks
- Add `pngtostl.net` to Cloudflare zone or move nameservers.
- Attach custom domain to Worker.
- Verify `https://pngtostl.net/` returns 200.
- Verify `http://pngtostl.net` redirects to HTTPS.
- Verify `www.pngtostl.net` redirects or canonicalizes to the chosen host.
- Submit `https://pngtostl.net/sitemap.xml` to GSC and Bing after domain works.
- Run mobile screenshot matrix on production domain.

## Dependency Audit
- `npm audit --omit=dev` reports a moderate PostCSS advisory through Next.
- `npm audit fix --force` would downgrade/install `next@9.3.3`, so it was not run.
- Recommended action: monitor Next patched release and upgrade without force downgrade.

[BLOCKED_CUSTOM_DOMAIN]

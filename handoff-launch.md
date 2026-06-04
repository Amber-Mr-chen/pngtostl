# Launch Ops Handoff

## Current Conclusion
- Status: DEPLOYED_CUSTOM_DOMAIN_GO
- Summary: The site is deployed and smoke-tested on Cloudflare Workers at `https://pngtostl.net`, `https://www.pngtostl.net`, and `https://pngtostl.wanglilong616.workers.dev`.

## Verified URL
- `https://pngtostl.net`
- `https://www.pngtostl.net`
- `https://pngtostl.wanglilong616.workers.dev`

## Source
- GitHub: https://github.com/Amber-Mr-chen/pngtostl
- Branch: `main`
- Commit: `fa32cce` before this status update

## Deployment
- Worker: `pngtostl`
- Current custom-domain deploy version ID: `a4c8e2ae-64e2-43a4-b9b2-612ea810912b`
- Build command: `npm run cf:build`
- Deploy command: `npm run cf:deploy`

## Production Smoke
- Workers.dev page routes: pass.
- Workers.dev API conversion: pass.
- `pngtostl.net`: home, sitemap, and API conversion pass.
- `www.pngtostl.net`: home, sitemap, and API conversion pass.

## Next Required Action
- Submit `https://pngtostl.net/sitemap.xml` to GSC and Bing.
- Run production mobile screenshot QA.
- Decide whether `www.pngtostl.net` should remain directly accessible or redirect to root.

[DONE_CUSTOM_DOMAIN_GO]

# Project Control Board

Project: pngtostl
Domain: pngtostl.net
Market: US / English primary, Chinese secondary
Mode: automation_factory
Status: RUNNING
Fact source: /root/projects/pngtostl project files

## Student Handles
- [x] Domain selected: pngtostl.net
- [ ] DNS / Cloudflare access confirmed
- [ ] GitHub repository confirmed
- [ ] Cloudflare deploy permission confirmed
- [ ] GSC / Bing access confirmed
- [ ] Production deploy approved
- [ ] Public promotion approved

## Automatic Pipeline
- 00 setup / domain / repo / permissions: RUNNING
- 01 research: NEEDS_REVIEW
- 02 PRD / route contract: DONE
- 03 pricing: NEEDS_REVIEW
- 04 compliance: DONE_LOCAL
- 05 SEO-copy freeze: DONE
- 06 design source + content-fit matrix: NEEDS_REVIEW
- 08 backend / data contract: DONE_LOCAL / PASS_LOCAL_WORKER_RUNTIME
- 07 frontend implementation: DONE_LOCAL
- 10 SEO recheck: DONE_LOCAL / BLOCKED_LIVE_SUBMISSION
- 04 compliance recheck: WAITING
- 02 PM acceptance: WAITING
- 09 QA: PASS_WORKERS_DEV / BLOCKED_CUSTOM_DOMAIN
- 11 launch ops: DEPLOYED_WORKERS_DEV / BLOCKED_CUSTOM_DOMAIN
- 12 data review: WAITING

## Current State
- done: PRD v0, page matrix v0, copy freeze v0, isolated Next.js project scaffold, core route shell, local frontend lint/build, compliance page update, design/content-fit handoff docs, local STL backend, local QA report
- running: research/pricing/backend/data contract review
- waiting: approved design source, production runtime preview, PM gate, launch approval, data review
- blocked: custom domain pngtostl.net needs Cloudflare/DNS routing; public launch needs GSC/Bing, mobile QA, approved design source, and launch approval

## Gates
- Research Gate: NEEDS_REVIEW; competitor evidence recorded, but paid keyword metrics and trend proof are missing.
- PRD / Route Contract Gate: DONE for v0; routes are listed in PRD.md and PAGE_MATRIX.md.
- Pricing Gate: NEEDS_REVIEW; free v0 recommended, real engine cost unknown.
- Compliance Gate: DONE_LOCAL / NEEDS_RUNTIME_RECHECK; legal pages now match simple in-memory STL generation and no persistent storage, but Cloudflare runtime behavior and any future storage/analytics/payment changes require recheck.
- SEO-Copy Freeze Gate: DONE for v0; copy is frozen in COPY_FREEZE.md.
- Design Source Gate: NEEDS_REVIEW; DESIGN_HANDOFF.md and CONTENT_FIT_MATRIX.md now exist, but no approved Stitch/Figma/high-fidelity design source is recorded.
- Data Contract Gate: DONE_LOCAL / PASS_LOCAL_WORKER_RUNTIME; /api/convert now returns an in-memory ASCII STL for valid PNG uploads. Local Next.js and local Cloudflare worker runtime smoke both pass. Production deployment smoke is still required.
- Frontend Gate: DONE_LOCAL; lint and build pass locally.
- SEO GO: DONE_WORKERS_DEV / BLOCKED_CUSTOM_DOMAIN_SUBMISSION; sitemap, robots, canonicals, language alternates, and basic JSON-LD exist and pass on workers.dev, but pngtostl.net custom domain/GSC/Bing/redirect checks are not confirmed.
- QA GO: PASS_WORKERS_DEV / BLOCKED_CUSTOM_DOMAIN; local routes, API conversion, desktop visual QA, Cloudflare local worker runtime, workers.dev production smoke, lint, and build pass. Custom domain, GSC/Bing, analytics, and mobile screenshot matrix are not verified.
- Launch Gate: DEPLOYED_WORKERS_DEV / BLOCKED_CUSTOM_DOMAIN; workers.dev production smoke passes and workers.dev is explicitly enabled in wrangler config. A custom-domain deploy attempt failed because pngtostl.net DNS is still on registrar nameservers and not routed to Cloudflare Worker.

## Next Automatic Actions
1. Verify the in-memory STL converter under the target Cloudflare/OpenNext runtime.
2. Add/approve design source before high-confidence frontend GO.
3. Run production/preview browser-mobile QA for PNG upload, STL download, and error states.
4. Only after runtime/design/compliance gates are clean, continue launch prep.

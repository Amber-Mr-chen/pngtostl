# QA Acceptance Report

## Status
- Project: pngtostl.net
- Environment tested: local Next.js dev server, `http://127.0.0.1:3028`
- Date: 2026-06-04
- Result: PASS_LOCAL / NO_GO_PRODUCTION

## Launch Decision
- Local QA: pass with P2/P3 follow-ups.
- Production launch: NO-GO until Cloudflare/OpenNext runtime smoke, production URL, DNS, GSC/Bing, analytics decision, and mobile browser screenshots are verified.

## Core User Task
User opens the homepage, clicks `Start converting`, uploads a PNG, and receives a simple STL relief file.

## Verified Passes
- `/` returns 200.
- `/zh` returns 200.
- `/image-to-stl` returns 200.
- `/how-it-works` returns 200.
- `/faq` returns 200.
- `/privacy` returns 200.
- `/terms` returns 200.
- `/contact` returns 200.
- `/robots.txt` returns 200.
- `/sitemap.xml` returns 200.
- Homepage title is `PNG to STL Converter | Image to STL Online`.
- Primary hero CTA text is visible after the CTA color fix.
- Primary hero CTA links to `#converter`.
- Desktop screenshot after fix has no P0/P1 visual blockers.
- `/api/convert` valid PNG upload returns `200 OK` and `model/stl; charset=utf-8`.
- Returned STL starts with `solid pngtostl_relief`.
- Fixture STL response produced 320 facets and 65819 bytes.
- Non-multipart POST returns 400 with a clear JSON error.
- Non-PNG upload returns 400 with a clear JSON error.
- `npm run lint` passes.
- `npm run build` passes.

## Issues Found And Fixed In This QA Round

### FIXED P1: Tailwind styles were not applied
- Evidence: first desktop browser screenshot showed raw-looking HTML, merged text, malformed list spacing, and weak CTA presentation.
- Root cause: Tailwind v4 CSS import existed, but the project lacked `@tailwindcss/postcss` and `postcss.config.mjs`.
- Fix: installed `@tailwindcss/postcss` and added `postcss.config.mjs`.
- Recheck: page became visually styled; `npm run lint && npm run build` passed.

### FIXED P1: Hero primary CTA text invisible
- Evidence: computed style showed `color` and `background` both resolving to the same dark color for `Start converting`.
- Fix: set explicit inline `backgroundColor: #0f172a` and `color: #ffffff` on the hero CTA.
- Recheck: computed style shows white text on dark background; browser vision confirms CTA text is visible.

### FIXED P1: Homepage FAQ still said STL generation was not connected
- Evidence: homepage FAQ block still said `Not yet` and referenced the old contract-ready engine status.
- Fix: updated homepage FAQ and step 4 copy to match simple in-memory STL generation.
- Recheck: old-status phrase scan passed for core app pages.

## Remaining Issues

### P1: Production runtime not verified
- Affects: production launch.
- Reason: local Next.js dev smoke passed, but Cloudflare/OpenNext runtime behavior is not tested.
- Required fix: deploy to preview/production target and test `/api/convert` with a real PNG.

### P1: No production URL / DNS / GSC / Bing verification
- Affects: launch, SEO submission, analytics setup.
- Required fix: confirm GitHub repo, Cloudflare/DNS access, deployment permission, and GSC/Bing access.

### P2: Real mobile screenshot matrix not completed
- Affects: confidence, not local core functionality.
- Evidence: desktop browser QA passed; tool limitation prevented full viewport matrix capture in this round.
- Required fix: capture at least 390px and 320px screenshots after production/preview URL is available.

### P2: Converter panel is dense
- Affects: polish and first-time usability.
- Evidence: browser vision notes output/status card is readable but cramped.
- Suggested fix: simplify metadata rows or add more vertical space on small screens.

### P2: npm audit reports 2 moderate vulnerabilities
- Evidence: `npm audit --omit=dev` reports a PostCSS issue through Next's dependency chain.
- Constraint: `npm audit fix --force` would install `next@9.3.3`, a destructive downgrade.
- Suggested fix: monitor/update Next when a safe patched release is available.

## Not Tested
- Cloudflare/OpenNext runtime.
- Production HTTPS and HTTP-to-HTTPS redirect.
- GSC/Bing verification.
- Analytics events.
- Full mobile viewport matrix.
- Oversized >10 MB upload fixture.
- Malformed `.png` file with PNG extension.
- Real production domain `https://pngtostl.net`.

## Evidence
- Backend smoke: `BACKEND_SMOKE.md`.
- Desktop screenshot before style fix: `/root/.hermes/cache/screenshots/browser_screenshot_fb94c3f772444df6a7ed2b37b7538b27.png`.
- Desktop screenshot after style fix but before CTA color fix: `/root/.hermes/cache/screenshots/browser_screenshot_204c7caa1b424950b0ef2cdce510dce8.png`.
- Desktop screenshot after CTA fix: `/root/.hermes/cache/screenshots/browser_screenshot_2e457f380cbc439f9f8002a1496ef746.png`.

## Final QA Gate
- QA local gate: PASS_LOCAL.
- Production QA gate: BLOCKED_PRODUCTION.

[NEEDS_REVIEW]

# pngtostl.net visual maturity redesign checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `bf8ac701-ace8-462f-a1c0-c24d0f9c670a`

## Owner concern

Amber先生指出：站点设计和成熟同类型大站相比视觉粗糙。

## Design direction applied

Goal: move from an engineering/SEO-heavy tool page toward a mature independent SaaS/tool-site visual system.

Reference direction:
- restrained Vercel/Stripe-inspired utility site
- stronger task focus
- fewer boxed modules
- calmer typography
- premium technical surfaces
- workbench-first converter page

## Main changes

### Homepage

- Reframed hero copy to: `Turn images into printable STL files.`
- Simplified hero upload panel copy.
- Reworked visual tokens: background, panels, line system, shadows, text colors, CTA hierarchy.
- Reduced card/border noise across hero, examples, featured tools, and directory lists.
- Compressed hero height after visual review.
- Weakened repeated output note in hero upload panel.
- Reduced examples section visual weight.
- Made workflow directory rows lighter and less card-like.

### Tool page / converter workspace

- Compressed tool page hero so the workbench appears earlier.
- Changed `What to expect` card to compact `Before you generate` guidance.
- Added viewport affordances to preview area:
  - `Solid`
  - `Wireframe`
  - `Reset view`
- Added generation flow stepper:
  - `Upload image`
  - `Generate mesh`
  - `Preview STL`
  - `Download`
- Collapsed processing notes by default so controls remain primary.
- Strengthened right preview panel as a mesh/workspace surface.

### QA script update

- Updated `scripts/step11_core_tool_qa.py` homepage copy assertion from old `Upload one image` to new visual positioning copy `Turn images into printable STL files`.

## Verification completed

### Local quality gates

Command:

```bash
npm run lint && npm run build && node scripts/home_responsive_qa.js && python3 scripts/step11_core_tool_qa.py
```

Result: PASS.

Responsive QA:
- desktop overflow: false
- tablet overflow: false
- mobile overflow: false
- issueCount: 0
- mobile heroHeight: 698
- mobile scrollWidth: 390

Core STL QA:
- PASS step11 core tool QA gate
- transparentCoverage: 0.0771
- whiteBgCoverage: 0.1406
- detail96 grid: 96x48, triangles: 5068, bytes: 253484
- detail320 grid: 256x128, triangles: 26620, bytes: 1331084

### Local browser interaction

Page: `http://localhost:3030/image-to-stl?visual=final-local`

Verified:
- toolbar: `Solid`, `Wireframe`, `Reset view`
- stepper: `Upload image`, `Generate mesh`, `Preview STL`, `Download`
- generated status: `STL ready`
- download button display: block
- result metrics display: grid

### Cloudflare deployment

Command:

```bash
npm run cf:build && npm run cf:deploy
```

Result: PASS.

Deployment version:

```text
bf8ac701-ace8-462f-a1c0-c24d0f9c670a
```

### Production verification

HTTP/canonical:
- `http://pngtostl.net/` -> `https://pngtostl.net/`, redirects=1, code=200
- `http://www.pngtostl.net/` -> `https://pngtostl.net/`, redirects=1, code=200
- `https://www.pngtostl.net/` -> `https://pngtostl.net/`, redirects=1, code=200
- `https://pngtostl.net/` -> code=200, redirects=0
- `https://pngtostl.net/image-to-stl` -> code=200, redirects=0

Content checks via curl browser UA:
- `/`: hero and upload copy present
- `/image-to-stl`: `Before you generate`, `Wireframe`, `Preview STL` present
- `/sitemap.xml`: image-to-stl URL present
- `/robots.txt`: sitemap directive present

Production API:
- `POST https://pngtostl.net/api/stl/convert`: HTTP/2 200
- content-type: `model/stl`
- x-tool-occupied-ratio: 0.2288
- x-tool-triangle-count: 36860
- output size: 1843084 bytes

Production browser upload/generate:
- toolbar present
- stepper present
- status after generation: `STL ready`
- download button visible
- metrics visible as grid

Production visual review:
- final homepage screenshot judged visibly closer to mature tool-site quality
- no visual launch blocker found
- only minor non-blocking suggestion: consider unifying `Choose image` and `Upload image` wording later

## Files changed

- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/ToolPage.tsx`
- `src/components/ConverterPanel.tsx`
- `scripts/step11_core_tool_qa.py`

## Current state

Status: production deployed and verified.

Recommended next steps:
1. Owner visually reviews production homepage and `/image-to-stl`.
2. If approved, continue with GSC/Bing submission and cold-start assets.
3. Optional polish later: unify hero button wording and reduce example-section graphic density further if owner still feels it is too visual-heavy.

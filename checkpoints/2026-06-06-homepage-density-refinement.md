# pngtostl.net homepage density refinement checkpoint

Time: 2026-06-06
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Deployment version: `25e94c07-a003-46b0-83e6-fb06be6eda4a`

## User feedback

Screenshot review: homepage title typography was too large; title and text occupied too much of the first viewport, while the actual upload/tool function area felt too small.

## Goal

Perform a focused UI density refinement without redesigning the page:

- reduce hero H1 size and line dominance;
- reduce copy/action spacing;
- give the upload/workflow panel more horizontal share;
- keep first viewport tool-first rather than marketing-heavy;
- preserve current IA, routes, copy, and converter behavior.

## Skills used

- `frontend-site-automation`
- `nextjs-ui-density-refinement`

## Files changed

- `src/app/globals.css`
  - Final active `.homeHero` desktop grid now uses a narrower copy side and wider tool panel side.
  - Final active `.homeHero h1` clamp reduced.
  - Final active hero paragraph/action spacing reduced.
  - Upload dropzone/panel sizing adjusted so the function panel reads as the primary work area.
  - Mobile H1 clamp reduced and hero padding tightened.

## Important implementation detail

The first attempt changed earlier CSS blocks, but a later final-pass block was overriding `.homeHero h1`:

```css
.homeHero h1 {
  font-size: clamp(3rem, 7vw, 5.7rem);
}
```

The final fix patched the later active block, which browser/computed-style verification confirmed.

## Local verification

Command:

```bash
npm run lint && npm run build && node scripts/home_responsive_qa.js && python3 scripts/step11_core_tool_qa.py
```

Result: PASS.

Build:

- 26 static/generated pages.

Responsive QA after final patch:

- issueCount: 0
- desktop overflow: false
- tablet overflow: false
- mobile overflow: false
- desktop H1 height: 126px
- tablet H1 height: 82px
- mobile H1 height: 86px
- mobile scrollWidth: 390
- hasSlider: true
- tabCount: 3

Core STL QA:

- PASS
- detail96: 96 x 48, 5068 triangles, 253,484 bytes
- detail320: 256 x 128, 26,620 triangles, 1,331,084 bytes

Local browser geometry on homepage:

- viewport clientWidth: 1265
- scrollWidth: 1265
- overflow: false
- H1 computed fontSize: 58.88px
- H1 height: 118px
- hero width: 1180px
- hero height: 606px
- upload panel width: 500px
- upload panel height: 556px
- upload panel share: 42%
- dropzone width: 472px
- dropzone height: 255px

## Production deployment

Command:

```bash
npm run cf:build && npm run cf:deploy
```

Result: PASS.

Cloudflare Worker Version:

```text
25e94c07-a003-46b0-83e6-fb06be6eda4a
```

## Production verification

HTTP smoke:

- `https://pngtostl.net/` -> 200
- `https://pngtostl.net/image-to-stl` -> 200
- `https://pngtostl.net/sitemap.xml` -> 200

Production browser geometry:

- viewport clientWidth: 1265
- scrollWidth: 1265
- overflow: false
- H1 computed fontSize: 58.88px
- H1 height: 118px
- hero width: 1180px
- hero height: 606px
- upload panel width: 500px
- upload panel height: 556px
- upload panel share: 42%
- dropzone width: 472px
- dropzone height: 255px

Production API regression:

- `POST https://pngtostl.net/api/stl/convert`
- status 200: true
- content-type STL: true
- bytes: 1,843,084
- triangle header present: true

## Status

DONE. The homepage first viewport now gives substantially less dominance to the headline and more weight to the functional upload/workflow panel while preserving routes, copy, SEO, and conversion behavior.

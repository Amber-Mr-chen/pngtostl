# SEO support page plan — pngtostl.net

Date: 2026-06-07

## Goal

Add support pages that capture practical informational intent and route users into real PNGtoSTL workflows without creating thin SEO-only pages.

## SERP reconnaissance note

Direct Google SERP access was blocked by bot verification from the execution environment. Bing/Yahoo/Startpage HTML endpoints returned polluted or generic results for the first attempts, so the decision below uses:

- existing site IA gaps,
- real user tasks already supported by the converter,
- sample preset availability,
- route-specific monetizable/commercial intent,
- strict avoidance of overpromising full 3D reconstruction.

A later manual SERP check can refine titles and copy, but these routes are safe because each has a concrete on-page task and direct tool handoff.

## Selected first batch

### 1. `/how-to-turn-logo-into-stl`

- Primary intent: how to turn logo into STL for 3D printing.
- User task: decide whether logo artwork is suitable for a badge/sign/stamp STL and load a logo preset.
- On-page utility: interactive recommendation, checklist, 3-step workflow, sample preset cards, FAQ.
- Tool handoff: `/logo-to-stl?sample=logo-badge-relief...`
- Samples: logo badge relief, rubber stamp relief, workshop sign plate.
- Risk avoided: does not promise sculpted mascots or full 3D logo reconstruction.

### 2. `/lithophane-image-guide`

- Primary intent: best image for lithophane 3D print.
- User task: check whether a photo will work as a backlit lithophane before generating STL.
- On-page utility: interactive recommendation, checklist, 3-step workflow, sample preset cards, FAQ.
- Tool handoff: `/lithophane-generator?sample=backlit-lithophane-panel...`
- Samples: backlit lithophane panel, portrait lithophane night light.
- Risk avoided: explains lithophane output instead of claiming full photo-to-3D object reconstruction.

### 3. `/heightmap-to-stl-terrain-guide`

- Primary intent: heightmap to STL terrain guide.
- User task: confirm grayscale heightmap suitability and choose safe terrain tile defaults.
- On-page utility: interactive recommendation, checklist, 3-step workflow, sample preset cards, FAQ.
- Tool handoff: `/heightmap-to-stl?sample=terrain-heightmap-tile...`
- Samples: heightmap surface, terrain heightmap tile.
- Risk avoided: distinguishes actual heightmaps from normal landscape photos.

## Quality gates

- Routes are included via `helperPages`, so dynamic page generation, sitemap, and llms.txt include them automatically.
- Every route must have a local task/checklist and cannot be pure copy.
- Primary CTA and sample cards must link to live converter pages with sample preset parameters.
- Verify build, Cloudflare deploy, production browser snapshots, sitemap inclusion, and preset handoff.

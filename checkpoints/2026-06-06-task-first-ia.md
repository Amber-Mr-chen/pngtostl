# pngtostl.net checkpoint — task-first IA optimization

Time: 2026-06-06 10:30:50 CST
Project: `/root/projects/pngtostl`
Production: `https://pngtostl.net/`
Worker: `pngtostl`
Latest deployed Cloudflare Version ID: `6f3f46cf-a0e7-484e-ae85-c418fb4bdd83`

## User decision / rationale

Amber先生 questioned whether separate homepage-level entries for PNG to STL, JPG to STL, and Image to STL are confusing because the core user task is the same: upload an image and convert it to STL.

Decision implemented:

- UX should be task-first and use a universal upload entry.
- SEO format pages should remain, but should not look like separate primary products.
- Homepage/top navigation should promote workflows/output goals rather than file extensions.

## Implemented changes

### Homepage IA

Changed homepage from format-first to task-first:

- Main headline: `Upload one image. Choose the STL workflow that fits.`
- Primary CTA: `Upload image` → `/image-to-stl`
- Top nav now promotes:
  - `Image to STL`
  - `Logo`
  - `Lithophane`
  - `Heightmap`
  - `Tools`
- Hero `Choose your tool` panel now promotes:
  - `Image to STL` — universal entry for PNG/JPG/WebP/GIF/BMP
  - `Logo to STL`
  - `Lithophane`
  - `Heightmap`

### Tool directory grouping

Homepage directory changed to:

1. `Core STL workflows`
   - `/image-to-stl`
   - `/logo-to-stl`
   - `/lithophane-generator`
   - `/heightmap-to-stl`
2. `Format-specific starting points`
   - `/png-to-stl`
   - `/jpg-to-stl`
   - `/convert-image-to-stl`
3. `Photo and print planning utilities`
   - `/photo-to-lithophane`
   - `/3d-print-photo`
   - `/2d-image-to-3d-model`

### SEO page positioning

Updated `src/lib/tools.ts`:

- `/image-to-stl` is now positioned as the universal image converter.
- `/png-to-stl` is now a format-specific starting point using the same core converter engine, tuned for transparent PNG icons/emojis/simple graphics.
- `/jpg-to-stl` is now a JPG/photo-focused entry into the universal converter, not a separate homepage-level primary product.
- PNG FAQ updated to explain why the PNG page exists despite universal support.

Updated `src/components/ConverterPanel.tsx`:

- `/image-to-stl` helper now explains universal entry and mode choice:
  - PNG/JPG/WebP/GIF/BMP
  - relief/logo/lithophane/heightmap output modes

### Responsive fix

After longer task-based nav labels caused tablet overflow:

- Fixed `globals.css` for <=960px:
  - `.homeNav` stacks
  - `.homeNavRight` wraps instead of overflowing
  - `.homeNavLinks` and `.accountActions` wrap

## Validation

Local validation passed:

```text
npm run build: passed
node scripts/home_responsive_qa.js: passed
python3 scripts/step11_core_tool_qa.py: passed
```

Responsive QA result:

```text
desktop overflow=false
tablet overflow=false
mobile overflow=false
hero tool links=4
showcase slider=true
tabs=3
```

Core tool QA result:

```text
PASS step11 core tool QA gate
transparentCoverage=0.0771
whiteBgCoverage=0.1406
detail96 grid=96x48 triangles=5068
detail320 grid=256x128 triangles=26620
```

Browser visual verification:

- Local screenshot confirmed task-first homepage, no obvious layout break.
- Production screenshot confirmed task-first homepage, no obvious layout break.
- Production screenshot path:
  - `/root/.hermes/cache/screenshots/browser_screenshot_9ba2b4074b2c436d900d733af173f432.png`

## Deployment

Executed:

```text
npm run cf:build && npm run cf:deploy
```

Deployment succeeded:

```text
Worker: pngtostl
Current Version ID: 6f3f46cf-a0e7-484e-ae85-c418fb4bdd83
Workers URL: https://pngtostl.wanglilong616.workers.dev
Production URL: https://pngtostl.net/
```

Production text checks passed for:

- `https://pngtostl.net/`
- `https://www.pngtostl.net/` → final `https://pngtostl.net/`
- `https://pngtostl.wanglilong616.workers.dev/`

Required text found:

```text
Upload one image
Image to STL
Core STL workflows
Format-specific starting points
PNG entry
JPG entry
```

Production API smoke passed:

```text
POST https://pngtostl.net/api/stl/convert
HTTP/2 200
content-type: model/stl
bytes: 204684
header: b'pngtostl relief 32'
```

## Current recommendation

The site is now better aligned with mature converter-site IA:

- One universal user entry for the same underlying upload task.
- Task/output workflow navigation.
- Format-specific pages retained for SEO and defaults, but demoted from primary UX.

Next possible work:

1. Update metadata/title from generic `PNG to STL Converter` to a homepage-specific title like `Image to STL Converter | PNGtoSTL`.
2. Consider adding a real `/api` or `/pricing` placeholder page later if top nav keeps API/account actions.
3. Add analytics events for `Upload image`, `Image to STL`, `Logo to STL`, `Lithophane`, and `Heightmap` clicks.
4. Do post-launch GSC/sitemap submission after IA settles.

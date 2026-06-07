# pngtostl.net progress checkpoint

Time: 2026-06-07 09:42:51 CST
Project: `/root/projects/pngtostl`
Production: https://pngtostl.net/
Branch: `main`

## Current status

Completed and deployed:

1. Premium v4 sample visual upgrade
   - Homepage and `/samples` examples use `premium-v4` assets.
   - Logo, Universal relief, Lithophane, and Heightmap previews were visually improved and deployed.

2. Sticky home return header
   - All tool pages and info/helper pages now expose the top-left `PNGtoSTL` home link.
   - Header stays sticky while scrolling.
   - Clicking `PNGtoSTL` returns to `/`.

3. Typography compacting after owner review
   - Oversized headings reduced.
   - `/samples` H1 around 40px desktop.
   - `/samples` filter section H2 reduced from about 37.6px to about 26.24px.
   - Tool page H1 around 45px desktop and H2 around 25.6px.

4. Compact sticky headers
   - Info/tool sticky headers reduced from about 109px to about 59px.
   - Desktop headers stay single-line where possible.
   - Mobile nav links collapse to avoid taking too much vertical space.

5. Homepage polish pass
   - Homepage hero tightened.
   - Sticky header z-index increased to 140.
   - Anchor scroll padding added so sticky header does not cover target sections.
   - Homepage workflow images switched to eager loading to reduce screenshot/scroll blank-state risk.

6. FAQ usability fix
   - `/faq` previously looked like only question titles because all `<details>` were closed.
   - First 6 FAQ items now default open.
   - Production `/faq` text length increased from about 626 to 1535 visible chars.

## Production deployment versions

- Header/title polish deployment: `6b8f98da-8534-48d9-89be-09b249187532`
- FAQ open answers deployment: `f39fcbe5-6747-4937-9b22-85f76531604e`

## Production verification snapshots

### `/samples`

- CSS: `0eeqc1qsnx-r1.css`
- Header position: sticky
- Header z-index: 140
- Header height: 59px
- Brand href: `https://pngtostl.net/`
- H1: `Image to STL examples`, about 40.32px
- Filter H2: about 26.24px
- Sample card H2: about 17.28px
- Overflow: false

### `/`

- Header sticky, z-index 140, height about 60px
- H1 about 44.16px
- Section H2 about 28.8px
- Overflow: false
- `Browse tools` anchor leaves enough clearance below sticky header.

### `/image-to-stl`

- Header sticky, height about 59px
- H1 about 45.44px
- H2 about 25.6px
- Overflow: false

### `/pricing`

- Header sticky, height about 59px
- H1 about 40.32px
- Card H2 about 16.64px
- Overflow: false

### `/faq`

- Header sticky, height about 59px
- H1 about 44px
- First 6 FAQ details are open by default
- Total FAQ details: 14
- Visible body text length about 1535 chars
- Overflow: false

## Tests passed

- `npm run lint`
- `npm run build`
- `node scripts/home_responsive_qa.js`
- `npm run cf:build`
- `npm run cf:deploy`

## Files changed in current polish round

- `src/app/[slug]/page.tsx`
  - FAQ first 6 details default open.
- `src/app/globals.css`
  - Final owner polish CSS for compact headers, headings, sticky behavior, scroll padding, mobile nav collapse.
- `src/components/HomeShowcase.tsx`
  - Workflow sample source/preview images changed from lazy to eager.

## Next recommended work

1. Mobile visual screenshots on real device or browser mobile emulation:
   - `/`
   - `/samples`
   - `/image-to-stl`
   - `/pricing`
   - `/faq`

2. SEO/GSC/AITDK check:
   - sitemap and robots
   - canonical
   - metadata
   - AITDK overview after latest deploy
   - Google Search Console sitemap submission if not done

3. Conversion funnel analytics:
   - upload selected
   - generate clicked
   - generate success/failure
   - STL download clicked
   - sample STL download clicked

4. Optional UX refinement:
   - current-page nav active state
   - mobile header CTA/menu pattern
   - FAQ answer copy expansion for long-tail SEO

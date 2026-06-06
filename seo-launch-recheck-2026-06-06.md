# pngtostl.net SEO launch recheck — 2026-06-06

Production: https://pngtostl.net/
Project: /root/projects/pngtostl
Worker: pngtostl
Latest deployed version checked: 45778b38-ffb6-4700-a0e1-e971eb5a515f

## Current conclusion

Status: NEEDS_REVIEW / GSC_BLOCKED

The production site is technically crawlable and the post-launch SEO basics now pass after the latest fixes. Google Search Console submission is not marked done because no GSC CLI/login tool is available in this environment.

## Checks completed

### Production core pages

All checked URLs returned 200:

- https://pngtostl.net/
- https://pngtostl.net/image-to-stl
- https://pngtostl.net/png-to-stl
- https://pngtostl.net/jpg-to-stl
- https://pngtostl.net/logo-to-stl
- https://pngtostl.net/lithophane-generator
- https://pngtostl.net/heightmap-to-stl
- https://pngtostl.net/robots.txt
- https://pngtostl.net/sitemap.xml
- https://pngtostl.net/llms.txt

www canonicalization:

- https://www.pngtostl.net/ returns final URL https://pngtostl.net/

### Metadata/canonical/H1

Homepage after fix:

- Title: `Image to STL Converter | PNGtoSTL`
- Meta description length: 111
- Robots meta: `index, follow`
- H1 count: 1
- H1: `Upload one image. Choose the STL workflow that fits.`

Core inner pages checked:

- /image-to-stl
- /png-to-stl
- /jpg-to-stl
- /logo-to-stl
- /lithophane-generator
- /heightmap-to-stl

Each checked inner page has:

- HTTP 200
- self-referencing canonical
- exactly one H1
- non-empty title and meta description

### robots.txt

- Status: 200
- Sitemap reference present through Next metadata route.

### sitemap.xml

- Status: 200
- Contains homepage and core tool/helper URLs.

### llms.txt

Initial check found `/llms.txt` 404.

Fix applied:

- Added `src/app/llms.txt/route.ts`
- Deployed to Cloudflare
- Production recheck: `/llms.txt` now returns 200 text/plain

### Homepage metadata fix

Initial check found homepage title still said `PNG to STL Converter` despite task-first IA.

Fix applied:

- Updated `src/app/layout.tsx`
- Homepage title is now `Image to STL Converter | PNGtoSTL`
- Added explicit `robots: { index: true, follow: true }`
- Updated homepage Open Graph title/description

## Validation commands run

```text
npm run build
node scripts/home_responsive_qa.js
python3 scripts/step11_core_tool_qa.py
npm run cf:build && npm run cf:deploy
```

All passed.

Latest deploy:

```text
Worker: pngtostl
Version ID: 45778b38-ffb6-4700-a0e1-e971eb5a515f
```

## Git/worktree status

Repository has many untracked rebuild artifacts and project handoff documents. Obvious Python cache was removed and `.gitignore` was updated with:

```text
__pycache__/
*.pyc
*.log
```

No `.next`, `.open-next`, `node_modules`, `.env`, or large >2MB files were found in the non-ignored working tree scan.

Recommended before final commit/push:

1. Review whether research screenshots and handoff docs should be committed with the app source.
2. If yes, commit the full rebuild state.
3. If no, move research/screenshots to a docs/archive location or ignore them deliberately, then commit source + essential docs only.

## GSC / Bing status

GSC submission was not completed in this session.

Reason:

- No `gws` CLI available.
- No visible browser login workflow for GSC was initiated in this chat.
- Search Console submission requires owner login/permission.

Manual next steps:

1. Open Google Search Console.
2. Add/verify property for `https://pngtostl.net/` or domain property `pngtostl.net`.
3. Submit sitemap: `https://pngtostl.net/sitemap.xml`.
4. Use URL Inspection for:
   - `https://pngtostl.net/`
   - `https://pngtostl.net/image-to-stl`
   - `https://pngtostl.net/png-to-stl`
   - `https://pngtostl.net/jpg-to-stl`
5. Repeat in Bing Webmaster Tools if available.

## Risks / priorities

P0:

- None found in technical crawl basics after fixes.

P1:

- GSC/Bing submission still BLOCKED by lack of login/tool access.
- Git state needs owner decision: commit all rebuild/handoff files or prune/archive first.

P2:

- Some inner page meta descriptions are short but acceptable for launch.
- Top nav has API/Login placeholders; consider real pages or clearer coming-soon handling later.
- Add analytics events after first stable launch.

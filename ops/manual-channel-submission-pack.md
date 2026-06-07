# Manual channel submission pack — pngtostl.net

Date: 2026-06-07

Purpose: prepare owner-assisted submissions for channels that usually require login, account reputation, CAPTCHA, or manual review. Do not duplicate pending channels already submitted.

## Current status

Manual access check on 2026-06-07:

- Dev Hunt: `/submit` direct path 404, header `Submit your Dev Tool` opens login; GitHub/Google login required.
- SideProjectors: `/submit` redirects to `/auth/login`; account login required.
- AlternativeTo: `/software/new/` hit Cloudflare security verification from the automation browser; visible owner browser required.
- SaaSHub: `/submit` hit Cloudflare block from the automation browser; visible owner browser required.

Already pending / do not resubmit:

- GitHub awesome-3d-printing PR #92 — pending_review
- Hackaday Submit A Tip — pending_review
- Launching Next — pending_review

## Priority manual channels

### 1. Dev Hunt

- URL: https://devhunt.org/
- Fit: developer/tool launch directory; PNGtoSTL is a no-signup maker/developer utility.
- Owner action needed: log in / create account / pass any verification.
- Suggested category: Developer Tool, AI/Design Tool, or Utility if available.
- Submission title: PNGtoSTL
- URL: https://pngtostl.net
- Short description: Free image-to-STL converter for logo badges, reliefs, lithophanes, and heightmap terrain tiles.
- Longer description:

```text
PNGtoSTL is a free no-signup image-to-STL tool for makers and 3D printing workflows. Upload PNG, JPG, WebP, GIF, or BMP images and generate STL outputs for logo badges, raised reliefs, lithophanes, and grayscale heightmap terrain tiles. The site includes real sample workflows, downloadable STL examples, preset handoffs, and practical print guidance so users can choose the right workflow before printing.
```

- Tags: 3D printing, STL, image converter, maker tool, lithophane, heightmap, no signup
- Screenshot suggestion: homepage hero or `/samples` proof gallery.
- Stop condition: if the site requires paid promotion or unrelated social-login permissions, pause for owner decision.

### 2. SideProjectors

- URL: https://www.sideprojectors.com/
- Fit: small product/project listing; good for early visibility and potential acquisition/buyer interest.
- Owner action needed: account login, project ownership confirmation.
- Suggested listing type: Showcase / Side Project, not sale unless owner wants to sell.
- Title: PNGtoSTL
- URL: https://pngtostl.net
- One-liner: Free image-to-STL converter for makers, 3D printing, logo reliefs, lithophanes, and heightmaps.
- Description:

```text
PNGtoSTL helps makers convert images into printable STL workflows without signing up. It supports practical image-to-STL use cases including transparent logo badges, raised relief plates, lithophane photo panels, and grayscale heightmap terrain tiles. The site includes real downloadable STL samples and preset links so users can start from proven settings.
```

- Monetization status: Free now; planned Pro/API/batch options by demand.
- Stop condition: do not mark as for-sale unless owner explicitly wants that.

### 3. AlternativeTo

- URL: https://alternativeto.net/
- Fit: useful if PNGtoSTL can be positioned as an alternative to generic image-to-STL / lithophane / STL conversion tools.
- Owner action needed: login and likely moderation.
- Suggested app type: Web app.
- License/pricing: Free.
- Platforms: Web.
- Tags: 3D Printing, STL, Image Converter, Lithophane, Heightmap.
- Description:

```text
PNGtoSTL is a free web-based image-to-STL converter for 3D printing. It turns simple images into raised relief STL files, logo badge STL files, lithophane panels, and heightmap-style terrain surfaces. It is designed for quick no-signup maker workflows and includes examples, presets, and practical limits for what a single image can produce.
```

- Stop condition: if AlternativeTo requires selecting a direct competitor and no suitable category exists, pause and collect competitor list first.

### 4. SaaSHub

- URL: https://www.saashub.com/
- Fit: software/tool directory; moderate fit because current product is free utility rather than full SaaS.
- Owner action needed: login/company or product claim flow.
- Suggested category: 3D Modeling, Design Tools, Developer Tools, or Image Tools if available.
- Short description: Free image-to-STL converter for 3D printing workflows.
- Caution: avoid overclaiming SaaS features. No login, billing, saved projects, or API are live yet.
- Stop condition: if it requires business verification or paid listing, pause for owner approval.

## Universal submission fields

Product name:

```text
PNGtoSTL
```

Website:

```text
https://pngtostl.net
```

Support/contact:

```text
support@pngtostl.net
```

Short pitch:

```text
Free image-to-STL converter for logo badges, reliefs, lithophanes, and heightmap terrain tiles.
```

Long pitch:

```text
PNGtoSTL is a free no-signup image-to-STL converter for makers and 3D printing workflows. It supports PNG, JPG, WebP, GIF, and BMP inputs and helps users choose practical STL workflows: logo badge reliefs, raised image reliefs, lithophane photo panels, and grayscale heightmap terrain tiles. Real sample workflows include downloadable STL files, rendered previews, recommended presets, and failure-case notes so users understand what a single image can and cannot produce before printing.
```

Key proof URLs:

```text
https://pngtostl.net/samples
https://pngtostl.net/logo-to-stl?sample=logo-badge-relief
https://pngtostl.net/lithophane-generator?sample=backlit-lithophane-panel
https://pngtostl.net/heightmap-to-stl?sample=terrain-heightmap-tile
```

SEO support URLs:

```text
https://pngtostl.net/how-to-turn-logo-into-stl
https://pngtostl.net/lithophane-image-guide
https://pngtostl.net/heightmap-to-stl-terrain-guide
```

## Manual execution rule

- Use a visible browser when login/CAPTCHA/account creation is required.
- Do not reuse the same exact description everywhere if a platform has strict quality rules; adapt but preserve factual claims.
- Do not submit duplicate entries to channels already pending.
- After each successful submission, update `ops/coldstart-submission-log.md` with status, evidence URL/screenshot, and next follow-up rule.

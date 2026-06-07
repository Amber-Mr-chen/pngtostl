# PNGtoSTL Launch Media Pack

Updated: 2026-06-07 16:08 CST

Purpose: local media assets for the first-batch cold-start submissions documented in:

- `ops/first-batch-submission-field-pack.md`
- `ops/coldstart-submission-log.md`

Execution boundary:

- These files are prepared for owner-approved submissions only.
- Do not upload to directories, post publicly, or submit editorial tips without explicit owner approval.
- If a submission form requires login, CAPTCHA, payment, reciprocal backlink/badge, or site modification, stop and record the blocker in `ops/coldstart-submission-log.md`.

## Recommended default assets by channel

### Launching Next

Use:

- Screenshot: `homepage-hero-1366x900.png`
- Optional logo: `pngtostl-icon-512.png` or `pngtostl-wordmark-transparent.png`

Why:

- Broad startup/tool directory.
- Homepage hero explains the product fastest.

### Dev Hunt

Use:

- Screenshot: `image-to-stl-workspace-1366x900.png`
- Optional proof fallback: `tool-proof-section-1366x900.png`
- Optional logo: `pngtostl-icon-512.png`

Why:

- Dev/tool audience benefits from seeing the actual workspace UI.
- If the form allows more than one image, add proof screenshot as second image.

### Insidr AI

Use:

- Screenshot: `homepage-hero-1366x900.png`
- Optional proof: `samples-gallery-1366x900.png`
- Optional logo: `pngtostl-icon-512.png`

Why:

- AI/tool directories usually need quick product framing.
- Samples screenshot adds evidence that this is a functional maker workflow, not a generic AI landing page.

### MicroLaunch

Use:

- Screenshot: `samples-gallery-1366x900.png`
- Optional full-page proof: `samples-gallery-fullpage.png`
- Optional output examples: `sample-logo-badge-preview.png`, `sample-lithophane-preview.png`, `sample-heightmap-preview.png`

Why:

- Product launch/discovery context benefits from proof and real examples.
- `/samples` UTM is already the recommended MicroLaunch target.

### Hackaday Submit A Tip

Use if the form accepts media attachments:

- Primary proof screenshot: `tool-proof-section-1366x900.png`
- Additional proof: `sample-sign-plate-preview.png`, `sample-logo-badge-preview.png`, `sample-heightmap-preview.png`

Why:

- Hackaday audience cares about real maker output more than generic homepage copy.
- The proof screenshot visibly shows source image, STL preview, triangle count, file size, and Download STL buttons.

## Asset inventory

### Page screenshots

#### `homepage-hero-1366x900.png`

- Source URL: `https://pngtostl.net/?launch-media=home`
- Size: 1366 x 900
- Use for: general directory listing, product overview, broad first impression.
- Visual QA: suitable. Clearly shows hero headline, upload CTA, and tool choices.
- Caveat: Feedback widget is visible in the lower-right corner.

#### `image-to-stl-workspace-1366x900.png`

- Source URL: `https://pngtostl.net/image-to-stl?launch-media=tool`
- Size: 1366 x 900
- Use for: workspace/UI proof, Dev Hunt, developer/tool audiences.
- Visual QA: suitable for showing the real converter workspace.
- Caveat: empty state only; preview is waiting for image. Use `tool-proof-section-1366x900.png` when a real result is more important.

#### `samples-gallery-1366x900.png`

- Source URL: `https://pngtostl.net/samples?launch-media=samples`
- Size: 1366 x 900
- Use for: examples/proof-first listings, MicroLaunch, channels that ask for real output evidence.
- Visual QA: suitable. Shows real workflow examples and sample metrics.
- Caveat: only the first example card is fully prominent in the cropped viewport.

#### `samples-gallery-fullpage.png`

- Source URL: `https://pngtostl.net/samples?launch-media=samples-full`
- Size: 1351 x 6251
- Use for: internal proof archive, not usually for direct directory upload.
- Visual QA: large full-page capture.
- Caveat: too tall for many directory forms; crop before external upload if needed.

#### `tool-proof-section-1366x900.png`

- Source URL: `https://pngtostl.net/png-to-stl?launch-media=proof`
- Size: 1366 x 900
- Use for: proof screenshot, Hackaday tip, maker/community editorial contexts.
- Visual QA: suitable. Shows `REAL OUTPUT PROOF`, two example cards, STL metrics, and Download STL buttons.
- Caveat: example previews are visible but small; use individual sample preview PNGs if a larger output image is needed.

### Logo / icon assets

#### `pngtostl-icon-512.png`

- Size: 512 x 512
- Transparent PNG icon.
- Use for: directory icon/logo upload.

#### `pngtostl-icon-256.png`

- Size: 256 x 256
- Transparent PNG icon.
- Use for: smaller icon upload fields.

#### `pngtostl-wordmark-transparent.png`

- Size: 1200 x 360
- Transparent wordmark.
- Use for: forms that ask for a wider logo/banner.

Note:

- These are simple launch-form assets generated locally for submission convenience.
- If the brand later gets a final visual identity, replace these before high-visibility launches.

### Sample proof assets

#### `sample-logo-badge-source.png`

- Source: copied from `public/samples/logo-badge-source.png`
- Use for: showing input image.

#### `sample-logo-badge-preview.png`

- Source: copied from `public/samples/logo-badge-preview.png`
- Use for: showing generated logo badge STL output.

#### `sample-lithophane-preview.png`

- Source: copied from `public/samples/lithophane-panel-premium-v4-preview.png`
- Use for: showing lithophane output.

#### `sample-heightmap-preview.png`

- Source: copied from `public/samples/heightmap-surface-premium-v4-preview.png`
- Use for: showing heightmap output.

#### `sample-sign-plate-preview.png`

- Source: copied from `public/samples/sign-plate-expanded-v1-preview.png`
- Use for: Hackaday/maker proof and sign-plate example.

## Screenshot regeneration

Script:

```bash
node scripts/capture_launch_media.js
```

The script captures production pages with headless Chrome and writes screenshots to this folder.

Prerequisites observed on 2026-06-07:

```text
node: available
/usr/bin/google-chrome: available
```

## Pre-upload checklist

Before uploading any asset externally:

- [ ] Owner has approved the specific channel and submission.
- [ ] File matches the form requirements for dimensions and size.
- [ ] Screenshot still reflects the current production site.
- [ ] Copy does not overclaim full 3D reconstruction, STL color preservation, or printer-ready guarantee.
- [ ] UTM URL from `ops/first-batch-submission-field-pack.md` is used in the form.
- [ ] Attempt is recorded in `ops/coldstart-submission-log.md`.

## Do not use

- Do not use `samples-gallery-fullpage.png` directly if the form needs a normal aspect ratio thumbnail.
- Do not upload proof images to paid/sponsored forms without owner approval.
- Do not edit the site to satisfy reciprocal badge/link requirements without owner approval.

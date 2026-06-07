# PNGtoSTL Manual-Required Submission Playbook

Updated: 2026-06-07

Purpose: preserve the remaining first-batch manual paths after the low-risk submissions were completed.

Related files:

- `ops/coldstart-submission-log.md`
- `ops/first-batch-submission-field-pack.md`
- `ops/launch-media/README.md`

Execution boundary:

- Do not create accounts, log in, solve CAPTCHA/Cloudflare, pay, add reciprocal links, or upload files unless the owner is present and explicitly approves that exact action.
- Do not mark anything `submitted`, `pending_review`, or `listed` without visible confirmation text, a success URL, or an accepted queue/listing signal.
- If a form accepts valid fields but produces no success/error/redirect after one retry, stop and keep it `manual_required`.
- Use truthful maker/3D-printing framing. Do not overclaim full 3D reconstruction, printer-ready guarantees, AI capabilities, or expected editorial coverage.

## Current Remaining Manual Queue

### Dev Hunt

Status:

```text
manual_required
```

Why:

- Legacy URL `https://devhunt.org/submit` now returns 404.
- The live header entry `Submit your Dev Tool` on `https://devhunt.org/` routes to login.
- Login providers shown during preflight: GitHub / Google.
- Page says Dev Hunt uses GitHub/Google providers to filter bots and fakes.

Owner action needed:

1. Open `https://devhunt.org/` in a visible browser.
2. Click `Submit your Dev Tool`.
3. Log in with the owner-approved GitHub or Google account.
4. Stop immediately after login if the next page shows payment, CAPTCHA, reciprocal link/badge, or unclear launch/package pricing.
5. If a free submission form appears, fill only the fields below.

Target URL:

```text
https://pngtostl.net/?utm_source=devhunt&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_form
```

Preferred title:

```text
PNGtoSTL: browser-based image-to-STL workspace with real downloadable examples
```

Shorter title if field is limited:

```text
PNGtoSTL — Image to STL converter for makers
```

Tagline:

```text
Turn images into practical STL reliefs, logo badges, lithophanes, and heightmap surfaces.
```

Short description:

```text
Browser-based image-to-STL workspace for maker workflows, with a live converter and real downloadable STL examples.
```

Long description:

```text
PNGtoSTL is a browser-based workspace for practical image-to-STL workflows. It helps makers create relief-style STL outputs, logo badges, lithophanes, and heightmap surfaces from images. The site includes a live converter plus a real examples gallery with source images, previews, triangle counts, file sizes, settings notes, and downloadable STL files, so users can judge output quality before trying their own image.
```

Suggested category:

```text
Developer Tools / Design Tools / Maker Tools
```

Suggested tags:

```text
3d-printing, image-to-stl, png-to-stl, maker-tools, lithophane
```

Recommended assets if image upload is offered:

- `ops/launch-media/image-to-stl-workspace-1366x900.png`
- `ops/launch-media/tool-proof-section-1366x900.png`
- `ops/launch-media/pngtostl-icon-512.png`

Stop conditions:

- Payment, paid launch, paid review, card/checkout, sponsor package.
- CAPTCHA/Cloudflare/security verification not already completed by the owner in the visible browser.
- Reciprocal badge/link/site modification requirement.
- Category forces a misleading fit.
- Login account looks wrong or not owner-approved.

Log outcome:

- If free form submits and confirmation appears: `pending_review`.
- If login succeeds but payment/reciprocal/CAPTCHA appears: `manual_required` or `needs_approval` with exact blocker.
- If published listing appears immediately: `listed` only with listing URL.

## MicroLaunch

Status:

```text
manual_required
```

Why:

- Browser preflight showed Cloudflare security verification: title `Just a moment...`.
- The challenge widget must not be bypassed by automation.
- No form was inspected yet.

Owner action needed:

1. Open `https://microlaunch.net/` in a visible browser.
2. Complete Cloudflare/security verification manually if it appears.
3. Find the product submission or launch route.
4. Before filling anything, confirm whether the route is free.
5. Stop if the verified page leads to paid launch packages, advertising packages, review fees, or reciprocal link/badge requirements.

Target URL:

```text
https://pngtostl.net/samples?utm_source=microlaunch&utm_medium=listing&utm_campaign=sample_gallery&utm_content=launch_listing
```

Preferred title:

```text
PNGtoSTL — Real image-to-STL examples and browser converter
```

Tagline:

```text
A practical image-to-STL workspace with real source images, previews, and downloadable STL samples.
```

Short description:

```text
Convert images into relief, logo badge, lithophane, and heightmap-style STL outputs. See real examples with source images, previews, triangle counts, and STL downloads.
```

Long description:

```text
PNGtoSTL is a browser-based image-to-STL workspace for makers who want practical 3D-printing outputs from 2D images. The examples gallery shows real workflows for logo badges, photo reliefs, lithophanes, heightmap tiles, and sign plates, including source images, output previews, triangle counts, file sizes, and downloadable STL files. Users can inspect the examples first, then use the live converter for their own image.
```

Suggested category:

```text
AI Tools / Design Tools / Maker Tools / Productivity
```

Suggested tags:

```text
image-to-stl, 3d-printing, maker-tools, lithophane, design-tools
```

Recommended assets if image upload is offered:

- `ops/launch-media/samples-gallery-1366x900.png`
- `ops/launch-media/samples-gallery-fullpage.png` only if the form accepts tall/full-page proof.
- `ops/launch-media/sample-logo-badge-preview.png`
- `ops/launch-media/sample-lithophane-preview.png`
- `ops/launch-media/sample-heightmap-preview.png`

Stop conditions:

- Any paid launch/review/sponsor/checkout route.
- Any requirement to add a backlink, badge, widget, or homepage/footer link.
- Cloudflare/security challenge not manually completed by the owner.
- Product launch flow requires account creation and owner is not present.
- The launch is high-visibility and asks for scheduling/date/voting rules that need a real launch plan.

Log outcome:

- If free submission form is visible but owner login/session is needed: keep `manual_required`.
- If free submission succeeds: `pending_review` with confirmation text.
- If paid-only or reciprocal-only: `needs_approval` or `blocked`, depending on whether owner wants to revisit.

## Insidr AI

Status:

```text
manual_required
```

Why:

- Public form was visible at `https://www.insidr.ai/submit-tool`, redirecting to `https://www.insidr.ai/submit-tools/`.
- Fields accepted values and browser validation passed.
- The real submit button was clicked twice.
- No success, error, redirect, alert, or visible confirmation appeared; fields stayed populated.
- A backend request was not forced.

Owner action needed option A: visible-browser retry

1. Open `https://www.insidr.ai/submit-tools/` in a visible browser.
2. Fill the same fields below.
3. Click submit once.
4. Wait at least 10 seconds.
5. If no success/error/redirect appears, do not keep clicking. Take screenshot or move to option B.

Owner action needed option B: direct contact

1. Use the site contact route if available.
2. Send the same concise pitch and ask whether PNGtoSTL fits their tool directory.
3. Do not describe it as a chatbot or full AI 3D reconstruction tool.

Target URL:

```text
https://pngtostl.net/?utm_source=insidr_ai&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool
```

Message field:

```text
PNGtoSTL — Image to STL converter for 3D printing workflows

PNGtoSTL is a browser-based image-to-STL workspace for makers. It helps users convert images into STL-style reliefs, lithophanes, logo badges, and heightmap surfaces, with real sample workflows and downloadable STL examples. It is designed for practical 2D-to-relief workflows, not full 3D object reconstruction from a single photo.
```

Link field:

```text
https://pngtostl.net/?utm_source=insidr_ai&utm_medium=listing&utm_campaign=launch_v1&utm_content=submit_tool
```

Tag field:

```text
Image Tools, 3D Printing, Design Tools, Maker Tools
```

Recommended assets if contact/upload is offered:

- `ops/launch-media/homepage-hero-1366x900.png`
- `ops/launch-media/samples-gallery-1366x900.png`
- `ops/launch-media/pngtostl-icon-512.png`

Stop conditions:

- No visible confirmation after one clean retry.
- CAPTCHA/security challenge.
- Paid submission/review/package.
- Login or account requirement without owner present.
- Forced AI category that would make the listing misleading.

Log outcome:

- Success message or confirmation email/page: `pending_review`.
- No feedback after retry: keep `manual_required`.
- Paid/login/CAPTCHA appears: `manual_required` or `needs_approval` with exact blocker.

## Owner Visible-Browser Checklist

Use this checklist before any manual-required candidate is attempted:

- [ ] The owner is present or has explicitly approved the exact account/login action.
- [ ] The target URL and UTM URL match this playbook.
- [ ] No paid option will be clicked.
- [ ] No reciprocal link/badge/site modification will be accepted silently.
- [ ] No CAPTCHA/Cloudflare/security challenge will be automated or bypassed.
- [ ] Any optional newsletter/marketing opt-in is unchecked unless the owner wants it.
- [ ] The result is logged immediately with exact confirmation or blocker text.

## Recommended Next Order

1. Dev Hunt, if owner is comfortable logging in with GitHub/Google and the post-login route is free.
2. Insidr AI visible-browser retry, because the form is simple but currently has no feedback.
3. MicroLaunch only after owner is ready to complete Cloudflare and review whether the product launch route is free or high-visibility.

Reasoning:

- Dev Hunt has the best audience fit among the remaining three if the login requirement is acceptable.
- Insidr AI is easiest to retry but has medium relevance and an unreliable form.
- MicroLaunch may be useful, but Cloudflare and launch mechanics make it the highest-friction remaining candidate.

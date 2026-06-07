# PNGtoSTL Second-Batch Preflight Notes

Updated: 2026-06-07

Purpose: record the second-batch candidate preflight after the first-batch low-risk submissions were completed.

No submission, PR, login, CAPTCHA/Cloudflare handling, payment, reciprocal link, upload, or public post was executed in this pass.

Related files:

- `ops/coldstart-submission-log.md`
- `ops/coldstart-assets-utm-plan.md`
- `ops/manual-required-submission-playbook.md`

## Candidates Checked

### SideProjectors

Result:

```text
manual_required
```

Evidence:

- Browser could load `https://www.sideprojectors.com/project/new`.
- `+ SUBMIT A PROJECT` routed to `Login to SideProjectors`.
- Login options shown: Google, GitHub, GitLab, ProductHunt, LinkedIn, email/password.
- No project form was visible without login.
- HTTP preflight had mixed `paid` / `sponsor` / `free` signals but no form.

Next owner action:

- Only continue if owner wants to log in.
- After login, check whether project submission is free and relevant.
- Stop for paid/sponsored-only routes, sale/marketplace positioning, reciprocal link requirements, or site modification.

## AlternativeTo

Result:

```text
manual_required
```

Evidence:

- HTTP preflight to `https://alternativeto.net/software/new/` returned HTTP 403.
- Title: `Just a moment...`.
- Cloudflare signal present.

Next owner action:

- Needs visible-browser verification if pursued.
- Stop for login, paid listing, reciprocal link, CAPTCHA/security challenge, or misleading alternative/category framing.

## SaaSHub

Result:

```text
manual_required
```

Evidence:

- HTTP preflight to `https://www.saashub.com/add` returned HTTP 403.
- Title: `Attention Required! | Cloudflare`.
- Signals included `captcha`, `cloudflare`, and `submit`.

Next owner action:

- Needs visible-browser verification if pursued.
- Stop for paid listing, login-only route, CAPTCHA/security challenge, reciprocal link, or unclear review fee.

## There Is An AI For That

Result:

```text
manual_required
```

Evidence:

- HTTP preflight to `https://theresanaiforthat.com/submit/` returned HTTP 403.
- Title: `Just a moment...`.
- Signals included `cloudflare` and `submit`.

Next owner action:

- Lower priority because relevance is weaker than maker/3D-printing channels.
- Needs visible-browser verification if pursued.
- Continue only if a truthful design/maker/tool category exists.
- Stop for paid review, login-only route, CAPTCHA/security challenge, or AI overclaiming.

## GitHub awesome-3d-printing

Result:

```text
manual_required / PR candidate
```

Evidence:

- Repo loaded in browser: `https://github.com/ad-si/awesome-3d-printing`.
- Repo is active; latest visible commit was `Add Gridfinity Layout Tool to Online Tools (#89)` from 5 days ago.
- README has an `Online Tools` section.
- `contributing.md` allows additions if the resource is useful, not duplicate, one suggestion per PR, title-cased, and formatted as `[Resource Name](link) - Description text.`

Candidate entry:

```markdown
[PNGtoSTL](https://pngtostl.net/samples?utm_source=github_awesome_3d_printing&utm_medium=referral&utm_campaign=sample_gallery&utm_content=resource_list_pr) - Browser-based image-to-STL workspace for reliefs, lithophanes, logo badges, and heightmap surfaces, with real downloadable STL examples.
```

Before any PR:

- Search README, issues, and open PRs for duplicates: `PNGtoSTL`, `image to STL`, `png to stl`, `lithophane`, `heightmap`.
- Confirm the `Online Tools` section is the right category.
- Confirm contribution style and alphabetical/order conventions in the section.
- Owner approval required before fork/branch/PR/account action.

## Recommended Next Order

1. GitHub awesome-3d-printing PR prep, because relevance is highest and rules are clear, but only after duplicate/category review and owner approval.
2. SideProjectors, if owner is willing to log in and the post-login route is free.
3. AlternativeTo, if owner can complete visible-browser security verification and category framing is accurate.
4. SaaSHub, only if owner can complete visible-browser verification and no reciprocal/paid requirement appears.
5. There Is An AI For That, lowest priority because relevance is weaker and AI-directory traffic may be low-intent.

## Second-Batch Stop Rules

Stop immediately and record `manual_required`, `needs_approval`, or `blocked` if any destination shows:

- Login/account action without owner present.
- CAPTCHA/Cloudflare/security challenge.
- Payment, review fee, paid launch, sponsor package, checkout, or card fields.
- Reciprocal backlink, badge, widget, homepage/footer link, or site modification.
- Fake review, vote, endorsement, or undisclosed promotion requirement.
- Category framing that implies PNGtoSTL does full 3D reconstruction, preserves image colors in STL, or guarantees printer-ready output.

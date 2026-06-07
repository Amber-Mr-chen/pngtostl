# PNGtoSTL 7-day SEO/GEO monitoring ledger

Start date: 2026-06-07
Site: https://pngtostl.net
Owner: Amber先生

## Purpose

Track whether the latest SEO, guide, sample-preset, and external-distribution work is actually being discovered and used. This ledger is for daily/near-daily checks; use `ops/weekly-data-review-template.md` for the deeper weekly decision review.

## Source-of-truth docs

- Indexing submission checklist: `ops/gsc-bing-indexing-submit-checklist.md`
- First-week event plan: `ops/first-week-data-review-plan.md`
- Weekly review template: `ops/weekly-data-review-template.md`
- Launch/channel follow-up: `ops/launch-follow-up-plan.md`
- Manual directory pack: `ops/manual-channel-submission-pack.md`
- SEO support page plan: `ops/seo-support-page-plan.md`

## URLs under watch

Core:

```text
https://pngtostl.net/
https://pngtostl.net/image-to-stl
https://pngtostl.net/logo-to-stl
https://pngtostl.net/lithophane-generator
https://pngtostl.net/heightmap-to-stl
https://pngtostl.net/samples
```

New SEO support pages:

```text
https://pngtostl.net/how-to-turn-logo-into-stl
https://pngtostl.net/lithophane-image-guide
https://pngtostl.net/heightmap-to-stl-terrain-guide
```

Technical discovery files:

```text
https://pngtostl.net/robots.txt
https://pngtostl.net/sitemap.xml
https://pngtostl.net/llms.txt
```

External / channel watch:

```text
https://github.com/ad-si/awesome-3d-printing/pull/92
Hackaday Submit A Tip — pending_review
Launching Next — pending_review / queue
Dev Hunt — manual_required
SideProjectors — manual_required
AlternativeTo — manual_required
SaaSHub — manual_required
```

## Daily check protocol

Each day, fill the matching day row and evidence notes.

### GSC checks

- Sitemap status: submitted / success / pending / error / not checked.
- Pages/indexing status for the three new guides:
  - indexed
  - discovered currently not indexed
  - crawled currently not indexed
  - blocked
  - not checked
- Search results: impressions/clicks for guide URLs and core tool URLs if available.

### Bing checks

- Sitemap status: submitted / success / pending / error / not checked.
- URL inspection/site explorer status for the three new guides.

### GA4/product events

Core funnel:

```text
pngtostl_upload_selected
pngtostl_generate_clicked
pngtostl_generate_success
pngtostl_generate_error
pngtostl_download_clicked
```

Samples/proof/preset:

```text
samples_filter_click
sample_open_workflow_click
sample_try_workflow_click
sample_download_click
sample_proof_view
sample_proof_open_workflow
sample_proof_download
sample_preset_loaded
sample_preset_upload_selected
sample_preset_generate_clicked
sample_preset_generate_success
sample_preset_generate_error
sample_preset_download_clicked
```

Record only directional signals if volume is tiny. Do not make conversion decisions from fewer than 100 meaningful views/events unless there is a clear tracking bug or visible user complaint.

### External/channel checks

- GitHub PR #92: open / merged / closed / maintainer comment / change requested.
- Hackaday: no response / referral traffic / published mention / email reply.
- Launching Next: in queue / listed / paid prompt only / no change.
- Manual channels: owner submitted / owner not yet submitted / blocked by login/CAPTCHA / listed / rejected.

## 7-day ledger

### Day 1 — 2026-06-07

Technical baseline:

- `robots.txt`: 200; global `User-agent: *` allows `/`; sitemap declared.
- `sitemap.xml`: 200 `application/xml`; 23 canonical URLs.
- `llms.txt`: 200; includes new guide URLs.
- New guides: all 200, index/follow, self canonical, one H1, in sitemap, in llms.txt.

GSC:

- Sitemap submitted: yes — Google Search Console screenshot confirmed on 2026-06-07.
- Property: `pngtostl.net`.
- Sitemap URL: `https://pngtostl.net/sitemap.xml`.
- Status: success.
- Submitted: 2026-06-07.
- Last read: 2026-06-07.
- Discovered pages: 20.
- Discovered videos: 0.
- URL Inspection requested:
  - Logo guide: [owner/agent to fill if individually requested]
  - Lithophane guide: [owner/agent to fill if individually requested]
  - Heightmap guide: [owner/agent to fill if individually requested]
- Pages status: sitemap accepted; individual indexing status still requires URL Inspection or Pages report follow-up.
- Search results: likely too early.

Bing:

- Sitemap submitted: yes — Bing Webmaster Tools screenshot confirmed on 2026-06-07.
- Sitemap URL: `https://pngtostl.net/sitemap.xml`.
- Status: success.
- Known sitemaps: 1.
- Sitemaps with errors: 0.
- Sitemaps with warnings: 0.
- Discovered URLs: 20.
- Last submitted: 2026-06-07.
- Last crawled: 2026-06-07.
- New URLs submitted/inspected: [owner/agent to fill if individually inspected]

GA4 / product events:

- Tracking baseline: production browser previously verified core converter, proof, sample, and preset events.
- Real user data: [owner/agent to fill when GA4 has enough data]

External/channel:

- GitHub PR #92: pending_review / open at last verification.
- Hackaday: pending_review.
- Launching Next: pending_review / queue.
- Manual channels: Dev Hunt, SideProjectors, AlternativeTo, SaaSHub are manual_required.

Action taken today:

- Created `ops/gsc-bing-indexing-submit-checklist.md`.
- Created this 7-day monitoring ledger.
- Confirmed GSC sitemap success from owner screenshot: success, last read 2026-06-07, discovered pages 20.
- Confirmed Bing sitemap success from owner screenshot: success, last crawled 2026-06-07, discovered URLs 20.
- Ran public technical checks for the three new guide URLs: all return 200, have `index, follow`, self canonical, one H1, and are present in sitemap + llms.txt.
- Public Google/Bing SERP visibility check was inconclusive/early: Google and Bing web search triggered bot/challenge pages; Bing RSS returned unrelated results and did not show the three new guide URLs yet. Treat GSC URL Inspection / Pages report as the authoritative next check.

Next action:

- Use GSC URL Inspection for the three new guide URLs and request indexing if the UI says the URL is not currently indexed but indexing is allowed.

### Day 2 — 2026-06-08

GSC:

- Sitemap status:
- Logo guide status:
- Lithophane guide status:
- Heightmap guide status:
- Any impressions/clicks:

Bing:

- Sitemap status:
- URL/index status:

GA4/product:

- Page views by top paths:
- Converter uploads:
- Generate successes/errors:
- Downloads:
- Preset-assisted events:
- Top referrers:

External/channel:

- GitHub PR #92:
- Hackaday:
- Launching Next:
- Manual directories:

Decision:

- P0:
- P1:
- P2:

### Day 3 — 2026-06-09

GSC:

- Sitemap status:
- Logo guide status:
- Lithophane guide status:
- Heightmap guide status:
- Any impressions/clicks:

Bing:

- Sitemap status:
- URL/index status:

GA4/product:

- Page views by top paths:
- Converter uploads:
- Generate successes/errors:
- Downloads:
- Preset-assisted events:
- Top referrers:

External/channel:

- GitHub PR #92:
- Hackaday:
- Launching Next:
- Manual directories:

Decision:

- P0:
- P1:
- P2:

### Day 4 — 2026-06-10

GSC:

- Sitemap status:
- Logo guide status:
- Lithophane guide status:
- Heightmap guide status:
- Any impressions/clicks:

Bing:

- Sitemap status:
- URL/index status:

GA4/product:

- Page views by top paths:
- Converter uploads:
- Generate successes/errors:
- Downloads:
- Preset-assisted events:
- Top referrers:

External/channel:

- GitHub PR #92:
- Hackaday:
- Launching Next:
- Manual directories:

Decision:

- P0:
- P1:
- P2:

### Day 5 — 2026-06-11

GSC:

- Sitemap status:
- Logo guide status:
- Lithophane guide status:
- Heightmap guide status:
- Any impressions/clicks:

Bing:

- Sitemap status:
- URL/index status:

GA4/product:

- Page views by top paths:
- Converter uploads:
- Generate successes/errors:
- Downloads:
- Preset-assisted events:
- Top referrers:

External/channel:

- GitHub PR #92:
- Hackaday:
- Launching Next:
- Manual directories:

Decision:

- P0:
- P1:
- P2:

### Day 6 — 2026-06-12

GSC:

- Sitemap status:
- Logo guide status:
- Lithophane guide status:
- Heightmap guide status:
- Any impressions/clicks:

Bing:

- Sitemap status:
- URL/index status:

GA4/product:

- Page views by top paths:
- Converter uploads:
- Generate successes/errors:
- Downloads:
- Preset-assisted events:
- Top referrers:

External/channel:

- GitHub PR #92:
- Hackaday:
- Launching Next:
- Manual directories:

Decision:

- P0:
- P1:
- P2:

### Day 7 — 2026-06-13

GSC:

- Sitemap status:
- Logo guide status:
- Lithophane guide status:
- Heightmap guide status:
- Any impressions/clicks:

Bing:

- Sitemap status:
- URL/index status:

GA4/product:

- Page views by top paths:
- Converter uploads:
- Generate successes/errors:
- Downloads:
- Preset-assisted events:
- Top referrers:

External/channel:

- GitHub PR #92:
- Hackaday:
- Launching Next:
- Manual directories:

Decision:

- P0:
- P1:
- P2:

## End-of-week decision rules

Use these at Day 7 before making more site changes.

### Indexing

- If all three guides are indexed: monitor impressions before rewriting.
- If `Discovered - currently not indexed`: improve external discovery and wait; do not rewrite immediately.
- If `Crawled - currently not indexed`: compare page quality, duplication, internal links, and rendered content.
- If blocked/canonical conflict: treat as P0 technical issue.

### Product funnel

- Upload low: improve first-screen CTA, example proof, or page clarity.
- Generate low: simplify controls/defaults.
- Success low: debug errors and input constraints.
- Download low: improve preview confidence and output explanation.
- Preset loaded high but upload low: improve `Sample preset loaded` callout and upload CTA.
- Preset upload high but success low: inspect sample-specific defaults and generated error reasons.

### External growth

- If a channel sends converting traffic: prioritize similar channels and update submission copy.
- If channels send traffic but no uploads: improve landing-page handoff.
- If no external traffic: continue conservative directory/community execution; do not spam duplicates.
- If GitHub PR #92 is merged: mark `listed` and record upstream evidence.
- If no GitHub PR activity after 7 days: consider one polite follow-up only with owner approval.

## Minimum weekly output

At the end of Day 7, produce:

```text
结论：
- 最大问题：
- 最大机会：

索引：
- GSC:
- Bing:

流量：
- Top landing pages:
- Top referrers:

转化：
- Upload:
- Generate success:
- Download:
- Preset-assisted:

外部渠道：
- GitHub PR #92:
- Hackaday:
- Launching Next:
- Manual directories:

下周动作：
P0:
P1:
P2:
```

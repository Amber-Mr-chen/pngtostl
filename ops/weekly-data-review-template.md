# PNGtoSTL Weekly Data Review Template

Use this after GA4/GSC/Bing have enough real data. Do not infer product decisions from empty reports.

## Review window

- Date range:
- Deploy versions active during this window:
- Known incidents / deploys / tracking changes:

## Data trust check

- GA4 page_view present: [yes/no]
- Converter funnel events present: [yes/no]
- Proof events present: [yes/no]
- GSC query data present: [yes/no]
- Bing Webmaster data present: [yes/no]
- If any expected event is missing while page views exist, fix tracking before making content decisions.

## Acquisition

- Top landing pages:
  - 1.
  - 2.
  - 3.
- Top referrers / channels:
  - 1.
  - 2.
  - 3.
- GSC queries with impressions:
  - 1.
  - 2.
  - 3.

## Core converter funnel

Formula reminders:

- Upload selected rate = `pngtostl_upload_selected` / converter page views.
- Generate clicked rate = `pngtostl_generate_clicked` / `pngtostl_upload_selected`.
- Generate success rate = `pngtostl_generate_success` / `pngtostl_generate_clicked`.
- Download rate = `pngtostl_download_clicked` / `pngtostl_generate_success`.

Fill:

- Converter page views:
- Upload selected:
- Generate clicked:
- Generate success:
- Generate error:
- Download clicked:
- Top error reasons:
- Top modes/tools:

## Proof-assisted conversion

Formula reminders:

- Proof visibility rate = `sample_proof_view` / page views on pages with proof blocks.
- Proof open workflow rate = `sample_proof_open_workflow` / `sample_proof_view`.
- Proof sample download rate = `sample_proof_download` / `sample_proof_view`.
- Best proof sample by intent = top `sample` by open workflow + proof download.

Fill:

- Proof page views:
- Proof views:
- Proof open workflow clicks:
- Proof sample downloads:
- Top proof samples:
  - 1.
  - 2.
  - 3.
- Weak proof samples:
  - 1.
  - 2.
  - 3.

## Sample gallery

- `/samples` page views:
- `samples_filter_click`:
- `sample_open_workflow_click`:
- `sample_download_click`:
- Top filters:
- Top downloaded samples:

## Decisions

Use evidence, not vibes.

- If upload rate is low: improve hero, examples, and first-screen CTA.
- If generate rate is low: simplify controls and defaults.
- If success rate is low: inspect errors, file size limits, and unsupported formats.
- If download rate is low: improve preview confidence and output explanation.
- If proof visibility is low: move proof higher or add a jump link near converter.
- If proof visible but not clicked/downloaded: replace or reorder proof sample cards.
- If a sample category wins repeatedly: validate SERP before making a dedicated SEO page.

## Verdict

- Status: [BLOCKED: tracking/data missing] / [ITERATE] / [SCALE] / [HOLD]
- One-sentence conclusion:
- Next 1-3 actions:
  1.
  2.
  3.
- Owner review needed:

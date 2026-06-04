# Pricing Report

Project: pngtostl
Stage: 03-pricing
Status: NEEDS_REVIEW
Updated: 2026-06-04

## One-Line Decision
Use a free v0 until the real PNG-to-STL engine is connected and usage cost is measurable. Do not add paid plans or payment UI in the first launch shell.

## Inputs
- PRD: PRD.md
- Research: research-opportunity-report.md
- Data contract: DATA_CONTRACT.md
- Current backend: simple in-memory STL relief generation via `/api/convert`; production runtime costs are not yet verified
- Current monetization: none

## Competitor Anchors
Observed competitor pages frame the task as free/online conversion:
- ImageToStl: free online image-to-STL tool positioning.
- Aspose: free online PNG-to-STL converter positioning.
- 3DPEA: free online PNG-to-STL converter positioning.
- AnyConv: free and fast online PNG-to-STL converter positioning.

Implication: a paid-only first version would conflict with observed SERP expectations. Free v0 is the safer entry path.

## Cost Assumptions
Current v0:
- Frontend static pages: low marginal cost.
- `/api/convert` contract response: low marginal cost.
- Real STL generation: unknown cost, because engine/service is not selected.
- R2 storage/download bandwidth: not applicable until output files are persisted.

Marked unknowns:
- `real_conversion_cpu_cost`: [待确认]
- `average_png_size`: [待确认]
- `average_stl_output_size`: [待确认]
- `daily_conversion_limit`: [待确认]
- `storage_retention_hours`: [待确认]

## Recommended v0 Model

### Free v0
- Price: free
- Access: no login
- Limit: PNG only
- Output: simple in-memory STL relief until production runtime and costs are verified
- CTA: Start converting / Check conversion path
- Copy constraint: do not claim unlimited use or guaranteed printable output

### Future Pro Exploration
Only after real conversion works and usage costs are measured:
- Private uploads / no retained files
- Larger files
- Batch conversion
- Higher queue priority
- Longer download retention
- Commercial support

No price should be published before cost evidence exists.

## Entitlement / Backend Notes
No entitlement system is needed for v0.
If Pro is added later, backend should define:
- user tier
- monthly conversion quota
- max file size
- batch limit
- retention window
- download expiration
- abuse/rate-limit rules

## Conversion CTA Rules
- Allowed: `Start converting`, `Check conversion path`, `Upload PNG`.
- Not allowed until backend is real: `Download your STL instantly`, `Unlimited free conversion`, `Guaranteed printable STL`.

## Pricing Gate
- Result: NEEDS_REVIEW.
- Passed: no premature payment scope; free v0 matches competitor expectation.
- Missing: real engine cost, usage limits, storage/bandwidth cost.

[NEEDS_REVIEW]

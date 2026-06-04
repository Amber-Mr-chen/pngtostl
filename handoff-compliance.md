# Compliance Stage Handoff

## Current Conclusion
- Status: DONE_LOCAL / NEEDS_PRE_LAUNCH_RECHECK
- Summary: Free v0 legal pages have been updated from placeholder text to implementation-matched Privacy, Terms, Contact, FAQ, and How-it-works disclosures. Recheck is still required before public launch if real STL generation, storage, analytics, payment, or accounts are added.

## Key Inputs
- Project: pngtostl
- Stage: 04-compliance
- Upstream: PRD.md, DATA_CONTRACT.md, PRICING.md

## Deliverables
- COMPLIANCE.md

## Confirmed
- No login or payment in v0.
- `/privacy`, `/terms`, and `/contact` routes exist.
- Real STL conversion and storage are not connected yet.

## Pending
- Audit actual Privacy/Terms page copy.
- Final decision on server upload, R2 storage, deletion, and retention.
- Analytics/cookie disclosure if analytics is added.

## Risks
- P0: Privacy mismatch if files are uploaded/stored later without page update.
- P0: False claim risk if site says real STL conversion works before backend is real.
- P1: Uploaded image IP responsibility should be explicit in Terms.

## Downstream Minimum Info
- Copy/design must avoid guaranteed output and unlimited claims.
- Backend must document retention and deletion before production launch.
- QA must include legal/footer route checks and upload disclosure checks.

[NEEDS_REVIEW]

# Blocked Log

## BLOCK-001: Launch permissions not confirmed
- type: setup_required
- owner: student / project owner
- blocking stages: 11 launch ops, live SEO submission, analytics verification
- needed: GitHub repository, Cloudflare project/DNS access, GSC/Bing access, production deploy approval
- unlock reply: GitHub/Cloudflare/DNS/GSC ready and production deploy approved

## BLOCK-002: Target runtime smoke not verified
- type: product/backend
- owner: backend/data stage
- blocking stages: production deploy, full QA GO, public launch claims
- current fallback: /api/convert returns simple in-memory ASCII STL locally; target runtime smoke is still required
- unlock: verify PNG-to-STL generation under the target Cloudflare/OpenNext runtime and browser download flow

## BLOCK-003: Research evidence missing
- type: stage evidence
- owner: research stage
- blocking stages: final PRD DONE, pricing/compliance decisions, launch confidence
- current fallback: PRD v0 uses seed keyword/domain logic
- unlock: record SERP, competitor, trend, and risk evidence in research-opportunity-report.md

## BLOCK-004: Design source missing
- type: design gate
- owner: design stage
- blocking stages: high-confidence frontend/design GO
- current fallback: existing frontend scaffold only
- unlock: approved design source or explicit owner approval to use current scaffold as v0 design

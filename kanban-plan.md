# Kanban Plan

## SETUP-00
- stage: 00 setup / domain / repo / permissions
- skill: site-orchestrator-playbook
- owner: main agent
- input_paths: project directory, package.json, existing docs
- output_paths: project-control.md, stage-dag.md, kanban-plan.md, stage-status.md, blocked-log.md
- gate: project has isolated directory and setup gaps are explicit
- blocked_if: repository, DNS, Cloudflare, or GSC are required for launch but not confirmed
- downstream: 01 research
- status: RUNNING

## KW-01
- stage: 01 research
- skill: keyword-research-agent
- owner: research stage
- input_paths: PRD.md, PAGE_MATRIX.md, seed keyword PNG to STL
- output_paths: research-opportunity-report.md
- gate: keyword opportunity has SERP, trend, competitor, and risk evidence
- blocked_if: no SERP or keyword evidence can be gathered
- downstream: PRD refresh, pricing, compliance
- status: NEEDS_REVIEW

## PRD-02
- stage: 02 PRD / route contract
- skill: product-definition-prd
- owner: product stage
- input_paths: PRD.md, PAGE_MATRIX.md
- output_paths: PRD.md, PAGE_MATRIX.md
- gate: route matrix, user tasks, NOT-DO, and product boundaries are documented
- blocked_if: route contract is missing
- downstream: pricing, compliance, copy
- status: DONE

## COPY-05
- stage: 05 SEO-copy freeze
- skill: site-copywriting-student
- owner: copy stage
- input_paths: COPY_FREEZE.md, PAGE_MATRIX.md
- output_paths: COPY_FREEZE.md
- gate: homepage, zh page, expansion page, and converter copy are frozen
- blocked_if: page matrix changes without copy update
- downstream: design, frontend, SEO
- status: DONE

## DATA-08
- stage: 08 backend / data contract
- skill: backend-auto-site-cloudflare-workers
- owner: backend/data stage
- input_paths: src/app/api/convert/route.ts, PRD.md
- output_paths: DATA_CONTRACT.md
- gate: frontend-consumable request/response schema is documented and verified
- blocked_if: real conversion engine is claimed without implementation
- downstream: frontend, QA
- status: RUNNING

## FE-07
- stage: 07 frontend implementation
- skill: frontend-site-automation
- owner: frontend stage
- input_paths: src/app, src/components, COPY_FREEZE.md, PAGE_MATRIX.md
- output_paths: build/lint results, live preview when available
- gate: lint/build pass, routes render, mobile usable, internal links valid
- blocked_if: design source or deploy permissions are required but unavailable
- downstream: SEO recheck, compliance recheck, PM acceptance
- status: NEEDS_REPAIR

## SEO-10
- stage: 10 SEO recheck
- skill: seo-launch-workflow
- owner: SEO stage
- input_paths: sitemap.ts, robots.ts, page metadata, route list
- output_paths: seo-launch-check.md
- gate: indexability, canonical, schema, sitemap, robots, AI-answer readiness pass
- blocked_if: live URL is required but deployment is not available
- downstream: QA, launch
- status: WAITING

## QA-09
- stage: 09 QA
- skill: student-site-qa-acceptance
- owner: QA stage
- input_paths: live/local URL, PRD.md, PAGE_MATRIX.md
- output_paths: qa-report.md
- gate: real user tasks, mobile, console/network, P0/P1/P2 evidence
- blocked_if: core flow cannot be exercised
- downstream: repair loop or launch
- status: WAITING

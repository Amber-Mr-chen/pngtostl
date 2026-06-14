# Stitch Automation Brief for Agent

Use this brief when an agent claims Stitch cannot create a project automatically or falls back to: A) user manually operates Stitch, B) fully code-generate without Stitch.

## Objective
Use Stitch or the configured Stitch MCP/API path to generate a design handoff for PNGtoSTL's unified `/ai-image-to-3d` workspace.

The agent must attempt automation first. Manual browser operation is only allowed after concrete automation failure evidence.

## Required Input
Use this page generation prompt:

- `/root/projects/pngtostl/docs/stitch-unified-ai-3d-workspace-prompt.md`

## Required Behavior
1. Check Stitch access first:
   - confirm `STITCH_API_KEY` or MCP credentials are available without printing secrets
   - confirm Stitch MCP/server/tool is listed or callable
   - confirm browser login state only if API/MCP path fails

2. Attempt automated project/design creation:
   - create a new Stitch project or design page named `PNGtoSTL Unified AI 3D Workspace`
   - submit the full prompt from `docs/stitch-unified-ai-3d-workspace-prompt.md`
   - request desktop and mobile frames
   - request states: empty, uploaded, generated STL, provider unavailable, AI task polling, AI task complete, error

3. Retrieve/export handoff:
   - screenshot(s)
   - HTML/CSS if Stitch provides it
   - design tokens
   - component/state notes
   - asset references

4. Save the outputs into the project if possible:
   - `design/stitch-ai-3d-workspace/`
   - include `README.md` with source, date, route, and implementation notes

5. Only if automation fails, report exact evidence:
   - command/tool called
   - status code or error text
   - missing permission or unavailable MCP method
   - what manual action is minimally required

## Not Acceptable
- Do not stop after saying Stitch may not support project creation.
- Do not ask the user to manually operate Stitch unless automation has been attempted and failed with evidence.
- Do not replace Stitch with code generation without stating that this is fallback mode.
- Do not generate a roadmap page.
- Do not copy ImageToSTL.org visual identity or wording.

## Fallback Hierarchy
1. Stitch MCP/API automation.
2. Browser automation with logged-in Stitch session.
3. Generate a local high-fidelity HTML design prototype from the same prompt, clearly marked as fallback, not Stitch output.

## Success Response Format
```text
[DONE]
Stitch design generated.
Project/link: ...
Saved files: ...
Frames/states included: ...
Next frontend handoff: ...
```

## Blocked Response Format
```text
[BLOCKED: STITCH_AUTOMATION_FAILED]
Attempted:
- ...
Evidence:
- ...
Required manual action:
- ...
Fallback available:
- local HTML prototype from the same prompt
```

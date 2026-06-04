# Design Handoff v0

## Status
- Stage: 06 design source + content-fit matrix
- Result: NEEDS_REVIEW
- Reason: no approved Stitch, Figma, or standalone high-fidelity design source is recorded. Current UI is an implementation scaffold that can guide a first visual pass but should not be treated as final design source.

## Product Frame
- Site: pngtostl.net
- Audience: makers, hobbyists, 3D printing beginners, and small-project users.
- Current capability: PNG upload preview plus simple in-memory STL relief generation.
- Not yet available: production-grade STL guarantees, persistent download links, paid plans, accounts, storage workflow.

## Visual Direction
- UI mood: practical maker utility, calm technical workspace, fast to scan.
- Density: compact enough for tool use; avoid a marketing-only landing page.
- Layout: tool entry appears in first viewport, with navigation and support pages visible.
- Palette: light neutral base with sky accents; avoid dominant purple gradients or generic SaaS hero styling.
- Typography: current scaffold uses system sans. Final design may keep system font for utility speed, but should verify hierarchy and mobile wrapping.
- Components: upload panel, preview well, output/status panel, FAQ cards, legal sections, support cards.

## Design System Tokens To Confirm
- Page max width: 4xl for content pages, 5xl for homepage.
- Border radius: current scaffold uses rounded-2xl/3xl; final design should reduce large radii if it starts feeling like generic SaaS.
- Primary action: dark neutral or sky accent depending on state.
- Status colors: emerald for valid/ready, rose for upload errors, amber for launch notes.
- Spacing: 24px to 48px between major content blocks.

## Required Page States
- Homepage `/`
  - No file selected
  - Valid PNG selected
  - Invalid file type
  - File too large
  - Contract-ready output state
- `/zh`
  - Same upload/preview states as homepage, with Chinese copy.
- `/image-to-stl`
  - Expansion page with future-format disclosure.
- `/how-it-works`
  - Planned workflow without claiming live STL export.
- `/faq`
  - Must disclose current v0 does not generate real STL files.
- `/privacy`, `/terms`, `/contact`
  - Legal/support content must fit without cropped text on mobile.

## Asset Guidance
- Do not use decorative stock imagery that obscures the real tool.
- Prefer real UI preview, simple conversion-state visuals, or future generated asset showing PNG relief to STL concept only if clearly labeled as illustrative.
- Do not introduce unlicensed 3D model screenshots or brand screenshots.

## Handoff Notes For Frontend
- Keep the converter as the first practical object users can interact with.
- Do not hide the simple output limitations behind vague status text.
- Avoid page sections styled as nested decorative cards.
- Before final launch, capture desktop and mobile screenshots and check for text overflow in the converter, legal pages, and nav.

## Gate Result
[NEEDS_REVIEW]

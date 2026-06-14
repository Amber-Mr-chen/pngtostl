# PNGtoSTL Unified Workspace - Stitch Visual Design Prompt

## Role
You are Google Stitch acting as a senior product designer. Generate a high-fidelity, implementable web app design for a conversion tool website. The result must be suitable for direct frontend implementation in Next.js. Do not generate a marketing-only landing page.

## Project
- Product name: PNGtoSTL
- Domain: pngtostl.net
- Target market: English-speaking makers, 3D printing hobbyists, Etsy/shop owners, small studios, and people searching for image to STL / PNG to STL / AI image to 3D.
- Primary job: Turn a user image into the best available 3D/printable output through one unified upload-first workspace.
- Honesty constraint: The reliable product is printable STL from 2D images: clean extrude, logo badge, structured artwork STL, photo relief, lithophane, and heightmap. True AI full 3D is provider/task-based and must be shown as a separate AI task mode, not promised as instant or guaranteed.

## Design Goal
Redesign the site around one clear product experience:

A single unified Image to 3D workspace where the user uploads or inputs once, chooses a mode, sees the preview/result on the right, and understands whether the output is local STL or AI-provider 3D.

The first screen must be the usable tool interface. Do not make the page feel like a roadmap, a brochure, or a docs page.

## Inspiration Boundary
Borrow only the structural pattern from modern converter tools:
- compact top navigation
- centered product headline
- mode switcher
- left input/settings panel
- right preview/result panel
- clear disabled/enabled generation states
- supporting sections below the fold

Do not copy ImageToSTL.org wording, spacing, colors, icon style, or visual identity. The result must feel like PNGtoSTL's own product.

## Visual Direction
Create a clean, technical, maker-focused interface.

Preferred style:
- calm white or off-white background
- subtle grid or measurement-paper texture, very light
- dark graphite or near-black text
- restrained accent color: teal, steel blue, or clean green; avoid dominant purple gradients
- small CAD and print-inspired details: measurement ticks, mesh dots, layer lines, STL triangle hints
- dense but organized tool UI
- professional utility feel, closer to CAD or slicer software than a generic SaaS homepage

Avoid:
- purple-blue gradient SaaS look
- giant decorative hero with no usable tool above the fold
- vague AI illustration
- nested cards inside cards
- fluffy marketing cards before the tool
- copied ImageToSTL.org phrasing
- over-rounded bubbly components

## Page To Generate
Generate one primary page: `/ai-image-to-3d`

This page should function as the unified workspace for:
1. Image to STL
2. AI 3D Task
3. Text to 3D Preview State
4. Structured Artwork STL

Use mode tabs, but make Image upload the primary default.

## First Viewport Requirements
The first viewport must include:

### Header
- Left: PNGtoSTL logo or wordmark
- Nav links: Image to STL, Tools, Examples, Pricing, API, Guides
- Right: small buttons for My Creations and Start Free
- Header must be compact, not tall

### Product Intro
Short, direct copy above the tool:
- Eyebrow: Unified Image to 3D Workspace
- H1: Convert images into printable STL or AI 3D tasks
- Supporting text: Upload once, then route the file to clean STL, structured artwork, photo relief, lithophane, heightmap, or provider-based AI 3D.

Keep this intro compact. The tool must remain visible in the first viewport on desktop.

### Mode Switcher
A segmented control with four modes:
- Image to STL
- AI 3D Task
- Text to 3D
- Structured STL

Default selected: Image to STL

Each mode changes the left panel labels and right panel empty state.

## Main Workspace Layout
Use a two-column desktop layout.

### Left Panel: Input + Settings
Title changes by mode.

For Image to STL mode:
- Title: Upload image
- Drag and drop upload area
- Supported formats: PNG, JPG, WebP, GIF, BMP
- Toggle: Single image / Batch planned
- Quality selector: Quick Preview, Standard, Detailed
- Output type selector: Auto route, Clean extrude, Structured artwork, Photo relief, Lithophane, Heightmap
- Advanced controls collapsed by default:
  - width mm
  - relief depth
  - base thickness
  - threshold
  - smoothing
- Primary button disabled until upload: Generate STL Preview

For AI 3D Task mode:
- Title: Submit AI 3D task
- Upload area
- Provider status row:
  - If configured: Meshy provider ready
  - If not configured: AI provider not configured, local STL fallback is still available
- Quality selector: Standard AI, Pro AI, Extreme AI
- Result expectation note: AI tasks may take time and return model URLs when complete
- Primary button: Start AI 3D Task

For Text to 3D mode:
- Title: Describe model
- Textarea with placeholder: A small printable dragon pendant with raised scales
- Character counter
- Generation type selector: concept preview / provider task planned
- Button disabled or planned state unless backend is configured

For Structured STL mode:
- Title: Layered artwork STL
- Upload area
- Settings: subject support layer, raised internal detail, crop empty background
- Button: Generate structured STL

### Right Panel: Preview + Result
Title: Output preview

Empty state must be mode-specific:
- Image to STL: Upload an image to inspect geometry and preview STL.
- AI 3D Task: Start a provider task to see status and returned model links.
- Text to 3D: Enter a description to prepare a task.
- Structured STL: Upload artwork to build layered STL detail.

Include a professional preview stage:
- large preview canvas area
- faint build plate grid
- STL/model placeholder icon using simple line geometry
- status strip below preview
- metrics row: mode, triangles, estimated size, output type
- result actions: Download STL, Copy result link, Open model URL; disabled in empty state

Do not show a fake completed 3D model. Empty state must look intentional.

## States To Design
Generate visual states in the same page design or as clearly labeled frames:
1. Empty state
2. Image uploaded, diagnosis ready
3. STL preview generated
4. AI provider not configured
5. AI task submitted / polling
6. AI task completed with model links
7. Error state: unsupported file or provider failed
8. Mobile layout

## Below-Fold Sections
After the workspace, add concise supporting sections:

### Workflow Router
Show six routing outcomes:
- Clean logo STL
- Structured artwork STL
- Photo relief STL
- Lithophane panel
- Heightmap surface
- AI 3D provider task

Each card should explain when to use it in one sentence. Do not overdo marketing.

### Example Output Strip
Three example cards:
- Transparent logo badge
- Photo relief panel
- Heightmap surface

Use realistic preview placeholders that look like STL or mesh output, not stock photos.

### Honest Limits
A short section explaining:
- STL stores geometry, not color
- one image cannot always become a perfect full 3D object
- local STL is fastest for printable reliefs
- AI provider mode is task-based and may require configuration or credits

### FAQ
Compact accordion style:
- Can any image become STL?
- Is AI 3D instant?
- What is structured artwork STL?
- Which formats are supported?
- Can I use this for 3D printing?

## Design System
Include a design system panel or notes with:
- color tokens
- typography scale
- spacing scale
- button styles
- input styles
- preview canvas styles
- status badge variants: ready, warning, success, error, processing

Typography:
- Use a practical modern sans-serif. Avoid default-looking generic SaaS treatment.
- No negative letter spacing.
- Do not scale font size by viewport width.

Cards:
- 8px border radius maximum unless needed for pills/buttons
- no nested card stacks
- panels should feel like work surfaces

## Mobile Requirements
Mobile layout:
- header collapses cleanly
- mode tabs horizontally scroll or wrap without overflow
- input panel appears before preview panel
- generate button remains visible after settings
- no text overlap
- no horizontal scrolling
- preview stage remains legible

## Copy Rules
Use concise English copy. Do not use these phrases:
- AI-powered 3D technology
- transform any image instantly
- perfect 3D model from any photo
- roadmap
- coming soon as the main CTA

Use honest product language:
- printable STL
- structured artwork STL
- photo relief
- lithophane
- heightmap
- provider task
- preview before download

## Interaction Notes For Handoff
The handoff should make clear:
- mode tab selected state
- upload drag hover state
- disabled button state
- active generation or progress state
- provider unavailable state
- result link state
- advanced settings collapsed or expanded state

## Output Format
Produce a high-fidelity desktop and mobile design suitable for direct frontend implementation.

Also include:
- route name: `/ai-image-to-3d`
- component breakdown
- design tokens
- state notes
- responsive behavior notes

## Acceptance Criteria
The design is accepted only if:
- the first screen contains the actual upload workspace
- the page reads as one unified tool, not separate roadmap cards
- Image to STL and AI 3D are visually separated as modes but live in one interface
- provider-unconfigured state is explicit and not hidden
- no fake model result is shown before generation
- mobile state is designed
- the page can be implemented in Next.js without guessing layout, states, or tokens

## Desired Output Style From Stitch
Return:
- desktop frame
- mobile frame
- empty state
- upload state
- generated state
- provider unavailable state
- AI task polling state
- AI task complete state
- design token summary
- short implementation notes

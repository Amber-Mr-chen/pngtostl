# PNG to STL PRD v1

## 1. Product Summary

- Product: PNG to STL converter
- Domain: pngtostl.net
- Site type: utility-first tool suite
- Languages: English + Chinese
- Core promise: upload a PNG image, preview the workflow, generate a simple STL relief, and provide adjacent support tools instead of a single thin demo page.

## 2. Positioning

### One-line positioning
PNG to STL is a lightweight conversion tool for makers and hobbyists who want to turn PNG images into STL files quickly, with supporting pages and helper tools that make the site feel complete.

### Primary angle
- First release focuses on PNG -> STL
- Brand remains flexible enough to expand into Image -> STL later
- Site stays tool-first, but tool-first does not mean single-page

## 3. Target Users

### Primary ICP
- 3D printing hobbyists
- makers and DIY users
- users who want to turn a graphic into a printable STL shape

### Secondary ICP
- designers who need a fast image-to-3D workflow
- users searching for a simple online converter instead of CAD software
- users who want to inspect related workflow pages, not just upload a file

## 4. User Jobs

1. Upload a PNG image.
2. Preview the image before conversion.
3. Generate an STL-ready result.
4. Download the output.
5. Understand basic limits, file handling, and usage rules.
6. Explore adjacent tools and support pages without leaving the site.

## 5. Scope

### In scope for v1
- PNG upload
- local preview
- upload validation
- tool-first landing page
- English homepage
- Chinese homepage
- Image to STL expansion page
- FAQ page
- Privacy page
- Terms page
- Contact page
- conversion API contract endpoint
- interactive helper pages for image inspection, workflow review, and support discovery

### Out of scope for v1
- account system
- payment system
- user project library
- social/community features
- multi-format batch conversion UI
- advanced CAD editing
- login-gated workflow

## 6. Information Architecture

### Routes
- `/` main English landing/tool page
- `/zh` Chinese landing/tool page
- `/image-to-stl` expansion page
- `/how-it-works` interactive workflow page
- `/faq` interactive FAQ page
- `/privacy` privacy page
- `/terms` terms page
- `/contact` interactive support page
- `/image-checker` image inspection helper
- `/palette-to-relief` helper for future relief exploration
- `/api/convert` conversion API endpoint

### SEO focus
- Primary keyword: PNG to STL
- Secondary keyword: Image to STL
- Long-tail support: PNG to STL converter, convert PNG to STL online

## 7. Content Strategy

### Homepage copy goals
- state the tool purpose in the first screen
- explain PNG -> STL clearly
- keep the interaction simple
- leave room for broader image-based workflows later
- surface the rest of the site as real tool surfaces, not filler pages

### Page responsibilities
- `/`: conversion entry point and primary conversion intent
- `/image-to-stl`: broader expansion path for future formats
- `/how-it-works`: interactive workflow explainer and image tips
- `/faq`: interactive FAQs and action shortcuts
- `/privacy`: clarify file handling
- `/terms`: clarify usage and disclaimer
- `/contact`: provide support route and self-serve helpers
- `/image-checker`: file/format/size sanity checks before upload
- `/palette-to-relief`: preview contrast and relief ideas for future use

## 8. Functional Requirements

### Upload and preview
- accept PNG only in v1
- show local preview after upload
- show file name and size
- reject non-PNG files
- reject files over size limit

### Conversion flow
- primary button should represent the conversion intent
- if production runtime is not verified, the UI must clearly show simple v0 output limitations
- `/api/convert` should define the expected request/response shape before the actual engine is attached

### Error handling
- invalid file type
- file too large
- empty upload
- upload before generate
- backend-not-connected state

### Adjacent utility interactions
- image inspection helper should let users preview and validate a chosen PNG
- workflow page should expose tip toggles and CTA shortcuts
- FAQ page should let users jump to conversion, policy, and support actions
- contact page should offer self-serve options before showing support copy

## 9. Non-Goals

- no full 3D modeling studio
- no CAD-like editor
- no user account management
- no saved project dashboard
- no marketplace or social layer
- no batch processing suite in v1

## 10. Quality Criteria

- first screen clearly explains the product
- tool behavior is understandable in under 1 minute
- mobile experience must be usable
- page structure must be indexable
- English and Chinese copy must not conflict
- adjacent pages should feel usable, not decorative
- `image-to-stl` should expand the brand without diluting the main PNG intent

## 11. Metrics for v1

- page load and tool visibility
- upload success rate
- validation failure rate
- conversion CTA click rate
- SEO indexability of core pages
- bounce rate on homepage
- click-through to adjacent helper pages

## 12. Risks

- domain is narrow while future brand may broaden
- conversion backend is not connected yet
- unclear file handling rules can hurt trust
- if the site tries to do too many formats too early, the first release will lose focus
- if supporting pages stay static, the site will still feel thin even with more routes

## 13. Delivery Plan

### Phase 1
- finalize PRD
- finalize homepage and supporting pages
- finalize copy for privacy and terms

### Phase 2
- connect real PNG -> STL backend logic
- return a real result file or job ID
- add result and failure states

### Phase 3
- add Image -> STL expansion path
- add more image format pages if needed
- refine SEO and internal linking

## 14. Current status

- PRD version: v1
- current build status: frontend scaffold and early interactive helpers in progress
- backend status: simple in-memory STL generation is live
- next required step: convert supporting pages from static explanation into real helper tools

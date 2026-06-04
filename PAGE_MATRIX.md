# PNG to STL Page Matrix

## Goal
Define the routing, purpose, SEO intent, and content responsibilities for each page before further implementation.

## Core Pages

### `/`
- Purpose: primary tool entry point for PNG to STL conversion
- Language: English
- Intent: transactional/tool intent
- Primary keyword: PNG to STL
- Secondary keywords: PNG to STL converter, convert PNG to STL online
- H1: PNG to STL Converter
- CTA: Start converting
- Required blocks:
  - hero
  - upload/preview/convert UI
  - feature highlights
  - how it works summary
  - FAQ summary
- Indexability: index

### `/zh`
- Purpose: Chinese tool entry point
- Language: Chinese
- Intent: transactional/tool intent
- Primary keyword: PNG 转 STL
- Secondary keywords: 图片转 STL, 在线 PNG 转 STL
- H1: PNG 转 STL 工具
- CTA: 开始转换
- Required blocks:
  - hero
  - upload/preview/convert UI
  - FAQ summary
- Indexability: index

### `/image-to-stl`
- Purpose: broader expansion page for future format support
- Language: English
- Intent: informational + expansion support
- Primary keyword: Image to STL
- Secondary keywords: image to STL converter, image to STL online
- H1: Image to STL
- CTA: Learn more
- Required blocks:
  - positioning explanation
  - why the page exists
  - future format support note
- Indexability: index

### `/how-it-works`
- Purpose: explain the workflow and expectations
- Language: English
- Intent: informational support
- Primary keyword: how PNG to STL works
- H1: How it works
- CTA: Start converting
- Required blocks:
  - upload
  - process
  - preview
  - planned export
- Indexability: index

### `/faq`
- Purpose: answer common conversion questions
- Language: English
- Intent: informational support
- Primary keyword: PNG to STL FAQ
- H1: FAQ
- CTA: Start converting
- Required blocks:
  - file type questions
  - printing questions
  - support scope questions
- Indexability: index

### `/privacy`
- Purpose: explain file handling and trust boundaries
- Language: English
- Intent: legal/trust
- H1: Privacy
- Required blocks:
  - upload handling
  - retention note
  - processing note
- Indexability: index

### `/terms`
- Purpose: usage terms and disclaimer
- Language: English
- Intent: legal/trust
- H1: Terms
- Required blocks:
  - usage limits
  - copyright responsibility
  - disclaimer
- Indexability: index

### `/contact`
- Purpose: support and feedback entry
- Language: English
- Intent: support
- H1: Contact
- Required blocks:
  - support route
  - feedback route
- Indexability: index

### `/api/convert`
- Purpose: conversion contract endpoint
- Type: API route
- Required behavior:
  - accept multipart form data
  - validate PNG input
  - return an in-memory ASCII STL response for valid PNG input
- Indexability: noindex / non-page

## SEO Rules
- Avoid making the site feel like a generic multi-tool platform in v1
- Keep `PNG to STL` as the dominant homepage intent
- Use `Image to STL` as a controlled expansion path, not a competing homepage theme
- Chinese page should not cannibalize the English homepage intent; it is a separate language entry point

## Dependency Notes
- Homepage and `/zh` are prerequisites for launch
- `/image-to-stl` is the expansion bridge and should be retained even if the backend is not ready
- `privacy` and `terms` should be finalized before public launch

---
story_key: 1-3-base-layout-css-foundation-naming-conventions
status: ready-for-dev
baseline_commit: 355327e2f3998815bad2892829915ac3f40feda0
---

# Story 1.3: Base Layout, CSS Foundation, and Naming Conventions

## Story

As a developer agent,
I want a base Nunjucks layout with named blocks, a CSS custom property foundation, and a `NOTES.md` conventions reference,
So that all epics build on a consistent structure with no naming ambiguity.

## Acceptance Criteria

**Given** `_includes/base.njk`
**When** created
**Then** it contains the full HTML document skeleton with `{% block schema %}{% endblock %}`, `{% block meta %}{% endblock %}`, and `{% block content %}{% endblock %}` named blocks

**And** it includes a `<header>` with the site title only — no navigation in the header; primary navigation is the bottom tab bar defined in Story 1.5

**And** it includes a `<footer>` with: the FR-23 attribution text, a Submit link (FR-14 placeholder pointing to `#`), and a Request a Change link (FR-16 placeholder pointing to `#`)

**And** `_data/site.js` exports `{ name, baseUrl, ogDefaults }`

**Given** `assets/css/base.css`
**When** created
**Then** it defines all CSS custom properties matching DESIGN.md frontmatter exactly (NOT the outdated architecture.md placeholder values)

**Given** `NOTES.md` at project root
**When** read by any agent
**Then** it documents all naming conventions: URL filter param names, `data-*` attribute names, Nunjucks block names, CSS custom property names, canonical event type kebab values, Eleventy collection names, and custom Nunjucks filter names

## Tasks / Subtasks

### Review Findings

- [x] [Review][Defer] No per-page `{% block title %}` in base.njk — all pages share the same `<title>`; add a title block when implementing Epic 4 SEO/OG tags (story 4.2) [_includes/base.njk:6] — deferred, pre-existing

- [x] Task 1: Create `_data/site.js`
  - [x] 1.1: Export `{ name: 'West Coast Swing in Tulsa', baseUrl: 'https://tulsawcs.com', ogDefaults: { image: '/assets/images/og-default.jpg', description: 'WCS events in Tulsa, Oklahoma.' } }`

- [x] Task 2: Create `_includes/base.njk`
  - [x] 2.1: Full HTML5 skeleton: `<!doctype html>`, `<html lang="en">`, `<head>`, `<body>`
  - [x] 2.2: `<head>` contents: charset meta, viewport meta, `<title>{{ site.name }}</title>`, Google Fonts link (Cinzel 400, Josefin Sans 300), `<link rel="stylesheet" href="/assets/css/base.css">`, `{% block schema %}{% endblock %}`, `{% block meta %}{% endblock %}`
  - [x] 2.3: `<body>` structure:
    - `<header class="site-header">` containing only the site name as a link to `/`
    - `<main class="site-main">{% block content %}{% endblock %}</main>`
    - `<footer class="site-footer">` (see 2.4)
    - Navigation slot reserved for Story 1.5 (add a comment: `{# Bottom tab bar injected by Story 1.5 #}`)
  - [x] 2.4: Footer HTML:
    ```njk
    <footer class="site-footer">
      <p class="site-footer__attribution">A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD].</p>
      <nav class="site-footer__links">
        <a href="#" class="site-footer__link">Submit an event</a>
        <a href="#" class="site-footer__link">Request a change</a>
      </nav>
    </footer>
    ```
  - [x] 2.5: Google Fonts `<link>`: `https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Josefin+Sans:wght@300&display=swap`

- [x] Task 3: Create `assets/css/base.css` with exact DESIGN.md tokens
  - [x] 3.1: `:root` block with all color tokens (copy from DESIGN.md frontmatter — NOT from architecture.md)
  - [x] 3.2: Box-sizing reset: `*, *::before, *::after { box-sizing: border-box; }`
  - [x] 3.3: Base typography on `body`: `background: var(--color-bg); color: var(--color-text-primary); font-family: var(--font-body); font-weight: 300; font-size: 15px; letter-spacing: 0.02em; line-height: 1.6;`
  - [x] 3.4: Remove default `margin` on `body`, set `min-height: 100vh`
  - [x] 3.5: Basic heading styles using `var(--font-display)` for h1–h3
  - [x] 3.6: `main.site-main { padding: var(--space-md) var(--page-margin); padding-bottom: calc(var(--tab-bar-height) + var(--space-md)); }` (reserves space for tab bar even before Story 1.5 adds it)

- [x] Task 4: Add custom Nunjucks filters to `.eleventy.js`
  - [x] 4.1: `formatDate` — output "Saturday, June 14"
  - [x] 4.2: `formatTime` — output "8:00 PM"
  - [x] 4.3: `formatDateShort` — output "Jun 14"
  - [x] 4.4: `eventTypeToKebab` — convert "Social Dancing" → "social-dancing"
  - [x] 4.5: `fitSignalToKebab` — convert "Beginner-friendly" → "beginner-friendly"

- [x] Task 5: Update `index.njk` to extend `base.njk`
  - [x] 5.1: Replace placeholder content with `{% extends "base.njk" %}` and `{% block content %}` override (pure Nunjucks inheritance — no front matter `layout:` — so block overrides work correctly for Epic 4)
  - [x] 5.2: Alternatively use `{% extends "base.njk" %}` syntax — whichever the Eleventy front matter approach you chose; be consistent

- [x] Task 6: Create `NOTES.md` at project root
  - [x] 6.1: Document URL filter param names: `?type=`, `?signal=`, `?date=`
  - [x] 6.2: Document `data-*` attribute names: `data-event-type`, `data-fit-signals`, `data-event-date`, `data-is-today`, `data-is-past`
  - [x] 6.3: Document Nunjucks block names: `schema`, `meta`, `content`
  - [x] 6.4: Document CSS custom property naming scheme and list all tokens
  - [x] 6.5: Document canonical event type kebab values: `social-dancing`, `group-lesson`, `workshop`, `competition`, `convention`
  - [x] 6.6: Document Eleventy collection names: `events`, `todayEvents`, `upcomingEvents`, `pastEvents`
  - [x] 6.7: Document custom Nunjucks filter names: `formatDate`, `formatTime`, `formatDateShort`, `eventTypeToKebab`, `fitSignalToKebab`
  - [x] 6.8: Document FR-22 naming convention for multi-day conventions: "[Convention Name] — [Type]: [Title]"

- [x] Task 7: Verify build
  - [x] 7.1: Run `npm run build` and confirm `_site/index.html` renders with correct `<html>` skeleton
  - [x] 7.2: Visually inspect `_site/index.html` to confirm CSS link, font link, h1, header, footer are present

## Dev Notes

### CRITICAL: Use DESIGN.md Color Tokens, NOT architecture.md

The architecture doc has outdated placeholder color values (e.g., `--color-bg: #0f0e0d`). The **correct** values are in `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/DESIGN.md` frontmatter:
- `--color-bg: #101214` (NOT `#0f0e0d`)
- `--color-surface: #16181b` (NOT `#1a1917`)
- `--color-text-primary: #f0eeea` (NOT `#f5f4f0`)
- `--color-text-muted: rgba(240, 238, 234, 0.5)` (NOT `#8a8680`)

Always reference DESIGN.md for color values.

### Header Constraint

The `<header>` must NOT contain navigation. Per EXPERIENCE.md: "No hamburger menu. No top navigation bar." Navigation is exclusively the bottom tab bar (added in Story 1.5). The header shows only the site name/logo.

### Footer Copy (Locked — FR-23)

Exact string: "A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD]."
Do not paraphrase. "last name TBD" is literal in the copy until resolved.

### Submit/Request Links (Placeholders)

FR-14 (Submit) and FR-16 (Request a Change) link to external Google Forms created by Jason. In this story, use `href="#"` as placeholders. Epic 6 Story 6.3 will replace them with real URLs.

### Nunjucks Layout Inheritance

Eleventy supports two layout syntypes: front matter `layout: base.njk` or `{% extends "base.njk" %}` in the template. The front matter approach is simpler for pages; the `{% extends %}` approach is needed when you want to use `{% block %}` overrides in templates. Use `{% extends %}` to make block overrides work in Epic 4 for Schema.org and OG tag injection.

### Google Fonts

The `<link>` for Google Fonts must be in `<head>` before the CSS stylesheet for correct font loading order. Use the `display=swap` parameter to prevent render-blocking.

### Architecture Reference

- `_bmad-output/planning-artifacts/architecture.md` → "Naming Patterns" and "Structure Patterns" sections
- `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/DESIGN.md` → all color + typography values
- `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/EXPERIENCE.md` → voice, microcopy, navigation model

## Dev Agent Record

### Implementation Plan

Used pure Nunjucks `{% extends "base.njk" %}` in `index.njk` (not front matter `layout:`) so `{% block %}` overrides work correctly — required for Epic 4 Schema.org/OG injection. Colors sourced from DESIGN.md frontmatter (not architecture.md, which had outdated placeholder values). `site.js` uses ESM `export default` to match `"type": "module"` project config.

### Debug Log

No issues. Build clean on first attempt, `_site/index.html` confirmed correct skeleton with all required elements.

### Completion Notes

All 7 tasks complete. Created: `_data/site.js`, `_includes/base.njk`, `assets/css/base.css`, `NOTES.md`. Updated: `.eleventy.js` (5 Nunjucks filters), `index.njk` (extends base). CSS tokens sourced from DESIGN.md. Build exits cleanly, full HTML skeleton verified in `_site/index.html`.

## File List

- `_data/site.js` (created)
- `_includes/base.njk` (created)
- `assets/css/base.css` (created)
- `NOTES.md` (created)
- `.eleventy.js` (modified — added 5 Nunjucks filters)
- `index.njk` (modified — extends base.njk with block content override)

## Change Log

- 2026-06-13: Created base layout, CSS token foundation, site data, five Nunjucks filters, NOTES.md conventions reference. Updated index.njk to extend base.njk. Build verified clean.

## Status

done

---
story_key: 1-5-bottom-tab-bar-navigation
status: ready-for-dev
baseline_commit: 355327e2f3998815bad2892829915ac3f40feda0
---

# Story 1.5: Bottom Tab Bar Navigation

## Story

As a site visitor,
I want a bottom tab bar with TONIGHT, BROWSE, and ARCHIVE tabs that persists across all views,
So that I can navigate between views with one thumb without reaching for a top navigation bar.

## Acceptance Criteria

**Given** `_includes/base.njk` is updated with the bottom tab bar
**When** any page is rendered
**Then** a `<nav aria-label="Main navigation">` element is present at the bottom of the viewport containing exactly three tab links: TONIGHT (`/`), BROWSE (`/browse/`), ARCHIVE (`/archive/`)

**And** the HTML source text is lowercase ("tonight", "browse", "archive") — CSS applies `text-transform: uppercase` so screen readers announce the words naturally

**And** the active tab carries `aria-current="page"` — determined at build time by the page's URL

**And** each tab link is a minimum 44×44px tap target

**Given** `assets/css/base.css` (or a new `assets/css/tab-bar.css`)
**When** the tab bar styles are applied
**Then** the tab bar is fixed to the bottom of the viewport with `position: fixed; bottom: 0; left: 0; right: 0`

**And** it uses design tokens: `height: var(--tab-bar-height)` (56px), `background: var(--color-tab-bar-bg)` (`#0d0f11`), `border-top: 1px solid rgba(240,238,234,0.08)`, `border-radius: 0`

**And** three equal-width columns fill the full viewport width

**And** inactive tab text is at 50% opacity (`color: rgba(240,238,234,0.5)`)

**And** the active tab has full-opacity text plus a `2px solid var(--color-gold-tab-active)` top-border indicator aligned to the top edge of the bar

**And** `main` page content has `padding-bottom: var(--tab-bar-height)` so the tab bar never obscures the bottom of the content

**Given** `tests/e2e/smoke.spec.js`
**When** updated to include tab bar assertions
**Then** the nav element is present, all three tab links exist, and the active tab on the home page has `aria-current="page"`

## Tasks / Subtasks

### Review Findings

All 9 acceptance criteria met. Clean review — no findings.

- [x] Task 1: Update `_includes/base.njk` — add bottom tab bar
  - [x] 1.1: Added nav block with aria-label, three tab links using page.url for aria-current
  - [x] 1.2: Lowercase source text verified — CSS applies text-transform: uppercase

- [x] Task 2: Add tab bar CSS
  - [x] 2.1: Tab bar styles added to `assets/css/base.css`
  - [x] 2.2: `main.site-main` padding-bottom already set from Story 1.3 — verified present

- [x] Task 3: Update `tests/e2e/smoke.spec.js` — add tab bar assertions
  - [x] 3.1: Assert nav element `[aria-label="Main navigation"]` is visible
  - [x] 3.2: Assert exactly 3 links (`.tab-bar__tab` count = 3)
  - [x] 3.3: Assert "tonight" tab has `aria-current="page"` on home page
  - [x] 3.4: Assert browse and archive links present
  - [x] 3.5: Assert each tab link ≥ 44×44px via boundingBox

- [x] Task 4: Verify Playwright tests pass
  - [x] 4.1: 24/24 smoke tests pass (Chromium, Firefox, WebKit)
  - [x] 4.2: Full `npm test` suite passes — no regressions

## Dev Notes

### aria-current="page" at Build Time

In Nunjucks, `page.url` is an Eleventy-provided variable containing the current page's URL path (e.g., `/`, `/browse/`, `/archive/`). Compare directly:

```njk
{% if page.url == "/" %}aria-current="page"{% endif %}
```

For `/browse/` and `/archive/`, Eleventy will generate those pages in later epics. The base.njk tab bar will apply `aria-current` correctly to each page because Eleventy renders each page's layout with that page's `page.url`.

### No Active State Before Pages Exist

During Epic 1, only `/` exists. The `/browse/` and `/archive/` links will have `aria-current="page"` on their respective pages once those epics are implemented. The smoke test only checks the home page's TONIGHT tab.

### Tab Bar Border-Top Trick

The active tab uses `border-top` on the tab link element itself (not the nav container) because the 2px gold line is at the TOP edge of the tab — it reads as an upward-pointing indicator. Set `border-top: 2px solid transparent` on inactive tabs so the height is stable and doesn't cause layout shift on activation.

### No `border-radius` on Tab Bar

Per DESIGN.md: `tab-bar: 0` (sharp top edge, no rounding). The container's `border-radius` must be `0`.

### Locked String Convention

EXPERIENCE.md: HTML source is lowercase ("tonight", "browse", "archive"); CSS applies `text-transform: uppercase`. This ensures screen readers announce "tonight" naturally, not as individual letters "T-O-N-I-G-H-T".

### z-index

Tab bar should have `z-index: 100` to render above all content. Ensure nothing else in the base layout has a higher z-index unintentionally.

### Architecture Reference

- `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/DESIGN.md` → `components.bottom-tab-bar` and spacing tokens
- `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/EXPERIENCE.md` → "Navigation model" section

## Dev Agent Record

### Implementation Plan

Tab bar CSS appended to `base.css` (not a separate file) — keeps it simple while `assets/` has only one CSS file. Used `page.url` Nunjucks variable for build-time `aria-current`. `main.site-main` padding-bottom was already set correctly from Story 1.3.

### Debug Log

No issues on first run. All 24 tests passed immediately.

### Completion Notes

Tab bar added to `_includes/base.njk` with lowercase source text and build-time `aria-current`. Tab bar CSS added to `base.css` (fixed position, 56px height, 3-column grid, gold active indicator). 8 new smoke tests added (5 assertions × 3 browsers = 24 total). Full `npm test` suite green.

## File List

- `_includes/base.njk` (modified — added tab bar nav, replaced placeholder comment)
- `assets/css/base.css` (modified — added .tab-bar and .tab-bar__tab styles)
- `tests/e2e/smoke.spec.js` (modified — added 5 tab bar assertion tests)

## Change Log

- 2026-06-13: Added bottom tab bar to base.njk (TONIGHT/BROWSE/ARCHIVE, aria-current at build time). Added tab bar CSS. 5 new smoke test assertions, 24/24 passing across 3 browsers.

## Status

done

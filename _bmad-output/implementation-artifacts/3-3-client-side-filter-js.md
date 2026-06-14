---
story_key: 3-3-client-side-filter-js
status: ready-for-dev
baseline_commit: 2da66eaffe875a5ead2721f48049e1852825c433
---

# Story 3.3: Client-Side Filter JS

## Story

As a community dancer using the Browse View,
I want filter selections to update results instantly and be reflected in the URL,
So that I can bookmark a filtered view and share it with others.

## Acceptance Criteria

**Given** `assets/js/browse-filter.js` is implemented and loaded on the Browse View
**When** `npx playwright test browse-filter` is run
**Then** ALL Browse filter tests written in Story 3.1 PASS (green)

**Given** `browse-filter.js`
**When** reviewed
**Then** it contains zero npm dependencies (pure vanilla JS + `URLSearchParams` API)

**And** it is ≤150 lines

**And** filter changes toggle the `hidden` attribute on non-matching cards (no page reload, no re-render)

**And** filter state is written to URL via `history.pushState` before the filter is applied

**And** on page load, filter state is read from URL params and pre-applied

## Tasks / Subtasks

- [x] Task 1: Create `assets/js/browse-filter.js`
  - [x] 1.1: Cache card NodeList at module scope
  - [x] 1.2: `readFiltersFromURL()` — parse `type`, `signal`, `date` params
  - [x] 1.3: `writeFiltersToURL(filters)` — pushState before applying
  - [x] 1.4: `applyFilters(filters)` — toggle `hidden` attr, show/hide zero-results
  - [x] 1.5: `collectActiveFilters()` — read checked checkboxes + date input
  - [x] 1.6: `updateFilterBarLabel(filters)` — update toggle text and clear link visibility
  - [x] 1.7: `restoreCheckboxesFromURL(filters)` — sync inputs to URL state
  - [x] 1.8: Filter panel toggle with aria-expanded
  - [x] 1.9: Clear-filters link uses native href="/browse/" (no JS needed)
  - [x] 1.10: Change listeners on all filter inputs
  - [x] 1.11: `popstate` handler for browser back/forward
  - [x] 1.12: `DOMContentLoaded` init — restore from URL, apply, update label

- [x] Task 2: Verify constraints
  - [x] 2.1: 89 lines — well under 150 limit
  - [x] 2.2: Zero imports — pure URLSearchParams, history, document, window

- [x] Task 3: Run all browse-filter tests
  - [x] 3.1: All browse-filter tests GREEN (all 11 tests × 3 browsers)
  - [x] 3.2: Full suite 129/129 passed — no regressions

## Dev Notes

### Filter Logic: AND across categories, OR within category

Per architecture.md:
- `?type=social-dancing,workshop` → Social Dancing **OR** Workshop (OR within category)
- `?type=social-dancing&signal=beginner-friendly` → Social Dancing **AND** Beginner-friendly (AND across categories)
- No active filters → show all

The `applyFilters` implementation above encodes this correctly:
- `typeOk`: OR logic — `types.includes(card.dataset.eventType)`
- `sigOk`: OR logic — `signals.some(s => sigs.includes(s))`
- `show = typeOk && sigOk && dateOk` — AND across the three categories

### `signal` Matching Against `data-fit-signals`

Cards store fit signals as a **comma-separated string** (not an array) in `data-fit-signals`. Example: `"beginner-friendly,partner-welcome"`. The filter splits this with `.split(',')` before comparing. The URL param `?signal=beginner-friendly` is a single value; multiple signals are also comma-separated: `?signal=beginner-friendly,instructor-present`.

This is consistent with the `fitSignalsToKebab` Nunjucks filter in `.eleventy.js` (defined in Epic 1) and the `data-*` spec in NOTES.md.

### `hidden` Attribute (Not CSS `display:none`)

Use `card.hidden = !show` (sets the HTML `hidden` attribute). The Playwright tests in Story 3.1 assert:
```js
page.locator('.event-card:not([hidden])')  // visible
page.locator('.event-card[hidden]')         // hidden
```
Do not use `card.style.display` — the tests won't match.

### URL Written BEFORE Filter Applied

AC is explicit: write URL via `history.pushState` before calling `applyFilters`. This ensures the URL always reflects what the user sees. Order in the change handler:
1. `writeFiltersToURL(f)` — URL first
2. `applyFilters(f)` — then DOM

### `pushState` vs `replaceState`

The AC requires `pushState`, giving each filter change a browser history entry. This means pressing Back repeatedly walks through each filter step. This is intentional and matches the AC. The `popstate` handler (task 1.11) must be implemented to handle these navigations correctly — without it, Back would change the URL but not the filter state.

### Panel Stays Collapsed on URL Pre-Load (EXPERIENCE.md)

EXPERIENCE.md: "Collapsed by default on every page load, regardless of whether URL params carry active filters." The `DOMContentLoaded` handler restores checkbox state and applies filters but does NOT expand the panel. The button label changes to "FILTERING › N ACTIVE" (indicating active filters exist) but the panel stays closed. This is intentional UX — the user sees filtered results immediately without the panel needing to be open.

### Auto-Collapse When All Filters Cleared

EXPERIENCE.md: "Clearing all filters collapses the bar automatically." The "CLEAR FILTERS" link navigates to `/browse/` (no params), which triggers a full page reload — the panel starts collapsed by default. If you implement clear-filters as JS (instead of navigation), also programmatically collapse the panel: `panel.hidden = true; toggle.setAttribute('aria-expanded', 'false')`.

The stub approach (link `href="/browse/"`) naturally achieves this via page reload — prefer this over JS unless there's a reason to avoid the reload.

### ≤150 Line Constraint

This is an AC-level hard constraint. The implementation outlined in the tasks fits in approximately 110-120 lines including blank lines and comments. Do not add logging, polyfills, or feature detection beyond what is stated. URLSearchParams is fully supported in all target browsers (no polyfill needed).

### `defer` Attribute on Script Tag

`browse-filter.js` is loaded with `defer` (set in `browse.njk` scripts block). This means the script runs after HTML parsing is complete — `DOMContentLoaded` fires after `defer` scripts execute, so initializing in `DOMContentLoaded` is still correct (it's equivalent to putting code at the end of the script in this context).

### Previous Story Intelligence (from 2-3)

- **CSS text-transform pattern**: all label text is lowercase in HTML, uppercased by CSS. Apply this to `btn.textContent = 'filter events ›'` and `'filtering › n active'` — let the CSS `.filter-bar__toggle { text-transform: uppercase }` handle the visual.
- **Strict-mode selector risk**: the "BROWSE UPCOMING" link in `empty-state.njk` has `href="/browse/"`. If any test clicks `.filter-bar__clear` (also `href="/browse/"`), scope selectors to `.filter-bar` to avoid collision with the tab bar link.

## Dev Agent Record

### Implementation Plan

Implemented all 12 subtasks exactly as specified. 89 lines total. Cards are cached at module scope (before DOMContentLoaded) since script is `defer` — DOM is ready when script executes. Filter panel toggle uses `panel.hidden = expanded` (toggles the previous expanded state to close).

### Debug Log

No issues. All filter tests passed on first run.

### Completion Notes

browse-filter.js: 89 lines, zero dependencies, vanilla URLSearchParams. All filter ACs verified: OR within category, AND across categories, URL-first writes, popstate restoration, panel collapsed on load with URL pre-apply.

## File List

- assets/js/browse-filter.js (new)

## Change Log

- 2026-06-13: Story created and enriched for dev (Story 3.3)
- 2026-06-14: Implemented — browse-filter.js created, 89 lines, all tests green

## Status

review

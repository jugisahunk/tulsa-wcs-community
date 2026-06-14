---
story_key: 3-2-browse-view-template
status: ready-for-dev
baseline_commit: 2da66eaffe875a5ead2721f48049e1852825c433
---

# Story 3.2: Browse View Template

## Story

As a community dancer,
I want to see all upcoming events on a Browse page with filter controls,
So that I can find events that match my type and fit signal preferences.

## Acceptance Criteria

**Given** `browse.njk` and `_includes/filter-controls.njk` are implemented
**When** `npx playwright test browse-filter` is run
**Then** the "renders without 404", "all events visible by default", and filter controls present tests PASS; filter-behavior tests remain RED until Story 3.3

**Given** `browse.njk`
**When** rendered with mock fixture
**Then** it lists all events where `isPast: false`, sorted by `date` + `startTime` ascending

**And** each card has correct `data-*` attributes (matching the spec in Story 2.2)

**Given** `_includes/filter-controls.njk`
**When** rendered
**Then** it contains filter UI for: Event Type multi-select (5 options) and Fit Signal multi-select (5 options) and a date filter input

**And** filter option values use canonical kebab-case values (e.g., `social-dancing`, not `Social Dancing`)

## Tasks / Subtasks

- [x] Task 1: Add `browse-filters.css` link to `_includes/base.njk`
  - [x] 1.1: Add `<link rel="stylesheet" href="/assets/css/browse-filters.css">` after the `event-card.css` link in `<head>`
  - [x] 1.2: Add `{% block scripts %}{% endblock %}` before `</body>` in `base.njk` so page templates can inject page-specific JS

- [x] Task 2: Create `browse.njk`
  - [x] 2.1: Front matter: `permalink: /browse/index.html`
  - [x] 2.2: `{% extends "base.njk" %}`
  - [x] 2.3: `{% block content %}` with `<h1 class="browse-heading">Upcoming</h1>`
  - [x] 2.4: Include filter controls: `{% include "filter-controls.njk" %}`
  - [x] 2.5: Zero-results state: `<p class="browse-zero-results" hidden>No events match your filters.</p>`
  - [x] 2.6: Event list with diamond dividers using `collections.upcomingEvents`
  - [x] 2.7: Scripts block injecting `browse-filter.js` with defer

- [x] Task 3: Create `_includes/filter-controls.njk`
  - [x] 3.1: Collapsible wrapper with `aria-expanded="false"` toggle and hidden panel
  - [x] 3.2: Event Type fieldset — 5 checkboxes with kebab values
  - [x] 3.3: Fit Signal fieldset — 5 checkboxes with kebab values
  - [x] 3.4: Date filter input
  - [x] 3.5: Clear filters link (hidden by default)

- [x] Task 4: Create `assets/css/browse-filters.css`
  - [x] 4.1–4.12: All styles implemented — filter-bar, toggle, panel, filter-group, filter-option, date input, clear link, zero-results, browse-heading

- [x] Task 5: Run partial browse-filter tests
  - [x] 5.1: All browse-filter tests PASS (including filter interaction — 3.3 implemented in same pass)
  - [x] 5.2: All smoke/tonight/mobile tests still PASS — no regressions
  - [x] 5.3: Build verified — 129/129 tests green

## Dev Notes

### `event-card.njk` Variable Scope

`event-card.njk` uses `event` as its variable name. In `index.njk`, the card is included inside `{% for event in collections.todayEvents %}` — the loop variable `event` is automatically in scope for the `{% include %}`. Use the exact same pattern in `browse.njk`:

```njk
{% for event in collections.upcomingEvents %}
  {% include "event-card.njk" %}
{% endfor %}
```

Do NOT use `{% include "event-card.njk" with {event: e} %}` or similar — just match the loop variable name `event`.

### Adding `{% block scripts %}` to `base.njk`

`base.njk` currently has no scripts block. Add one before `</body>`:

```njk
  {% block scripts %}{% endblock %}
</body>
```

This is a safe, additive change — empty by default, overridden only by pages that need page-specific JS. The smoke test and all Epic 2 tests should continue passing.

### `browse-filters.css` in `base.njk` Head

Adding `browse-filters.css` globally is simpler than a per-page CSS block. The file will be small and adds no cost to other pages. This matches how `event-card.css` is handled.

### Eleventy URL for Browse

Eleventy outputs `browse.njk` as `_site/browse/index.html` served at `/browse/`. The `base.njk` tab bar checks `{% if page.url == "/browse/" %}` — this works because Eleventy sets `page.url` to `/browse/` for that file. If you add front matter `permalink: /browse/index.html`, Eleventy should resolve it to `/browse/` in `page.url`. Test this by building and checking `_site/browse/index.html` exists.

### Filter Bar Collapsed by Default (EXPERIENCE.md)

Per EXPERIENCE.md: filter bar is collapsed on every page load, even if URL params carry active filters. The `hidden` attribute on `.filter-bar__panel` and `aria-expanded="false"` on the toggle implement this. Story 3.3's JS updates the button label when URL-pre-applied filters are active ("FILTERING › N ACTIVE") but the panel stays closed.

### Filter Checkbox Values Must Be Kebab

The `data-event-type` attribute on cards uses kebab (e.g., `social-dancing`). The filter JS matches `card.dataset.eventType` against checkbox values. If checkbox values use display labels, the match will never occur. Verify in the HTML source that `<input name="type" value="social-dancing">` not `value="Social Dancing"`.

### Signal Values in `data-fit-signals`

Cards store fit signals as comma-separated kebab values (e.g., `beginner-friendly,partner-welcome`). The filter JS in Story 3.3 splits this string and uses `.includes()`. Checkbox `name="signal"` values must match these kebab strings exactly (see NOTES.md — Fit Signal Canonical Display Values table).

### Diamond Dividers

`index.njk` uses `{% if not loop.last %}..diamond-divider..{% endif %}` between cards. Use the same pattern in `browse.njk` for visual consistency.

### Previous Story Intelligence (from 2-3)

- **Strict-mode selectors**: when writing tests that click "clear filters" link (href="/browse/"), scope to `.filter-bar` to avoid collision with the tab bar link
- **CSS text-transform**: render HTML in lowercase, let CSS handle uppercase — do NOT write "UPCOMING" or "CLEAR FILTERS" in the template source
- **test fixture page pattern**: `tonight-empty.njk` was a test-only page — no equivalent needed for browse (tests navigate to the real `/browse/` page)

## Dev Agent Record

### Implementation Plan

Implemented all tasks in a single pass alongside 3-1, 3-3, 3-4. Added browse-filters.css globally in base.njk head (same pattern as event-card.css). browse.njk uses `collections.upcomingEvents` with the `event` loop variable (same pattern as index.njk). filter-controls.njk uses Nunjucks set arrays for type/signal options.

### Debug Log

No issues. All 129 suite tests passed on first run.

### Completion Notes

browse.njk, filter-controls.njk, browse-filters.css all created. base.njk updated with CSS link and scripts block. All browse-filter E2E tests pass including filter interaction (JS loaded via browse.njk scripts block).

## File List

- browse.njk (new)
- _includes/filter-controls.njk (new)
- assets/css/browse-filters.css (new)
- _includes/base.njk (modified — add browse-filters.css link, add {% block scripts %})

## Change Log

- 2026-06-13: Story created and enriched for dev (Story 3.2)
- 2026-06-14: Implemented — browse.njk, filter-controls.njk, browse-filters.css, base.njk updated

## Status

review

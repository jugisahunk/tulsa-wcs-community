---
story_key: 3-2-browse-view-template
status: not-started
---

# Story 3.2: Browse View Template

## Story

As a community dancer,
I want to see all upcoming events on a Browse page with filter controls,
So that I can find events that match my type and fit signal preferences.

## Acceptance Criteria

**Given** `browse.njk` and `_includes/filter-controls.njk` are implemented
**When** `npx playwright test browse-filter` is run
**Then** the "renders without 404", "all events visible by default", and "filter controls present" tests PASS; filter-behavior tests remain RED until Story 3.3

**Given** `browse.njk`
**When** rendered with mock fixture
**Then** it lists all events where `isPast: false`, sorted by `date` + `startTime` ascending

**And** each card has correct `data-*` attributes (matching the spec in Story 2.2)

**Given** `_includes/filter-controls.njk`
**When** rendered
**Then** it contains filter UI for: Event Type multi-select (5 options) and Fit Signal multi-select (5 options) and a date filter input

**And** filter option values use canonical kebab-case values (e.g., `social-dancing`, not `Social Dancing`)

## Tasks / Subtasks

- [ ] Task 1: Create `browse.njk`
  - [ ] 1.1: Front matter: `layout: base.njk`, `title: Browse Events`
  - [ ] 1.2: Page heading: `<h1 class="browse-heading">Upcoming</h1>` (CSS uppercases to "UPCOMING")
  - [ ] 1.3: Include filter controls: `{% include "filter-controls.njk" %}`
  - [ ] 1.4: Zero-results state (hidden by default, shown by JS): `<p class="browse-zero-results" hidden>No events match your filters.</p>` (CSS uppercases)
  - [ ] 1.5: Event list: iterate `collections.upcomingEvents` and `{% include "event-card.njk" %}` for each
  - [ ] 1.6: Load `browse-filter.js` at bottom of page: `<script src="/assets/js/browse-filter.js" defer></script>`

- [ ] Task 2: Create `_includes/filter-controls.njk`
  - [ ] 2.1: Collapsible wrapper with toggle button:
    ```njk
    <div class="filter-bar" id="filter-bar">
      <button class="filter-bar__toggle" aria-expanded="false" aria-controls="filter-bar__panel">
        Filter events ›
      </button>
      <div class="filter-bar__panel" id="filter-bar__panel" hidden>
        <!-- filter groups here -->
      </div>
    </div>
    ```
  - [ ] 2.2: Event Type filter group (5 checkboxes):
    ```njk
    <fieldset class="filter-group">
      <legend class="filter-group__label">Event Type</legend>
      {% set types = [
        { label: 'Social Dancing', value: 'social-dancing' },
        { label: 'Group Lesson', value: 'group-lesson' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Competition', value: 'competition' },
        { label: 'Convention', value: 'convention' }
      ] %}
      {% for t in types %}
        <label class="filter-option">
          <input type="checkbox" name="type" value="{{ t.value }}" class="filter-option__input">
          <span class="filter-option__label">{{ t.label }}</span>
        </label>
      {% endfor %}
    </fieldset>
    ```
  - [ ] 2.3: Fit Signal filter group (5 checkboxes) with values: `beginner-friendly`, `partner-welcome`, `skill-level-target`, `instructor-present`, `special-guest-present`
  - [ ] 2.4: Date filter input:
    ```njk
    <div class="filter-group">
      <label for="filter-date" class="filter-group__label">Date</label>
      <input type="date" id="filter-date" name="date" class="filter-date__input">
    </div>
    ```
  - [ ] 2.5: Clear filters link (hidden until filters active): `<a href="/browse/" class="filter-bar__clear" hidden>Clear filters</a>`

- [ ] Task 3: Create `assets/css/browse-filters.css` and link in `base.njk`
  - [ ] 3.1: Filter bar toggle button: uppercase, small, on-brand
  - [ ] 3.2: Filter panel: collapsible (toggle `hidden` attribute via JS in Story 3.3; CSS handles the visual open state)
  - [ ] 3.3: Filter option checkboxes: accessible custom checkbox styling matching the dark theme
  - [ ] 3.4: Date input: styled to match dark theme

- [ ] Task 4: Run partial tests
  - [ ] 4.1: Run `npx playwright test browse-filter` — expect "renders without 404" and "all events visible" tests to PASS; filter interaction tests still FAIL (no JS yet)
  - [ ] 4.2: Run `npm run build` and inspect `_site/browse/index.html` to verify markup structure

## Dev Notes

### `collections.upcomingEvents`

Per the collection defined in Story 1.2: `upcomingEvents` = events where `!isPast` (includes today + future), sorted by date + startTime ascending. This is the correct data for Browse — you see everything coming up including today.

### Filter Option Values Must Be Kebab

The `data-event-type` attribute on cards uses kebab values (e.g., `social-dancing`). Filter checkboxes must use the same values so the JS in Story 3.3 can match them. Do NOT use display labels ("Social Dancing") as checkbox values.

### Collapsible Filter Bar

Per EXPERIENCE.md, the filter bar shows "FILTER EVENTS ›" when collapsed (no filters active) and "FILTERING › N ACTIVE" when filters are active. The toggle behavior is wired in Story 3.3. For now, the filter bar can default to expanded (remove `hidden` from panel) to make testing easier; Story 3.3 will add the toggle behavior.

### Browse View URL

Eleventy will output `browse.njk` as `_site/browse/index.html`, served at `/browse/`. Confirm this with `npx @11ty/eleventy` and check the output.

### Zero-Results State

The "NO EVENTS MATCH YOUR FILTERS." message (per EXPERIENCE.md locked strings) starts hidden. Story 3.3's JS shows/hides it based on visible card count. CSS: `text-transform: uppercase` on `.browse-zero-results`.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

---
story_key: 3-1-browse-archive-e2e-specs
status: not-started
---

# Story 3.1: Browse & Archive E2E Specs (Failing Tests First)

## Story

As a developer,
I want failing Playwright E2E specs for Browse filtering and Archive written before any implementation,
So that the filter logic and URL state behavior are defined by tests, not discovered after the fact.

## Acceptance Criteria

**Given** `tests/e2e/browse-filter.spec.js`
**When** run against the current build
**Then** all tests FAIL (no Browse View implementation exists yet)

**And** the spec covers:
- `/browse` renders without a 404 or 500
- All upcoming events from mock fixture are visible by default
- Selecting an Event Type filter hides non-matching cards
- Selecting a Fit Signal filter hides non-matching cards
- Selecting both a type and a fit signal applies AND logic (only cards matching both visible)
- Deselecting all filters restores all event cards
- After applying a type filter, the URL contains `?type={kebab-value}`
- After applying a signal filter, the URL contains `?signal={kebab-value}`
- Loading `/browse?type=social-dancing` pre-applies the Social Dancing filter
- Loading `/browse?type=social-dancing,workshop` shows both Social Dancing and Workshop events (OR within category)

**Given** `tests/e2e/archive.spec.js`
**When** run
**Then** all tests FAIL

**And** the spec covers:
- `/archive` renders without a 404 or 500
- Past events from mock fixture are visible
- Upcoming and today events are NOT visible in the Archive
- An Archive link is present in the site navigation (tab bar)

## Tasks / Subtasks

- [ ] Task 1: Create `tests/e2e/browse-filter.spec.js`
  - [ ] 1.1: Import `{ test, expect }` from `@playwright/test`
  - [ ] 1.2: Test: navigate to `/browse/` without error
  - [ ] 1.3: Test: default state — assert visible `.event-card` count equals the number of upcoming events in the mock fixture (import from `tests/fixtures/mock-events.js`)
  - [ ] 1.4: Test: click a Social Dancing filter option → only Social Dancing cards visible (use `data-event-type="social-dancing"` to assert)
  - [ ] 1.5: Test: click a Fit Signal filter → only cards with that signal visible
  - [ ] 1.6: Test: apply type + signal filter → only cards matching BOTH are visible (AND logic)
  - [ ] 1.7: Test: deselect all filters → all cards visible again
  - [ ] 1.8: Test: after clicking a type filter, `page.url()` contains `type=social-dancing`
  - [ ] 1.9: Test: after clicking a signal filter, `page.url()` contains `signal={kebab-signal}`
  - [ ] 1.10: Test: navigate to `/browse/?type=social-dancing` directly → Social Dancing filter pre-applied (only Social Dancing cards visible)
  - [ ] 1.11: Test: navigate to `/browse/?type=social-dancing,workshop` → both Social Dancing AND Workshop cards visible (OR within type category)

- [ ] Task 2: Create `tests/e2e/archive.spec.js`
  - [ ] 2.1: Test: navigate to `/archive/` without error
  - [ ] 2.2: Test: at least one past event card visible (use mock fixture's past event name)
  - [ ] 2.3: Test: upcoming/today events NOT present on the archive page (check that today event names are absent)
  - [ ] 2.4: Test: ARCHIVE tab in `[aria-label="Main navigation"]` has `aria-current="page"` when on `/archive/`

- [ ] Task 3: Confirm all tests FAIL
  - [ ] 3.1: Run `npx playwright test browse-filter archive` and confirm all fail
  - [ ] 3.2: Document failure messages in Dev Agent Record (they confirm the tests are targeting correct selectors)

## Dev Notes

### URL Params for Browse Filters

Per architecture.md:
- `?type=social-dancing,workshop` — comma-separated kebab values
- `?signal=beginner-friendly` — kebab signal values
- `?date=2026-06-14` — ISO date

Test the exact URL parameter format. Playwright's `page.url()` returns the full URL; use `.includes('type=social-dancing')` or parse with `new URL(page.url()).searchParams`.

### Filter Selectors

The filter controls won't exist yet, so tests that "click a filter" will need to use whatever selector the implementation produces. Use attribute selectors that match what Story 3.2 will implement:
- `[data-filter-type="social-dancing"]` or a labeled checkbox/button
- Default to using `getByLabel('Social Dancing')` if it's a labeled checkbox, or `getByRole('checkbox', { name: 'Social Dancing' })`

Write the selectors in the spec; if they don't match the implementation, adjust in Story 3.2.

### Card Visibility Testing

Use Playwright's `isVisible()` or assert `not.toHaveAttribute('hidden')` on cards. The filter JS in Story 3.3 toggles the `hidden` attribute; the spec should assert:
```js
const hiddenCards = page.locator('.event-card[hidden]');
const visibleCards = page.locator('.event-card:not([hidden])');
```

### Archive Tab `aria-current` Test

This test requires the Archive page to actually exist (`archive.njk`). Since it doesn't yet, this test will fail with a 404 — which is the expected outcome. The `aria-current` assertion confirms that when `/archive/` loads, the tab bar correctly identifies the active tab.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

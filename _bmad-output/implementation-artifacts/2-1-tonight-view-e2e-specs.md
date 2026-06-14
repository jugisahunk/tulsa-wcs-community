---
story_key: 2-1-tonight-view-e2e-specs
status: ready-for-dev
---

# Story 2.1: Tonight View E2E Specs (Failing Tests First)

## Story

As a developer,
I want failing Playwright E2E specs for all Tonight View behaviors written before any template code,
So that implementation is driven by the tests and every acceptance criterion has an automated check.

## Acceptance Criteria

**Given** `tests/e2e/tonight-view.spec.js`
**When** run against the current (empty) build
**Then** all tests FAIL (no implementation exists yet) — this is the expected and correct outcome at story completion

**And** the spec covers:
- Home page (`/`) renders without a 404 or 500
- Events with `isToday: true` in the mock fixture are visible on the page
- Events are ordered by start time ascending (first card's time ≤ second card's time)
- Each card displays: event name, formatted start time ("8:00 PM"), venue name, cost, event type badge
- A recurring event card shows the "Recurring" badge
- The hero `<h1>` text is exactly "West Coast Swing in Tulsa"
- The WCS intro paragraph is present on the page

**Given** `tests/e2e/tonight-empty.spec.js`
**When** run against `/tonight-empty/` (a dedicated test fixture page created in Story 2.3)
**Then** all tests FAIL (the fixture page doesn't exist yet)

**And** the spec covers:
- The empty state container is visible
- The text "QUIET TONIGHT." is visible before the subscribe copy
- A `[aria-hidden="true"]` diamond ornament element is present between "QUIET TONIGHT." and the subscribe copy
- The exact empty-state copy is present: "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them."
- An email `<input>` and submit `<button>` are visible
- A "BROWSE UPCOMING" link is present with `href="/browse/"`

**Given** `tests/e2e/mobile-layout.spec.js`
**When** run at 320px viewport width
**Then** all tests FAIL with meaningful failures (no event cards exist yet)

**And** the spec covers:
- The home page renders without horizontal overflow (`document.documentElement.scrollWidth <= 320`)
- Event cards are visible (will FAIL — no cards yet)
- No card content is clipped at 320px (DOM bounding-box check)

## Tasks / Subtasks

- [ ] Task 1: Create `tests/e2e/tonight-view.spec.js`
  - [ ] 1.1: Assert home page loads HTTP 200 (already passes via smoke — still include for completeness)
  - [ ] 1.2: Assert `<h1>` text is exactly "West Coast Swing in Tulsa" (already passes — still include)
  - [ ] 1.3: Assert at least one `.event-card` element is visible (FAILS — no cards yet)
  - [ ] 1.4: Assert today events are ordered by start time ascending — compare text of first and second `.event-card__meta` time elements
  - [ ] 1.5: Assert each `.event-card` shows event name via `.event-card__title`
  - [ ] 1.6: Assert each `.event-card` shows formatted time (e.g., "8:00 PM") in `.event-card__meta`
  - [ ] 1.7: Assert each `.event-card` shows venue name in `.event-card__meta`
  - [ ] 1.8: Assert each `.event-card` shows cost in `.event-card__meta`
  - [ ] 1.9: Assert each `.event-card` shows an `.event-type-badge` element
  - [ ] 1.10: Assert a recurring event card shows `.recurring-badge`
  - [ ] 1.11: Assert a `.wcs-intro` paragraph is present on the page

- [ ] Task 2: Create `tests/e2e/tonight-empty.spec.js`
  - [ ] 2.1: Navigate to `/tonight-empty/` (will 404 until Story 2.3 creates the fixture)
  - [ ] 2.2: Assert `.empty-state` container is visible
  - [ ] 2.3: Assert text "QUIET TONIGHT." appears before the subscribe copy
  - [ ] 2.4: Assert `[aria-hidden="true"].diamond-divider` exists between orientation text and copy
  - [ ] 2.5: Assert locked copy text "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them." is present
  - [ ] 2.6: Assert `input[type="email"]` is visible
  - [ ] 2.7: Assert `button[type="submit"]` is visible
  - [ ] 2.8: Assert `a[href="/browse/"]` with text matching "BROWSE UPCOMING" is present

- [ ] Task 3: Create `tests/e2e/mobile-layout.spec.js`
  - [ ] 3.1: Set viewport to `{ width: 320, height: 667 }` via Playwright `use` config in the test or `page.setViewportSize()`
  - [ ] 3.2: Assert `document.documentElement.scrollWidth <= 320` via `page.evaluate()`
  - [ ] 3.3: Assert `.event-card` elements exist and are visible (FAILS — no cards yet)
  - [ ] 3.4: Assert no `.event-card` has `boundingBox().width > 320` (content clipping check)

- [ ] Task 4: Confirm correct test failure state
  - [ ] 4.1: Run `npx playwright test tonight-view` — confirm it fails on `.event-card` assertions
  - [ ] 4.2: Run `npx playwright test tonight-empty` — confirm it fails (404 for `/tonight-empty/`)
  - [ ] 4.3: Run `npx playwright test mobile-layout` — confirm it fails on `.event-card` assertions
  - [ ] 4.4: Run `npx playwright test smoke` — confirm ALL smoke tests still PASS (no regressions)

## Dev Notes

### Why Tests Must Fail

This is TDD — failing tests first is the correct and expected outcome. The tests define the contract that Stories 2.2 and 2.3 must satisfy. Do not skip ahead to implement templates. Do not modify `index.njk` in this story.

### Anticipated HTML Structure (Write Tests to Target This)

Story 2.2 will implement event cards following the architecture spec. Write tests targeting these class names and attributes so the tests are immediately satisfied when Story 2.2 delivers:

**Event card** (`_includes/event-card.njk`):
```html
<a class="event-card" href="/events/{event.id}/"
   data-event-type="{kebab-type}"
   data-fit-signals="{comma-separated-kebab-signals}"
   data-event-date="{YYYY-MM-DD}"
   data-is-today="{true|false}"
   data-is-past="{true|false}"
   aria-label="{name}, {formatted-date}, {formatted-time}, {venue}">
  <div class="event-type-badge">{TYPE}</div>
  <h2 class="event-card__title">{event.name}</h2>
  <p class="event-card__meta">{time} · {venue} · {cost}</p>
  <div class="event-card__chips">
    <!-- fit signal chips and recurring badge -->
    <span class="fit-signal-chip">{signal}</span>
    <span class="recurring-badge">recurring</span>
  </div>
</a>
```

**Diamond divider** between cards:
```html
<div aria-hidden="true" class="diamond-divider">◆</div>
```

**Empty state** (`_includes/empty-state.njk`):
```html
<div class="empty-state">
  <p class="empty-state__headline">quiet tonight.</p>
  <div aria-hidden="true" class="diamond-divider">◆</div>
  <p class="empty-state__copy">Some of the best nights...</p>
  <!-- subscribe form -->
  <form ...>
    <input type="email" ...>
    <button type="submit">...</button>
  </form>
  <a href="/browse/">browse upcoming</a>
</div>
```

**WCS intro paragraph:**
```html
<p class="wcs-intro">...</p>
```

### Empty State Testing Strategy

`collections.todayEvents` always has events at build time (mock data computes `isToday` from today's real date). For the empty state test, **do not try to mock or patch the live site**. Instead:

- Write `tonight-empty.spec.js` to test against the URL `/tonight-empty/`
- Story 2.3 will create `tonight-empty.njk` at project root — a dedicated Eleventy template that unconditionally renders the empty-state partial (ignoring `todayEvents`)
- This fixture page is deployed alongside the main site for testing purposes

### Mobile Layout Test Approach

Use `page.setViewportSize({ width: 320, height: 667 })` at the start of mobile tests rather than a separate Playwright project. This keeps the mobile tests in one file and avoids needing a separate playwright config entry for now.

```js
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 667 });
});
```

### Test Time Comparison for Sort Order

The mock fixture has two today events:
- "Intro to WCS" at `19:00` → formatted as "7:00 PM"
- "Tulsa swing social" at `20:00` → formatted as "8:00 PM"

Assert that the first `.event-card` in the DOM comes before the second by time. Use `page.locator('.event-card__meta').nth(0)` and `.nth(1)`, then compare the time text lexicographically ("7:00 PM" < "8:00 PM").

### Smoke Tests Must Remain Green

`smoke.spec.js` tests h1 text, page 200, no console errors, and the tab bar. None of these depend on event cards. All smoke tests must still pass after this story. Run `npx playwright test smoke` to confirm.

### Class Names Are Not Yet in the Codebase

The class names in this dev note (`.event-card`, `.event-type-badge`, etc.) do not yet exist. Writing tests against them will produce "element not found" failures — which is correct for TDD.

### NOTES.md Data-Fit-Signals Discrepancy

NOTES.md says `data-fit-signals` is space-separated. The Story 2.2 ACs say **comma-separated**. The ACs take precedence. Write tests expecting comma-separated values, e.g., `data-fit-signals="beginner-friendly,partner-welcome"`. Update NOTES.md when implementing Story 2.2 to correct this.

## Dev Agent Record

### Implementation Plan
(to be filled during implementation)

### Debug Log
(to be filled during implementation)

### Completion Notes
(to be filled during implementation)

## File List

(to be filled during implementation)

## Change Log

(to be filled during implementation)

## Status

ready-for-dev

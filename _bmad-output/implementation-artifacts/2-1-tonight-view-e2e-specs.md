---
story_key: 2-1-tonight-view-e2e-specs
status: not-started
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
- A recurring event card shows the "RECURRING" badge
- The hero `<h1>` text is exactly "West Coast Swing in Tulsa"
- The WCS intro paragraph is present on the page

**Given** `tests/e2e/tonight-empty.spec.js`
**When** run (with mock fixture patched to have no today events, or using a query param convention)
**Then** the spec covers:
- The empty state container is visible
- The text "QUIET TONIGHT." is visible before the subscribe copy
- A `[aria-hidden="true"]` diamond ornament element is present between "QUIET TONIGHT." and subscribe copy
- The exact empty-state copy is present: "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them."
- An email `<input>` and submit `<button>` are visible
- A "BROWSE UPCOMING" link is present and its `href` points to `/browse/`

**Given** `tests/e2e/mobile-layout.spec.js`
**When** run at 320px viewport width
**Then** the spec covers:
- The home page renders without horizontal overflow (`document.documentElement.scrollWidth <= 320`)
- All event card content is visible

## Tasks / Subtasks

- [ ] Task 1: Create `tests/e2e/tonight-view.spec.js`
  - [ ] 1.1: Import `{ test, expect }` from `@playwright/test`
  - [ ] 1.2: Test: home page navigates without HTTP error (check response status or absence of error page)
  - [ ] 1.3: Test: at least one `.event-card` element is visible on the page (indicating today events rendered)
  - [ ] 1.4: Test: event cards are sorted by start time ascending — get `data-start-time` or visible time text from first two cards and compare
  - [ ] 1.5: Test: first visible card contains event name text, time in "H:MM AM/PM" format, venue name, cost string, event type badge element
  - [ ] 1.6: Test: find a card for a recurring event and assert a `.recurring-badge` or `[data-recurring]` element is visible within it
  - [ ] 1.7: Test: `page.locator('h1')` has text "West Coast Swing in Tulsa"
  - [ ] 1.8: Test: WCS intro paragraph is present — locate by a unique portion of the text or by class `.wcs-intro`

- [ ] Task 2: Create `tests/e2e/tonight-empty.spec.js`
  - [ ] 2.1: Determine the empty-state strategy: the mock fixture always has today events, so either:
    - Use a Playwright route intercept to override the mock data, OR
    - Add a special Eleventy build flag/env var to use an empty fixture, OR
    - Create a dedicated empty-state test page at a separate URL during development
    - **Recommended**: Create `tests/e2e/tonight-empty.spec.js` that navigates to `/?empty=true` if the template supports a query param, OR document in Dev Notes that this spec is run against a special build with no today events
  - [ ] 2.2: Test: `.empty-state` container is visible
  - [ ] 2.3: Test: text "QUIET TONIGHT." is present and appears before the subscribe copy in DOM order
  - [ ] 2.4: Test: `[aria-hidden="true"]` element (diamond ornament) exists between orientation and copy
  - [ ] 2.5: Test: exact copy string is present on page
  - [ ] 2.6: Test: `input[type="email"]` is visible
  - [ ] 2.7: Test: submit button is visible
  - [ ] 2.8: Test: link with text matching "BROWSE UPCOMING" (or "browse upcoming" since CSS uppercases) has `href="/browse/"`

- [ ] Task 3: Create `tests/e2e/mobile-layout.spec.js`
  - [ ] 3.1: Set viewport: `page.setViewportSize({ width: 320, height: 568 })`
  - [ ] 3.2: Navigate to home page
  - [ ] 3.3: Test no horizontal overflow:
    ```js
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(320);
    ```
  - [ ] 3.4: Test: at least one `.event-card` is visible at this viewport (not clipped off-screen)

- [ ] Task 4: Confirm tests FAIL (required by TDD discipline)
  - [ ] 4.1: Run `npx playwright test tonight-view tonight-empty mobile-layout`
  - [ ] 4.2: Confirm tests fail — if any test unexpectedly passes, investigate why (may indicate a naming conflict or leftover implementation)
  - [ ] 4.3: Document which tests fail and what errors appear in Dev Agent Record (this is the expected "red" state)

## Dev Notes

### TDD Discipline — Tests Must Fail

This story is intentionally writing FAILING tests. The correct completion state is ALL tests failing. Do NOT implement any Tonight View template code in this story. Story 2.2 makes them green.

### Empty State Testing Strategy

The mock fixture always has today events, making it impossible to naturally trigger the empty state. Options:
1. **Separate build target**: Create `_data/events.empty.js` with no today events; run Playwright with an env var pointing to it. Complex.
2. **Query param**: In `index.njk`, check for a `?empty=1` query param and render empty state. Simple but requires template modification.
3. **Story-level note**: Mark `tonight-empty.spec.js` as testing the component in isolation via `page.route()` to intercept the page and inject an empty-state scenario.

**Recommended approach for this story**: Write the spec assuming the empty state is at a route like `/?empty=true` OR assume a special build. Mark the spec with `test.skip('pending empty-state implementation')` for the parts that can't run yet, but write all the assertions. Story 2.3 will finalize the approach.

### Selector Conventions

Use semantic selectors that match the HTML you expect Story 2.2 to produce:
- Event cards: `.event-card`
- Recurring badge: `.recurring-badge` or `text=RECURRING`
- Empty state: `.empty-state`
- Type badge: `.event-type-badge`
- Time on card: use `getByText` with regex `/\d+:\d{2} (AM|PM)/`

### Architecture Reference

- `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/EXPERIENCE.md` → "Locked strings" table
- `_bmad-output/planning-artifacts/architecture.md` → "E2E Testing: Playwright" section

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

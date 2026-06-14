---
story_key: 4-1-event-detail-e2e-specs
status: not-started
---

# Story 4.1: Event Detail E2E Specs (Failing Tests First)

## Story

As a developer,
I want failing Playwright E2E specs for event detail pages — including Schema.org JSON-LD and OG tag assertions — written before the detail template,
So that SEO requirements are verified by tests and cannot regress silently.

## Acceptance Criteria

**Given** `tests/e2e/event-detail.spec.js`
**When** run against the current build
**Then** all tests FAIL (no event detail pages exist yet)

**And** the spec covers:
- Clicking an event card on the Tonight View navigates to a URL matching `/events/{slug}/`
- The event detail page renders without a 404
- The page `<h1>` contains the event name
- The formatted date, venue name, and cost are present on the page
- A `<script type="application/ld+json">` element is present in `<head>`
- The JSON-LD parses as valid JSON
- The JSON-LD contains `"@type": "Event"`, `"name"`, `"startDate"`, and `"location"`
- `<meta property="og:title">` is present with the event name
- `<meta property="og:description">` is present
- `<meta property="og:image">` is present and points to the event type placeholder image
- A recurring event detail page shows the "RECURRING" badge

## Tasks / Subtasks

- [ ] Task 1: Create `tests/e2e/event-detail.spec.js`
  - [ ] 1.1: Use a specific known event from the mock fixture (import from `tests/fixtures/mock-events.js`)
  - [ ] 1.2: Test: navigate to Tonight View (`/`), click first event card, assert URL matches `/events/\w+-\d{4}-\d{2}-\d{2}/` pattern
  - [ ] 1.3: Test: navigate directly to `/events/{known-slug}/` and assert HTTP 200 (no 404 page)
  - [ ] 1.4: Test: `page.locator('h1')` contains the event name
  - [ ] 1.5: Test: page contains formatted date text, venue name, and cost string
  - [ ] 1.6: Test: `page.locator('script[type="application/ld+json"]')` is present in the document head
  - [ ] 1.7: Test: JSON-LD content parses as valid JSON:
    ```js
    const ldJsonContent = await page.locator('script[type="application/ld+json"]').textContent();
    const ldJson = JSON.parse(ldJsonContent); // throws if invalid
    expect(ldJson).toBeTruthy();
    ```
  - [ ] 1.8: Test: JSON-LD has required fields:
    ```js
    expect(ldJson['@type']).toBe('Event');
    expect(ldJson.name).toBeTruthy();
    expect(ldJson.startDate).toBeTruthy();
    expect(ldJson.location).toBeTruthy();
    ```
  - [ ] 1.9: Test: `<meta property="og:title">` is present and its `content` attribute matches the event name
  - [ ] 1.10: Test: `<meta property="og:description">` is present and non-empty
  - [ ] 1.11: Test: `<meta property="og:image">` is present and `content` contains `/assets/images/event-types/`
  - [ ] 1.12: Test: navigate to a recurring event's detail page and assert `.recurring-badge` is visible

- [ ] Task 2: Confirm all tests FAIL
  - [ ] 2.1: Run `npx playwright test event-detail` and confirm all fail (no `/events/` pages exist)
  - [ ] 2.2: Document the specific failures in Dev Agent Record

## Dev Notes

### Known Slug for Testing

Use the mock fixture's today event slug (e.g., `tulsa-swing-social-{today-date}`). However, since the date is dynamic, either:
1. Import the mock fixture in the test and compute the slug: `import { mockEvents } from '../fixtures/mock-events.js'`
2. Use a fixed past event whose slug won't change (e.g., the past event with a hardcoded date)

Option 2 is more reliable for E2E tests. Use the hardcoded past event from the mock fixture.

### JSON-LD Location

The `<script type="application/ld+json">` is in `<head>`, inside the `{% block schema %}` slot from Story 1.3. Playwright can query it via `page.locator('head script[type="application/ld+json"]')`.

### OG Tags Location

OG tags are also in `<head>` inside `{% block meta %}`. Query: `page.locator('meta[property="og:title"]')`, then `.getAttribute('content')`.

### Test Isolation

Each test in this file should be independent — navigate fresh to the page rather than relying on state from a previous test. Use `test.beforeEach` to navigate:
```js
test.beforeEach(async ({ page }) => {
  await page.goto(`/events/${KNOWN_SLUG}/`);
});
```

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

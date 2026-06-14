---
story_key: 5-3-swap-mock-data-for-real-data
status: not-started
---

# Story 5.3: Swap Mock Data for Real Data

## Story

As Jason (operator),
I want the Eleventy build to use the real Sheets integration and for all existing E2E tests to pass,
So that the site I deploy is driven by live data and all prior test coverage still holds.

## Acceptance Criteria

**Given** `.eleventy.js` is updated to use `events.js` instead of `events.mock.js`
**When** `npx playwright test` (full suite) is run against a real-data build
**Then** all E2E tests pass (Tonight, Browse filter, event detail, mobile, smoke)

**And** if any E2E test fails with real data, the failure is investigated and resolved before this story is marked complete

**And** `events.mock.js` remains in the repo (used in unit tests and as a local dev fallback)

## Tasks / Subtasks

- [ ] Task 1: Update `.eleventy.js` to use real data
  - [ ] 1.1: Change the `import` in `.eleventy.js` from `events.mock.js` to `events.js`:
    ```js
    import events from './_data/events.js';
    ```
  - [ ] 1.2: Alternatively: make the data source env-var controlled:
    ```js
    const eventsModule = process.env.USE_MOCK_DATA ? './_data/events.mock.js' : './_data/events.js';
    const events = (await import(eventsModule)).default;
    ```
    This allows running `USE_MOCK_DATA=true npm run build` locally without credentials.
  - [ ] 1.3: Recommended: use the env-var approach. Set `USE_MOCK_DATA=true` in local `.env` by default.

- [ ] Task 2: Run full E2E suite against real data
  - [ ] 2.1: Run `npm run build` with real credentials
  - [ ] 2.2: Run `npx playwright test` (full suite)
  - [ ] 2.3: Investigate and fix any failing tests

- [ ] Task 3: Potential E2E test failures with real data — common issues
  - [ ] 3.1: Date-dependent tests: real data has actual future dates, not mock dates computed relative to today. Tests asserting specific date strings may need adjustment to use regex or contain-checks rather than exact matches.
  - [ ] 3.2: Event count assertions: if tests assert "N events visible", real data may have different counts. Update tests to be count-agnostic or assert `>= 1`.
  - [ ] 3.3: Today-event tests: if there are no events on the current day in real data, the Tonight View empty state appears. This is correct behavior; adjust tests accordingly.
  - [ ] 3.4: Slug-based navigation: if tests navigate to a hardcoded slug from the mock fixture, that slug won't exist in real data. Update tests to navigate dynamically.

- [ ] Task 4: Document fallback
  - [ ] 4.1: Update `NOTES.md` to document: `USE_MOCK_DATA=true npm run build` uses mock fixture; no env var (or `USE_MOCK_DATA=false`) uses real Sheets data
  - [ ] 4.2: `events.mock.js` remains in repo indefinitely — it's the unit test data source and the offline development fallback

- [ ] Task 5: Confirm all tests pass
  - [ ] 5.1: `npm test` (full Vitest + Playwright suite) must pass
  - [ ] 5.2: This is the acceptance gate — do not mark complete if any test fails

## Dev Notes

### The Data Swap is the Integration Gate

This story is the integration point between the mock-fixture world (Epics 1–4) and the real-data world. Every prior E2E test was written assuming mock data. Running the full suite against real data reveals any assumptions that don't hold.

### Test Adjustments vs Implementation Fixes

Some test failures here indicate test brittleness (hardcoded values that don't apply to real data) — fix the test. Some failures indicate implementation bugs (data not being passed correctly) — fix the implementation. Distinguish between the two before making changes.

### CI Must Use Real Data

After this story is complete, the GitHub Actions workflow (Epic 6) must use the real `events.js` (with the `GOOGLE_SERVICE_ACCOUNT_JSON` secret). The `USE_MOCK_DATA` env var should NOT be set in CI.

### `events.mock.js` Stays in Repo

Per the AC and the architecture: `events.mock.js` is a permanent repo artifact. It:
1. Provides the data for all unit tests (`tests/unit/*.test.js`)
2. Enables local development without Google credentials
3. Serves as documentation of the canonical event shape

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

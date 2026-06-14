---
story_key: 5-1-data-transformation-unit-tests
status: done
baseline_commit: 121d3b2f3a2e4b1c8d9e0f1a2b3c4d5e6f7a8b9c
---

# Story 5.1: Data Transformation Unit Tests (Failing Tests First)

## Story

As a developer,
I want failing Vitest unit tests for all data transformation functions written before any implementation,
So that `events.js` is built to satisfy explicit, runnable contracts rather than implicit assumptions.

## Acceptance Criteria

**Given** `tests/unit/events-parser.test.js`
**When** `npx vitest run` is executed
**Then** all tests FAIL (no `events.js` implementation exists yet)

**And** the test file covers row parsing, null field handling, and missing required field validation with console.warn

**Given** `tests/unit/slug-generator.test.js`
**When** run
**Then** all tests FAIL and cover slug generation and collision handling

**Given** `tests/unit/date-classifier.test.js`
**When** run
**Then** all tests FAIL and cover today/upcoming/past classification

## Tasks / Subtasks

- [x] Task 1: Create `tests/unit/events-parser.test.js`
  - [x] 1.1: Import `describe`, `it`, `expect`, `vi` from `vitest`
  - [x] 1.2: Import the (not-yet-existing) parser: `import { parseRow } from '../../_data/events-parser.js'`
  - [x] 1.3: Test: complete valid row with all fields → returns EventObject with correct shape
  - [x] 1.4: Test: `endTime` empty → `endTime: null`
  - [x] 1.5: Test: `description` empty → `description: null`
  - [x] 1.6: Test: `sourceUrl` empty → `sourceUrl: null`
  - [x] 1.7: Test: missing `name` → returns null (row skipped)
  - [x] 1.8: Test: missing `date` → returns null
  - [x] 1.9: Test: missing `startTime` → returns null
  - [x] 1.10: Test: missing `venueName` → returns null
  - [x] 1.11: Test: missing `cost` → returns null
  - [x] 1.12: Test: missing `eventType` → returns null
  - [x] 1.13: Test: skipped row calls `console.warn` with row index and missing field name

- [x] Task 2: Create `tests/unit/slug-generator.test.js`
  - [x] 2.1: Import `generateSlug`, `generateUniqueSlug` from `../../_data/slug-generator.js`
  - [x] 2.2: Test: "Tulsa Swing Social" + "2026-06-20" → `"tulsa-swing-social-2026-06-20"`
  - [x] 2.3: Test: name with spaces → hyphens
  - [x] 2.4: Test: name with apostrophe → apostrophe stripped
  - [x] 2.5: Test: name with special chars (`#`, `&`, `!`) → stripped/replaced
  - [x] 2.6: Test: duplicate slug → first returns base, second returns `{slug}-2`, third returns `{slug}-3`

- [x] Task 3: Create `tests/unit/date-classifier.test.js`
  - [x] 3.1: Import `classifyDate` from `../../_data/date-classifier.js`
  - [x] 3.2: Setup: `todayStr`, `yesterdayStr`, `tomorrowStr`, `lastMonthStr` as ISO strings
  - [x] 3.3: Test: today → `{ isToday: true, isPast: false }`
  - [x] 3.4: Test: tomorrow → `{ isToday: false, isPast: false }`
  - [x] 3.5: Test: yesterday → `{ isPast: true, isToday: false }`
  - [x] 3.6: Test: one month ago → `{ isPast: true, isToday: false }`

- [x] Task 4: Confirm all tests FAIL
  - [x] 4.1: `npx vitest run` — all 3 files fail with `Cannot find module` ✓
  - [x] 4.2: events-parser.js, slug-generator.js, date-classifier.js all missing ✓
  - [x] 4.3: Failures documented below

## Dev Notes

### Module Structure for Epic 5

The real `_data/events.js` will call three separate modules:
- `_data/events-parser.js` — exports `parseRow(rawRowArray, rowIndex) → EventObject | null`
- `_data/slug-generator.js` — exports `generateSlug(name, date) → string` and `generateUniqueSlug(name, date, usedSlugs) → string`
- `_data/date-classifier.js` — exports `classifyDate(dateStr) → { isToday, isPast }`

This separation makes the functions independently testable with Vitest (pure functions with no Eleventy dependency).

### Row Shape from Google Sheets

Sheets API returns rows as arrays of strings. The column order for the row array:
`[name, date, startTime, endTime, venueName, venueAddress, cost, eventType, fitSignals, description, contactEmail, sourceUrl, isRecurring]`

The `fitSignals` column is comma-separated within the cell: "Beginner-friendly,Partner-welcome".

### Date Comparison in `date-classifier.js`

Use date-only comparison (strip time component) to avoid timezone edge cases:
```js
const todayStr = new Date().toISOString().split('T')[0];
const isToday = dateStr === todayStr;
const isPast = dateStr < todayStr;
```

This works because ISO date strings sort lexicographically.

### `console.warn` Spy

Vitest's `vi.spyOn` works like Jest's `jest.spyOn`. Always call `mockRestore()` in cleanup to avoid contaminating subsequent tests.

## Dev Agent Record

### Implementation Plan

Created three unit test files following TDD — all failing before implementation, which is correct.

### Debug Log

- events-parser.test.js: FAIL — Cannot find module '../../_data/events-parser.js' ✓
- slug-generator.test.js: FAIL — Cannot find module '../../_data/slug-generator.js' ✓
- date-classifier.test.js: FAIL — Cannot find module '../../_data/date-classifier.js' ✓
- 3 test files failed (3), 0 tests run — expected

### Completion Notes

All three spec files created. Tests fail with correct "Cannot find module" errors — no implementation yet. TDD contract set for Story 5.2.

## File List

- tests/unit/events-parser.test.js (new)
- tests/unit/slug-generator.test.js (new)
- tests/unit/date-classifier.test.js (new)

## Change Log

- 2026-06-14: Created failing unit test files for events-parser, slug-generator, date-classifier (Story 5.1)

## Status

done

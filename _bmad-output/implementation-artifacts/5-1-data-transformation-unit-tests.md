---
story_key: 5-1-data-transformation-unit-tests
status: not-started
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

- [ ] Task 1: Create `tests/unit/events-parser.test.js`
  - [ ] 1.1: Import `describe`, `it`, `expect`, `vi` from `vitest`
  - [ ] 1.2: Import the (not-yet-existing) parser: `import { parseRow } from '../../_data/events-parser.js'`
  - [ ] 1.3: Test: complete valid row with all fields → returns EventObject with correct shape
    ```js
    it('parses a complete valid row into canonical event shape', () => {
      const row = ['Tulsa Swing Social', '2026-06-20', '20:00', '23:00', 'Cain\'s Ballroom', '423 N Main St', 'Free', 'Social Dancing', 'Beginner-friendly', 'Good description', 'contact@example.com', 'https://example.com', 'true'];
      const result = parseRow(row, 0);
      expect(result.name).toBe('Tulsa Swing Social');
      expect(result.cost).toBe('Free');
      expect(result.isRecurring).toBe(true);
    });
    ```
  - [ ] 1.4: Test: `endTime` empty → `endTime: null`
  - [ ] 1.5: Test: `description` empty → `description: null`
  - [ ] 1.6: Test: `sourceUrl` empty → `sourceUrl: null`
  - [ ] 1.7: Test: missing `name` → returns null (row skipped)
  - [ ] 1.8: Test: missing `date` → returns null
  - [ ] 1.9: Test: missing `startTime` → returns null
  - [ ] 1.10: Test: missing `venueName` → returns null
  - [ ] 1.11: Test: missing `cost` → returns null
  - [ ] 1.12: Test: missing `eventType` → returns null
  - [ ] 1.13: Test: skipped row (missing required field) calls `console.warn` with row index and missing field name:
    ```js
    it('warns and returns null for missing name', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = parseRow(['', '2026-06-20', '20:00', null, 'Venue', 'Addr', 'Free', 'Social Dancing'], 5);
      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('row 5'), expect.stringContaining('name'));
      warnSpy.mockRestore();
    });
    ```

- [ ] Task 2: Create `tests/unit/slug-generator.test.js`
  - [ ] 2.1: Import: `import { generateSlug, generateUniqueSlug } from '../../_data/slug-generator.js'`
  - [ ] 2.2: Test: "Tulsa Swing Social" + "2026-06-20" → `"tulsa-swing-social-2026-06-20"`
  - [ ] 2.3: Test: name with spaces → hyphens
  - [ ] 2.4: Test: name with apostrophe ("Jason's WCS Social") → apostrophe stripped
  - [ ] 2.5: Test: name with special chars (`#`, `&`, `!`) → stripped or replaced with hyphen
  - [ ] 2.6: Test: duplicate slug → first call returns base slug, second call returns `{slug}-2`
    ```js
    it('appends -2 for collision', () => {
      const usedSlugs = new Set();
      const first = generateUniqueSlug('Swing Social', '2026-06-20', usedSlugs);
      usedSlugs.add(first);
      const second = generateUniqueSlug('Swing Social', '2026-06-20', usedSlugs);
      expect(first).toBe('swing-social-2026-06-20');
      expect(second).toBe('swing-social-2026-06-20-2');
    });
    ```

- [ ] Task 3: Create `tests/unit/date-classifier.test.js`
  - [ ] 3.1: Import: `import { classifyDate } from '../../_data/date-classifier.js'`
  - [ ] 3.2: Setup: capture `today`, `yesterday`, `tomorrow`, `lastMonth` as ISO date strings
  - [ ] 3.3: Test: today's date → `{ isToday: true, isPast: false }`
  - [ ] 3.4: Test: tomorrow's date → `{ isToday: false, isPast: false }`
  - [ ] 3.5: Test: yesterday's date → `{ isPast: true, isToday: false }`
  - [ ] 3.6: Test: one month ago → `{ isPast: true, isToday: false }`

- [ ] Task 4: Confirm all tests FAIL
  - [ ] 4.1: Run `npx vitest run` and confirm all 3 test files fail (the imported modules don't exist yet)
  - [ ] 4.2: Expected failure: `Cannot resolve module '../../_data/events-parser.js'` etc.
  - [ ] 4.3: Document failures in Dev Agent Record

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

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

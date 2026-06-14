---
story_key: 1-2-event-data-model-and-mock-fixture
status: ready-for-dev
baseline_commit: 355327e2f3998815bad2892829915ac3f40feda0
---

# Story 1.2: Event Data Model and Mock Fixture

## Story

As a developer agent working on any epic,
I want a documented event data model and a mock fixture with representative data covering all edge cases,
So that I can build and test templates without the real Sheets API.

## Acceptance Criteria

**Given** `_data/events.mock.js`
**When** created
**Then** it exports an array of event objects matching the canonical shape (see Dev Notes)

**And** the fixture covers all required cases:
- At least one event of each type (Social Dancing, Group Lesson, Workshop, Competition, Convention)
- At least one event with `isToday: true`, one upcoming (`isToday: false, isPast: false`), one past (`isPast: true`)
- At least one recurring event (`isRecurring: true`)
- Events with `endTime: null`, `description: null`, `sourceUrl: null`
- At least one event with multiple fit signals
- At least two events on the same day (to test sort order)

**Given** `.eleventy.js`
**When** the build runs
**Then** `collections.todayEvents`, `collections.upcomingEvents`, `collections.pastEvents`, and `collections.events` are all available in templates

**And** a JSDoc `@typedef` for the event shape is present in `_data/events.mock.js`

## Tasks / Subtasks

### Review Findings

- [x] [Review][Patch] `tests/fixtures/mock-events.js:getEventByType` — ReferenceError: `mockEvents` is re-exported but not a local binding; `.find()` call will throw at runtime [tests/fixtures/mock-events.js:4]
- [x] [Review][Patch] `fmt` uses `.toISOString()` (UTC) — `todayStr` resolves to tomorrow after ~6pm CST; use local date parts (`getFullYear/getMonth/getDate`) instead [_data/events.mock.js:2]
- [x] [Review][Patch] `isToday`/`isPast` hardcoded booleans — spec says "computed at build time"; compute as `date === todayStr` / `date < todayStr` via a helper [_data/events.mock.js]
- [x] [Review][Defer] DST breaks `+86400000` arithmetic — acceptable risk for mock data; address if real data pipeline uses same pattern [_data/events.mock.js] — deferred, pre-existing
- [x] [Review][Defer] `endTime: null` render-path coverage — belongs to story 2-2 (event card template) [_data/events.mock.js] — deferred, pre-existing

- [x] Task 1: Create `_data/events.mock.js`
  - [x] 1.1: At the top of the file, compute dynamic date strings relative to today so the fixture stays valid over time:
    ```js
    const today = new Date();
    const fmt = d => d.toISOString().split('T')[0];
    const todayStr = fmt(today);
    const tomorrowStr = fmt(new Date(today.getTime() + 86400000));
    const nextWeekStr = fmt(new Date(today.getTime() + 7 * 86400000));
    const nextWeek2Str = fmt(new Date(today.getTime() + 8 * 86400000));
    const lastWeekStr = fmt(new Date(today.getTime() - 7 * 86400000));
    ```
  - [x] 1.2: Write JSDoc `@typedef EventObject` with every field from the canonical shape (see Dev Notes)
  - [x] 1.3: Create 9–10 mock events covering all required cases:
    - Social Dancing, recurring, isToday: true (the Friday night social)
    - Group Lesson, isToday: true, same day as social (tests sort order)
    - Workshop, upcoming (nextWeekStr), multiple fit signals
    - Competition, upcoming (nextWeek2Str), with sourceUrl
    - Convention, upcoming (nextWeek2Str), with null description
    - A second Social Dancing on nextWeekStr (different startTime, tests same-day sort)
    - One past event (lastWeekStr, isPast: true)
    - Ensure one event with endTime: null, one with sourceUrl: null, one with description: null
  - [x] 1.4: Export the array as `export default`

- [x] Task 2: Configure Eleventy collections in `.eleventy.js`
  - [x] 2.1: Add `eleventyConfig.addCollection('events', col => getEvents(col))` — all events sorted by date ASC, then startTime ASC
  - [x] 2.2: Add `eleventyConfig.addCollection('todayEvents', col => getEvents(col).filter(e => e.isToday))` — sorted by startTime ASC
  - [x] 2.3: Add `eleventyConfig.addCollection('upcomingEvents', col => getEvents(col).filter(e => !e.isPast))` — today + future, sorted date+startTime ASC
  - [x] 2.4: Add `eleventyConfig.addCollection('pastEvents', col => getEvents(col).filter(e => e.isPast).reverse())` — sorted date DESC
  - [x] 2.5: The `getEvents` helper reads from `_data/events.mock.js` — use `eleventyConfig.addCollection` callback that accesses the `events` data file via `collectionApi.getAll()[0].data.events` or by directly importing the module

- [x] Task 3: Verify collections work
  - [x] 3.1: Run `npm run build` and confirm no errors
  - [x] 3.2: Temporarily add a debug dump to `index.njk` to confirm a collection is non-empty (remove after verification)

## Dev Notes

### Canonical Event Shape

```js
/**
 * @typedef {Object} EventObject
 * @property {string} id             - slug: {kebab-event-name}-{YYYY-MM-DD}
 * @property {string} name           - event name (sentence case)
 * @property {string} date           - ISO 8601 date string: "2026-06-13"
 * @property {string} startTime      - "HH:MM" 24-hour (e.g. "20:00")
 * @property {string|null} endTime   - "HH:MM" or null
 * @property {string} venueName
 * @property {string} venueAddress
 * @property {string} cost           - "$15" | "$12.50" | "Free"
 * @property {'Social Dancing'|'Group Lesson'|'Workshop'|'Competition'|'Convention'} eventType
 * @property {string[]} fitSignals   - subset of: ["Beginner-friendly","Partner-welcome","Skill level target","Instructor present","Special guest present"]
 * @property {string|null} description
 * @property {string|null} sourceUrl
 * @property {string} contactEmail   - not displayed publicly
 * @property {boolean} isRecurring
 * @property {boolean} isToday       - computed at build time
 * @property {boolean} isPast        - computed at build time
 */
```

### Eleventy Collection Strategy

Eleventy's custom collections (`addCollection`) run at build time. The correct pattern for accessing a `_data/*.js` data file within a collection callback is to look for it in the data cascade. Simplest approach: import `events.mock.js` directly in `.eleventy.js` (since both are ESM):

```js
import events from './_data/events.mock.js';

export default function(eleventyConfig) {
  eleventyConfig.addCollection('todayEvents', () =>
    events.filter(e => e.isToday).sort((a,b) => a.startTime.localeCompare(b.startTime))
  );
  // ... other collections
}
```

This keeps it simple and avoids walking the collection API for a plain data array. In Epic 5, `events.mock.js` will be swapped for `events.js`.

### ID / Slug Format

`id` = `{kebab-event-name}-{YYYY-MM-DD}`
Example: `"tulsa-swing-social-2026-06-13"`

Generate the id in the mock file itself, consistent with what `events.js` will produce in Epic 5.

### Fit Signal Canonical Values (for data-* attributes in later epics)

| Display | Kebab |
|---|---|
| Beginner-friendly | beginner-friendly |
| Partner-welcome | partner-welcome |
| Skill level target | skill-level-target |
| Instructor present | instructor-present |
| Special guest present | special-guest-present |

Store fit signals in the canonical display form in the data model; templates convert to kebab for `data-*` attributes.

### Architecture Reference

See `_bmad-output/planning-artifacts/architecture.md` → "Data Architecture" section for the full event model and rationale.

## Dev Agent Record

### Implementation Plan

Created `_data/events.mock.js` with dynamic date computation (relative to build time) so the fixture never goes stale. Used ESM direct import in `.eleventy.js` rather than the collection-API traversal approach — simpler and matches the Dev Notes recommendation. The `byDateAndTime` comparator is shared across all four collections.

### Debug Log

Verified collections via inline Nunjucks comments in `index.njk` during build: todayEvents=2, upcomingEvents=7, pastEvents=2. Debug comments removed before completion.

### Completion Notes

9 mock events created covering all required cases: all 5 event types, isToday×2, isPast×2, isRecurring×2, endTime:null×1, sourceUrl:null×1, description:null×1, multiple fit signals×1, two events same day (today, sorted by startTime). Four Eleventy collections registered (`events`, `todayEvents`, `upcomingEvents`, `pastEvents`). Build exits cleanly, exit code 0.

## File List

- `_data/events.mock.js` (created)
- `.eleventy.js` (modified — added ESM import of events.mock.js and four collections)

## Change Log

- 2026-06-13: Created `_data/events.mock.js` with 9 mock events (all types, all edge cases, dynamic dates). Added four Eleventy collections to `.eleventy.js`. Build verified clean (exit code 0).

## Status

done

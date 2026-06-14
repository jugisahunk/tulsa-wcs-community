# Deferred Work

## Deferred from: code review of 1-3-base-layout-css-foundation-naming-conventions (2026-06-13)

- No per-page `{% block title %}` in `_includes/base.njk` — all pages share the same `<title>`. Add a title block when implementing Epic 4 SEO/OG tags (story 4.2).

## Deferred from: code review of 1-2-event-data-model-and-mock-fixture (2026-06-13)

- DST breaks `+86400000` arithmetic in `_data/events.mock.js` date helpers — acceptable risk for mock data; revisit if real data pipeline uses same computation.
- `endTime: null` render-path coverage — fixture covers the shape but rendering behavior not tested; address in story 2-2 (event card template).


## Deferred from: code review of 1-1-eleventy-project-initialization (2026-06-13)

- `isToday`/`isPast` are static booleans in mock data — stale after build day. Address in story 1-2 data model (compute flags dynamically from event date vs current date).
- Filter null guards missing on `formatDate`, `formatTime`, `byDateAndTime`, `eventTypeToKebab`, `fitSignalToKebab` in `.eleventy.js` — acceptable with controlled mock data; address when real data pipeline arrives (Epic 5).
- `package.json` npm-init artifacts: `"main":"index.js"` and `"directories":{"doc":"docs"}` are irrelevant for an Eleventy site — cosmetic cleanup, no functional impact.

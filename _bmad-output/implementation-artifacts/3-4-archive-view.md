---
story_key: 3-4-archive-view
status: ready-for-dev
baseline_commit: 2da66eaffe875a5ead2721f48049e1852825c433
---

# Story 3.4: Archive View

## Story

As a community dancer or organizer,
I want to access past events through an Archive View,
So that I can reference events that have already happened.

## Acceptance Criteria

**Given** `archive.njk` is implemented
**When** `npx playwright test archive` is run
**Then** ALL Archive tests written in Story 3.1 PASS (green)

**Given** `archive.njk`
**When** rendered
**Then** it lists all events where `isPast: true`, sorted by date descending (most recent first)

**And** it reuses `event-card.njk`

**And** the ARCHIVE tab is present in the bottom tab bar (defined in Story 1.5) — no Archive link exists in the site header

## Tasks / Subtasks

- [x] Task 1: Create `archive.njk`
  - [x] 1.1: Front matter: `permalink: /archive/index.html`
  - [x] 1.2: `{% extends "base.njk" %}`
  - [x] 1.3: `{% block content %}` with `<h1 class="archive-heading">Archive</h1>`
  - [x] 1.4: Conditional event list (using `collections.pastEvents`) or empty state
  - [x] 1.5: Close `{% endblock %}`

- [x] Task 2: Add archive heading styles to `assets/css/browse-filters.css`
  - [x] 2.1: `.archive-heading` — Josefin Sans, text-transform uppercase, primary color
  - [x] 2.2: `.archive-empty` — Josefin Sans, uppercase, center, muted color
  - [x] 2.3: `.event-list--archive` — no extra styles needed (same layout as `.event-list`)

- [x] Task 3: Run archive tests and confirm all PASS
  - [x] 3.1: All 4 archive tests green across Chromium, Firefox, WebKit
  - [x] 3.2: Full suite 129/129 passed — no regressions
  - [x] 3.3: Build verified — archive page exists and renders past events only

## Dev Notes

### `collections.pastEvents` Already Sorted Date DESC

Defined in Story 1.2's `.eleventy.js`: `events.filter(e => e.isPast)` sorted by date DESC (most recent past event first). Available in Nunjucks as `collections.pastEvents`. No additional sorting needed in the template.

### Current Fixture: 2 Past Events

With the current mock fixture:
- "WCS fundamentals class" (Group Lesson, last week)
- "Tulsa swing social" (Social Dancing, last week)

Both have `isPast: true` in the fixture. The archive test in Story 3.1 asserts their presence. The `aria-current` test is what requires the archive page to actually exist and serve at `/archive/`.

### `event-card.njk` Variable Scope

Use the same pattern as `index.njk` and `browse.njk`: loop variable must be named `event`:
```njk
{% for event in collections.pastEvents %}
  {% include "event-card.njk" %}
{% endfor %}
```

The card template uses `{{ event.name }}`, `{{ event.startTime | formatTime }}`, etc. The loop variable `event` is automatically in scope for the include — no extra wiring needed.

### Diamond Dividers Between Cards

Use `{% if not loop.last %}..diamond-divider..{% endif %}` between archive cards, matching the pattern in `index.njk` and `browse.njk`. The diamond divider CSS already exists in `event-card.css` from Epic 2.

### Archive Is Not Promoted

Per EXPERIENCE.md: "accessible via the tab bar (ARCHIVE tab) but not promoted." Do NOT add:
- Any link to `/archive/` in the page body
- A "Browse past events" link in any other view
- Any reference to Archive in the site header

The tab bar in `base.njk` is the only entry point. This is already implemented in `base.njk`:
```njk
<a href="/archive/" class="tab-bar__tab" {% if page.url == "/archive/" %}aria-current="page"{% endif %}>archive</a>
```

### `aria-current="page"` Comes Free

`base.njk` already has `{% if page.url == "/archive/" %}aria-current="page"{% endif %}` on the ARCHIVE tab. No changes needed to `base.njk`. Once `archive.njk` outputs at `/archive/`, the tab bar handles `aria-current` automatically. The Story 3.1 test for this will pass as soon as the archive page exists.

### No Filter Controls

The Archive View has no filter controls. It is a simple chronological list. Do NOT include `filter-controls.njk` or load `browse-filter.js` on this page.

### Locked Empty State String

EXPERIENCE.md locked string: `NO PAST EVENTS YET.` — render as `no past events yet.` in HTML and let CSS uppercase it. This is consistent with other empty/zero-results strings across the site. CSS class `.archive-empty { text-transform: uppercase }`.

### `permalink` Front Matter

Eleventy outputs `archive.njk` at `_site/archive/index.html` by default (without front matter) — but explicitly setting `permalink: /archive/index.html` makes this explicit and avoids any ambiguity. The tab bar's `page.url == "/archive/"` check relies on Eleventy setting `page.url` to `/archive/` (with trailing slash), which it does for directory index pages.

### Previous Story Intelligence (from 2-3)

- **Strict-mode awareness**: the ARCHIVE tab link in `base.njk` (`href="/archive/"`) is the only `a[href="/archive/"]` element on the page (no content-area links). Story 3.1's test can use `nav[aria-label="Main navigation"] a[href="/archive/"]` to be safe.
- **`eleventyExcludeFromCollections`**: not needed for `archive.njk` — it is a real content page that should appear in collections. This flag was used only for the `tonight-empty.njk` test fixture.
- **Diamond dividers**: pattern confirmed working from Epic 2 (index.njk); `diamond-divider` styles are already in `event-card.css`.

## Dev Agent Record

### Implementation Plan

Simple template using `collections.pastEvents` (already sorted DESC by .eleventy.js). Archive heading and empty styles added to browse-filters.css (already global in base.njk). No filter controls, no scripts block — archive is a read-only list.

### Debug Log

No issues. `aria-current="page"` on the ARCHIVE tab works automatically from base.njk's existing `{% if page.url == "/archive/" %}` check — no base.njk changes needed.

### Completion Notes

archive.njk created with permalink, conditional past-events list with diamond dividers, and empty state. All 4 archive E2E tests green across all browsers.

## File List

- archive.njk (new)
- assets/css/browse-filters.css (modified — add archive-heading, archive-empty styles)

## Change Log

- 2026-06-13: Story created and enriched for dev (Story 3.4)
- 2026-06-14: Implemented — archive.njk created, archive styles added to browse-filters.css

## Status

review

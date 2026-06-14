---
story_key: 3-4-archive-view
status: not-started
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

- [ ] Task 1: Create `archive.njk`
  - [ ] 1.1: Front matter: `layout: base.njk`, `title: Archive`
  - [ ] 1.2: Page heading: `<h1 class="archive-heading">Archive</h1>` (CSS uppercases)
  - [ ] 1.3: Iterate `collections.pastEvents` (already sorted date DESC per Story 1.2 collection):
    ```njk
    {% if collections.pastEvents.length > 0 %}
      <section class="event-list event-list--archive" aria-label="Past events">
        {% for event in collections.pastEvents %}
          {% include "event-card.njk" %}
        {% endfor %}
      </section>
    {% else %}
      <p class="archive-empty">No past events yet.</p>
    {% endif %}
    ```
  - [ ] 1.4: Zero-results state: CSS uppercases "No past events yet." — use locked string "NO PAST EVENTS YET." (CSS handles uppercasing; source is sentence case)

- [ ] Task 2: Verify ARCHIVE tab `aria-current` in tab bar
  - [ ] 2.1: In `base.njk`, the tab bar already has `{% if page.url == "/archive/" %}aria-current="page"{% endif %}` (from Story 1.5)
  - [ ] 2.2: Confirm Eleventy generates `_site/archive/index.html` at URL `/archive/` — the tab bar's comparison `page.url == "/archive/"` must match exactly

- [ ] Task 3: Run archive tests and confirm all PASS
  - [ ] 3.1: Run `npx playwright test archive`
  - [ ] 3.2: Confirm: past events visible, today/upcoming events NOT visible, ARCHIVE tab has `aria-current`
  - [ ] 3.3: Run full suite: `npm test`

## Dev Notes

### `collections.pastEvents`

Defined in Story 1.2: `events.filter(e => e.isPast)` sorted date DESC (most recent past event first). Available as `collections.pastEvents` in Nunjucks.

### Archive is Not Promoted

Per EXPERIENCE.md: Archive is accessible via the tab bar (ARCHIVE tab) but not promoted. Do NOT add any homepage or Browse page links to the archive. The tab bar is the only entry point.

### No Filter Controls on Archive

The Archive View does not have filter controls. It is a simple list of past events, sorted by date descending. Do not add the `filter-controls.njk` include to this page.

### Reusing `event-card.njk`

The `data-is-past="true"` attribute on past event cards may be styled differently (e.g., reduced opacity or a "Past" label) in a future enhancement. For MVP, reuse the card as-is.

### Permalink for Archive Page

Eleventy will output `archive.njk` at `_site/archive/index.html` (URL: `/archive/`). This matches the tab bar href. If Eleventy's output doesn't produce a trailing slash, adjust the permalink via front matter:
```yaml
permalink: /archive/index.html
```

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

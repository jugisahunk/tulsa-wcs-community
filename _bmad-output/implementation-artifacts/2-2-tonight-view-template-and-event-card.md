---
story_key: 2-2-tonight-view-template-and-event-card
status: not-started
---

# Story 2.2: Tonight View Template and Event Card

## Story

As a community dancer,
I want the home page to show tonight's events sorted by start time with all required card fields,
So that I can immediately see what is happening and decide whether to go out.

## Acceptance Criteria

**Given** `index.njk` and `_includes/event-card.njk` are implemented
**When** `npx playwright test tonight-view mobile-layout` is run
**Then** all tests written in Story 2.1 PASS (green)

**Given** `index.njk`
**When** rendered with mock fixture events
**Then** it extends `base.njk` and renders only events where `isToday: true`, sorted by `startTime` ascending

**And** each event is rendered via `event-card.njk` with the correct `data-*` attributes:
- `data-event-type="{canonical-kebab-value}"`
- `data-fit-signals="{comma-separated-kebab-values}"`
- `data-event-date="{YYYY-MM-DD}"`
- `data-is-today="{true|false}"`
- `data-is-past="{true|false}"`

**And** the hero renders as a single `<h1>` with no subheadline, no hero image, no CTA

**And** the WCS intro paragraph (FR-17) appears below the hero

**And** the five event type placeholder images exist in `assets/images/event-types/` and are used by event cards

**And** recurring events show a "RECURRING" badge (FR-20)

**Given** the Tonight View at 320px viewport
**When** rendered
**Then** no horizontal scrolling occurs and all card content is readable

## Tasks / Subtasks

- [ ] Task 1: Create five placeholder event type images in `assets/images/event-types/`
  - [ ] 1.1: Create minimal placeholder images (1×1px PNG or simple SVG) for: `social-dancing.jpg`, `group-lesson.jpg`, `workshop.jpg`, `competition.jpg`, `convention.jpg`
  - [ ] 1.2: Configure Eleventy passthrough copy in `.eleventy.js`: `eleventyConfig.addPassthroughCopy('assets')`
  - [ ] 1.3: Verify images are copied to `_site/assets/images/event-types/` after build

- [ ] Task 2: Create `_includes/event-card.njk`
  - [ ] 2.1: Outer wrapper with all required `data-*` attributes:
    ```njk
    <article class="event-card"
      data-event-type="{{ event.eventType | eventTypeToKebab }}"
      data-fit-signals="{{ event.fitSignals | map('fitSignalToKebab') | join(',') }}"
      data-event-date="{{ event.date }}"
      data-is-today="{{ event.isToday }}"
      data-is-past="{{ event.isPast }}">
    ```
  - [ ] 2.2: Link wrapping entire card to `/events/{{ event.id }}/`
  - [ ] 2.3: Event type badge at top-right: `<span class="event-type-badge">{{ event.eventType }}</span>`
  - [ ] 2.4: Event image: `<img src="/assets/images/event-types/{{ event.eventType | eventTypeToKebab }}.jpg" alt="{{ event.eventType }}">`
  - [ ] 2.5: Recurring badge (conditional): `{% if event.isRecurring %}<span class="recurring-badge">recurring</span>{% endif %}` (CSS uppercases)
  - [ ] 2.6: Card content area:
    - `<h2 class="event-card__title">{{ event.name }}</h2>`
    - Metadata in order: When → Where → Cost:
      - `<time class="event-card__time">{{ event.startTime | formatTime }}</time>`
      - `<span class="event-card__venue">{{ event.venueName }}</span>`
      - `<span class="event-card__cost">{{ event.cost }}</span>`
  - [ ] 2.7: Fit signal chips (if any): `{% for signal in event.fitSignals %}<span class="fit-signal-chip">{{ signal }}</span>{% endfor %}`

- [ ] Task 3: Implement `index.njk` (Tonight View)
  - [ ] 3.1: Front matter: `layout: base.njk` (or `{% extends "base.njk" %}`)
  - [ ] 3.2: Hero block:
    ```njk
    <div class="hero">
      <span class="hero__rule" aria-hidden="true"></span>
      <h1 class="hero__title">West Coast Swing in Tulsa</h1>
      <span class="hero__rule" aria-hidden="true"></span>
    </div>
    ```
    (Gold double-rule ornaments are decorative CSS pseudo-elements; see DESIGN.md)
  - [ ] 3.3: WCS intro paragraph (FR-17) below hero:
    ```njk
    <p class="wcs-intro">West Coast Swing is a partner dance known for its improvisational style and connection to contemporary music. Tulsa has a growing scene with socials, lessons, and workshops happening regularly.</p>
    ```
    (Exact copy TBD — write something genuine and appropriate; it's not a locked string)
  - [ ] 3.4: Event list section:
    ```njk
    {% set todayEvents = collections.todayEvents %}
    {% if todayEvents.length > 0 %}
      <section class="event-list" aria-label="Tonight's events">
        {% for event in todayEvents %}
          {% set event = event %}
          {% include "event-card.njk" %}
        {% endfor %}
      </section>
    {% else %}
      {% include "empty-state.njk" %}
    {% endif %}
    ```
  - [ ] 3.5: Note: `empty-state.njk` is a stub at this point (created in Story 2.3); create a minimal placeholder if needed

- [ ] Task 4: Create `assets/css/event-card.css` and link in `base.njk`
  - [ ] 4.1: Card base styles: `background: var(--color-surface); border: 1px solid var(--color-surface-border); border-radius: 4px; padding: 16px 20px; position: relative;`
  - [ ] 4.2: No gap between cards (card-gap: 0 per DESIGN.md) — use border separators instead
  - [ ] 4.3: Event type badge: `border: 1px solid var(--color-gold-badge-border); border-radius: 3px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; padding: 2px 6px; color: var(--color-text-on-badge); position: absolute; top: 16px; right: 20px;`
  - [ ] 4.4: Recurring badge: `background: transparent; border: 1px solid var(--color-text-muted); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; border-radius: 3px; padding: 2px 6px;`
  - [ ] 4.5: Title: `font-family: var(--font-display); font-size: 18px; line-height: 1.3; margin: 0;`
  - [ ] 4.6: Time: `font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-text-muted);`
  - [ ] 4.7: Mobile-first: ensure no fixed widths that would cause overflow at 320px; use `max-width: 100%; overflow-wrap: break-word;` on title

- [ ] Task 5: Run Tonight View tests and confirm pass
  - [ ] 5.1: Run `npx playwright test tonight-view` — confirm all tests pass
  - [ ] 5.2: Run `npx playwright test mobile-layout` — confirm no horizontal overflow at 320px
  - [ ] 5.3: Run full test suite `npm test` to confirm no regressions

## Dev Notes

### Hero Design (DESIGN.md)

The hero has a single `<h1>` "West Coast Swing in Tulsa" flanked by gold double-rule ornaments. No subheadline, no hero image, no CTA button. The ornaments are `<span aria-hidden="true">` elements styled with CSS to show two stacked horizontal lines using `var(--color-gold-rule)`. From DESIGN.md:
- `deco-rule-gap: 8px` between the two lines in the ornament
- `deco-rule-margin: 12px` between ornament and h1 text
- `hero-padding-top: 40px`, `hero-padding-bottom: 24px`

### Nunjucks `include` Variable Scope

When using `{% include "event-card.njk" %}`, the included template inherits the parent's scope. If you're in a `{% for event in todayEvents %}` loop, `event` is available inside the include. Be consistent about the variable name — always use `event` (not `e` or `item`).

### Eleventy Collections vs Data Files

`collections.todayEvents` is set up in `.eleventy.js` (Story 1.2). In `index.njk`, access it via `collections.todayEvents`. The collection is pre-sorted by startTime, so no in-template sort is needed.

### Placeholder Images

The 5 images don't need to look good for Epic 1/2 — they just need to exist and be served. Options:
- Create 1×1 pixel transparent PNGs programmatically
- Use a public placeholder service URL in `<img src>` temporarily (not ideal for offline use)
- Use SVG data URIs
Simplest: create very small JPGs with ImageMagick or write minimal JPEG bytes manually.

### Event Type to Kebab for Image Path

Use the `eventTypeToKebab` filter (defined in Story 1.3) to map "Social Dancing" → "social-dancing" for the image filename.

### Architecture Reference

- `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/DESIGN.md` → card specs, hero specs, badge specs
- `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/EXPERIENCE.md` → locked strings, card metadata order (When → Where → Cost)
- `_bmad-output/planning-artifacts/architecture.md` → data-* attribute names, event type kebab values

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

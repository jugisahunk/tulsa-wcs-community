---
story_key: 2-2-tonight-view-template-and-event-card
status: ready-for-dev
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
- `data-event-type="{canonical-kebab-value}"` (e.g., `social-dancing`)
- `data-fit-signals="{comma-separated-kebab-values}"` (e.g., `beginner-friendly,partner-welcome`)
- `data-event-date="{YYYY-MM-DD}"`
- `data-is-today="{true|false}"`
- `data-is-past="{true|false}"`

**And** the hero renders as a single `<h1>` "West Coast Swing in Tulsa" with no subheadline, no hero image, no CTA — flanked above and below by double-rule gold ornaments, followed by a "TONIGHT" section label

**And** the WCS intro paragraph (FR-17) appears on the page (location: below hero or at bottom of page before footer)

**And** the five event type placeholder images exist in `assets/images/event-types/` (social-dancing.jpg, group-lesson.jpg, workshop.jpg, competition.jpg, convention.jpg) and are referenced by event cards

**And** recurring events show a `.recurring-badge` element (FR-20)

**Given** the Tonight View at 320px viewport
**When** rendered
**Then** no horizontal scrolling occurs and all card content is readable

## Tasks / Subtasks

- [ ] Task 1: Add `fitSignalsToKebab` filter to `.eleventy.js`
  - [ ] 1.1: Add filter that takes `string[]` and returns comma-separated kebab string
  - [ ] 1.2: Verify filter is exported and available in Nunjucks templates

- [ ] Task 2: Update `index.njk` with full Tonight View implementation
  - [ ] 2.1: Add hero block: 40px top padding, double-rule ornament, `<h1>`, double-rule ornament, "TONIGHT" section label
  - [ ] 2.2: Loop over `collections.todayEvents` (already sorted by startTime ASC in `.eleventy.js`)
  - [ ] 2.3: Include `event-card.njk` partial for each event with `event` variable in scope
  - [ ] 2.4: Add `.diamond-divider` between cards (not after last card) using `loop.last` check
  - [ ] 2.5: Add WCS intro paragraph with `.wcs-intro` class (see dev notes for copy)
  - [ ] 2.6: Preserve existing `{% block content %}` structure — do NOT change block names

- [ ] Task 3: Create `_includes/event-card.njk`
  - [ ] 3.1: Outer element is `<a class="event-card" href="/events/{{ event.id }}/">` — entire card is the tap target
  - [ ] 3.2: Add all `data-*` attributes: `data-event-type`, `data-fit-signals`, `data-event-date`, `data-is-today`, `data-is-past`
  - [ ] 3.3: Add `aria-label` with: event name, formatted date, formatted time, venue name
  - [ ] 3.4: Add `.event-type-badge` (top-right, using absolute/flex positioning)
  - [ ] 3.5: Add `<h2 class="event-card__title">{{ event.name }}</h2>` (Cinzel via CSS)
  - [ ] 3.6: Add `<p class="event-card__meta">` with time · venue · cost (dots are CSS-rendered or `·` character)
  - [ ] 3.7: Add `.event-card__chips` section with fit signal chips (`.fit-signal-chip` per signal)
  - [ ] 3.8: Conditionally render `.recurring-badge` if `event.isRecurring`
  - [ ] 3.9: Include event type image `<img src="/assets/images/event-types/{{ event.eventType | eventTypeToKebab }}.jpg" alt="{{ event.eventType }} event">`

- [ ] Task 4: Create `assets/css/event-card.css`
  - [ ] 4.1: `.event-card` — full-width block link, surface background, border, 4px radius, `padding: 16px 20px`, no underline, position relative
  - [ ] 4.2: `.event-card__title` — Cinzel 18px, weight 400, line-height 1.3, text-primary color
  - [ ] 4.3: `.event-card__meta` — Josefin Sans 13px ALL CAPS, letter-spacing 0.15em, text-muted color
  - [ ] 4.4: `.event-type-badge` — positioned top-right, gold badge border, 3px radius, transparent fill, Josefin Sans 10px ALL CAPS, letter-spacing 0.18em, padding 3px 8px
  - [ ] 4.5: `.fit-signal-chip` — surface-border border, 3px radius, transparent fill, Josefin Sans 10px ALL CAPS, 0.18em tracking, text-muted, padding 3px 8px
  - [ ] 4.6: `.recurring-badge` — `border: 1px solid rgba(240,238,234,0.15)`, same treatment as fit-signal-chip but distinct border
  - [ ] 4.7: `.event-card__chips` — flex wrap, gap, left-aligned
  - [ ] 4.8: `.diamond-divider` — centered, gold-rule color, 12px, padding-block 24px
  - [ ] 4.9: Desktop hover: `.event-card:hover { background: #1c1f23; }` — no shadow, no border change
  - [ ] 4.10: Hero block styles: `.hero` with padding-top 40px, `.double-rule-ornament` with 1px lines + 8px gap in gold-rule, `.hero__title` h1 at 32px mobile / 40px desktop
  - [ ] 4.11: Section label `.tonight-label` — Josefin Sans 10px ALL CAPS, 0.18–0.20em tracking, text-muted, centered
  - [ ] 4.12: `.wcs-intro` — body text (Josefin Sans 15px, normal case, 1.6 line-height)

- [ ] Task 5: Link `event-card.css` in `_includes/base.njk`
  - [ ] 5.1: Add `<link rel="stylesheet" href="/assets/css/event-card.css">` after `base.css` link

- [ ] Task 6: Create placeholder event type images
  - [ ] 6.1: Create 5 minimal placeholder images in `assets/images/event-types/`: `social-dancing.jpg`, `group-lesson.jpg`, `workshop.jpg`, `competition.jpg`, `convention.jpg`
  - [ ] 6.2: Images can be minimal solid-color JPEGs (see dev notes for approach)

- [ ] Task 7: Run tests and verify
  - [ ] 7.1: Run `npx playwright test tonight-view` — ALL tests must pass
  - [ ] 7.2: Run `npx playwright test mobile-layout` — ALL tests must pass
  - [ ] 7.3: Run `npx playwright test smoke` — ALL smoke tests must still pass
  - [ ] 7.4: Run `npx playwright test tonight-empty` — must still FAIL (Story 2.3 not done yet)
  - [ ] 7.5: Run `npm run build` — build must complete without errors

## Dev Notes

### Existing Infrastructure — Do Not Recreate

**Already in `.eleventy.js`:**
- `collections.todayEvents` — events where `isToday: true`, sorted by startTime ASC. Use this directly.
- `collections.upcomingEvents`, `collections.pastEvents`, `collections.events` — available for later epics
- Filters: `formatDate`, `formatTime`, `formatDateShort`, `eventTypeToKebab`, `fitSignalToKebab`
- `eleventyConfig.ignores.add("_bmad-output/**")` and `.claude/**` — already set

**Already in `base.njk`:**
- Full HTML skeleton with `{% block schema %}`, `{% block meta %}`, `{% block content %}`
- Tab bar nav (`<nav class="tab-bar" aria-label="Main navigation">`) with `aria-current` logic
- Header with site name
- Footer with attribution, Submit/Request links
- Google Fonts link (Cinzel 400, Josefin Sans 300)
- `base.css` link

**Already in `assets/css/base.css`:**
- All CSS custom properties (colors, fonts, spacing, layout)
- Body, heading defaults
- Tab bar styles (`.tab-bar`, `.tab-bar__tab`, `[aria-current="page"]`)
- `main.site-main` with `padding-bottom: calc(var(--tab-bar-height) + var(--space-md))`

**Current `index.njk`** (minimal stub to replace):
```njk
{% extends "base.njk" %}
{% block content %}
<h1>West Coast Swing in Tulsa</h1>
{% endblock %}
```

### New Eleventy Filter Required

Add `fitSignalsToKebab` to `.eleventy.js`:

```js
eleventyConfig.addFilter('fitSignalsToKebab', signals =>
  signals.map(s => s.toLowerCase().replace(/\s+/g, '-')).join(',')
);
```

Use in template: `data-fit-signals="{{ event.fitSignals | fitSignalsToKebab }}"`

Do NOT try to do this with a nested Nunjucks loop inside an attribute — it creates messy whitespace. The filter is cleaner.

Also update `NOTES.md` to correct the `data-fit-signals` entry: it should say **comma-separated**, not space-separated.

### `index.njk` Structure

```njk
{% extends "base.njk" %}
{% block content %}

<section class="hero">
  <div aria-hidden="true" class="double-rule-ornament">
    <div class="rule"></div>
    <div class="rule"></div>
  </div>
  <h1 class="hero__title">West Coast Swing in Tulsa</h1>
  <div aria-hidden="true" class="double-rule-ornament">
    <div class="rule"></div>
    <div class="rule"></div>
  </div>
  <p class="tonight-label">tonight</p>
</section>

{% if collections.todayEvents.length %}
  <div class="event-list">
    {% for event in collections.todayEvents %}
      {% include "event-card.njk" %}
      {% if not loop.last %}
        <div aria-hidden="true" class="diamond-divider">◆</div>
      {% endif %}
    {% endfor %}
  </div>
{% else %}
  {% include "empty-state.njk" %}
{% endif %}

<p class="wcs-intro">West Coast Swing is a partner dance born on the West Coast in the 1940s, known for its improvisational style and connection to contemporary music. Tulsa has a small but serious scene — weekly socials, workshops with national instructors, and a community that shows up for each other.</p>

{% endblock %}
```

**Important:** The `{% else %}` branch includes `empty-state.njk` which Story 2.3 creates. For this story, the else branch will never render (mock data always has today events). The branch still needs to be in the template so Story 2.3 makes `tonight-empty.spec.js` pass without touching `index.njk`.

### Event Card Nunjucks Include Pattern

In Nunjucks, variables set in the parent scope are available to `{% include %}`. Since the `for` loop sets `event`, the included partial can directly reference `{{ event.name }}` etc.

```njk
{% for event in collections.todayEvents %}
  {% include "event-card.njk" %}
{% endfor %}
```

The `event-card.njk` partial uses `event` variable directly — no need to pass explicitly.

### `event-card.njk` Aria Label

```njk
aria-label="{{ event.name }}, {{ event.date | formatDate }}, {{ event.startTime | formatTime }}, {{ event.venueName }}"
```

EXPERIENCE.md requires: event name, day+date, time, venue. This covers all four.

### Data Attributes

```njk
data-event-type="{{ event.eventType | eventTypeToKebab }}"
data-fit-signals="{{ event.fitSignals | fitSignalsToKebab }}"
data-event-date="{{ event.date }}"
data-is-today="{{ event.isToday }}"
data-is-past="{{ event.isPast }}"
```

`eventTypeToKebab` already exists in `.eleventy.js`. `fitSignalsToKebab` must be added (Task 1).

### Metadata Line Format

From DESIGN.md: "When → Where → Cost. Time comes first in the metadata line, then venue, then cost."

```njk
<p class="event-card__meta">{{ event.startTime | formatTime }} · {{ event.venueName }} · {{ event.cost }}</p>
```

`formatTime` converts `"20:00"` → `"8:00 PM"`. CSS applies `text-transform: uppercase`.

Cost from fixture is already formatted (`"$10"`, `"Free"`) — render as-is.

### Event Type Badge Positioning

The badge sits top-right within the card. Use `position: relative` on `.event-card` and `position: absolute; top: 16px; right: 20px` on `.event-type-badge`. The card content (title, meta) should have `padding-right` enough to not collide with the badge.

### Hero Block CSS

```css
.hero {
  padding-top: 40px;
  padding-bottom: 24px;
  text-align: center;
}

.double-rule-ornament {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-block: 12px;
}

.double-rule-ornament .rule {
  height: 1px;
  background: var(--color-gold-rule);
  border: none;
}

.hero__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 32px;
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: var(--color-text-primary);
  margin: 0;
}

@media (min-width: 640px) {
  .hero__title { font-size: 40px; }
}

.tonight-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.20em;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
}
```

### Placeholder Images

5 images required at `assets/images/event-types/`: `social-dancing.jpg`, `group-lesson.jpg`, `workshop.jpg`, `competition.jpg`, `convention.jpg`.

**Approach:** Create minimal 1×1 pixel solid-color JPEG files using a script or use a tool. Alternatively, use SVG files renamed with `.jpg` extension (browsers handle this fine). The simplest approach: write a small Node.js script in `scripts/generate-placeholder-images.js` that creates tiny JPEGs using a canvas or Buffer approach, OR create placeholder SVG content saved as `.jpg`.

If neither approach is feasible in the environment, create tiny placeholder files (even just empty files with the correct names) and verify the `<img>` renders without breaking the layout. The AC requires they "exist" — a 1-byte placeholder passes the AC. Make sure to add alt text.

If using SVGs masquerading as JPGs:
```html
<!-- This is fine for MVP placeholder purposes -->
<img src="/assets/images/event-types/social-dancing.jpg" alt="Social dancing event">
```

Browsers display by content type detection when the extension is wrong, so real images are better. A simple approach: use Eleventy's passthrough to copy a solid-color 200×200 JPEG template and rename it 5 times.

**Recommended simplest approach:** Create a `scripts/create-placeholder-images.js` script that writes minimal files. The key requirement is that the files exist at the correct paths and are valid images.

### Mobile Layout (320px)

The main guard is `padding: var(--space-md) var(--page-margin)` on `main.site-main` (already in `base.css`) which means side margins of 20px. Event cards will be `width: 100%` within this margin, so total card width at 320px = 320 - 40 = 280px. No explicit width needed on `.event-card` if it's `display: block`.

Key check: the `.event-type-badge` at top-right should not overflow. Use `word-break: break-word` on badge text if long badge text wraps.

### No Shadows — Design System Constraint

From DESIGN.md: "No drop shadows exist anywhere in this design system." Do NOT add `box-shadow` to cards, chips, badges, or any element. Depth is tonal (surface vs bg colors) and geometric (1px borders) only.

### ALL CAPS via CSS Only

Never write uppercase in HTML source. Use `text-transform: uppercase` in CSS for all label, badge, metadata, and navigation contexts. Screen readers read lowercase source text naturally.

### WCS Intro Paragraph Content

The content of the WCS intro paragraph is not locked in PRD (only its existence is required by FR-17). A confident, direct paragraph that answers "what is West Coast Swing and why does Tulsa have a scene?" The copy in the story template above is a suggestion — the dev agent can refine the wording to match the brand voice (confident, direct, unhurried).

Location: The EXPERIENCE.md says "likely below the hero or in the footer — TBD at implementation time." Place it at the bottom of `index.njk`, after the event list, before `{% endblock %}`. Document the chosen location in `NOTES.md`.

## Dev Agent Record

### Implementation Plan
(to be filled during implementation)

### Debug Log
(to be filled during implementation)

### Completion Notes
(to be filled during implementation)

## File List

(to be filled during implementation)

## Change Log

(to be filled during implementation)

## Status

ready-for-dev

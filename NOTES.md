# WCS Events — Naming Conventions Reference

Agent-readable reference for all naming conventions used across the project. When in doubt, consult this file first.

---

## URL Filter Param Names

| Param | Values |
|---|---|
| `?type=` | kebab event type (e.g. `social-dancing`) |
| `?signal=` | kebab fit signal (e.g. `beginner-friendly`) |
| `?date=` | ISO date string (e.g. `2026-06-14`) |

---

## `data-*` Attribute Names

| Attribute | Value format |
|---|---|
| `data-event-type` | kebab event type (e.g. `social-dancing`) |
| `data-fit-signals` | **comma-separated** kebab signals (e.g. `beginner-friendly,partner-welcome`) |
| `data-event-date` | ISO date string (e.g. `2026-06-14`) |
| `data-is-today` | `"true"` or `"false"` |
| `data-is-past` | `"true"` or `"false"` |

---

## Nunjucks Block Names

| Block | Purpose |
|---|---|
| `schema` | JSON-LD Schema.org markup (injected by Epic 4) |
| `meta` | OG / meta tags (injected by Epic 4) |
| `content` | Page body content |

All blocks are defined in `_includes/base.njk` and overridden in page templates via `{% extends "base.njk" %}`.

---

## CSS Custom Properties

All defined in `assets/css/base.css` `:root` block.

### Colors

| Token | Value |
|---|---|
| `--color-bg` | `#101214` |
| `--color-surface` | `#16181b` |
| `--color-surface-border` | `rgba(240, 238, 234, 0.12)` |
| `--color-text-primary` | `#f0eeea` |
| `--color-text-muted` | `rgba(240, 238, 234, 0.5)` |
| `--color-text-on-badge` | `#f0eeea` |
| `--color-gold` | `#c9a84c` — structural only, never on text |
| `--color-gold-rule` | `rgba(201, 168, 76, 0.25)` |
| `--color-gold-badge-border` | `rgba(201, 168, 76, 0.28)` |
| `--color-gold-tab-active` | `rgba(201, 168, 76, 0.30)` |
| `--color-tab-bar-bg` | `#0d0f11` |

### Typography

| Token | Value |
|---|---|
| `--font-display` | `'Cinzel', serif` |
| `--font-body` | `'Josefin Sans', sans-serif` |

### Spacing

| Token | Value |
|---|---|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `40px` |

### Layout

| Token | Value |
|---|---|
| `--tab-bar-height` | `56px` |
| `--page-margin` | `20px` |

---

## Canonical Event Type Kebab Values

| Display | Kebab (`data-event-type`, `?type=`) |
|---|---|
| Social Dancing | `social-dancing` |
| Group Lesson | `group-lesson` |
| Workshop | `workshop` |
| Competition | `competition` |
| Convention | `convention` |

---

## Eleventy Collection Names

| Collection | Contents |
|---|---|
| `collections.events` | All events, date+startTime ASC |
| `collections.todayEvents` | `isToday: true`, startTime ASC |
| `collections.upcomingEvents` | `isPast: false` (today + future), date+startTime ASC |
| `collections.pastEvents` | `isPast: true`, date DESC |

Defined in `.eleventy.js`. Source data: `_data/events.mock.js` (swapped for `_data/events.js` in Epic 5).

---

## Custom Nunjucks Filter Names

| Filter | Input | Output example |
|---|---|---|
| `formatDate` | `"2026-06-14"` | `"Saturday, June 14"` (omits year if current year) |
| `formatTime` | `"20:00"` | `"8:00 PM"` |
| `formatDateShort` | `"2026-06-14"` | `"Jun 14"` |
| `eventTypeToKebab` | `"Social Dancing"` | `"social-dancing"` |
| `fitSignalToKebab` | `"Beginner-friendly"` | `"beginner-friendly"` |
| `fitSignalsToKebab` | `["Beginner-friendly","Partner-welcome"]` | `"beginner-friendly,partner-welcome"` |

---

## Subscribe Form Placements (FR-18)

- Primary: `_includes/empty-state.njk` — shown only when no today events
- Secondary: `index.njk` bottom of content block — shown always, below event list and wcs-intro

Both use `_includes/subscribe-form.njk` partial (Buttondown embed, `jugisahunk` account).

---

## WCS Intro Paragraph (FR-17)

Location: bottom of `index.njk` content block, before the secondary subscribe form. After the event list section.

---

## Multi-day Convention Naming (FR-22)

Format: `[Convention Name] — [Type]: [Title]`

Example: `Swing Summit — Workshop: Connection and Musicality`

---

## Slug Collision Rule (Epic 4+)

Event detail page URLs are `events/{event.id}/`. The `id` field is `{kebab-event-name}-{YYYY-MM-DD}`.

If two events share the same kebab name AND date (e.g., two different "Intro to WCS" classes on the same day), the second slug gets `-2` appended, the third gets `-3`, etc.

For the mock fixture: all event IDs are already unique — no two events share both the same name and date. No runtime collision handling is needed at this stage. The real parser (Epic 5) must implement the deduplication logic when processing Google Sheets data.

---

## Fit Signal Canonical Display Values

Store in data model as display form; convert to kebab for `data-*` and URL params.

| Display | Kebab |
|---|---|
| Beginner-friendly | `beginner-friendly` |
| Partner-welcome | `partner-welcome` |
| Skill level target | `skill-level-target` |
| Instructor present | `instructor-present` |
| Special guest present | `special-guest-present` |

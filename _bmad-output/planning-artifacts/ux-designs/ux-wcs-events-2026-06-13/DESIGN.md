---
title: wcs-events Design Specification
status: final
created: 2026-06-13
updated: 2026-06-13

colors:
  bg: "#101214"
  surface: "#16181b"
  surface-border: "rgba(240, 238, 234, 0.12)"
  text-primary: "#f0eeea"
  text-muted: "rgba(240, 238, 234, 0.5)"
  text-on-badge: "#f0eeea"
  gold: "#c9a84c"
  gold-rule: "rgba(201, 168, 76, 0.25)"
  gold-badge-border: "rgba(201, 168, 76, 0.28)"
  gold-tab-active: "rgba(201, 168, 76, 0.30)"
  tab-bar-bg: "#0d0f11"

typography:
  display-hero:
    family: Cinzel
    weight: 400
    size-mobile: 32px
    size-desktop: 40px
    line-height: 1.15
    letter-spacing: "-0.01em"
  display-card-title:
    family: Cinzel
    weight: 400
    size: 18px
    line-height: 1.3
    letter-spacing: "0em"
  label-ui:
    family: Josefin Sans
    weight: 300
    size: 10px
    transform: ALL CAPS
    letter-spacing: "0.18em"
    line-height: 1.4
  label-ui-md:
    family: Josefin Sans
    weight: 300
    size: 12px
    transform: ALL CAPS
    letter-spacing: "0.15em"
    line-height: 1.4
  label-ui-lg:
    family: Josefin Sans
    weight: 300
    size: 14px
    transform: ALL CAPS
    letter-spacing: "0.12em"
    line-height: 1.4
  body:
    family: Josefin Sans
    weight: 300
    size: 15px
    transform: normal case
    letter-spacing: "0.02em"
    line-height: 1.6
  time-display:
    family: Josefin Sans
    weight: 300
    size: 13px
    transform: ALL CAPS
    letter-spacing: "0.15em"
    note: used for event times on cards

rounded:
  badge: 3px
  card: 4px
  button: 3px
  filter-bar: 3px
  tab-bar: 0

spacing:
  unit: 8px
  page-margin: 20px
  card-padding: "16px 20px"
  card-gap: 0px
  section-gap: 32px
  tab-bar-height: 56px
  hero-padding-top: 40px
  hero-padding-bottom: 24px
  deco-rule-gap: 8px
  deco-rule-margin: 12px

components:
  - event-card
  - event-type-badge
  - fit-signal-chip
  - recurring-badge
  - double-rule-ornament
  - diamond-divider
  - bottom-tab-bar
  - filter-bar-collapsible
  - hero-block
  - empty-state
  - subscribe-form
---

# wcs-events Design Specification

## Brand & Style

The design language is **Blueprint + Art Deco**: the structural clarity of Blueprint — dense, organized, the visual register of a contemporary arts venue's printed schedule — fused with Tulsa's Art Deco heritage from the 1920s–30s oil boom. The result is a site that feels like a night out in a city that takes its architecture seriously.

**Personality:** dark and exciting, lively without being busy, sophisticated without being unapproachable. This is not a startup product page. It is not a community center flyer. It is closer to the printed insert inside a festival program, or the door card at a jazz club.

**Art Deco is applied subtly and unmistakably.** The geometry does the work: paired thin rules flanking headline text, diamond ornaments between content units, card borders that delineate without glowing. The typography does the rest: Cinzel's monumental Roman proportions carry every title and headline; Josefin Sans runs in ALL CAPS throughout every label, badge, metadata line, and navigation element, with generous letter-spacing that creates the horizontal rhythm characteristic of Art Deco friezes.

**Gold is structural, never decorative.** The accent `#c9a84c` appears at 20–30% opacity exclusively on geometric elements — the rule lines, diamond dividers, badge borders, the active tab indicator. It reads like gold leaf caught in peripheral vision: present but never loud. It is never applied to text. It never signals a state, a category, or a priority. Typography handles all hierarchy.

**Voice:** confident, direct, unhurried. The site knows what it is. Copy is spare. The microcopy section in EXPERIENCE.md governs specific string choices; the governing instinct here is that the site does not oversell itself, does not explain itself in anxious detail, and does not try to charm the user. It simply shows them what is happening tonight.

---

## Colors

The palette has one job: create a night-out atmosphere on a phone screen. Near-black is the stage. Warm off-white is the marquee. Gold is the gilding on the columns you notice on your way in.

**Palette philosophy:**
- Near-black (`#101214`) carries a barely perceptible cool undertone — a hint of blue-grey that pushes it away from warm black and toward the look of a dark, lit room. The warmth the PRD requested lives in the white, not the black.
- The primary text (`#f0eeea`) is a warm off-white, not pure white. Against near-black, it reads like lit lettering against a dark facade — confident and warm.
- Gold (`#c9a84c`) connects to Tulsa's Art Deco gilding tradition. At low opacity it contributes atmosphere without competing with content. Full-saturation gold is never used directly.
- No additional hues exist in this palette. The PRD constraint — "no accent hue for hierarchy" — is honored. Gold does not signal importance or status; it is geometry, not hierarchy. All content hierarchy is achieved through typography: size, weight, and opacity.

**Token reference:**

| Token | Value | Semantic role |
|---|---|---|
| `bg` | `#101214` | Main page background — the stage |
| `surface` | `#16181b` | Card and elevated container backgrounds — barely lifted off `bg` |
| `surface-border` | `rgba(240, 238, 234, 0.12)` | 1px card border — geometric definition without glow |
| `text-primary` | `#f0eeea` | All primary text — event names, body copy, hero headline |
| `text-muted` | `rgba(240, 238, 234, 0.5)` | Secondary metadata, section labels, muted UI copy |
| `text-on-badge` | `#f0eeea` | Badge label text — same warm off-white as primary |
| `gold` | `#c9a84c` | Base gold value — always applied via opacity-adjusted tokens below, never raw |
| `gold-rule` | `rgba(201, 168, 76, 0.25)` | Double-rule lines and diamond ornaments |
| `gold-badge-border` | `rgba(201, 168, 76, 0.28)` | Event type badge border |
| `gold-tab-active` | `rgba(201, 168, 76, 0.30)` | Active tab top-border indicator |
| `tab-bar-bg` | `#0d0f11` | Bottom tab bar — slightly darker than `bg`; visually anchors the navigation |

---

## Typography

Two typefaces. Maximum contrast between them. No third option.

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Josefin+Sans:wght@300&display=swap');
```

### Cinzel

Cinzel is a display serif with geometric Roman proportions — monumental without being heavy. It is used for text that needs to occupy space and carry authority: the hero headline, event card titles, section headers. Its proportions evoke text carved into the facade of a 1930s building. Cinzel is used at 400 weight only, never italicized, never condensed.

**Minimum size:** 16px. Below 16px, Cinzel's fine strokes degrade — use Josefin Sans for small-scale labels instead.

**Use contexts:** hero headline, event card title, event detail page title, section headers where monumental weight is appropriate.

### Josefin Sans

Josefin Sans is a geometric Art Deco sans-serif with clean, open letterforms. In this system it is used at weight 300 throughout, and always in ALL CAPS with generous letter-spacing for label and UI contexts. This is the defining typographic move: spaced caps create the horizontal, frieze-like rhythm of Art Deco surface decoration. Josefin Sans runs in ALL CAPS for every non-Cinzel UI element — navigation labels, badge text, metadata lines, filter chips, section labels, button copy. The only exception is body text (descriptions, empty-state copy, the WCS intro paragraph), where it runs in normal case at the body scale.

**Use contexts:** everything that is not Cinzel.

### Type scale reference

| Token | Family | Weight | Size | Transform | Letter-spacing | Line-height |
|---|---|---|---|---|---|---|
| `display-hero` | Cinzel | 400 | 32px mobile / 40px desktop | — | -0.01em | 1.15 |
| `display-card-title` | Cinzel | 400 | 18px | — | 0em | 1.3 |
| `label-ui` | Josefin Sans | 300 | 10px | ALL CAPS | 0.18em | 1.4 |
| `label-ui-md` | Josefin Sans | 300 | 12px | ALL CAPS | 0.15em | 1.4 |
| `label-ui-lg` | Josefin Sans | 300 | 14px | ALL CAPS | 0.12em | 1.4 |
| `body` | Josefin Sans | 300 | 15px | normal case | 0.02em | 1.6 |
| `time-display` | Josefin Sans | 300 | 13px | ALL CAPS | 0.15em | — |

**Hierarchy rule:** size and opacity carry all hierarchy — never color. A primary label is larger or fully opaque; a secondary label uses `text-muted` at 50% opacity. Gold does not indicate importance.

**Implementation note:** Apply ALL CAPS via `text-transform: uppercase` in CSS. Never write uppercase letters in HTML source — screen readers will read lowercase source text naturally.

---

## Layout & Spacing

**Mobile-first.** The Tonight View is designed for one-handed phone use at 320px minimum width, designed at 375px. Desktop is a responsive bonus, not a co-equal target.

**Side margins:** 20px on mobile. Content fills edge-to-edge within those margins. No content is permitted to run to the true screen edge.

**Card rhythm:** Cards are not separated by vertical gaps. `card-gap` is `0px`. Cards flow continuously, separated only by the diamond ornament centered between them. This creates a content → ornament → content rhythm that mirrors Art Deco frieze patterns. A full-width horizontal rule between cards would break this rhythm and is prohibited.

**Hero breathing room:** The hero block has 40px top padding to give "West Coast Swing in Tulsa" room to exist as a monumental statement rather than a headline squeezed at the top of a feed.

**Spacing tokens:**

| Token | Value | Use |
|---|---|---|
| `unit` | 8px | Base spacing unit |
| `page-margin` | 20px | Left and right page margins on mobile |
| `card-padding` | 16px 20px | Internal card padding (vertical / horizontal) |
| `card-gap` | 0px | No vertical gap between adjacent cards |
| `section-gap` | 32px | Space between major page sections |
| `tab-bar-height` | 56px | Fixed bottom navigation bar height |
| `hero-padding-top` | 40px | Space above the hero headline |
| `hero-padding-bottom` | 24px | Space below the hero block before the event list |
| `deco-rule-gap` | 8px | Space between the two lines in a double-rule ornament |
| `deco-rule-margin` | 12px | Space above and below the double-rule ornament container |

---

## Elevation & Depth

Depth is tonal only. No drop shadows exist anywhere in this design system.

Cards sit on `surface` (`#16181b`) against the page `bg` (`#101214`) — a barely perceptible lift achieved through a two-step difference in lightness, not through shadows or glows. The card's 1px border at `rgba(240,238,234,0.12)` provides geometric definition: the eye registers a boundary because geometry tells it to, not because a shadow implies elevation.

The gold structural elements — rules, diamonds — create a sense of inlaid detail. This is depth through craft rather than depth through shadow. The ornament reads as etched or inset into the surface, not raised above it.

This approach is deliberate and total. Adding shadows anywhere in the system — to a card, a chip, a tab bar — introduces a depth register that conflicts with the tonal-only model. Do not add them.

---

## Shapes

Corner radii are minimal throughout. The system uses geometry as a design element; excessive rounding softens that geometry unnecessarily.

| Element | Radius |
|---|---|
| Badges, chips, filter chips, buttons | 3px |
| Cards, image thumbnails | 4px |
| Filter bar (collapsed state) | 3px |
| Bottom tab bar | 0 — sharp top edge |

The tab bar has no rounding on its top edge. It meets the screen's bottom safe area with a straight horizontal line — a geometric floor rather than a floating tray.

**The 4px on cards is a ceiling, not a target.** If any future element reaches for 8px or more, it violates the design language.

---

## Components

### event-card

The primary content unit on all three views (Tonight, Browse, Archive). Full-width within page margins.

**Visual structure (top to bottom, left to right):**
1. Event type badge — positioned top-right within the card
2. Event name — `display-card-title` (Cinzel, 18px, line-height 1.3)
3. Metadata line — `time-display` (Josefin Sans ALL CAPS, 13px, letter-spacing 0.15em): e.g., `8:00 PM · CAIN'S BALLROOM · FREE`
4. Fit signal chips — below the metadata line, left-aligned, wrapping
5. Recurring badge — if `isRecurring: true`, appears among or after fit signal chips

**Card surface:** `background: {colors.surface}`, `border: 1px solid {colors.surface-border}`, `border-radius: 4px`, `padding: 16px 20px`.

**Information hierarchy within card:** When → Where → Cost. Time comes first in the metadata line, then venue, then cost. This sequence is locked from the PRD and must not be reordered.

**Interaction:** The entire card is the tap/click target. A single `<a>` wraps the full card content and navigates to the event detail page permalink. No separate "more info" or "details" button exists anywhere on the card.

---

### event-type-badge

A small rectangular chip displayed in the top-right of event cards. Values: SOCIAL DANCING, GROUP LESSON, WORKSHOP, COMPETITION, CONVENTION.

**Visual:** `border: 1px solid {colors.gold-badge-border}`, `border-radius: 3px`, no background fill (transparent — card surface shows through), `padding: 3px 8px`. Label in Josefin Sans ALL CAPS, 10px, letter-spacing 0.18em, color `{colors.text-on-badge}`.

The border carries the gold accent. The chip itself is transparent. The effect is a lightweight frame — an inlaid label, not a filled tag.

---

### fit-signal-chip

Used to display individual fit signals below the metadata line on event cards and on event detail pages. Signal values: BEGINNER-FRIENDLY, PARTNER-WELCOME, SKILL LEVEL TARGET, INSTRUCTOR PRESENT, SPECIAL GUEST PRESENT.

**Visual:** `border: 1px solid {colors.surface-border}`, `border-radius: 3px`, transparent fill, `padding: 3px 8px`. Label in Josefin Sans ALL CAPS, 10px, letter-spacing 0.18em, color `{colors.text-muted}`. Uses the white-toned surface border rather than the gold badge border — quieter than the event type badge, subordinate in the visual hierarchy.

Chips wrap to a second line if necessary. No fixed count.

---

### recurring-badge

Displayed on event cards and event detail pages when `isRecurring: true`. Label: RECURRING.

**Visual:** `border: 1px solid rgba(240,238,234,0.15)`, `border-radius: 3px`, transparent fill, `padding: 3px 8px`. Label in Josefin Sans ALL CAPS, 10px, letter-spacing 0.18em, color `{colors.text-muted}`. Slightly lighter border treatment than the event type badge — warm white opacity, not gold.

Positioned among or after the fit signal chips within the card.

---

### double-rule-ornament

Two `1px` horizontal lines separated by a gap of `{spacing.deco-rule-gap}` (8px). Both lines rendered in `{colors.gold-rule}` (`rgba(201,168,76,0.25)`).

Used above and below the hero headline. May appear above section headers where typographic weight calls for punctuation.

**Implementation:** Two elements each `height: 1px; background: {colors.gold-rule}; border: none` separated by 8px vertical gap. Container has `margin-block: {spacing.deco-rule-margin}` (12px above and below).

**Accessibility:** `aria-hidden="true"` on the ornament container. It carries no semantic content.

---

### diamond-divider

A single centered ◆ character (U+25C6) rendered in `{colors.gold-rule}`. Size: 12px. Vertical padding: 24px above and below.

**Implementation:** `<div aria-hidden="true" class="diamond-divider">◆</div>` with `text-align: center; color: {colors.gold-rule}; font-size: 12px; padding-block: 24px`.

This is the only separator between adjacent event cards on all three views. No full-width horizontal rule replaces it. No blank space gap replaces it. No margin-based spacing replaces it. The diamond is the rhythm.

**Accessibility:** `aria-hidden="true"`. Screen readers skip this element.

---

### bottom-tab-bar

Fixed navigation bar anchored to the bottom of the viewport. Three tabs: TONIGHT · BROWSE · ARCHIVE.

**Visual:** `height: {spacing.tab-bar-height}` (56px), `background: {colors.tab-bar-bg}`, `border-top: 1px solid rgba(240,238,234,0.08)`. Top edge is geometrically sharp — `border-radius: 0` on all corners.

**Tab labels:** Josefin Sans ALL CAPS, 10px, letter-spacing 0.18em. Inactive tabs at 50% opacity (`color: rgba(240,238,234,0.5)`). Active tab: full-opacity text plus a 2px top-border line in `{colors.gold-tab-active}` that aligns with the top edge of the tab bar.

**Layout:** Three equal-width columns across the full viewport width. Label only — no icons for MVP. Each tab is a minimum 44×44px touch target.

**Accessibility:** Wrapped in `<nav aria-label="Main navigation">`. Active tab link carries `aria-current="page"`.

---

### filter-bar-collapsible

Appears on the Browse View only. Full-width bar above the event list. Collapsed by default on page load.

**Collapsed state:** A single row — `border: 1px solid {colors.surface-border}; border-radius: 3px; padding: 12px 16px`. Label: "FILTER EVENTS ›" in Josefin Sans ALL CAPS, 12px, letter-spacing 0.15em. When filters are active: "FILTERING › N ACTIVE" where N is the count of currently active filters.

**Expanded state:** The bar expands vertically to reveal three filter sections stacked:
1. EVENT TYPE — chip group: SOCIAL DANCING, GROUP LESSON, WORKSHOP, COMPETITION, CONVENTION
2. FIT SIGNALS — chip group: BEGINNER-FRIENDLY, PARTNER-WELCOME, SKILL LEVEL TARGET, INSTRUCTOR PRESENT, SPECIAL GUEST PRESENT
3. DATE — a date input field

Each section is headed by a `label-ui` section label preceded by a double-rule ornament. Chips follow the `fit-signal-chip` visual treatment; active (selected) chips render at full opacity while inactive chips appear at `text-muted` opacity. The trigger-row chevron rotates 90° when expanded.

Closes on a second tap of the trigger row or a tap outside the filter bar.

**Accessibility:** Trigger row is `<button aria-expanded="false|true">`. Filter chips are `<button aria-pressed="true|false">`.

---

### hero-block

The top section of the Tonight View. Contains only the site headline — no subheadline, no hero image, no CTA button.

**Structure (top to bottom):**
1. `padding-top: {spacing.hero-padding-top}` (40px)
2. Double-rule ornament (gold)
3. `<h1>` "West Coast Swing in Tulsa" in `{typography.display-hero}` (Cinzel 400, 32px mobile / 40px desktop, centered, letter-spacing -0.01em)
4. Double-rule ornament (gold)
5. `padding-bottom: {spacing.hero-padding-bottom}` (24px)
6. Section label: "TONIGHT" in `{typography.label-ui}` (Josefin Sans ALL CAPS, 10px, letter-spacing 0.2em, color `{colors.text-muted}`)

The section label "TONIGHT" introduces the event list below. It is the only element between the hero block and the first event card.

The `<h1>` text is exactly: **West Coast Swing in Tulsa**. No abbreviation. No variation.

---

### empty-state

Replaces the event list on the Tonight View when no events are scheduled for today.

**Contents (top to bottom):**
1. "QUIET TONIGHT." — orientation line in `{typography.label-ui-lg}` (Josefin Sans ALL CAPS, 14px, letter-spacing 0.12em, color `{colors.text-primary}`, centered). Precedes the subscribe pitch so visitors immediately understand the page is working and no events are scheduled — not that the page is broken or still loading.
2. Diamond ornament (`aria-hidden="true"`) in `{colors.gold-rule}` — visual separator between orientation line and copy
3. Locked copy (exactly, from the PRD): "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them." — rendered in `{typography.body}` (Josefin Sans, 15px, normal case, line-height 1.6)
4. The `subscribe-form` component
5. "BROWSE UPCOMING" link — Josefin Sans ALL CAPS, 12px, underlined, color `{colors.text-primary}` — navigates to the Browse View

**Layout:** centered within page margins, with `{spacing.section-gap}` (32px) above.

---

### subscribe-form

Plain HTML form POSTing to Buttondown. No JavaScript required. Two interactive elements: email input and submit button.

**Email input:** `border: none; border-bottom: 1px solid rgba(240,238,234,0.3); background: transparent; color: {colors.text-primary}; font-family: Josefin Sans; font-size: 15px; width: 100%`. No box border — underline style only. The single bottom border is the Art Deco minimal treatment: a threshold rather than a container.

**Submit button:** Josefin Sans ALL CAPS, 13px, letter-spacing 0.15em. `background: {colors.text-primary}; color: {colors.bg}; border-radius: 3px; padding: 10px 20px`. White fill, dark text — maximum contrast. Minimum tap target: 44×44px.

**Behavior on submit:** Browser navigates to Buttondown's confirmation page. No inline success state for MVP.

---

## Do's and Don'ts

**DO** use Josefin Sans ALL CAPS with generous tracking (0.12em–0.18em) for all non-Cinzel text in UI label, badge, navigation, and metadata contexts.

**DO** keep gold at low opacity — it should feel like a discovered detail, a material property of the geometry, not a highlight color.

**DO** maintain the card → diamond → card rhythm throughout all event lists. Never break it with a full-width horizontal rule, a promotional unit, or a blank vertical gap.

**DO** verify WCAG AA contrast on every text-on-background pairing before marking a component or view complete.

**DO** apply `aria-hidden="true"` to all decorative elements: diamond dividers, double-rule ornaments.

**DON'T** use gold on text — never, under any circumstances, at any opacity.

**DON'T** round any corner beyond 4px. The 4px card radius is a ceiling, not a default.

**DON'T** add shadows — not to cards, chips, the tab bar, or any element. Depth is tonal only.

**DON'T** introduce any hue beyond the defined palette. No status colors, no category colors, no hover colors beyond an opacity shift on the same `text-primary` value.

**DON'T** use Cinzel below 16px. Its fine strokes lose legibility at small sizes. Use Josefin Sans for small-scale label text.

**DON'T** use Josefin Sans in mixed case for UI label contexts. ALL CAPS is not optional in label, badge, navigation, and metadata roles.

**DON'T** write UI copy in uppercase in HTML source. Use `text-transform: uppercase` in CSS so screen readers encounter normal-case source text and read it naturally.

**DON'T** add a separate "more info" or "details" button to event cards. The entire card is the tap target.

**DON'T** add a subheadline, hero image, or CTA button to the hero block. The `<h1>` stands alone between its two double-rules.

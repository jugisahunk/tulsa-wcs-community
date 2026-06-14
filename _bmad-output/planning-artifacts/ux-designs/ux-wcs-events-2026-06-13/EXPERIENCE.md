---
title: wcs-events Experience Specification
status: final
created: 2026-06-13
updated: 2026-06-13
design-ref: DESIGN.md
---

# wcs-events Experience Specification

## Foundation

**Platform:** Single-surface mobile web. Responsive to desktop but mobile is the primary design target. No native app. No PWA shell. A URL the user can bookmark or share.

**No UI framework named.** This experience inherits web platform conventions — native browser scrolling, native focus rings (overridden with on-brand style), native form behavior. No component library, no design token system beyond what `DESIGN.md` defines.

**Design reference:** `DESIGN.md` is the visual identity. This document is the experience — behavior, states, flows, and accessibility. When the two documents describe the same element, `DESIGN.md` governs visual treatment and this document governs behavior.

**Form factor:** Phone (320px minimum viewport width, designed at 375px). Desktop is a bonus at no additional design cost — the layout gains whitespace and the hero gains scale at `{typography.display-hero}` desktop size (40px). The Tonight View must work flawlessly one-handed on a phone.

**Rendering model:** Static site (Eleventy SSG + GitHub Pages). All content is pre-rendered at build time. There are no loading states for data — the only meaningful loading moment is the initial page load, which resolves once static HTML and CSS are delivered. No skeleton screens. No loading spinners. No client-side data fetching on page load.

**Navigation model:** Bottom tab bar is the primary navigation mechanism. No hamburger menu. No top navigation bar. No breadcrumbs. Submit and Request a Change are footer-only links — absent from the tab bar by deliberate PRD decision.

---

## Information Architecture

### Surfaces

| Surface | Reached from | URL | Purpose |
|---|---|---|---|
| Tonight View | Tab bar (TONIGHT), direct URL | `/` | Today's events sorted by start time; empty state drives mailing list subscribe |
| Browse View | Tab bar (BROWSE) | `/browse/` | All upcoming events with collapsible filters; filter state in URL |
| Archive View | Tab bar (ARCHIVE) | `/archive/` | Past events, accessible but not promoted |
| Event Detail | Event card tap from any surface | `/events/{slug}/` | Full event data, shareable URL, OG preview, Schema.org markup |
| Submit (external) | Footer link "SUBMIT AN EVENT" | External Google Form | Organizer event submission |
| Request Change (external) | Footer link "REQUEST A CHANGE" | External Google Form | Correction requests for existing listings |

### Navigation structure

**Primary navigation:** Bottom tab bar — TONIGHT · BROWSE · ARCHIVE. These three views are the site. The tab bar is the only persistent navigation element.

**Footer links (not in tab bar):** SUBMIT AN EVENT · REQUEST A CHANGE · attribution text. The footer appears within the page scroll, above the tab bar safe area. It is reachable by scrolling to the bottom of any view.

**Deep links:** Every event has a permanent URL (`/events/{slug}/`). These URLs are the shareable unit — they are what users text to each other. OG tags on each event detail page produce a rich preview card in iMessage, WhatsApp, and email.

**Back navigation:** Browser native. No custom back button. The site relies on native browser back behavior, which is appropriate for a static site with no modal layers or drawer navigation for MVP.

---

## Voice and Tone — Microcopy

Brand voice is defined in `DESIGN.md`. This section governs specific string choices in the UI.

All UI copy renders in ALL CAPS via `text-transform: uppercase` in CSS. The HTML source is lowercase. Exceptions: body text (descriptions, the WCS intro paragraph, empty-state copy), event names (sentence case, rendered in Cinzel), and the footer attribution line.

### Locked strings

| Context | Correct string | Incorrect alternatives |
|---|---|---|
| Tonight View section label | TONIGHT | "Tonight's Events", "What's On Tonight" |
| Hero `<h1>` | West Coast Swing in Tulsa | "WCS Tulsa Events", "WCS in Tulsa", any abbreviation |
| Empty state orientation line | QUIET TONIGHT. | "No events tonight", "Nothing scheduled", "Check back later" |
| Empty state body copy | Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them. | Any variation — this copy is locked in the PRD |
| Browse section label | UPCOMING | "Browse Events", "All Events" |
| Archive section label | ARCHIVE | "Past Events", "Previous Events" |
| Recurring badge | RECURRING | "Weekly", "Every Week", "Repeating" |
| Filter bar — no active filters | FILTER EVENTS › | "Filter", "Show Filters", "Refine" |
| Filter bar — filters active | FILTERING › N ACTIVE | "N filters active", "Filtered", "X filters on" |
| Submit footer link | SUBMIT AN EVENT | "Add Event", "Submit", "List Your Event" |
| Request change footer link | REQUEST A CHANGE | "Report an Error", "Corrections", "Edit" |
| Event cost — free | FREE | "$0", "No charge", "Free admission" |
| Event cost — paid | $15 (no decimals unless cents: $12.50) | "15.00", "USD 15", "$15.00" |
| Browse zero-results state | NO EVENTS MATCH YOUR FILTERS. | "No results found", "Nothing here" |
| Archive no-past-events state | NO PAST EVENTS YET. | "Nothing in the archive", "No events yet" |
| Clear filters link | CLEAR FILTERS | "Reset", "Remove filters", "Clear all" |
| Event detail — source link | VIEW ORGANIZER PAGE → | "More info", "Official link", "Source" |
| Event detail — no source URL | (omit the link entirely) | "No URL provided", "Link unavailable" |
| Footer attribution | A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD]. | Any paraphrase |
| Browse Upcoming link (empty state) | BROWSE UPCOMING | "See what's coming up", "Browse all events" |

### Microcopy principles

- **Omit rather than explain.** If something is missing (no source URL, no description), omit the field entirely. Do not fill it with placeholder copy.
- **ALL CAPS for labels, sentence case for prose.** The typographic treatment is not decoration — it signals register. Labels are ALL CAPS. Body text is not.
- **No exclamation points.** The site's confidence does not require them.
- **No filler words.** "Check out tonight's events" becomes "TONIGHT". The design earns brevity.

---

## Component Patterns — Behavioral

Visual specifications live in `DESIGN.md` under `{components.*}`. This section covers behavior only.

### event-card

The entire card is the tap/click target. No separate "more info" button, no visible link underline on the card itself. A single `<a>` wraps the full card content and navigates to the event detail permalink (`/events/{slug}/`).

On mobile: no hover state.

On desktop: `background` shifts to a slightly lighter value on `:hover` — increase `{colors.surface}` lightness by approximately 5% (e.g., `#1c1f23`). Do not add a border glow or shadow on hover.

Cards render in the same template across all three views (Tonight, Browse, Archive). No view-specific card variation for MVP.

### bottom-tab-bar

Active tab: `{colors.gold-tab-active}` 2px top-border indicator + full-opacity text.

Inactive tabs: 50% opacity text, no indicator.

Tab switches do not scroll to top — each view maintains its own independent scroll position. Switching from BROWSE back to TONIGHT returns to wherever the Tonight View was scrolled, not the top.

### filter-bar-collapsible

Browse View only. Collapsed by default on every page load, regardless of whether URL params carry active filters. (If URL params are present on load, the filter bar shows "FILTERING › N ACTIVE" in collapsed state and filters are already applied to the event list — the bar does not auto-expand.)

Filter state persists in URL params so filtered views are bookmarkable and shareable: `?type=social-dancing,workshop&signal=beginner-friendly&date=2026-06-14`. Filter JS reads these on page load and applies them without requiring the bar to be expanded.

Clearing all filters collapses the bar automatically and resets the label to "FILTER EVENTS ›".

Expanding: tap the trigger row once. Collapsing: tap the trigger row again, or tap anywhere outside the filter bar.

### diamond-divider

Purely decorative. Not a tappable or interactive element. `aria-hidden="true"` on all instances. Renders between every pair of adjacent event cards on all three views.

### double-rule-ornament

Decorative. `aria-hidden="true"` on all instances. Renders above and below the hero headline on the Tonight View. May render as section separators within the filter bar expanded state.

### subscribe-form

Plain HTML `POST` to Buttondown. No JavaScript required for submission. On submit, the browser navigates to Buttondown's hosted confirmation page. No inline success state, no toast, no modal for MVP. The form resets when the user navigates back.

### recurring-badge

Static — no interaction. Renders on event cards (within the card's chip row) and on the event detail page header. Appearance is determined at build time by the `isRecurring` field on the event object.

---

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Tonight — has events | Tonight View | Hero block → event list with diamond dividers between cards |
| Tonight — no events | Tonight View | Hero block → "QUIET TONIGHT." orientation line → ◆ divider → locked copy + subscribe form + BROWSE UPCOMING link |
| Browse — no filters | Browse View | All upcoming events; filter bar collapsed showing "FILTER EVENTS ›" |
| Browse — filters active | Browse View | Filtered event list; filter bar shows "FILTERING › N ACTIVE"; non-matching cards have `hidden` attribute — they remain in the DOM |
| Browse — filters yield zero results | Browse View | "NO EVENTS MATCH YOUR FILTERS." (Josefin Sans ALL CAPS, center-aligned, `{colors.text-muted}`); "CLEAR FILTERS" link below |
| Archive — has past events | Archive View | Past events, most recent first; same card template as other views |
| Archive — no past events | Archive View | "NO PAST EVENTS YET." — brief, matter-of-fact, no further explanation |
| Event detail — has source URL | Event Detail | "VIEW ORGANIZER PAGE →" link rendered at the bottom of the detail content |
| Event detail — no source URL | Event Detail | Source URL section omitted entirely — the detail page is the event page |
| Build failure (any) | Any surface | Previous deploy stays live; user never sees a broken or missing page; Jason is notified via GitHub Actions |

---

## Interaction Primitives

The site's interaction model is intentionally minimal. It is a reference site, not a product with flows to optimize.

**Tap to navigate.** Cards, tab bar items, and footer links are the primary interactive elements. No long-press interactions.

**Card tap = navigate.** The full card surface is the tap target. Tap anywhere on an event card to navigate to that event's detail page.

**Filter chip tap = toggle.** Active chips are fully opaque; inactive chips are muted. Multiple chips within a category combine with OR logic. Chips across categories combine with AND logic.

**Tab tap = switch view.** No animation for MVP. The tab bar switches views instantly, preserving each view's scroll position.

**Filter bar tap = toggle expand/collapse.** Chevron rotates 90° on expand, returns on collapse.

**No swipe gestures.** The site does not override native browser swipe behaviors. Swipe to go back is handled by the browser.

**No infinite scroll.** All events for the current view are pre-rendered and present in the DOM on page load.

**No pull-to-refresh.** Content is updated by builds, not by user action. The user cannot refresh to get new content — they get what the last build produced.

**Banned interactions for MVP:**
- Skeleton loaders (content is pre-rendered; there is nothing to skeleton)
- Loading spinners of any kind
- Toast notifications
- Modal dialogs
- Confirmation dialogs
- Inline form success states
- Animation on any interaction (tab switch, card tap, filter toggle) — reserved for post-MVP

---

## Accessibility Floor

Visual contrast ratios live in `DESIGN.md`. This section covers behavioral accessibility requirements.

### Contrast

All text must meet WCAG AA contrast against its background. Key pairs to verify:

- `{colors.text-primary}` (`#f0eeea`) on `{colors.bg}` (`#101214`): expected ratio is approximately 17:1 — well above AA (4.5:1) and AAA (7:1).
- `{colors.text-muted}` (`rgba(240,238,234,0.5)`) on `{colors.bg}` (`#101214`): expected ratio is approximately 5–6:1 — above AA minimum; verify with a contrast tool before ship.
- Gold accent elements carry no text. Contrast check is not required for decorative gold.

If `text-muted` fails AA on verification, increase opacity to `0.6` until it passes. Do not change the base color.

### Focus management

Every interactive element must have a visible focus ring. Use:

```css
:focus-visible {
  outline: 2px solid {colors.text-primary};
  outline-offset: 2px;
}
```

This is on-brand (warm off-white ring on dark background) and sufficient for WCAG AA focus visibility. Do not suppress `outline` without replacing it.

### Semantic HTML

**Event cards:** The card is an `<a>` element wrapping all card content. The `aria-label` attribute provides a complete, screen-reader-friendly description of the event:

```html
<a href="/events/tulsa-swing-social-2026-06-14/"
   aria-label="Tulsa Swing Social, Saturday June 14, 8:00 PM, Cain's Ballroom">
```

The `aria-label` must include: event name, day and date, time, venue. Cost and fit signals are in the visible card content and do not need to be duplicated in the label.

**Bottom tab bar:**

```html
<nav aria-label="Main navigation">
  <a href="/" aria-current="page">Tonight</a>
  <a href="/browse/">Browse</a>
  <a href="/archive/">Archive</a>
</nav>
```

`aria-current="page"` on the active tab. CSS applies `text-transform: uppercase` — the HTML source is lowercase so screen readers announce "Tonight", not "T-O-N-I-G-H-T".

**Filter bar:**

```html
<button aria-expanded="false" class="filter-bar-trigger">
  filter events ›
</button>
```

`aria-expanded` toggles to `"true"` when expanded. Filter chips:

```html
<button aria-pressed="false" class="filter-chip" data-event-type="social-dancing">
  social dancing
</button>
```

`aria-pressed` toggles to `"true"` when the chip is selected. HTML source is lowercase; CSS applies `text-transform: uppercase`.

**Decorative elements:**

```html
<div aria-hidden="true" class="diamond-divider">◆</div>
<div aria-hidden="true" class="double-rule-ornament">
  <div class="rule"></div>
  <div class="rule"></div>
</div>
```

Both elements are fully hidden from the accessibility tree.

**Event type images:** `alt="Social dancing event"`, `alt="Workshop event"`, etc. — `[Display Label] event`. Descriptive but brief.

**Heading hierarchy:** One `<h1>` per page — the hero "West Coast Swing in Tulsa" on Tonight View; the event name on Event Detail pages; a contextual title on Browse and Archive. Section labels (TONIGHT, UPCOMING, ARCHIVE) are `<h2>` or visual-only labels, not additional `<h1>` elements.

### Tap targets

Minimum 44×44px on all interactive elements: tab bar items, filter chips, the filter bar trigger, the submit button, the CLEAR FILTERS and BROWSE UPCOMING links. Cards are full-width — no tap target concern.

### Keyboard navigation

Tab order follows reading order on every surface. The reading order is: hero block → event list → footer. Filter chips are in the tab order when the filter bar is expanded; they are removed from the tab order (via `tabindex="-1"` or `hidden`) when the bar is collapsed.

### ALL CAPS implementation

`text-transform: uppercase` in CSS on all Josefin Sans label contexts. Never uppercase in HTML source. Rationale: screen readers announce "tonight" naturally; announcing "T-O-N-I-G-H-T" is hostile.

---

## Key Flows

### Flow 1 — Mia decides whether to go out tonight

**User:** Mia, a social dancer. Saturday afternoon. Phone in hand.

**Entry:** Navigates to the site root (`/`) via search or bookmark. Static HTML loads instantly.

1. Tonight View renders. Hero block: "West Coast Swing in Tulsa" in Cinzel, flanked by gold double-rules. Section label: "TONIGHT" in spaced Josefin Sans below the second rule.

2. Two event cards are visible without scrolling. First card: "Tulsa Swing Social" in Cinzel 18px. Below: "8:00 PM · CAIN'S BALLROOM · FREE" in Josefin Sans ALL CAPS. Event type badge top-right: "SOCIAL DANCING". Fit signal chip below: "BEGINNER-FRIENDLY".

3. Mia taps the card. Browser navigates to `/events/tulsa-swing-social-2026-06-14/`. Event detail page loads: same typographic treatment, full event data. At the bottom: "VIEW ORGANIZER PAGE →".

4. **Climax:** Mia long-presses the URL or uses the share sheet. She texts the URL to her dance partner. The OG preview card renders in iMessage — event name, date, venue, event type image. Her partner taps it. They both go.

**Failure path — no events tonight:**

Tonight View loads with the empty state in place of the event list. First: "QUIET TONIGHT." — an immediate orientation so the user knows the situation before encountering the pitch. A gold diamond ornament. Then the locked copy: "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them." Below it: the subscribe form. Below that: "BROWSE UPCOMING".

Mia enters her email. Submits. Browser navigates to Buttondown's confirmation page. Mia taps Back. She taps "BROWSE UPCOMING" and lands on the Browse View showing all upcoming events.

---

### Flow 2 — Marcus submits a workshop

**User:** Marcus, a studio owner. He wants to add a one-time special guest workshop to the site.

**Entry:** Any page on the site — he scrolls to the footer.

1. Footer is visible at the bottom of the page scroll. Two links: "SUBMIT AN EVENT" and "REQUEST A CHANGE" in Josefin Sans ALL CAPS. Attribution line below.

2. Marcus taps "SUBMIT AN EVENT". A new browser tab opens to the Google Form.

3. Marcus fills in: event name, date, start time, venue, cost ($15), event type (Workshop), fit signals (INSTRUCTOR PRESENT, SPECIAL GUEST PRESENT), description, source URL, and marks it as non-recurring. He submits the form.

4. Google Apps Script fires on form submit. It calls the GitHub Actions `workflow_dispatch` API. A build begins.

5. **Climax:** Within 90 seconds, the site rebuilds and deploys. Marcus's workshop is live at a permanent URL (`/events/workshop-name-2026-MM-DD/`) with Schema.org Event markup. It appears in the Browse View sorted by date. It will surface in Google rich event results.

The site plays no visible role in steps 3–5 — those are external. The site's contribution is: the Submit link is in the footer on every page, immediately visible on scroll, and the outcome (Google rich results) is stated in organizer-facing copy near the Submit link.

---

### Flow 3 — A traveling dancer finds the site via search

**User:** Alex, a WCS dancer from Austin visiting Tulsa for a weekend. Searches "West Coast Swing Tulsa" on their phone.

**Entry:** Google search results. If Schema.org indexing is active, a Google rich event card for an upcoming event appears in results. Alex taps it.

1. The Event Detail page for that event loads directly. Full event data. Venue, time, cost, fit signals. "VIEW ORGANIZER PAGE →" link.

2. Alex taps Browse tab. Browse View shows all upcoming events. No filter needed — they just want to know what's on.

3. Alex bookmarks the site root (`/`). When they arrive in Tulsa, they check Tonight View for that day's events.

**What this flow requires from the site:** pre-rendered Schema.org Event markup on every event detail page; fast initial load; a Tonight View that makes sense to a first-time visitor without explanation.

---

### Flow 4 — First-timer discovers the scene

**User:** Jordan, who has seen WCS on a YouTube video and wants to find a place to try it in Tulsa. Searches "West Coast Swing lessons Tulsa".

**Entry:** The site, either via search or a link someone shared.

1. Jordan lands on the Tonight View. The hero "West Coast Swing in Tulsa" is immediately legible as an answer to their search.

2. The WCS intro paragraph (FR-17, location on the page TBD at implementation time — likely below the hero or in the footer) answers "what is West Coast Swing and why does Tulsa have a scene?" briefly and confidently.

3. Jordan sees a card with fit signal "BEGINNER-FRIENDLY". They tap it. Event detail page confirms it's a good entry point. They tap "VIEW ORGANIZER PAGE →" to get more information from the studio.

4. Jordan subscribes to the mailing list to stay informed.

**What this flow requires:** the WCS intro paragraph present somewhere visible; "BEGINNER-FRIENDLY" fit signal surfaced clearly on cards; the subscribe form accessible from the Tonight View (either in the empty state or a secondary location per FR-18).

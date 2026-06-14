---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: '2026-06-13'
inputDocuments:
  - '_bmad-output/planning-artifacts/prds/prd-wcs-events-2026-06-13/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

# wcs-events - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for wcs-events. Development follows a TDD discipline: every feature epic opens with a failing-test story before any implementation story. E2E tests travel with the feature epics that introduce them, not to the end of the process.

**Amended 2026-06-13 (post-UX-design):** Story 1.5 (Bottom Tab Bar) added; Story 1.3 CSS tokens updated to full DESIGN.md palette; Story 2.1 empty-state assertions updated to include "QUIET TONIGHT."; Story 3.4 navigation AC corrected; UX Design Requirements updated to reference DESIGN.md and EXPERIENCE.md.

## Requirements Inventory

### Functional Requirements

FR-1: The default landing page shows all events occurring today, sorted by start time ascending.
FR-2: Each event card displays: event name, start time, venue name, cost (or "Free"), event type badge, and applicable fit signals.
FR-3: When no events are scheduled for today, the page displays: a Browse Upcoming link (pre-filtered to tomorrow and beyond), a mailing list subscribe field (email input + one submit button), and the copy: "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them."
FR-4: Each event card links to a permanent, shareable event detail page with full event data, Open Graph meta tags, and Schema.org Event markup.
FR-5: The Tonight View is mobile-first. Cards render correctly on screens 320px wide and up.
FR-6: The Browse View lists all upcoming events (today + future), sorted by date and time ascending.
FR-7: Browse supports date filtering to narrow results to a specific date or range. Filter state updates client-side without page reload.
FR-8: Multi-select attribute filters for Event Types (Social Dancing, Group Lesson, Workshop, Competition, Convention) and Fit Signals (Beginner-friendly, Partner-welcome, Skill level target, Instructor present, Special guest present). Filters combine with AND logic across categories, OR logic within a category. Updates client-side without page reload.
FR-9: Filter state is reflected in the URL so filtered views are bookmarkable and shareable.
FR-10: Each listing in Browse links to the same permanent event detail page used in the Tonight View.
FR-11: A separate Archive View displays past events. Accessible from navigation but not promoted.
FR-12: Every event has a permanent URL. The page includes: full event name, date, time, venue (with address), cost, event type, fit signals, freeform description, and a link to the organizer's source URL if provided.
FR-13: Each event detail page includes Open Graph meta tags (title, description, image) and Schema.org Event markup for Google rich results.
FR-14: A Submit link appears in the site footer only (not in primary navigation). It links to a Google Form.
FR-15: The Google Form collects: event name, date, start time, end time (optional), venue name, venue address, cost, event type, fit signals (optional), description (optional, 500 char limit), contact email (not displayed publicly), organizer source URL (optional), recurring event flag.
FR-16: A low-profile Request a Change link in the footer links to a Google Form with a dropdown of current events and a freeform change description field.
FR-17: One brief, confident paragraph appears on the site answering "what is West Coast Swing and why does Tulsa have a scene?"
FR-18: An email subscribe field and single submit button appear on the Tonight View (empty-state only) and at least one additional location. The integration requires no server-side code.
FR-19: One curated default image per event type (five total: social-dancing, group-lesson, workshop, competition, convention) is selected at build time for event cards and detail pages.
FR-20: Recurring events display a visual indicator ("Recurring" badge) on their cards and detail pages.
FR-21: Plausible Analytics (or equivalent cookieless tool) is configured and active from the first deploy.
FR-22: Multi-day conventions are listed using the naming convention: "[Convention Name] — [Type]: [Title]". No formal parent/child data relationship for MVP.
FR-23: The site footer displays attribution: "A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD]."

### NonFunctional Requirements

NFR-1 (Performance): Site must load in under 2 seconds on a mid-range Android phone on a 4G connection. Static assets only; no client-side data fetching on initial load.
NFR-2 (Reliability): Build pipeline failures must surface to Jason via GitHub Actions notification. The previous deploy remains live on failure. The site must never go dark silently.
NFR-3 (Accessibility): WCAG AA minimum (AAA preferred). Semantic HTML with correct heading hierarchy. All interactive elements keyboard-navigable. ARIA labels on non-obvious controls. Sufficient color contrast. Alt text on all images. Audited before Phase 2 launch.
NFR-4 (SEO): Schema.org Event markup on every event detail page. Open Graph tags on every event page. No JavaScript-required rendering for content that should be indexed.
NFR-5 (Privacy): No cookies, no tracking pixels, no third-party embeds that set cookies. Telemetry must be cookieless. No personal data stored on the site.
NFR-6 (Browser Support): Chrome, Safari, Firefox, Edge — last two major versions. No IE11.
NFR-7 (Cost): Zero recurring infrastructure cost for MVP. Mailing list provider must have a free tier sufficient for early-stage subscriber counts.

### Additional Requirements

- **Project initialization**: Run `npm create @11ty/eleventy@latest` as Story 1.1
- **Templating**: Nunjucks for layout inheritance and macro support
- **Data source**: Google Sheets accessed via `googleapis` SDK using a service account; credentials stored as GitHub Actions secret `GOOGLE_SERVICE_ACCOUNT_JSON`
- **Mock data fixture**: `_data/events.mock.js` created in Epic 1; used by all feature epics until Epic 5 (real data pipeline) merges
- **Build trigger**: Google Apps Script on Google Form submit → GitHub Actions `workflow_dispatch` → Eleventy build → GitHub Pages deploy; target < 90s end to end
- **Build failure behavior**: Previous deploy stays live; GitHub Actions notifies Jason on failure
- **Unit testing**: Vitest (ESM-native); set up in Epic 1; tests written before implementation in Epic 5
- **E2E testing**: Playwright (Chromium, Firefox, WebKit); set up in Epic 1; tests written before implementation in each feature epic
- **Telemetry**: Plausible Analytics Cloud — script tag in base layout; cookieless; ~$9/mo after trial; Umami self-hosted on Railway is the zero-cost alternative
- **Mailing list**: Buttondown — plain HTML form, no iframe, no cookie; free tier (up to 100 subscribers)
- **Sitemap**: `@11ty/eleventy-plugin-sitemap` + `robots.txt`
- **Secrets**: `GOOGLE_SERVICE_ACCOUNT_JSON` and `GITHUB_TOKEN` only; no `.env` files; no secrets in repository
- **TDD discipline**: Tests precede implementation in every epic. E2E tests are co-located with the features they validate, not deferred to a final testing epic.

### UX Design Requirements

UX design documents exist and are **final**. All implementing agents MUST reference both:

- **DESIGN.md** — `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/DESIGN.md` — visual identity: colors, typography, spacing, component visual specs
- **EXPERIENCE.md** — `_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/EXPERIENCE.md` — behavior, states, flows, accessibility, microcopy

PRD Section 10 constraints are resolved into these documents. Key decisions:
- Near-black `#101214` background; warm off-white `#f0eeea` text; gold `#c9a84c` at low opacity on geometry only (structural, never on text, not a hierarchy signal) — Cinzel + Josefin Sans ALL CAPS
- Mobile-first; Tonight View one-handed on phone; **bottom tab bar (TONIGHT · BROWSE · ARCHIVE) is the primary navigation — no top navigation bar**
- Hero: single `<h1>` "West Coast Swing in Tulsa" flanked by gold double-rule ornaments — no subheadline, no hero image, no CTA button
- Card metadata order: When → Where → Cost (time · venue · cost); Who is the event type badge at top-right
- Voice: confident, direct, unhurried, welcoming; microcopy governed by EXPERIENCE.md locked strings table

### FR Coverage Map

FR-1: Epic 2 — Tonight View (today's events, sorted by start time)
FR-2: Epic 2 — Tonight View (event card fields: name, time, venue, cost, type badge, fit signals)
FR-3: Epic 2 — Tonight View (empty state: Browse link, subscribe field, locked copy)
FR-4: Epic 4 — Event Detail (card links to detail page; OG + Schema.org on detail page)
FR-5: Epic 2 — Tonight View (mobile-first, 320px E2E test)
FR-6: Epic 3 — Browse View (all upcoming events, sorted date+time ascending)
FR-7: Epic 3 — Browse View (date filter, client-side)
FR-8: Epic 3 — Browse View (multi-select type + fit signal filters, AND/OR logic)
FR-9: Epic 3 — Browse View (URL-reflected filter state)
FR-10: Epic 3 — Browse View (each listing links to event detail page)
FR-11: Epic 3 — Archive View (past events, accessible but not promoted)
FR-12: Epic 4 — Event Detail (permanent URL, full event data)
FR-13: Epic 4 — Event Detail (OG tags + Schema.org Event markup)
FR-14: Epic 6 — Build Pipeline (submit link in footer → Google Form)
FR-15: Epic 6 — Build Pipeline (Google Form fields; form created by Jason externally)
FR-16: Epic 6 — Build Pipeline (request-a-change link in footer → Google Form)
FR-17: Epic 2 — Tonight View (WCS intro paragraph)
FR-18: Epic 2 — Tonight View (Buttondown embed in empty state + secondary location)
FR-19: Epic 2 — Tonight View (5 event type placeholder images; reused in Epic 4)
FR-20: Epic 2 — Tonight View (recurring badge on cards; reused in Epic 4 detail page)
FR-21: Epic 6 — Build Pipeline (Plausible Analytics embed)
FR-22: Epic 1 — Foundation (naming convention documented in NOTES.md and event model)
FR-23: Epic 1 — Foundation (footer attribution in base layout)

## Epic List

### Epic 1: Foundation & Test Infrastructure
Establishes the project scaffold, shared contracts, and test harness that all other epics depend on. Delivers a running Eleventy dev server, a documented event data model, a mock fixture with representative data, naming conventions, and configured Vitest + Playwright so the test-first workflow is operational from the start.
**FRs covered:** FR-22, FR-23 (foundation contracts; footer attribution in base layout)
**Sequencing:** Serial prerequisite — all other epics block on this one.

### Epic 2: Tonight View
Community dancers can visit the site and immediately see tonight's WCS events. Empty state handles no-events gracefully and drives mailing list sign-ups. Developed test-first: E2E specs for all Tonight View behaviors are written as failing tests before any template code.
**FRs covered:** FR-1, FR-2, FR-3, FR-5, FR-17, FR-18, FR-19, FR-20
**Sequencing:** Parallel after Epic 1. `event-card.njk` produced here is reused by Epics 3 and 4.

### Epic 3: Browse & Archive Views
Dancers can browse all upcoming events with multi-select type and fit-signal filters, a date filter, and bookmarkable URL state. Past events accessible in Archive. Developed test-first: E2E specs for filter behavior and URL state are written as failing tests before the Browse template or filter JS.
**FRs covered:** FR-6, FR-7, FR-8, FR-9, FR-10, FR-11
**Sequencing:** Parallel after Epic 1. Reuses `event-card.njk` from Epic 2 (or can stub it if Epic 2 is not yet merged).

### Epic 4: Event Detail + SEO
Every event has a permanent, shareable URL with full details, a rich OG preview (iMessage, WhatsApp), and Schema.org Event markup for Google rich results. Developed test-first: E2E specs asserting JSON-LD presence and OG tag correctness are written as failing tests before the detail template.
**FRs covered:** FR-4, FR-12, FR-13
**Sequencing:** Parallel after Epic 1. Reuses event type images from Epic 2 (or stubs if not yet merged).

### Epic 5: Data Pipeline
The site builds from live Google Sheets data instead of the mock fixture. Data transformation logic (row parsing, slug generation, date classification) is covered by Vitest unit tests written before the implementation. After this epic merges, the full E2E suite runs against real event data to confirm no regressions.
**FRs covered:** (enables all FRs with live data from Google Sheets)
**Sequencing:** Parallel after Epic 1. Epic 6 (GitHub Actions) needs the service account secret configured, so coordinate with Epic 6.

### Epic 6: Build Pipeline & Production
The site self-updates: a Google Form submission triggers a GitHub Actions rebuild within 90 seconds. CI runs the full Vitest + Playwright suite as a pre-deploy gate. Plausible Analytics is live from the first deploy. Submit and Request a Change links appear in the footer.
**FRs covered:** FR-14, FR-16, FR-21 (FR-15 is the external Google Form Jason creates)
**Sequencing:** Depends on Epic 5 (service account secret must be in place). Can otherwise begin after Epic 1.

---

## Epic 1: Foundation & Test Infrastructure

**Goal:** Establishes the project scaffold, shared contracts, and test harness. Nothing else starts until this is complete.

### Story 1.1: Eleventy Project Initialization

As a developer,
I want the Eleventy v3.x project initialized with the correct directory structure and a running dev server,
So that all subsequent tracks have a working scaffold to build on.

**Acceptance Criteria:**

**Given** an empty project directory
**When** `npm create @11ty/eleventy@latest` is run
**Then** a valid Eleventy v3.x project exists with `package.json`, `.eleventy.js`, and `_site/` output on build

**Given** the initialized project
**When** `eleventy --serve` is run
**Then** a local dev server starts without errors and hot-reloads on file changes

**Given** the project structure
**When** reviewed
**Then** the following directories exist or are scaffolded: `_data/`, `_includes/`, `assets/css/`, `assets/js/`, `assets/images/event-types/`, `events/`, `tests/unit/`, `tests/e2e/`, `tests/fixtures/`, `scripts/`, `.github/workflows/`

**And** `.gitignore` excludes `_site/`, `node_modules/`

---

### Story 1.2: Event Data Model and Mock Fixture

As a developer agent working on any epic,
I want a documented event data model and a mock fixture with representative data covering all edge cases,
So that I can build and test templates without the real Sheets API.

**Acceptance Criteria:**

**Given** `_data/events.mock.js`
**When** created
**Then** it exports an array of event objects matching this canonical shape:
```js
{
  id: string,           // slug: {kebab-event-name}-{YYYY-MM-DD}
  name: string,
  date: string,         // ISO 8601
  startTime: string,
  endTime: string | null,
  venueName: string,
  venueAddress: string,
  cost: string | 'Free',
  eventType: 'Social Dancing' | 'Group Lesson' | 'Workshop' | 'Competition' | 'Convention',
  fitSignals: string[],
  description: string | null,
  sourceUrl: string | null,
  contactEmail: string,
  isRecurring: boolean,
  isToday: boolean,
  isPast: boolean
}
```

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

---

### Story 1.3: Base Layout, CSS Foundation, and Naming Conventions

As a developer agent,
I want a base Nunjucks layout with named blocks, a CSS custom property foundation, and a `NOTES.md` conventions reference,
So that all epics build on a consistent structure with no naming ambiguity.

**Acceptance Criteria:**

**Given** `_includes/base.njk`
**When** created
**Then** it contains the full HTML document skeleton with `{% block schema %}{% endblock %}`, `{% block meta %}{% endblock %}`, and `{% block content %}{% endblock %}` named blocks

**And** it includes a `<header>` with the site title only — no navigation in the header; primary navigation is the bottom tab bar defined in Story 1.5

**And** it includes a `<footer>` with: the FR-23 attribution text, a Submit link (FR-14 placeholder), and a Request a Change link (FR-16 placeholder)

**And** `_data/site.js` exports `{ name, baseUrl, ogDefaults }`

**Given** `assets/css/base.css`
**When** created
**Then** it defines all CSS custom properties matching DESIGN.md frontmatter **exactly** (do not use architecture.md placeholder values — those are outdated):
```css
/* Background & surfaces */
--color-bg: #101214;
--color-surface: #16181b;
--color-surface-border: rgba(240, 238, 234, 0.12);

/* Text */
--color-text-primary: #f0eeea;
--color-text-muted: rgba(240, 238, 234, 0.5);
--color-text-on-badge: #f0eeea;

/* Gold accent — structural only; never on text */
--color-gold: #c9a84c;
--color-gold-rule: rgba(201, 168, 76, 0.25);
--color-gold-badge-border: rgba(201, 168, 76, 0.28);
--color-gold-tab-active: rgba(201, 168, 76, 0.30);

/* Navigation */
--color-tab-bar-bg: #0d0f11;

/* Typography */
--font-display: 'Cinzel', serif;
--font-body: 'Josefin Sans', sans-serif;

/* Spacing */
--space-xs, --space-sm, --space-md, --space-lg, --space-xl
```

**Given** `NOTES.md` at project root
**When** read by any agent
**Then** it documents all naming conventions: URL filter param names, `data-*` attribute names, Nunjucks block names, CSS custom property names, canonical event type kebab values, Eleventy collection names, and custom Nunjucks filter names (per architecture doc)

---

### Story 1.4: Test Infrastructure (Vitest + Playwright)

As a developer,
I want Vitest and Playwright configured and a smoke E2E test passing,
So that the test-first workflow is operational before any feature work begins.

**Acceptance Criteria:**

**Given** `vitest.config.js`
**When** `npx vitest run` is executed
**Then** Vitest runs without errors (zero tests is a passing run at this stage)

**Given** `playwright.config.js`
**When** created
**Then** it configures three browser projects: Chromium, Firefox, WebKit

**And** it configures a `webServer` block pointing to `eleventy --serve` so Playwright starts the dev server automatically before tests run

**And** it targets `localhost` at the port Eleventy serves on

**Given** `tests/e2e/smoke.spec.js`
**When** `npx playwright test smoke` is run
**Then** it passes: the home page loads (HTTP 200), the `<h1>` "West Coast Swing in Tulsa" is present, and no console errors are thrown

**Given** `tests/fixtures/mock-events.js`
**When** created
**Then** it re-exports or mirrors the shape of `_data/events.mock.js` for use in unit test assertions

**And** `package.json` has scripts: `"test:unit": "vitest run"`, `"test:e2e": "playwright test"`, `"test": "vitest run && playwright test"`

---

### Story 1.5: Bottom Tab Bar Navigation

As a site visitor,
I want a bottom tab bar with TONIGHT, BROWSE, and ARCHIVE tabs that persists across all views,
So that I can navigate between views with one thumb without reaching for a top navigation bar.

**Acceptance Criteria:**

**Given** `_includes/base.njk` is updated with the bottom tab bar
**When** any page is rendered
**Then** a `<nav aria-label="Main navigation">` element is present at the bottom of the viewport containing exactly three tab links: TONIGHT (`/`), BROWSE (`/browse/`), ARCHIVE (`/archive/`)

**And** the HTML source text is lowercase ("tonight", "browse", "archive") — CSS applies `text-transform: uppercase` so screen readers announce the words naturally

**And** the active tab carries `aria-current="page"` — determined at build time by the page's URL

**And** each tab link is a minimum 44×44px tap target

**Given** `assets/css/base.css` (or a new `assets/css/tab-bar.css`)
**When** the tab bar styles are applied
**Then** the tab bar is fixed to the bottom of the viewport with `position: fixed; bottom: 0; left: 0; right: 0`

**And** it uses design tokens: `height: var(--tab-bar-height)` (56px), `background: var(--color-tab-bar-bg)` (`#0d0f11`), `border-top: 1px solid rgba(240,238,234,0.08)`, `border-radius: 0` (sharp top edge — no rounding)

**And** three equal-width columns fill the full viewport width

**And** inactive tab text is at 50% opacity (`color: rgba(240,238,234,0.5)`)

**And** the active tab has full-opacity text plus a `2px solid var(--color-gold-tab-active)` top-border indicator aligned to the top edge of the bar

**And** `main` page content has `padding-bottom: 56px` (or `var(--tab-bar-height)`) so the tab bar never obscures the bottom of the content

**Given** `tests/e2e/smoke.spec.js`
**When** updated to include tab bar assertions
**Then** the nav element is present, all three tab links exist, and the active tab on the home page has `aria-current="page"`

---

## Epic 2: Tonight View

**Goal:** Community dancers can visit the site and see tonight's WCS events. Empty state handles no-events nights and drives mailing list sign-ups. E2E specs are written first as failing tests, then the implementation makes them green.

**Depends on:** Epic 1 complete.

### Story 2.1: Tonight View E2E Specs (Failing Tests First)

As a developer,
I want failing Playwright E2E specs for all Tonight View behaviors written before any template code,
So that implementation is driven by the tests and every acceptance criterion has an automated check.

**Acceptance Criteria:**

**Given** `tests/e2e/tonight-view.spec.js`
**When** run against the current (empty) build
**Then** all tests FAIL (no implementation exists yet) — this is the expected and correct outcome at story completion

**And** the spec covers:
- Home page (`/`) renders without a 404 or 500
- Events with `isToday: true` in the mock fixture are visible on the page
- Events are ordered by start time ascending (first card's time ≤ second card's time)
- Each card displays: event name, formatted start time ("8:00 PM"), venue name, cost, event type badge
- A recurring event card shows the "Recurring" badge
- The hero `<h1>` text is exactly "West Coast Swing in Tulsa"
- The WCS intro paragraph is present on the page

**Given** `tests/e2e/tonight-empty.spec.js`
**When** run (with mock fixture patched to have no today events, or using a query param convention)
**Then** the spec covers:
- The empty state container is visible
- The text "QUIET TONIGHT." is visible **before** the subscribe copy — this orientation line must precede the pitch so users know the page is working, not broken
- A `[aria-hidden="true"]` diamond ornament element is present between the "QUIET TONIGHT." line and the subscribe copy
- The exact empty-state copy is present: "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them."
- An email `<input>` and submit `<button>` are visible
- A "BROWSE UPCOMING" link is present and its `href` points to the Browse View (`/browse/`)

**Given** `tests/e2e/mobile-layout.spec.js`
**When** run at 320px viewport width
**Then** the spec covers:
- The home page renders without horizontal overflow (`document.documentElement.scrollWidth <= 320`)
- All event card content is visible (no clipping test via screenshot or DOM check)

---

### Story 2.2: Tonight View Template and Event Card

As a community dancer,
I want the home page to show tonight's events sorted by start time with all required card fields,
So that I can immediately see what is happening and decide whether to go out.

**Acceptance Criteria:**

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

**And** the five event type placeholder images exist in `assets/images/event-types/` (social-dancing.jpg, group-lesson.jpg, workshop.jpg, competition.jpg, convention.jpg) and are used by event cards

**And** recurring events show a "Recurring" badge (FR-20)

**Given** the Tonight View at 320px viewport
**When** rendered
**Then** no horizontal scrolling occurs and all card content is readable

---

### Story 2.3: Empty State and Buttondown Mailing List Embed

As a community dancer finding no events tonight,
I want a helpful empty state with a subscribe form that works without cookies or a server,
So that I don't feel the site is broken and I have a path forward.

**Acceptance Criteria:**

**Given** `_includes/empty-state.njk` is implemented
**When** `npx playwright test tonight-empty` is run
**Then** all tests written in Story 2.1 PASS (green)

**Given** `_includes/empty-state.njk`
**When** rendered
**Then** it contains a plain HTML form pointing to Buttondown's embed endpoint — no iframe, no tracking pixel, no cookie

**And** the form has one `<input type="email" required>` and one `<button type="submit">`

**And** submitting with JavaScript disabled still works (direct HTML form POST to Buttondown)

**And** the Buttondown account is configured and the endpoint URL is verified to accept submissions before marking this story complete

**And** a secondary placement of the subscribe form is added to `index.njk` or `_includes/base.njk` (location chosen at implementation time; location documented in `NOTES.md` per FR-18)

---

## Epic 3: Browse & Archive Views

**Goal:** Dancers can browse and filter all upcoming events by type, fit signals, and date with URL-persistent state. Archive is accessible for past events. E2E specs written first as failing tests.

**Depends on:** Epic 1 complete. Reuses `event-card.njk` from Epic 2 (stub if Epic 2 not yet merged).

### Story 3.1: Browse & Archive E2E Specs (Failing Tests First)

As a developer,
I want failing Playwright E2E specs for Browse filtering and Archive written before any implementation,
So that the filter logic and URL state behavior are defined by tests, not discovered after the fact.

**Acceptance Criteria:**

**Given** `tests/e2e/browse-filter.spec.js`
**When** run against the current build
**Then** all tests FAIL (no Browse View implementation exists yet)

**And** the spec covers:
- `/browse` renders without a 404 or 500
- All upcoming events (today + future) from mock fixture are visible by default
- Selecting an Event Type filter hides non-matching cards
- Selecting a Fit Signal filter hides non-matching cards
- Selecting both a type and a fit signal applies AND logic (only cards matching both are visible)
- Deselecting all filters restores all event cards
- After applying a type filter, the URL contains `?type={kebab-value}`
- After applying a fit signal filter, the URL contains `?signal={kebab-value}`
- Loading `/browse?type=social-dancing` pre-applies the Social Dancing filter (correct cards visible on load)
- Loading `/browse?type=social-dancing,workshop` shows both Social Dancing and Workshop events (OR within category)

**Given** `tests/e2e/archive.spec.js`
**When** run
**Then** all tests FAIL

**And** the spec covers:
- `/archive` renders without a 404 or 500
- Past events from mock fixture are visible
- Upcoming and today events are NOT visible in the Archive
- An Archive link is present in the site navigation

---

### Story 3.2: Browse View Template

As a community dancer,
I want to see all upcoming events on a Browse page with filter controls,
So that I can find events that match my type and fit signal preferences.

**Acceptance Criteria:**

**Given** `browse.njk` and `_includes/filter-controls.njk` are implemented
**When** `npx playwright test browse-filter` is run
**Then** the "renders without 404", "all events visible by default", and "filter controls present" tests PASS; filter-behavior tests remain RED until Story 3.3

**Given** `browse.njk`
**When** rendered with mock fixture
**Then** it lists all events where `isPast: false`, sorted by `date` + `startTime` ascending

**And** each card has correct `data-*` attributes (matching the spec in Story 2.2)

**Given** `_includes/filter-controls.njk`
**When** rendered
**Then** it contains filter UI for: Event Type multi-select (5 options) and Fit Signal multi-select (5 options) and a date filter input

**And** filter option values use canonical kebab-case values (e.g., `social-dancing`, not `Social Dancing`)

---

### Story 3.3: Client-Side Filter JS

As a community dancer using the Browse View,
I want filter selections to update results instantly and be reflected in the URL,
So that I can bookmark a filtered view and share it with others.

**Acceptance Criteria:**

**Given** `assets/js/browse-filter.js` is implemented and loaded on the Browse View
**When** `npx playwright test browse-filter` is run
**Then** ALL Browse filter tests written in Story 3.1 PASS (green)

**Given** `browse-filter.js`
**When** reviewed
**Then** it contains zero npm dependencies (pure vanilla JS + `URLSearchParams` API)

**And** it is ≤150 lines

**And** filter changes toggle the `hidden` attribute on non-matching cards (no page reload, no re-render)

**And** filter state is written to URL via `history.pushState` before the filter is applied

**And** on page load, filter state is read from URL params and pre-applied

---

### Story 3.4: Archive View

As a community dancer or organizer,
I want to access past events through an Archive View,
So that I can reference events that have already happened.

**Acceptance Criteria:**

**Given** `archive.njk` is implemented
**When** `npx playwright test archive` is run
**Then** ALL Archive tests written in Story 3.1 PASS (green)

**Given** `archive.njk`
**When** rendered
**Then** it lists all events where `isPast: true`, sorted by date descending (most recent first)

**And** it reuses `event-card.njk`

**And** the ARCHIVE tab is present in the bottom tab bar (defined in Story 1.5) — no Archive link exists in the site header

---

## Epic 4: Event Detail + SEO

**Goal:** Every event has a permanent shareable URL with full data, rich OG preview, and Schema.org Event markup. E2E specs written first as failing tests.

**Depends on:** Epic 1 complete. Event type images from Epic 2 (stubs acceptable).

### Story 4.1: Event Detail E2E Specs (Failing Tests First)

As a developer,
I want failing Playwright E2E specs for event detail pages — including Schema.org JSON-LD and OG tag assertions — written before the detail template,
So that SEO requirements are verified by tests and cannot regress silently.

**Acceptance Criteria:**

**Given** `tests/e2e/event-detail.spec.js`
**When** run against the current build
**Then** all tests FAIL (no event detail pages exist yet)

**And** the spec covers:
- Clicking an event card on the Tonight View navigates to a URL matching `/events/{slug}/`
- The event detail page renders without a 404
- The page `<h1>` contains the event name
- The formatted date, venue name, and cost are present on the page
- A `<script type="application/ld+json">` element is present in `<head>`
- The JSON-LD parses as valid JSON
- The JSON-LD contains `"@type": "Event"`, `"name"`, `"startDate"`, and `"location"`
- `<meta property="og:title">` is present with the event name
- `<meta property="og:description">` is present
- `<meta property="og:image">` is present and points to the event type placeholder image
- A recurring event detail page shows the "Recurring" badge

---

### Story 4.2: Event Detail Page, Schema.org, OG Tags, and Sitemap

As a community dancer or organizer,
I want every event to have a permanent URL with full details, rich social previews, and Google rich result eligibility,
So that events are shareable and discoverable beyond the site itself.

**Acceptance Criteria:**

**Given** `events/event-detail.njk`, Schema.org blocks, and OG tag blocks are implemented
**When** `npx playwright test event-detail` is run
**Then** ALL event detail tests written in Story 4.1 PASS (green)

**Given** the Eleventy pagination config in `events/event-detail.njk`
**When** the build runs
**Then** one HTML page is generated per event at `events/{id}/index.html`

**And** slug collision is handled: if two events produce the same `{kebab-name}-{YYYY-MM-DD}`, the second gets `-2` appended

**Given** the `{% block schema %}` override in `event-detail.njk`
**When** rendered
**Then** it outputs a single `<script type="application/ld+json">` containing valid Schema.org `Event` with: `@context`, `@type: "Event"`, `name`, `startDate`, `endDate` (if present), `location` (PostalAddress), `description` (if present), `url`, `image` (event type placeholder path)

**Given** the `{% block meta %}` override in `event-detail.njk`
**When** rendered
**Then** it outputs: `og:title` (event name), `og:description` (truncated description or venue+date fallback), `og:image` (event type placeholder image URL), `og:url` (canonical event URL)

**Given** `@11ty/eleventy-plugin-sitemap` configured in `.eleventy.js`
**When** the build runs
**Then** `_site/sitemap.xml` is generated and `robots.txt` references it

**And** the Schema.org output is manually verified against Google's Rich Results Test before Epic 6 CI is wired up

---

## Epic 5: Data Pipeline

**Goal:** Replace the mock fixture with the real Google Sheets integration. Unit tests written first as failing tests; implementation makes them green. After merge, the full E2E suite runs against real data.

**Depends on:** Epic 1 complete. Coordinate with Epic 6 for service account secret.

### Story 5.1: Data Transformation Unit Tests (Failing Tests First)

As a developer,
I want failing Vitest unit tests for all data transformation functions written before any implementation,
So that `events.js` is built to satisfy explicit, runnable contracts rather than implicit assumptions.

**Acceptance Criteria:**

**Given** `tests/unit/events-parser.test.js`
**When** `npx vitest run` is executed
**Then** all tests FAIL (no `events.js` implementation exists yet)

**And** the test file covers:
- Parsing a complete, valid row into the canonical event object shape
- `endTime` empty in sheet → `endTime: null` in output
- `description` empty → `description: null`
- `sourceUrl` empty → `sourceUrl: null`
- Missing required field `name` → row is skipped (function returns `null` or filters it out)
- Missing required field `date` → row skipped
- Missing required field `startTime` → row skipped
- Missing required field `venueName` → row skipped
- Missing required field `cost` → row skipped
- Missing required field `eventType` → row skipped
- Skipped rows produce a `console.warn` with the row index and missing field name

**Given** `tests/unit/slug-generator.test.js`
**When** run
**Then** all tests FAIL

**And** covers:
- Normal event name + date → correct `kebab-name-YYYY-MM-DD` slug
- Event name with spaces → spaces become hyphens
- Event name with apostrophes/special chars → stripped or replaced
- Two events with identical name + date → first gets base slug, second gets `-2` appended

**Given** `tests/unit/date-classifier.test.js`
**When** run
**Then** all tests FAIL

**And** covers:
- Event date equals today → `isToday: true`, `isPast: false`
- Event date is tomorrow → `isToday: false`, `isPast: false`
- Event date was yesterday → `isPast: true`, `isToday: false`
- Event date is one month ago → `isPast: true`

---

### Story 5.2: Google Sheets Service Account and API Integration

As the Eleventy build process,
I want `_data/events.js` to fetch all rows from Google Sheets and produce the canonical event array,
So that the site always reflects the live state of the events sheet.

**Acceptance Criteria:**

**Given** a Google Cloud service account with read-only access to the events sheet
**When** `GOOGLE_SERVICE_ACCOUNT_JSON` is available (locally via an `.env` file excluded from git, or in CI via GitHub Actions secret)
**Then** `_data/events.js` fetches all rows via the `googleapis` SDK and returns the parsed event array

**Given** `npx vitest run` is executed after `events.js` is implemented
**Then** ALL unit tests written in Story 5.1 PASS (green)

**And** the service account JSON key is stored as the `GOOGLE_SERVICE_ACCOUNT_JSON` GitHub Actions secret

**And** no credentials are committed to the repository

**And** the events Google Sheet is shared with the service account's email address with Viewer access

---

### Story 5.3: Swap Mock Data for Real Data

As Jason (operator),
I want the Eleventy build to use the real Sheets integration and for all existing E2E tests to pass,
So that the site I deploy is driven by live data and all prior test coverage still holds.

**Acceptance Criteria:**

**Given** `.eleventy.js` is updated to use `events.js` instead of `events.mock.js`
**When** `npx playwright test` (full suite) is run against a real-data build
**Then** all E2E tests pass (Tonight, Browse filter, event detail, mobile, smoke)

**And** if any E2E test fails with real data, the failure is investigated and resolved before this story is marked complete — the E2E suite is the acceptance gate, not optional

**And** `events.mock.js` remains in the repo (used in unit tests and as a local dev fallback)

---

## Epic 6: Build Pipeline & Production

**Goal:** The site self-updates: Google Form submission → GitHub Actions rebuild → live within 90 seconds. CI runs the full Vitest + Playwright suite as a pre-deploy gate. Plausible Analytics active. Submit and change request links in footer.

**Depends on:** Epic 5 (service account secret in place). Can begin after Epic 1 otherwise.

### Story 6.1: GitHub Actions CI/CD Workflow

As Jason (operator),
I want GitHub Actions to build and deploy the site automatically, running all tests before any deploy,
So that no broken build ever reaches production and events go live without manual intervention.

**Acceptance Criteria:**

**Given** `.github/workflows/build-deploy.yml`
**When** triggered (`workflow_dispatch` or push)
**Then** the workflow runs in this order: checkout → `npm ci` → `npx vitest run` → `npx playwright test` → `eleventy` build → GitHub Pages deploy

**And** if Vitest fails, subsequent steps do not run and the previous deploy remains live

**And** if Playwright fails, the build and deploy steps do not run and the previous deploy remains live

**And** if the Eleventy build fails, the deploy step does not run

**And** GitHub Actions sends a failure notification email to Jason on any step failure (via default GitHub failure notification — no custom setup required)

**And** `GOOGLE_SERVICE_ACCOUNT_JSON` is consumed from GitHub Actions secrets — never hardcoded

**And** build time from workflow trigger to live deploy is under 90 seconds under normal conditions

---

### Story 6.2: Google Apps Script Form Trigger

As an event organizer,
I want my Google Form submission to automatically trigger a site rebuild,
So that my event goes live within minutes without any action from Jason.

**Acceptance Criteria:**

**Given** `scripts/google-apps-script.js` (stored in repo for version control; deployed manually to Google Apps Script)
**When** a Google Form is submitted
**Then** the script calls the GitHub Actions `workflow_dispatch` API to trigger `build-deploy.yml`

**And** the script uses `GITHUB_TOKEN` stored as a Google Apps Script script property (not hardcoded)

**And** the script is ~20 lines or fewer

**And** `NOTES.md` documents the manual deployment steps for this script (copy-paste into Google Apps Script; it runs in Google's V8 environment, not Node.js)

---

### Story 6.3: Footer Links and Plausible Analytics

As an event organizer wanting to submit an event,
I want a visible Submit link in the footer that takes me to the Google Form,
So that I can submit without needing Jason's contact details.

As Jason and Jubilee (curators),
I want cookieless telemetry active from the first deploy,
So that we can see site usage from day one without a consent banner.

**Acceptance Criteria:**

**Given** `_includes/base.njk`
**When** rendered
**Then** a Submit link in the footer points to the Google Form URL for event submission (FR-14)

**And** a Request a Change link in the footer points to the separate change request Google Form (FR-16)

**And** the Plausible Analytics `<script>` tag is present in `<head>` with the correct `data-domain` (FR-21)

**And** the Plausible embed sets no cookies and requires no consent banner

**And** the Plausible account is created, the site domain is added, and a test pageview is confirmed before marking this story done

**And** `NOTES.md` documents the Umami self-hosted on Railway free tier as the zero-cost alternative if the Plausible trial cost becomes a constraint

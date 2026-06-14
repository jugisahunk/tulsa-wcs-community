---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-06-13'
inputDocuments:
  - '_bmad-output/planning-artifacts/prds/prd-wcs-events-2026-06-13/prd.md'
workflowType: 'architecture'
project_name: 'wcs-events'
user_name: 'Jason'
date: '2026-06-13'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (23 total):**

- Tonight View (FR-1–5): Default landing showing today's events sorted by start time; empty state drives mailing list subscribe
- Browse View (FR-6–10): All upcoming events with date and attribute filtering; filter state reflected in URL; client-side, no reload
- Archive View (FR-11): Past events, accessible but not promoted
- Event Detail Pages (FR-12–13): Permanent URLs; pre-rendered Schema.org Event + Open Graph tags on every page
- Submit & Change (FR-14–16): Google Form links in footer; no submission UI on the site itself
- Onboarding & Mailing List (FR-17–18): One static WCS intro paragraph; serverless email subscribe embed
- Visuals & Recurring (FR-19–20): Five default images keyed by event type; recurring event badge; no automation
- Telemetry & Footer (FR-21–23): Cookieless analytics (Plausible or equivalent); attribution footer

**Non-Functional Requirements:**

- Performance: < 2s load on mid-range Android 4G — static assets only, no client-side data fetching on initial load
- Reliability: Build failures must leave previous deploy live and notify Jason; no silent outages
- Accessibility: WCAG AA minimum (AAA preferred); semantic HTML; keyboard navigation; alt text on all images
- SEO: Schema.org Event on every detail page; OG tags on every event page; no JS-required content rendering
- Privacy: No cookies, no tracking pixels, no third-party embeds that set cookies; cookieless telemetry only
- Browser support: Last 2 major versions of Chrome, Safari, Firefox, Edge; no IE11
- Cost: Zero recurring infrastructure cost for MVP

**Scale & Complexity:**

- Primary domain: Static web / JAMstack
- Complexity level: Low
- Estimated architectural components: SSG build script, GitHub Actions pipeline, Google Sheets integration, client-side filter layer, mailing list embed

### Technical Constraints & Dependencies

- **No database** — Google Sheets is the single source of truth; all data access is at build time
- **No server** — GitHub Pages static hosting only; mailing list integration must require no backend
- **No auth** — public site; curators manage content directly in Google Sheets
- **Build pipeline**: Google Form submit → Google Apps Script → GitHub Actions workflow_dispatch → Sheets read → SSG → Pages deploy; target < 90s end to end
- **Secrets**: Google Sheets API key and GitHub token in GitHub Actions secrets only; never in repo
- **Design constraints are locked**: Near-black/white palette; display serif headings + sans-serif body; mobile-first; hero is headline only

### Cross-Cutting Concerns Identified

1. **Static pre-rendering** — all pages (Tonight, Browse, Archive, event detail) generated at build time; no dynamic server
2. **SEO technology choice** — Schema.org Event markup and Open Graph tags must be pre-rendered at build time; the SSG must support structured data injection per page without client-side rendering; SEO tooling/validation approach needs an explicit decision
3. **Client-side URL-reflected filtering** — Browse View filter state must be bookmarkable without page reload; technology choice (vanilla JS vs lightweight library) is an open architectural decision
4. **Telemetry technology choice** — Plausible is named in the PRD; the integration must be cookieless, script-tag only, and require no backend; final provider selection and embed approach need a decision
5. **Unit testing strategy** — The build pipeline and data transformation logic (Sheets → event model → HTML) are the primary testable units; an explicit testing framework choice and scope boundary need a decision
6. **E2E testing strategy** — Key journeys (Tonight View loads, Browse filtering works, event detail page renders with correct Schema.org markup, empty state shows subscribe field) should be covered; tool choice and when tests run (CI on every build vs pre-deploy gate) need a decision
7. **Mobile-first responsive layout** — all views, with Tonight View prioritized for one-handed phone use
8. **WCAG AA accessibility** — semantic HTML, keyboard navigation, color contrast on all interactive elements
9. **Privacy** — no cookies or personal data anywhere on the site; cookieless telemetry only
10. **Build reliability** — failure handling (previous deploy stays live) and failure notification must be wired throughout the pipeline

## Starter Template Evaluation

### Primary Technology Domain

Static web / JAMstack — build-time data pipeline, zero client-side data fetching on initial load, plain HTML/CSS/JS output hosted on GitHub Pages.

### Starter Options Considered

- **Eleventy (11ty) v3.x** — Node.js, zero-JS default, flexible data pipeline, no prescribed client-side framework
- **Astro v4/5** — TypeScript-first, component model, content collections; more opinionated than project requires

### Selected Starter: Eleventy (11ty) v3.x

**Rationale for Selection:**
Eleventy's zero-JS default, first-class custom data file support, and Node.js runtime align directly with the project constraints: Google Sheets API integration at build time, plain HTML output for < 2s load performance, and per-page Schema.org injection without a plugin. Its lack of opinions about client-side JS means the Browse View filter layer can be added as minimal vanilla JS without fighting the framework.

**Initialization Command:**

```bash
npm create @11ty/eleventy@latest
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:** Node.js / JavaScript (TypeScript optional via config)

**Templating:** Nunjucks (recommended for layout inheritance and macro support) or Liquid

**Build Tooling:** Eleventy CLI; output is static HTML/CSS/JS — no bundler required for MVP; Vite or esbuild can be added later if client-side JS grows

**Testing Framework:** Not included — explicit decisions for unit and E2E testing to be made in Step 4

**Code Organization:** File-based routing; `_data/` for build-time data sources (Sheets integration lives here); `_includes/` for layouts and partials

**Development Experience:** `eleventy --serve` for local dev with hot reload; `eleventy` for production build

**Note:** Project initialization using this command should be the first implementation story.

## Implementation Patterns & Consistency Rules

### Naming Patterns

**File naming:** `kebab-case` for all files
- Templates: `event-card.njk`, `browse-view.njk`
- JS: `filter.js`, `url-state.js`
- CSS: `base.css`, `event-card.css`

**CSS class naming:** Simple descriptive `kebab-case` — no BEM
- `.event-card`, `.event-card-title`, `.event-type-badge`, `.filter-controls`
- Rationale: Plain kebab-case is readable and collision-safe at this scale; BEM overhead is not justified

**CSS custom property naming:** `--{category}-{property}` pattern
```css
--color-bg: #0f0e0d;
--color-surface: #1a1917;
--color-text-primary: #f5f4f0;
--color-text-muted: #8a8680;
--font-display: 'Font Name', serif;
--font-body: 'Font Name', sans-serif;
--space-xs / --space-sm / --space-md / --space-lg / --space-xl
```

**URL filter param names (Browse View):**
```
?type=social-dancing,workshop       // event type, comma-separated, kebab-case values
?signal=beginner-friendly           // fit signal, comma-separated, kebab-case values
?date=2026-06-14                    // ISO date string
```

**`data-*` attribute names (Browse View card elements):**
```html
data-event-type="social-dancing"
data-fit-signals="beginner-friendly,partner-welcome"
data-event-date="2026-06-14"
data-is-today="true"
data-is-past="false"
```

**Eleventy collection names:**
- `collections.events` — all events
- `collections.upcomingEvents` — today + future
- `collections.pastEvents` — past only
- `collections.todayEvents` — today only

**Eleventy custom filter names (Nunjucks):**
- `| formatDate` — "Saturday, June 14"
- `| formatTime` — "8:00 PM"
- `| formatDateShort` — "Jun 14"
- `| slugify` — converts event name + date to URL-safe slug (Eleventy built-in)

**Slug format:** `{kebab-event-name}-{YYYY-MM-DD}`
- Example: `tulsa-swing-social-2026-06-14`
- Collision handling: append `-2` if duplicate slug exists

**Event type canonical values (URL-safe / data-attribute):**
```
social-dancing, group-lesson, workshop, competition, convention
```
Display labels are the PRD values; URL and `data-*` values are the kebab versions above.

---

### Structure Patterns

**Project layout:**
```
/
├── _data/
│   ├── events.js            // real Sheets integration (Track 1)
│   └── events.mock.js       // mock fixture (Track 0)
├── _includes/
│   ├── base.njk             // base layout
│   ├── event-card.njk       // reusable card partial
│   └── filter-controls.njk
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── event-card.css
│   │   └── browse-filters.css
│   ├── js/
│   │   └── browse-filter.js
│   └── images/
│       └── event-types/     // 5 placeholder images
├── events/                  // event detail pages (generated)
├── tests/
│   ├── unit/                // Vitest tests
│   └── e2e/                 // Playwright tests
├── index.njk                // Tonight View
├── browse.njk               // Browse View
├── archive.njk              // Archive View
└── .eleventy.js
```

**Test file naming:**
- Unit: `tests/unit/{module-name}.test.js` (e.g., `events-parser.test.js`)
- E2E: `tests/e2e/{view-name}.spec.js` (e.g., `tonight-view.spec.js`, `browse-filter.spec.js`)

---

### Format Patterns

**Date/time display (all views must match):**
- Full date: `Saturday, June 14` (omit year unless different from current year)
- Short date: `Jun 14`
- Time: `8:00 PM` (12-hour, no leading zero on hour, always show minutes)
- Date + time: `Saturday, June 14 · 8:00 PM`

**Cost display:**
- Free: `Free`
- Paid: `$15` (no decimals unless cents, e.g., `$12.50`)

**Recurring badge text:** `Recurring`

**Empty state copy (locked — from PRD):** `"Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them."`

---

### Process Patterns

**Build-time data errors:** Log warning with row index + missing field name, skip row, continue build. Never throw — build must always complete and leave previous deploy intact.

**JS filter logic:**
- AND across categories (type AND signal AND date)
- OR within a category (social-dancing OR workshop)
- No active filters = show all events
- Filter state serialized to URL before `history.pushState`; read from URL on page load

**Nunjucks block inheritance:** Always call `{{ super() }}` in child blocks that extend rather than replace parent content.

**Schema.org JSON-LD:** Output as a single `<script type="application/ld+json">` block; use Nunjucks `| dump` filter to serialize the event object; validate against Google's Rich Results Test before Track 6 E2E is written.

---

### Enforcement Guidelines

**All agents MUST:**
- Use `events.mock.js` as the data source until Track 1 is merged — never hardcode event data inline in templates
- Follow the `data-*` attribute names exactly as specified — the filter JS depends on them
- Use canonical kebab-case event type values in `data-event-type` — never the display labels
- Run `eleventy --serve` locally and verify the page renders before declaring a track complete
- Not introduce any `npm` dependencies beyond those listed in this document without flagging it

**Pattern violations:** Document in a `NOTES.md` at project root during development; review at Track merge points.

---

### Agent Orchestration Strategy

This project uses a **Sonnet-orchestrates, Haiku-executes** model. Track 0's contracts and naming conventions are the foundational artifact that makes Haiku viable — any ambiguity left in Track 0 becomes a Haiku failure mode. The tighter the spec, the cheaper the execution.

**Model: `claude-sonnet-4-6`** — Orchestrator + complex worker tasks:
- Track 0 — Foundation: defining contracts, event model, mock fixture, naming conventions (judgment-heavy; downstream agents depend on this output)
- Track 1 — Data Pipeline: Sheets API integration, row normalization, error handling logic
- Track 4 — Vanilla JS filter layer: AND/OR logic, URLSearchParams, `history.pushState`
- Track 2 — Browse View template + filter controls UI (borderline complexity; layout + JS interface)
- Track 6 — Playwright E2E tests: judgment required for meaningful assertions
- All merge-point reviews: verifying two tracks integrate correctly before proceeding

**Model: `claude-haiku-4-5-20251001`** — Worker agents for well-bounded, spec-driven tasks:
- Track 2 — Tonight View (`index.njk`) + event card partial: HTML templating against known event model and named block slots
- Track 2 — Archive View (`archive.njk`): simple list template
- Track 3 — Schema.org JSON-LD block: serializing a known object shape into a known JSON-LD format
- Track 3 — OG tags block: known fields, known format
- Track 3 — Sitemap plugin wiring: one config addition in `.eleventy.js`
- Track 4 — Plausible embed: script tag in base layout
- Track 4 — Buttondown embed: HTML form in Tonight View empty state
- Track 5 — GitHub Actions YAML: well-defined pipeline steps, no ambiguity
- Track 5 — Google Apps Script: `workflow_dispatch` trigger, ~20 lines
- Track 1 — Vitest unit tests: pure functions with known inputs/outputs

**Orchestration flow:**
1. Sonnet completes Track 0 and produces the contracts doc + mock fixture
2. Sonnet spins up Haiku workers for bounded tracks; runs its own complex tracks in parallel
3. Sonnet reviews each Haiku output at track completion before merge
4. Sonnet handles all Track merge points and integration verification
5. Sonnet writes Track 6 E2E tests after all tracks merge

**Key constraint:** Haiku workers receive the Track 0 conventions doc + mock fixture + their specific track scope as context. They do not need visibility into other tracks. Sonnet holds the cross-track view.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Google Sheets access method: Sheets API with service account
- CSS approach: Plain CSS with custom properties
- Client-side filtering: Vanilla JS + URLSearchParams
- Unit testing: Vitest
- E2E testing: Playwright

**Important Decisions (Shape Architecture):**
- Mailing list provider: Buttondown
- Telemetry provider: Plausible Cloud (note: paid after trial — ~$9/mo; revisit if zero-cost constraint is firm through Phase 2)
- Schema.org injection: Inline JSON-LD in Nunjucks layout template
- Sitemap generation: @11ty/eleventy-plugin-sitemap

**Deferred Decisions (Post-MVP):**
- Bundler (Vite/esbuild): Add only if client-side JS grows beyond ~150 lines
- CSS preprocessor: Not needed for MVP

---

### Data Architecture

**Google Sheets Access Method:** Sheets API with service account
- Service account JSON credentials stored in GitHub Actions secrets
- Node.js `googleapis` SDK used in Eleventy `_data/events.js` data file
- Build script fetches all rows, parses into event objects, separates upcoming vs. past by date
- Rationale: Matches PRD secret management requirements; supports private sheets; more robust than public CSV export

**Data Validation:** Build-time validation in the data file — malformed rows (missing required fields: name, date, start time, venue, cost, event type) are logged as warnings and skipped; build does not fail on bad data, preserving the "previous deploy stays live" reliability model

**Event Data Model (canonical shape):**
```js
{
  id: string,           // slug, generated from name + date
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
  contactEmail: string, // not exposed in output
  isRecurring: boolean,
  isToday: boolean,     // computed at build time
  isPast: boolean       // computed at build time
}
```

---

### Authentication & Security

**No user-facing auth** (PRD constraint)

**Sheets API credentials:** Service account with read-only access to the events sheet; JSON key stored as GitHub Actions secret `GOOGLE_SERVICE_ACCOUNT_JSON`; never committed to repository

**Secrets inventory:**
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Sheets API read access
- `GITHUB_TOKEN` — GitHub Actions built-in; used by Google Apps Script workflow_dispatch trigger

---

### Frontend Architecture

**CSS Approach:** Plain CSS with custom properties
- No build step, no dependency, full control over the locked design system (near-black/white, display serif + sans-serif)
- CSS custom properties for typography scale, spacing, and the two-color palette
- Rationale: The locked design constraints (no accent hue, typography-driven hierarchy) are better served by explicit CSS than utility classes

**Client-Side Filtering (Browse View):** Vanilla JS + URLSearchParams API
- Pre-rendered event data embedded as `data-*` attributes on event cards at build time
- JS reads URL params on load, applies filters by toggling `hidden` attribute on cards
- Filter changes update `URLSearchParams` and push to `history` — no page reload
- Zero runtime dependencies; ~100 lines of JS
- Rationale: Matches zero-JS-by-default posture; URLSearchParams is well-supported across all target browsers

**Mailing List Provider:** Buttondown
- Free tier (up to 100 subscribers, sufficient for Phase 1 and early Phase 2)
- Embed: plain HTML form (no iframe, no tracking pixel, no cookie)
- Matches privacy NFR exactly
- Rationale: Cleanest privacy posture of the options; simple embed; free tier covers Phase 2 milestone (50 subscribers)

---

### Telemetry

**Provider:** Plausible Analytics (Cloud)
- Script tag in base Nunjucks layout; cookieless; no consent banner required
- Cost: ~$9/month after trial — only recurring cost in the stack; revisit against zero-cost constraint before Phase 2 if needed
- Alternative if cost becomes a constraint: Umami self-hosted on Railway free tier (open source, cookieless, same privacy posture)
- Rationale: PRD names Plausible explicitly; best-in-class privacy-respecting analytics DX

---

### SEO

**Schema.org Injection:** Inline JSON-LD in Nunjucks layout template
- Base layout has an empty `{% block schema %}{% endblock %}` slot
- Event detail page template overrides the block with a `<script type="application/ld+json">` tag populated from the event object
- No plugin dependency; output is fully pre-rendered (no JS required for indexing)
- Rationale: Direct, zero-dependency, trivially testable by asserting JSON-LD presence in E2E tests

**Open Graph Tags:** Nunjucks `{% block meta %}` slot in base layout
- Tonight/Browse/Archive pages get generic site-level OG tags
- Event detail pages override with event-specific title, description, and image (event type placeholder image per FR-19)

**Sitemap:** `@11ty/eleventy-plugin-sitemap` (official Eleventy plugin)
- Auto-generates `sitemap.xml` from all output pages
- `robots.txt` referencing sitemap included in build output

---

### Testing

**Unit Testing: Vitest**
- ESM-native, zero config friction with Eleventy's ESM setup
- Test scope: data transformation functions (row parsing, slug generation, date filtering — today/upcoming/past, fit signal normalization)
- Tests run as part of GitHub Actions build before Eleventy build step
- Rationale: Modern Node.js/ESM default; faster than Jest; no CJS compatibility shims needed

**E2E Testing: Playwright**
- Multi-browser coverage (Chromium, Firefox, WebKit) matching the browser support NFR
- Key journeys covered:
  1. Tonight View — events render for today, sorted by start time
  2. Tonight View empty state — subscribe field visible, Browse Upcoming link present
  3. Browse View filtering — attribute filters apply correctly; URL reflects state; bookmarkable URL loads filtered results
  4. Event detail page — Schema.org JSON-LD present and valid structure; OG tags present
  5. Mobile layout — Tonight View renders correctly at 320px width
- **E2E runs:** Every CI build (pre-deploy gate) — maximum safety, catches regressions before any deploy goes live
- Rationale: Schema.org and OG tag validation are natural DOM assertions; multi-browser coverage matches support NFR; GitHub Actions Playwright support is first-class

---

### Infrastructure & Deployment

**Hosting:** GitHub Pages (PRD constraint)

**CI/CD:** GitHub Actions (PRD constraint)

**Build trigger:** Google Apps Script → `workflow_dispatch` API on form submit (PRD Section 9)

**Build failure behavior:** Previous deploy stays live; GitHub Actions default email notification to Jason on failure

**Environment configuration:** All secrets via GitHub Actions secrets; no `.env` files; no secrets in repository

---

### Decision Impact Analysis

**Multi-Agent Implementation Structure:**

This project is structured for parallel agent development. Work fans out into independent tracks after a short foundation step. Agents in Tracks 1–5 can run simultaneously (overnight batches, etc.); Track 6 gates on all prior tracks merging.

---

**Track 0 — Foundation** *(serial — all other tracks block on this)*
- Eleventy project init (`npm create @11ty/eleventy@latest`)
- Base Nunjucks layout skeleton (`_includes/base.njk`) with named blocks: `{% block schema %}`, `{% block meta %}`, `{% block content %}`
- Event data model contract (JSDoc `@typedef` — canonical shape agreed and documented)
- Mock data fixture (`_data/events.mock.js`) — hardcoded array of valid event objects covering all event types, fit signals, today/upcoming/past states, recurring flag, and null optional fields
- Naming conventions doc: URL filter param names, `data-*` attribute names for filter JS, Nunjucks block names, CSS custom property names

---

**Track 1 — Data Pipeline** *(parallel after Track 0)*
- Google Sheets service account setup (IAM, credentials JSON in GitHub Actions secret)
- `_data/events.js` — real Sheets API fetch via `googleapis` SDK, row parsing, field normalization, slug generation, today/upcoming/past date classification
- Vitest unit tests: row parsing, slug generation, date filtering, malformed row handling (skip + warn)

**Track 2 — Views** *(parallel after Track 0; uses mock data fixture)*
- Tonight View template (`index.njk`) + event card component (`_includes/event-card.njk`)
- Browse View template (`browse.njk`) — server-rendered event list with `data-*` attributes; filter UI controls
- Archive View template (`archive.njk`)

**Track 3 — Event Detail + SEO** *(parallel after Track 0; uses mock data fixture)*
- Event detail page template (`events/[slug].njk`)
- Schema.org JSON-LD `{% block schema %}` — `Event` type with all required and recommended fields
- OG tags `{% block meta %}` — event-specific title, description, image (event type placeholder)
- Sitemap plugin (`@11ty/eleventy-plugin-sitemap`) + `robots.txt`

**Track 4 — Frontend JS + Integrations** *(parallel after Track 0)*
- Vanilla JS filter layer — reads `data-*` attributes from Browse View cards, applies AND/OR filter logic, toggles `hidden`, syncs with `URLSearchParams`, pushes to `history`
- Plausible Analytics embed — script tag in `base.njk`
- Buttondown embed — form HTML in Tonight View empty state and secondary location

**Track 5 — Build Pipeline** *(parallel after Track 0; fully independent of all frontend work)*
- GitHub Actions workflow file — checkout, Sheets API fetch, Eleventy build, Pages deploy, failure notification
- Google Apps Script — form submit trigger → `workflow_dispatch` API call

---

**Track 6 — E2E Tests** *(after Tracks 1–5 merge)*
- Playwright test suite:
  1. Tonight View renders events for today sorted by start time
  2. Tonight View empty state — subscribe field visible, Browse Upcoming link present
  3. Browse View filtering — attribute filters apply; URL reflects state; bookmarked URL loads filtered view
  4. Event detail page — Schema.org JSON-LD present with correct structure; OG tags present
  5. Mobile layout — Tonight View correct at 320px viewport width

---

**Cross-Track Dependencies & Merge Points:**
- Track 0 → all tracks: event model contract and mock fixture must be finalized before any track starts
- Track 1 + Track 2 merge: swap `events.mock.js` for `events.js` in `.eleventy.js` config; verify all views render with real data
- Track 3 depends on base layout block names defined in Track 0
- Track 4 filter JS depends on `data-*` attribute names defined in Track 0 and implemented in Track 2
- Track 6 depends on real data pipeline (Track 1) being active so E2E tests run against a live build

## Project Structure & Boundaries

### Complete Project Directory Structure

```
wcs-events/
│
├── .github/
│   └── workflows/
│       └── build-deploy.yml          # Checkout → Vitest → Eleventy build → Pages deploy
│
├── _data/
│   ├── events.js                     # Track 1: Sheets API fetch, row parse, classify
│   ├── events.mock.js                # Track 0: hardcoded fixture, used by all agents pre-merge
│   └── site.js                       # Site metadata (name, base URL, OG defaults)
│
├── _includes/
│   ├── base.njk                      # Base layout: <head>, header, footer, named blocks
│   ├── event-card.njk                # Reusable card (Tonight + Browse + Archive)
│   ├── filter-controls.njk           # Browse View filter UI (type + signal + date)
│   └── empty-state.njk               # Tonight empty state + Buttondown subscribe form
│
├── assets/
│   ├── css/
│   │   ├── base.css                  # Custom properties, reset, typography scale
│   │   ├── layout.css                # Header, footer, main, page-level structure
│   │   ├── event-card.css            # Card component styles
│   │   ├── browse-filters.css        # Filter controls styles
│   │   └── event-detail.css          # Event detail page styles
│   ├── js/
│   │   └── browse-filter.js          # AND/OR filter logic + URLSearchParams state
│   └── images/
│       └── event-types/
│           ├── social-dancing.jpg
│           ├── group-lesson.jpg
│           ├── workshop.jpg
│           ├── competition.jpg
│           └── convention.jpg
│
├── events/
│   └── event-detail.njk              # Paginated template → one page per event
│                                     # permalink: "events/{{ event.id }}/"
│
├── tests/
│   ├── unit/
│   │   ├── events-parser.test.js     # Row parsing, field normalization, skip-on-invalid
│   │   ├── slug-generator.test.js    # Slug generation + collision handling
│   │   └── date-classifier.test.js   # today / upcoming / past classification
│   ├── e2e/
│   │   ├── tonight-view.spec.js      # Events render for today, sorted by start time
│   │   ├── tonight-empty.spec.js     # Subscribe field visible, Browse Upcoming link
│   │   ├── browse-filter.spec.js     # Filters apply; URL state; bookmarked URL restores
│   │   ├── event-detail.spec.js      # Schema.org JSON-LD present; OG tags present
│   │   └── mobile-layout.spec.js     # Tonight View at 320px viewport
│   └── fixtures/
│       └── mock-events.js            # Shared test data matching events.mock.js shape
│
├── scripts/
│   └── google-apps-script.js         # Form submit trigger → workflow_dispatch API call
│
├── index.njk                         # Tonight View — FR-1–5, FR-17, FR-18 (empty state)
├── browse.njk                        # Browse View — FR-6–10
├── archive.njk                       # Archive View — FR-11
├── robots.txt                        # Points to sitemap.xml
│
├── .eleventy.js                      # Collections, custom filters, sitemap plugin, passthrough
├── vitest.config.js
├── playwright.config.js
├── package.json
├── .gitignore
└── NOTES.md                          # Track merge notes (agents write here during dev)
```

### FR-to-File Mapping

| FR | Description | File(s) |
|---|---|---|
| FR-1–3 | Tonight View, empty state | `index.njk`, `_includes/empty-state.njk` |
| FR-4–5 | Event cards, mobile-first | `_includes/event-card.njk`, `assets/css/event-card.css` |
| FR-6–7 | Browse View + date filter | `browse.njk`, `assets/js/browse-filter.js` |
| FR-8–9 | Attribute filters + URL state | `_includes/filter-controls.njk`, `assets/js/browse-filter.js` |
| FR-10 | Browse links to detail | `browse.njk` → `events/event-detail.njk` |
| FR-11 | Archive View | `archive.njk` |
| FR-12 | Permanent event URLs | `events/event-detail.njk` (paginated) |
| FR-13 | OG tags + Schema.org | `_includes/base.njk` (`{% block meta %}`, `{% block schema %}`) |
| FR-14–16 | Submit + change links | Footer in `_includes/base.njk` (external Google Form URLs) |
| FR-17 | WCS intro paragraph | `index.njk` (static copy block) |
| FR-18 | Mailing list embed | `_includes/empty-state.njk` + secondary location in `index.njk` |
| FR-19 | Event type images | `assets/images/event-types/` (5 images) |
| FR-20 | Recurring badge | `_includes/event-card.njk` |
| FR-21 | Plausible telemetry | `_includes/base.njk` (script tag) |
| FR-22 | Convention naming | Data convention only — no special file |
| FR-23 | Footer attribution | `_includes/base.njk` |

### Integration Boundaries

**External integrations (all outbound; none inbound at runtime):**

| System | Direction | Integration point | Auth |
|---|---|---|---|
| Google Sheets API | Build-time read | `_data/events.js` | `GOOGLE_SERVICE_ACCOUNT_JSON` secret |
| GitHub Actions API | Inbound trigger | `build-deploy.yml` (`workflow_dispatch`) | Called by Google Apps Script with `GITHUB_TOKEN` |
| Plausible Analytics | Outbound only | `_includes/base.njk` script tag | None |
| Buttondown | Outbound form POST | `_includes/empty-state.njk` | None |

**Data flow:**
```
Google Form submit
  → scripts/google-apps-script.js (form submit trigger)
    → GitHub Actions workflow_dispatch
      → _data/events.js (Sheets API read + parse)
        → Eleventy build (all pages generated from event objects)
          → GitHub Pages deploy (_site/ output)
```

### Track Ownership Map

| Track | Model | Files owned |
|---|---|---|
| 0 — Foundation | Sonnet | `.eleventy.js`, `_includes/base.njk` skeleton, `_data/events.mock.js`, `_data/site.js`, `NOTES.md` conventions section |
| 1 — Data Pipeline | Sonnet | `_data/events.js`, `tests/unit/*.test.js` |
| 2 — Views | Haiku (Tonight+Archive) / Sonnet (Browse) | `index.njk`, `archive.njk`, `browse.njk`, `_includes/event-card.njk`, `_includes/filter-controls.njk`, `_includes/empty-state.njk` |
| 3 — Detail + SEO | Haiku | `events/event-detail.njk`, `robots.txt`, `.eleventy.js` (sitemap plugin addition) |
| 4 — JS + Integrations | Sonnet (filter) / Haiku (embeds) | `assets/js/browse-filter.js`, Plausible + Buttondown additions to `base.njk` |
| 5 — Pipeline | Haiku | `.github/workflows/build-deploy.yml`, `scripts/google-apps-script.js` |
| 6 — E2E | Sonnet | `tests/e2e/*.spec.js`, `tests/fixtures/mock-events.js` |

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:** All technology choices are mutually compatible. Eleventy v3.x (ESM-native) pairs cleanly with Vitest (ESM-native) and the googleapis SDK. Nunjucks `| dump` handles JSON-LD serialization without a plugin. URLSearchParams is fully supported by all target browsers (Chrome, Safari, Firefox, Edge — last 2 major versions). No version conflicts or contradictory decisions identified.

**Pattern Consistency:** Naming conventions are internally consistent. The `data-*` attribute contract (defined in Track 0, implemented in Track 2, consumed in Track 4) is explicit and complete. Nunjucks block inheritance (`{% block schema %}`, `{% block meta %}`, `{% block content %}`) is consistent across base layout and all page templates.

**Structure Alignment:** `_data/events.js` is the correct Eleventy data cascade location. `events/event-detail.njk` with Eleventy pagination is the correct pattern for generating one URL per event. All file locations are consistent with Eleventy conventions.

### Requirements Coverage Validation

**Functional Requirements (23/23 covered):**
All FRs map to specific files in the project structure. FR-18 secondary mailing list location is intentionally TBD per PRD — to be resolved at design time, not an architecture gap.

**Non-Functional Requirements (all covered):**
- Performance: Static output + zero runtime data fetch on initial load
- Reliability: GitHub Pages + previous deploy preserved on build failure
- Accessibility: WCAG AA enforced at implementation; semantic HTML required by patterns
- SEO: Schema.org JSON-LD + OG tags pre-rendered at build time; no JS-required indexable content
- Privacy: Plausible (cookieless) + Buttondown (plain form, no tracking) + no third-party cookies
- Browser support: All target browsers support URLSearchParams and modern CSS custom properties
- Cost: Zero recurring infrastructure; Plausible Cloud (~$9/mo after trial) is the only potential cost and is explicitly flagged with a free alternative (Umami on Railway)

### Implementation Readiness Validation

**Decision Completeness:** All critical decisions documented with rationale. Agent model assignments (Sonnet/Haiku) specified per track. Track 0 contract artifacts identified. Mock fixture approach enables parallel development before real data pipeline is ready.

**Structure Completeness:** Complete directory tree defined. Every FR mapped to a specific file. All integration boundaries documented. Track ownership map gives each agent a clear, non-overlapping file scope.

**Pattern Completeness:** Naming conventions cover files, CSS classes, custom properties, URL params, data-* attributes, collection names, Eleventy filters, and slug format. Format patterns cover date/time display, cost display, and locked PRD copy. Process patterns cover build error handling, JS filter logic, and Schema.org output.

### Gap Analysis Results

**Critical Gaps:** None

**Important Gaps:**
- `.eleventy.js` collection definitions and custom Nunjucks filter implementations are not specified in this document — intentional; they are Track 0 implementation deliverables, not architecture decisions
- Playwright CI `webServer` configuration not specified — Track 6 agent responsibility; standard pattern is `eleventy --serve` with `webServer` in `playwright.config.js`

**Minor Gaps:**
- `scripts/google-apps-script.js` runs in Google's V8 environment, not Node.js; file is stored in repo for version control only and must be manually deployed to Google Apps Script
- OG image selection (event type → placeholder image filename) is implied by the kebab-case canonical event type values matching the image filenames in `assets/images/event-types/`

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Constraints are simple and internally consistent — no database, no auth, no server
- Multi-agent track structure is explicit: non-overlapping file ownership, clear merge points, model assignments by task complexity
- Track 0 contracts (event model, naming conventions, mock fixture) are the linchpin of the parallel strategy — investing there pays dividends across all other tracks
- All 23 FRs are mapped to specific files; nothing is architecturally vague

**Areas for Future Enhancement:**
- Organizer image URL support (Post-MVP backlog) would require an image proxy or CDN layer — not compatible with current zero-server constraint; revisit at that time
- Convention parent/child hierarchy (Post-MVP) would require a data relationship model beyond the current flat event array
- Weekly email digest (Post-MVP) would require a scheduled server-side function — outside current zero-infrastructure model

### Implementation Handoff

**AI Agent Guidelines:**
- Read the Track 0 conventions doc and mock fixture before writing any code
- Use `events.mock.js` as the data source until Track 1 merges — never hardcode event data
- Follow `data-*` attribute names exactly — the filter JS depends on them
- Use canonical kebab-case event type values in all data attributes and URL params
- Write to `NOTES.md` for any cross-track questions or decisions made during implementation
- Do not introduce npm dependencies not listed in this document without flagging

**First Implementation Priority:**

```bash
npm create @11ty/eleventy@latest
```

Then: establish event data model contract, create `events.mock.js`, define Nunjucks block names and CSS custom property names in a `NOTES.md` conventions section. Track 0 must be complete before any other track begins.

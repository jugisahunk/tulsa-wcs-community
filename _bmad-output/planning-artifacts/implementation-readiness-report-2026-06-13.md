---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - '_bmad-output/planning-artifacts/prds/prd-wcs-events-2026-06-13/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/epics.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/DESIGN.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-wcs-events-2026-06-13/EXPERIENCE.md'
date: '2026-06-13'
project: wcs-events
status: complete
---

# Implementation Readiness Assessment Report

**Date:** 2026-06-13
**Project:** wcs-events
**Assessed by:** BMAD Implementation Readiness Check (Steps 1–6)

---

## Document Inventory

| Document | Status | Notes |
|---|---|---|
| PRD (`prd-wcs-events-2026-06-13/prd.md`) | Final | 23 FRs, 7 NFRs, 2 phases, 5 open questions |
| Architecture (`architecture.md`) | Complete (8/8 steps) | All FRs mapped; track structure defined |
| Epics (`epics.md`) | Complete (4/4 steps) | 6 epics, 19 stories, TDD-first discipline |
| DESIGN.md | Final | 11 color tokens, 7 type scales, 11 components |
| EXPERIENCE.md | Final | Foundation → IA → Voice → States → Flows (4) |

---

## Step 2: PRD Analysis

### Functional Requirements (23 total)

| ID | Summary | Priority |
|---|---|---|
| FR-1 | Default landing: today's events, sorted start time ascending | Tonight View |
| FR-2 | Event card fields: name, start time, venue, cost, type badge, fit signals | Tonight View |
| FR-3 | Empty state: Browse link + subscribe field + locked copy | Tonight View |
| FR-4 | Event cards link to permanent detail page with OG + Schema.org | Detail |
| FR-5 | Tonight View mobile-first, 320px+ | Tonight View |
| FR-6 | Browse View: all upcoming events, sorted date+time ascending | Browse |
| FR-7 | Browse date filter, client-side, no reload | Browse |
| FR-8 | Multi-select type + fit signal filters, AND/OR logic, no reload | Browse |
| FR-9 | Filter state in URL (bookmarkable/shareable) | Browse |
| FR-10 | Browse listings → same event detail page | Browse |
| FR-11 | Archive View: past events, accessible but not promoted | Archive |
| FR-12 | Permanent event URLs with full data (name, date, time, venue, cost, type, signals, description, source URL) | Detail |
| FR-13 | OG tags + Schema.org Event markup on every event detail page | Detail/SEO |
| FR-14 | Submit link in footer only → Google Form | Pipeline |
| FR-15 | Google Form fields (13 fields specified) | Pipeline (external) |
| FR-16 | Request a Change link in footer → Google Form | Pipeline |
| FR-17 | WCS intro paragraph on site | Onboarding |
| FR-18 | Mailing list subscribe (empty state + secondary location, no server) | Onboarding |
| FR-19 | 5 curated default images keyed by event type | Visuals |
| FR-20 | Recurring event badge on cards and detail pages | Visuals |
| FR-21 | Plausible Analytics (cookieless) from first deploy | Telemetry |
| FR-22 | Convention naming convention: `[Convention Name] — [Type]: [Title]` | Data |
| FR-23 | Footer attribution text (locked pending Jubilee's last name) | Footer |

### Non-Functional Requirements (7 total)

| ID | Requirement | Threshold |
|---|---|---|
| NFR-1 | Performance | < 2s on mid-range Android 4G; static only, no client-side data fetch on load |
| NFR-2 | Reliability | Previous deploy stays live on failure; Jason notified via GitHub Actions |
| NFR-3 | Accessibility | WCAG AA minimum (AAA preferred); semantic HTML; keyboard nav; alt text; **audited before Phase 2 launch** |
| NFR-4 | SEO | Schema.org Event on every detail page; OG tags; no JS-required content rendering |
| NFR-5 | Privacy | No cookies; no tracking pixels; no cookie-setting embeds; cookieless telemetry |
| NFR-6 | Browser support | Chrome, Safari, Firefox, Edge — last 2 major versions; no IE11 |
| NFR-7 | Cost | Zero recurring infrastructure; mailing list on free tier |

---

## Step 3: Epic FR Coverage Validation

### FR Coverage Matrix

| FR | Covered By | Coverage Status |
|---|---|---|
| FR-1 | Epic 2 — Story 2.2 (Tonight View template) | ✅ COVERED |
| FR-2 | Epic 2 — Story 2.2 (event-card.njk) | ✅ COVERED |
| FR-3 | Epic 2 — Story 2.3 (empty-state.njk + Buttondown) | ✅ COVERED |
| FR-4 | Epic 4 — Story 4.2 (detail page + OG + Schema.org) | ✅ COVERED |
| FR-5 | Epic 2 — Story 2.1 (mobile-layout.spec.js), Story 2.2 | ✅ COVERED |
| FR-6 | Epic 3 — Story 3.2 (browse.njk) | ✅ COVERED |
| FR-7 | Epic 3 — Story 3.3 (browse-filter.js) | ✅ COVERED |
| FR-8 | Epic 3 — Story 3.3 (browse-filter.js, AND/OR logic) | ✅ COVERED |
| FR-9 | Epic 3 — Story 3.3 (URLSearchParams + history.pushState) | ✅ COVERED |
| FR-10 | Epic 3 — Story 3.2 (cards → detail pages) | ✅ COVERED |
| FR-11 | Epic 3 — Story 3.4 (archive.njk) | ✅ COVERED |
| FR-12 | Epic 4 — Story 4.2 (event-detail.njk paginated) | ✅ COVERED |
| FR-13 | Epic 4 — Story 4.2 (JSON-LD + OG block overrides) | ✅ COVERED |
| FR-14 | Epic 6 — Story 6.3 (footer Submit link) | ✅ COVERED |
| FR-15 | Epic 6 — Story 6.2 (Google Form, noted as external) | ⚠️ PARTIAL — Google Form fields are an external setup task by Jason, not an implementation story. Stories don't validate form field completeness. Acceptable for MVP scope. |
| FR-16 | Epic 6 — Story 6.3 (footer Request a Change link) | ✅ COVERED |
| FR-17 | Epic 2 — Story 2.2 (WCS intro paragraph in index.njk) | ✅ COVERED |
| FR-18 | Epic 2 — Story 2.3 (Buttondown in empty state + secondary) | ✅ COVERED |
| FR-19 | Epic 2 — Story 2.2 (5 event type images in assets/) | ✅ COVERED |
| FR-20 | Epic 2 — Story 2.2 (Recurring badge) | ✅ COVERED |
| FR-21 | Epic 6 — Story 6.3 (Plausible script tag) | ✅ COVERED |
| FR-22 | Epic 1 — Story 1.2 (event model) + Story 1.3 (NOTES.md) | ✅ COVERED |
| FR-23 | Epic 1 — Story 1.3 (base.njk footer) | ✅ COVERED |

**FR Coverage: 23/23 FRs covered (22 full, 1 partial)**

### NFR Coverage Assessment

| NFR | Coverage | Gap |
|---|---|---|
| NFR-1 (Performance) | Architecture-level (static output) | 🟡 No automated performance test story exists. No Lighthouse CI or Web Vitals check. Pass/fail of < 2s is unverifiable without manual testing. |
| NFR-2 (Reliability) | Story 6.1 (GitHub Actions failure handling) | ✅ COVERED |
| NFR-3 (Accessibility) | DESIGN.md + EXPERIENCE.md detail ARIA, contrast, keyboard nav | 🟠 No dedicated accessibility audit story exists. PRD explicitly commits to an audit before Phase 2 launch. This commitment has no corresponding Epic story. |
| NFR-4 (SEO) | Epic 4 covers Schema.org + OG; pre-rendered confirmed in architecture | ✅ COVERED |
| NFR-5 (Privacy) | Plausible (cookieless) + Buttondown (plain form) by design | ✅ COVERED — privacy compliance is structural, not story-dependent |
| NFR-6 (Browser support) | Playwright configured for Chromium, Firefox, WebKit (Story 1.4) | ✅ COVERED |
| NFR-7 (Cost) | Architecture selects free-tier services; Plausible cost flagged | ✅ COVERED — one potential exception: Plausible Cloud ~$9/mo after trial, explicitly flagged in architecture with Umami alternative |

---

## Step 4: UX Alignment

### DESIGN.md Alignment with PRD

| PRD Constraint | DESIGN.md Response | Status |
|---|---|---|
| Near-black with warm undertone | `bg: #101214` (cool undertone; warmth in white `#f0eeea`) | ✅ Reconciled — decision logged; warmth lives in text, not background |
| No accent hue | Gold `#c9a84c` at 20–30% opacity on geometry only | ⚠️ Conscious PRD constraint relaxation — documented in .decision-log.md. Gold never on text, never for hierarchy. Acceptable. |
| Sharp display serif | Cinzel 400 | ✅ ALIGNED |
| Clean sans-serif body/UI | Josefin Sans 300 | ✅ ALIGNED |
| Hero: single h1 "West Coast Swing in Tulsa" | hero-block spec: h1 only, no sub, no image, no CTA | ✅ ALIGNED |
| Mobile-first, Tonight View one-handed | 320px minimum, 375px design target | ✅ ALIGNED |
| Information hierarchy When → Where → Who → Cost | Metadata line: `8:00 PM · CAIN'S BALLROOM · FREE` (When → Where → Cost); event type badge (Who) top-right | ✅ Aligned in substance — Who is visible via event type badge |
| Voice: confident, direct, unhurried | Brand & Style section mirrors PRD voice exactly | ✅ ALIGNED |
| Submit link footer only (not primary nav) | EXPERIENCE.md IA: Submit in footer, absent from tab bar | ✅ ALIGNED |

### EXPERIENCE.md Alignment with Architecture

| Architecture Decision | EXPERIENCE.md Spec | Status |
|---|---|---|
| Navigation: `<header>` with primary nav placeholder | Bottom tab bar (TONIGHT · BROWSE · ARCHIVE); "No top navigation bar" | 🔴 CONFLICT — architecture and epics plan a header nav; EXPERIENCE.md prohibits it |
| Eleventy SSG, pre-rendered, no client-side data fetch | Foundation: "No loading states for data. No skeleton screens." | ✅ ALIGNED |
| URLSearchParams filter state | "Filter state persists in URL params; `?type=social-dancing,workshop&signal=beginner-friendly`" | ✅ ALIGNED |
| `data-*` attributes on event cards | Filter chip `aria-pressed`; filter reads `data-event-type` etc. | ✅ ALIGNED |
| Buttondown plain HTML form | subscribe-form: "Plain HTML POST to Buttondown. No JavaScript required." | ✅ ALIGNED |
| Plausible Analytics script tag | Foundation: no loading states, cookieless | ✅ ALIGNED |
| Schema.org JSON-LD inline | No conflict; EXPERIENCE.md references Schema.org SEO | ✅ ALIGNED |

### Internal UX Document Inconsistency

**DESIGN.md empty-state component vs EXPERIENCE.md State Patterns:**

DESIGN.md `empty-state` component lists contents as:
1. Locked copy: "Some of the best nights in this community are planned last minute..."
2. subscribe-form component
3. "BROWSE UPCOMING" link

EXPERIENCE.md State Patterns and Flow 1 (failure path) specify:
> "Hero block → **'QUIET TONIGHT.' orientation line** → ◆ divider → locked copy + subscribe form + BROWSE UPCOMING link"

**The "QUIET TONIGHT." orientation line is in EXPERIENCE.md but missing from DESIGN.md's empty-state component spec.** An implementing agent reading DESIGN.md for the empty-state component would produce the wrong structure and omit this key UX element that the user specifically requested.

---

## Step 5: Epic Quality Review

### Epic 1: Foundation & Test Infrastructure

**User value check:** ⚠️ Technical epic — no direct user value. Acceptable as a prerequisite; industry-standard pattern for greenfield projects.

**Independence:** ✅ Fully standalone. All other epics block on this.

**Story quality:**
- Story 1.1 (Eleventy init): ✅ Clear, completable alone, concrete ACs
- Story 1.2 (Event model + mock fixture): ✅ Precise JSDoc shape, edge case coverage required
- Story 1.3 (Base layout + CSS): ✅ Named block contracts, conventions in NOTES.md

**Story 1.3 critical gap:** AC specifies only 4 color tokens for `base.css`:
```
--color-bg, --color-surface, --color-text-primary, --color-text-muted
```
DESIGN.md requires **11 color tokens**, including:
- `--color-surface-border` (card borders)
- `--color-text-on-badge` (badge labels)
- `--color-gold` (base gold value)
- `--color-gold-rule` (rule lines, diamond ornaments)
- `--color-gold-badge-border` (event type badge borders)
- `--color-gold-tab-active` (active tab indicator)
- `--color-tab-bar-bg` (bottom nav)

If implemented from Story 1.3 ACs alone, the CSS foundation will be missing all gold and Art Deco tokens. Every downstream story building on `base.css` will lack the tokens they need.

**Architecture vs DESIGN.md values:** Architecture placeholder values (`#0f0e0d`, `#1a1917`, `#f5f4f0`) differ from DESIGN.md final values (`#101214`, `#16181b`, `#f0eeea`). Track 0 implementer must use DESIGN.md values, not the architecture document's placeholders.

- Story 1.4 (Vitest + Playwright): ✅ Strong. Three-browser Playwright config, smoke test with `<h1>` assertion, named `package.json` scripts

**Missing: No bottom tab bar story anywhere in the epics.** The `bottom-tab-bar` component is EXPERIENCE.md's primary navigation mechanism. Story 1.3 creates a "header with primary nav placeholder" but never specifies when/how this placeholder is replaced with a bottom tab bar. No epic owns this implementation.

---

### Epic 2: Tonight View

**User value:** ✅ Strong. Direct community value from day one.

**TDD pattern:** ✅ Story 2.1 (failing E2E) → 2.2 (template makes tests green) → 2.3 (empty state makes tests green). Correct.

**Story 2.1 gap:** `tonight-empty.spec.js` assertions cover:
- Empty state container visible ✅
- "Browse Upcoming" link present ✅
- Email input + submit button visible ✅
- Locked PRD copy present ✅

**Missing assertion: "QUIET TONIGHT." is NOT included in the E2E spec.** This is a required EXPERIENCE.md element (the orientation line the user explicitly requested). Story 2.1 spec doesn't require a test for it, so Story 2.2/2.3 implementations won't be tested against it. The tests will pass even if "QUIET TONIGHT." is omitted.

**DESIGN.md reference gap:** Stories 2.2 and 2.3 reference PRD constraints (near-black, display serif, etc.) but not DESIGN.md component specs. Implementing agents reading only the stories will not know about Cinzel typography, Josefin Sans ALL CAPS, diamond dividers between cards, double-rule ornaments on the hero, or gold accent tokens. The Art Deco design will be missed entirely.

---

### Epic 3: Browse & Archive Views

**User value:** ✅ Strong. Filtering, URL state, and Archive all deliver clear value.

**TDD pattern:** ✅ Story 3.1 (failing E2E) → 3.2 (template) → 3.3 (filter JS) → 3.4 (archive).

**Story 3.2:** Filter bar "collapsed by default" behavior is mentioned in EXPERIENCE.md but not in Story 3.2's ACs. Story 3.3 governs the JS behavior but doesn't specify the "FILTERING › N ACTIVE" label update in collapsed state when URL pre-applies filters. Minor gap.

**Story 3.4 CRITICAL CONFLICT:**

> AC: "The Archive nav link is present in the **site header** but at a lower visual hierarchy than Browse and Tonight"

EXPERIENCE.md Foundation explicitly states:
> "**No hamburger menu. No top navigation bar.** No breadcrumbs."

And IA section: "**Bottom tab bar** — TONIGHT · BROWSE · ARCHIVE. These three views are the site. The tab bar is the only persistent navigation element."

Story 3.4's AC will cause an implementing agent to put navigation in the header. This directly contradicts EXPERIENCE.md. If followed as written, the site will have the wrong navigation paradigm.

---

### Epic 4: Event Detail + SEO

**User value:** ✅ Permanent shareable URLs, OG previews, Google rich results — direct value to dancers sharing events and organizers gaining visibility.

**TDD pattern:** ✅ Story 4.1 (failing E2E) → 4.2 (template makes tests green).

**Story 4.1 ACs:** Comprehensive JSON-LD and OG tag assertions. Schema.org `@type`, `name`, `startDate`, `location` all tested. ✅

**No gaps identified.** This epic is clean and implementation-ready.

---

### Epic 5: Data Pipeline

**User value:** ✅ Enables live data from Google Sheets — foundational for production operation.

**TDD pattern:** ✅ Story 5.1 (unit tests failing first for parser + slug + date classifier) → 5.2 (implementation) → 5.3 (swap mock, full E2E gate).

**Story 5.3 strong gate:** "If any E2E test fails with real data, the failure is investigated and resolved before this story is marked complete." ✅ This is exactly the right quality gate.

**No gaps identified.** This epic is clean and implementation-ready.

---

### Epic 6: Build Pipeline & Production

**User value:** ✅ Self-updating site + telemetry + organizer submission → Google rich results (stated value proposition in organizer copy).

**No "failing tests first" story:** Intentionally absent — GitHub Actions pipeline behavior is not TDD-able in the traditional sense. Story 6.1 ACs describe pipeline behavior in testable terms (failure of any step blocks subsequent steps, build time under 90 seconds). Acceptable.

**No gaps identified.** This epic is clean and implementation-ready.

---

### Overall Story Quality Compliance Checklist

| Check | Status |
|---|---|
| Epics deliver user value | ✅ 5/6 (Epic 1 is a technical epic — acceptable) |
| Epic independence confirmed | ✅ All epics have explicit depends-on statements |
| No forward dependencies within stories | ✅ Each story builds on prior stories within its epic |
| TDD: failing tests precede implementation | ✅ Stories 2.1, 3.1, 4.1, 5.1 all write failing tests first |
| E2E tests co-located with features (not deferred) | ✅ Architecture: Track 0 baseline, E2E per feature epic |
| ACs in Given/When/Then format | ✅ All stories use BDD structure |
| No technical epics masquerading as user-value epics | ✅ Epic 1 is correctly labeled as Foundation |
| All 23 FRs traceable to stories | ✅ Complete coverage |

---

## Step 6: Final Assessment

### Findings by Severity

---

#### 🔴 CRITICAL — Will produce wrong implementation if not fixed

**C1: No story implements the bottom tab bar navigation**

The bottom-tab-bar is the **primary navigation mechanism** per EXPERIENCE.md (TONIGHT · BROWSE · ARCHIVE). No story in any epic creates this component. Story 1.3 creates a "header with primary nav placeholder" — and Story 3.4 explicitly says to put navigation in the site header. Without a dedicated story, the bottom tab bar will not be built.

*Recommendation:* Add a new story to Epic 1 (or Epic 2) for bottom tab bar implementation. Update Story 1.3's base.njk AC to not include header navigation. Add a `<nav>` structure as the bottom tab bar in `base.njk`.

---

**C2: Story 3.4 — Archive nav link "in the site header" conflicts with EXPERIENCE.md**

Story 3.4 AC: "The Archive nav link is present in the site header but at a lower visual hierarchy than Browse and Tonight"

EXPERIENCE.md: "No top navigation bar. The tab bar is the only persistent navigation element."

Any agent implementing Story 3.4 per its written ACs will produce a header-based navigation that violates the design specification. This also conflicts with C1 above.

*Recommendation:* Update Story 3.4 to remove the "site header" reference. Replace with: "ARCHIVE is present as a tab in the bottom tab bar." (Alternatively, this AC becomes moot once C1 is fixed with a dedicated tab bar story.)

---

**C3: Story 2.1 `tonight-empty.spec.js` missing "QUIET TONIGHT." assertion**

The user's explicit design feedback ("I don't want the user to be confused when they reach an empty event tab") resulted in the "QUIET TONIGHT." orientation line in EXPERIENCE.md. Story 2.1 does not include an E2E assertion for this element.

Without this test, the TDD cycle for the empty state will produce a green suite even if "QUIET TONIGHT." is omitted from the implementation.

*Recommendation:* Add to `tonight-empty.spec.js` assertions:
- The text "QUIET TONIGHT." is visible on the page (in the empty state, before the subscribe copy)
- A diamond ornament element (`aria-hidden="true"`) separates "QUIET TONIGHT." from the subscribe copy

---

#### 🟠 MAJOR — Significant quality risk; should be resolved before implementation

**M1: DESIGN.md `empty-state` component missing "QUIET TONIGHT." orientation line**

DESIGN.md empty-state lists contents as: (1) locked copy, (2) subscribe form, (3) BROWSE UPCOMING link.
EXPERIENCE.md State Patterns and Flow 1 insert "QUIET TONIGHT." before the locked copy.

An agent reading DESIGN.md for the empty-state component spec will implement it without the orientation line. The two UX documents are inconsistent on a user-visible element.

*Recommendation:* Update DESIGN.md `empty-state` component to add:
```
Contents (top to bottom):
1. "QUIET TONIGHT." — orientation line (Josefin Sans, label-ui-lg, text-primary, centered)
2. Diamond ornament (aria-hidden="true")
3. Locked copy: "Some of the best nights..."
4. subscribe-form component
5. "BROWSE UPCOMING" link
```

---

**M2: Story 1.3 CSS foundation missing 7 DESIGN.md color tokens**

Story 1.3 ACs specify 4 color tokens. DESIGN.md requires 11. Missing tokens:
- `--color-surface-border` — card border
- `--color-text-on-badge` — badge label color
- `--color-gold` — base gold (never used raw; parent of opacity-adjusted tokens below)
- `--color-gold-rule` — rule lines, diamond ornaments
- `--color-gold-badge-border` — event type badge border
- `--color-gold-tab-active` — active tab indicator
- `--color-tab-bar-bg` — bottom nav background

Without these, every component that references them (`event-type-badge`, `diamond-divider`, `double-rule-ornament`, `bottom-tab-bar`, `recurring-badge`) will have no CSS foundation to reference.

*Recommendation:* Update Story 1.3 ACs to enumerate all 11 DESIGN.md color tokens. Add: "CSS custom property values MUST match DESIGN.md frontmatter exactly (not architecture.md placeholder values)."

---

**M3: No accessibility audit story despite PRD Phase 2 commitment**

PRD NFR-3: "Audited before Phase 2 launch." This is a firm commitment, not a guideline. No story in any epic represents this audit.

*Recommendation:* Add an accessibility audit story to Epic 6 (or as a new story between Epic 6 and Phase 2 launch). Minimum ACs: run axe-core against all views (Tonight, Browse, Archive, Event Detail), verify WCAG AA compliance, verify ARIA labels on all interactive elements, keyboard-navigate all three views without a mouse.

---

**M4: Epics' "UX Design Requirements" section is outdated**

`epics.md` line 71: "No UX design document exists. Design constraints are locked in PRD Section 10."

This section will mislead implementing agents. DESIGN.md and EXPERIENCE.md now exist and are final. All feature stories should reference them.

*Recommendation:* Update epics.md "UX Design Requirements" section to: "UX design documents exist and are final. Implementing agents MUST reference DESIGN.md for all visual specs and EXPERIENCE.md for all behavioral specs. PRD Section 10 constraints have been resolved into those documents." List the paths to both files.

---

**M5: Architecture CSS property placeholder values conflict with DESIGN.md final values**

Architecture.md lists these placeholder values in the CSS naming section:
- `--color-bg: #0f0e0d` → DESIGN.md final: `#101214`
- `--color-surface: #1a1917` → DESIGN.md final: `#16181b`
- `--color-text-primary: #f5f4f0` → DESIGN.md final: `#f0eeea`
- `--color-text-muted: #8a8680` → DESIGN.md final: `rgba(240, 238, 234, 0.5)`

If an agent uses architecture.md for color values, the site will render with incorrect colors that do not match the approved DESIGN.md palette.

*Recommendation:* Add a note to Story 1.3: "CSS custom property values are defined in DESIGN.md frontmatter. Architecture.md color values are placeholders and must not be used."

---

#### 🟡 MINOR — Quality improvements; does not block implementation

**m1: Story 3.3 missing filter bar collapsed-state behavior for URL pre-applied filters**

EXPERIENCE.md: "If URL params are present on load, the filter bar shows 'FILTERING › N ACTIVE' in collapsed state and filters are already applied to the event list — the bar does not auto-expand."

Story 3.3 specifies reading URL params and pre-applying filters but does not specify the collapsed bar's label should update to "FILTERING › N ACTIVE". An agent may correctly implement filter pre-application but leave the bar label showing "FILTER EVENTS ›" when filters are active on load.

*Recommendation:* Add AC to Story 3.3: "When the page loads with URL filter params present, the filter bar trigger button shows 'FILTERING › N ACTIVE' (where N is the count of active filter values) and remains collapsed."

---

**m2: No automated performance test (NFR-1)**

NFR-1 commits to < 2s on mid-range Android 4G. This is verifiable with Lighthouse CI or Web Vitals in the GitHub Actions workflow. No story or AC tests it.

*Recommendation:* Add a Lighthouse CI step to Story 6.1's GitHub Actions workflow AC, or add a performance acceptance criterion to Story 5.3 (swap to real data). Minimum: Lighthouse Performance score ≥ 90 on mobile.

---

**m3: FR-15 (Google Form fields) attribution may confuse agents**

FR-15 is mapped to Epic 6 but the epics note: "Google Form fields; form created by Jason externally." The epic coverage map shows FR-15 as covered by Epic 6, but no story implements it — it's a manual task. An agent auditing coverage might think this needs a story when it doesn't.

*Recommendation:* Add a note to the FR Coverage Map entry for FR-15: "External task — no implementation story. Jason manually creates the Google Form with the fields specified in FR-15 before Phase 1 deploy."

---

**m4: Feature stories don't reference DESIGN.md for visual implementation**

Stories 2.2, 2.3, 3.2, 3.4, 4.2, 6.3 describe visual requirements in PRD-level terms (e.g., "recurring badge") without pointing to DESIGN.md component specs. Implementing agents working from stories alone will not know about Cinzel typography, Josefin Sans ALL CAPS, gold border treatments, diamond dividers, or Art Deco ornaments.

*Recommendation:* Add a standard preamble to each feature story: "Visual implementation MUST conform to DESIGN.md component specifications and use EXPERIENCE.md behavioral specs. This story's ACs describe functional requirements only."

---

### Findings Summary

| Severity | Count | Items |
|---|---|---|
| 🔴 Critical | 3 | C1 (no tab bar story), C2 (Story 3.4 wrong nav location), C3 (Story 2.1 missing "QUIET TONIGHT." test) |
| 🟠 Major | 5 | M1 (DESIGN.md empty-state gap), M2 (Story 1.3 missing CSS tokens), M3 (no a11y audit story), M4 (outdated UX requirements section), M5 (wrong CSS values in architecture) |
| 🟡 Minor | 4 | m1 (filter bar label on load), m2 (no performance test), m3 (FR-15 attribution), m4 (stories don't reference DESIGN.md) |

---

### Overall Readiness Verdict

**Status: CONDITIONALLY READY — DO NOT BEGIN IMPLEMENTATION YET**

The planning artifacts are strong. TDD discipline is rigorous and well-structured. FR coverage is complete (23/23). The architecture is coherent and the parallel track strategy is sound. The UX documents are thorough and production-quality.

However, three critical issues arose because the UX design workflow was completed **after** the epics and architecture were written. These conflicts will produce wrong implementation if not resolved:

1. The primary navigation (bottom tab bar) has no implementation story and Stories 1.3 / 3.4 will build the wrong thing.
2. The CSS foundation will be incomplete — Art Deco tokens are missing.
3. The "QUIET TONIGHT." orientation line will not be tested and may be omitted from the empty state.

**Required before starting Epic 1:**
- Fix C1: Add a bottom tab bar story
- Fix C2: Update Story 3.4 navigation AC
- Fix C3: Add "QUIET TONIGHT." assertion to Story 2.1
- Fix M1: Update DESIGN.md empty-state component
- Fix M2: Update Story 1.3 CSS AC to enumerate all 11 DESIGN.md color tokens
- Fix M4: Update epics.md UX Design Requirements section to reference DESIGN.md and EXPERIENCE.md

**Can be addressed during implementation (not blocking):**
- M3, M5, m1, m2, m3, m4

**Estimated work to resolve blockers:** 2–3 hours of story and document editing.

Once the six required fixes are in place, this project is ready for implementation with high confidence.

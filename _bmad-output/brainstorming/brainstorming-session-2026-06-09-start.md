---
stepsCompleted: [1, 2, 3]
inputDocuments: []
session_topic: 'Tulsa WCS Events Website — MVP product & feature set, technical approach, community adoption'
session_goals: 'Define a clear MVP spec and light/beautiful design guidelines for a Tulsa West Coast Swing event aggregator site'
selected_approach: 'progressive-flow'
techniques_used: ['what-if-scenarios', 'mind-mapping']
ideas_generated: [23-features, 4-design, 4-adoption, 4-technical, 3-operational, 2-scope, 1-copy, 1-principle]
context_file: ''
session_continued: true
continuation_date: '2026-06-12'
session_status: 'phases-1-2-complete-ready-for-prd'
---

# Brainstorming Session Results

**Facilitator:** Jason
**Date:** 2026-06-09 (continued 2026-06-12)

## Session Overview

**Topic:** Tulsa WCS Events Website — MVP product & feature set, technical approach, community adoption

**Goals:** Define a clear MVP spec and light/beautiful design guidelines; hold sustainability/business model for later

### Session Setup

**Context:** Conversation with Jubilee (local WCS instructor) surfaced the need — ~15-20% of the Tulsa WCS community avoids Facebook, studios are fragmented, no central public event hub exists. Inspiration: latindance918.org/calendar. Rough MVP concept on table: Google Form → Google Sheets → GitHub Pages.

**Focus Areas:**
- Product & feature set (quick, simple, most valuable thing first)
- Technical approach
- Community & adoption angle

**Out of Scope (for now):** Sustainability, ownership, long-term governance

## Technique Selection

**Approach:** Progressive Technique Flow
**Journey Design:** Systematic development from exploration to action

**Progressive Techniques:**
- **Phase 1 - Exploration:** What If Scenarios — maximum idea generation by questioning all constraints
- **Phase 2 - Pattern Recognition:** Mind Mapping — organizing insights into clusters and MVP shape
- **Phase 3 - Development:** SCAMPER Method — refining top MVP candidates
- **Phase 4 - Action Planning:** Constraint Mapping — defining what's actually buildable

---

## Phase 1: What If Scenarios — Results

### Core Product Ideas

**[Feature #1]: The Dancer's Funnel**
_Concept_: Structure the entire IA around a progressive reveal — When → Where → Who → Cost — matching exactly how a dancer thinks when deciding to go out. Not a calendar grid as the entry point, but a priority-ordered decision flow.
_Novelty_: Most event sites default to calendar-first. This inverts it: lead with urgency and proximity, then layer in the details that close the decision.

**[Feature #2]: Fit Signal Tags**
_Concept_: Each event carries structured fit signals — beginner-friendly, partner-welcome, skill-level target, instructor present, special guest — so a dancer can self-select quickly without reading a paragraph of event description.
_Novelty_: Structured tags surface signals instantly and make them filterable. Free-text descriptions bury these signals.

**[Feature #3]: Hybrid Event Submission**
_Concept_: Event form has three layers — (1) core logistics (name, date, time, location, cost), (2) structured fit-signal fields, (3) freeform description for flavor. Discovery and filtering runs entirely off layers 1 and 2.
_Novelty_: Separates "what we need to index you" from "what you want to say about yourself." Organizers can't override signals by burying them in prose.

**[Feature #4]: Community Self-Policing (MVP Trust Model)**
_Concept_: For MVP, trust in event attributes relies on community size — Tulsa WCS is small enough that consistently misleading listings damage an organizer's reputation organically.
_Novelty_: Deliberately defers complexity. Trust is a social problem first.

**[Feature #5]: Fidelity Ratings (Post-MVP)**
_Concept_: Participant feedback on attribute accuracy — surfaced as a fidelity score per event/organizer over time. Attribution to organizer across recurring events is the hard design problem.
_Novelty_: Shifts trust from organizer self-report to community verification.

**[Feature #6]: Email-Gated Submissions (MVP)**
_Concept_: Every event submission requires an email address. No account creation, just a contact point. Accountability without friction.
_Novelty_: Minimal but sufficient — deters spam, enables future communication.

**[Feature #7]: Recurring Event Flag (MVP)**
_Concept_: Submission form includes a recurring toggle with frequency and end date if known. MVP displays it correctly; no automation yet.
_Novelty_: Separates display problem (show it repeats) from maintenance problem (keep it fresh).

**[Feature #8]: Monthly Confirmation Ping (Post-MVP)**
_Concept_: Automated monthly email to recurring event organizers — "Still running? [Yes] [No, let me update]." No confirmation after X cycles could auto-flag or auto-expire.
_Novelty_: Turns data maintenance into a micro-commitment from the person with the most information.

**[Feature #9]: Outbound Linking Model**
_Concept_: Each listing includes a "Learn More / Register" link to the organizer's own platform. If no link provided, the site's listing IS the event page.
_Novelty_: Site is an aggregator, not a ticketing platform. Organizers keep registration ownership.

**[Feature #10]: Multi-Select Attribute Filtering**
_Concept_: Users filter by any combination of fit signals — beginner-friendly, instructor present, special guest, skill level, event type. Filters stack. Updates instantly client-side via JavaScript.
_Novelty_: Multi-select on a free static site gives discovery power that rivals paid platforms.

**[Feature #11]: Shareable Event URLs with Social Preview**
_Concept_: Every event gets a permanent URL. Open Graph meta tags ensure rich preview cards when shared via iMessage, WhatsApp, Instagram DM, email. One tap to share.
_Novelty_: Every dancer who finds an event becomes a distribution channel. The site spreads itself through normal social behavior.

**[Feature #12]: Newcomer Onboarding**
_Concept_: A brief, confident paragraph that answers "what is West Coast Swing and why does Tulsa have a scene?" One paragraph, no tutorial, no video embeds.
_Novelty_: Acknowledges you might not belong yet — and makes that feel welcoming rather than exclusionary.

**[Feature #13]: Event Card Design**
_Concept_: Each card shows: event name, day + time, venue, cost, fit signal tags as compact labels. Three lines of information maximum, no truncation, no "read more."
_Novelty_: Designed for the parking-lot moment. Maximum information density, minimum interaction.

**[Feature #14]: Privacy-Respecting Telemetry (Architecture MVP, Implementation Post-MVP)**
_Concept_: Select a privacy-respecting, cookieless analytics tool at build time (Plausible or similar). Zero implementation of dashboards or organizer-facing features until post-MVP. Data accumulates from day one.
_Novelty_: Defers cost and complexity while preserving optionality.

**[Feature #15]: Gap Cards / False Doors (Post-MVP)**
_Concept_: Empty dates render as visible but unfilled cards — tappable, returning "nothing scheduled yet." Each tap registers as demand signal for that date.
_Novelty_: Turns user frustration into actionable data. The empty state becomes the most useful state.

**[Feature #16]: Demand Signals for Organizers (Post-MVP)**
_Concept_: Organizers see aggregated, anonymous interest data — "23 people looked for events on the 19th, nothing was listed." Data-backed reason to schedule on specific dates.
_Novelty_: Community behavior tells organizers where to show up. The site becomes a feedback loop.

**[Feature #17]: Request a Change Form**
_Concept_: A dedicated, low-profile page where organizers can request listing updates. Google Form with dropdown of current/future events, freeform description field, fixed recipient list of Jason and Jubilee.
_Novelty_: Clear path to corrections without opening direct spreadsheet access or flooding personal inboxes.

**[Feature #18]: Event Type Taxonomy**
_Concept_: Five required event types, filterable — Social Dancing, Group Lesson, Workshop, Competition, Convention. Distinct from fit signal tags: type describes what the event IS, tags describe who it's FOR.
_Novelty_: Separates two different filtering needs that most event sites collapse into one messy category field.

**[Feature #19]: Convention Listing (MVP)**
_Concept_: One master Convention listing for multi-day events (e.g., Tulsa Spring Swing) plus individual component listings using a naming convention — "Tulsa Spring Swing — Workshop: [Name]." No formal data relationship; freeform description carries context.

**[Feature #20]: Convention Event Hierarchy (Post-MVP)**
_Concept_: Formal parent/child relationship in data — a Convention listing owns its component events. Organizers submit once at top level, manage components from there.
_Target:_ Next February planning cycle.

**[Feature #21]: Event Type Placeholder Visuals**
_Concept_: A curated default image per event type — Social Dancing, Group Lesson, Workshop, Competition, Convention. Renders when no organizer image provided. Post-MVP: organizers can supply their own image URL.
_Novelty_: Every listing looks designed from day one without requiring anything from organizers.

**[Feature #22]: Email Mailing List Opt-In (MVP)**
_Concept_: Simple subscribe field — email address, one button — on the site. No account, no preferences. Free tier of Mailchimp or similar. Consult "Launch" by Jeff Walker for list-building strategy.
_Novelty_: Every subscriber is a future launch audience. The site becomes a direct channel to the Tulsa WCS community.

**[Feature #23]: Organizer Directory (Post-MVP)**
_Concept_: Dedicated section showcasing studios, instructors, and organizers who want visibility beyond their event listings.

### UX Decisions

**[UX #1]: Dual-Mode Interface**
Tonight view (mobile-first, one tap, today's events sorted by time) + Plan Ahead view (date picker, date range, calendar control). Calendar exists but is secondary, not the entry point.

**[UX #2]: Tonight View**
Single prominent default landing state returning today's events as a scannable list. Designed for the parking-lot moment.

**[UX #3]: Submit CTA Placement**
Footer only. Not the first, second, or third thing people see. Verbal test: "scroll to the bottom of any page."

**[UX #4]: Empty State — No Events Tonight**
Three elements: Browse Upcoming Events link + mailing list subscribe field + community statement.
*Copy:* "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them."

### Design Decisions

**[Design #1]: Edge and Sophistication Aesthetic**
Signals "real dance community." Not a beginner-friendly community center flyer, not a tech startup.

**[Design #2]: Clean and Cool Visual Direction**
White or off-white base, sharp typography, generous whitespace. Restraint as differentiator.

**[Design #3]: High-Contrast Serif + Sans Typography**
Sharp display serif for headings. Clean sans-serif for body/UI. High contrast between the two creates hierarchy without color.

**[Design #4]: Monochromatic Ink Palette**
Near-black with warm undertone as primary "color." White base. No accent hue — hierarchy from typography weight, size, and spacing only.

**[Design #5]: Hero**
Single headline: *"West Coast Swing in Tulsa."* No subline, no hero image, no CTA button.

### Technical Decisions

**[Technical #1]: Build Pipeline**
Google Form → Apps Script webhook → GitHub Actions workflow dispatch → GitHub Pages deploy. Manual trigger available in GitHub Actions UI. Events live within minutes of submission.

**[Technical #2]: Archive Model**
Build script splits events by date — future events on main interface, past events in Archive section. One spreadsheet, one source of truth. Passage of time auto-curates the site.

**[Technical #3]: GitHub Pages URL (MVP)**
Default GitHub Pages URL for launch. Swap in real domain when name is decided with Jubilee.

**[Technical #4]: Telemetry Architecture (MVP)**
Select privacy-respecting, cookieless tool at build time. Data accumulates; dashboards and organizer features are post-MVP.

### Adoption Decisions

**[Adoption #1]: Human-Curated Cold Start**
Jason and Jubilee manually seed all known recurring Tulsa WCS events at launch. Site goes live with real, accurate data before a single organizer submits anything.

**[Adoption #2]: Dual Distribution — Human + Search**
Jubilee seeds word-of-mouth in every class and conversation. SEO runs in parallel for Google searchers.

**[Adoption #3]: Schema.org Event Rich Cards**
Every event marked up with Schema.org Event structured data. Google surfaces rich event cards in search results.

**[Adoption #4]: Organizer SEO Incentive**
Explicit pitch to organizers: "Submit here and appear in Google rich cards — your Facebook event or studio site probably doesn't." Tangible value, not just altruism.

### Scope Decisions

**[Scope #1]: Geographic (MVP = Tulsa local only)**
Traveling dancer and geographic expansion are backlog.

**[Scope #2]: Site Structure (Four Views)**
Home/Tonight → Browse → Archive → Submit (footer)

### Operational Decisions

**[Operations #1]: Curator Workflow (MVP)**
Google Sheets IS the CMS. Jason and Jubilee manage directly in the spreadsheet.

**[Moderation #1]: Trust and Fix (MVP)**
All submissions go live immediately. Jason and Jubilee spot-check and clean up.

**[Moderation #2]: Review Queue + Hybrid (Post-MVP)**
Pending tab in spreadsheet; first-time submitters held for review.

### Copy

**[Copy #1]: Footer Attribution**
"A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name]."

**[Copy #2]: Empty State**
"Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them."

### Core Principle

**[Principle #1]: Accessibility by Default**
Semantic HTML, proper heading hierarchy, ARIA labels, keyboard navigation, sufficient contrast, alt text on all images. Audited before launch. An architectural and design principle baked into the ethos of the project.

---

## Phase 2: Mind Mapping — Results

**Central Concept:** Tulsa WCS Events Site

### Cluster Map

```
                    TULSA WCS EVENTS SITE
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
  DISCOVERY             DATA MODEL          SUBMISSION
  EXPERIENCE                │               & CURATION
        │              ┌────┴────┐               │
  Tonight View    Event Types  Fit Signals   Google Form
  Dual-Mode UI   (5 types)    (5 signals)   + Spreadsheet
  Dancer Funnel  Placeholder  Convention     Build Pipeline
  Event Cards    Visuals      MVP Model      Email on Submit
  Multi-Select   Archive      Outbound Link  Recurring Flag
  Filtering      Model        Model          Request Change
  Shareable URL                              Trust & Fix
  Empty State                                Curator: Jason
                                             + Jubilee

        │                   │                   │
   ADOPTION &          DESIGN                FUTURE
   COMMUNITY           SYSTEM               BACKLOG
        │                   │                   │
  Cold Start Seed  Accessibility     Fidelity Ratings
  Jubilee Channel  Clean & Cool      Gap Cards / Demand
  Schema.org       Serif + Sans      Monthly Ping
  Rich Cards       Monochromatic     Convention Hierarchy
  Org. SEO Pitch   Hero Headline     Organizer Directory
  Mailing List     Submit in Footer  Telemetry Dashboards
  Onboarding       Footer Credit     Geographic Expansion
                                     Weekly Digest
```

### Key Insights from Mapping

1. **The MVP core is tight.** Discovery Experience + Data Model + Submission & Curation are the entire functional site. Everything else multiplies reach or prepares for growth.

2. **Schema.org + Mailing List are the highest-leverage additions.** They convert a simple event list into a community asset with compounding returns — Google visibility and a direct audience channel.

3. **The Backlog is coherent, not a junk drawer.** Every post-MVP item is a natural evolution of something already in MVP.

### MVP Confirmation

Map confirmed by Jason. No items moved between MVP and Backlog. The shape is correct.

---

## Session Close

**Status:** Phases 1 and 2 complete. MVP scope is fully defined. Design direction is locked. Backlog is captured.

**Next Session:** Plan and build — move from brainstorming output to PRD and architecture decisions.


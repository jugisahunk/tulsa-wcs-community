---
title: Tulsa WCS Events Site — PRD
status: final
created: 2026-06-13
updated: 2026-06-13
---

# Tulsa WCS Events Site — PRD

## 1. Overview

The Tulsa WCS Events Site is a public, mobile-first event aggregator for the Tulsa West Coast Swing dance community. It provides a single, authoritative, always-current listing of local WCS events — socials, lessons, workshops, competitions, and conventions — accessible without a Facebook account, without an app install, and without any knowledge of who runs what.

The site is built for speed of deployment and simplicity of operation. A Google Form drives event submission. Google Sheets is the CMS. GitHub Pages hosts the static site. A lightweight build pipeline ensures new events go live within minutes of submission. Jason Knight and Jubilee [last name TBD] co-curate the content, with Jubilee serving as the community-facing co-owner and Jason as the technical operator.

---

## 2. Problem

Roughly 15–20% of the Tulsa WCS community does not use Facebook. The majority of local event promotion is Facebook-first, which means a meaningful slice of the scene has no reliable, low-friction way to find out what is happening this weekend, or this month.

Beyond the Facebook dependency, the scene is fragmented across individual studios and instructors, each with their own channels. No central calendar exists. First-timers and casual participants — exactly the people who would grow the scene — have no obvious starting point. The question "what's going on this week?" has no easy answer.

There is also a search visibility gap. Because no structured event data exists on a public, indexable web page, Google cannot surface Tulsa WCS events in search results. The audience a search-driven visitor would represent — someone who types "West Coast Swing Tulsa" and wants to know what's happening — is currently unreachable.

The site addresses all three gaps: platform independence, fragmentation, and search visibility.

---

## 3. Goals

**Deploy phase (Phase 1):**
- Build and deploy a working site seeded with known recurring Tulsa WCS events
- Give Jubilee a URL she can load, navigate, and recognize herself in — her events listed, her name present
- Establish baseline telemetry from day one
- Produce zero broken pages or layout failures on mobile

**Community launch phase (Phase 2):**
- Give the Tulsa WCS community a URL worth sharing — one that works reliably, looks credible, and represents the scene well
- Appear in Google rich event results for Tulsa WCS searches [ASSUMPTION: within 4–6 weeks of launch, consistent with standard Schema.org indexing timelines]
- Begin building a mailing list as an off-Facebook communications channel; first meaningful milestone is 50 subscribers
- Attract organic event submissions from organizers who were not seeded by Jason or Jubilee

**Ongoing:**
- Operate with minimal maintenance burden — no database, no auth, no server, no recurring infrastructure costs
- Keep the barrier to event submission low enough that any organizer can do it in under three minutes

---

## 4. Release Phases

### Phase 1 — Deploy

The goal of Phase 1 is to put a working, credible site on the internet with content Jason and Jubilee manually seeded. There is no public announcement. Success is a private URL that Jubilee can visit and say: "Yes, this is what I expected. This is good." The build pipeline must be functional, telemetry must be live, and mobile layout must be correct. Duration is not fixed — it ends when Jubilee is satisfied.

### Phase 2 — Community Launch

Phase 2 timing is owned entirely by Jubilee's judgment about community readiness. This is a politically sensitive launch in a small community. The site will not be announced until Jubilee decides the time is right. No date is committed in this PRD. Jason's role during the interval between Phase 1 and Phase 2 is to keep the site current, remain reachable for Jubilee's questions, and make any adjustments Jubilee identifies before announcement.

The launch strategy — how it is announced, who is notified first, what the framing is — is outside the scope of this document. It will be developed collaboratively by Jason and Jubilee.

---

## 5. Users

**The community dancer** — someone who dances WCS in Tulsa, ranging from near-beginner to experienced social dancer. They want to know what is happening tonight or this weekend. They are likely on a phone. They may or may not be on Facebook. They do not necessarily know all the local studios or instructors. They need a fast answer, not a research project.

**The first-timer or curious newcomer** — someone who has heard about West Coast Swing or seen it, wants to try it or watch it, and has no existing connections in the scene. They need a brief orientation (what is this? why Tulsa?) and a low-stakes, beginner-friendly entry point.

**The traveling dancer** — a WCS dancer from another city, visiting Tulsa, who searches for local events. They find the site via search. They want to know if anything is happening during their visit. This use case is served well by the site as built; no special features are needed for MVP.

**The event organizer** — a studio owner, instructor, or event host who wants their event listed. They are not technical. They have maybe three minutes. They submit via Google Form and expect it to appear quickly. They should never feel like they are asking for a favor — submission should feel like a standard, reliable service.

**Jason and Jubilee (curators)** — they review submissions, seed the initial data, make judgment calls about content quality, and handle change requests. They are the only users with any administrative surface for MVP.

---

## 6. User Journeys

### Journey 1 — Mobile dancer deciding whether to go out tonight

It is Saturday afternoon. Mia, a social dancer, wants to know if anything is happening tonight. She searches "West Coast Swing Tulsa" or opens a link she bookmarked. The site loads fast on her phone. She is immediately on the Tonight View — no navigation required, no login, no friction. She sees two events: a social at 8pm and a drop-in lesson at 7pm with social to follow. Both show venue, cost, and a fit signal — the lesson is marked Beginner-friendly, which she files away to mention to a friend. She taps the social's title and gets a shareable event page with full detail and a link to the organizer's site. She texts the link to her dance partner. The rich OG preview card loads in iMessage — name, date, venue image. They both go.

If nothing is on tonight, Mia sees a clear message, a Browse Upcoming link, and the mailing list field with the copy: "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them." She subscribes.

### Journey 2 — Organizer submitting an event

Marcus runs a monthly social at his studio. He has been listed on the site since launch — Jason seeded his recurring event — but he is adding a one-time special guest workshop. He finds the Submit link in the footer. The Google Form opens. He fills in the event name, date, time, venue, cost ($15), event type (Workshop), fit signals (Instructor present, Special guest present), a short description, and his contact email. He adds a link to his studio's event page as the source URL. He submits. Within a few minutes, the site rebuilds and his workshop is live. He texts Jason his organizer URL to double-check the link. It works.

---

## 7. Features — MVP

### FR-1 through FR-5: Tonight View (Home)

**FR-1** — The default landing page shows all events occurring today, sorted by start time ascending.

**FR-2** — Each event card displays: event name, start time, venue name, cost (or "Free"), event type badge, and applicable fit signals.

**FR-3** — When no events are scheduled for today, the page displays: a Browse Upcoming link (pre-filtered to tomorrow and beyond), a mailing list subscribe field (email input + one submit button), and the copy: "Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them."

**FR-4** — Each event card links to a permanent, shareable event detail page with full event data, Open Graph meta tags, and Schema.org Event markup.

**FR-5** — The Tonight View is mobile-first. Cards render correctly on screens 320px wide and up.

### FR-6 through FR-10: Browse View

**FR-6** — The Browse View lists all upcoming events (today + future), sorted by date and time ascending.

**FR-7** — Browse supports date filtering to narrow results to a specific date or range. Filter state updates client-side without page reload.

**FR-8** — Multi-select attribute filters: user can filter by one or more Event Types (Social Dancing, Group Lesson, Workshop, Competition, Convention) and one or more Fit Signals (Beginner-friendly, Partner-welcome, Skill level target, Instructor present, Special guest present). Filters combine with AND logic across categories, OR logic within a category. Updates client-side without page reload.

**FR-9** — Filter state is reflected in the URL so filtered views are bookmarkable and shareable.

**FR-10** — Each listing in Browse links to the same permanent event detail page used in the Tonight View.

### FR-11: Archive View

**FR-11** — A separate Archive View displays past events. The build script separates events by date; Google Sheets remains the single source of truth. Archive is secondary — it is accessible from navigation but not promoted.

### FR-12 through FR-13: Event Detail Pages

**FR-12** — Every event has a permanent URL. The page includes: full event name, date, time, venue (with address), cost, event type, fit signals, freeform description, and a link to the organizer's source URL if provided. If no source URL is provided, the detail page is the event page.

**FR-13** — Each event detail page includes: Open Graph meta tags (title, description, image) for rich preview in iMessage, WhatsApp, Instagram DM, and email; Schema.org Event markup for Google rich results. The OG image falls back to the event type placeholder image defined in FR-19 when no organizer image is available.

### FR-14 through FR-16: Submit & Change Requests

**FR-14** — A Submit link appears in the site footer only. It is not in primary navigation. It links to a Google Form.

**FR-15** — The Google Form collects: event name (required), date (required), start time (required), end time (optional), venue name (required), venue address (required), cost or free (required), event type (required, single-select), fit signals (optional, multi-select), freeform description (optional, 500 char limit), contact email (required, not displayed publicly), organizer source URL (optional), recurring event flag (toggle).

**FR-16** — A low-profile Request a Change page, accessible from the footer, links to a Google Form. The form includes a dropdown of current and upcoming events and a freeform change description field. Submissions route to Jason and Jubilee.

### FR-17 through FR-18: Onboarding & Mailing List

**FR-17** — One brief, confident paragraph appears on the site — location TBD at design time, likely below the hero — answering "what is West Coast Swing and why does Tulsa have a scene?" No tutorial, no embedded video, no external links required.

**FR-18** — An email subscribe field and single submit button appear on the Tonight View (empty-state only) and at least one additional location TBD at design time. The mailing list integration must require no server-side code.

### FR-19 through FR-20: Visuals & Recurring Events

**FR-19** — One curated default image per event type (five total) is selected at build time and displayed on event cards and detail pages when no organizer image is provided. Images are chosen to reflect the aesthetic of the design system.

**FR-20** — The submission form includes a recurring event toggle. Recurring events display a visual indicator on their cards and detail pages (e.g., "Recurring" badge). No automation for MVP — Jason or Jubilee re-seeds or updates recurring events manually as needed.

### FR-21: Telemetry

**FR-21** — Plausible Analytics [ASSUMPTION: or equivalent privacy-respecting, cookieless tool acceptable under GDPR/CCPA without a consent banner] is configured and active from the first deploy. No dashboards or organizer-facing reporting for MVP. Data is for Jason and Jubilee's internal use only.

### FR-22 through FR-23: Conventions & Footer

**FR-22** — Multi-day conventions are listed as: one master Convention listing for the overall event, plus individual component listings using a naming convention: "[Convention Name] — [Type]: [Title]" (e.g., "Tulsa Spring Swing — Workshop: Musicality with [Name]"). No formal parent/child data relationship for MVP.

**FR-23** — The site footer displays the attribution line: "A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD]." This copy is locked pending Jubilee's last name (see OQ-5).

---

## 8. Non-Functional Requirements

**Performance** — The site must load in under 2 seconds on a mid-range Android phone on a 4G connection. Static assets only; no client-side data fetching on initial load.

**Reliability** — GitHub Pages uptime is acceptable. No SLA beyond "hosted on GitHub Pages." Build pipeline failures should be surfaced to Jason via GitHub Actions notification; the site must never go dark silently.

**Accessibility** — First-class principle, not a checklist item. Semantic HTML with correct heading hierarchy. All interactive elements keyboard-navigable. ARIA labels on non-obvious controls. Sufficient color contrast on all text (WCAG AA minimum, AAA preferred). Alt text on all images including event type placeholders. Audited before Phase 2 launch.

**SEO** — Schema.org Event markup on every event detail page. Open Graph tags on every event page. A descriptive, crawlable site title and meta description. No JavaScript-required rendering for content that should be indexed.

**Privacy** — No cookies, no tracking pixels, no third-party embeds that set cookies. Telemetry tool must be cookieless. No personal data stored on the site. Organizer contact emails collected via Google Form are not displayed publicly.

**Browser support** — Modern browsers (Chrome, Safari, Firefox, Edge) — last two major versions. No IE11 support required.

**Cost** — Zero recurring infrastructure cost for MVP. Google Forms, Google Sheets, GitHub Pages, and Plausible free tier (or equivalent) are all free. Mailing list provider must have a free tier sufficient for early-stage subscriber counts.

---

## 9. Build Pipeline Requirements

**Trigger: form submit** — When an organizer submits the Google Form, a Google Apps Script runs on form submit, calls the GitHub Actions `workflow_dispatch` API, and triggers a site rebuild. The new event is live within minutes.

**Trigger: manual** — A manual rebuild can be triggered at any time from the GitHub Actions UI. This is the recovery path for all pipeline failures and the mechanism for seeding initial data.

**Build process** — GitHub Actions checks out the repository, reads event data from Google Sheets via the Sheets API (or exported CSV), runs the static site generator, and deploys to GitHub Pages.

**Data flow** — Google Sheets is the single source of truth. The build script reads it, separates upcoming from past events, generates all pages (Tonight, Browse, Archive, individual event detail pages), and writes the output. No intermediate database.

**Secrets management** — GitHub Actions secrets hold the Google Sheets API key and GitHub token. No secrets are embedded in the repository.

**Build failure handling** — If a build fails, the previous deploy remains live. GitHub Actions notifies Jason of the failure. The site does not go dark.

**Build time target** — Under 90 seconds end to end, from form submit trigger to live deploy.

---

## 10. Design Constraints

These constraints are locked. They are not design options to be explored — they are requirements.

**Aesthetic** — Edge and sophistication. Not a community center flyer, not a tech startup. The site should feel like something a serious dancer would trust.

**Color palette** — Near-black with warm undertone, and white. No accent hue. Hierarchy is achieved entirely through typography — weight, size, and spacing — not color.

**Typography** — Sharp display serif for headings. Clean sans-serif for body copy and UI elements. High visual contrast between the two typefaces. Both must be legible at mobile sizes and accessible at required contrast ratios.

**Hero** — A single headline: "West Coast Swing in Tulsa." No subheadline. No hero image. No CTA button in the hero.

**Layout** — Mobile-first. The Tonight View in particular must work flawlessly on a phone held one-handed.

**Voice** — Confident, direct, unhurried. The site knows what it is and does not oversell it. Copy is spare. The tone must also feel welcoming to newcomers — authoritative without being exclusionary.

**Information hierarchy** — The Tonight View is the landing experience, not a calendar grid. The design follows the dancer's decision priority: When → Where → Who → Cost. Each event card surfaces these in that sequence. This is intentional; designers should not reintroduce a calendar-first entry point.

**Organizer value proposition** — The Submit flow and any organizer-facing copy must communicate a concrete, specific benefit: submitting here causes the event to appear in Google rich event cards. Most Facebook events and studio websites do not produce Google rich results. This is not implied — it is stated.

---

## 11. Curator Workflow & Moderation

**Submission handling** — All submissions go live immediately upon build completion. There is no review queue. This is an intentional trust-first decision for MVP, made possible by the small scale of the Tulsa WCS community.

**Spot-checking** — Jason and Jubilee independently review new submissions as they come in. Google Sheets provides immediate visibility into all submitted data. If a submission is incorrect, misleading, or inappropriate, either curator can manually edit the sheet row and trigger a rebuild.

**Change requests** — Organizers with corrections use the Request a Change form. Submissions route to Jason and Jubilee via email. Changes are applied manually to the sheet and a rebuild is triggered.

**Cold start** — Before Phase 2 launch, Jason and Jubilee manually seed all known Tulsa WCS recurring events. This baseline ensures the site is useful from the moment it is announced.

**Recurring events** — Recurring event listings are maintained manually. No automated recurrence logic exists in MVP. Jason or Jubilee updates or re-seeds recurring events as their schedules change.

**Escalation** — If a submission is clearly malicious or illegal, either curator removes it from the sheet and triggers a rebuild. There is no automated flagging system for MVP.

---

## 12. Success Metrics

### Phase 1 — Deploy

- Jubilee can navigate the site unassisted, without being walked through it, and understands what it is and who it is for
- Jubilee sees herself represented: her classes or events are listed, her name appears in the footer or about context
- Zero broken pages or layout failures on mobile
- Build pipeline successfully triggers on form submit and completes within 90 seconds
- Telemetry is live and recording from first deploy

### Phase 2 — Community Launch

- Google rich event card appears in search results for relevant Tulsa WCS queries [ASSUMPTION: within 4–6 weeks of launch, consistent with standard Schema.org indexing timelines]
- Mailing list reaches 50 subscribers (first meaningful milestone)
- Organic event submissions received from organizers not seeded by Jason or Jubilee [OPEN QUESTION: no automated metric exists for MVP; proxy is manual count of new Google Sheets rows not seeded by Jason or Jubilee]
- Site remains live with no infrastructure incidents through launch period

---

## 13. Post-MVP Backlog

These items are explicitly out of scope for MVP. They are documented here to capture intent and prevent scope creep into the initial build.

- **Fidelity ratings** — participant feedback confirming or correcting fit signal accuracy after attending an event
- **Gap cards / demand signals** — showing organizers what types of events the community wants more of
- **Organizer-facing dashboard** — submission history, listing status, update interface
- **Monthly confirmation ping** — automated email to organizers of recurring events to confirm the event is still running
- **Convention parent/child hierarchy** — formal data relationship between a convention and its component events; target: next February planning cycle
- **Organizer directory** — a separate, browsable listing of Tulsa WCS instructors and studios
- **Telemetry dashboards** — visible analytics beyond raw Plausible data; organizer-facing traffic data
- **Geographic expansion** — listings for WCS events in nearby cities; traveling dancer use case
- **Weekly email digest** — automated weekly summary of upcoming events to mailing list subscribers
- **Review queue / hybrid moderation** — optional hold-for-review mode for submissions during high-volume or politically sensitive periods
- **Organizer image URL** — allowing organizers to supply a URL to their own event image to override the default event type placeholder

---

## 14. Open Questions

**OQ-2: Organic submission measurement** — The proxy metric (manual count of unseeded Google Sheets rows) is acceptable for Phase 2 but should be revisited if the organizer dashboard backlog item is prioritized.

**OQ-3: Community launch timing** — Owned entirely by Jubilee's community groundwork and judgment. This PRD does not commit a date. No action required here; this is a reminder that Jason should not push for a date or announce independently.

**OQ-4: Site name and domain** — Jason and Jubilee decide together. GitHub Pages URL is sufficient for Phase 1. Domain decision should happen before Phase 2 announcement. No action until then.

**OQ-5: Jubilee's last name** — Needed for footer attribution and any about or co-curator copy. Confirm with Jubilee before Phase 1 deploy.

**OQ-6: Abuse ceiling on trust-first moderation** — The trust-first model (all submissions live immediately) is appropriate at launch given the small community size. No abuse-volume threshold is defined for MVP. If submission volume grows significantly or bad-faith submissions occur, the review queue / hybrid moderation item in the Post-MVP Backlog should be prioritized. No action required until then.

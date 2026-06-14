---
title: PRD Quality Review — Tulsa WCS Events Site
reviewed: 2026-06-13
reviewer: Claude Sonnet (automated rubric pass)
prd: prd-wcs-events-2026-06-13/prd.md
---

# PRD Quality Review — Tulsa WCS Events Site

## Overall verdict

This is a sharp, honest PRD with a clear thesis and unusually good scope discipline. The main risks are in implementation specificity (several FRs stop short of "done" criteria an engineer can test against) and one meaningful trust-model gap (auto-publish without review has no stated abuse ceiling), but neither blocks architecture work from starting today.

---

## Decision-readiness — strong

The PRD names trade-offs explicitly: trust-first moderation (§11), no automation for recurring events (§11, §FR-20), no formal parent/child for conventions (§FR-22), manual organic-submission counting (§OQ-2). Phase gating is honest — Phase 2 timing is owned by Jubilee, not a date, and the PRD says so rather than faking one. The one weak spot is that the abuse scenario in the trust-first moderation model has no floor — what happens if a bad actor flood-submits before Jason catches it? The PRD notes "malicious or illegal" escalation (§11) but not volume or reputational-damage scenarios.

### Findings

- **medium** Trust model has no abuse ceiling (§11) — The PRD states all submissions go live immediately and curators spot-check. No mention of rate limiting, maximum submissions per email, or what happens during an off-hours spam run before Jason sees the GitHub notification. For a small community where a single bad listing could damage Jubilee's credibility, this is a real-world risk worth naming even if the MVP answer is "accept it." *Fix:* Add one sentence to §11 acknowledging this ceiling and explicitly accepting the risk, or add a mitigation (e.g., max N submissions per email per 24h enforced at the Form level).

- **low** OQ-1 (mailing list provider) is flagged as needing a decision before build begins (§14), but FR-18 already calls Mailchimp the assumed default. If that assumption is the working answer, close OQ-1. If it is genuinely open, FR-18 should not name Mailchimp. *Fix:* Either resolve OQ-1 now (Mailchimp is the answer) or make FR-18 provider-agnostic and defer the vendor name to OQ-1.

---

## Substance over theater — strong

Personas (§5) are lean and purposeful — five users, none inflated. Each is described in terms of what they need and what the site does for them, not demographics for their own sake. The traveling dancer is acknowledged then explicitly deprioritized ("no special features needed for MVP"), which is honest signal management. NFRs (§8) are real: performance has a concrete device/connection target, accessibility is explicitly called a first-class principle with WCAG level specified, privacy has a specific behavioral rule (no cookies, no third-party tracking pixels). Vision (§10 Design Constraints) earns its space — "edge and sophistication, not a community center flyer" is actionable aesthetic direction.

### Findings

- **low** FR-17 (Newcomer Onboarding) is underdeveloped relative to the user journey it serves (the "first-timer or curious newcomer" in §5 is a named persona with explicit needs). The FR says "one brief paragraph, location TBD at design time." That is appropriate scope, but the persona description in §5 says this user needs "a brief orientation (what is this? why Tulsa?) and a low-stakes, beginner-friendly entry point." The FR covers the orientation but does not address the entry-point need — beginner-friendly fit signals on Tonight view cards presumably serve this, but the link between persona need and FR-2/FR-8 Fit Signals is never made explicit. *Fix:* Either add one sentence to FR-17 cross-referencing Fit Signals as the entry-point mechanism, or note in §5 that Fit Signals (FR-2, FR-8) serve the beginner entry-point need.

---

## Strategic coherence — strong

The thesis is clear and never lost: one URL, no Facebook, no friction. Features trace cleanly back to it. The Tonight view (FR-1 to FR-5) is the primary delivery mechanism — someone on a phone at 2pm Saturday gets an answer in seconds. Browse (FR-6 to FR-10) is the secondary surface. Submit (FR-14 to FR-15) is the supply side. Telemetry (FR-21), mailing list (FR-18), and SEO (FR-13, §8 SEO) are growth levers. Nothing in the FR list is decorative. Post-MVP backlog (§13) is clean — fidelity ratings, organizer dashboard, recurring automation — all clearly post-thesis, not scope creep in disguise.

### Findings

- **low** Convention listing (FR-22) is the one feature that sits slightly outside the thesis. The naming convention ("Tulsa Spring Swing — Workshop: Musicality with [Name]") is specified, but the rationale for why conventions get special treatment rather than just appearing as individual events is not stated. The reader can infer it (a convention has one master card plus sessions), but the tradeoff (no parent/child relationship, manual management) is only partially justified. *Fix:* Add one sentence to FR-22 stating why conventions need the naming convention — e.g., "so that sessions appear under a recognizable parent name without requiring a data relationship the current model cannot support."

---

## Done-ness clarity — adequate

Most FRs have sufficient shape for an engineer to know what to build. Several stop short of testable exit criteria. The clearest gaps:

### Findings

- **high** FR-7 (date range filter) has no UI specification — "user can select a date or range" leaves the interaction undefined. Is this a date picker? Two inputs? A pre-set range (This Week / This Month)? For a static site with client-side filtering, the choice of interaction model affects both the implementation and the mobile usability of the Browse view significantly. *Fix:* Specify the interaction model for date range selection, or explicitly delegate to UX ("interaction model is a UX decision; must update client-side without reload and reflect state in URL per FR-9").

- **high** FR-3 (empty state on Tonight view) specifies the copy for the mailing list CTA but does not specify what "Browse Upcoming link" navigates to. Given the site has a Browse view (FR-6), the answer is presumably that view — but if the Browse view shows "today + future" (FR-6), and today has no events, clicking Browse Upcoming from the empty state Tonight would drop the user into a list that starts with today's empty day. The UX of this transition is undefined. *Fix:* Clarify whether Browse Upcoming links to the Browse view with a filter pre-applied (e.g., starting from tomorrow), or whether it links to Browse and the Browse view handles the "today has no events" case visually.

- **medium** FR-8 (filters) specifies AND-across-categories, OR-within-category logic, but does not specify the default state. If no filters are selected, are all events shown? *Fix:* Add: "Default state (no filters selected) shows all upcoming events."

- **medium** FR-12 (event detail page) lists fields but does not specify what happens when optional fields are absent. If no description is provided, does the field show "No description provided" or is the section omitted? If no source URL is provided, FR-12 says "the detail page is the event page" — but what does the UI look like without a source URL? Is the organizer link section hidden or shown with a placeholder? *Fix:* Add absence-handling for each optional field, or delegate: "Absence of optional fields: section is omitted from the page; no placeholder text."

- **medium** FR-13 (OG tags) — "image" in OG tags is listed but no fallback image is specified for events without organizer images. FR-19 specifies placeholder images per event type. It should be explicit that FR-19 images serve as the OG image fallback. *Fix:* Add: "OG image falls back to the event type placeholder image defined in FR-19."

- **low** FR-9 (URL reflects filter state) — no format is specified. Engineers will need to decide the URL scheme. This is a low-stakes UX/dev decision but worth noting as a delegation. *Fix:* Either specify the URL format (e.g., `?type=Social+Dancing&fit=Beginner-friendly`) or explicitly note: "URL format is an implementation decision."

- **low** FR-16 (Request a Change) says the form includes "a dropdown of current and upcoming events." This is dynamically populated from the Sheet. The build pipeline must generate this dropdown list statically (since the site is static). The mechanism for keeping this dropdown current is not specified. *Fix:* Clarify whether the Request a Change form is a Google Form (like Submit) that is regenerated on each build, or a static page with a populated select element. If it is a Google Form, how is the dropdown kept current?

---

## Scope honesty — strong

Omissions are explicit and tagged. ASSUMPTION and OPEN QUESTION markers are used consistently. The post-MVP backlog (§13) is comprehensive and clearly bounded. "No database, no auth, no server" (§3 Ongoing) is a scope commitment, not a preference. The recurring event manual-only stance (§11, §FR-20) is stated rather than glossed. The launch timing being Jubilee's call (§4, §OQ-3) is explicit and correct.

### Findings

- **medium** The trust-first auto-publish decision (§11) is stated as intentional but its scope boundary is unclear. The PRD says it is "made possible by the small scale of the Tulsa WCS community" — but this is a community launch into a public URL. Once the URL is shared, the "small scale" assumption may not hold for submissions. The decision may still be correct for MVP, but the assumption should be tagged. *Fix:* Tag with [ASSUMPTION: submission volume will remain low enough for curator spot-checking to catch problems before they cause reputational damage; if volume increases significantly, move to the review queue backlog item.]

- **low** The 90-second build time target (§9) has no stated measurement method. How is this verified? *Fix:* Add: "Measured from GitHub Actions workflow_dispatch trigger receipt to GitHub Pages deploy complete, verified via Actions log timestamps."

---

## Downstream usability — adequate

Architecture can source the pipeline spec (§9) cleanly — trigger, build, deploy, failure handling are all specified. UX can source the aesthetic constraints (§10) — these are unusually tight and actionable for a PRD. Story writers can extract FR-by-FR. The gaps that hurt downstream are the done-ness issues noted above (FR-7, FR-3, FR-12 absence handling, FR-13 OG fallback) — each one will cause an architect or story writer to make a judgment call that should have been resolved at PRD level.

### Findings

- **high** No static site generator (SSG) is named. §9 says "runs the static site generator" but names no tool. Given the stack (GitHub Pages, Google Sheets, no server), the choice of SSG (Eleventy, Jekyll, Hugo, custom Node script, etc.) is a significant architecture decision that affects everything downstream. The PRD correctly delegates implementation choices, but for chain-top usability, the architect needs to know whether this is an open decision or whether Jason has a preference. *Fix:* Add to §9 or §8: "SSG tool selection is an architecture decision. Constraints: must run in GitHub Actions, must support a custom data source (Google Sheets CSV or API), must output fully static HTML. No JS framework required." Or, if Jason has a preference, name it.

- **medium** The Google Sheet structure is referenced throughout (§9, §11) but never specified. What are the column names? What is the schema? The build script reads this sheet — without a schema, architecture cannot design the data layer. *Fix:* Add an appendix or §9 subsection specifying the expected Google Sheet schema (column names, data types, required/optional). Alternatively, note: "Sheet schema is defined during architecture; all FR-15 form fields map to Sheet columns 1:1."

- **low** "Google Apps Script runs on form submit, calls the GitHub Actions workflow_dispatch API" (§9) — this is a real integration with a known failure mode: Google Apps Script has execution time limits and rate limits. This is noted implicitly in "build failure handling" but the failure mode specific to the Apps Script trigger (e.g., the script itself fails silently) is not covered. *Fix:* Add: "Apps Script trigger failures are out of band from GitHub Actions notifications. Acceptable for MVP; manual rebuild is the recovery path."

---

## Shape fit — strong

This PRD is correctly sized for a community tool built by one technical operator with one community co-owner. It does not have enterprise furniture — no stakeholder matrices, no regulatory compliance tables, no SLA percentages. What it has is appropriate: a clear problem, honest personas, two-phase gating, explicit scope boundaries, and actionable design constraints. The phase structure (Phase 1 = Jubilee says yes, Phase 2 = community says yes) is the right shape for a politically sensitive community launch. The mailing list goal (50 subscribers) is the right kind of milestone — concrete, humble, and meaningful.

### Findings

- **low** The PRD has no table of contents or section map. At 14 sections and 282 lines, this is approaching the threshold where navigation matters, especially for the architect and story writer who will return to it repeatedly. *Fix:* Optional: add a compact TOC after the frontmatter. Not blocking.

---

## Mechanical notes

- **Glossary drift** — "Fit Signals" is used in §5 (persona), §FR-2, §FR-8, §FR-15, and §FR-12, but is never defined in a glossary. The reader can infer the meaning from §FR-2 (Beginner-friendly, Partner-welcome, Skill level target, Instructor present, Special guest present), but downstream documents will benefit from a single canonical definition. Consider adding a one-sentence definition at first use in §7 or in a dedicated Glossary section.

- **ID continuity** — FR IDs are grouped by feature area (FR-1 through FR-5 = Tonight, FR-6 through FR-10 = Browse, etc.) and are continuous without gaps. This is clean. Section headers repeat the ID ranges ("FR-1 through FR-5: Tonight View") which aids navigation. No ID conflicts found.

- **[ASSUMPTION] index roundtrip** — Five [ASSUMPTION] tags found:
  - §3 Goals: Google rich results within 4–6 weeks
  - §FR-18: Mailchimp free tier; no server-side code required
  - §FR-21: Plausible free tier or equivalent; cookieless; no consent banner
  - §8 Cost: Plausible free tier or self-hosted
  - §12 Phase 2 metrics: Google rich event card within 4–6 weeks
  
  Note: The §3 and §12 [ASSUMPTION] tags about Google indexing timelines are redundant — they say the same thing in two places. One is enough; remove the duplicate or collapse them. The trust-first auto-publish decision in §11 is effectively an assumption but is not tagged — see Scope Honesty findings above.

- **UJ protagonist naming** — Journey 1 uses "Mia" (§6); Journey 2 uses "Marcus" (§6). These names are used for clarity and do not conflict with real named stakeholders (Jason, Jubilee). Jubilee's last name is explicitly noted as TBD (§1, §OQ-5). No protagonist naming issues.

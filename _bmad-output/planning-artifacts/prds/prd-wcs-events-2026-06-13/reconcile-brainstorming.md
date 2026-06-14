# Reconciliation — Brainstorming vs PRD

## Summary

Fidelity is high. Nearly every named feature, UX decision, design decision, technical decision, and backlog item from the brainstorming session is captured in the PRD with appropriate fidelity. Two meaningful gaps exist: the Organizer SEO Pitch (Adoption #4) is absent from the PRD entirely, and the footer attribution copy (Copy #1) is referenced but not locked in. One qualitative signal — the "Dancer's Funnel" IA framing — was absorbed into the Tonight view without retaining its original intent as a progressive information-reveal structure.

---

## Confirmed in PRD

- Feature #2, #3: Fit signal tags and hybrid submission form with layered fields — FR-2, FR-8, FR-15
- Feature #4: Community self-policing / trust-first moderation model — §11
- Feature #5: Fidelity ratings — §13 Post-MVP Backlog
- Feature #6: Email-gated submissions (contact email required, not public) — FR-15
- Feature #7: Recurring event flag with visual indicator — FR-20
- Feature #8: Monthly confirmation ping — §13 Post-MVP Backlog
- Feature #9: Outbound linking / aggregator model — FR-12
- Feature #10: Multi-select attribute filtering, client-side, instant — FR-8
- Feature #11: Shareable event URLs with Open Graph social preview — FR-4, FR-13
- Feature #12: Newcomer onboarding paragraph — FR-17
- Feature #13: Event card design (name, time, venue, cost, fit tags) — FR-2
- Feature #14: Privacy-respecting cookieless telemetry — FR-21, §8 Privacy
- Feature #15, #16: Gap cards / demand signals — §13 Post-MVP Backlog
- Feature #17: Request a Change form — FR-16
- Feature #18: Event type taxonomy (5 types) — FR-8, FR-15
- Feature #19: Convention MVP listing model — FR-22
- Feature #20: Convention parent/child hierarchy — §13 Post-MVP Backlog
- Feature #21: Event type placeholder visuals — FR-19
- Feature #22: Email mailing list opt-in — FR-18, FR-3
- Feature #23: Organizer directory — §13 Post-MVP Backlog
- UX #1, #2: Dual-mode interface (Tonight + Browse) — §7 FR-1 through FR-10
- UX #3: Submit CTA in footer only — FR-14
- UX #4: Empty state copy (exact wording) — FR-3
- Design #1–#5: Aesthetic, palette, typography, hero, monochromatic — §10 Design Constraints
- Technical #1–#4: Build pipeline, archive model, GitHub Pages URL, telemetry — §9 Build Pipeline Requirements
- Adoption #1: Human-curated cold start — §11 Curator Workflow
- Adoption #2: Dual distribution (Jubilee channel + SEO) — §3 Goals
- Adoption #3: Schema.org Event rich cards — FR-13, §8 SEO
- Scope #1: Geographic scope = Tulsa only, expansion is backlog — §13, §5 Users (traveling dancer)
- Scope #2: Four views (Tonight, Browse, Archive, Submit) — §7
- Operations #1: Google Sheets as CMS — §9, §11
- Moderation #1: Trust and fix, all submissions go live immediately — §11
- Moderation #2: Review queue / hybrid moderation — §13 Post-MVP Backlog
- Copy #2: Empty state copy (exact wording preserved) — FR-3
- Principle #1: Accessibility by default — §8 Accessibility

---

## Gaps — In brainstorming but missing from PRD

**Gap 1: Organizer SEO Pitch (Adoption #4)**
- What: The brainstorming session captured an explicit pitch to organizers — "Submit here and appear in Google rich cards — your Facebook event or studio site probably doesn't." This is a concrete adoption mechanism and a value-proposition message to organizers.
- Where: Brainstorming §Adoption Decisions, Adoption #4
- Not present in: §5 Users (Event Organizer persona), §7 FR-14/FR-15 (Submit), §6 Journey 2, or any copy requirements
- Severity: Medium — does not affect build, but is a community adoption lever that should be captured in launch strategy or copy requirements before Phase 2

**Gap 2: Footer attribution copy not locked (Copy #1)**
- What: Brainstorming named exact footer copy: "A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name]." The PRD references Jubilee's last name as TBD (§1) and the footer attribution is implied but the specific copy string is not included as a copy requirement.
- Where: Brainstorming §Copy, Copy #1
- Not present in: §10 Design Constraints or any copy requirements section
- Severity: Low — low risk to build, but should be locked before deploy since it is co-ownership-visible copy

**Gap 3: "Dancer's Funnel" IA framing (Feature #1)**
- What: Feature #1 proposed a progressive information reveal — When → Where → Who → Cost — as the organizing principle of the IA, specifically designed to match how a dancer decides to go out. The PRD captures the Tonight view and Browse view but describes them as views/modes, not as a decision-flow architecture. The explicit "not a calendar grid as the entry point" framing and the named information hierarchy are absent.
- Where: Brainstorming §Core Product Ideas, Feature #1
- Not present in: §7 (features describe what is shown, not the order/priority rationale), §10 Design Constraints
- Severity: Low — the output (Tonight view first) is correct; the risk is that a designer or implementer who reads only the PRD may not understand the intentional sequence and may inadvertently reintroduce calendar-first patterns

---

## Intentionally deferred (in post-MVP backlog)

All of the following brainstorming items are confirmed in §13 Post-MVP Backlog:

- Feature #5: Fidelity ratings (participant feedback on fit signal accuracy)
- Feature #8: Monthly confirmation ping for recurring events
- Feature #15 / #16: Gap cards / demand signals for organizers
- Feature #20: Convention parent/child event hierarchy (target: next February planning cycle)
- Feature #23: Organizer directory
- Moderation #2: Review queue / hybrid moderation
- Feature #14 partial: Telemetry dashboards and organizer-facing traffic data
- Organizer image URL (override for event type placeholder visual)
- Weekly email digest
- Geographic expansion

---

## Qualitative signals to flag

**"Edge and sophistication" must not read as cold**
The brainstorming called this out: "Not a beginner-friendly community center flyer, not a tech startup." The PRD (§10) captures the aesthetic directive accurately, but the risk is that "edge" + monochromatic + no-accent-hue reads as austere or unwelcoming. The brainstorming's intent was sophistication that signals "real dance community" — trust, not distance. A copy and design review should ask: does this feel like a place a nervous newcomer would still enter?

**"Parking-lot moment" framing**
The brainstorming used "the parking-lot moment" twice — once for the Tonight view (Feature #13) and once for the Dual-Mode UI (UX #1). This is a vivid design constraint: a dancer in a parking lot, phone in hand, deciding right now. The PRD captures the Saturday-afternoon scenario in Journey 1 but does not preserve this phrase or its intensity as a design test. Whoever builds the Tonight view should be given this mental model explicitly.

**Voice: "confident, direct, unhurried"**
The PRD (§10) captures this phrase. The brainstorming reinforced it via Feature #12 (Newcomer Onboarding): "Acknowledges you might not belong yet — and makes that feel welcoming rather than exclusionary." This nuance — that the confident voice must also be open — is not explicit in §10. Worth adding to copy guidance.

**"Consult Launch by Jeff Walker" for mailing list strategy**
The brainstorming (Feature #22) explicitly recommends Jeff Walker's "Launch" for list-building strategy. This is not referenced anywhere in the PRD. It is not a PRD concern per se, but it is an operational signal that should be captured in launch planning notes so it does not get lost.

**Adoption is a two-track strategy, not just SEO**
Brainstorming Adoption #2 named "Dual Distribution — Human + Search" as a named, balanced strategy. The PRD's §3 Goals captures both tracks but does not name or frame them as a deliberate dual-track approach. For Phase 2 planning, keeping this framing visible may help Jason and Jubilee avoid over-indexing on one channel.

---
story_key: 6-3-footer-links-and-plausible-analytics
status: not-started
---

# Story 6.3: Footer Links and Plausible Analytics

## Story

As an event organizer wanting to submit an event,
I want a visible Submit link in the footer that takes me to the Google Form,
So that I can submit without needing Jason's contact details.

As Jason and Jubilee (curators),
I want cookieless telemetry active from the first deploy,
So that we can see site usage from day one without a consent banner.

## Acceptance Criteria

**Given** `_includes/base.njk`
**When** rendered
**Then** a Submit link in the footer points to the Google Form URL for event submission (FR-14)

**And** a Request a Change link in the footer points to the separate change request Google Form (FR-16)

**And** the Plausible Analytics `<script>` tag is present in `<head>` with the correct `data-domain` (FR-21)

**And** the Plausible embed sets no cookies and requires no consent banner

**And** the Plausible account is created, the site domain is added, and a test pageview is confirmed before marking this story done

**And** `NOTES.md` documents the Umami self-hosted on Railway free tier as the zero-cost alternative

## Tasks / Subtasks

- [ ] Task 1: Get Google Form URLs from Jason (HALT if not available)
  - [ ] 1.1: Verify the event submission Google Form URL is known (the form Jason creates per FR-15)
  - [ ] 1.2: Verify the Request a Change Google Form URL is known (separate form per FR-16)
  - [ ] 1.3: If URLs are not yet available, HALT: "Jason must create both Google Forms and provide the URLs before this story can proceed"

- [ ] Task 2: Update footer links in `_includes/base.njk`
  - [ ] 2.1: Replace the `href="#"` placeholder on the Submit link:
    ```njk
    <a href="{{ SUBMIT_FORM_URL }}" class="site-footer__link" target="_blank" rel="noopener">Submit an event</a>
    ```
    Hardcode the actual URL (not an env var — these are public URLs, not secrets)
  - [ ] 2.2: Replace the `href="#"` placeholder on the Request a Change link with the actual form URL
  - [ ] 2.3: Add `rel="noopener noreferrer"` to all external footer links
  - [ ] 2.4: CSS uppercases "submit an event" to "SUBMIT AN EVENT" — source stays lowercase (per EXPERIENCE.md convention)

- [ ] Task 3: Add Plausible Analytics script tag
  - [ ] 3.1: Get Plausible account set up and domain added (Jason action — HALT if not done)
  - [ ] 3.2: Add to `<head>` in `_includes/base.njk`, after the font link:
    ```njk
    <script defer data-domain="tulsawcs.com" src="https://plausible.io/js/script.js"></script>
    ```
  - [ ] 3.3: Replace `tulsawcs.com` with the actual domain registered in Plausible
  - [ ] 3.4: Verify: the script sets NO cookies (inspect browser devtools → Application → Cookies after page load)
  - [ ] 3.5: No consent banner required (per NFR-5; Plausible is cookieless by design)

- [ ] Task 4: Confirm Plausible test pageview
  - [ ] 4.1: Deploy the site (or use the local dev server if Plausible supports localhost tracking)
  - [ ] 4.2: Visit the site and check Plausible dashboard for a pageview
  - [ ] 4.3: Document confirmation in Completion Notes (human verification required)

- [ ] Task 5: Update `NOTES.md` with Umami alternative
  - [ ] 5.1: Add section: "Analytics alternatives — if Plausible cost becomes a constraint (currently ~$9/mo after trial): Umami self-hosted on Railway free tier. Open source, cookieless, same privacy posture. See https://umami.is for setup."

- [ ] Task 6: Run final test suite
  - [ ] 6.1: Run `npm test` (full Vitest + Playwright suite)
  - [ ] 6.2: Confirm no regressions

## Dev Notes

### Plausible Analytics — Script Tag Only

Plausible's standard embed is a single `<script defer data-domain="...">` tag. It:
- Makes no cross-origin cookie requests
- Sends anonymous pageview events to Plausible servers
- Requires no user consent under GDPR/CCPA because it collects no personal data
- Works with JS disabled only if you also enable server-side tracking (not needed for MVP)

Per NFR-5 (Privacy): no cookies, no tracking pixels, no third-party embeds that set cookies. Plausible's script tag satisfies this requirement.

### Locked Footer Strings (EXPERIENCE.md)

| Element | Source text (CSS uppercases it) |
|---|---|
| Submit footer link | submit an event |
| Request change footer link | request a change |
| Footer attribution | A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD]. |

Do not change the attribution text — "last name TBD" is intentional until finalized.

### External Link Best Practices

Footer links point to Google Forms (external). Use `target="_blank"` with `rel="noopener noreferrer"` to:
- Open in a new tab (user context preserved)
- Prevent the new page from accessing `window.opener` (security)

### Plausible Account Setup

Jason must:
1. Create an account at plausible.io
2. Add the site domain (e.g., `tulsawcs.com`)
3. Get the script tag from the Plausible dashboard
4. The script tag's `data-domain` must match the domain exactly

### Umami Alternative

If Plausible's ~$9/month post-trial cost conflicts with NFR-7 (zero recurring cost), Umami on Railway free tier is the alternative:
- Self-hosted on Railway's free tier
- Same cookieless privacy posture
- Open source
- More setup work than Plausible but zero ongoing cost

Document this in `NOTES.md` but do not implement it unless Jason decides to switch.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

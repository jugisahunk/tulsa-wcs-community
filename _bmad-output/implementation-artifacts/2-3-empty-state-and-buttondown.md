---
story_key: 2-3-empty-state-and-buttondown
status: not-started
---

# Story 2.3: Empty State and Buttondown Mailing List Embed

## Story

As a community dancer finding no events tonight,
I want a helpful empty state with a subscribe form that works without cookies or a server,
So that I don't feel the site is broken and I have a path forward.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Confirm Buttondown account (HALT if not set up)
  - [ ] 1.1: Verify Jason has created a Buttondown account and the username/slug is known
  - [ ] 1.2: The embed endpoint URL format is: `https://buttondown.com/api/emails/embed-subscribe/{username}`
  - [ ] 1.3: If no Buttondown account exists, HALT and ask Jason to create one at buttondown.com (free tier, no credit card required)

- [ ] Task 2: Create `_includes/empty-state.njk`
  - [ ] 2.1: Wrapper: `<div class="empty-state">`
  - [ ] 2.2: Orientation line: `<p class="empty-state__orientation">Quiet tonight.</p>` (CSS uppercases to "QUIET TONIGHT.")
  - [ ] 2.3: Diamond ornament between orientation and copy:
    ```njk
    <span class="empty-state__diamond" aria-hidden="true">◆</span>
    ```
  - [ ] 2.4: Subscribe copy (locked string — do not paraphrase):
    ```njk
    <p class="empty-state__copy">Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them.</p>
    ```
  - [ ] 2.5: Buttondown subscribe form:
    ```njk
    <form class="subscribe-form" action="https://buttondown.com/api/emails/embed-subscribe/BUTTONDOWN_USERNAME" method="post" target="_blank">
      <input type="email" name="email" id="subscribe-email" required placeholder="your@email.com" class="subscribe-form__input">
      <button type="submit" class="subscribe-form__btn">Subscribe</button>
    </form>
    ```
    Replace `BUTTONDOWN_USERNAME` with the actual username.
  - [ ] 2.6: Browse Upcoming link: `<a href="/browse/" class="empty-state__browse-link">Browse upcoming</a>` (CSS uppercases to "BROWSE UPCOMING")

- [ ] Task 3: Add secondary subscribe form placement
  - [ ] 3.1: Choose one location: below the WCS intro paragraph on `index.njk` (always visible, even when events exist) OR in `_includes/base.njk` (site-wide)
  - [ ] 3.2: Recommended: add to `index.njk` below the intro paragraph, above the event list — this way it's on the Tonight View but not global noise
  - [ ] 3.3: Can reuse `{% include "empty-state.njk" %}` with a flag, or create a minimal `subscribe-inline.njk` partial with just the form
  - [ ] 3.4: Update `NOTES.md` to document the secondary placement location

- [ ] Task 4: Add empty state CSS
  - [ ] 4.1: `.empty-state`: centered text, generous vertical padding
  - [ ] 4.2: `.empty-state__orientation`: `text-transform: uppercase; letter-spacing: 0.18em; font-size: 14px; color: var(--color-text-primary);`
  - [ ] 4.3: `.empty-state__diamond`: `display: block; text-align: center; color: var(--color-gold); margin: var(--space-md) 0; font-size: 12px;`
  - [ ] 4.4: `.empty-state__copy`: `color: var(--color-text-muted); max-width: 340px; margin: 0 auto var(--space-lg);`
  - [ ] 4.5: `.empty-state__browse-link`: `display: block; text-align: center; text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; color: var(--color-text-primary);`
  - [ ] 4.6: Subscribe form: full-width email input, contrasting submit button

- [ ] Task 5: Wire empty state into Tonight View
  - [ ] 5.1: Confirm `index.njk` already includes `{% else %}{% include "empty-state.njk" %}{% endif %}` (from Story 2.2)
  - [ ] 5.2: For testing the empty state: adjust the mock data temporarily OR use Playwright `page.route()` to intercept and test with zero today events

- [ ] Task 6: Verify Buttondown submission
  - [ ] 6.1: Load the page in a real browser and submit a test email address
  - [ ] 6.2: Confirm the submission succeeds (Buttondown redirects or shows success)
  - [ ] 6.3: This is a human verification step — document that it was confirmed in Completion Notes

- [ ] Task 7: Run tests
  - [ ] 7.1: Run `npx playwright test tonight-empty` and confirm all tests PASS
  - [ ] 7.2: Run full suite to confirm no regressions

## Dev Notes

### Buttondown Embed — No Iframe, No Cookie

The AC explicitly forbids iframe embeds. Use a plain `<form>` with `method="post"` and `action` pointing to Buttondown's embed API. This works with JS disabled (native form POST). `target="_blank"` is optional but prevents the page from navigating away on submission.

### EXPERIENCE.md Locked Strings

| Element | Correct string |
|---|---|
| Orientation line | QUIET TONIGHT. |
| Empty state copy | Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them. |
| Browse link | BROWSE UPCOMING |

All uppercase in EXPERIENCE.md is achieved via CSS `text-transform: uppercase`. HTML source is lowercase/sentence case. Screen readers read the lowercase source naturally.

### Diamond Ornament

The diamond between "QUIET TONIGHT." and the subscribe copy must have `aria-hidden="true"` per the AC. The E2E test asserts `[aria-hidden="true"]` is present between those two elements. Use a `<span aria-hidden="true">` containing `◆` or a CSS `::before`/`::after` pseudo-element on a `<hr>` or empty element.

### Testing the Empty State

The empty state only appears when `collections.todayEvents` is empty. Testing this requires either:
1. A separate build with an empty fixture (run Eleventy with `EVENTS_FIXTURE=empty`)
2. Playwright route interception — intercept `GET /` and inject an empty-state HTML response
3. A separate URL `/empty-preview/` rendered during development

For the E2E tests written in Story 2.1, coordinate with the actual empty state strategy. If using option 2, add it to `tonight-empty.spec.js` setup.

### Secondary Subscribe Placement (FR-18)

FR-18 requires the subscribe form in at least two locations. The empty state is the first. The second placement should be documented in `NOTES.md`. Avoid placing it in `base.njk` (would appear on Browse, Archive, and detail pages where it's off-topic).

### Privacy

Buttondown's embed form sets no cookies and makes no third-party JS requests. Verify by opening browser devtools → Network tab → check for no third-party cookie-setting requests. This is required for NFR-5.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

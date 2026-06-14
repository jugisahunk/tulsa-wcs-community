---
story_key: 2-3-empty-state-and-buttondown
status: ready-for-dev
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

**And** the Buttondown account is configured and the endpoint URL is verified to accept test submissions before marking this story complete

**And** a secondary placement of the subscribe form is added to `index.njk` (at the bottom of the page, after the event list, before the closing `{% endblock %}`) and this location is documented in `NOTES.md` per FR-18

## Tasks / Subtasks

- [ ] Task 1: Verify Buttondown endpoint accepts submissions
  - [ ] 1.1: Username is `jugisahunk` — endpoint is `https://buttondown.com/api/emails/embed-subscribe/jugisahunk`
  - [ ] 1.2: Verify the endpoint accepts a test submission before marking story complete (POST with a test email)

- [ ] Task 2: Create `_includes/empty-state.njk`
  - [ ] 2.1: Outer `<div class="empty-state">` wrapper
  - [ ] 2.2: "QUIET TONIGHT." orientation line in `<p class="empty-state__headline">quiet tonight.</p>` (CSS handles uppercase)
  - [ ] 2.3: Diamond divider: `<div aria-hidden="true" class="diamond-divider">◆</div>`
  - [ ] 2.4: Locked body copy in `<p class="empty-state__copy">` — exact text from PRD (see Dev Notes)
  - [ ] 2.5: Subscribe form pointing to Buttondown endpoint (see Dev Notes for exact markup)
  - [ ] 2.6: "BROWSE UPCOMING" link: `<a href="/browse/" class="empty-state__browse">browse upcoming</a>`

- [ ] Task 3: Create `tonight-empty.njk` at project root (test fixture page)
  - [ ] 3.1: Extends `base.njk`, sets ARCHIVE tab as active (or no active tab — use an empty `page.url` workaround)
  - [ ] 3.2: `{% block content %}{% include "empty-state.njk" %}{% endblock %}`
  - [ ] 3.3: Confirm it renders at `/tonight-empty/` when Eleventy serves

- [ ] Task 4: Add secondary subscribe form to `index.njk` (FR-18)
  - [ ] 4.1: Include `{% include "empty-state.njk" %}` OR extract just the form into a separate `_includes/subscribe-form.njk` partial and include that
  - [ ] 4.2: Place secondary form at bottom of `index.njk` content block, after the event list section
  - [ ] 4.3: Document chosen location in `NOTES.md` under a "Subscribe Form Placements (FR-18)" section

- [ ] Task 5: Add empty-state styles to `assets/css/event-card.css` (or new `event-card.css` already handles `.diamond-divider` — add empty-state rules there)
  - [ ] 5.1: `.empty-state` — centered, `padding-top: var(--space-xl)` (40px section gap above)
  - [ ] 5.2: `.empty-state__headline` — Josefin Sans ALL CAPS, 14px, letter-spacing 0.12em, text-primary, centered, margin-bottom for diamond divider
  - [ ] 5.3: `.empty-state__copy` — body text (15px, normal case, 1.6 line-height, text-primary)
  - [ ] 5.4: Subscribe form email input — `border: none; border-bottom: 1px solid rgba(240,238,234,0.3); background: transparent; color: var(--color-text-primary); font-family: var(--font-body); font-size: 15px; width: 100%; padding: 8px 0; outline: none`
  - [ ] 5.5: Submit button — Josefin Sans ALL CAPS, 13px, 0.15em tracking; `background: var(--color-text-primary); color: var(--color-bg); border: none; border-radius: 3px; padding: 10px 20px; min-height: 44px; min-width: 44px; cursor: pointer`
  - [ ] 5.6: `.empty-state__browse` link — Josefin Sans ALL CAPS, 12px, underlined, text-primary color, block or inline display, minimum 44px tap target
  - [ ] 5.7: Focus ring on email input and submit button: `outline: 2px solid var(--color-text-primary); outline-offset: 2px`

- [ ] Task 6: Run tests and verify
  - [ ] 6.1: Run `npx playwright test tonight-empty` — ALL tests must pass
  - [ ] 6.2: Run `npx playwright test tonight-view` — must remain passing
  - [ ] 6.3: Run `npx playwright test mobile-layout` — must remain passing
  - [ ] 6.4: Run `npx playwright test smoke` — must remain passing
  - [ ] 6.5: Run `npm run build` — no errors
  - [ ] 6.6: Manually test form submission: enter a test email and verify Buttondown receives it

## Dev Notes

### Buttondown Account

Account is confirmed active. Username: `jugisahunk`

Embed endpoint: `https://buttondown.com/api/emails/embed-subscribe/jugisahunk`

This is a plain HTML form POST endpoint. No API key needed for public embed. The `name` attribute for the email field is `email_address` (not `email`). Verify with a test submission before marking complete.

### Buttondown Form Markup

```html
<form action="https://buttondown.com/api/emails/embed-subscribe/jugisahunk"
      method="post"
      target="popupwindow"
      class="subscribe-form">
  <label for="bd-email" class="sr-only">email address</label>
  <input type="email"
         name="email_address"
         id="bd-email"
         placeholder="your email"
         required>
  <button type="submit">subscribe</button>
</form>
```

Notes:
- `target="popupwindow"` is the standard Buttondown embed approach — on submit, Buttondown's confirmation page opens in a popup; the main page is unaffected
- `name="email_address"` is Buttondown's required field name (not `email`)
- No `<input type="hidden" name="tag">` needed for MVP
- NO JavaScript, NO iframe, NO tracking pixel — complies with NFR-5
- Works with JavaScript disabled (browser form POST)
- Add a visually-hidden `<label>` for accessibility: `class="sr-only"` with CSS `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);`

### Locked Empty State Copy (Do Not Modify)

From PRD (locked string from EXPERIENCE.md):
```
Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them.
```

"QUIET TONIGHT." is also a locked string from EXPERIENCE.md. Render in HTML as `quiet tonight.` (lowercase) — CSS applies `text-transform: uppercase`.

### Empty State Structure (Complete)

```njk
<div class="empty-state">
  <p class="empty-state__headline">quiet tonight.</p>
  <div aria-hidden="true" class="diamond-divider">◆</div>
  <p class="empty-state__copy">Some of the best nights in this community are planned last minute. Subscribe — you won't want to miss them.</p>
  
  <form action="https://buttondown.com/api/emails/embed-subscribe/jugisahunk"
        method="post"
        target="popupwindow"
        class="subscribe-form">
    <label for="bd-email" class="sr-only">email address</label>
    <input type="email"
           name="email_address"
           id="bd-email"
           placeholder="your email"
           required>
    <button type="submit">subscribe</button>
  </form>
  
  <a href="/browse/" class="empty-state__browse">browse upcoming</a>
</div>
```

### Test Fixture Page (`tonight-empty.njk`)

This page exists solely for E2E testing. It always renders the empty state regardless of real event data.

```njk
---
permalink: /tonight-empty/
eleventyExcludeFromCollections: true
---
{% extends "base.njk" %}
{% block content %}
{% include "empty-state.njk" %}
{% endblock %}
```

`eleventyExcludeFromCollections: true` prevents it from appearing in `collections.all`. The `permalink` front matter controls the output URL.

The tab bar active state: since `/tonight-empty/` doesn't match `/`, `/browse/`, or `/archive/`, no tab will have `aria-current="page"`. This is fine for a test fixture.

### Secondary Subscribe Placement (FR-18)

Add the subscribe form a second time in `index.njk`, at the bottom of the `{% block content %}` after the event list and WCS intro paragraph. Use the same `_includes/empty-state.njk` partial OR extract just the form HTML into `_includes/subscribe-form.njk` so it can be included without the full empty state wrapper.

**Recommended approach:** Extract `subscribe-form.njk` as a separate partial containing only the `<form>` element. Then:
- `empty-state.njk` includes `subscribe-form.njk`
- `index.njk` includes `subscribe-form.njk` directly at the bottom for the secondary placement

This avoids duplicating the form markup and makes it easy to update the Buttondown URL in one place.

Document in `NOTES.md`:
```markdown
## Subscribe Form Placements (FR-18)
- Primary: `_includes/empty-state.njk` — shown only when no today events
- Secondary: `index.njk` bottom of content block — shown always, below event list
Both use `_includes/subscribe-form.njk` partial.
```

### `tonight-empty.spec.js` Test for "QUIET TONIGHT."

The test for ordering: "QUIET TONIGHT." must appear **before** the subscribe copy. Use:
```js
const headline = await page.locator('.empty-state__headline').boundingBox();
const copy = await page.locator('.empty-state__copy').boundingBox();
expect(headline.y).toBeLessThan(copy.y);
```

Or simpler: use `locator.isVisible()` + DOM order (Playwright returns elements in DOM order).

### Privacy Compliance

`target="popupwindow"` opens Buttondown's confirmation page in a popup. The main site does not load Buttondown's JS or any tracking. No cookies are set by the form. This satisfies NFR-5.

### No Inline Success State

Per EXPERIENCE.md: "No inline success state, no toast, no modal for MVP." On submit, the browser opens the Buttondown confirmation page (popup). The main page stays as-is. Do not add any JS to intercept form submission or show a success message.

### Eleventy Build Behavior

`tonight-empty.njk` uses front matter `permalink: /tonight-empty/`. Eleventy will generate `_site/tonight-empty/index.html`. This is intentional — the file is a test fixture.

The dev server will serve it at `http://localhost:8080/tonight-empty/`. Playwright tests against this URL.

## Dev Agent Record

### Implementation Plan
(to be filled during implementation)

### Debug Log
(to be filled during implementation)

### Completion Notes
(to be filled during implementation)

## File List

(to be filled during implementation)

## Change Log

(to be filled during implementation)

## Status

ready-for-dev

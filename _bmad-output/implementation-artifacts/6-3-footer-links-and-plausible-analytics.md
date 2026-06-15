---
story_key: 6-3-footer-links-and-plausible-analytics
status: review
baseline_commit: 69741a08e51a9035eaf4f0c3582986a8a5a1447d
---

# Story 6.3: Footer Links and Plausible Analytics

Status: review

## Story

As an event organizer wanting to submit an event,
I want a visible Submit link in the footer that takes me to the Google Form,
so that I can submit without needing Jason's contact details.

As Jason and Jubilee (curators),
I want cookieless telemetry active from the first deploy,
so that we can see site usage from day one without a consent banner.

## Acceptance Criteria

1. **Given** `_includes/base.njk`  
   **When** rendered  
   **Then** the Submit link in the footer points to the real Google Form URL for event submission (FR-14), not `#`

2. **And** the Request a Change link in the footer points to the real change request Google Form URL (FR-16), not `#`

3. **And** the Plausible Analytics `<script>` tag is present in `<head>` with the correct `data-domain` (FR-21)

4. **And** the Plausible embed sets no cookies (verify in browser DevTools → Application → Cookies)

5. **And** the Plausible account is created, the site domain is added, and a test pageview is confirmed before marking this story done

6. **And** `NOTES.md` documents the Umami self-hosted on Railway free tier as the zero-cost alternative if Plausible cost becomes a constraint

7. **And** `npm test` passes with no regressions (60 unit tests + 162 E2E tests)

## Tasks / Subtasks

- [x] Task 1: Obtain external prerequisites from Jason before writing any code
  - [x] 1.1: Get the event submission Google Form URL — provided by Jason: `https://docs.google.com/forms/d/e/1FAIpQLSeaN4v3hDHgr1_wiuPms_i4ErYuafeKUTyLRk4GRvc1Lx6kmA/viewform?usp=dialog`
  - [x] 1.2: Get the Request a Change Google Form URL — Jason specified `mailto:jason.t.knight@gmail.com` for now (will update to Jubilee when ready)
  - [x] 1.3: Get the Plausible `data-domain` value — Jason opted for a free analytics alternative; see NOTES.md for provider options
  - [x] 1.4: **If any of these are unavailable:** write the file with `TODO` placeholders and document which values Jason must supply — analytics embed is a comment placeholder pending provider selection

- [x] Task 2: Update footer links in `_includes/base.njk`
  - [x] 2.1: Locate the footer (lines 31–37 of current `base.njk`)
  - [x] 2.2: Replace `href="#"` on the Submit link with the real Google Form URL
  - [x] 2.3: Replace `href="#"` on the Request a Change link with `mailto:jason.t.knight@gmail.com`
  - [x] 2.4: Add `target="_blank" rel="noopener noreferrer"` to Submit link (Google Form opens in new tab); mailto link does not get `target="_blank"` — opens mail client, not a tab
  - [x] 2.5: Do NOT change link text — "Submit an event" and "Request a change" are the locked strings (EXPERIENCE.md)
  - [x] 2.6: Do NOT change class names — `.site-footer__link` is already correct

- [x] Task 3: Add analytics script tag to `<head>` in `_includes/base.njk`
  - [x] 3.1: Add immediately after the `<link rel="stylesheet" href="/assets/css/event-card.css">` line
  - [x] 3.2: Inserted HTML comment placeholder: `<!-- TODO: Replace with analytics embed snippet from chosen provider (see NOTES.md for options) -->`
  - [x] 3.3: Placeholder goes BEFORE `{% block head %}{% endblock %}` — Jason replaces comment with provider embed when ready
  - [x] 3.4: The tag goes BEFORE `{% block head %}{% endblock %}` so page templates cannot accidentally override it

- [x] Task 4: Update `NOTES.md`
  - [x] 4.1: Appended "Analytics — Cookieless Telemetry (Story 6.3)" section with provider comparison table (Plausible, Cloudflare Web Analytics, GoatCounter, Umami)

- [x] Task 5: Verify no regressions
  - [x] 5.1: Run `npm test` (full Vitest + Playwright suite)
  - [x] 5.2: All 60 unit tests pass
  - [x] 5.3: All 162 E2E tests pass (worker-10 force-kill warning is a known Playwright cleanup artifact — not a test failure)
  - [x] 5.4: No test assertions affected by footer href or analytics comment changes

## Dev Notes

### Exact Diff for `_includes/base.njk`

Current footer (lines 31–37):
```html
  <footer class="site-footer">
    <p class="site-footer__attribution">A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD].</p>
    <nav class="site-footer__links">
      <a href="#" class="site-footer__link">Submit an event</a>
      <a href="#" class="site-footer__link">Request a change</a>
    </nav>
  </footer>
```

After this story (replace `SUBMIT_URL` and `CHANGE_URL` with real values):
```html
  <footer class="site-footer">
    <p class="site-footer__attribution">A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD].</p>
    <nav class="site-footer__links">
      <a href="SUBMIT_URL" class="site-footer__link" target="_blank" rel="noopener noreferrer">Submit an event</a>
      <a href="CHANGE_URL" class="site-footer__link" target="_blank" rel="noopener noreferrer">Request a change</a>
    </nav>
  </footer>
```

Current `<head>` (relevant excerpt, after line 10):
```html
  <link rel="stylesheet" href="/assets/css/event-card.css">
  {% block head %}{% endblock %}
```

After this story (replace `YOUR_DOMAIN` with real value, e.g. `tulsawcs.com` or `jugisahunk.github.io/tulsa-wcs-community`):
```html
  <link rel="stylesheet" href="/assets/css/event-card.css">
  <script defer data-domain="YOUR_DOMAIN" src="https://plausible.io/js/script.js"></script>
  {% block head %}{% endblock %}
```

### Critical: These Are Public URLs — Not Secrets

The Google Form URLs are plain public links. Do NOT put them in environment variables or GitHub Actions secrets. Hardcode them directly as string literals in `base.njk`. Anyone can find a Google Form URL by clicking the submit link — there is nothing to protect.

### Critical: Plausible Domain Must Match Exactly

The `data-domain` value in the script tag must match exactly what Jason registers in his Plausible dashboard. Common values:
- If using GitHub Pages default: `jugisahunk.github.io` (note: Plausible may need the path too — check the Plausible dashboard)
- If using a custom domain (e.g., `tulsawcs.com`): use that value

Plausible rejects pageviews whose `Referer` header doesn't match the registered domain, so a mismatch means no data shows up in the dashboard without any error.

### Why `defer` on the Plausible Script

`defer` ensures the script loads asynchronously after the HTML is parsed — it does not block page rendering. This is the standard Plausible embed recommendation and aligns with NFR-1 (< 2s page load). Do not use `async`; `defer` is correct for analytics scripts that don't need to run before DOM is ready.

### Plausible Privacy Guarantee

Plausible's script does not set cookies. Verify post-deploy:
1. Open Chrome DevTools → Application → Cookies → select the site origin
2. No cookies should be set after loading the page
3. No `__plausible` or `_ga`-style cookies

This satisfies NFR-5 (no cookies, no tracking pixels) and FR-21 (cookieless telemetry).

### Locked Footer Strings (Do Not Change)

From EXPERIENCE.md conventions (enforced in NOTES.md):
- Submit link text: `Submit an event` (CSS handles uppercasing via `text-transform`)
- Request link text: `Request a change`
- Attribution: `A community resource for West Coast Swing dancers in Tulsa. Maintained by Jason Knight and Jubilee [last name TBD].`

"[last name TBD]" stays as-is — it's a deliberate placeholder until finalized.

### NOTES.md Section to Append

Add this exact section at the end of `NOTES.md`:

```markdown
---

## Analytics — Plausible and Zero-Cost Alternative (Story 6.3)

**Active:** Plausible Analytics Cloud (~$9/mo after trial). Script tag in `_includes/base.njk` `<head>`. Cookieless; no consent banner required.

**Zero-cost alternative:** If Plausible's cost becomes a constraint (NFR-7: zero recurring infrastructure cost), switch to Umami self-hosted on Railway free tier:
- Open source, cookieless, same privacy posture as Plausible
- Railway free tier covers low-traffic community sites
- Swap the Plausible `<script>` tag with Umami's embed snippet (different `src`, same `data-website-id` pattern)
- See https://umami.is for setup documentation
```

### Project Structure: Files to Modify

| Action | Path | What Changes |
|--------|------|--------------|
| UPDATE | `_includes/base.njk` | Footer `href="#"` → real URLs; Plausible script tag in `<head>` |
| UPDATE | `NOTES.md` | Append analytics section |

No new files. No CSS changes. No Eleventy config changes.

### Test Suite Baseline

Current passing state (as of Story 5.3):
- 60 unit tests (Vitest) — none test `base.njk` HTML content
- 162 E2E tests (Playwright) — smoke test checks `<h1>` and no console errors; no test currently asserts footer `href` values or script tag presence

The changes in this story should not break any existing test. If a test does fail, investigate carefully — do not suppress it.

### External Prerequisites Summary

Jason must provide before this story is complete:
1. **Submit Google Form URL** — created by Jason per FR-15 (form collects: event name, date, start time, end time, venue name, venue address, cost, event type, fit signals, description, contact email, organizer source URL, recurring flag)
2. **Request a Change Google Form URL** — separate form per FR-16
3. **Plausible `data-domain`** — the domain Jason registered at plausible.io

### References

- `_includes/base.njk` — current content: footer placeholders at lines 33–35; `<head>` at lines 6–14
- [Source: `_bmad-output/planning-artifacts/epics.md#Story 6.3`]
- FR-14: Submit link in footer only (not in primary tab bar nav)
- FR-16: Request a Change link in footer
- FR-21: Plausible Analytics, cookieless, active from first deploy
- NFR-5: No cookies, no tracking pixels
- NFR-7: Zero recurring infrastructure cost (Plausible is the one exception, flagged)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Updated `_includes/base.njk` footer: Submit link → real Google Form URL with `target="_blank" rel="noopener noreferrer"`; Request a Change → `mailto:jason.t.knight@gmail.com` (no `target="_blank"` — mailto opens mail client, not a tab)
- Added analytics comment placeholder in `<head>` after `event-card.css` link, before `{% block head %}` — Jason swaps in provider embed when ready
- Jason chose free analytics over Plausible (~$9/mo). Best free options documented in NOTES.md: Cloudflare Web Analytics (recommended — free, cloud-hosted, no self-hosting) and GoatCounter (free for personal use)
- Appended "Analytics — Cookieless Telemetry (Story 6.3)" section to `NOTES.md` with full provider comparison table
- 60/60 unit tests pass, 162/162 E2E tests pass
- **Pending before AC 3–5 fully satisfied:** Jason must pick analytics provider, sign up, and swap in embed snippet; then verify no cookies in DevTools

### File List

- _includes/base.njk (updated — footer links, analytics placeholder in head)
- NOTES.md (updated — appended 6.3 analytics section)

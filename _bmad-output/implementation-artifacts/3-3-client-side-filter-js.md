---
story_key: 3-3-client-side-filter-js
status: not-started
---

# Story 3.3: Client-Side Filter JS

## Story

As a community dancer using the Browse View,
I want filter selections to update results instantly and be reflected in the URL,
So that I can bookmark a filtered view and share it with others.

## Acceptance Criteria

**Given** `assets/js/browse-filter.js` is implemented and loaded on the Browse View
**When** `npx playwright test browse-filter` is run
**Then** ALL Browse filter tests written in Story 3.1 PASS (green)

**Given** `browse-filter.js`
**When** reviewed
**Then** it contains zero npm dependencies (pure vanilla JS + `URLSearchParams` API)

**And** it is ≤150 lines

**And** filter changes toggle the `hidden` attribute on non-matching cards (no page reload, no re-render)

**And** filter state is written to URL via `history.pushState` before the filter is applied

**And** on page load, filter state is read from URL params and pre-applied

## Tasks / Subtasks

- [ ] Task 1: Create `assets/js/browse-filter.js`
  - [ ] 1.1: Cache references to all `.event-card` elements and their `data-*` attributes on load
  - [ ] 1.2: Implement `readFiltersFromURL()` — parse `URLSearchParams` for `type`, `signal`, `date`:
    ```js
    function readFiltersFromURL() {
      const params = new URLSearchParams(location.search);
      return {
        types: params.get('type') ? params.get('type').split(',') : [],
        signals: params.get('signal') ? params.get('signal').split(',') : [],
        date: params.get('date') || ''
      };
    }
    ```
  - [ ] 1.3: Implement `writeFiltersToURL(filters)` — serialize active filters back to URL:
    ```js
    function writeFiltersToURL(filters) {
      const params = new URLSearchParams();
      if (filters.types.length) params.set('type', filters.types.join(','));
      if (filters.signals.length) params.set('signal', filters.signals.join(','));
      if (filters.date) params.set('date', filters.date);
      const url = params.toString() ? `?${params}` : location.pathname;
      history.pushState(null, '', url);
    }
    ```
  - [ ] 1.4: Implement `applyFilters(filters)` — toggle `hidden` on cards based on filter state:
    ```js
    function applyFilters(filters) {
      let visibleCount = 0;
      cards.forEach(card => {
        const typeMatch = !filters.types.length || filters.types.includes(card.dataset.eventType);
        const cardSignals = card.dataset.fitSignals ? card.dataset.fitSignals.split(',') : [];
        const signalMatch = !filters.signals.length || filters.signals.some(s => cardSignals.includes(s));
        const dateMatch = !filters.date || card.dataset.eventDate === filters.date;
        const visible = typeMatch && signalMatch && dateMatch;
        card.hidden = !visible;
        if (visible) visibleCount++;
      });
      // Show/hide zero-results state
      const zeroResults = document.querySelector('.browse-zero-results');
      if (zeroResults) zeroResults.hidden = visibleCount > 0;
    }
    ```
  - [ ] 1.5: Implement `collectActiveFilters()` — read current state of all filter checkboxes + date input:
    ```js
    function collectActiveFilters() {
      const types = [...document.querySelectorAll('input[name="type"]:checked')].map(el => el.value);
      const signals = [...document.querySelectorAll('input[name="signal"]:checked')].map(el => el.value);
      const date = document.querySelector('input[name="date"]')?.value || '';
      return { types, signals, date };
    }
    ```
  - [ ] 1.6: Implement `updateFilterBarLabel(filters)` — toggle button text between "FILTER EVENTS ›" and "FILTERING › N ACTIVE":
    ```js
    function updateFilterBarLabel(filters) {
      const activeCount = filters.types.length + filters.signals.length + (filters.date ? 1 : 0);
      const btn = document.querySelector('.filter-bar__toggle');
      const clearLink = document.querySelector('.filter-bar__clear');
      if (btn) btn.textContent = activeCount ? `Filtering › ${activeCount} active` : 'Filter events ›';
      if (clearLink) clearLink.hidden = activeCount === 0;
    }
    ```
  - [ ] 1.7: Implement filter panel toggle (accordion open/close):
    ```js
    document.querySelector('.filter-bar__toggle')?.addEventListener('click', function() {
      const panel = document.querySelector('.filter-bar__panel');
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
    ```
  - [ ] 1.8: Attach change listeners to all filter inputs — on change: collect → write URL → apply → update label
  - [ ] 1.9: On `DOMContentLoaded`: read URL → pre-check matching checkboxes → apply → update label
  - [ ] 1.10: Restore filter state in checkboxes when loading from URL:
    ```js
    function restoreCheckboxesFromURL(filters) {
      document.querySelectorAll('input[name="type"]').forEach(el => {
        el.checked = filters.types.includes(el.value);
      });
      document.querySelectorAll('input[name="signal"]').forEach(el => {
        el.checked = filters.signals.includes(el.value);
      });
      const dateInput = document.querySelector('input[name="date"]');
      if (dateInput && filters.date) dateInput.value = filters.date;
    }
    ```

- [ ] Task 2: Verify script is ≤150 lines
  - [ ] 2.1: Count lines; refactor to remove comments/whitespace if over limit
  - [ ] 2.2: Zero npm dependencies — no `import` from node_modules

- [ ] Task 3: Run browse-filter tests and confirm all PASS
  - [ ] 3.1: Run `npx playwright test browse-filter` — all tests green
  - [ ] 3.2: Run full suite to confirm no regressions

## Dev Notes

### Filter Logic: AND across categories, OR within category

- `?type=social-dancing,workshop` → show cards that are Social Dancing OR Workshop
- `?type=social-dancing&signal=beginner-friendly` → show cards that are Social Dancing AND Beginner-friendly
- This is the standard faceted search pattern

### URL State Written BEFORE Filter Applied

Per the AC: write to URL via `history.pushState` before calling `applyFilters`. This ensures the URL reflects intent even if the filtering operation has any delay.

### `hidden` Attribute vs CSS `display: none`

Use the HTML `hidden` attribute, not CSS `display: none`. This is what the Playwright tests assert (`card:not([hidden])`). The `hidden` attribute has implicit ARIA semantics (hidden from accessibility tree) which is correct behavior for filtered-out content.

### `history.pushState` vs `replaceState`

Use `pushState` so each filter change adds a browser history entry (Back button works as expected). However, if rapid filtering creates a poor back-stack experience, consider debouncing or using `replaceState`. The AC says `pushState`, so use it.

### No npm Dependencies

The AC is explicit: zero npm dependencies. Do not use lodash, Alpine.js, or any other library. URLSearchParams is a native browser API available in all target browsers (Chrome, Safari, Firefox, Edge — last 2 versions).

### ≤150 Lines Constraint

This is an AC-level constraint. Structure the code to fit within this budget. The implementation outlined in the tasks is dense but achievable in ~120 lines including blank lines.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

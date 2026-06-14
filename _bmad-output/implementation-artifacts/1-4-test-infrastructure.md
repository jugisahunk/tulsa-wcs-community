---
story_key: 1-4-test-infrastructure
status: ready-for-dev
baseline_commit: 355327e2f3998815bad2892829915ac3f40feda0
---

# Story 1.4: Test Infrastructure (Vitest + Playwright)

## Story

As a developer,
I want Vitest and Playwright configured and a smoke E2E test passing,
So that the test-first workflow is operational before any feature work begins.

## Acceptance Criteria

**Given** `vitest.config.js`
**When** `npx vitest run` is executed
**Then** Vitest runs without errors (zero tests is a passing run at this stage)

**Given** `playwright.config.js`
**When** created
**Then** it configures three browser projects: Chromium, Firefox, WebKit

**And** it configures a `webServer` block pointing to `eleventy --serve` so Playwright starts the dev server automatically before tests run

**And** it targets `localhost` at the port Eleventy serves on

**Given** `tests/e2e/smoke.spec.js`
**When** `npx playwright test smoke` is run
**Then** it passes: the home page loads (HTTP 200), the `<h1>` "West Coast Swing in Tulsa" is present, and no console errors are thrown

**Given** `tests/fixtures/mock-events.js`
**When** created
**Then** it re-exports or mirrors the shape of `_data/events.mock.js` for use in unit test assertions

**And** `package.json` has scripts: `"test:unit": "vitest run"`, `"test:e2e": "playwright test"`, `"test": "vitest run && playwright test"`

## Tasks / Subtasks

### Review Findings

- [x] [Review][Patch] `smoke.spec.js` tap-target test: `boundingBox()` can return `null` for off-screen elements; `box.width` throws TypeError — added `expect(box).not.toBeNull()` guard [tests/e2e/smoke.spec.js:46]
- [x] [Review][Defer] Console error test lacks `waitUntil:'networkidle'` — could miss late async errors; acceptable for SSG with no dynamic JS [tests/e2e/smoke.spec.js:16] — deferred, pre-existing
- [x] [Review][Defer] `npx @11ty/eleventy` in webServer command adds npx resolution overhead vs `node_modules/.bin/eleventy` — cosmetic [playwright.config.js:17] — deferred, pre-existing
- [x] [Review][Defer] Fixture import uses relative `../../` path — fragile if test dir structure changes; a vitest alias would be more robust [tests/fixtures/mock-events.js:1] — deferred, pre-existing

- [x] Task 1: Install and configure Vitest
  - [x] 1.1: `npm install vitest --save-dev`
  - [x] 1.2: Create `vitest.config.js` with `passWithNoTests: true` so zero-test run exits code 0
  - [x] 1.3: Add `"test:unit": "vitest run"` to `package.json` scripts
  - [x] 1.4: Run `npx vitest run` — exits code 0

- [x] Task 2: Install and configure Playwright
  - [x] 2.1: `npm install @playwright/test --save-dev`
  - [x] 2.2: Download browser binaries: `npx playwright install chromium firefox webkit`
  - [x] 2.3: Create `playwright.config.js` with 3 browser projects and webServer block
  - [x] 2.4: Add `"test:e2e": "playwright test"` to `package.json` scripts
  - [x] 2.5: Add `"test": "vitest run && playwright test"` to `package.json` scripts

- [x] Task 3: Create `tests/fixtures/mock-events.js`
  - [x] 3.1: Re-export events array from `_data/events.mock.js`
  - [x] 3.2: Add `getEventByType(type)` helper

- [x] Task 4: Create `tests/e2e/smoke.spec.js`
  - [x] 4.1: Test: home page loads with HTTP 200
  - [x] 4.2: Test: `<h1>` text is "West Coast Swing in Tulsa"
  - [x] 4.3: Test: no console errors on load

- [x] Task 5: Run smoke tests and confirm pass
  - [x] 5.1: 9/9 tests pass across all 3 browsers (Chromium, Firefox, WebKit)
  - [x] 5.2: N/A — no timeout issues

- [x] Task 6: Add `.gitignore` entries for test artifacts
  - [x] 6.1: Added `test-results/` and `playwright-report/` to `.gitignore`

## Dev Notes

### Eleventy Dev Server Port

Eleventy 3.x default port is `8080`. The `playwright.config.js` webServer block should use `--port=8080` explicitly. If 8080 is in use, pick another and update `baseURL` consistently.

### ESM Compatibility

Both `vitest.config.js` and `playwright.config.js` must use ESM syntax (`import`/`export default`) since the project has `"type": "module"` in `package.json`. If Playwright throws a syntax error, check that config file uses `import` not `require`.

### Smoke Test Console Error Detection

```js
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.goto('/');
expect(errors).toHaveLength(0);
```

Note: Some browser extensions inject console errors — the `webServer` is clean so this should be safe.

### Playwright `reuseExistingServer`

Set to `!process.env.CI` so that in CI a fresh server always starts, but locally you can pre-start Eleventy and Playwright will reuse it (faster iteration).

### webServer Timeout

Eleventy's first build can take 5–10 seconds. Set `timeout: 120000` to be safe. The `url` field tells Playwright to poll until the server is ready.

### Architecture Reference

- `_bmad-output/planning-artifacts/architecture.md` → "Testing" section: Vitest (ESM-native, zero config), Playwright (multi-browser, E2E journeys)
- Test file naming: unit → `tests/unit/{module}.test.js`, E2E → `tests/e2e/{view}.spec.js`

## Dev Agent Record

### Implementation Plan

Added `passWithNoTests: true` to `vitest.config.js` — Vitest exits code 1 by default with no test files, which would fail the AC. Added `eleventyConfig.addPassthroughCopy("assets")` to `.eleventy.js` — without it, `assets/css/base.css` was served as 404, causing console errors in all browsers that failed the smoke test.

### Debug Log

First Playwright run failed: CSS 404 causing "MIME type mismatch" console errors in all browsers. Root cause: Eleventy doesn't auto-copy static files — needed `addPassthroughCopy("assets")`. Second run: 9/9 pass.

### Completion Notes

Vitest v4.1.8 and Playwright v1.60.0 installed. Browser binaries (Chromium, Firefox, WebKit) downloaded. `vitest.config.js` and `playwright.config.js` created. `tests/fixtures/mock-events.js` and `tests/e2e/smoke.spec.js` created. 9/9 smoke tests pass. `.eleventy.js` updated with `addPassthroughCopy("assets")` as a required fix.

## File List

- `vitest.config.js` (created)
- `playwright.config.js` (created)
- `tests/fixtures/mock-events.js` (created)
- `tests/e2e/smoke.spec.js` (created)
- `package.json` (modified — added test:unit, test:e2e, test scripts; vitest and @playwright/test devDeps)
- `.gitignore` (modified — added test-results/, playwright-report/)
- `.eleventy.js` (modified — added addPassthroughCopy("assets"))

## Change Log

- 2026-06-13: Installed Vitest + Playwright. Created configs, smoke spec, fixtures re-export. Fixed assets passthrough copy in .eleventy.js. 9/9 E2E tests pass across 3 browsers.

## Status

done

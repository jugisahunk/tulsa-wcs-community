---
story_key: 1-1-eleventy-project-initialization
status: ready-for-dev
baseline_commit: 355327e2f3998815bad2892829915ac3f40feda0
---

# Story 1.1: Eleventy Project Initialization

## Story

As a developer,
I want the Eleventy v3.x project initialized with the correct directory structure and a running dev server,
So that all subsequent tracks have a working scaffold to build on.

## Acceptance Criteria

**Given** an empty project directory
**When** `npm create @11ty/eleventy@latest` is run (or equivalent manual install)
**Then** a valid Eleventy v3.x project exists with `package.json`, `.eleventy.js`, and `_site/` output on build

**Given** the initialized project
**When** `eleventy --serve` is run
**Then** a local dev server starts without errors and hot-reloads on file changes

**Given** the project structure
**When** reviewed
**Then** the following directories exist or are scaffolded: `_data/`, `_includes/`, `assets/css/`, `assets/js/`, `assets/images/event-types/`, `events/`, `tests/unit/`, `tests/e2e/`, `tests/fixtures/`, `scripts/`, `.github/workflows/`

**And** `.gitignore` excludes `_site/`, `node_modules/`

## Tasks / Subtasks

### Review Findings

- [x] [Review][Defer] `isToday`/`isPast` are static booleans — stale after build day [.eleventy.js] — deferred, pre-existing; address in story 1-2 data model
- [x] [Review][Defer] Filter null guards missing on `formatDate`, `formatTime`, `byDateAndTime`, `eventTypeToKebab`, `fitSignalToKebab` [.eleventy.js] — deferred, pre-existing; acceptable with controlled mock data; address when real data pipeline arrives (Epic 5)
- [x] [Review][Defer] `package.json` npm-init artifacts: `"main":"index.js"` and `"directories":{"doc":"docs"}` are irrelevant for an Eleventy site [package.json] — deferred, cosmetic; no functional impact

- [x] Task 1: Initialize the Eleventy project
  - [x] 1.1: Check if `package.json` already exists; if not, run `npm init -y`
  - [x] 1.2: Install Eleventy v3.x: `npm install @11ty/eleventy@^3 --save-dev`
  - [x] 1.3: Create `.eleventy.js` with ESM `export default` config, explicitly setting Nunjucks as the template engine and configuring `dir.input`, `dir.output`, and `dir.includes`
  - [x] 1.4: Add `"type": "module"` to `package.json` (Eleventy 3.x is ESM-native)

- [x] Task 2: Create all required directories
  - [x] 2.1: Create `_data/`, `_includes/`, `assets/css/`, `assets/js/`, `assets/images/event-types/`
  - [x] 2.2: Create `events/`, `tests/unit/`, `tests/e2e/`, `tests/fixtures/`, `scripts/`, `.github/workflows/`
  - [x] 2.3: Add a `.gitkeep` placeholder to each empty directory so git tracks them

- [x] Task 3: Create `.gitignore`
  - [x] 3.1: Add `_site/` and `node_modules/` entries
  - [x] 3.2: Add `.env` (for future local credential use — never commit)

- [x] Task 4: Create minimal `index.njk` placeholder
  - [x] 4.1: Create `index.njk` at project root with a minimal HTML page extending nothing yet — just `<h1>West Coast Swing in Tulsa</h1>` wrapped in basic HTML (base layout comes in Story 1.3)

- [x] Task 5: Add npm scripts
  - [x] 5.1: Add `"build": "eleventy"` to `package.json` scripts
  - [x] 5.2: Add `"start": "eleventy --serve"` to `package.json` scripts

- [x] Task 6: Verify build produces output
  - [x] 6.1: Run `npm run build` and confirm `_site/index.html` is generated without errors
  - [x] 6.2: Confirm build exits cleanly (exit code 0)

## Dev Notes

### Architecture Context

This is the Serial prerequisite for ALL other epics and stories. Nothing else starts until this is done.

- **SSG**: Eleventy v3.x (ESM-native). Config file: `.eleventy.js` using `export default function(eleventyConfig) { ... }`
- **Template engine**: Nunjucks — must be set explicitly in `.eleventy.js` even if it's the detected default
- **Output directory**: `_site/` (Eleventy default; confirm it's in `.gitignore`)
- **Architecture doc**: `_bmad-output/planning-artifacts/architecture.md` — "Starter Template Evaluation" section confirms Eleventy 3.x and the init command

### Key Implementation Notes

- `npm create @11ty/eleventy@latest` is interactive and may not run non-interactively in the dev agent environment. **Preferred approach**: `npm init -y && npm install @11ty/eleventy@^3 --save-dev`, then create `.eleventy.js` manually.
- The `"type": "module"` field in `package.json` is required because Eleventy 3.x is ESM-only and uses `import`/`export` syntax throughout.
- `.eleventy.js` minimal config:
  ```js
  export default function(eleventyConfig) {
    return {
      dir: {
        input: ".",
        output: "_site",
        includes: "_includes",
        data: "_data"
      },
      templateFormats: ["njk", "html"],
      markdownTemplateEngine: "njk",
      htmlTemplateEngine: "njk"
    };
  }
  ```
- The `index.njk` created here is a temporary placeholder. Story 1.3 will create `base.njk` and update `index.njk` to extend it. Epic 2 will implement the full Tonight View.
- All other stories depend on the npm scripts: `npm run build` and `npm start`.

### Directory Structure Reference

Full expected structure per `architecture.md`:
```
_data/         → events.js (Epic 5), events.mock.js (Story 1.2), site.js (Story 1.3)
_includes/     → base.njk, event-card.njk, filter-controls.njk, empty-state.njk
assets/css/    → base.css, event-card.css, browse-filters.css, event-detail.css
assets/js/     → browse-filter.js
assets/images/event-types/ → 5 placeholder images (Epic 2)
events/        → event-detail.njk (Epic 4)
tests/unit/    → *.test.js (Vitest)
tests/e2e/     → *.spec.js (Playwright)
tests/fixtures/ → mock-events.js
scripts/       → google-apps-script.js (Epic 6)
.github/workflows/ → build-deploy.yml (Epic 6)
```

## Dev Agent Record

### Implementation Plan

Used `npm init -y` + manual `npm install @11ty/eleventy@^3 --save-dev` approach (non-interactive) as specified in Dev Notes. Created `.eleventy.js` with ESM export default config per the architecture template. Set `"type": "module"` in package.json to satisfy Eleventy 3.x ESM requirement.

### Debug Log

No issues encountered. Build produced `_site/index.html` and exited with code 0 on first attempt.

### Completion Notes

All 6 tasks and 11 subtasks completed. Eleventy v3.1.6 installed. Project scaffold created with all required directories and `.gitkeep` placeholders. `.gitignore` covers `_site/`, `node_modules/`, and `.env`. `npm run build` produces `_site/index.html` cleanly (exit code 0). `npm start` is wired to `eleventy --serve`.

## File List

- `package.json` (created)
- `package-lock.json` (created)
- `.eleventy.js` (created)
- `.gitignore` (modified — added `_site/`, `node_modules/`, `.env`)
- `index.njk` (created)
- `_data/.gitkeep` (created)
- `_includes/.gitkeep` (created)
- `assets/css/.gitkeep` (created)
- `assets/js/.gitkeep` (created)
- `assets/images/event-types/.gitkeep` (created)
- `events/.gitkeep` (created)
- `tests/unit/.gitkeep` (created)
- `tests/e2e/.gitkeep` (created)
- `tests/fixtures/.gitkeep` (created)
- `scripts/.gitkeep` (created)
- `.github/workflows/.gitkeep` (created)

## Change Log

- 2026-06-13: Initialized Eleventy v3.1.6 project scaffold — package.json, .eleventy.js, all required directories, .gitignore, index.njk placeholder, npm build/start scripts. Build verified (exit code 0).

## Status

done

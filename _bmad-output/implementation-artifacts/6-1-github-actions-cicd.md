---
story_key: 6-1-github-actions-cicd
status: review
baseline_commit: 69741a08e51a9035eaf4f0c3582986a8a5a1447d
---

# Story 6.1: GitHub Actions CI/CD Workflow

Status: review

## Story

As Jason (operator),
I want GitHub Actions to build and deploy the site automatically, running all tests before any deploy,
so that no broken build ever reaches production and events go live without manual intervention.

## Acceptance Criteria

1. **Given** `.github/workflows/build-deploy.yml`  
   **When** triggered (`workflow_dispatch` or push to `main`)  
   **Then** the workflow runs in this order: checkout → `npm ci` → `npx vitest run` → `npx playwright test` → `npx @11ty/eleventy` build → GitHub Pages deploy

2. **And** if Vitest fails, subsequent steps do not run and the previous deploy remains live

3. **And** if Playwright fails, the build and deploy steps do not run

4. **And** if the Eleventy build fails, the deploy step does not run

5. **And** GitHub Actions sends a failure notification email to Jason on any step failure (via default GitHub failure notification — no custom setup required)

6. **And** `GOOGLE_SERVICE_ACCOUNT_JSON` is consumed from GitHub Actions secrets — never hardcoded; `USE_MOCK_DATA` is NOT set (CI always uses real Sheets data)

7. **And** build time from workflow trigger to live deploy is under 90 seconds under normal conditions (Playwright browser caching is critical to achieving this)

## Tasks / Subtasks

- [x] Task 1: External prerequisites (verify before writing any code)
  - [x] 1.1: Confirm GitHub repository `jugisahunk/tulsa-wcs-community` exists and Jason has admin access — confirmed via `gh repo view`
  - [ ] 1.2: Confirm `GOOGLE_SERVICE_ACCOUNT_JSON` secret is added to the repo's GitHub Actions secrets (Settings → Secrets and variables → Actions) — **Jason must verify/add in GitHub UI**
  - [ ] 1.3: Enable GitHub Pages on the repo: Settings → Pages → Source: **GitHub Actions** (not a branch) — **Jason must configure in GitHub UI**
  - [ ] 1.4: Confirm GitHub email notifications for Actions failures are enabled in Jason's account settings — **Jason must verify in GitHub account settings**

- [x] Task 2: Create `.github/workflows/build-deploy.yml`
  - [x] 2.1: Delete `.github/workflows/.gitkeep` (the placeholder will conflict once the real file exists)
  - [x] 2.2: Write the complete workflow file (see Dev Notes for exact YAML)
  - [x] 2.3: Verify triggers: `workflow_dispatch` (for Google Apps Script 6.2 to call) and `push: branches: [main]`
  - [x] 2.4: Verify permissions block: `pages: write`, `id-token: write`, `contents: read`
  - [x] 2.5: Verify browser caching step precedes the Playwright install step
  - [x] 2.6: Verify `GOOGLE_SERVICE_ACCOUNT_JSON` env is set on the Vitest, Playwright, and build steps (all three need it — Playwright starts Eleventy via `webServer` internally)
  - [x] 2.7: Verify `USE_MOCK_DATA` is explicitly NOT set anywhere in the workflow

- [ ] Task 3: Test the workflow end-to-end — **Jason must complete after push**
  - [ ] 3.1: Push the workflow file to `main` (the push trigger fires immediately)
  - [ ] 3.2: Monitor the Actions tab for each step passing in sequence
  - [ ] 3.3: Verify the site is live at `https://jugisahunk.github.io/tulsa-wcs-community/`
  - [ ] 3.4: Check total workflow duration — target under 90 seconds
  - [ ] 3.5: Trigger via `workflow_dispatch` manually (Actions tab → Run workflow) to confirm it works

- [ ] Task 4: Verify failure isolation (required by AC 2–4) — **Jason must complete**
  - [ ] 4.1: Intentionally break a unit test, push, confirm workflow stops at Vitest and deploy does not run
  - [ ] 4.2: Restore test and re-push to confirm green path
  - [ ] 4.3: Intentionally break an E2E test, push, confirm workflow stops at Playwright and deploy does not run
  - [ ] 4.4: Restore and re-push

- [ ] Task 5: Confirm failure notification — **Jason must complete**
  - [ ] 5.1: Trigger a deliberate failure (from Task 4) and verify Jason receives GitHub email notification
  - [ ] 5.2: Fix and confirm green run does not send notification

## Dev Notes

### Workflow YAML (complete — write this exactly)

```yaml
name: Build and Deploy

on:
  workflow_dispatch:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium firefox webkit

      - name: Run unit tests
        run: npx vitest run
        env:
          GOOGLE_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}

      - name: Run E2E tests
        run: npx playwright test
        env:
          GOOGLE_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}

      - name: Build site
        run: npx @11ty/eleventy
        env:
          GOOGLE_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: _site

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Critical: Why GOOGLE_SERVICE_ACCOUNT_JSON Goes on All Three Steps

`playwright.config.js` has a `webServer` block that starts Eleventy automatically before running any test:
```js
webServer: {
  command: 'npx @11ty/eleventy --serve --port=8080',
  url: 'http://localhost:8080',
  reuseExistingServer: !process.env.CI,  // false in CI — always starts fresh
  timeout: 120000
}
```
When Playwright runs in CI (`CI=true` is set by GitHub Actions automatically), it **starts its own Eleventy process** via `webServer`. That Eleventy process needs `GOOGLE_SERVICE_ACCOUNT_JSON` to fetch from Google Sheets. So the Playwright step needs the secret too.

The separate `Build site` step after Playwright is the production build that produces `_site/` for Pages deployment. It also needs the secret.

### Critical: USE_MOCK_DATA Must NOT Appear in the Workflow

`_lib/events.js` (the real Sheets fetcher) is loaded when `USE_MOCK_DATA` is unset or not `'true'`. The `.env` file at project root sets `USE_MOCK_DATA=true` for local dev. In CI, `.env` is not present and `USE_MOCK_DATA` is never exported — the build uses real Sheets data automatically. Do NOT add `USE_MOCK_DATA=false` to the workflow; just omit it entirely.

### Critical: GitHub Pages Must Be Configured for Actions Deployment

The repo uses the modern Actions-based Pages deployment (not branch-based). This requires:
1. Settings → Pages → Source: **GitHub Actions** (select this in the GitHub UI before running the workflow)
2. The `environment` block in the workflow pointing to `github-pages`
3. The `pages: write` and `id-token: write` permissions

If Pages source is still set to a branch, the `deploy-pages` action will fail.

### Critical: Delete .gitkeep Before Creating build-deploy.yml

`.github/workflows/.gitkeep` exists as a placeholder. Delete it when creating the real workflow file. Having both is harmless but untidy; `.gitkeep` has no effect on CI.

### Playwright Browser Caching (90s Target)

Browser install is the biggest single time cost (~30–60s on first run). The cache step before `playwright install` stores `~/.cache/ms-playwright` keyed by `package-lock.json`. On subsequent runs where `package-lock.json` hasn't changed, the install step becomes a cache hit and runs in ~2 seconds.

First run will still take longer; subsequent runs should comfortably fit in 90 seconds.

### Failure Notification (No Config Needed)

GitHub's default behavior: if any step exits non-zero, the workflow fails and GitHub emails all repo watchers with Actions failure notifications enabled. Jason must have these enabled in his GitHub account settings (Profile → Notifications → GitHub Actions → check "Email" for failures). No custom notification code needed.

### workflow_dispatch Trigger

The `workflow_dispatch` trigger is what Story 6.2 (Google Apps Script) calls to trigger rebuilds on form submission. The workflow name `Build and Deploy` and the `workflow_dispatch` key must be present for the script to call it via the GitHub API.

### Project Structure: Files to Create/Modify

| Action | Path | Notes |
|--------|------|-------|
| DELETE | `.github/workflows/.gitkeep` | Placeholder — remove |
| CREATE | `.github/workflows/build-deploy.yml` | The entire deliverable for this story |

No other files need modification. The workflow drives the existing build commands without touching source files.

### Test Suite Baseline (Current State)

- 60 unit tests (Vitest) — all passing as of Story 5.3
- 162 E2E tests (Playwright, 3 browsers × ~54 tests) — all passing as of Story 5.3
- Both suites run against real Google Sheets data in CI

### References

- `playwright.config.js` — webServer block and `reuseExistingServer: !process.env.CI`
- `.eleventy.js` — `USE_MOCK_DATA` env var control and `_lib/events.js` import
- `package.json` — `test:unit`, `test:e2e`, `build` scripts; repo URL `jugisahunk/tulsa-wcs-community`
- [Source: `_bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment`]
- [Source: `_bmad-output/planning-artifacts/epics.md#Story 6.1`]
- NFR-2: Build failures must surface to Jason; previous deploy stays live on failure

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Created `.github/workflows/build-deploy.yml` with exact YAML from Dev Notes
- Deleted `.github/workflows/.gitkeep` placeholder
- Verified: triggers (`workflow_dispatch` + `push: branches: [main]`), permissions (`pages: write`, `id-token: write`, `contents: read`), Playwright browser cache step before install, `GOOGLE_SERVICE_ACCOUNT_JSON` on all 3 steps (unit, e2e, build), `USE_MOCK_DATA` not present anywhere
- Task 1.1 verified via `gh repo view`: repo `jugisahunk/tulsa-wcs-community` exists
- **Jason must complete before story is done:**
  - Task 1.2: Add `GOOGLE_SERVICE_ACCOUNT_JSON` secret in GitHub Settings → Secrets and variables → Actions
  - Task 1.3: Enable GitHub Pages → Source: GitHub Actions in repo Settings → Pages
  - Task 1.4: Enable failure email notifications in GitHub account settings
  - Tasks 3–5: Push to main, monitor Actions tab, verify live URL, test failure isolation, confirm email notification

### File List

- .github/workflows/build-deploy.yml (created)
- .github/workflows/.gitkeep (deleted)

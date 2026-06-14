---
story_key: 6-1-github-actions-cicd
status: not-started
---

# Story 6.1: GitHub Actions CI/CD Workflow

## Story

As Jason (operator),
I want GitHub Actions to build and deploy the site automatically, running all tests before any deploy,
So that no broken build ever reaches production and events go live without manual intervention.

## Acceptance Criteria

**Given** `.github/workflows/build-deploy.yml`
**When** triggered (`workflow_dispatch` or push to main)
**Then** the workflow runs in order: checkout → `npm ci` → `npx vitest run` → `npx playwright test` → `eleventy` build → GitHub Pages deploy

**And** if Vitest fails, subsequent steps do not run and the previous deploy remains live

**And** if Playwright fails, the build and deploy steps do not run

**And** if the Eleventy build fails, the deploy step does not run

**And** GitHub Actions sends a failure notification email to Jason on any step failure (via default GitHub failure notification)

**And** `GOOGLE_SERVICE_ACCOUNT_JSON` is consumed from GitHub Actions secrets — never hardcoded

**And** build time from workflow trigger to live deploy is under 90 seconds under normal conditions

## Tasks / Subtasks

- [ ] Task 1: External setup — verify before implementing
  - [ ] 1.1: Confirm the GitHub repository exists and Jason has admin access
  - [ ] 1.2: Confirm `GOOGLE_SERVICE_ACCOUNT_JSON` secret is added to the repository's GitHub Actions secrets
  - [ ] 1.3: Confirm GitHub Pages is enabled on the repo (Settings → Pages → Source: GitHub Actions)

- [ ] Task 2: Create `.github/workflows/build-deploy.yml`
  - [ ] 2.1: Workflow triggers:
    ```yaml
    on:
      workflow_dispatch:
      push:
        branches: [main]
    ```
  - [ ] 2.2: Permissions for GitHub Pages deployment:
    ```yaml
    permissions:
      contents: read
      pages: write
      id-token: write
    ```
  - [ ] 2.3: Jobs:
    ```yaml
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
  - [ ] 2.4: Each step fails independently — default GitHub Actions behavior stops the workflow on failure (previous deploy stays live)

- [ ] Task 3: Test the workflow
  - [ ] 3.1: Push a commit or manually trigger via `workflow_dispatch`
  - [ ] 3.2: Monitor the Actions tab for success
  - [ ] 3.3: Verify the site is live at `https://{username}.github.io/{repo}/` or custom domain
  - [ ] 3.4: Check the build time — should be under 90 seconds
  - [ ] 3.5: Verify GitHub sends email notification to Jason on failure (trigger a deliberate failure, then fix it)

- [ ] Task 4: Verify failure isolation
  - [ ] 4.1: Intentionally break a unit test, push, confirm the workflow stops at Vitest step and deploy does not run
  - [ ] 4.2: Restore the test and re-push

## Dev Notes

### GitHub Pages with GitHub Actions

Use the new Actions-based GitHub Pages deployment (not the older branch-based approach). Requires:
1. `actions/upload-pages-artifact` to package `_site/`
2. `actions/deploy-pages` to deploy it
3. The `environment` block pointing to `github-pages`
4. `pages: write` and `id-token: write` permissions

### Playwright in CI

Playwright requires browser binaries which are NOT cached by default. `npx playwright install --with-deps chromium firefox webkit` downloads them. This takes ~30–60 seconds on first run. The `--with-deps` flag also installs OS-level dependencies (needed on Ubuntu).

For the 90-second total build time target: Playwright install is the biggest time cost. Consider caching browser binaries:
```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
```

### Environment Variables in CI

`GOOGLE_SERVICE_ACCOUNT_JSON` must be passed to the Vitest step (if unit tests need it), the Playwright step (E2E tests trigger a build), and the build step. The `env:` block at each step handles this.

### Failure Notification

GitHub's default behavior: if any step fails, GitHub emails the repository owner and any watchers who have notifications enabled. No custom notification setup needed. Jason should ensure he has email notifications enabled for Actions failures in his GitHub account settings.

### `workflow_dispatch` for Google Apps Script Trigger

The `workflow_dispatch` trigger is what the Google Apps Script in Story 6.2 calls to trigger a rebuild on form submission. The workflow name and inputs must match what the script expects.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

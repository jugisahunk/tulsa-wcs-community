---
story_key: 6-2-google-apps-script-form-trigger
status: not-started
---

# Story 6.2: Google Apps Script Form Trigger

## Story

As an event organizer,
I want my Google Form submission to automatically trigger a site rebuild,
So that my event goes live within minutes without any action from Jason.

## Acceptance Criteria

**Given** `scripts/google-apps-script.js` (stored in repo for version control; deployed manually to Google Apps Script)
**When** a Google Form is submitted
**Then** the script calls the GitHub Actions `workflow_dispatch` API to trigger `build-deploy.yml`

**And** the script uses `GITHUB_TOKEN` stored as a Google Apps Script script property (not hardcoded)

**And** the script is ~20 lines or fewer

**And** `NOTES.md` documents the manual deployment steps for this script

## Tasks / Subtasks

- [ ] Task 1: Create `scripts/google-apps-script.js`
  - [ ] 1.1: Write the `onFormSubmit` trigger function:
    ```js
    // Google Apps Script — runs in Google's V8 environment, NOT Node.js
    // Deploy manually to Google Apps Script editor; do NOT run with npm/node
    // Set GITHUB_TOKEN as a Script Property in the Apps Script editor

    const GITHUB_OWNER = 'YOUR_GITHUB_USERNAME';
    const GITHUB_REPO = 'wcs-events';
    const WORKFLOW_FILE = 'build-deploy.yml';

    function onFormSubmit() {
      const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
      const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`;
      const options = {
        method: 'post',
        contentType: 'application/json',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
        payload: JSON.stringify({ ref: 'main' }),
        muteHttpExceptions: true
      };
      const response = UrlFetchApp.fetch(url, options);
      Logger.log(`GitHub API response: ${response.getResponseCode()} ${response.getContentText()}`);
    }
    ```
  - [ ] 1.2: Fill in `GITHUB_OWNER` with the actual GitHub username/org
  - [ ] 1.3: Verify the script is ≤20 lines of functional code (comments excluded from count)
  - [ ] 1.4: Add a comment at the top: `// Google Apps Script — runs in Google's V8 environment, NOT Node.js`

- [ ] Task 2: Update `NOTES.md` with manual deployment instructions
  - [ ] 2.1: Document step-by-step how to deploy:
    1. Open the Google Form in Google Drive
    2. In the Form, open the Script editor (Extensions → Apps Script)
    3. Paste the contents of `scripts/google-apps-script.js` into the editor
    4. In Apps Script: Project Settings → Script properties → Add `GITHUB_TOKEN` property (value: a GitHub PAT with `workflow` scope)
    5. In Apps Script: Add a trigger: "onFormSubmit" → "On form submit"
    6. Save and authorize the script
  - [ ] 2.2: Document the GitHub PAT requirements: needs `workflow` scope; use a fine-grained PAT scoped to just this repository

- [ ] Task 3: Deploy and test (Jason action required)
  - [ ] 3.1: Jason deploys the script per `NOTES.md` instructions
  - [ ] 3.2: Submit a test form entry
  - [ ] 3.3: Verify GitHub Actions workflow triggered (check Actions tab in GitHub)
  - [ ] 3.4: Document test result in Completion Notes

## Dev Notes

### Google Apps Script Environment

`scripts/google-apps-script.js` is stored in the Git repo for version control only. It CANNOT be run with `node` or `npm`. It runs in Google's V8 engine inside the Apps Script editor in Google Drive.

Key differences from Node.js:
- `UrlFetchApp` replaces `fetch`/`axios` for HTTP requests
- `PropertiesService` replaces `process.env` for secrets
- `Logger.log` replaces `console.log`
- No `import`/`require` — all Google APIs are globally available
- No `async`/`await` — `UrlFetchApp.fetch` is synchronous

### GitHub PAT vs `GITHUB_TOKEN`

The built-in `GITHUB_TOKEN` in GitHub Actions cannot be used to trigger `workflow_dispatch` from external scripts (it can only be used within a workflow itself). Use a Personal Access Token (PAT) with `workflow` scope. Store it as a Google Apps Script script property named `GITHUB_TOKEN`.

### Trigger Type

The Google Form's Apps Script trigger should be an "On form submit" installable trigger bound to the form, not a simple trigger. Installable triggers run under the owner's authorization and can make external HTTP requests.

### ~20 Lines Constraint

The AC says "~20 lines or fewer". The implementation above is within this budget. Do not add error recovery, retry logic, or additional features — keep it minimal.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

---
story_key: 6-2-google-apps-script-form-trigger
status: review
baseline_commit: 69741a08e51a9035eaf4f0c3582986a8a5a1447d
---

# Story 6.2: Google Apps Script Form Trigger

Status: done

## Story

As an event organizer,
I want my Google Form submission to automatically trigger a site rebuild,
so that my event goes live within minutes without any action from Jason.

## Acceptance Criteria

1. **Given** `scripts/google-apps-script.js` (stored in repo for version control; deployed manually to Google Apps Script)  
   **When** a Google Form is submitted  
   **Then** the script calls the GitHub Actions `workflow_dispatch` API to trigger `build-deploy.yml` on the `main` branch of `jugisahunk/tulsa-wcs-community`

2. **And** the script uses `GITHUB_TOKEN` stored as a Google Apps Script script property — never hardcoded in the file

3. **And** the script is ~20 lines or fewer

4. **And** `NOTES.md` documents the manual deployment steps for this script

## Tasks / Subtasks

- [x] Task 1: Create `scripts/google-apps-script.js`
  - [x] 1.1: Delete `scripts/.gitkeep` placeholder
  - [x] 1.2: Write the script file (exact content in Dev Notes — do NOT deviate)
  - [x] 1.3: Confirm: no `import`/`require`, no `async`/`await`, uses `UrlFetchApp` not `fetch`

- [x] Task 2: Update `NOTES.md` with deployment instructions
  - [x] 2.1: Add the "Google Apps Script — Form Trigger (Story 6.2)" section from Dev Notes
  - [x] 2.2: Append to the existing `NOTES.md` content — do not replace or reorder existing sections

- [x] Task 3: No automated tests for this story
  - [x] 3.1: The script uses GAS built-ins (`UrlFetchApp`, `PropertiesService`) that don't exist in Node.js — unit testing is not possible
  - [x] 3.2: Manual verification (Task 3 in original stub) is a Jason action, not a dev agent action
  - [x] 3.3: Mark complete once the file is written and NOTES.md is updated

## Dev Notes

### The Script (write this exactly)

```javascript
// Google Apps Script — runs in Google's V8 environment, NOT Node.js.
// Deploy manually: open Google Form → Extensions → Apps Script → paste this file.
// Set GITHUB_TOKEN as a Script Property (Project Settings → Script Properties).
// Add trigger: onFormSubmit → From form → On form submit.
function onFormSubmit() {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const url = 'https://api.github.com/repos/jugisahunk/tulsa-wcs-community/actions/workflows/build-deploy.yml/dispatches';
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    payload: JSON.stringify({ ref: 'main' }),
    contentType: 'application/json',
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getResponseCode() + ': ' + response.getContentText());
}
```

### Critical: GAS Runtime vs Node.js

`scripts/google-apps-script.js` is in the repo for version control only. It is **never run by Node.js or npm**. The file must use GAS V8 built-ins:

| Node.js | GAS equivalent |
|---------|----------------|
| `fetch()` / `axios` | `UrlFetchApp.fetch()` — synchronous |
| `process.env.X` | `PropertiesService.getScriptProperties().getProperty('X')` |
| `console.log()` | `Logger.log()` |
| `require()` / `import` | Not available — everything is globally injected |
| `async`/`await` | Not needed — GAS HTTP calls are synchronous |

Do not add `import`, `require`, `async`, or `await`. The existing comments in the script file make the runtime context clear.

### Critical: This is a PAT, Not the Actions GITHUB_TOKEN

The `GITHUB_TOKEN` secret that GitHub Actions auto-injects into workflows **cannot trigger `workflow_dispatch` from external scripts** — it only works inside an already-running workflow. Jason needs a **Personal Access Token (PAT)**:

- Classic PAT: scope = `workflow`
- Fine-grained PAT: repository `tulsa-wcs-community`, permission `Actions: write`

Jason creates it at GitHub → Settings → Developer settings → Personal access tokens. He stores the value as the `GITHUB_TOKEN` script property in the Google Apps Script editor (Project Settings → Script Properties → Add property). The property name `GITHUB_TOKEN` is the key the script reads at line 2.

### Form Trigger Must Be Set Manually

The function name `onFormSubmit` alone does **not** wire it to the form — Google Apps Script has two types of triggers:

- **Simple triggers** (e.g., `onOpen`) — fire automatically by name convention
- **Installable triggers** — must be created explicitly; required for external HTTP calls

Jason must create an installable trigger:
1. Apps Script editor → Triggers (clock icon, left sidebar)
2. Add Trigger → `onFormSubmit` → Event source: From form → Event type: On form submit
3. Save → authorize when prompted (Google will request permission to call external URLs)

### NOTES.md Section to Append

Add this exact section at the end of `NOTES.md`:

```markdown
---

## Google Apps Script — Form Trigger (Story 6.2)

The script at `scripts/google-apps-script.js` triggers a GitHub Actions rebuild when a Google Form is submitted.

**This script is NOT run by Node.js.** Manual deployment steps:

1. Open the event submission Google Form → Extensions → Apps Script
2. Replace the default `myFunction` with the contents of `scripts/google-apps-script.js`
3. In Project Settings → Script Properties, add property: `GITHUB_TOKEN` = a GitHub PAT with `Actions: write` access (or `workflow` scope on a classic PAT) for `jugisahunk/tulsa-wcs-community`
4. In the Triggers panel (clock icon), add trigger: `onFormSubmit` → From form → On form submit
5. Authorize the script when prompted

**To verify:** Submit a test form entry. Check the Apps Script Executions panel for a `200`-series response. Confirm the GitHub Actions tab shows a new workflow run triggered.
```

### Project Structure: Files to Create/Modify

| Action | Path | Notes |
|--------|------|-------|
| DELETE | `scripts/.gitkeep` | Placeholder — remove |
| CREATE | `scripts/google-apps-script.js` | Complete deliverable |
| UPDATE | `NOTES.md` | Append deployment section |

### References

- [Source: `_bmad-output/planning-artifacts/epics.md#Story 6.2`]
- [Source: `_bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment`] — `workflow_dispatch` trigger, `GITHUB_TOKEN` as script property
- Story 6.1 creates `.github/workflows/build-deploy.yml` with `workflow_dispatch` trigger — this story calls it via the GitHub API

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Created `scripts/google-apps-script.js` with exact GAS V8 script from Dev Notes — uses `UrlFetchApp`, `PropertiesService`, `Logger.log`; no Node.js imports
- Deleted `scripts/.gitkeep` placeholder
- Appended "Google Apps Script — Form Trigger (Story 6.2)" section to `NOTES.md` with full manual deployment steps
- No automated tests possible: GAS built-ins are not available in Node.js environment
- **Jason must complete manually:** deploy script to Google Apps Script, set `GITHUB_TOKEN` script property (PAT with `Actions: write`), add `onFormSubmit` installable trigger, verify with test form submission

### File List

- scripts/google-apps-script.js (created)
- NOTES.md (updated — appended 6.2 section)

### Review Findings

- [x] [Review][Patch] Change `ref: 'main'` → `ref: 'master'` in GAS dispatch [scripts/google-apps-script.js:15] — fixed
- [x] [Review][Patch] `GITHUB_TOKEN` null-guard missing [scripts/google-apps-script.js:5] — fixed: throws if property not set
- [x] [Review][Patch] Non-2xx GitHub API responses silently swallowed [scripts/google-apps-script.js:19-20] — fixed: logs code + throws on non-2xx
- [x] [Review][Defer] Concurrent form submissions trigger redundant workflow runs with no deduplication [scripts/google-apps-script.js] — deferred, pre-existing

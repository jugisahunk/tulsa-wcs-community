---
story_key: 5-2-google-sheets-service-account-api
status: not-started
---

# Story 5.2: Google Sheets Service Account and API Integration

## Story

As the Eleventy build process,
I want `_data/events.js` to fetch all rows from Google Sheets and produce the canonical event array,
So that the site always reflects the live state of the events sheet.

## Acceptance Criteria

**Given** a Google Cloud service account with read-only access to the events sheet
**When** `GOOGLE_SERVICE_ACCOUNT_JSON` is available (locally via `.env`, in CI via GitHub Actions secret)
**Then** `_data/events.js` fetches all rows via the `googleapis` SDK and returns the parsed event array

**Given** `npx vitest run` is executed after `events.js` is implemented
**Then** ALL unit tests written in Story 5.1 PASS (green)

**And** the service account JSON key is stored as the `GOOGLE_SERVICE_ACCOUNT_JSON` GitHub Actions secret

**And** no credentials are committed to the repository

**And** the events Google Sheet is shared with the service account's email address with Viewer access

## Tasks / Subtasks

- [ ] Task 1: External setup — HALT if not done by Jason
  - [ ] 1.1: Verify `GOOGLE_SERVICE_ACCOUNT_JSON` is available in the environment (local `.env` or CI secret)
  - [ ] 1.2: Verify the Google Sheet ID and sheet name/range are known
  - [ ] 1.3: If credentials are not available, HALT and note: "Jason must create a Google Cloud service account, download the JSON key, share the Sheet with the service account email, and provide `GOOGLE_SERVICE_ACCOUNT_JSON` as an env var before this story can proceed"

- [ ] Task 2: Implement `_data/events-parser.js`
  - [ ] 2.1: Export `parseRow(row, rowIndex)` function (now implement what unit tests describe)
  - [ ] 2.2: Validate required fields; return null + `console.warn` if missing
  - [ ] 2.3: Parse `fitSignals` from comma-separated string to array
  - [ ] 2.4: Parse `isRecurring` from string "true"/"false" to boolean

- [ ] Task 3: Implement `_data/slug-generator.js`
  - [ ] 3.1: Export `generateSlug(name, date)` — kebab-case name + date
  - [ ] 3.2: Export `generateUniqueSlug(name, date, usedSlugsSet)` — handles collisions with `-2` suffix

- [ ] Task 4: Implement `_data/date-classifier.js`
  - [ ] 4.1: Export `classifyDate(dateStr)` → `{ isToday, isPast }`

- [ ] Task 5: Run unit tests — confirm all PASS
  - [ ] 5.1: `npx vitest run` — all tests from Story 5.1 must pass before proceeding

- [ ] Task 6: Install googleapis and implement `_data/events.js`
  - [ ] 6.1: `npm install googleapis`
  - [ ] 6.2: Create `_data/events.js`:
    ```js
    import { google } from 'googleapis';
    import { parseRow } from './events-parser.js';
    import { generateUniqueSlug } from './slug-generator.js';
    import { classifyDate } from './date-classifier.js';

    const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID_HERE';
    const SHEET_RANGE = 'Events!A2:M'; // skip header row

    export default async function() {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
      });
      const sheets = google.sheets({ version: 'v4', auth });
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_RANGE
      });
      const rows = response.data.values || [];
      const usedSlugs = new Set();
      return rows
        .map((row, i) => {
          const event = parseRow(row, i + 2); // +2 for header row offset
          if (!event) return null;
          const { isToday, isPast } = classifyDate(event.date);
          const id = generateUniqueSlug(event.name, event.date, usedSlugs);
          usedSlugs.add(id);
          return { ...event, id, isToday, isPast };
        })
        .filter(Boolean);
    }
    ```
  - [ ] 6.3: Add `SPREADSHEET_ID` to `.env` (local) and document that it must also be added to GitHub Actions secrets or hardcoded as a non-secret env var

- [ ] Task 7: Verify real data fetch (human verification)
  - [ ] 7.1: Run `npm run build` locally with `GOOGLE_SERVICE_ACCOUNT_JSON` set
  - [ ] 7.2: Confirm `_site/` is generated with real event data
  - [ ] 7.3: Document verification in Completion Notes

## Dev Notes

### Credential Security

`GOOGLE_SERVICE_ACCOUNT_JSON` is a multi-line JSON string. Store it in `.env` locally as a single-line JSON string (minified). The `.env` file is git-ignored (Story 1.1). In CI, it's a GitHub Actions secret.

Never commit:
- `.env`
- Any `*.json` file containing service account credentials
- The actual JSON key inline in any source file

### Sheets API Row Format

The Sheet should have headers in row 1. Data starts at row 2. `SHEET_RANGE = 'Events!A2:M'` fetches columns A through M from row 2 onward. Adjust the range if the column order differs from what `parseRow` expects.

The column order must match the `parseRow` implementation. Document the expected column order in `NOTES.md`.

### Build Error Handling

If `GOOGLE_SERVICE_ACCOUNT_JSON` is not set, the build should fail gracefully with a clear error message (not a cryptic JSON parse error). Add an explicit check:
```js
if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var not set. Use events.mock.js for local dev without credentials.');
}
```

### Fallback for Local Development

`events.mock.js` is the fallback for local dev without credentials. See Story 5.3 for how to switch between them. For now, `events.js` is a parallel file; `.eleventy.js` still uses `events.mock.js`.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started

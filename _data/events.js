import 'dotenv/config';
import { google } from 'googleapis';
import { parseRow } from './events-parser.js';
import { generateUniqueSlug } from './slug-generator.js';
import { classifyDate } from './date-classifier.js';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_RANGE = 'Events!A2:M';

async function fetchRealEvents() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var not set. Use events.mock.js for local dev without credentials.');
  }
  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID env var not set.');
  }

  let credentials;
  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } catch (e) {
    throw new Error(`Invalid GOOGLE_SERVICE_ACCOUNT_JSON: ${e.message}`);
  }

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
      try {
        const event = parseRow(row, i + 2);
        if (!event) return null;
        const { isToday, isPast } = classifyDate(event.date);
        const id = generateUniqueSlug(event.name, event.date, usedSlugs);
        usedSlugs.add(id);
        return { ...event, id, isToday, isPast };
      } catch (e) {
        console.warn(`row ${i + 2}: skipped due to error — ${e.message}`);
        return null;
      }
    })
    .filter(Boolean);
}

const defaultData = process.env.USE_REAL_EVENTS ? fetchRealEvents : async () => {
  console.warn('events.js: USE_REAL_EVENTS not set, returning empty array. Set USE_REAL_EVENTS=true to use Google Sheets data.');
  return [];
};

export default defaultData;

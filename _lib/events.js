import 'dotenv/config';
import { google } from 'googleapis';
import { parseRow } from '../_data/events-parser.js';
import { generateUniqueSlug } from '../_data/slug-generator.js';
import { classifyDate } from '../_data/date-classifier.js';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
// Skip Timestamp in column A — form responses start at B. Columns B:N = 13 fields.
const SHEET_RANGE = 'Events!B2:N';

// Convert M/D/YYYY (Google Sheets form date) to YYYY-MM-DD
function normalizeDate(val) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const m = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return val;
  return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

// Convert H:MM:SS AM/PM (Google Sheets form time) to HH:MM 24-hour
function normalizeTime(val) {
  if (!val) return val;
  if (/^\d{2}:\d{2}$/.test(val)) return val;
  const m = val.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (!m) return val;
  let h = parseInt(m[1], 10);
  const period = m[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

// Prefix cost with $ if missing (form may submit bare numbers)
function normalizeCost(val) {
  if (!val || val.startsWith('$') || val.toLowerCase() === 'free') return val;
  return `$${val}`;
}

// Convert Yes/No (form checkbox) to true/false string expected by parseRow
function normalizeRecurring(val) {
  const lower = val.toLowerCase();
  if (lower === 'yes') return 'true';
  if (lower === 'no') return 'false';
  return val;
}

function normalizeFormRow(row) {
  const r = [...row];
  if (r[1]) r[1] = normalizeDate(r[1]);
  if (r[2]) r[2] = normalizeTime(r[2]);
  if (r[3]) r[3] = normalizeTime(r[3]);
  if (r[6]) r[6] = normalizeCost(r[6]);
  if (r[12]) r[12] = normalizeRecurring(r[12]);
  return r;
}

export default async function fetchRealEvents() {
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
        const event = parseRow(normalizeFormRow(row), i + 2);
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

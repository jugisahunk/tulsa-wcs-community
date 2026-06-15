export function parseRow(row, rowIndex) {
  const name = (row[0] || '').trim();
  const date = (row[1] || '').trim();
  const startTime = (row[2] || '').trim();
  const endTime = (row[3] || '').trim();
  const venueName = (row[4] || '').trim();
  const venueAddress = (row[5] || '').trim();
  const cost = (row[6] || '').trim();
  const eventType = (row[7] || '').trim();
  const fitSignalsStr = (row[8] || '').trim();
  const description = (row[9] || '').trim();
  const contactEmail = (row[10] || '').trim();
  const sourceUrl = (row[11] || '').trim();
  const isRecurringStr = (row[12] || '').trim();

  const requiredFields = { name, date, startTime, venueName, cost, eventType };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      console.warn(`row ${rowIndex}`, `missing required field "${field}"`);
      return null;
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.warn(`row ${rowIndex}`, `invalid date format "${date}" — expected YYYY-MM-DD`);
    return null;
  }

  const fitSignals = fitSignalsStr
    .split(',')
    .map(s => s.trim())
    .filter(s => s);

  const isRecurring = isRecurringStr.toLowerCase() === 'true';

  return {
    name,
    date,
    startTime,
    endTime: endTime || null,
    venueName,
    venueAddress: venueAddress || null,
    cost,
    eventType,
    fitSignals,
    description: description || null,
    contactEmail: contactEmail || null,
    sourceUrl: sourceUrl || null,
    isRecurring
  };
}

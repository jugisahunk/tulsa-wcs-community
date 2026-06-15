/**
 * Classify a date string as today, past, or future.
 *
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {object} { isToday: boolean, isPast: boolean }
 */
export function classifyDate(dateStr) {
  // Parse the YYYY-MM-DD string as a local date (not UTC)
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const date = new Date(year, month - 1, day);
  const now = new Date();

  // Normalize both dates to midnight for comparison
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const normalizedNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isToday = normalizedDate.getTime() === normalizedNow.getTime();
  const isPast = normalizedDate.getTime() < normalizedNow.getTime();

  return { isToday, isPast };
}

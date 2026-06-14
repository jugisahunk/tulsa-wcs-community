import { describe, it, expect } from 'vitest';
import { classifyDate } from '../../_data/date-classifier.js';

const pad = n => String(n).padStart(2, '0');
const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const now = new Date();
const todayStr = fmt(now);
const tomorrowStr = fmt(new Date(now.getTime() + 86400000));
const yesterdayStr = fmt(new Date(now.getTime() - 86400000));
const lastMonthStr = fmt(new Date(now.getTime() - 30 * 86400000));

describe('classifyDate', () => {
  it("today's date → { isToday: true, isPast: false }", () => {
    const result = classifyDate(todayStr);
    expect(result.isToday).toBe(true);
    expect(result.isPast).toBe(false);
  });

  it("tomorrow's date → { isToday: false, isPast: false }", () => {
    const result = classifyDate(tomorrowStr);
    expect(result.isToday).toBe(false);
    expect(result.isPast).toBe(false);
  });

  it("yesterday's date → { isPast: true, isToday: false }", () => {
    const result = classifyDate(yesterdayStr);
    expect(result.isPast).toBe(true);
    expect(result.isToday).toBe(false);
  });

  it('one month ago → { isPast: true, isToday: false }', () => {
    const result = classifyDate(lastMonthStr);
    expect(result.isPast).toBe(true);
    expect(result.isToday).toBe(false);
  });
});

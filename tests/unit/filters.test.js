import { describe, it, expect, beforeAll } from 'vitest';
import configFn from '../../.eleventy.js';

const filters = {};
beforeAll(() => {
  configFn({
    ignores: { add: () => {} },
    addPassthroughCopy: () => {},
    addCollection: () => {},
    addFilter: (name, fn) => { filters[name] = fn; }
  });
});

// ── formatTime ────────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('converts midnight to 12:00 AM', () => {
    expect(filters.formatTime('00:00')).toBe('12:00 AM');
  });
  it('converts noon to 12:00 PM', () => {
    expect(filters.formatTime('12:00')).toBe('12:00 PM');
  });
  it('converts 9:05 AM correctly', () => {
    expect(filters.formatTime('09:05')).toBe('9:05 AM');
  });
  it('converts 20:00 to 8:00 PM', () => {
    expect(filters.formatTime('20:00')).toBe('8:00 PM');
  });
  it('converts 23:59 to 11:59 PM', () => {
    expect(filters.formatTime('23:59')).toBe('11:59 PM');
  });
  it('pads single-digit minutes', () => {
    expect(filters.formatTime('14:05')).toBe('2:05 PM');
  });
});

// ── formatDate ────────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('returns weekday, month, and day for current-year dates', () => {
    const year = new Date().getFullYear();
    const result = filters.formatDate(`${year}-06-15`);
    expect(result).toMatch(/\w+day/);  // weekday present
    expect(result).not.toMatch(`${year}`);  // year omitted
  });
  it('includes year for past-year dates', () => {
    const result = filters.formatDate('2020-01-15');
    expect(result).toContain('2020');
  });
  it('does not shift date due to timezone (uses T00:00:00 local)', () => {
    const year = new Date().getFullYear();
    const result = filters.formatDate(`${year}-01-01`);
    expect(result).toContain('January');
    expect(result).toContain('1');
  });
});

// ── formatDateShort ───────────────────────────────────────────────────────────

describe('formatDateShort', () => {
  it('returns abbreviated month and day', () => {
    expect(filters.formatDateShort('2026-06-15')).toMatch(/Jun 15/);
  });
  it('handles single-digit days', () => {
    expect(filters.formatDateShort('2026-03-05')).toMatch(/Mar 5/);
  });
});

// ── eventTypeToKebab ──────────────────────────────────────────────────────────

describe('eventTypeToKebab', () => {
  it('converts Social Dancing', () => {
    expect(filters.eventTypeToKebab('Social Dancing')).toBe('social-dancing');
  });
  it('converts Group Lesson', () => {
    expect(filters.eventTypeToKebab('Group Lesson')).toBe('group-lesson');
  });
  it('converts Workshop (single word)', () => {
    expect(filters.eventTypeToKebab('Workshop')).toBe('workshop');
  });
  it('converts Competition', () => {
    expect(filters.eventTypeToKebab('Competition')).toBe('competition');
  });
  it('converts Convention', () => {
    expect(filters.eventTypeToKebab('Convention')).toBe('convention');
  });
  it('collapses multiple spaces into a single hyphen', () => {
    expect(filters.eventTypeToKebab('West  Coast  Swing')).toBe('west-coast-swing');
  });
});

// ── fitSignalToKebab ──────────────────────────────────────────────────────────

describe('fitSignalToKebab', () => {
  it('converts Beginner-friendly (already has hyphen)', () => {
    expect(filters.fitSignalToKebab('Beginner-friendly')).toBe('beginner-friendly');
  });
  it('converts Partner-welcome', () => {
    expect(filters.fitSignalToKebab('Partner-welcome')).toBe('partner-welcome');
  });
  it('converts Skill level target (spaces become hyphens)', () => {
    expect(filters.fitSignalToKebab('Skill level target')).toBe('skill-level-target');
  });
  it('converts Instructor present', () => {
    expect(filters.fitSignalToKebab('Instructor present')).toBe('instructor-present');
  });
  it('converts Special guest present', () => {
    expect(filters.fitSignalToKebab('Special guest present')).toBe('special-guest-present');
  });
});

// ── fitSignalsToKebab ─────────────────────────────────────────────────────────

describe('fitSignalsToKebab', () => {
  it('joins multiple signals as comma-separated kebab string', () => {
    expect(filters.fitSignalsToKebab(['Beginner-friendly', 'Partner-welcome']))
      .toBe('beginner-friendly,partner-welcome');
  });
  it('handles a single signal with no comma', () => {
    expect(filters.fitSignalsToKebab(['Skill level target'])).toBe('skill-level-target');
  });
  it('handles empty array', () => {
    expect(filters.fitSignalsToKebab([])).toBe('');
  });
  it('handles all 5 canonical signals', () => {
    const result = filters.fitSignalsToKebab([
      'Beginner-friendly',
      'Partner-welcome',
      'Skill level target',
      'Instructor present',
      'Special guest present'
    ]);
    expect(result).toBe(
      'beginner-friendly,partner-welcome,skill-level-target,instructor-present,special-guest-present'
    );
  });
});

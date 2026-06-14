import { describe, it, expect, vi } from 'vitest';
import { parseRow } from '../../_data/events-parser.js';

const validRow = [
  'Tulsa Swing Social', '2026-06-20', '20:00', '23:00',
  "Cain's Ballroom", '423 N Main St', 'Free', 'Social Dancing',
  'Beginner-friendly', 'Good description', 'contact@example.com',
  'https://example.com', 'true'
];

describe('parseRow — valid row', () => {
  it('parses a complete valid row into canonical event shape', () => {
    const result = parseRow(validRow, 0);
    expect(result.name).toBe('Tulsa Swing Social');
    expect(result.date).toBe('2026-06-20');
    expect(result.startTime).toBe('20:00');
    expect(result.endTime).toBe('23:00');
    expect(result.venueName).toBe("Cain's Ballroom");
    expect(result.venueAddress).toBe('423 N Main St');
    expect(result.cost).toBe('Free');
    expect(result.eventType).toBe('Social Dancing');
    expect(result.isRecurring).toBe(true);
  });

  it('parses fitSignals as array', () => {
    const result = parseRow(validRow, 0);
    expect(Array.isArray(result.fitSignals)).toBe(true);
    expect(result.fitSignals).toContain('Beginner-friendly');
  });
});

describe('parseRow — optional null fields', () => {
  it('endTime empty → endTime: null', () => {
    const row = [...validRow];
    row[3] = '';
    const result = parseRow(row, 0);
    expect(result.endTime).toBeNull();
  });

  it('description empty → description: null', () => {
    const row = [...validRow];
    row[9] = '';
    const result = parseRow(row, 0);
    expect(result.description).toBeNull();
  });

  it('sourceUrl empty → sourceUrl: null', () => {
    const row = [...validRow];
    row[11] = '';
    const result = parseRow(row, 0);
    expect(result.sourceUrl).toBeNull();
  });
});

describe('parseRow — missing required fields return null', () => {
  it('missing name → returns null', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const row = [...validRow];
    row[0] = '';
    const result = parseRow(row, 5);
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('row 5'), expect.stringContaining('name'));
    warnSpy.mockRestore();
  });

  it('missing date → returns null', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const row = [...validRow];
    row[1] = '';
    expect(parseRow(row, 1)).toBeNull();
    warnSpy.mockRestore();
  });

  it('missing startTime → returns null', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const row = [...validRow];
    row[2] = '';
    expect(parseRow(row, 2)).toBeNull();
    warnSpy.mockRestore();
  });

  it('missing venueName → returns null', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const row = [...validRow];
    row[4] = '';
    expect(parseRow(row, 3)).toBeNull();
    warnSpy.mockRestore();
  });

  it('missing cost → returns null', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const row = [...validRow];
    row[6] = '';
    expect(parseRow(row, 4)).toBeNull();
    warnSpy.mockRestore();
  });

  it('missing eventType → returns null', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const row = [...validRow];
    row[7] = '';
    expect(parseRow(row, 6)).toBeNull();
    warnSpy.mockRestore();
  });
});

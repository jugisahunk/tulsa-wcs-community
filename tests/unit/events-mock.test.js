import { describe, it, expect } from 'vitest';
import mockEvents from '../../_data/events.mock.js';

const today = new Date();
const fmt = d => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const todayStr = fmt(today);
const pastStr = fmt(new Date(today.getTime() - 7 * 86400000));
const futureStr = fmt(new Date(today.getTime() + 7 * 86400000));

describe('mock event flags — isPast', () => {
  it('events with a past date have isPast: true', () => {
    const past = mockEvents.filter(e => e.date < todayStr);
    expect(past.length).toBeGreaterThan(0);
    past.forEach(e => expect(e.isPast).toBe(true));
  });

  it('events with today\'s date have isPast: false', () => {
    const todayEvents = mockEvents.filter(e => e.date === todayStr);
    expect(todayEvents.length).toBeGreaterThan(0);
    todayEvents.forEach(e => expect(e.isPast).toBe(false));
  });

  it('events with a future date have isPast: false', () => {
    const future = mockEvents.filter(e => e.date > todayStr);
    expect(future.length).toBeGreaterThan(0);
    future.forEach(e => expect(e.isPast).toBe(false));
  });
});

describe('mock event flags — isToday', () => {
  it('events with today\'s date have isToday: true', () => {
    const todayEvents = mockEvents.filter(e => e.date === todayStr);
    expect(todayEvents.length).toBeGreaterThan(0);
    todayEvents.forEach(e => expect(e.isToday).toBe(true));
  });

  it('events with a past date have isToday: false', () => {
    const past = mockEvents.filter(e => e.date < todayStr);
    past.forEach(e => expect(e.isToday).toBe(false));
  });

  it('events with a future date have isToday: false', () => {
    const future = mockEvents.filter(e => e.date > todayStr);
    future.forEach(e => expect(e.isToday).toBe(false));
  });
});

describe('mock fixture completeness', () => {
  it('has at least one past event', () => {
    expect(mockEvents.filter(e => e.isPast).length).toBeGreaterThanOrEqual(1);
  });

  it('has at least one today event', () => {
    expect(mockEvents.filter(e => e.isToday).length).toBeGreaterThanOrEqual(1);
  });

  it('has at least one future event', () => {
    expect(mockEvents.filter(e => !e.isPast && !e.isToday).length).toBeGreaterThanOrEqual(1);
  });

  it('every event has required fields', () => {
    mockEvents.forEach(e => {
      expect(e.id).toBeTruthy();
      expect(e.name).toBeTruthy();
      expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(e.eventType).toBeTruthy();
      expect(Array.isArray(e.fitSignals)).toBe(true);
      expect(typeof e.isPast).toBe('boolean');
      expect(typeof e.isToday).toBe('boolean');
    });
  });

  it('isPast and isToday are mutually exclusive', () => {
    mockEvents.forEach(e => {
      expect(e.isPast && e.isToday).toBe(false);
    });
  });

  it('event IDs are unique', () => {
    const ids = mockEvents.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

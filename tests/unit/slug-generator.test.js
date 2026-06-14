import { describe, it, expect } from 'vitest';
import { generateSlug, generateUniqueSlug } from '../../_data/slug-generator.js';

describe('generateSlug', () => {
  it('produces kebab-slug with date suffix', () => {
    expect(generateSlug('Tulsa Swing Social', '2026-06-20')).toBe('tulsa-swing-social-2026-06-20');
  });

  it('converts spaces to hyphens', () => {
    expect(generateSlug('WCS Workshop', '2026-06-20')).toBe('wcs-workshop-2026-06-20');
  });

  it('strips apostrophes', () => {
    expect(generateSlug("Jason's WCS Social", '2026-06-20')).toBe('jasons-wcs-social-2026-06-20');
  });

  it('strips or replaces special chars (#, &, !)', () => {
    const slug = generateSlug('Dance & Dine! #1', '2026-06-20');
    expect(slug).not.toMatch(/[#&!]/);
    expect(slug).toMatch(/^[a-z0-9-]+-2026-06-20$/);
  });
});

describe('generateUniqueSlug', () => {
  it('returns base slug when no collision', () => {
    const usedSlugs = new Set();
    const slug = generateUniqueSlug('Swing Social', '2026-06-20', usedSlugs);
    expect(slug).toBe('swing-social-2026-06-20');
  });

  it('appends -2 for first collision', () => {
    const usedSlugs = new Set();
    const first = generateUniqueSlug('Swing Social', '2026-06-20', usedSlugs);
    usedSlugs.add(first);
    const second = generateUniqueSlug('Swing Social', '2026-06-20', usedSlugs);
    expect(first).toBe('swing-social-2026-06-20');
    expect(second).toBe('swing-social-2026-06-20-2');
  });

  it('appends -3 for second collision', () => {
    const usedSlugs = new Set(['swing-social-2026-06-20', 'swing-social-2026-06-20-2']);
    const third = generateUniqueSlug('Swing Social', '2026-06-20', usedSlugs);
    expect(third).toBe('swing-social-2026-06-20-3');
  });
});

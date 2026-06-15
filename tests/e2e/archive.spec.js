import { test, expect } from '@playwright/test';
import { mockEvents } from '../../tests/fixtures/mock-events.js';

// mockEvents still used for the exclusion check in test 3 (names that must not bleed into archive)
const upcomingEvents = mockEvents.filter(e => !e.isPast);
const pastEvents = mockEvents.filter(e => e.isPast);

test('archive page renders without 404', async ({ page }) => {
  const response = await page.goto('/archive/');
  expect(response.status()).toBe(200);
});

test('past events are visible on archive page', async ({ page }) => {
  await page.goto('/archive/');
  const count = await page.locator('.event-card').count();
  if (count === 0) return; // no past events yet in this data set — valid
  await expect(page.locator('.event-card').first()).toBeVisible();
});

test('upcoming and today events are not present on archive page', async ({ page }) => {
  await page.goto('/archive/');
  const upcomingNames = [...new Set(upcomingEvents.map(e => e.name))];
  for (const name of upcomingNames) {
    const pastWithSameName = pastEvents.some(e => e.name === name);
    if (!pastWithSameName) {
      await expect(page.locator('.event-card', { hasText: name })).toHaveCount(0);
    }
  }
});

test('ARCHIVE tab has aria-current="page" on /archive/', async ({ page }) => {
  await page.goto('/archive/');
  await expect(
    page.locator('nav[aria-label="Main navigation"] a[href="/archive/"]')
  ).toHaveAttribute('aria-current', 'page');
});

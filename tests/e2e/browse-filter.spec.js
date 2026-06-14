import { test, expect } from '@playwright/test';
import { mockEvents } from '../../tests/fixtures/mock-events.js';

const upcomingCount = mockEvents.filter(e => !e.isPast).length;
const socialDancingUpcoming = mockEvents.filter(e => !e.isPast && e.eventType === 'Social Dancing').length;
const beginnerFriendlyUpcoming = mockEvents.filter(
  e => !e.isPast && e.fitSignals.some(s => s.toLowerCase() === 'beginner-friendly')
).length;
const workshopSkillTargetUpcoming = mockEvents.filter(
  e => !e.isPast && e.eventType === 'Workshop' && e.fitSignals.some(s => s.toLowerCase() === 'skill level target')
).length;

async function expandFilters(page) {
  await page.locator('.filter-bar__toggle').click();
}

test('browse page renders without 404', async ({ page }) => {
  const response = await page.goto('/browse/');
  expect(response.status()).toBe(200);
});

test('all upcoming events visible by default', async ({ page }) => {
  await page.goto('/browse/');
  const visibleCards = page.locator('.event-card:not([hidden])');
  await expect(visibleCards).toHaveCount(upcomingCount);
});

test('selecting Social Dancing filter hides non-matching cards', async ({ page }) => {
  await page.goto('/browse/');
  await expandFilters(page);
  await page.getByRole('checkbox', { name: /social dancing/i }).check();

  const socialCards = page.locator('.event-card[data-event-type="social-dancing"]:not([hidden])');
  const otherCards = page.locator('.event-card:not([data-event-type="social-dancing"]):not([hidden])');
  await expect(socialCards).toHaveCount(socialDancingUpcoming);
  await expect(otherCards).toHaveCount(0);
});

test('selecting Beginner-friendly signal filter hides non-matching cards', async ({ page }) => {
  await page.goto('/browse/');
  await expandFilters(page);
  await page.getByRole('checkbox', { name: /beginner-friendly/i }).check();

  const visibleCards = page.locator('.event-card:not([hidden])');
  await expect(visibleCards).toHaveCount(beginnerFriendlyUpcoming);
});

test('applying type=workshop AND signal=skill-level-target shows only matching cards', async ({ page }) => {
  await page.goto('/browse/');
  await expandFilters(page);
  await page.getByRole('checkbox', { name: /workshop/i }).check();
  await page.getByRole('checkbox', { name: /skill level target/i }).check();

  const visibleCards = page.locator('.event-card:not([hidden])');
  await expect(visibleCards).toHaveCount(workshopSkillTargetUpcoming);
});

test('deselecting all filters restores all upcoming event cards', async ({ page }) => {
  await page.goto('/browse/');
  await expandFilters(page);

  const typeCheckbox = page.getByRole('checkbox', { name: /social dancing/i });
  await typeCheckbox.check();
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(socialDancingUpcoming);

  await typeCheckbox.uncheck();
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(upcomingCount);
});

test('after clicking type filter URL contains type=social-dancing', async ({ page }) => {
  await page.goto('/browse/');
  await expandFilters(page);
  await page.getByRole('checkbox', { name: /social dancing/i }).check();

  const url = new URL(page.url());
  expect(url.searchParams.get('type')).toBe('social-dancing');
});

test('after clicking signal filter URL contains signal=beginner-friendly', async ({ page }) => {
  await page.goto('/browse/');
  await expandFilters(page);
  await page.getByRole('checkbox', { name: /beginner-friendly/i }).check();

  const url = new URL(page.url());
  expect(url.searchParams.get('signal')).toBe('beginner-friendly');
});

test('loading /browse/?type=social-dancing pre-applies Social Dancing filter', async ({ page }) => {
  await page.goto('/browse/?type=social-dancing');

  const visibleCards = page.locator('.event-card:not([hidden])');
  await expect(visibleCards).toHaveCount(socialDancingUpcoming);
});

test('loading /browse/?type=social-dancing,workshop shows Social Dancing and Workshop cards', async ({ page }) => {
  await page.goto('/browse/?type=social-dancing,workshop');

  const expectedCount = mockEvents.filter(
    e => !e.isPast && (e.eventType === 'Social Dancing' || e.eventType === 'Workshop')
  ).length;
  const visibleCards = page.locator('.event-card:not([hidden])');
  await expect(visibleCards).toHaveCount(expectedCount);

  const otherCards = page.locator(
    '.event-card:not([data-event-type="social-dancing"]):not([data-event-type="workshop"]):not([hidden])'
  );
  await expect(otherCards).toHaveCount(0);
});

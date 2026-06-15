import { test, expect } from '@playwright/test';

async function expandFilters(page) {
  await page.locator('.filter-bar__toggle').click();
}

test('browse page renders without 404', async ({ page }) => {
  const response = await page.goto('/browse/');
  expect(response.status()).toBe(200);
});

test('all upcoming events visible by default', async ({ page }) => {
  await page.goto('/browse/');
  const totalCount = await page.locator('.event-card').count();
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(totalCount);
});

test('selecting Social Dancing filter hides non-matching cards', async ({ page }) => {
  await page.goto('/browse/');
  const socialCount = await page.locator('.event-card[data-event-type="social-dancing"]').count();
  await expandFilters(page);
  await page.getByRole('checkbox', { name: /social dancing/i }).check();
  await expect(page.locator('.event-card[data-event-type="social-dancing"]:not([hidden])')).toHaveCount(socialCount);
  await expect(page.locator('.event-card:not([data-event-type="social-dancing"]):not([hidden])')).toHaveCount(0);
});

test('selecting Beginner-friendly signal filter hides non-matching cards', async ({ page }) => {
  await page.goto('/browse/');
  const bfCount = await page.locator('.event-card[data-fit-signals~="beginner-friendly"]').count();
  await expandFilters(page);
  await page.getByRole('checkbox', { name: /beginner-friendly/i }).check();
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(bfCount);
});

test('applying type=workshop AND signal=skill-level-target shows only matching cards', async ({ page }) => {
  await page.goto('/browse/');
  const matchCount = await page.locator(
    '.event-card[data-event-type="workshop"][data-fit-signals~="skill-level-target"]'
  ).count();
  await expandFilters(page);
  await page.getByRole('checkbox', { name: /workshop/i }).check();
  await page.getByRole('checkbox', { name: /skill level target/i }).check();
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(matchCount);
});

test('deselecting all filters restores all upcoming event cards', async ({ page }) => {
  await page.goto('/browse/');
  const totalCount = await page.locator('.event-card').count();
  const socialCount = await page.locator('.event-card[data-event-type="social-dancing"]').count();
  await expandFilters(page);
  const typeCheckbox = page.getByRole('checkbox', { name: /social dancing/i });
  await typeCheckbox.check();
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(socialCount);
  await typeCheckbox.uncheck();
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(totalCount);
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
  await page.goto('/browse/');
  const socialCount = await page.locator('.event-card[data-event-type="social-dancing"]').count();
  await page.goto('/browse/?type=social-dancing');
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(socialCount);
});

test('loading /browse/?type=social-dancing,workshop shows Social Dancing and Workshop cards', async ({ page }) => {
  await page.goto('/browse/');
  const expectedCount = await page.locator(
    '.event-card[data-event-type="social-dancing"], .event-card[data-event-type="workshop"]'
  ).count();
  await page.goto('/browse/?type=social-dancing,workshop');
  await expect(page.locator('.event-card:not([hidden])')).toHaveCount(expectedCount);
  await expect(
    page.locator('.event-card:not([data-event-type="social-dancing"]):not([data-event-type="workshop"]):not([hidden])')
  ).toHaveCount(0);
});

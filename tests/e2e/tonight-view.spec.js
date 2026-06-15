import { test, expect } from '@playwright/test';

test('home page loads HTTP 200', async ({ page }) => {
  const response = await page.goto('/');
  expect(response.status()).toBe(200);
});

test('h1 text is exactly "West Coast Swing in Tulsa"', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('West Coast Swing in Tulsa');
});

test('at least one .event-card element is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.event-card').first()).toBeVisible();
});

test('today events are ordered by start time ascending', async ({ page }) => {
  await page.goto('/');
  const metas = page.locator('.event-card__meta');
  if (await metas.count() < 2) return; // only 0–1 events visible — ordering can't be verified
  const first = await metas.nth(0).textContent();
  const second = await metas.nth(1).textContent();
  const toMinutes = text => {
    const [timePart, period] = text.trim().split(' · ')[0].trim().split(' ');
    const [h, m] = timePart.split(':').map(Number);
    return (h % 12 + (period.toUpperCase() === 'PM' ? 12 : 0)) * 60 + m;
  };
  expect(toMinutes(first)).toBeLessThanOrEqual(toMinutes(second));
});

test('each .event-card shows event name via .event-card__title', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.event-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i).locator('.event-card__title')).toBeVisible();
  }
});

test('each .event-card shows formatted time in .event-card__meta', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.event-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const meta = await cards.nth(i).locator('.event-card__meta').textContent();
    expect(meta).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i);
  }
});

test('each .event-card shows venue name in .event-card__meta', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.event-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const meta = await cards.nth(i).locator('.event-card__meta').textContent();
    const parts = meta.trim().split(' · ');
    expect(parts.length).toBeGreaterThanOrEqual(3);
    expect(parts[1].trim().length).toBeGreaterThan(0);
  }
});

test('each .event-card shows cost in .event-card__meta', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.event-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const meta = await cards.nth(i).locator('.event-card__meta').textContent();
    expect(meta).toMatch(/\$\d+|free/i);
  }
});

test('each .event-card shows an .event-type-badge element', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.event-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i).locator('.event-type-badge')).toBeVisible();
  }
});

test('a recurring event card shows .recurring-badge', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.event-card .recurring-badge').first()).toBeVisible();
});

test('.wcs-intro paragraph is present on the page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.wcs-intro')).toBeVisible();
});

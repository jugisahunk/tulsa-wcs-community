import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 667 });
});

test('home page renders without horizontal overflow at 320px', async ({ page }) => {
  await page.goto('/');
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(320);
});

test('event cards are visible at 320px', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.event-card').first()).toBeVisible();
});

test('no event card content is clipped at 320px', async ({ page }) => {
  await page.goto('/');
  const container = await page.locator('main.site-main').boundingBox();
  const cards = page.locator('.event-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const box = await cards.nth(i).boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeLessThanOrEqual(container.width);
  }
});

import { test, expect } from '@playwright/test';

test('home page loads with HTTP 200', async ({ page }) => {
  const response = await page.goto('/');
  expect(response.status()).toBe(200);
});

test('h1 text is "West Coast Swing in Tulsa"', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('West Coast Swing in Tulsa');
});

test('no console errors on load', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto('/');
  expect(errors).toHaveLength(0);
});

test('tab bar nav is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
});

test('tab bar has exactly 3 links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tab-bar__tab')).toHaveCount(3);
});

test('tonight tab is aria-current="page" on home page', async ({ page }) => {
  await page.goto('/');
  const tonightTab = page.locator('.tab-bar__tab', { hasText: 'tonight' });
  await expect(tonightTab).toHaveAttribute('aria-current', 'page');
});

test('browse and archive tab links are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tab-bar__tab[href="/browse/"]')).toBeVisible();
  await expect(page.locator('.tab-bar__tab[href="/archive/"]')).toBeVisible();
});

test('each tab link meets 44px minimum tap target', async ({ page }) => {
  await page.goto('/');
  const tabs = page.locator('.tab-bar__tab');
  const count = await tabs.count();
  for (let i = 0; i < count; i++) {
    const box = await tabs.nth(i).boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

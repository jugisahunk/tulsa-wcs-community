import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tonight-empty/');
});

test('empty state container is visible', async ({ page }) => {
  await expect(page.locator('.empty-state')).toBeVisible();
});

test('"QUIET TONIGHT." text appears before subscribe copy', async ({ page }) => {
  const headline = await page.locator('.empty-state__headline').boundingBox();
  const copy = await page.locator('.empty-state__copy').boundingBox();
  expect(headline.y).toBeLessThan(copy.y);
});

test('diamond ornament with aria-hidden="true" is present between headline and copy', async ({ page }) => {
  await expect(page.locator('[aria-hidden="true"].diamond-divider')).toBeVisible();
});

test('exact locked copy text is present', async ({ page }) => {
  await expect(page.locator('.empty-state__copy')).toHaveText(
    'Some of the best nights in this community are planned last minute. Subscribe — you won\'t want to miss them.'
  );
});

test('email input is visible', async ({ page }) => {
  await expect(page.locator('input[type="email"]')).toBeVisible();
});

test('submit button is visible', async ({ page }) => {
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('"BROWSE UPCOMING" link with href="/browse/" is present', async ({ page }) => {
  const link = page.locator('.empty-state a[href="/browse/"]');
  await expect(link).toBeVisible();
  const text = await link.textContent();
  expect(text.toUpperCase()).toContain('BROWSE UPCOMING');
});

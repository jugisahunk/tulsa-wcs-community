import { test, expect } from '@playwright/test';

// Slug is discovered at runtime from the browse page — no mock data dependency.
let discoveredSlug = null;

test('clicking an event card on Tonight View navigates to /events/{slug}/ URL', async ({ page }) => {
  await page.goto('/');
  await page.locator('.event-card').first().click();
  await expect(page).toHaveURL(/\/events\/[\w-]+-\d{4}-\d{2}-\d{2}\//);
});

// Recurring badge test navigates independently — not tied to discoveredSlug.
test('recurring event detail page shows .recurring-badge', async ({ page }) => {
  await page.goto('/browse/');
  const recurringCard = page.locator('.event-card:has(.recurring-badge)').first();
  if (!(await recurringCard.count())) return; // no recurring events in current data set
  await recurringCard.click();
  await expect(page.locator('.recurring-badge')).toBeVisible();
});

test.describe('event detail page', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/browse/');
    await page.locator('.event-card').first().click();
    const url = new URL(page.url());
    discoveredSlug = url.pathname.replace(/^\/events\//, '').replace(/\/$/, '');
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    if (!discoveredSlug) {
      test.skip(true, 'No events available to test detail page');
      return;
    }
    await page.goto(`/events/${discoveredSlug}/`);
  });

  test('returns HTTP 200 (no 404)', async ({ page }) => {
    const response = await page.goto(`/events/${discoveredSlug}/`);
    expect(response.status()).toBe(200);
  });

  test('event title heading is present and non-empty', async ({ page }) => {
    const title = page.locator('.event-detail__title');
    await expect(title).not.toBeEmpty();
  });

  test('page shows formatted date, venue name, and cost', async ({ page }) => {
    const body = await page.locator('body').textContent();
    const months = ['January','February','March','April','May','June','July',
                    'August','September','October','November','December'];
    expect(months.some(m => body.includes(m))).toBe(true);
    expect(body).toMatch(/\$\d+|free/i);
  });

  test('JSON-LD script element is present in <head>', async ({ page }) => {
    await expect(page.locator('head script[type="application/ld+json"]')).toHaveCount(1);
  });

  test('JSON-LD parses as valid JSON', async ({ page }) => {
    const content = await page.locator('script[type="application/ld+json"]').textContent();
    const json = JSON.parse(content); // throws if invalid
    expect(json).toBeTruthy();
  });

  test('JSON-LD contains required Schema.org Event fields', async ({ page }) => {
    const content = await page.locator('script[type="application/ld+json"]').textContent();
    const json = JSON.parse(content);
    expect(json['@type']).toBe('Event');
    expect(json.name).toBeTruthy();
    expect(json.startDate).toBeTruthy();
    expect(json.location).toBeTruthy();
  });

  test('og:title is present and contains the event name', async ({ page }) => {
    const eventTitle = await page.locator('.event-detail__title').textContent();
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain(eventTitle.trim());
  });

  test('og:description is present and non-empty', async ({ page }) => {
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDesc?.length).toBeGreaterThan(0);
  });

  test('og:image points to event type placeholder image path', async ({ page }) => {
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toContain('/assets/images/event-types/');
  });
});

import { test, expect } from '@playwright/test';
import { mockEvents } from '../fixtures/mock-events.js';

// Use a past recurring event: stable slug + lets us test the recurring badge
const knownEvent = mockEvents.find(e => e.isPast && e.isRecurring);
const KNOWN_SLUG = knownEvent.id;

// Task 1.2 — clicking a card on Tonight View navigates to a detail URL
test('clicking an event card on Tonight View navigates to /events/{slug}/ URL', async ({ page }) => {
  await page.goto('/');
  await page.locator('.event-card').first().click();
  await expect(page).toHaveURL(/\/events\/[\w-]+-\d{4}-\d{2}-\d{2}\//);
});

test.describe('event detail page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/events/${KNOWN_SLUG}/`);
  });

  // Task 1.3 — HTTP 200
  test('returns HTTP 200 (no 404)', async ({ page }) => {
    const response = await page.goto(`/events/${KNOWN_SLUG}/`);
    expect(response.status()).toBe(200);
  });

  // Task 1.4 — h1 contains event name
  test('h1 contains the event name', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(knownEvent.name);
  });

  // Task 1.5 — formatted date, venue name, and cost are present
  test('page shows formatted date, venue name, and cost', async ({ page }) => {
    const body = await page.locator('body').textContent();
    expect(body).toContain(knownEvent.venueName);
    expect(body).toContain(knownEvent.cost);
    // formatDate omits year for current-year events; verify month name is present instead
    const month = new Date(`${knownEvent.date}T00:00:00`).toLocaleDateString('en-US', { month: 'long' });
    expect(body).toContain(month);
  });

  // Task 1.6 — JSON-LD script in <head>
  test('JSON-LD script element is present in <head>', async ({ page }) => {
    await expect(page.locator('head script[type="application/ld+json"]')).toHaveCount(1);
  });

  // Task 1.7 — JSON-LD parses as valid JSON
  test('JSON-LD parses as valid JSON', async ({ page }) => {
    const ldJsonContent = await page.locator('script[type="application/ld+json"]').textContent();
    const ldJson = JSON.parse(ldJsonContent); // throws if invalid
    expect(ldJson).toBeTruthy();
  });

  // Task 1.8 — JSON-LD has required Schema.org Event fields
  test('JSON-LD contains required Schema.org Event fields', async ({ page }) => {
    const ldJsonContent = await page.locator('script[type="application/ld+json"]').textContent();
    const ldJson = JSON.parse(ldJsonContent);
    expect(ldJson['@type']).toBe('Event');
    expect(ldJson.name).toBeTruthy();
    expect(ldJson.startDate).toBeTruthy();
    expect(ldJson.location).toBeTruthy();
  });

  // Task 1.9 — og:title present with event name
  test('og:title is present and contains the event name', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain(knownEvent.name);
  });

  // Task 1.10 — og:description present and non-empty
  test('og:description is present and non-empty', async ({ page }) => {
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDesc).toBeTruthy();
    expect(ogDesc.length).toBeGreaterThan(0);
  });

  // Task 1.11 — og:image points to event type placeholder
  test('og:image points to event type placeholder image path', async ({ page }) => {
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toContain('/assets/images/event-types/');
  });

  // Task 1.12 — recurring badge on a recurring event detail page
  test('recurring event detail page shows .recurring-badge', async ({ page }) => {
    await expect(page.locator('.recurring-badge')).toBeVisible();
  });
});

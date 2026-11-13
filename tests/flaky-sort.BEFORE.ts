// BEFORE version: reads prices straight after the sort, with no wait.
// The route delay slows only the sort request, so the race shows up every time.
// To use it: copy this over tests/flaky-sort.spec.ts temporarily, run with --trace on,
// and screenshot the trace of the failing run.
import { test, expect } from '@playwright/test';

test('sort by price low to high (flaky: no wait)', async ({ page }) => {
  await page.route(
    (url) => url.href.includes('/products') && url.href.includes('sort='),
    async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    }
  );

  await page.goto('/');
  await expect(page.locator('[data-test="product-name"]').first()).toBeVisible();

  await page.locator('[data-test="sort"]').selectOption({ label: 'Price (Low - High)' });

  // Reads immediately: the list has not updated yet
  const texts = await page.locator('[data-test="product-price"]').allTextContents();
  const prices = texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));

  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});
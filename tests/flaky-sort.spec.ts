import { test, expect } from '@playwright/test';

test('sort by price low to high (waits for the list)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-test="product-name"]').first()).toBeVisible();

  await page.locator('[data-test="sort"]').selectOption({ label: 'Price (Low - High)' });

  const readPrices = async () => {
    const texts = await page.locator('[data-test="product-price"]').allTextContents();
    return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
  };
  const isAscending = (p: number[]) => p.every((v, i) => i === 0 || p[i - 1] <= v);

  // Retries until the list reflects the new order, instead of reading once.
  // length > 0 stops an empty list from counting as "sorted".
  await expect
    .poll(async () => {
      const prices = await readPrices();
      return prices.length > 0 && isAscending(prices);
    })
    .toBe(true);
});
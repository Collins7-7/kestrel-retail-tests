import { test, expect } from '@playwright/test';
import { ProductListPage } from '../pages/ProductListPage';

const isSorted = <T>(arr: T[], cmp: (a: T, b: T) => number) =>
  arr.every((v, i) => i === 0 || cmp(arr[i - 1], v) <= 0);

test.describe('Product list sorting (KR-002)', () => {
  let list: ProductListPage;

  test.beforeEach(async ({ page }) => {
    list = new ProductListPage(page);
    await list.goto();
    await list.setMaxPriceToFullRange();
    // The slider must cover the full range, or products over $100 are left out
    await expect(list.priceMaxHandle).toHaveAttribute('aria-valuenow', '200');
  });

  test('name A to Z', async () => {
    await list.sortBy('Name (A - Z)');
    await expect.poll(async () => {
      const names = await list.getAllNames();
      return names.length > 0 && isSorted(names, (a, b) => a.localeCompare(b));
    }, { timeout: 30_000 }).toBe(true);
  });

  test('name Z to A', async () => {
    await list.sortBy('Name (Z - A)');
    await expect.poll(async () => {
      const names = await list.getAllNames();
      return names.length > 0 && isSorted(names, (a, b) => b.localeCompare(a));
    }, { timeout: 30_000 }).toBe(true);
  });

  test('price low to high', async () => {
    await list.sortBy('Price (Low - High)');
    await expect.poll(async () => {
      const prices = await list.getAllPrices();
      return prices.length > 0 && isSorted(prices, (a, b) => a - b);
    }, { timeout: 30_000 }).toBe(true);
  });

  test('price high to low', async () => {
    await list.sortBy('Price (High - Low)');
    await expect.poll(async () => {
      const prices = await list.getAllPrices();
      return prices.length > 0 && isSorted(prices, (a, b) => b - a);
    }, { timeout: 30_000 }).toBe(true);
  });
});
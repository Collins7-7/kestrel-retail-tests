import { test, expect } from '@playwright/test';
import { ProductListPage } from '../pages/ProductListPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart (KR-003)', () => {
  test('adding an in-stock product shows confirmation and badge 1', async ({ page }) => {
    const list = new ProductListPage(page);
    const cart = new CartPage(page);
    await list.goto();
    await list.openFirstInStockProduct();
    await cart.addToCart();

    await expect(cart.confirmation).toBeVisible();
    await expect(cart.badge).toHaveText('1');
  });

  test('cart shows the correct price for the product', async ({ page }) => {
    const list = new ProductListPage(page);
    const cart = new CartPage(page);
    await list.goto();
    await list.openFirstInStockProduct();
    const expectedPrice = await cart.getProductPageUnitPrice();
    await cart.addToCart();
    await cart.open();

    expect(await cart.getCartRowPrice()).toBe(expectedPrice);
  });

  test('out-of-stock product is labelled and cannot be added', async ({ page }) => {
    const list = new ProductListPage(page);
    const cart = new CartPage(page);
    await list.goto();

    await expect(list.outOfStockLabels.first()).toHaveText('Out of stock');
    await list.openFirstOutOfStockProduct();

    // Adjust after inspecting the page: the button may be disabled or not rendered
    await expect(cart.addToCartButton).toBeDisabled();
  });
});
import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly confirmation: Locator;
  readonly badge: Locator;
  readonly navCart: Locator;
  readonly productUnitPrice: Locator; // price on the product detail page
  readonly cartRowPrices: Locator;    // prices on the cart page
  readonly cartRowNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.confirmation = page.getByText('Product added to shopping cart.');
    this.badge = page.locator('[data-test="cart-quantity"]');
    this.navCart = page.locator('[data-test="nav-cart"]');
    this.productUnitPrice = page.locator('[data-test="unit-price"]');
    this.cartRowPrices = page.locator('[data-test="product-price"]');
    this.cartRowNames = page.locator('[data-test="product-title"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async open() {
    await this.navCart.click();
    await this.cartRowNames.first().waitFor();
  }

  async getProductPageUnitPrice(): Promise<number> {
    const text = (await this.productUnitPrice.textContent()) ?? '';
    return Number(text.replace(/[^0-9.]/g, ''));
  }

  async getCartRowPrice(index = 0): Promise<number> {
    const text = (await this.cartRowPrices.nth(index).textContent()) ?? '';
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}
import { Page, Locator } from '@playwright/test';

export class ProductListPage {
  readonly page: Page;
  readonly sortMenu: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly pagination: Locator;
  readonly nextPageButton: Locator;
  readonly outOfStockLabels: Locator;
  readonly priceMaxHandle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortMenu = page.getByTestId('sort');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
    this.pagination = page.locator('ul.pagination');
    // last <li> is the "next" item; the page links are <button>s
    this.nextPageButton = this.pagination.locator('li').last().locator('button');
    this.outOfStockLabels = page.getByTestId('out-of-stock');
    // the slider has two handles: min first, max last
    this.priceMaxHandle = page.getByRole('slider').last();
  }

  async goto() {
    await this.page.goto('/');
    await this.productNames.first().waitFor();
  }

  async setMaxPriceToFullRange() {
    await this.priceMaxHandle.focus();
    await this.priceMaxHandle.press('End');
  }

  // e.g. 'Name (A - Z)', 'Price (High - Low)'
  async sortBy(option: string) {
    await this.sortMenu.selectOption({ label: option });
  }

  private async firstName() {
    return ((await this.productNames.first().textContent()) ?? '').trim();
  }

  private async hasNextPage() {
    const li = this.pagination.locator('li').last();
    const cls = (await li.getAttribute('class')) ?? '';
    return !cls.includes('disabled');
  }

  private async waitForFirstNameToChangeFrom(previous: string) {
    await this.page.waitForFunction((prev) => {
      const el = document.querySelector('[data-test="product-name"]');
      return !!el && (el.textContent ?? '').trim() !== prev;
    }, previous);
  }

  private async goToNextPage() {
    const before = await this.firstName();
    await this.nextPageButton.click();
    await this.waitForFirstNameToChangeFrom(before);
  }

  private async goToFirstPage() {
    const firstItem = this.pagination.locator('li').nth(1); // after "previous"
    const cls = (await firstItem.getAttribute('class')) ?? '';
    if (cls.includes('active')) return;
    const before = await this.firstName();
    await firstItem.locator('button').click();
    await this.waitForFirstNameToChangeFrom(before);
  }

  private async collect(locator: Locator): Promise<string[]> {
    await this.goToFirstPage();
    const all: string[] = [];
    while (true) {
      all.push(...(await locator.allTextContents()).map((t) => t.trim()));
      if (!(await this.hasNextPage())) break;
      await this.goToNextPage();
    }
    return all;
  }

  async getAllNames(): Promise<string[]> {
    return this.collect(this.productNames);
  }

  async getAllPrices(): Promise<number[]> {
    const texts = await this.collect(this.productPrices);
    return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
  }

  async openFirstInStockProduct() {
    await this.page
      .locator('a.card')
      .filter({ hasNot: this.outOfStockLabels })
      .first()
      .click();
  }

  async openFirstOutOfStockProduct() {
    await this.page.locator('a.card').filter({ has: this.outOfStockLabels }).first().click();
  }
}
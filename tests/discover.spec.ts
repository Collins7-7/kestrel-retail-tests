import { test, expect } from '@playwright/test';

test('discover product can be added to cart', async ({ page }) => {
  page.on('response', async (r) => {
    const req = r.request();
    if (r.url().includes('api.practicesoftwaretesting.com') && (req.method() !== 'GET' || !r.ok())) {
      console.log(
        'API', req.method(), r.status(), r.url(),
        req.postData() ?? '',
        (await r.text().catch(() => '')).slice(0, 300),
      );
    }
  });

  await page.goto('/');

  const productCard = page.getByTestId('product-name').filter({ hasText: /\S/ }).first();
  await expect(productCard).toBeVisible();

  await page.getByRole('heading', { name: 'Combination Pliers', exact: true }).click();
  await expect(page).toHaveURL(/\/product\/[A-Za-z0-9]+$/);

  await page.getByTestId('add-to-cart').click();

  const alert = page.getByRole('alert').first();
  await expect(alert).toContainText('Product added to shopping cart.');
  await expect(page.locator('nav')).toContainText('Home');
});
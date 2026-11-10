import { test, expect } from '@playwright/test';
import { customer, customer2 } from '../test-data/users';
import { LoginPage } from '../pages/LoginPage';

const wrongPassword = 'not-the-password';
const API = 'https://api.practicesoftwaretesting.com';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('customer can log in', async ({ page }) => {
    await loginPage.login(customer.email, customer.password);
    await expect(page.getByRole('heading', { name: 'My account' })).toBeVisible();
  });

  test('wrong password shows an error', async ({ page, request }) => {
    // customer2 takes the failed login so the main customer account never gets locked
    try {
      await loginPage.login(customer2.email, wrongPassword);
      await expect(loginPage.invalidCredentialsError).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    } finally {
      // A successful login should reset the failed-attempt count (VERIFY)
      await request.post(`${API}/users/login`, {
        data: { email: customer2.email, password: customer2.password },
      });
    }
  });

  test('empty email shows a validation message', async () => {
    await loginPage.login('', customer.password);
    await expect(loginPage.emailRequiredError).toBeVisible();
    await expect(loginPage.emailInput).toHaveAttribute('aria-invalid', 'true');
  });
});
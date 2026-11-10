import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly invalidCredentialsError: Locator;
  readonly emailRequiredError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email address');
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.invalidCredentialsError = page.getByText('Invalid email or password', { exact: true });
    this.emailRequiredError = page.getByText('Email is required', { exact: true });
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  // 'https://practicesoftwaretesting.com/auth/login'

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
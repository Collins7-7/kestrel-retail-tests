import { test, expect } from '@playwright/test';
import { customer, customer2 } from '../test-data/users';

const API = 'https://api.practicesoftwaretesting.com';

test.describe('API', () => {
  test('valid customer login returns a token response', async ({ request }) => {
    const response = await request.post(`${API}/users/login`, {
      data: { email: customer.email, password: customer.password },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.access_token).toBe('string');
    expect(body.access_token.length).toBeGreaterThan(0);
    expect(body.token_type.toLowerCase()).toBe('bearer');
    expect(typeof body.expires_in).toBe('number');
  });

  test('wrong password is rejected and returns no token', async ({ request }) => {
    try {
      const response = await request.post(`${API}/users/login`, {
        data: { email: customer2.email, password: 'not-the-password' },
      });
      expect(response.status()).toBe(401); // VERIFY with Swagger "Try it out" on customer2
      const body = await response.json();
      expect(body).not.toHaveProperty('access_token');
    } finally {
      await request.post(`${API}/users/login`, {
        data: { email: customer2.email, password: customer2.password },
      });
    }
  });

  test('products endpoint returns a paginated list', async ({ request }) => {
    const response = await request.get(`${API}/products`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(typeof body.data[0].name).toBe('string');
    expect(typeof body.data[0].price).toBe('number');
    expect(typeof body.current_page).toBe('number');
    expect(typeof body.total).toBe('number');
  });
});
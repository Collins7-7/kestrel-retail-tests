export interface TestUser {
  email: string;
  password: string;
}

export const customer: TestUser = {
  email: 'customer@practicesoftwaretesting.com',
  password: 'welcome01',
};

export const customer2: TestUser = {
  email: 'customer2@practicesoftwaretesting.com',
  password: 'welcome01', // VERIFY: this account's password may differ
};
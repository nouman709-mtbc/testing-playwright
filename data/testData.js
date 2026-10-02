// Demo credentials are published on the SauceDemo login page.
// They can be overridden with environment variables if needed.
module.exports = {
  user: {
    username: process.env.SAUCE_USERNAME || 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  product: {
    name: 'Sauce Labs Backpack',
    // Expected catalogue price. If SauceDemo changes it, update here only.
    price: '$29.99',
  },
  checkoutInfo: {
    firstName: 'Test',
    lastName: 'User',
    postalCode: '12345',
  },
};

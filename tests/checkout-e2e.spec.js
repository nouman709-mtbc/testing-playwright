const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { user, product, checkoutInfo } = require('../data/testData');

test.describe('Checkout end-to-end (standard_user)', () => {
  // Each test gets a fresh browser context, so cart state never leaks between tests.
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(user);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('user can buy a Sauce Labs Backpack and see the order confirmed', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await test.step('Inventory page loads and shows the product at the expected price', async () => {
      await expect(inventory.title).toHaveText('Products');
      await expect(inventory.card(product.name)).toBeVisible();
      await expect(inventory.card(product.name).getByTestId('inventory-item-price'))
        .toHaveText(product.price);
    });

    await test.step('Add the product to the cart', async () => {
      await inventory.addToCart(product.name);
      await expect(inventory.removeButton(product.name)).toBeVisible();
      await expect(inventory.cartBadge).toHaveText('1');
    });

    await test.step('Cart shows exactly the selected product with the same price', async () => {
      await inventory.openCart();
      await expect(page).toHaveURL(/cart\.html/);
      await expect(cart.title).toHaveText('Your Cart');
      await expect(cart.items).toHaveCount(1);
      await expect(cart.itemName()).toHaveText(product.name);
      await expect(cart.itemPrice()).toHaveText(product.price);
      await expect(cart.itemQuantity()).toHaveText('1');
    });

    await test.step('Enter checkout information', async () => {
      await cart.checkout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
      await expect(checkout.title).toHaveText('Checkout: Your Information');
      await checkout.fillInformation(checkoutInfo);
    });

    await test.step('Overview shows the correct product, price and consistent totals', async () => {
      await expect(page).toHaveURL(/checkout-step-two\.html/);
      await expect(checkout.title).toHaveText('Checkout: Overview');
      await expect(checkout.items).toHaveCount(1);
      await expect(checkout.itemName()).toHaveText(product.name);
      await expect(checkout.itemPrice()).toHaveText(product.price);

      const { subtotal, tax, total } = await checkout.amounts();
      // Tax rate is not hard-coded: the test checks the arithmetic instead.
      expect(subtotal).toBeCloseTo(CheckoutPage.toAmount(product.price), 2);
      expect(tax).toBeGreaterThanOrEqual(0);
      expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    await test.step('Finish the order and verify completion', async () => {
      await checkout.finish();
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkout.title).toHaveText('Checkout: Complete!');
      await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
      await expect(checkout.completeText).toContainText('Your order has been dispatched');
      await expect(checkout.backHomeButton).toBeVisible();
      // Cart should be emptied after a completed order.
      await expect(inventory.cartBadge).toHaveCount(0);
    });
  });
});

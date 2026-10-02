// Builds the data-test suffix used by SauceDemo buttons, e.g.
// "Sauce Labs Backpack" -> "sauce-labs-backpack"
const slug = (name) => name.toLowerCase().replace(/\s+/g, '-');

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  card(productName) {
    return this.page.getByTestId('inventory-item').filter({ hasText: productName });
  }

  addToCartButton(productName) {
    return this.page.getByTestId(`add-to-cart-${slug(productName)}`);
  }

  removeButton(productName) {
    return this.page.getByTestId(`remove-${slug(productName)}`);
  }

  async priceOf(productName) {
    return this.card(productName).getByTestId('inventory-item-price').innerText();
  }

  async addToCart(productName) {
    await this.addToCartButton(productName).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };

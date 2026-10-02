class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  itemName(index = 0) {
    return this.items.nth(index).getByTestId('inventory-item-name');
  }

  itemPrice(index = 0) {
    return this.items.nth(index).getByTestId('inventory-item-price');
  }

  itemQuantity(index = 0) {
    return this.items.nth(index).getByTestId('item-quantity');
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };

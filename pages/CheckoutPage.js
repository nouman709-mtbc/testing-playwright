// Covers the three checkout screens: information, overview, complete.
class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');

    // Step one: your information
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');

    // Step two: overview
    this.items = page.getByTestId('inventory-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');

    // Complete
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInformation({ firstName, lastName, postalCode }) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
    await this.continueButton.click();
  }

  itemName(index = 0) {
    return this.items.nth(index).getByTestId('inventory-item-name');
  }

  itemPrice(index = 0) {
    return this.items.nth(index).getByTestId('inventory-item-price');
  }

  // "Item total: $29.99" -> 29.99
  static toAmount(text) {
    return Number(text.replace(/[^0-9.]/g, ''));
  }

  async amounts() {
    const [subtotal, tax, total] = await Promise.all([
      this.subtotalLabel.innerText(),
      this.taxLabel.innerText(),
      this.totalLabel.innerText(),
    ]);
    return {
      subtotal: CheckoutPage.toAmount(subtotal),
      tax: CheckoutPage.toAmount(tax),
      total: CheckoutPage.toAmount(total),
    };
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };

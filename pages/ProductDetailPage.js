/** A single product page, /product_details/:id. */
export class ProductDetailPage {
  constructor(page) {
    this.page = page;

    const information = page.locator('.product-information');

    this.name = information.locator('h2');
    this.category = information.locator('p', { hasText: 'Category:' });
    this.price = information.locator('span span');
    this.availability = information.locator('p', { hasText: 'Availability:' });
    this.condition = information.locator('p', { hasText: 'Condition:' });
    this.brand = information.locator('p', { hasText: 'Brand:' });

    this.quantity = page.locator('#quantity');
    this.addToCartButton = information.locator('button.cart');
    this.viewCartLink = page.locator('#cartModal').getByRole('link', { name: 'View Cart' });
  }

  async goto(productId = 1) {
    await this.page.goto(`/product_details/${productId}`);
  }

  async addToCart(quantity) {
    if (quantity) {
      await this.quantity.fill(String(quantity));
    }
    await this.addToCartButton.click();
  }

  async viewCart() {
    await this.viewCartLink.click();
  }
}

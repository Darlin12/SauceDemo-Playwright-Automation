/** The /view_cart page. */
export class CartPage {
  constructor(page) {
    this.page = page;

    this.rows = page.locator('#cart_info_table tbody tr');
    this.emptyCartMessage = page.locator('#empty_cart');
  }

  async goto() {
    await this.page.goto('/view_cart');
  }

  /** A cart row, addressed by the product id the site puts on the <tr>. */
  row(productId) {
    return this.page.locator(`#product-${productId}`);
  }

  quantity(productId) {
    return this.row(productId).locator('.cart_quantity button');
  }

  async removeProduct(productId) {
    await this.row(productId).locator('.cart_quantity_delete').click();
  }
}

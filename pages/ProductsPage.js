/** The /products page: catalogue, search box and brand filters. */
export class ProductsPage {
  constructor(page) {
    this.page = page;

    this.title = page.getByRole('heading', { name: 'All Products' });
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedTitle = page.getByRole('heading', { name: 'Searched Products' });
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.productNames = page.locator('.features_items .productinfo p');
    this.categoryTitle = page.locator('.features_items .title');
    this.poloBrand = page.locator('a[href="/brand_products/Polo"]');

    this.cartModal = page.locator('#cartModal');
    this.continueShoppingButton = this.cartModal.getByRole('button', {
      name: 'Continue Shopping',
    });
    this.viewCartLink = this.cartModal.getByRole('link', { name: 'View Cart' });
  }

  async goto() {
    await this.page.goto('/products');
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /** Hovering reveals the overlay that carries the real add-to-cart button. */
  async addProductToCart(index) {
    const card = this.productCards.nth(index);
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await card.locator('.overlay-content .add-to-cart').click();
  }

  async openProductDetails(index) {
    await this.productCards.nth(index).locator('a[href^="/product_details/"]').first().click();
  }
}

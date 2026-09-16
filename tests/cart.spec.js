import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { CartPage } from '../pages/CartPage.js';
import { blockAds } from '../utils/blockAds.js';

test.describe('Shopping cart', () => {
  let productsPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
  });

  test('adds a product to the cart from the catalogue', async () => {
    await productsPage.goto();
    await productsPage.addProductToCart(0);
    await productsPage.viewCartLink.click();

    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.quantity('1')).toHaveText('1');
  });

  test('keeps both products when two are added', async () => {
    await productsPage.goto();
    await productsPage.addProductToCart(0);
    await productsPage.continueShoppingButton.click();
    await productsPage.addProductToCart(1);
    await productsPage.viewCartLink.click();

    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.row('1')).toBeVisible();
    await expect(cartPage.row('2')).toBeVisible();
  });

  test('respects the quantity chosen on the product detail page', async ({ page }) => {
    const productDetailPage = new ProductDetailPage(page);

    await productDetailPage.goto();
    await productDetailPage.addToCart(4);
    await productDetailPage.viewCart();

    await expect(cartPage.quantity('1')).toHaveText('4');
  });

  test('empties the cart when the last product is removed', async () => {
    await productsPage.goto();
    await productsPage.addProductToCart(0);
    await productsPage.viewCartLink.click();
    await expect(cartPage.rows).toHaveCount(1);

    await cartPage.removeProduct('1');

    await expect(cartPage.emptyCartMessage).toContainText('Cart is empty!');
  });
});

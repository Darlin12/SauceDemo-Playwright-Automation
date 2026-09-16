import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { blockAds } from '../utils/blockAds.js';

test.describe('Products', () => {
  let productsPage;

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  test('lists the product catalogue', async () => {
    await expect(productsPage.title).toBeVisible();
    expect(await productsPage.productCards.count()).toBeGreaterThan(0);
  });

  test('finds a product by name through the search box', async () => {
    await productsPage.search('Blue Top');

    await expect(productsPage.searchedTitle).toBeVisible();
    // The site matches the term against category and brand as well as the
    // product name, so the assertion is that the product searched for is
    // among the results, not that every result repeats the term.
    expect(await productsPage.productNames.allTextContents()).toContain('Blue Top');
  });

  test('returns no results for a term that does not exist', async () => {
    await productsPage.search('zzzznotaproduct');

    await expect(productsPage.searchedTitle).toBeVisible();
    await expect(productsPage.productCards).toHaveCount(0);
  });

  test('opens a product detail page with its full information', async ({ page }) => {
    const productDetailPage = new ProductDetailPage(page);

    await productsPage.openProductDetails(0);

    await expect(page).toHaveURL(/\/product_details\/\d+$/);
    await expect(productDetailPage.name).toBeVisible();
    await expect(productDetailPage.category).toContainText('Category:');
    await expect(productDetailPage.availability).toContainText('Availability:');
    await expect(productDetailPage.condition).toContainText('Condition:');
    await expect(productDetailPage.brand).toContainText('Brand:');
    await expect(productDetailPage.price).toContainText('Rs.');
  });

  test('filters the catalogue by brand', async ({ page }) => {
    await productsPage.poloBrand.click();

    await expect(page).toHaveURL(/\/brand_products\/Polo$/);
    await expect(productsPage.categoryTitle).toContainText('Polo');
    expect(await productsPage.productCards.count()).toBeGreaterThan(0);
  });
});

import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { ContactPage } from '../pages/ContactPage.js';
import { HomePage } from '../pages/HomePage.js';
import { blockAds } from '../utils/blockAds.js';
import { buildUser } from '../utils/userFactory.js';

const attachment = fileURLToPath(new URL('../fixtures/upload-sample.txt', import.meta.url));

test.describe('Contact and subscription', () => {
  test.beforeEach(async ({ page }) => {
    await blockAds(page);
  });

  test('submits the contact form with an attachment', async ({ page }) => {
    const contactPage = new ContactPage(page);
    const user = buildUser();

    await contactPage.goto();
    await expect(contactPage.title).toBeVisible();

    await contactPage.fillForm({
      name: user.name,
      email: user.email,
      subject: 'Automated contact form check',
      message: 'Message sent by the Playwright end-to-end suite.',
    });
    await contactPage.fileInput.setInputFiles(attachment);
    await contactPage.submit();

    await expect(contactPage.successMessage).toContainText(
      'Success! Your details have been submitted successfully.',
    );
  });

  test('blocks submission when the contact form is empty', async ({ page }) => {
    const contactPage = new ContactPage(page);

    await contactPage.goto();
    await contactPage.submitButton.click();

    // Only the email field carries a `required` attribute on this form, so it
    // is the one that HTML5 validation stops the submission on.
    await expect(contactPage.email).toHaveJSProperty('validity.valid', false);
    await expect(contactPage.successMessage).toBeHidden();
  });

  test('subscribes an email address from the footer', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await expect(homePage.subscriptionTitle).toBeVisible();

    await homePage.subscribe(buildUser().email);

    await expect(homePage.subscriptionSuccess).toContainText(
      'You have been successfully subscribed!',
    );
  });
});

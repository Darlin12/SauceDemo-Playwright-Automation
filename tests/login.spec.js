import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';
import { blockAds } from '../utils/blockAds.js';
import { buildUser } from '../utils/userFactory.js';
import { createAccount, deleteAccount } from '../utils/api.js';

test.describe('Login', () => {
  let loginPage;
  let homePage;
  let user;

  test.beforeEach(async ({ page, request }) => {
    await blockAds(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    // The account is created over the API so the tests never depend on data
    // left behind by a previous run.
    user = await createAccount(request, buildUser());
    await loginPage.goto();
  });

  test.afterEach(async ({ request }) => {
    await deleteAccount(request, user);
  });

  test('signs in a registered user with valid credentials', async () => {
    await loginPage.login(user.email, user.password);

    await expect(homePage.loggedInAs).toContainText(user.name);
    await expect(homePage.logoutLink).toBeVisible();
  });

  test('rejects an email that is not registered', async ({ page }) => {
    await loginPage.login('not.registered.user@example.com', 'Passw0rd!123');

    await expect(loginPage.loginError).toHaveText('Your email or password is incorrect!');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('rejects a registered email with the wrong password', async () => {
    await loginPage.login(user.email, 'WrongPassword!456');

    await expect(loginPage.loginError).toHaveText('Your email or password is incorrect!');
  });

  test('blocks submission when the login form is empty', async ({ page }) => {
    await loginPage.loginButton.click();

    // The fields are guarded by HTML5 validation, so the browser refuses to
    // submit and the user never leaves the login page.
    await expect(loginPage.loginEmail).toHaveJSProperty('validity.valid', false);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('ends the session when the user logs out', async ({ page }) => {
    await loginPage.login(user.email, user.password);
    await expect(homePage.logoutLink).toBeVisible();

    await homePage.logout();

    await expect(page).toHaveURL(/\/login$/);
    await expect(homePage.signupLoginLink).toBeVisible();
  });
});

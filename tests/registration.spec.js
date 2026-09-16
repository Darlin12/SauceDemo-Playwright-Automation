import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SignupPage } from '../pages/SignupPage.js';
import { HomePage } from '../pages/HomePage.js';
import { blockAds } from '../utils/blockAds.js';
import { buildUser } from '../utils/userFactory.js';
import { createAccount, deleteAccount } from '../utils/api.js';

test.describe('Registration', () => {
  let loginPage;
  let signupPage;
  let homePage;
  let user;

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
    homePage = new HomePage(page);
    user = buildUser();

    await loginPage.goto();
  });

  // Whatever the test created is removed, so re-running never collides with
  // an email registered by an earlier run.
  test.afterEach(async ({ request }) => {
    await deleteAccount(request, user);
  });

  test('registers a new user and starts their session', async ({ page }) => {
    await loginPage.startSignup(user.name, user.email);

    await expect(page).toHaveURL(/\/signup$/);
    await expect(signupPage.name).toHaveValue(user.name);
    await expect(signupPage.email).toHaveValue(user.email);

    await signupPage.createAccount(user);

    await expect(signupPage.accountCreatedTitle).toContainText('Account Created!');
    await signupPage.continueAfterCreation();
    await expect(homePage.loggedInAs).toContainText(user.name);
  });

  test('rejects an email that is already registered', async ({ request }) => {
    await createAccount(request, user);

    await loginPage.startSignup(user.name, user.email);

    await expect(loginPage.signupError).toContainText('Email Address already exist!');
    // The site re-renders the login screen in place, so the user is still
    // facing the signup form rather than the account information page.
    await expect(loginPage.signupForm).toBeVisible();
  });

  test('blocks submission when the signup form is empty', async ({ page }) => {
    await loginPage.signupButton.click();

    await expect(loginPage.signupName).toHaveJSProperty('validity.valid', false);
    await expect(page).toHaveURL(/\/login$/);
  });
});

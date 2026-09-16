# Playwright E2E Automation — automationexercise.com

End-to-end test suite for [automationexercise.com](https://automationexercise.com),
written in Playwright with JavaScript. It covers login, registration, the
product catalogue, the shopping cart and the contact form across 20 scenarios,
organised with the Page Object Model.

## Objective

Demonstrate E2E test automation with Playwright using the **Page Object Model
(POM)**: locators kept in one place per page, tests that read as behaviour,
and assertions that rely on Playwright's auto-waiting instead of fixed sleeps.

## Stack

- **Playwright** 1.63 — test runner, assertions and browser automation
- **JavaScript** (ES modules)
- **Node.js** 18+

## Project structure

```
Playwright-Automation/
├── tests/
│   ├── login.spec.js          # Login, logout and validation
│   ├── registration.spec.js   # Sign-up scenarios
│   ├── products.spec.js       # Catalogue, search, filter, detail view
│   ├── cart.spec.js           # Add, quantity and removal
│   └── contact.spec.js        # Contact form and subscription
├── pages/                     # Page Objects: locators + actions
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── SignupPage.js
│   ├── ProductsPage.js
│   ├── ProductDetailPage.js
│   ├── CartPage.js
│   └── ContactPage.js
├── utils/
│   ├── userFactory.js         # Builds a unique user per run
│   ├── api.js                 # Creates and deletes accounts over the API
│   └── blockAds.js            # Aborts ad and analytics requests
├── fixtures/
│   └── upload-sample.txt      # Attachment for the upload test
├── playwright.config.js
└── package.json
```

## Test coverage

**Login** (`tests/login.spec.js`)

| # | Scenario | Expected result |
| --- | --- | --- |
| 1 | Sign in with valid credentials | The user is authenticated on the home page |
| 2 | Sign in with an unregistered email | `Your email or password is incorrect!` |
| 3 | Sign in with a wrong password | Same error, no session is created |
| 4 | Submit the login form empty | HTML5 validation blocks the submission |
| 5 | Log out from an active session | The session ends and returns to `/login` |

**Registration** (`tests/registration.spec.js`)

| # | Scenario | Expected result |
| --- | --- | --- |
| 6 | Register a new user | `Account Created!` and the user is signed in |
| 7 | Register with an existing email | `Email Address already exist!` |
| 8 | Submit the sign-up form empty | HTML5 validation blocks the submission |

**Products** (`tests/products.spec.js`)

| # | Scenario | Expected result |
| --- | --- | --- |
| 9 | Open the catalogue | The product list is rendered |
| 10 | Search a product by name | The searched product is among the results |
| 11 | Search a term with no matches | No products are returned |
| 12 | Open a product detail page | Name, category, price, availability, condition and brand are shown |
| 13 | Filter by brand | Only that brand's catalogue is listed |

**Shopping cart** (`tests/cart.spec.js`)

| # | Scenario | Expected result |
| --- | --- | --- |
| 14 | Add a product from the catalogue | The product appears with quantity 1 |
| 15 | Add two different products | Both rows are kept in the cart |
| 16 | Choose a quantity on the detail page | The cart reflects the chosen quantity |
| 17 | Remove the last product | The cart reports it is empty |

**Contact and subscription** (`tests/contact.spec.js`)

| # | Scenario | Expected result |
| --- | --- | --- |
| 18 | Submit the contact form with an attachment | Success message is displayed |
| 19 | Submit the contact form empty | HTML5 validation blocks the submission |
| 20 | Subscribe from the footer | `You have been successfully subscribed!` |

All 20 tests pass against the live site, and the suite is safe to re-run: each
run builds its own user and deletes the accounts it creates.

## Getting started

**Requirements:** Node.js 18 or newer.

```bash
cd Playwright-Automation
npm install
npx playwright install chromium
```

### Running the tests

```bash
npm test              # Headless run of the whole suite
npm run test:headed   # Run with a visible browser
npm run test:ui       # Interactive UI mode
npm run report        # Open the HTML report of the last run
```

A single file or a single test:

```bash
npx playwright test tests/cart.spec.js
npx playwright test -g "removes"
```

## Implementation notes

- **No fixed sleeps.** Synchronisation relies on Playwright's auto-waiting and
  on web-first assertions, which retry until the expectation holds.
- **Accounts are created over the API.** The login tests need an existing user,
  so `utils/api.js` registers one and deletes it afterwards. The UI is
  exercised only by the behaviour under test.
- **Unique data per run.** `userFactory.js` builds a fresh email every run,
  which keeps registration repeatable.
- **Ad requests are aborted.** Google's ad script injects a full-page overlay
  that swallows clicks and makes navigation tests fail at random, so
  `blockAds.js` blocks those hosts. It also cuts the run from ~1.7 min to ~18s.
- **Diagnostics on failure only:** trace and screenshot are kept when a test
  fails, so the report stays small but a failure is reproducible.
- **The contact form raises a native dialog.** Playwright dismisses dialogs by
  default, which would cancel the submission, so that test accepts it.

## Behaviour found while writing the suite

Two site behaviours contradicted the obvious assumptions and shaped the tests:

- The product search matches the term against category and brand as well as
  the product name, so asserting that every result repeats the search term
  fails. The suite asserts the searched product is among the results.
- On the contact form only the email field carries a `required` attribute;
  name, subject and message have no client-side validation. The empty-form
  test asserts on the field the browser actually blocks.

## Why the Page Object Model

Each page's locators and actions live in one class, and the tests describe
behaviour only. When a locator changes it is fixed in its page object and
every test that uses it is fixed with it, `loginPage.login(email, password)`
states intent where a chain of raw locators states mechanics, and shared steps
are written once instead of being copied between specs.

## Note

This is a practice and portfolio project, not client work. It runs against
[automationexercise.com](https://automationexercise.com), a public demo site
built for automation training.

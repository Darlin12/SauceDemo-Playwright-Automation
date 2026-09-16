# Playwright E2E Automation — automationexercise.com

End-to-end test suite for [automationexercise.com](https://automationexercise.com),
built with **Playwright** and **JavaScript** on the **Page Object Model**.
Twenty scenarios cover login, registration, the product catalogue, the shopping
cart and the contact form, and the whole suite runs green against the live site
in about 15 seconds.

```
20 passed (14.1s)
```

| | |
| --- | --- |
| **Target** | automationexercise.com (public demo site) |
| **Stack** | Playwright 1.63 · JavaScript (ES modules) · Node.js 18+ |
| **Scope** | 20 tests · 5 specs · 7 page objects |
| **Browser** | Chromium (Desktop Chrome) |
| **Runtime** | ~15 s, 4 parallel workers |

---

## Quick start

Node.js 18 or newer is the only prerequisite. The suite runs against the live
public site, so there is no local server to start and no data to seed.

```bash
git clone https://github.com/Darlin12/SauceDemo-Playwright-Automation.git
cd SauceDemo-Playwright-Automation
npm install
npx playwright install chromium
npm test
```

### Commands

```bash
npm test              # Headless run of the whole suite
npm run test:headed   # Run with a visible browser
npm run test:ui       # Interactive UI mode, with time-travel over each step
npm run test:debug    # Step through with the Playwright Inspector
npm run report        # Open the HTML report of the last run
```

Narrowing a run to one file or one test:

```bash
npx playwright test tests/cart.spec.js
npx playwright test -g "removes"
```

---

## Project structure

```
SauceDemo-Playwright-Automation/
├── tests/                     # Specs: behaviour and assertions only
│   ├── login.spec.js          #   Login, logout and validation
│   ├── registration.spec.js   #   Sign-up scenarios
│   ├── products.spec.js       #   Catalogue, search, filter, detail view
│   ├── cart.spec.js           #   Add, quantity and removal
│   └── contact.spec.js        #   Contact form and subscription
├── pages/                     # Page objects: locators + actions
│   ├── HomePage.js            #   Session state and footer subscription
│   ├── LoginPage.js           #   Login form and "New User Signup!" form
│   ├── SignupPage.js          #   Account information form
│   ├── ProductsPage.js        #   Catalogue, search box, brand filters
│   ├── ProductDetailPage.js   #   Single product, quantity, add to cart
│   ├── CartPage.js            #   Cart rows, quantities, removal
│   └── ContactPage.js         #   Contact form and file upload
├── utils/
│   ├── userFactory.js         # Builds a unique user per run
│   ├── api.js                 # Creates and deletes accounts over the API
│   └── blockAds.js            # Aborts ad and analytics requests
├── fixtures/
│   └── upload-sample.txt      # Attachment for the upload test
├── playwright.config.js
└── package.json
```

The dependency direction is one-way: specs import page objects, page objects
never import specs, and nothing outside `pages/` contains a CSS selector.

---

## Test coverage

### Login — `tests/login.spec.js`

Each test gets a freshly registered account, created over the API in
`beforeEach` and deleted in `afterEach`.

| # | Scenario | Expected result |
| --- | --- | --- |
| 1 | Sign in with valid credentials | `Logged in as <user>` and the logout link is shown |
| 2 | Sign in with an unregistered email | `Your email or password is incorrect!`, still on `/login` |
| 3 | Sign in with a wrong password | Same error, no session is created |
| 4 | Submit the login form empty | HTML5 validation blocks it; the page never navigates |
| 5 | Log out of an active session | Returns to `/login` and `Signup / Login` is back |

### Registration — `tests/registration.spec.js`

| # | Scenario | Expected result |
| --- | --- | --- |
| 6 | Register a new user | `Account Created!`, then the session starts on the home page |
| 7 | Register with an email that already exists | `Email Address already exist!`, the signup form stays put |
| 8 | Submit the sign-up form empty | HTML5 validation blocks it; still on `/login` |

### Products — `tests/products.spec.js`

| # | Scenario | Expected result |
| --- | --- | --- |
| 9 | Open the catalogue | `All Products` is shown with at least one card |
| 10 | Search a product by name | The searched product is among the results |
| 11 | Search a term with no matches | `Searched Products` renders with zero cards |
| 12 | Open a product detail page | Name, category, price, availability, condition and brand are shown |
| 13 | Filter by brand | URL is `/brand_products/Polo` and only that brand is listed |

### Shopping cart — `tests/cart.spec.js`

| # | Scenario | Expected result |
| --- | --- | --- |
| 14 | Add a product from the catalogue | One row, quantity `1` |
| 15 | Add two different products | Both rows are kept |
| 16 | Choose a quantity on the detail page | The cart shows the chosen quantity (`4`) |
| 17 | Remove the last product | `Cart is empty!` |

### Contact and subscription — `tests/contact.spec.js`

| # | Scenario | Expected result |
| --- | --- | --- |
| 18 | Submit the contact form with an attachment | `Success! Your details have been submitted successfully.` |
| 19 | Submit the contact form empty | HTML5 validation blocks it, no success message |
| 20 | Subscribe from the footer | `You have been successfully subscribed!` |

Every test is independent and the suite is safe to re-run: each run builds its
own user and deletes the accounts it creates.

---

## How the suite is built

**Page Object Model.** Each page's locators and actions live in one class, so
specs read as behaviour rather than mechanics — `loginPage.login(email, password)`
states intent where a chain of raw locators states plumbing. When the site
changes a selector it is fixed in one page object, and every test that uses it
is fixed with it.

**No fixed sleeps.** Synchronisation is left to Playwright's auto-waiting and to
web-first assertions such as `toHaveText` and `toHaveCount`, which retry until
the expectation holds or the timeout expires. There is not a single
`waitForTimeout` in the suite.

**Setup goes through the API, not the UI.** The login tests need an account to
exist, but registering through the sign-up form would make every login test
depend on registration passing first. `utils/api.js` creates the account with
`POST /api/createAccount` and removes it with `DELETE /api/deleteAccount`, so
the UI is exercised only by the behaviour actually under test.

**Fresh data every run.** Registration is not idempotent — the site rejects an
email that already exists — so `userFactory.js` mints a unique address per run
and `afterEach` deletes whatever the test created.

**Ads are blocked at the network layer.** This is about stability before speed:
Google's ad script injects a full-page "vignette" overlay that swallows clicks
and makes navigation tests fail at random. `blockAds.js` aborts those hosts,
which also cuts the run from roughly 1.7 minutes to about 15 seconds.

**Failure diagnostics, not noise.** Traces and screenshots are retained only
when a test fails, so the report stays small while any failure remains
reproducible step by step in `npm run report`.

### Configuration

`playwright.config.js` holds the choices that keep a suite against a shared
public site both fast and stable:

| Setting | Value | Reason |
| --- | --- | --- |
| Browser | Chromium (Desktop Chrome) | One project keeps the run short; the page objects are browser-agnostic |
| `baseURL` | `https://automationexercise.com` | Specs navigate by path, so the target changes in one place |
| `fullyParallel` | `true` | Every test is independent, so files and tests run concurrently |
| `retries` | 2 on CI, 0 locally | Retries absorb flake from a shared public site; locally a failure is a failure |
| `timeout` / `expect` | 60 s / 10 s | Room for a slow public host without hiding a genuine hang |
| `trace` / `screenshot` | Retained on failure only | Reproducible failures, small reports |
| Reporters | `list` + `html` | Live progress in the terminal, full report on disk |

`playwright-report/` and `test-results/` are generated on each run and are
ignored by git.

---

## What the site actually does

Four behaviours contradicted the obvious assumption and shaped how the tests
assert. They are worth recording, because each one is the kind of detail that
produces a flaky or falsely-green test if it is guessed at instead of checked.

- **Search matches more than the product name.** The term is also matched
  against category and brand, so asserting that every result repeats the search
  term fails on legitimate results. The suite asserts that the product searched
  for is *among* the results.
- **On the contact form, only the email field is `required`.** Name, subject and
  message have no client-side validation at all, so the empty-form test asserts
  on `email.validity.valid` — the field the browser actually blocks on.
- **Submitting the contact form raises a native `confirm` dialog.** Playwright
  dismisses dialogs automatically, which would silently cancel the submission,
  so `ContactPage.submit()` accepts it explicitly.
- **The API reports failures with HTTP 200.** `POST /api/createAccount` answers
  `200` regardless of outcome and puts the real response code in a JSON body
  served as `text/html`, so `utils/api.js` parses the payload by hand and
  asserts on `responseCode` rather than on the HTTP status.

Adding to the cart has a smaller quirk of the same kind: the real
add-to-cart button lives in an overlay that only appears on hover, so
`ProductsPage.addProductToCart()` scrolls the card into view and hovers before
clicking.

---

## About

A practice and portfolio project by **Darlin Manuel Casado Pérez**, released
under the MIT licence. It runs against
[automationexercise.com](https://automationexercise.com), a public demo site
built for automation training — not client work, and not a production system.

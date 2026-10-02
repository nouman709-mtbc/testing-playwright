# SauceDemo Checkout – Playwright + JavaScript

End-to-end test for the SauceDemo purchase flow, prepared for the TenTwenty QA assessment (Task C).

**Application under test:** https://www.saucedemo.com/ (user: `standard_user`)

## Flow covered

Login → select Sauce Labs Backpack → add to cart → open cart → checkout → enter information → verify overview (product, price, totals) → finish → verify order confirmation.

## Project structure

```
├── data/testData.js          # credentials, product, expected price, checkout info
├── pages/                    # page objects (one per screen group)
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/checkout-e2e.spec.js
├── playwright.config.js
└── .github/workflows/playwright.yml
```

## Prerequisites

- Node.js 18 or later
- Internet access to https://www.saucedemo.com/

## Setup

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npm test                # headless
npm run test:headed     # watch the browser
npm run test:ui         # Playwright UI mode
npm run report          # open the HTML report after a run
```

Credentials default to the public demo values shown on the SauceDemo login page. To override: `SAUCE_USERNAME` and `SAUCE_PASSWORD` environment variables.

## Design decisions

- **Selectors:** SauceDemo's `data-test` attributes via `getByTestId()` (`testIdAttribute` is set to `data-test` in the config). No CSS-class or XPath selectors.
- **Waiting:** Playwright auto-waiting and web-first assertions only. There are no fixed sleeps.
- **Isolation:** every test runs in a fresh browser context and logs in through `beforeEach`. Nothing depends on another test.
- **Assertions:** product name and price are checked on the inventory page, cart and overview. The overview totals are checked arithmetically (total = item total + tax) so the tax rate is not hard-coded. Completion is checked by URL, title, confirmation header and message, and an empty cart badge.
- **Page objects:** locators and actions live in `pages/`; the spec reads as the business flow.

## Limitations

- One happy-path flow and one browser (Chromium). Firefox/WebKit can be added in `playwright.config.js`.
- Expected texts and the product price are tied to the current SauceDemo content. The price lives in `data/testData.js`.
- The test does not cover the empty-cart checkout behaviour documented in the assessment report.
- SauceDemo is a third-party demo site. Availability or markup changes can break the test without any defect in the test itself.

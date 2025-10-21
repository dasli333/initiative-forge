# End-to-End Testing Guide

This directory contains E2E tests using Playwright for the Initiative Forge project.

## Directory Structure

```
e2e/
├── fixtures/          # Test fixtures and custom test setup
│   └── base.ts       # Base test fixture
├── page-objects/     # Page Object Models for maintainability
│   └── LoginPage.ts  # Example: Login page POM
├── auth.spec.ts      # Example: Authentication tests
└── README.md         # This file
```

## Writing E2E Tests

### Basic Test Structure

```typescript
import { test, expect } from "./fixtures/base";

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
```

### Using Page Objects

Page Object Model (POM) helps maintain tests by encapsulating page interactions:

```typescript
// e2e/page-objects/MyPage.ts
import { type Page, type Locator } from "@playwright/test";

export class MyPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading");
  }

  async goto() {
    await this.page.goto("/my-page");
  }
}

// e2e/my-feature.spec.ts
import { MyPage } from "./page-objects/MyPage";

test("should use page object", async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.goto();
  await expect(myPage.heading).toBeVisible();
});
```

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (visual debugger)
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Generate tests with codegen
npm run test:e2e:codegen
```

## Test Configuration

The E2E tests are configured in `playwright.config.ts`:

- **Browser**: Chromium (Desktop Chrome) only
- **Base URL**: http://localhost:3000
- **Dev Server**: Automatically started before tests
- **Retries**: 2 retries in CI, 0 locally
- **Trace**: On first retry
- **Screenshots**: Only on failure

## Best Practices

### 1. Use Resilient Locators

Prefer locators by role and label over CSS selectors:

```typescript
// ✅ Good
page.getByRole("button", { name: /submit/i })
page.getByLabel(/email/i)

// ❌ Bad
page.locator("#submit-btn")
page.locator(".email-input")
```

### 2. Use Page Object Model

Keep tests maintainable by using POM:

```typescript
// ✅ Good
const loginPage = new LoginPage(page);
await loginPage.login(email, password);

// ❌ Bad
await page.fill("#email", email);
await page.fill("#password", password);
await page.click("#submit");
```

### 3. Use Fixtures for Setup/Teardown

```typescript
test.beforeEach(async ({ page }) => {
  // Setup before each test
});

test.afterEach(async ({ page }) => {
  // Cleanup after each test
});
```

### 4. Use Browser Contexts for Isolation

Each test runs in an isolated browser context automatically, ensuring no state leakage between tests.

### 5. Use Trace Viewer for Debugging

When a test fails, use the trace viewer:

```bash
npx playwright show-trace trace.zip
```

### 6. Visual Comparison Testing

Use screenshot comparison for visual regression:

```typescript
await expect(page).toHaveScreenshot("my-page.png");
```

## Test Scenarios

E2E tests should cover critical user journeys:

- ✅ Authentication flows
- ✅ Campaign creation and management
- ✅ Character management
- ✅ Combat encounter workflows
- ✅ Library search and filtering
- ✅ Error handling and edge cases

See `.ai/test-plan.md` for detailed test scenarios.

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Every push to `main` branch
- Every pull request
- Before deployment to production

## Environment Variables

Set the following in CI/CD:

```env
BASE_URL=http://localhost:3000
CI=true
```

## Debugging Tips

1. **Use UI mode**: `npm run test:e2e:ui` for visual debugging
2. **Use debug mode**: `npm run test:e2e:debug` to step through tests
3. **Use codegen**: `npm run test:e2e:codegen` to generate test code
4. **Check traces**: Review trace files for failed tests
5. **Use screenshots**: Check screenshots in `test-results/` directory

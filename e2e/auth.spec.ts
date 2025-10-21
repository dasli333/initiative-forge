import { test, expect } from "./fixtures/base";
import { LoginPage } from "./page-objects/LoginPage";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("TC-AUTH-01: should display login page correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/login|sign in/i);
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();
  });

  test("TC-AUTH-04: should show error for invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("invalid@example.com", "wrongpassword");

    // Wait for error message
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("TC-AUTH-05: should redirect authenticated user from login page", async ({ page }) => {
    // This test would require a logged-in state
    // You would typically use a storage state or fixture for this
    test.skip(true, "Requires authentication setup");
  });

  test("should have accessible form elements", async ({ page }) => {
    // Check for proper ARIA labels
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should validate email format", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.emailInput.fill("invalid-email");
    await loginPage.passwordInput.fill("password123");
    await loginPage.submitButton.click();

    // HTML5 validation should prevent submission
    const emailValidity = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(emailValidity).toBe(false);
  });
});

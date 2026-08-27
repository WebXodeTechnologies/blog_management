import { test, expect } from "@playwright/test";

test.describe("Authentication & RBAC Flow", () => {
  test("should load the login page and display role selector options", async ({
    page,
  }) => {
    // Use absolute URL fallback if baseURL is missed by the test runner context
    const baseURL = test.info().project.use.baseURL || "http://localhost:3000";
    await page.goto(`${baseURL}/login`);

    await page.waitForLoadState("domcontentloaded");

    // Verify page heading and branding
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Sign In/i);

    // Verify RBAC portal buttons exist
    const userRoleButton = page.getByRole("button", { name: /User/i });
    const moderatorRoleButton = page.getByRole("button", {
      name: /Moderator/i,
    });

    await expect(userRoleButton).toBeVisible();
    await expect(moderatorRoleButton).toBeVisible();
  });

  test("should successfully register a new user", async ({ page }) => {
    const baseURL = test.info().project.use.baseURL || "http://localhost:3000";
    await page.goto(`${baseURL}/register`);
    await page.waitForLoadState("domcontentloaded");

    // Fill registration form fields cleanly
    await page.locator('input[type="text"]').fill("Test Developer");
    await page
      .locator('input[type="email"]')
      .fill(`testdev_${Date.now()}@example.com`);
    await page.locator('input[type="password"]').fill("SecurePassword123!");

    // Submit form and wait for redirect response
    await Promise.all([
      page.waitForURL("**/login**", { timeout: 10000 }),
      page.click('button[type="submit"]'),
    ]);

    await expect(page).toHaveURL(/login/);
  });

  test("should handle invalid credentials gracefully", async ({ page }) => {
    const baseURL = test.info().project.use.baseURL || "http://localhost:3000";
    await page.goto(`${baseURL}/login`);
    await page.waitForLoadState("domcontentloaded");

    // Fill incorrect credentials
    await page.locator('input[type="email"]').fill("wronguser@example.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.click('button[type="submit"]');

    // Expect error banner to appear dynamically after API response
    const errorBanner = page.locator(".bg-rose-50");
    await expect(errorBanner).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to forgot password page", async ({ page }) => {
    const baseURL = test.info().project.use.baseURL || "http://localhost:3000";
    await page.goto(`${baseURL}/login`);
    await page.waitForLoadState("domcontentloaded");

    // Click forgot password link safely using text locator with timeout
    const forgotLink = page.locator("text=/forgot password/i");
    await expect(forgotLink).toBeVisible();

    await Promise.all([
      page.waitForURL("**/forgot-password**", { timeout: 10000 }),
      forgotLink.click(),
    ]);

    // Verify elements on forgot password screen
    await expect(page.locator("h1")).toContainText(/Reset Password/i);

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill("test@example.com");
  });
});

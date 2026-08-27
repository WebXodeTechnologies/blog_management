# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication & RBAC Flow >> should successfully register a new user
- Location: tests\e2e\auth.spec.js:16:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "http://localhost:3000/register"
Timeout: 15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    33 × locator resolved to <html lang="en" class="orbitron_9665655c-module__9n9ENG__variable bricolage_grotesque_bfdf73d5-module__ZhSFgW__variable inter_ab3b8213-module__Yo9Eva__variable jetbrains_mono_e729025a-module__H-9f9G__variable h-full antialiased">…</html>
       - unexpected value "http://localhost:3000/register"

```

```yaml
- link "Texora Logo Texora":
  - /url: /
  - img "Texora Logo"
  - text: Texora
- text: Real-time Feeds Role Protected
- img "Technical creator illustration"
- text: Technical Creator Workspace Join Texora Ecosystem
- heading "Create Account" [level=1]
- paragraph: Start publishing and exploring engineering brilliance.
- text: Select Account Role
- button "Standard User"
- button "Moderator"
- text: Full Name
- textbox "Akash S M": Test Developer
- text: Email Address
- textbox "name@example.com": testdev_1787844694463@example.com
- text: Password
- textbox "••••••••": SecurePassword123!
- button [disabled]
- paragraph:
  - text: Already have an account?
  - link "Sign in":
    - /url: /login
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Authentication & RBAC Flow", () => {
  4  |   test("should load the login page and display role selector options", async ({
  5  |     page,
  6  |   }) => {
  7  |     await page.goto("/login");
  8  | 
  9  |     await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  10 |     await expect(page.getByRole("button", { name: /user/i })).toBeVisible();
  11 |     await expect(
  12 |       page.getByRole("button", { name: /moderator/i })
  13 |     ).toBeVisible();
  14 |   });
  15 | 
  16 |   test("should successfully register a new user", async ({ page }) => {
  17 |     await page.goto("/register");
  18 | 
  19 |     const email = `testdev_${Date.now()}@example.com`;
  20 | 
  21 |     // Click and confirm the role selection button toggles state
  22 |     const roleButton = page.getByRole("button", {
  23 |       name: "Standard User",
  24 |       exact: true,
  25 |     });
  26 |     await roleButton.click();
  27 | 
  28 |     await page.locator('input[type="text"]').fill("Test Developer");
  29 |     await page.locator('input[type="email"]').fill(email);
  30 |     await page.locator('input[type="password"]').fill("SecurePassword123!");
  31 | 
  32 |     const submitButton = page.getByRole("button", {
  33 |       name: "Create Account",
  34 |       exact: true,
  35 |     });
  36 | 
  37 |     // Wait until React enables the button fully
  38 |     await expect(submitButton).toBeEnabled();
  39 |     await submitButton.click();
  40 | 
  41 |     // Verify successful registration redirects to login page
> 42 |     await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  43 |   });
  44 | 
  45 |   test("should handle invalid credentials gracefully", async ({ page }) => {
  46 |     await page.goto("/login");
  47 | 
  48 |     await page.locator('input[type="email"]').fill("wronguser@example.com");
  49 |     await page.locator('input[type="password"]').fill("wrongpassword");
  50 | 
  51 |     await page.getByRole("button", { name: /sign in/i }).click();
  52 | 
  53 |     const errorBanner = page.getByRole("alert");
  54 |     await expect(errorBanner).toBeVisible({ timeout: 5000 });
  55 |   });
  56 | 
  57 |   test("should navigate to forgot password page", async ({ page }) => {
  58 |     await page.goto("/login");
  59 | 
  60 |     const forgotLink = page.getByRole("link", { name: /forgot password/i });
  61 |     await expect(forgotLink).toBeVisible();
  62 |     await forgotLink.click();
  63 | 
  64 |     await expect(page).toHaveURL(/\/forgot-password/);
  65 |     await expect(
  66 |       page.getByRole("heading", { name: /reset password/i })
  67 |     ).toBeVisible();
  68 | 
  69 |     const emailInput = page.locator('input[type="email"]');
  70 |     await expect(emailInput).toBeVisible();
  71 |     await emailInput.fill("test@example.com");
  72 |   });
  73 | });
  74 | 
```
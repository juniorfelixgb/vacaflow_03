import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('User can register a new account', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Create Account")');

    expect(page.url()).toContain('/register');

    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;

    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPassword123');

    await page.click('button:has-text("Create Account")');

    // Should redirect to login after successful registration
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('User can login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Use demo manager account
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.fill('input[name="password"]', 'Demo1234!');

    await page.click('button:has-text("Sign In")');

    // Should redirect to dashboard after successful login
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('User cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123');

    await page.click('button:has-text("Sign In")');

    // Should see error message
    const errorMsg = page.locator('text=Invalid email or password');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });

  test('User can logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.fill('input[name="password"]', 'Demo1234!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');

    // Now logout
    await page.click('a:has-text("Sign Out")');

    // Should redirect to home
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toBe('http://localhost:3000/');
  });
});

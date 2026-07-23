import { test, expect } from '@playwright/test';

test.describe('Manager Approval Workflow', () => {
  test('Manager can view review queue', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.fill('input[name="password"]', 'Demo1234!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');

    // Navigate to queue
    await page.click('a:has-text("Review Queue")');
    await page.waitForURL('**/manager/queue', { timeout: 5000 });

    expect(page.url()).toContain('/manager/queue');
    await expect(page.locator('h1:has-text("Review Queue")')).toBeVisible();
  });

  test('Manager can review submitted request', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.fill('input[name="password"]', 'Demo1234!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');

    // Go to queue
    await page.click('a:has-text("Review Queue")');
    await page.waitForURL('**/manager/queue');

    // Check if there are any submitted requests to review
    const reviewLinks = page.locator('a:has-text("Review")');
    const count = await reviewLinks.count();

    if (count > 0) {
      // Click first review link
      await reviewLinks.first().click();
      await page.waitForURL('**/manager/review/*', { timeout: 5000 });

      expect(page.url()).toMatch(/\/manager\/review\/[a-f0-9-]{36}/);
      await expect(page.locator('h1:has-text("Review Request")')).toBeVisible();
    }
  });

  test('Manager can approve request', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.fill('input[name="password"]', 'Demo1234!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');

    // Go to queue
    await page.click('a:has-text("Review Queue")');
    await page.waitForURL('**/manager/queue');

    // Check if there are requests to review
    const reviewLinks = page.locator('a:has-text("Review")');
    const count = await reviewLinks.count();

    if (count > 0) {
      await reviewLinks.first().click();
      await page.waitForURL('**/manager/review/*');

      // Add comment and approve
      await page.fill('textarea[name="comment"]', 'Approved - have a great vacation!');
      await page.click('button:has-text("Approve")');

      // Should redirect back to queue
      await page.waitForURL('**/manager/queue', { timeout: 5000 });
      expect(page.url()).toContain('/manager/queue');
    }
  });

  test('Manager can reject request', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.fill('input[name="password"]', 'Demo1234!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');

    // Go to queue
    await page.click('a:has-text("Review Queue")');
    await page.waitForURL('**/manager/queue');

    // Check if there are requests to review
    const reviewLinks = page.locator('a:has-text("Review")');
    const count = await reviewLinks.count();

    if (count > 0) {
      await reviewLinks.first().click();
      await page.waitForURL('**/manager/review/*');

      // Add comment and reject
      await page.fill('textarea[name="comment"]', 'Cannot approve - schedule conflict');
      await page.click('button:has-text("Reject")');

      // Should redirect back to queue
      await page.waitForURL('**/manager/queue', { timeout: 5000 });
      expect(page.url()).toContain('/manager/queue');
    }
  });
});

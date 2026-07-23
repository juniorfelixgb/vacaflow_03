import { test, expect } from '@playwright/test';

test.describe('Employee Request Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    // Login as employee before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.fill('input[name="password"]', 'Demo1234!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');
  });

  test('Employee can view request list', async ({ page }) => {
    await page.click('a:has-text("My Requests")');
    await page.waitForURL('**/requests', { timeout: 5000 });

    expect(page.url()).toContain('/requests');
    // Should see the page heading
    await expect(page.locator('h1:has-text("Your Requests")')).toBeVisible();
  });

  test('Employee can create a new request', async ({ page }) => {
    await page.click('a:has-text("My Requests")');
    await page.waitForURL('**/requests');

    await page.click('button:has-text("+ New Request")');
    await page.waitForURL('**/requests/new', { timeout: 5000 });

    // Fill form
    await page.selectOption('select[name="absenceTypeId"]', { index: 1 });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    await page.fill('input[name="startDate"]', tomorrowStr);
    await page.fill('input[name="endDate"]', nextWeekStr);
    await page.fill('textarea[name="reason"]', 'Vacation time for family visit');

    await page.click('button:has-text("Create Request")');

    // Should redirect to request details
    await page.waitForURL('**/requests/*', { timeout: 5000 });
    expect(page.url()).toMatch(/\/requests\/[a-f0-9-]{36}/);
  });

  test('Employee can edit draft request', async ({ page }) => {
    // Create a request first
    await page.click('a:has-text("My Requests")');
    await page.waitForURL('**/requests');
    await page.click('button:has-text("+ New Request")');
    await page.waitForURL('**/requests/new');

    await page.selectOption('select[name="absenceTypeId"]', { index: 1 });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    await page.fill('input[name="startDate"]', tomorrowStr);
    await page.fill('input[name="endDate"]', nextWeekStr);
    await page.fill('textarea[name="reason"]', 'Original reason');

    await page.click('button:has-text("Create Request")');
    await page.waitForURL('**/requests/*');

    // Now edit it
    await page.click('button:has-text("Edit")');

    await page.fill('textarea[name="reason"]', 'Updated reason');
    await page.click('button:has-text("Save Changes")');

    // Verify update
    await expect(page.locator('text=Updated reason')).toBeVisible();
  });

  test('Employee can submit draft request', async ({ page }) => {
    // Create a request
    await page.click('a:has-text("My Requests")');
    await page.waitForURL('**/requests');
    await page.click('button:has-text("+ New Request")');
    await page.waitForURL('**/requests/new');

    await page.selectOption('select[name="absenceTypeId"]', { index: 1 });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    await page.fill('input[name="startDate"]', tomorrowStr);
    await page.fill('input[name="endDate"]', nextWeekStr);
    await page.fill('textarea[name="reason"]', 'Vacation request');

    await page.click('button:has-text("Create Request")');
    await page.waitForURL('**/requests/*');

    // Submit it
    await page.click('button:has-text("Submit")');

    // Should see Submitted status
    await expect(page.locator('text=Submitted')).toBeVisible({ timeout: 5000 });
  });

  test('Employee can cancel request', async ({ page }) => {
    // Create a request
    await page.click('a:has-text("My Requests")');
    await page.waitForURL('**/requests');
    await page.click('button:has-text("+ New Request")');
    await page.waitForURL('**/requests/new');

    await page.selectOption('select[name="absenceTypeId"]', { index: 1 });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    await page.fill('input[name="startDate"]', tomorrowStr);
    await page.fill('input[name="endDate"]', nextWeekStr);
    await page.fill('textarea[name="reason"]', 'Vacation request');

    await page.click('button:has-text("Create Request")');
    await page.waitForURL('**/requests/*');

    // Cancel it
    await page.click('button:has-text("Cancel Request")');
    page.on('dialog', dialog => dialog.accept()); // Confirm dialog

    // Should see Cancelled status
    await expect(page.locator('text=Cancelled')).toBeVisible({ timeout: 5000 });
  });
});

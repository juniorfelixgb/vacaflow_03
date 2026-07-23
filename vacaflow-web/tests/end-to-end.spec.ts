import { test, expect } from '@playwright/test';

test.describe('Complete End-to-End Workflow', () => {
  test('User can register, login, create request, and manager can approve', async ({ page }) => {
    // Step 1: Register new user
    const timestamp = Date.now();
    const email = `e2euser${timestamp}@example.com`;
    const password = 'TestPassword123';

    await page.goto('/');
    await page.click('a:has-text("Create Account")');
    await page.waitForURL('**/register');

    await page.fill('input[name="fullName"]', 'E2E Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Create Account")');

    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    // Step 2: Login with new account
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Sign In")');

    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');

    // Step 3: Create absence request
    await page.click('a:has-text("My Requests")');
    await page.waitForURL('**/requests');

    await page.click('button:has-text("+ New Request")');
    await page.waitForURL('**/requests/new');

    // Select absence type
    await page.selectOption('select[name="absenceTypeId"]', { index: 1 });

    // Set dates (5 days starting tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    await page.fill('input[name="startDate"]', tomorrowStr);
    await page.fill('input[name="endDate"]', nextWeekStr);
    await page.fill('textarea[name="reason"]', 'E2E test vacation request');

    await page.click('button:has-text("Create Request")');
    await page.waitForURL('**/requests/*', { timeout: 5000 });

    // Get request ID from URL
    const requestUrl = page.url();
    const requestId = requestUrl.match(/\/requests\/([a-f0-9-]+)/)?.[1];
    expect(requestId).toBeTruthy();

    // Step 4: Submit request
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=Submitted')).toBeVisible({ timeout: 5000 });

    // Step 5: Logout
    await page.click('a:has-text("Sign Out")');
    await page.waitForURL('/', { timeout: 5000 });

    // Step 6: Login as manager
    await page.goto('/login');
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.fill('input[name="password"]', 'Demo1234!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    // Step 7: View review queue and find the request
    await page.click('a:has-text("Review Queue")');
    await page.waitForURL('**/manager/queue', { timeout: 5000 });

    // Look for the request in the queue
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();

    // Find and click the e2e test user's request if it exists
    let found = false;
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes('E2E Test User') || text?.includes(email)) {
        await row.locator('a:has-text("Review")').click();
        found = true;
        break;
      }
    }

    if (found) {
      await page.waitForURL('**/manager/review/*', { timeout: 5000 });

      // Step 8: Approve the request
      await page.fill('textarea[name="comment"]', 'E2E test approval - looks good!');
      await page.click('button:has-text("Approve")');

      await page.waitForURL('**/manager/queue', { timeout: 5000 });
      expect(page.url()).toContain('/manager/queue');
    }
  });
});

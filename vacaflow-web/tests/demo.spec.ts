import { test, expect } from '@playwright/test';

test.describe('VacaFlow Complete Demonstration', () => {
  const DELAY = 3000; // 3 seconds between steps

  test('Complete Happy Path: Register → Login → Create → Submit → Approve', async ({
    page,
    context,
  }) => {
    // Start video recording
    const video = await context.video?.path();

    // ============ STEP 1: Home Page ============
    console.log('📍 Step 1: Navigating to Home Page');
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('h1:has-text("VacaFlow")')).toBeVisible();
    await page.screenshot({ path: 'demo-01-home.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 2: Navigate to Register ============
    console.log('📍 Step 2: Navigating to Register Page');
    await page.click('a:has-text("Create Account")');
    await page.waitForURL('**/register', { waitUntil: 'networkidle' });
    await expect(page.locator('h1:has-text("Create Account")')).toBeVisible();
    await page.screenshot({ path: 'demo-02-register-page.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 3: Fill Registration Form ============
    console.log('📍 Step 3: Filling Registration Form');
    const timestamp = Date.now();
    const email = `demouser${timestamp}@vacaflow.com`;
    const password = 'DemoPassword123';

    await page.fill('input[name="fullName"]', 'Alice Johnson');
    await page.screenshot({ path: 'demo-03-enter-fullname.png' });
    await page.waitForTimeout(DELAY);

    await page.fill('input[name="email"]', email);
    await page.screenshot({ path: 'demo-04-enter-email.png' });
    await page.waitForTimeout(DELAY);

    await page.fill('input[name="password"]', password);
    await page.screenshot({ path: 'demo-05-enter-password.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 4: Submit Registration ============
    console.log('📍 Step 4: Submitting Registration');
    await page.click('button:has-text("Create Account")');
    await page.waitForURL('**/login', { waitUntil: 'networkidle', timeout: 10000 });
    await page.screenshot({ path: 'demo-06-registration-success.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 5: Login Page ============
    console.log('📍 Step 5: At Login Page');
    await expect(page.locator('h1:has-text("Sign In")')).toBeVisible();
    await page.screenshot({ path: 'demo-07-login-page.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 6: Enter Login Credentials ============
    console.log('📍 Step 6: Entering Login Credentials');
    await page.fill('input[name="email"]', email);
    await page.screenshot({ path: 'demo-08-login-email.png' });
    await page.waitForTimeout(DELAY);

    await page.fill('input[name="password"]', password);
    await page.screenshot({ path: 'demo-09-login-password.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 7: Submit Login ============
    console.log('📍 Step 7: Submitting Login');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { waitUntil: 'networkidle', timeout: 10000 });
    await page.screenshot({ path: 'demo-10-dashboard.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 8: Dashboard Overview ============
    console.log('📍 Step 8: Dashboard Overview');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('text=Alice Johnson')).toBeVisible();
    await page.screenshot({ path: 'demo-11-dashboard-overview.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 9: Navigate to Request List ============
    console.log('📍 Step 9: Navigating to Request List');
    await page.click('a:has-text("My Requests")');
    await page.waitForURL('**/requests', { waitUntil: 'networkidle' });
    await expect(page.locator('h1:has-text("Your Requests")')).toBeVisible();
    await page.screenshot({ path: 'demo-12-requests-list.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 10: Click Create New Request ============
    console.log('📍 Step 10: Clicking Create New Request');
    await page.click('button:has-text("+ New Request")');
    await page.waitForURL('**/requests/new', { waitUntil: 'networkidle' });
    await expect(page.locator('h1:has-text("Create Request")')).toBeVisible();
    await page.screenshot({ path: 'demo-13-create-request-form.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 11: Select Absence Type ============
    console.log('📍 Step 11: Selecting Absence Type');
    await page.selectOption('select[name="absenceTypeId"]', { index: 1 });
    await page.screenshot({ path: 'demo-14-select-absence-type.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 12: Enter Start Date ============
    console.log('📍 Step 12: Entering Start Date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await page.fill('input[name="startDate"]', tomorrowStr);
    await page.screenshot({ path: 'demo-15-select-start-date.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 13: Enter End Date ============
    console.log('📍 Step 13: Entering End Date');
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    const endDateStr = endDate.toISOString().split('T')[0];

    await page.fill('input[name="endDate"]', endDateStr);
    await page.screenshot({ path: 'demo-16-select-end-date.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 14: Enter Reason ============
    console.log('📍 Step 14: Entering Reason');
    const reason =
      'Family vacation. I plan to visit my parents in Spain for a week. This is important family time that I have been planning for several months.';

    await page.fill('textarea[name="reason"]', reason);
    await page.screenshot({ path: 'demo-17-enter-reason.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 15: Submit Create Request ============
    console.log('📍 Step 15: Creating Request');
    await page.click('button:has-text("Create Request")');
    await page.waitForURL('**/requests/*', { waitUntil: 'networkidle', timeout: 10000 });
    await page.screenshot({ path: 'demo-18-request-created.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 16: Request Detail Page ============
    console.log('📍 Step 16: Request Detail Page');
    const requestUrl = page.url();
    const requestId = requestUrl.match(/\/requests\/([a-f0-9-]+)/)?.[1];
    console.log(`   Request ID: ${requestId}`);

    await expect(page.locator('text=Draft')).toBeVisible();
    await page.screenshot({ path: 'demo-19-request-draft-status.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 17: Edit Request ============
    console.log('📍 Step 17: Editing Request');
    await page.click('button:has-text("Edit")');
    await page.screenshot({ path: 'demo-20-edit-mode.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 18: Update Reason ============
    console.log('📍 Step 18: Updating Reason');
    const updatedReason =
      'Family vacation in Spain. I will be visiting my parents and exploring the beautiful coast.';

    await page.fill('textarea[name="reason"]', updatedReason);
    await page.screenshot({ path: 'demo-21-updated-reason.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 19: Save Changes ============
    console.log('📍 Step 19: Saving Changes');
    await page.click('button:has-text("Save Changes")');
    await page.waitForTimeout(2000); // Wait for update
    await page.screenshot({ path: 'demo-22-changes-saved.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 20: Submit Request ============
    console.log('📍 Step 20: Submitting Request for Approval');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(2000); // Wait for submission
    await expect(page.locator('text=Submitted')).toBeVisible();
    await page.screenshot({ path: 'demo-23-request-submitted.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 21: Logout as Employee ============
    console.log('📍 Step 21: Logging Out');
    await page.click('a:has-text("Back to Dashboard")');
    await page.waitForURL('**/dashboard', { waitUntil: 'networkidle' });
    await page.click('a:has-text("Sign Out")');
    await page.waitForURL('/', { waitUntil: 'networkidle', timeout: 10000 });
    await page.screenshot({ path: 'demo-24-logged-out.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 22: Manager Login ============
    console.log('📍 Step 22: Manager Logging In');
    await page.click('a:has-text("Sign in", { exact: true })');
    await page.waitForURL('**/login', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'demo-25-manager-login-page.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 23: Enter Manager Credentials ============
    console.log('📍 Step 23: Entering Manager Credentials');
    await page.fill('input[name="email"]', 'james.parker@igs.com');
    await page.screenshot({ path: 'demo-26-manager-email.png' });
    await page.waitForTimeout(DELAY);

    await page.fill('input[name="password"]', 'Demo1234!');
    await page.screenshot({ path: 'demo-27-manager-password.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 24: Manager Login Submit ============
    console.log('📍 Step 24: Manager Submitting Login');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard', { waitUntil: 'networkidle', timeout: 10000 });
    await page.screenshot({ path: 'demo-28-manager-dashboard.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 25: Manager Dashboard ============
    console.log('📍 Step 25: Manager Dashboard with Review Queue');
    await expect(page.locator('text=Manager')).toBeVisible();
    await page.screenshot({ path: 'demo-29-manager-dashboard-overview.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 26: Navigate to Review Queue ============
    console.log('📍 Step 26: Navigating to Review Queue');
    await page.click('a:has-text("Review Queue")');
    await page.waitForURL('**/manager/queue', { waitUntil: 'networkidle' });
    await expect(page.locator('h1:has-text("Review Queue")')).toBeVisible();
    await page.screenshot({ path: 'demo-30-review-queue.png' });
    await page.waitForTimeout(DELAY);

    // ============ STEP 27: Find Request in Queue ============
    console.log('📍 Step 27: Finding Request in Queue');
    const reviewLinks = page.locator('a:has-text("Review")');
    const count = await reviewLinks.count();
    console.log(`   Found ${count} request(s) to review`);

    if (count > 0) {
      await page.screenshot({ path: 'demo-31-queue-with-requests.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 28: Click Review ============
      console.log('📍 Step 28: Clicking Review on Request');
      await reviewLinks.first().click();
      await page.waitForURL('**/manager/review/*', { waitUntil: 'networkidle', timeout: 10000 });
      await expect(page.locator('h1:has-text("Review Request")')).toBeVisible();
      await page.screenshot({ path: 'demo-32-review-page.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 29: Review Request Details ============
      console.log('📍 Step 29: Reviewing Request Details');
      await page.screenshot({ path: 'demo-33-review-details.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 30: Scroll to See Full Details ============
      console.log('📍 Step 30: Scrolling to See Reason');
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.screenshot({ path: 'demo-34-review-reason.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 31: Add Approval Comment ============
      console.log('📍 Step 31: Adding Approval Comment');
      await page.fill(
        'textarea[name="comment"]',
        'Great request! This looks reasonable. Please enjoy your vacation and return refreshed.'
      );
      await page.screenshot({ path: 'demo-35-approval-comment.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 32: Click Approve ============
      console.log('📍 Step 32: Approving Request');
      await page.click('button:has-text("Approve")');
      await page.waitForURL('**/manager/queue', { waitUntil: 'networkidle', timeout: 10000 });
      await page.screenshot({ path: 'demo-36-approval-complete.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 33: Back to Queue ============
      console.log('📍 Step 33: Back at Review Queue');
      await expect(page.locator('h1:has-text("Review Queue")')).toBeVisible();
      await page.screenshot({ path: 'demo-37-back-to-queue.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 34: View Employee Dashboard as Manager ============
      console.log('📍 Step 34: Viewing Manager Dashboard');
      await page.click('a:has-text("Back to Dashboard")');
      await page.waitForURL('**/dashboard', { waitUntil: 'networkidle' });
      await page.screenshot({ path: 'demo-38-manager-final-dashboard.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 35: Logout Manager ============
      console.log('📍 Step 35: Manager Logging Out');
      await page.click('a:has-text("Sign Out")');
      await page.waitForURL('/', { waitUntil: 'networkidle', timeout: 10000 });
      await page.screenshot({ path: 'demo-39-logged-out-final.png' });
      await page.waitForTimeout(DELAY);

      // ============ STEP 36: Final Home Page ============
      console.log('📍 Step 36: Complete Demo - Back at Home Page');
      await expect(page.locator('h1:has-text("VacaFlow")')).toBeVisible();
      await page.screenshot({ path: 'demo-40-home-final.png' });

      console.log('✅ Complete happy path demonstration finished!');
      console.log('📸 Screenshots saved in test-results directory');
      console.log(`🎥 Video recording: ${video}`);
    } else {
      console.error('❌ No requests found in review queue!');
      throw new Error('No requests available for manager to review');
    }
  });
});

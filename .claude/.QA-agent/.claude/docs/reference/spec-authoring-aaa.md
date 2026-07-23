# Spec Authoring (AAA) — Canonical Standard

> **Single source of truth** for Playwright POM spec files, used by lanes with
> `style: pom-spec` (`docs/qa-config.yaml` → the lane's `test_dir`; see
> [lane-styles.md](lane-styles.md)). Page object rules live in
> [page-object-standards.md](page-object-standards.md); coverage rules in
> [coverage-matrix.md](coverage-matrix.md).

## File location

```
{lane.test_dir}/{module}/{feature}.spec.ts
```

## AAA pattern

Every test follows **Arrange → Act → Assert**:

```typescript
import { test, expect } from '@playwright/test';
import { {ModuleName}Page } from '../../pageObjects/{ModuleName}Page';

test.describe('{Feature Name}', () => {
  let modulePage: {ModuleName}Page;

  test.beforeEach(async ({ page }) => {
    modulePage = new {ModuleName}Page(page);
    await modulePage.goto();
  });

  test('TC-001: {AC item description}', async ({ page }) => {
    // Arrange — any additional setup
    // Act
    await modulePage.{action}();
    // Assert
    await expect(page).toHaveURL(/{url-pattern}/);
  });
});
```

## Authenticated tests (login is a precondition)

Use the `authenticatedPage` fixture instead of logging in inside the test:

```typescript
import { test, expect } from '../../fixtures/users.fixture';

test('TC-002: {action requiring login}', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in via the fixture
  await expect(authenticatedPage).toHaveURL(/\/dashboard/);
});
```

## Rules

- **One `test()` per AC item** — never merge multiple ACs into one test.
- **Tests are fully independent** — no shared state between tests. `beforeEach` sets up;
  if a test mutates global state, add teardown so order never matters.
- **No hardcoded credentials** — use `process.env.USERNAME`, `process.env.PASSWORD`, etc.
  Prefer the credential sets in the test-data module over inline env reads.
- **Use the `authenticatedPage` fixture** whenever login is a precondition.
- **Assert the exact expected result from the AC** — never approximate. Quote exact UI
  text (`'Required'`, `'Invalid credentials'`).
- **No assertions inside page objects** — assertions live here in the spec.
- After each test is written, update the coverage matrix status to ✅
  ([coverage-matrix.md](coverage-matrix.md)).
- Locators come from the page object, which follows
  [locator-strategy.md](locator-strategy.md). Never build locators in the spec.

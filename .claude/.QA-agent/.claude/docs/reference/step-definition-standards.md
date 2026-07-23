# Step Definition Standards — Canonical Standard

> **Single source of truth** for step definition files, used by lanes with
> `style: bdd-gherkin` (`docs/qa-config.yaml` → the lane's `step_dir`; see
> [lane-styles.md](lane-styles.md)). Scenario/Gherkin rules live in
> [gherkin-standards.md](gherkin-standards.md); page object rules in
> [page-object-standards.md](page-object-standards.md).
>
> **Detect the installed BDD framework** (`docs/qa-config.yaml` → `automation.bdd_framework`)
> and use the matching pattern. **Never mix the two.**

## Output file

```
{lane.step_dir}/{module}-userstory-{id}.steps.ts
```

For manual feature files: `{lane.step_dir}/{module}-{slug}.steps.ts`.
Steps appearing in **3+** feature files go in `{lane.step_dir}/common.steps.ts`.

**Before writing**, grep every unique step text across existing step files. Mark each
step EXISTS (reuse) or MISSING (create). **Never recreate an existing step.**

## Pattern — `playwright-bdd`

```typescript
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { {ModuleName}Page } from '../pageObjects/{ModuleName}Page';

const { Given, When, Then } = createBdd();

Given('the user is on the {string} page', async ({ page }, pageName: string) => {
  console.log(`Step: the user is on the ${pageName} page`);
  const modulePage = new {ModuleName}Page(page);
  await modulePage.goto();
});

When('the user clicks the Login button', async ({ page }) => {
  console.log('Step: the user clicks the Login button');
  const loginPage = new {ModuleName}Page(page);
  await loginPage.loginButton.click();
});

Then('the error message {string} is displayed', async ({ page }, message: string) => {
  console.log(`Step: the error message "${message}" is displayed`);
  await expect(page.getByText(message)).toBeVisible();
});
```

## Pattern — `@cucumber/cucumber`

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/custom-world';

Given('the user is on the {string} page', async function (this: ICustomWorld, pageName: string) {
  await this.page.goto(process.env.URL ?? '');
});
```

## Rules

- **Cucumber expressions** for parameters: `{string}`, `{int}`, `{float}`.
- **Use page object methods** — never call `page.locator()` directly in a step.
- **`expect()` assertions go in `Then` steps only.**
- Each step is **atomic and independently reusable**.
- Add `console.log()` at the start of each step for trace debugging.
- After actions that trigger async operations, wait for load state via the shared helper
  (`waitForAppReady`) rather than ad-hoc `networkidle` calls — see `src/utils/`.
- **No hardcoded credentials** — `process.env.*` (prefer the test-data credential sets).
- **No `ICustomWorld` / Cucumber World pattern** when `bdd_framework` is `playwright-bdd`.

## After writing — generate & verify

Run `{lane.gen_command}` (e.g. `npm run bddgen`) and confirm
`{lane.generated_dir}/` is populated before executing tests. If `bddgen` fails,
fix the root cause (usually a step mismatch or import error) — see
[failure-healing.md](failure-healing.md).

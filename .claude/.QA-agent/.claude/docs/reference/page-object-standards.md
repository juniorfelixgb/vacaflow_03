# Page Object Standards — Canonical Standard

> **Single source of truth** for Page Object Model (POM) classes under the configured
> `page_object_dir` (see `docs/qa-config.yaml` → `automation.page_object_dir`).
> Page objects are **shared** by every lane with `style: pom-spec` or `bdd-gherkin`
> (see [lane-styles.md](lane-styles.md)); `api-request` lanes use none.
> Locator selection rules live in [locator-strategy.md](locator-strategy.md).

## Class shape

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class {ModuleName}Page extends BasePage {
  readonly {locatorName}: Locator;

  constructor(page: Page) {
    super(page);
    this.{locatorName} = page.getByRole('{role}', { name: '{name}' });
  }

  async {actionName}() {
    await this.{locatorName}.click();
  }
}
```

`BasePage` provides `page`, `goto(path?)`, and shared helpers — see "BasePage contract" below.

## Rules

- **Named PascalCase export**: `export class {Name}Page` — never a default export.
- **Locators are `readonly` properties** initialized in the constructor. Declare every
  locator once; never construct locators ad hoc inside methods.
- **Never call `page.locator()` (or `getByRole`, etc.) inside an action method** — always
  reference `this.{locatorName}`. The constructor is the only place locators are built.
- **Action methods are `async` and verb-based**: `clickSave()`, `fillEmail()`, `login()`.
- **No assertions in page objects.** Page objects expose state and perform actions;
  `expect()` belongs in specs ([spec-authoring-aaa.md](spec-authoring-aaa.md)) and in
  `Then` steps ([step-definition-standards.md](step-definition-standards.md)).
- **Single Responsibility**: one page = one class.
- **No duplicates**: before creating a page object, glob the `page_object_dir` for an
  existing `*{Module}*.ts`. If one exists, **extend it** — never recreate.
- **Credentials/URLs via `process.env.*`** — never hardcoded. `goto()` uses `process.env.URL`.
- **Locators follow [locator-strategy.md](locator-strategy.md)**: priority order
  getByRole → getByLabel → getByTestId → getByText → CSS; never XPath / `nth()` / `first()`.

## BasePage contract

Every page object extends `BasePage` (in the `page_object_dir`). BasePage provides:

| Member | Purpose |
|--------|---------|
| `readonly page: Page` | The Playwright page, set in the constructor. |
| `protected path: string` | Optional route suffix appended to `process.env.URL` by `goto()`. Defaults to `''`. |
| `async goto(path?)` | Navigates to `process.env.URL` + (`path` ?? `this.path`). Removes the repeated `process.env.URL ?? ''` boilerplate. |

Subclasses set `path` (if they own a route) and add their own locators + actions. This
keeps navigation/`goto` logic in one place (DRY) and lets any page substitute for
`BasePage` (LSP) while staying open for extension, closed for modification (OCP).

## Identifying required locators (bdd-gherkin style)

When building a page object from a feature file, parse each `When`/`Then` step and map the
referenced UI elements to locators per [locator-strategy.md](locator-strategy.md):

| Step | Element | Locator |
|------|---------|---------|
| `enters "..." in the Username field` | Username input | `getByRole('textbox', { name: 'Username' })` |
| `clicks the Login button` | Login button | `getByRole('button', { name: 'Login' })` |

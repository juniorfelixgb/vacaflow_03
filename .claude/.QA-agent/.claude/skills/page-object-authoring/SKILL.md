---
name: page-object-authoring
description: Authoring or extending Page Object Model classes under src/pageObjects (*Page.ts). Use when creating or modifying a *Page.ts class, adding locators or action methods, refactoring a page object, or deciding whether to reuse an existing one. Covers class shape, readonly locators, async verb methods, BasePage usage, and the no-duplicate rule.
---

# Page Object Authoring

The canonical rules live in **[.claude/docs/reference/page-object-standards.md](../../docs/reference/page-object-standards.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- **Reuse first**: glob the configured `automation.page_object_dir` for an existing `*{Module}*.ts`. Extend it; never recreate. Page objects are shared by every `pom-spec` and `bdd-gherkin` lane.
- Extend `BasePage`; named PascalCase export; `readonly` locators built once in the constructor; `async` verb-based action methods; **no `expect()` inside page objects**.
- Never call `page.locator()`/`getByRole()` inside a method — reference `this.{locator}`.
- Locators follow [locator-strategy]; credentials/URLs via `process.env.*`.

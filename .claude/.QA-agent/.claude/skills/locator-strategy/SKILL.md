---
name: locator-strategy
description: Choosing Playwright locators for any page object or step definition in this repo. Use when writing or fixing a Locator, deciding between getByRole/getByLabel/getByTestId/getByText/CSS, when a selector is brittle, or when a test fails with "strict mode violation" / "resolved to N elements". Enforces the priority order and the XPath/nth()/first() ban.
---

# Locator Strategy

The canonical rules live in **[.claude/docs/reference/locator-strategy.md](../../docs/reference/locator-strategy.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Pick the most semantic locator the UI allows; stop at the first tier that uniquely matches: `getByRole` → `getByLabel` → `getByTestId` → `getByText({ exact: true })` → CSS attribute.
- Never use XPath, `nth()`, or `first()`. Resolve ambiguity by **scoping to a parent**, not by index.
- Declare locators once as `readonly` properties in the page object constructor (see [page-object-authoring]) — never build them inside methods or specs.
- A `strict mode violation` is a **LOC** failure → narrow the locator (see [failure-healing]).

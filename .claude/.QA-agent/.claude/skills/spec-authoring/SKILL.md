---
name: spec-authoring
description: Writing Playwright POM spec files (Arrange-Act-Assert) for lanes with style pom-spec (the lane's test_dir, *.spec.ts). Use when creating or editing a *.spec.ts, mapping a test case to a test(), using the authenticatedPage fixture, or enforcing one-AC-per-test and no-hardcoded-credentials.
---

# Spec Authoring (AAA)

The canonical rules live in **[.claude/docs/reference/spec-authoring-aaa.md](../../docs/reference/spec-authoring-aaa.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Structure every test as **Arrange → Act → Assert**; one `test()` per AC item; tests fully independent.
- Use the `authenticatedPage` fixture whenever login is a precondition — don't log in inline.
- No hardcoded credentials (use `process.env.*` / the test-data module). Assert the exact AC result; quote exact UI text.
- Locators come from the page object ([page-object-authoring] / [locator-strategy]) — never built in the spec. Update the [coverage-matrix] status as tests pass.

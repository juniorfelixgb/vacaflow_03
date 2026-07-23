# Locator Strategy — Canonical Standard

> **Single source of truth** for how locators are chosen in this repo. Page objects,
> step definitions, and failure healing all defer to this document.
> Numeric thresholds, paths, and commands are **not** here — read them from `docs/qa-config.yaml`.

## Priority order (stop at the first that works)

Apply in this exact order. Use the most semantic locator the UI allows; only fall to a
lower tier when the higher one cannot uniquely identify the element.

| # | Locator | When to use | Example |
|---|---------|-------------|---------|
| 1 | `getByRole()` | Element has a semantic role + accessible name | `page.getByRole('button', { name: 'Login' })` |
| 2 | `getByLabel()` | Form field associated with a visible `<label>` | `page.getByLabel('Username')` |
| 3 | `getByTestId()` | App exposes a stable `data-testid` | `page.getByTestId('save-btn')` |
| 4 | `getByText()` | Static visible text, no role/label/testid | `page.getByText('Forgot your password?', { exact: true })` |
| 5 | CSS attribute selector | Last resort — prefer stable attributes over volatile class names | `page.locator('[data-id="save"]')` |

Use `{ exact: true }` with `getByText()` to avoid partial matches.

## Forbidden — never use

| Forbidden | Why | Do instead |
|-----------|-----|------------|
| **XPath** (`//div[...]`) | Brittle, couples tests to DOM shape, unreadable | Use a role/label/testid locator |
| **`nth()`** | Index-based; breaks when order or count changes | Narrow with a `name`, or **scope** to a parent container |
| **`first()`** | Hides a strict-mode ambiguity instead of resolving it | Make the locator unique with role + name + scope |

## Resolving ambiguity (scoping vs. index)

When a locator matches multiple elements, **scope to a parent**, don't pick by index:

```typescript
// ❌ forbidden — index based
page.getByRole('textbox').nth(1)

// ✅ scope to the form row that contains the field, then find the message
page.locator('.oxd-form-row', { hasText: 'Password' })
    .getByText('Required')
```

Prefer `{ name: ... }` filters, `hasText`, and `.filter()` to disambiguate.

## Notes

- Locators are declared once as `readonly` properties — see [page-object-standards.md](page-object-standards.md).
- When a test fails with `strict mode violation` / `resolved to N elements`, that is a
  **LOC** failure — narrow the locator per this doc. See [failure-healing.md](failure-healing.md).
- `docs/qa-config.yaml` `locator_strategy` mirrors this priority/forbidden list for
  tool-agnostic config; this document is the human-readable canonical explanation.

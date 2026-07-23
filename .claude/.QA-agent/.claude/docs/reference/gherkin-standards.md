# Gherkin Standards — Canonical Standard

> **Single source of truth** for `.feature` files, used by lanes with `style: bdd-gherkin`
> (`docs/qa-config.yaml` → the lane's `feature_dir`; see [lane-styles.md](lane-styles.md)).
> Step implementation rules live in [step-definition-standards.md](step-definition-standards.md);
> coverage rules in [coverage-matrix.md](coverage-matrix.md).

## File location

```
{lane.feature_dir}/{Module}/userstory_{workItemId}_{kebab-case-title}.feature
```

If there is no ADO ID: `{lane.feature_dir}/{Module}/{kebab-case-title}.feature`

## File header (mandatory)

```gherkin
# ADO Work Item: {ADO URL or N/A}
# Generated: {ISO date}
# Coverage Matrix:
# | AC Item                | Scenario # | Tags  | Status |
# |------------------------|------------|-------|--------|
# | AC 1.1 - {description} | 1.1        | @mod  | ✅     |

@{module}
Feature: [{display_name}] {Feature Name}
  As a {role}
  I want {capability}
  So that {business value}
```

## Scenario rules

- **One scenario per acceptance criterion** — never merge multiple ACs into one scenario.
- **Number scenarios to match the AC**: `Scenario: 1.1 - {description}`.
- Use `Background:` for steps shared across **3+** scenarios.
- **Tags**: `@{module}` on the feature; `@smoke` on the critical happy-path scenario.
- **Active voice**: "the user clicks" — not "click".
- **Quote exact UI text**: `"Required"`, `"Invalid credentials"`.
- Use `And` for sequential steps within the same phase.

## Negative scenarios — include only when

- Explicitly stated in the acceptance criteria, **or**
- A critical security / access-control requirement, **or**
- A data-isolation requirement.

**Never** add generic "invalid input", network failures, or browser quirks.

## Forbidden in Gherkin steps

- CSS selectors (`#submit-btn`, `.error-msg`)
- Index-based references ("the first button")
- Implementation details ("waits 5 seconds", "calls the API")

## Allowed step patterns

```gherkin
Given the user is on the {page name} page
When the user enters "{value}" in the {field name} field
When the user clicks the {button name} button
When the user selects "{option}" from the {dropdown name} dropdown
Then the user is redirected to the {page/url}
Then the error message "{exact text}" is displayed
Then the {field name} displays "{message}"
```

## Optimization pass

After generating (or when given an existing `.feature` file), review and fix:

| Issue | Fix |
|-------|-----|
| Duplicate steps across scenarios | Extract to `Background:` |
| Implementation leaking into steps | Rephrase to business language |
| Scenario testing multiple ACs | Split into separate scenarios |
| Missing `@smoke` on critical happy path | Add the tag |
| Missing or wrong AC numbers | Align with the coverage matrix |
| Inconsistent step phrasing | Normalize — one phrasing per concept |
| Steps never reused elsewhere | Keep as-is — still valid |

**Optimization must not change coverage** — every scenario survives. Report the result:

```
GHERKIN OPTIMIZATION
─────────────────────────────────────────
Extracted to Background: {n} steps
Rephrased (implementation removed): {n} steps
Split scenarios: {n}
Tags added/corrected: {list}
Coverage unchanged: {n}/{total} scenarios
```

# Lane Styles — canonical profiles

> **Single source of truth** for what a lane's `style` means. `/qa-lane` reads
> `lanes.<name>.style` from `docs/qa-config.yaml` and executes the matching profile below.
> The lane **name** is a free purpose label (e.g. `regression`, `acceptance`, `checkout`) —
> it never decides the pipeline. Only `style` does.

A lane declares exactly one `style`:

| style | Authoring | Uses POM (page objects) |
|-------|-----------|-------------------------|
| `pom-spec` | Playwright spec files, Arrange-Act-Assert | yes |
| `bdd-gherkin` | Gherkin `.feature` files + step definitions | yes |
| `api-request` | Playwright `request` fixture, no browser | no |

**Design pattern vs authoring style.** POM (page objects) is a *design pattern*, orthogonal
to the authoring style. Both `pom-spec` and `bdd-gherkin` build on the **shared**
`automation.page_object_dir`; `api-request` uses no page objects. POM is the only design
pattern the toolkit supports today.

---

## Profile: `pom-spec`

- **Required config fields:** `lanes.<name>.test_dir`, `automation.page_object_dir`.
- **Optional:** `fixture_file`, `smoke_command`.
- **Skills:** `page-object-authoring`, `spec-authoring`, `locator-strategy` (+ `ado-fetch`,
  `coverage-matrix`, `failure-healing`).
- **Coverage-matrix format:** `AC | Test ID | Assertion | Status`.
- **Pipeline:** context load → ADO fetch → coverage matrix (**CP-AC**) → page objects → spec
  files → run → heal (**CP-4**) → review (**CP-3**) → wave complete.
- **Owned zone (isolation):** the lane's `test_dir`. Editable shared zone:
  `automation.page_object_dir`.

## Profile: `bdd-gherkin`

- **Required config fields:** `lanes.<name>.feature_dir`, `step_dir`, `generated_dir`,
  `gen_command`, `automation.page_object_dir`, and `automation.bdd_framework` (import pattern
  for step files).
- **Optional:** `smoke_command`.
- **Skills:** `gherkin-authoring`, `page-object-authoring`, `locator-strategy` (+ `ado-fetch`,
  `coverage-matrix`, `failure-healing`).
- **Coverage-matrix format:** `AC | Scenario # | Tags | Status`.
- **Pipeline:** context load → ADO fetch → coverage matrix (**CP-AC**) → Gherkin (generate +
  optimize) → page objects → step definitions → coverage check (no MISSING steps) →
  `gen_command` + run → heal (**CP-4**) → review (**CP-3**) → wave complete.
- **Owned zone (isolation):** the lane's `feature_dir` and `step_dir`. Editable shared zone:
  `automation.page_object_dir`.

## Profile: `api-request`

- **Required config fields:** `lanes.<name>.test_dir`, `helper_dir`, `base_url_env_var`.
- **Optional:** `openapi_spec`, `smoke_command`.
- **Skills:** `api-testing`, `test-data` (+ `ado-fetch`, `coverage-matrix`,
  `failure-healing`).
- **Coverage-matrix format:** `AC | Test ID | Endpoint | Assertion | Status`.
- **Pipeline:** context load → ADO fetch → coverage matrix (**CP-AC**, incl. negative/auth
  cases) → API specs (`request` fixture) → run → heal (**CP-4**) → review (**CP-3**) → wave
  complete. A contract mismatch escalates as a potential app bug (CP-5), never a weakened
  assertion.
- **Owned zone (isolation):** the lane's `test_dir`. **No page objects** — never uses
  `automation.page_object_dir` or UI fixtures.

---

## Isolation rule (derived from style, never from the lane name)

A lane may edit **its own owned zone** and the **shared** `automation.page_object_dir` (unless
its style is `api-request`, which uses no page objects). A lane must **never** edit another
lane's owned zone. `/qa-lane` computes the forbidden zones dynamically from the `style` of
every enabled lane — there are no hardcoded lane-name exceptions.

## Notes

- `smoke` is not a style or a lane — it is the `@smoke`-tagged subset of a lane, run via its
  `smoke_command`.
- Multiple lanes may share the same style (e.g. two `pom-spec` lanes with different
  `test_dir`s). Each still owns only its own zone.
- The path-field names (`test_dir`, `feature_dir`, …) are read as-is from the lane; the
  standards docs (`spec-authoring-aaa.md`, `gherkin-standards.md`, `step-definition-standards.md`,
  `page-object-standards.md`, `api-testing.md`) resolve their paths from the lane that carries
  the relevant style.

# Test Data — Canonical Standard

> **Single source of truth** for the full lifecycle of test data: generation,
> provisioning, isolation between parallel runs, PII anonymization, credential
> sourcing, and guaranteed cleanup. This is the **only** lane that creates,
> modifies, or deletes data — build, healing, and run lanes never touch data
> directly. Stack-neutral: strategy and DB client are read from `docs/qa-config.yaml`.

## Config it reads (`docs/qa-config.yaml` → `test_data`, `cicd`, `stack`)

| Field | Use |
|-------|-----|
| `test_data.mode` | synthetic / anonymized / mixed strategy |
| `test_data.isolation_strategy` | maps test type → rollback / prefix / reset |
| `test_data.has_pii` | gates the anonymization requirement |
| `test_data.pii_fields` | which fields must be anonymized |
| `test_data.cleanup_policy` | after_each / after_suite / scheduled |
| `test_data.credential_source` | where auth tokens are read from |
| `test_data.tenant_prefix_pattern` | template for unique run prefixes |
| `cicd.environments` | environment-safety guard before any write |
| `stack.db_type` | selects the correct DB client for rollback |

## Request types

- **init** — once at pipeline start: set up the strategy for the project.
- **provision** — per suite: create the data each test case declares it needs
  (entities, counts, states, relations, overrides), keyed to the test-design
  data requirements.
- **cleanup** — after the suite (or per the `cleanup_policy`): tear down every
  entity this run created. Cleanup runs **regardless of pass or fail**.
- **reproduce** — on request from the healing lane: recreate the exact data state
  of a failing test so the failure can be diagnosed deterministically.

## Isolation

Apply the `isolation_strategy` for the test type: tenant-prefix every record with
`tenant_prefix_pattern` for E2E, transaction-rollback for API, full-reset only on
dedicated CI environments. Parallel runs must never collide on shared records.

## PII — CP-PII gate

If `test_data.has_pii` is true and `pii_anonymization_approved` is false, **block**
and gate to HITL (**CP-PII**) before any data that could contain the `pii_fields`
is generated or loaded. Real production PII / real payment data must never enter a
test environment. Synthetic equivalents only.

## Environment-safety guard

Before any write/reset, confirm the target environment in `cicd.environments`
allows that operation (`allowed_operations`) and is not production-like. Abort on
a production-like target.

## Guardrails

- **Only this lane mutates data.** Other lanes request data; they never create it.
- **Cleanup always runs** — even after failures, even if the run is aborted.
- **Never load real PII or real payment credentials** into a test environment.
- **Never write to a production-like environment.**
- Every provisioned entity is tracked so cleanup can guarantee removal.

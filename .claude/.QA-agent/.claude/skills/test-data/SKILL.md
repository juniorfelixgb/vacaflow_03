---
name: test-data
description: Managing the lifecycle of test data — generation, provisioning, isolation, PII anonymization, credential sourcing, and cleanup. Use whenever a test needs data created/provisioned/reset, when a run needs setup or teardown, or when reproducing a failure's data state. The only lane that creates, modifies, or deletes data.
---

# Test Data

The canonical rules live in **[.claude/docs/reference/test-data.md](../../docs/reference/test-data.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Read `test_data.*` (mode, isolation_strategy, has_pii, pii_fields, cleanup_policy, credential_source, tenant_prefix_pattern), `cicd.environments`, and `stack.db_type` from `docs/qa-config.yaml`. Never hardcode.
- Apply the isolation strategy per test type (tenant-prefix / transaction-rollback / full-reset). Parallel runs must not collide. **Cleanup always runs**, pass or fail.
- If `has_pii` is true and not yet approved, **block at CP-PII** — never load real PII or real payment data into a test environment; use synthetic equivalents.
- Run the environment-safety guard before any write/reset; abort on a production-like target. Other lanes request data — only this one mutates it.

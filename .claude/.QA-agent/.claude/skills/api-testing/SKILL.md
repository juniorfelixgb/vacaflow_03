---
name: api-testing
description: Writing or fixing API test specs with Playwright's request fixture (APIRequestContext). Use when testing an endpoint, REST API, request/response contract, response schema, status codes, or error bodies — or when an AC mentions an API call rather than UI behavior. Enforces AAA, one-AC-per-test, env-var base URLs, and contract-first assertions.
---

# API Testing

The canonical rules live in **[.claude/docs/reference/api-testing.md](../../docs/reference/api-testing.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Find the lane with `style: api-request` in `docs/qa-config.yaml` and read its fields (test_dir, helper_dir, base_url_env_var, run_command). If no enabled lane has that style, stop and suggest enabling one via `/qa-setup`.
- Build the coverage matrix first (`coverage-matrix` rules; format `AC | Test ID | Endpoint | Assertion | Status`) — including the negative/auth cases the standard lists.
- Assert status → schema/contract → business values → side effects, in that order. Error responses get contract assertions too.
- Reuse helpers from `lanes.api.helper_dir` (auth, headers, payload factories) before writing new ones. Test data follows the `test-data` rules (isolation, cleanup, no PII).

# API Testing — Canonical Standard

> **Single source of truth** for API test specs in the API lane. Written for Playwright's
> built-in `request` fixture (no extra HTTP library). All paths, base URLs, and commands
> come from `docs/qa-config.yaml` (`lanes.api`) and `.env` — never hardcoded.

## File shape

- One spec file per resource/endpoint group: `{resource}.api.spec.ts` in
  `lanes.api.test_dir`.
- Use the `request` fixture (`APIRequestContext`) — UI fixtures and page objects are
  **not** used in this lane.
- Base URL from `process.env.{lanes.api.base_url_env_var}`; auth tokens/credentials from
  env vars or the credential sets in `src/test-data`. **Never** inline a URL, token, or
  credential.
- Shared helpers (auth token retrieval, common headers) live in
  `lanes.api.helper_dir` — reuse before creating.

## Test shape (AAA, one AC per test)

```ts
test('TC-API-03: POST /users returns 400 when email is missing @api', async ({ request }) => {
  // Arrange — build the payload (factory/builder from test-data; no PII)
  const payload = userPayload({ email: undefined });

  // Act — single request under test
  const response = await request.post(`${baseUrl}/users`, { data: payload });

  // Assert — status first, then body
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.errors).toContainEqual(expect.objectContaining({ field: 'email' }));
});
```

- **One AC item per `test()`** — same coverage rule as the UI lanes; the coverage matrix
  uses `AC | Test ID | Endpoint | Assertion | Status`.
- Tests are independent: create what you need, clean up what you create (`test-data`
  rules apply — isolation, cleanup policy, no PII).
- Tag `@api` on all; `@smoke` on the critical happy paths only.

## Assertions — strongest first

1. **Status code** — exact (`toBe(201)`), never ranges or `ok()` when the AC names a code.
2. **Response schema/contract** — validate required fields and types. If the project has
   an OpenAPI spec (`lanes.api.openapi_spec`), validate against it; otherwise assert the
   shape explicitly (`expect(body).toMatchObject(...)` / explicit field checks).
3. **Business values** — the specific values the AC promises.
4. **Side effects** when the AC requires them — verify with a follow-up GET, not by
   trusting the write response.

Error-path tests assert **both** the status and the error body shape — an error contract
is still a contract.

## Negative & edge coverage

For every endpoint under test, the matrix must consider (include when the AC or risk
warrants): missing/invalid required fields, wrong auth (401) and wrong permissions (403),
not-found ids (404), and duplicate/conflict cases (409). Don't invent ACs — raise
uncovered risks as questions at the coverage gate (CP-AC).

## Forbidden

- Hardcoded URLs, tokens, credentials, tenant ids.
- Sleeps/fixed waits between requests; poll with `expect.poll()` when eventual
  consistency is real.
- Chained tests that depend on a previous test's data.
- Weakening an assertion to make a contract mismatch pass — a contract mismatch is a
  finding, not a flake (CP-5 bug-proposal flow in `cicd.md` applies).

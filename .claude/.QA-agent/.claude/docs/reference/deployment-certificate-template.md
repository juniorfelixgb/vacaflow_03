# Deployment / Hotfix QA Certificate — Canonical Template

> **Single source of truth** for the concise **QA sign-off certificate** that clears a **hotfix** or a
> **release deployment** for production. It complements `test-report-template.md` (the long,
> evidence-heavy test summary) and `/qa-release-report`'s metrics report: this certificate is the short,
> stakeholder-facing document that states *what was fixed, what was tested, and whether QA approves*.
>
> **Agnostic by contract:** this template holds **no project, org, ID, or path**. Every project-specific
> value comes from `docs/qa-config.yaml` (`project_identity.ado_organization`, `project_identity.ado_project`,
> `project_identity.display_name`) or is asked from the user. Keep it copy-paste portable across projects.
>
> **Never invent a value** — every result cites its evidence (ADO suite/TC, bug id); missing data is written
> as `NO DATA` and treated as a risk, never guessed.

---

## When to use which variant

Same structure, only the header line changes:

- **Hotfix** — a targeted fix deployed out of the normal release train. Title: `Quality Assurance (QA) Certificate` with `**Type:** Hotfix`.
- **Release Deployment** — a planned release/version going to production. Title: `Quality Assurance (QA) Certificate` with `**Type:** Release Deployment`.

## Recommended structure

```
Quality Assurance (QA) Certificate
----------------------------------

**Product:** {display_name from qa-config.yaml}
**Type:** Hotfix | Release Deployment
**Module:** {module / feature under test}
**QA Status:** **APPROVED** | **APPROVED WITH CONDITIONS** | **NOT APPROVED**
**Environment(s):** {environments validated, e.g. "QA + STG validated → authorizes PROD"}
**Certification Date:** {date}

> **QA**
> One plain-English paragraph: what was fixed/changed, what was tested, the outcome
> (pass counts, zero/known defects), and the recommendation. Risks first, never buried.

### Bugs Addressed / Scope

| Bug/WI ID | Title | Status |
| --- | --- | --- |
| [{id}]({ado_workitem_url}) | {title} | ✅ Resolved / ⚠️ Deferred |

(For a release deployment, list the User Stories / PBIs in scope instead of only bugs.)

### Test Execution Summary

| ID | Test Scenario / Step | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **TC-01** ({ado tc id}) | {scenario} | {expected} | {actual} | **Pass** / **Fail** / **Blocked** |

Executed in {environments} on {date} via ADO suite [{suite id}]({suite_url}).

### Regression Testing & Conclusion

*   **Environment Coverage:** {which environments were validated; if PROD relies on parity, say so}.
*   **Regression Testing:** {result — e.g. "negative paths still correct; zero new defects" or "{n} deferred"}.
*   **Root Cause:** {documented cause, or "not documented — residual risk" + recommended follow-up}.
*   **Exit Criteria:** {e.g. "0 Critical/Major open; N/N TCs Pass; stable and ready for production"}.

### Evidence Repository

{Where evidence lives: ADO suite/TC executions (screenshots), repo test-case files, run artifacts.}

**Certified by:**

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| QA | {qa name} | Approved | {date} |
| Release Manager |  |  |  |
```

## Quality bar

- **QA Status is explicit** and one of `APPROVED` / `APPROVED WITH CONDITIONS` / `NOT APPROVED`. The status
  is advisory input to the human gate (**CP-SIGNOFF**), never auto-decided.
- **Every number traces to evidence** — pass/fail counts, build version, test count each cite an ADO
  artifact or repo file. No source → `NO DATA`, treated as a risk.
- **Environments are named.** If production is not exercised pre-release (typical hotfix), state that PROD
  relies on environment parity and add a monitoring follow-up.
- **Bugs/PBIs are linked** to their work items (URL built from `ado_organization` + `ado_project` in config).
  Deferred defects list their PO acceptance.
- **Root cause**: if unknown/undocumented, call it out explicitly as a residual risk — do not omit it.
- **Failures and risks lead**; approvals follow. The certificate is self-sufficient: a reader who sees
  nothing else understands what shipped and why QA signed (or did not).

## Output & sign-off

- Chat blocks follow `output-style.md`. The formal gate is **CP-SIGNOFF** (see `output-style.md` /
  `hitl-workflow.md`) — present it, wait for the human decision, and record it in the **Certified by** table.
- Write the file to `docs/release-reports/{date}-{hotfix|release}-{id}-{slug}.md`.

## Publishing to the ADO wiki (optional, agnostic)

If the user wants the certificate in the ADO wiki:

- Read `ado_organization` / `ado_project` from `docs/qa-config.yaml`. **Do not hardcode** the org, project,
  or a `wikiId`.
- **Discover the wiki dynamically**: `GET .../{project}/_apis/wiki/wikis` → use the project wiki's id.
- Parent page defaults to `/Releases`; if `wiki.releases_path` is set in `qa-config.yaml`, use that; otherwise
  confirm the path with the user.
- Create the certificate as a sub-page (mirror the project's existing Release/Hot Fix Note pattern). Updating
  an existing page requires the `If-Match` ETag from a prior `GET`.

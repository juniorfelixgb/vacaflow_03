# Bug Report — Canonical Standard

> **Single source of truth** for bug reports, whether raised manually (exploratory or
> scripted execution) or proposed from a classified CI failure (the **CP-5** flow in
> [cicd.md](cicd.md) uses this same format). A bug report is always **proposed to the
> human for approval before being created** in the tracker.

## Format

```markdown
# BUG: {one-line summary — observed behavior, not the suspected cause}

| Field | Value |
|---|---|
| Severity | S1 / S2 / S3 / S4 (see definitions) |
| Priority | P1 / P2 / P3 (team's call — default = severity) |
| Environment | {env name + URL env-var, browser/device, build/version if known} |
| Found by | {manual execution / exploratory session / CI run id} |
| Related AC / TC | {ids, if any} |

## Steps to reproduce
1. {minimal numbered steps from a clean state — fewest steps that still reproduce}

## Expected
{what should happen — cite the AC or standard that says so}

## Actual
{what happens instead — exact messages, codes, values}

## Evidence
- {screenshot/video paths, response bodies, log excerpts — at least one is mandatory}

## Notes
- Reproducibility: always / intermittent ({n} of {m} tries)
- {workaround, suspected scope, first seen}
```

## Severity definitions

| Severity | Meaning (plain English) |
|---|---|
| **S1 — Critical** | Blocks a core flow or corrupts/leaks data; no workaround |
| **S2 — Major** | A main feature is wrong or unusable; workaround exists but costly |
| **S3 — Minor** | Feature works with annoying defects (validation, layout breaking flow) |
| **S4 — Trivial** | Cosmetic; no functional impact |

## Rules

- **Reproduce before reporting**: confirm the steps at least twice; if intermittent, say
  so with the observed rate — never report a one-off without marking it intermittent.
- One bug per report — different root symptoms are different reports.
- Summary states the **observed behavior** ("Saving a user with a duplicate email returns
  500"), never a guess at the fix.
- Evidence is mandatory; PII rules from [test-data.md](test-data.md) apply to every
  attachment (mask real personal data).
- Check for duplicates in the tracker before proposing; link, don't duplicate.
- If the bug was found by a test, reference the TC and **never weaken the test** to make
  it pass — the failing assertion is the evidence.
- Tracker target comes from config: ADO when `ado_organization` is set in
  `docs/qa-config.yaml` (work item type Bug), otherwise propose the markdown above for
  manual filing.

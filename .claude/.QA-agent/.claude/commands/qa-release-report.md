---
description: Produce a release quality report OR a hotfix/deployment QA certificate, and run the sign-off checkpoint (CP-SIGNOFF)
argument-hint: "[release/sprint name] | certificate|cert|hotfix|deployment [bug/PBI id or label]"
---

# QA Release Report — Sign-off Agent

You produce the **release quality report** (default) or a **hotfix/deployment QA certificate**
(certificate mode), and run the human sign-off gate. You aggregate and report only — you never
modify tests, code, or config.

Arguments: $ARGUMENTS

## Mode detection

Look at the **first token** of the arguments:

- `certificate` · `cert` · `hotfix` · `deployment` → **Certificate mode** (see its workflow below).
  The token also sets the sub-type: `hotfix` → Hotfix, `deployment`/`certificate`/`cert` → Release
  Deployment. The remaining arguments are the bug/PBI id(s) or a release label.
- anything else (a release/sprint name) or empty → **Release-report mode** (the default workflow below).

---

## Startup

Read `docs/qa-config.yaml` (`project_identity`, lanes + `report_command`s, `quality_gates`,
`agents_config` thresholds, `cicd.pr_gates`, `meta.project_id`). If the contract sections are
missing → stop: "Run /qa-setup first (CP-1)."
Release-report mode only: `metrics` must be in `agents_config.enabled_agents` — otherwise stop and
say why. Certificate mode does not require `metrics`.

## Knowledge

| Topic | Skill | Canonical reference |
|-------|-------|---------------------|
| Quality aggregation, trends, flakiness | `metrics` | `.claude/docs/reference/metrics.md` |
| Bug format (open-defect listing) | `bug-reporting` | `.claude/docs/reference/bug-report-standard.md` |
| Hotfix / deployment certificate | — | `.claude/docs/reference/deployment-certificate-template.md` |
| Work item / bug fetch (certificate mode) | `ado-fetch` | `.claude/docs/reference/ado-integration.md` |
| Chat output blocks | — | `.claude/docs/reference/output-style.md` |

## Workflow — Release-report mode (default; orchestration only)

1. **GATHER** — apply `metrics`: aggregate the latest run artifacts from every enabled
   lane (pass rate, AC coverage, flakiness, mutation score where gated, heal rate),
   plus open escalations (`logs/qa-loop/*/phase3-healing.md` ESCALATION blocks) and
   known open bugs (ask the user or query ADO if configured). Cite the source artifact
   for every number — never invent a metric; mark unavailable data as "no data".
2. **ASSESS** — compare each metric against its threshold (`quality_gates`,
   `agents_config`). Compute the overall recommendation: **GO** (all gates ✅),
   **GO WITH RISKS** (⚠️ only — list each risk), **NO-GO** (any ❌). The recommendation
   is advisory — the human decides.
3. **REPORT** — write `docs/release-reports/{date}-{release-or-sprint}.md` with two
   sections:
   - **Executive summary** (for stakeholders, plain English, no jargon): one-paragraph
     verdict, the gates table with Meaning column, top risks in business terms.
   - **Technical appendix**: per-lane results, flakiness/mutation detail, escalations,
     open bugs by severity, links to run artifacts and logs.
4. **CP-SIGNOFF** — present the CHECKPOINT block below and **wait**. Record the decision
   (who/when/outcome + notes) at the bottom of the report file.

```
── CHECKPOINT CP-SIGNOFF ─────────────────────────────
Decision: Sign off the release "{release}" based on this quality report.
Why it matters: this is the formal QA go/no-go — it is recorded in the
report and is what the team points to after the release.

{gates table + recommendation}

Options:
  APPROVE          → record sign-off as GO, finalize the report
  APPROVE WITH RISKS: {notes} → record GO-WITH-RISKS + your notes
  REJECT: {notes}  → record NO-GO; report stays as evidence of why
  STOP             → end without recording a decision
──────────────────────────────────────────────────────
```

## Workflow — Certificate mode (hotfix / deployment; orchestration only)

Produces the concise QA sign-off certificate instead of the metrics report. The certificate
**structure and quality bar live in `.claude/docs/reference/deployment-certificate-template.md`** —
read it and apply it, do not restate it here.

1. **GATHER** — identify the bug(s)/PBI(s) in scope: use `ado-fetch` (per `ado-integration.md`) with the
   id(s) from the arguments, or ask the user. Collect test-execution evidence: environments validated,
   test cases + pass/fail/blocked (from an ADO test suite if given, or from the user), deferred defects.
   Cite the source for every result; missing data is `NO DATA`, never invented.
2. **BUILD** — assemble the certificate applying the template (Hotfix vs Release Deployment header per the
   mode token). Pull `display_name`, `ado_organization`, `ado_project` from `docs/qa-config.yaml`; build
   work-item/suite links from them. Never hardcode project specifics.
3. **CP-SIGNOFF** — present the same CHECKPOINT block above and **wait**. Record the decision in the
   certificate's **Certified by** table (QA Status + who/when/notes).
4. **WRITE** — `docs/release-reports/{date}-{hotfix|release}-{id}-{slug}.md`.
5. **PUBLISH (optional)** — offer to publish to the ADO wiki under `/Releases` (or `wiki.releases_path`
   from config): derive org/project from config, **discover the wiki via REST** (`/wiki/wikis`), and create
   the certificate as a sub-page mirroring the project's Release/Hot Fix Note pattern. Never hardcode a wikiId.

## Output contract

All chat output follows `.claude/docs/reference/output-style.md` (STATUS per phase,
the CP-SIGNOFF CHECKPOINT above, END-OF-RUN SUMMARY pointing at the report/certificate file).

## Guardrails

- Read and aggregate only — never modify tests, code, thresholds, or the contract.
- Never compute a recommendation from missing data — "no data" is reported as a risk.
- The sign-off decision is always human (CP-SIGNOFF) — never auto-approve, never default.
- Failures and NO-GO risks appear first in every block — never buried.

## Next steps

- `/qa-orchestrator` — route follow-up work on the risks found
- `/qa-lane {name}` — close coverage gaps listed in the report (pipeline chosen by the lane's style)

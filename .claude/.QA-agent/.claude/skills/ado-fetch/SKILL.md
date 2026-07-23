---
name: ado-fetch
description: Fetching Azure DevOps work items (acceptance criteria) via REST. Use when the input is an ADO work item ID, when AZURE_DEVOPS_PAT / ado_organization / ado_project need validating, or when extracting Title/Description/AC/Tags from a work item. Falls back to asking for manual AC when ADO is unconfigured.
---

# ADO Fetch

The canonical procedure lives in **[.claude/docs/reference/ado-integration.md](../../docs/reference/ado-integration.md)**. Read it and apply it — do not restate or invent steps here.

How to apply in this repo:
- Read `ado_organization` / `ado_project` from `docs/qa-config.yaml`; read the PAT from `.env` (`AZURE_DEVOPS_PAT`). If org/project blank or PAT missing → stop and ask for the AC manually.
- Use the canonical PowerShell `Invoke-RestMethod` snippet; save JSON to `test-results/` (or the qa-loop log dir).
- Extract Title, Description, AC (Given/When/Then), Tags, Parent ID. If there's no AC, ask the user — never invent acceptance criteria. Hand the AC to [coverage-matrix].

# Azure DevOps Integration — Canonical Standard

> **Single source of truth** for fetching ADO work items (acceptance criteria) via REST.
> Org/project come from `docs/qa-config.yaml` → `project_identity`; the PAT comes from
> `.env` → `AZURE_DEVOPS_PAT`. Sensitive values live only in `.env`.

## 1. Validate ADO configuration

Check `project_identity.ado_organization` and `project_identity.ado_project` in the yaml.
If either is blank, do **not** attempt a fetch — ask for the AC manually:

```
ADO NOT CONFIGURED
─────────────────────────────────────────
ado_organization and/or ado_project are not set in docs/qa-config.yaml.
Please either:
  - Set them in docs/qa-config.yaml
  - Or paste the acceptance criteria directly
```

## 2. Validate the PAT

```powershell
$pat = $env:AZURE_DEVOPS_PAT
if (-not $pat) {
    Write-Host "AZURE_DEVOPS_PAT is not set. Please add it to your .env file."
    Write-Host "Get it from: Azure DevOps → User Settings → Personal Access Tokens"
    exit
}
```

## 3. Fetch the work item

```powershell
$org      = "{ado_organization}"   # from docs/qa-config.yaml
$project  = "{ado_project}"        # from docs/qa-config.yaml
$id       = {work_item_id}
$pat      = $env:AZURE_DEVOPS_PAT

$uri     = "https://dev.azure.com/$org/$project/_apis/wit/workitems/$($id)?api-version=7.1"
$headers = @{ Authorization = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$pat")) }
$item    = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers
$item | ConvertTo-Json -Depth 10 | Out-File "test-results/ado-workitem-$id.json"
```

> When running inside `/qa-loop`, write the JSON to the loop log directory instead:
> `logs/qa-loop/{date}-{id}/ado-workitem.json`.

## 4. Extract fields

Extract: **Title, Description, Acceptance Criteria** (Given/When/Then preferred), **Tags,
Parent ID**.

## 5. No-AC fallback

If the work item has **no acceptance criteria**, stop and ask the user to provide them
before continuing. Never invent acceptance criteria.

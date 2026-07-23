# validate-toolkit.ps1 — static consistency checks for the QA agent toolkit.
# Run from the repo root:  powershell -File scripts\validate-toolkit.ps1
# Exit code 0 = all checks pass; 1 = failures (listed in output).
# Level 1 of docs/AGENT-TEST-PLAN.md — run before every toolkit commit.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$failures = @()
$checks = 0

function Check([string]$name, [scriptblock]$body) {
    $script:checks++
    try {
        $problems = & $body
        if ($problems) {
            $script:failures += ("[$name] " + (($problems | ForEach-Object { "$_" }) -join "; "))
            Write-Host "  X  $name" -ForegroundColor Red
        } else {
            Write-Host "  OK $name" -ForegroundColor Green
        }
    } catch {
        $script:failures += ("[$name] check crashed: " + $_.Exception.Message)
        Write-Host "  X  $name (crashed)" -ForegroundColor Red
    }
}

Write-Host "QA Toolkit static validation" -ForegroundColor Cyan

Check "qa-config template exists and legacy templates are gone" {
    $problems = @()
    if (-not (Test-Path .claude\qa-config.yaml)) { $problems += 'missing .claude\qa-config.yaml' }
    if (Test-Path .claude\project.yaml) { $problems += 'legacy .claude\project.yaml still present' }
    if (Test-Path .claude\arch-contract.json) { $problems += 'legacy .claude\arch-contract.json still present' }
    $problems
}

Check "reference paths are unambiguous" {
    Get-ChildItem -Recurse -Include *.md -Path .claude, docs |
        Select-String -Pattern 'docs/reference/' |
        Where-Object {
            $_.Line -notmatch '\.claude/docs/reference/' -and
            $_.Line -notmatch '\.\./\.\./docs/reference/' -and
            $_.Line -notmatch '\.\./docs/reference/' -and
            $_.Line -notmatch "[$([char]0x251C)$([char]0x2514)$([char]0x2502)$([char]0x2190)]"   # tree-diagram / annotation chars: path is contextual
        } | ForEach-Object { $_.Path.Replace("$root\", '') + ":" + $_.LineNumber }
}

Check "every cited reference doc exists" {
    $cited = Get-ChildItem -Recurse -Include *.md -Path .claude, docs |
        Select-String -Pattern 'docs/reference/([a-z0-9-]+\.md)' -AllMatches |
        ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } |
        Sort-Object -Unique
    $cited | Where-Object { -not (Test-Path (".claude\docs\reference\" + $_)) }
}

Check "frontmatter on all commands, skills, agents" {
    $files = @(Get-ChildItem .claude\commands\*.md) + @(Get-ChildItem .claude\agents\*.md) + @(Get-ChildItem .claude\skills\*\SKILL.md)
    $files | Where-Object { (Get-Content $_.FullName -TotalCount 1) -ne '---' } |
        ForEach-Object { $_.FullName.Replace("$root\", '') }
}

Check "every skill cited in a command exists" {
    $skillDirs = (Get-ChildItem .claude\skills -Directory).Name
    $citedSkills = Get-ChildItem .claude\commands\*.md |
        Select-String -Pattern '`([a-z][a-z-]+)`' -AllMatches |
        ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } |
        Sort-Object -Unique |
        Where-Object { $_ -match '^(ado-fetch|api-testing|bug-reporting|cicd|clean-code|coverage-matrix|failure-healing|gherkin-authoring|locator-strategy|manual-test-design|metrics|observability|page-object-authoring|reviewer|security-accessibility|spec-authoring|test-data)$' }
    $citedSkills | Where-Object { $skillDirs -notcontains $_ }
}

Check "checkpoint ids used are defined in qa-orchestrator HITL table" {
    $defined = Select-String -Path .claude\commands\qa-orchestrator.md -Pattern '\*\*(CP-[A-Z0-9-]+)\*\*' -AllMatches |
        ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    $used = Get-ChildItem -Recurse -Include *.md -Path .claude |
        Select-String -Pattern '\b(CP-(?:1|3|4|5|6|AC|PII|CLEAN|CANARY|SIGNOFF))\b' -AllMatches |
        ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    $used | Where-Object { $defined -notcontains $_ }
}

Check "settings.json has no absolute paths" {
    Select-String -Path .claude\settings.json -Pattern 'c:\\\\|C:/' |
        ForEach-Object { "line " + $_.LineNumber }
}

Check ".gitignore covers settings.local.json" {
    if (-not (Select-String -Path .gitignore -Pattern 'settings\.local\.json')) { "missing entry" }
}

Check "qa-setup.md stays under 150 lines" {
    $n = (Get-Content .claude\commands\qa-setup.md).Count
    if ($n -gt 150) { "$n lines" }
}

Check "no legacy / skills_lh mentions" {
    Get-ChildItem -Recurse -Include *.md,*.yaml,*.json -Path .claude, docs |
        Select-String -Pattern 'skills_lh|docs/legacy' |
        ForEach-Object { $_.Path.Replace("$root\", '') + ":" + $_.LineNumber }
}

Check "qa-config.yaml template has all sections (lane + contract)" {
    # PowerShell 5.1 has no YAML parser; do a structural sanity check instead.
    $y = Get-Content .claude\qa-config.yaml -Raw
    foreach ($key in 'project_identity:', 'automation:', 'lanes:', 'regression:', 'acceptance:', 'api:', 'environment_variables:', 'quality_gates:', 'locator_strategy:', 'stack:', 'test_strategy:', 'structure:', 'test_data:', 'agents_config:', 'cicd:') {
        if ($y -notmatch [regex]::Escape($key)) { "missing section $key" }
    }
}

Write-Host ""
if ($failures) {
    Write-Host ("FAILED: " + $failures.Count + " of $checks checks") -ForegroundColor Red
    $failures | ForEach-Object { Write-Host ("  - " + $_) -ForegroundColor Red }
    exit 1
} else {
    Write-Host "ALL $checks CHECKS PASSED" -ForegroundColor Green
    exit 0
}

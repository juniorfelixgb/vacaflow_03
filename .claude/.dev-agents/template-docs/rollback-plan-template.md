# Rollback Plan

> **Canonical template** — owned by `.dev-agents/template-docs/`.
> Coder / Bsa may **add, remove, or rename sections** for clarity; note deviations under §1.

## Document Information

- **Plan ID:** RB-[YYYY-MM-DD]-[Feature-Slug]
- **Target change / release:** [name / version / commit range]
- **Owner on-call:** [name / rotation]
- **Created Date:** [YYYY-MM-DD]
- **Linked Implementation Plan:** [path]
- **Linked Risk Assessment:** [path]

---

## 1. Scope

[What this rollback covers and explicitly what it does NOT cover.]

**Notes on template usage:** [Standard | deviations…]

---

## 2. Rollback Triggers

Initiate rollback if **any** of the following is observed within [X minutes/hours] of deployment:

- [ ] Error rate > [threshold] on [endpoint / job]
- [ ] Latency p95 > [threshold] on [endpoint]
- [ ] Critical bug confirmed in production: [description]
- [ ] Data integrity check fails: [check name]
- [ ] Manual go/no-go: [stakeholder] decides to abort

---

## 3. Decision Authority

| Trigger                  | Who decides     | Notification path        |
| ------------------------ | --------------- | ------------------------ |
| Error rate spike         | On-call         | Slack #incident          |
| Data integrity failure   | Tech lead       | Email + Slack            |
| Business / compliance    | Product Owner   | Phone + Email            |

---

## 4. Pre-Rollback Checklist

- [ ] Confirm trigger validated (no false positive)
- [ ] Inform on-call channel + stakeholders
- [ ] Snapshot current state (logs, DB if needed)
- [ ] Identify last known good build / commit: `[sha]`

---

## 5. Rollback Procedure

> Steps are ordered. Stop and reassess if any step fails.

### 5.1 Application rollback

1. [Disable feature flag `<flag-name>` (preferred if available)]
2. [Redeploy previous build via pipeline `<pipeline-name>` to env `<env>`]
3. [Verify health endpoint `<url>` returns 200]

### 5.2 Database rollback (if applicable)

- **Migration to revert:** `[MigrationName]`
- **Command:**
  ```powershell
  [the project's command to roll the database back to [PreviousMigrationName]]
  ```
- **Data preservation:** [Strategy — backup snapshot taken before deploy at … / no destructive changes / restore from `[backup id]`]
- **Reversibility note:** [If migration is destructive, describe forward-fix path instead]

### 5.3 Configuration / feature flag rollback

- [ ] Revert Key Vault secret `[name]` to version `[id]`
- [ ] Toggle feature flag `[flag]` to `off`
- [ ] Revert config map `[name]` to previous revision

### 5.4 Cache / external systems

- [ ] Invalidate cache key `[pattern]`
- [ ] Notify dependent services: [list]

---

## 6. Post-Rollback Verification

- [ ] Smoke tests pass on rolled-back env: `[test set]`
- [ ] Error rate back to baseline
- [ ] Affected users notified
- [ ] Data state validated: `[verification query / job]`

---

## 7. Communication Plan

| Audience              | Channel         | When                                  | Owner    |
| --------------------- | --------------- | ------------------------------------- | -------- |
| Engineering on-call   | Slack           | Immediately on trigger                | On-call  |
| Product Owner         | Email + phone   | Within 15 min                         | Tech lead|
| Customers (if needed) | Status page     | Within 30 min after rollback complete | PO       |

---

## 8. Post-Mortem

- [ ] Incident report opened: `[link]`
- [ ] Root cause analysis scheduled within [X] business days
- [ ] Preventive actions logged into backlog

---

## 9. References

- Implementation plan: [path]
- Risk assessment: [path]
- Related ADRs: [paths]
- Runbooks: [paths]

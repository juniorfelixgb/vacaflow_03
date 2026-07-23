# Database Migration Plan

> **Canonical template** — owned by `.dev-agents/template-docs/`.
> Bsa may **add, remove, or rename sections** as needed; document deviations under §1.

## Document Information

- **Plan ID:** MIG-[YYYY-MM-DD]-[Slug]
- **Author:** BSA Agent
- **Created Date:** [YYYY-MM-DD]
- **Linked User Story / BRD:** [paths]
- **Target Database(s):** [serviceDb | stagingDb | both]
- **Target Environments (in order):** local → dev → staging → prod
- **Migration type:** [Schema | Data | Schema + Data | Cleanup]
- **Reversibility:** [Fully reversible | Forward-fix only | Irreversible — justify]

---

## 1. Context

[Why this migration is required, what business / feature work depends on it.]

**Notes on template usage:** [Standard | deviations…]

---

## 2. Schema Changes

### 2.1 New tables

**Table:** `[TableName]`

| Column          | Type          | Null | Default | Notes                |
| --------------- | ------------- | ---- | ------- | -------------------- |
| Id              | int identity  | no   | —       | PK, clustered        |
| [TenantId]      | int           | no   | —       | FK → [TenantTable].Id |
| …               | …             | …    | …       | …                    |

**Indexes:** [name + columns + clustered/non-clustered + unique?]
**FKs:** [list]
**Multi-tenant filter column:** `[TenantId]` (mandatory for tenant-scoped tables, if the project is multi-tenant)

### 2.2 Modified tables

**Table:** `[ExistingTable]`

- **Add column** `[Name] [type] [null/default]` — [purpose]
- **Modify column** `[Name]` — [change + compatibility note]
- **Drop column** `[Name]` — [justification + impact + replacement strategy]

### 2.3 Dropped tables / views / SPs

- [Name] — [justification + dependents impacted]

---

## 3. Data Migration

### 3.1 Source → target mapping

| Source                                    | Target                            | Transformation              |
| ----------------------------------------- | --------------------------------- | --------------------------- |
| [DB.Schema.SourceTable.Column]            | [DB.Schema.TargetTable.Column]    | [identity / cast / lookup]  |

### 3.2 Backfill strategy

- **Approach:** [batched UPDATE | single transaction | offline ETL | …]
- **Batch size:** [N rows]
- **Estimated row count:** [N]
- **Estimated duration:** [time]
- **Locking / blocking expectations:** [details]

### 3.3 Data validation

- [Row count check: source vs target]
- [Checksum / hash verification on key columns]
- [Domain-rule validation queries]

---

## 4. Multi-Tenant Considerations (mandatory)

- [ ] All new tenant-scoped tables include the tenant filter column as `NOT NULL`
- [ ] All new queries filter by tenant
- [ ] No cross-tenant data introduced by backfill
- [ ] Cleanup / truncate SPs scoped per tenant (no global truncate)

> See `.dev-agents/memory-bank/00-shared/learnings/multitenant-architecture-notes.md`.

---

## 5. Migration Execution Order

1. **Local:** `[the project's command to add a new migration named <Name> to the target migrations project]`
2. **Apply locally:** `[the project's command to apply migrations to the local database]`
3. **Dev:** Pipeline `[name]` → verify smoke tests
4. **Staging:** Pipeline `[name]` → run full regression + UAT
5. **Production:** Approval gate → off-peak window `[time]`

---

## 6. Performance & Capacity

- **Expected index/table size growth:** [MB/GB]
- **Indexes added (read perf gain, write cost):** [list]
- **Long-running script protection:** [resumable, batched, timeout settings]

---

## 7. Rollback Plan

- **Reversible migration?** [yes/no]
- **Down migration tested?** [yes/no]
- **Command:**
  ```powershell
  [the project's command to roll the database back to the previous migration]
  ```
- **Data restore source:** [backup id / point-in-time-restore window]
- **If irreversible:** [Forward-fix migration plan + business risk acknowledged in §11]

> Detailed rollback in: `[docs/.../rollback-plan-...md]`

---

## 8. Testing Strategy

- [ ] Local migration apply + revert tested
- [ ] Migration applied against staging-size dataset
- [ ] Smoke tests post-migration on each env
- [ ] Application code compatible with **both** pre- and post-migration schema for at least one release (zero-downtime)
- [ ] The ORM's model snapshot (if any) regenerated and committed

---

## 9. Observability

- [ ] Migration duration logged
- [ ] Row counts before/after logged
- [ ] Alerts on long-running tx, replication lag, deadlocks

---

## 10. Risks & Mitigations

| ID    | Risk                        | Likelihood | Impact | Mitigation              |
| ----- | --------------------------- | ---------- | ------ | ----------------------- |
| MR-1  | Lock escalation on big table| M          | H      | Batch + low-priority    |
| MR-2  | Down-migration data loss    | L          | H      | Backup + dry run        |

(For wider risks see: `[docs/.../risk-assessment-...md]`)

---

## 11. Approvals

- [ ] DBA review: [name / date]
- [ ] Tech lead approval: [name / date]
- [ ] Product owner aware: [name / date]
- [ ] Change advisory board (if prod): [date]

---

## 12. References

- User Story / BRD: [paths]
- Implementation plan: [path]
- ADRs: [paths]
- Rollback plan: [path]

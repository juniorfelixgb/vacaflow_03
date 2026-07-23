# Risk Assessment

> **Canonical template** — owned by `.dev-agents/template-docs/`.
> Bsa may **add, remove, or rename sections** when scope requires; document deviations under §1.

## Document Information

- **Assessment ID:** RA-[YYYY-MM-DD]-[Feature-Slug]
- **Feature / Change:** [name]
- **Author:** BSA Agent
- **Created Date:** [YYYY-MM-DD]
- **Related User Story / BRD:** [paths or work-tracking platform IDs]
- **Overall Risk Rating:** [Low | Medium | High | Critical]

---

## 1. Context

[2–3 sentences: what is being changed, in what system, blast radius.]

**Notes on template usage:** [Standard | deviations…]

---

## 2. Risk Inventory

| ID    | Risk description | Category | Likelihood (L/M/H) | Impact (L/M/H) | Inherent rating | Owner |
| ----- | ---------------- | -------- | ------------------ | -------------- | --------------- | ----- |
| R-001 | …                | Security | M                  | H              | High            | …     |
| R-002 | …                | Data     | L                  | H              | Medium          | …     |
| R-003 | …                | Performance | M               | M              | Medium          | …     |

**Categories:** Security · Data integrity · Performance · Availability · Compliance / Regulatory · Operational · Business / Reputational · Cost.

---

## 3. Risk Detail

### R-001 [Title]

- **Description:** [What can go wrong]
- **Trigger / scenario:** [When/how it happens]
- **Affected components:** [API / DB / web / …]
- **Likelihood rationale:** [Why L/M/H]
- **Impact rationale:** [Why L/M/H — quantify if possible]
- **Mitigation:** [Preventive measure]
- **Contingency:** [What we do if it materializes]
- **Residual risk after mitigation:** [L/M/H]
- **Monitoring:** [Signal / alert / metric / dashboard]

### R-002 [Title]
[Same structure]

---

## 4. Risk Matrix (visual)

```
Impact ↑
  H |  M  |  H  |  C
  M |  L  |  M  |  H
  L |  L  |  L  |  M
    +-----+-----+-----+
       L     M     H   → Likelihood
```

Place each R-### on the matrix.

---

## 5. Top Risks (top 5 by residual rating)

1. **R-###** — [title] — [residual rating] — [headline mitigation]
2. …

---

## 6. Decisions & Acceptance

- [ ] Risks above tolerated as documented
- [ ] Mitigations approved
- [ ] Contingency triggers approved
- **Approver:** [name / role]
- **Approval date:** [YYYY-MM-DD]

---

## 7. References

- BRD / User Story / Plan: [paths]
- Related ADRs: [paths]
- Rollback plan: [path]

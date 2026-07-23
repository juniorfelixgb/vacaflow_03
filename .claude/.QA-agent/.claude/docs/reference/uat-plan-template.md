# UAT Plan Document Template

> Canonical template for a **User Acceptance Testing plan**. UAT validates business
> intent with business roles — it is not a re-run of system testing. Written by
> `qa-testing-strategy-architect`; QA facilitates, the business accepts. Match the
> target project's document-ID/versioning convention.

---

## Recommended structure

```
# UAT Plan — <Project> <release>

Document ID · Stage · Author · Date · Status · Version
Related: <Test Plan ID>, <functional spec ID>, <governance doc ID>

## 1. Purpose & scope
- What UAT validates for this release and what it explicitly does not re-test
  (system-level verification already covered by the test plan).

## 2. Acceptance basis
- The business outcomes being accepted: key user flows and release-level acceptance
  criteria (cite the functional spec / backlog IDs). UAT scenarios derive from
  business flows, not from individual technical ACs.

## 3. UAT scenarios
- One scenario per business outcome, end to end, in business language:
  ID · scenario name · flow covered · data needed · accepting role.
- Each scenario states the observable business result that means "accepted".

## 4. Participants & roles
- Who executes (business users by role), who facilitates (QA), who accepts
  (per the project's governance — cite the decision-authority matrix).
- Training/walkthrough needs before the window opens.

## 5. Environment & data
- UAT environment, provider sandboxes, and constraints.
- Business-realistic synthetic data; respect the project's PII/test-data rules.

## 6. Entry criteria
- System test exit met for in-scope items; open-defect rules (e.g. no Sev-1,
  Sev-2 only with an accepted workaround); environment and data verified;
  scenarios and participants confirmed.

## 7. Execution & schedule
- UAT window mapped to the project's milestones; daily cadence; how results are
  recorded (pass / fail / pass-with-comments per scenario).

## 8. Findings management
- UAT findings triaged through the project's defect workflow (cite it);
  classification rule for "defect" vs "change request" — change requests go to
  change control, not the defect log.

## 9. Exit criteria & sign-off
- All scenarios executed; acceptance threshold (e.g. 100% of critical scenarios
  pass); unresolved findings dispositioned (fix / defer with PO acceptance).
- Sign-off: who records acceptance, where, and what it unblocks (cite the
  governance go/no-go gate).

## 10. Approval
- Sign-off table (Product Owner / business owner, QA Lead, others per governance).
```

---

## Quality bar

- Scenarios read as business outcomes, not test steps — a business user must be
  able to execute them without QA vocabulary.
- Entry/exit criteria are concrete and tie into the project's existing gates.
- The accepting authority is a named role from the project's governance doc.
- "Defect vs change request" is decided by a stated rule, not case-by-case debate.

---
name: bug-reporting
description: Writing and proposing bug reports. Use when the user found a defect (manually or in exploratory testing), says "report a bug" / "create a bug", or a classified test failure needs to become a tracker item (the CP-5 flow). Produces a complete severity-classified report and waits for human approval before creating anything.
---

# Bug Reporting

The canonical rules live in **[.claude/docs/reference/bug-report-standard.md](../../docs/reference/bug-report-standard.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Gather the minimal repro steps, expected vs actual, environment, and at least one piece of evidence (PII rules from `test-data` apply to attachments). Confirm reproducibility before drafting; mark intermittent bugs with the observed rate.
- Classify severity S1–S4 per the standard's plain-English definitions; check the tracker for duplicates first.
- Present the draft as a **CHECKPOINT (CP-5)** per `.claude/docs/reference/output-style.md` and wait for approval — **never create a tracker item without it**.
- On approval: if `ado_organization` is set in `docs/qa-config.yaml`, create an ADO Bug work item (`ado-fetch` connection rules); otherwise hand the markdown to the user for manual filing.

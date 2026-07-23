<!--
  Scope: Markdown skeleton for authoring a User Story locally (BSA primary output).
  Companion (work-tracking platform HTML field formatting rules):
    .github/agents/Skills/WorkItem_Operations/references/user-storys/user-story-description-format.md
-->

# User Story: [Feature Name]

## Metadata

- **User Story ID:** US-[YYYY-MM-DD]-[Feature-Name-Kebab-Case]
- **Created Date:** [ISO 8601 date]
- **BRD Reference:** [Link to BRD file]
- **Assigned To:** [Suggested user or "TBD"]
- **Story Points:** [Estimated points based on complexity]
- **Priority:** [High/Medium/Low]
- **Tags:** [Comma-separated tags]

---

## User Story

**As a** [user type],
**I want** [goal],
**So that** [benefit].

---

## Current Behavior

[Description of how the system currently behaves or why this feature doesn't exist]

---

## Desired Behavior

[Description of the expected behavior after implementation]

---

## Acceptance Criteria

**Scenario-based format (Given/When/Then):**

### Scenario 1: [Primary Happy Path]

**Given** [precondition]
**When** [action]
**Then** [expected result]

### Scenario 2: [Error Handling]

**Given** [precondition]
**When** [action that triggers error]
**Then** [expected error behavior]

### Scenario 3: [Edge Case]

**Given** [edge case precondition]
**When** [action]
**Then** [expected result]

[Add more scenarios as needed - minimum 3, recommended 5-7]

---

## Implementation Roadmap

### Phase A: [Phase Name]

- [ ] **A.1** [Task description]
  - **Affected Layer:** [Layer name]
  - **Dependencies:** [Task IDs or "None"]
  - **Estimated Time:** [Hours]

- [ ] **A.2** [Task description]
  - **Affected Layer:** [Layer name]
  - **Dependencies:** [Task IDs or "None"]
  - **Estimated Time:** [Hours]

### Phase B: [Phase Name]

[Continue with all phases from BRD implementation plan]

**Total Estimated Time:** [X hours / Y days]

---

## Test Strategy

### Test Coverage Matrix

| Component     | Unit Tests | Integration Tests | Security Tests | Performance Tests |
| ------------- | ---------- | ----------------- | -------------- | ----------------- |
| [Component 1] | ✅ Yes     | ✅ Yes            | -              | -                 |
| [Component 2] | ✅ Yes     | -                 | ✅ Yes         | -                 |

### Critical Test Scenarios

1. **Happy Path:** [Description]
2. **Error Handling:** [Description]
3. **Security Validation:** [Description]
4. **Performance Targets:** [Description]

**Minimum Coverage Threshold:** 80% code coverage for critical components

---

## Dependencies

### Technical Dependencies

- [Dependency 1]
- [Dependency 2]

### Cross-Project Dependencies

- [Project/Service dependency]

### External Dependencies

- [External service/API]

---

## Security Considerations

- [Security requirement 1]
- [Security requirement 2]
- [Security requirement 3]

---

## Risk Assessment

| Risk ID | Description        | Probability       | Impact            | Mitigation            |
| ------- | ------------------ | ----------------- | ----------------- | --------------------- |
| R-001   | [Risk description] | [Low/Medium/High] | [Low/Medium/High] | [Mitigation strategy] |

---

## Database Changes

[Summary of database changes or "None"]

### New Tables

[Table specifications or "None"]

### Modified Tables

[Modifications or "None"]

---

## Out of Scope

- [What is explicitly NOT included]
- [What is explicitly NOT included]

---

## Open Questions

- [Question needing clarification]
- [Question needing clarification]

---

## References

- **BRD:** [Link to BRD file]
- **Architecture Documentation:** [Relevant docs]
- **Related User Stories:** [Links if applicable]

---

## Notes for WorkItem_Operations skill (Bsa)

**This User Story is ready for work-tracking platform creation with the following:**

- Title: [Feature Name]
- Description: [User story statement]
- Acceptance Criteria: [All scenarios above]
- Tasks: [All tasks from Implementation Roadmap]
- Tags: [Tags from metadata]
- Story Points: [Points from metadata]
- Assigned To: [User from metadata]

**No additional data collection needed - all information is complete.**

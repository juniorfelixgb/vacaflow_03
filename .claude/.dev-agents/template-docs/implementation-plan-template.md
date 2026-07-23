# Implementation Plan: [Feature Name]

## Metadata

- **Plan ID:** Plan-[YYYY-MM-DD]-[Feature-Name-Kebab-Case]
- **Created Date:** [ISO 8601 date]
- **User Story ID:** [work-tracking platform User Story ID]
- **Estimated Total Time:** [X hours / Y days]
- **Complexity:** [Low/Medium/High/Very High]
- **Risk Level:** [Low/Medium/High]

---

## User Story Summary

**As a** [user type],
**I want** [goal],
**So that** [benefit].

**Acceptance Criteria Count:** [X scenarios]
**Story Points:** [X]

---

## Technical Approach

### Architecture Decisions

1. **[Decision 1]**
   - **Rationale:** [Why this approach]
   - **Alternatives Considered:** [Other options]
   - **Impact:** [What this affects]

2. **[Decision 2]**
   - **Rationale:** [Why this approach]
   - **Alternatives Considered:** [Other options]
   - **Impact:** [What this affects]

### Components Affected

| Component | Layer                                            | Change Type            | Complexity        |
| --------- | ------------------------------------------------ | ---------------------- | ----------------- |
| [Name]    | [API/Application/Domain/Infrastructure/Database] | [Create/Modify/Delete] | [Low/Medium/High] |

---

## File Modification Plan

### Files to Create

1. **[FilePath]**
   - **Purpose:** [What this file does]
   - **Dependencies:** [What it depends on]
   - **Estimated Lines:** [X lines]

2. **[FilePath]**
   - **Purpose:** [What this file does]
   - **Dependencies:** [What it depends on]
   - **Estimated Lines:** [X lines]

### Files to Modify

1. **[FilePath]**
   - **Current Functionality:** [What it currently does]
   - **Required Changes:** [What needs to change]
   - **Impact Analysis:** [What might break]

---

## Step-by-Step Implementation Sequence

### Phase A: Database Foundation

**Dependencies:** None

- [ ] **A.1** [Task description]
  - **File:** [FilePath]
  - **Action:** [Create/Modify/Delete]
  - **Code Changes:**
    - [Detailed change 1]
    - [Detailed change 2]
  - **Estimated Time:** [X hours]
  - **Acceptance Criteria:** [How to verify completion]
  - **Testing:** [How to test this specific task]

- [ ] **A.2** [Task description]
  - **File:** [FilePath]
  - **Action:** [Create/Modify/Delete]
  - **Code Changes:**
    - [Detailed change 1]
    - [Detailed change 2]
  - **Estimated Time:** [X hours]
  - **Acceptance Criteria:** [How to verify completion]
  - **Testing:** [How to test this specific task]

### Phase B: Domain Layer

**Dependencies:** A.1, A.2

- [ ] **B.1** [Task description]
      [Same structure as above]

[Continue with all phases: Database → Domain → Application → Infrastructure → API → Testing]

**Total Tasks:** [X]
**Total Estimated Time:** [Y hours]

---

## Testing Strategy

### Unit Test Requirements

| Component     | Test File Path            | Test Cases | Coverage Target |
| ------------- | ------------------------- | ---------- | --------------- |
| [Component 1] | [path/to/test-file]       | [X]        | 85%             |

### Integration Test Requirements

- **Test Scenario 1:** [Description]
  - **Setup:** [What to set up]
  - **Action:** [What to test]
  - **Expected Result:** [What should happen]

### Security Test Requirements

- **Test:** [Security aspect to verify]
- **Method:** [How to test it]
- **Pass Criteria:** [What indicates success]

---

## Acceptance Criteria Mapping

### Scenario 1: [Primary Happy Path]

**Implemented in Steps:** A.3, B.2, C.1, E.2

**Given** [precondition]
**When** [action]
**Then** [expected result]

**Test Validation:** [How to verify this scenario works]

### Scenario 2: [Error Handling]

**Implemented in Steps:** C.3, D.1

**Given** [precondition]
**When** [action]
**Then** [expected result]

**Test Validation:** [How to verify this scenario works]

[Map ALL acceptance criteria to implementation steps]

---

## Dependency Analysis

### Internal Dependencies

- **Dependency 1:** [Description and location]
  - **Status:** [Exists/Needs Creation]
  - **Action Required:** [What to do]

### External Dependencies

- **API/Service:** [Name]
  - **Configuration Required:** [Yes/No]
  - **Credentials:** [Where to find]

### Database Dependencies

- **Tables Required:** [Table names]
- **Migrations:** [Migration file names]
- **Backward Compatibility:** [Yes/No - explain]

---

## Risk Mitigation

| Risk ID | Description | Mitigation in Steps              | Owner           |
| ------- | ----------- | -------------------------------- | --------------- |
| R-001   | [Risk]      | [Specific steps addressing this] | Coder |

---

## Rollback Strategy

**If implementation fails:**

1. [Rollback step 1]
2. [Rollback step 2]
3. [Database rollback command if applicable]

**Migration Rollback:**

```bash
[the project's command to roll the database back to the previous migration]
```

---

## Code Review Checklist

**Reviewer should verify:**

- [ ] All files from "File Modification Plan" were addressed
- [ ] All acceptance criteria scenarios are testable
- [ ] Security validations are in place
- [ ] Error handling covers edge cases
- [ ] Database migrations are reversible
- [ ] Unit tests cover critical paths (>80% coverage)
- [ ] Integration tests validate acceptance criteria
- [ ] No hardcoded credentials or sensitive data
- [ ] Logging is comprehensive
- [ ] Documentation is updated

---

## Notes for Coder

**Implementation Guidelines:**

1. **Follow phases sequentially** (A → B → C → D → E → F)
2. **Complete each task** before moving to next
3. **Run tests after each phase** to catch issues early
4. **Commit after each phase** with descriptive commit messages
5. **Do NOT skip testing tasks** - they are mandatory

**Critical Reminders:**

- [Project-specific reminder 1]
- [Project-specific reminder 2]

---

## References

- **User Story on the work-tracking platform:** [Work item URL]
- **User Story MD File:** [Path if exists]
- **BRD:** [Path if exists]
- **Architecture Documentation:** [Relevant docs]

---

## Appendix: Architecture Patterns

**Clean Architecture Layers:**

```
API Layer → Application Layer → Domain Layer
              ↓
      Infrastructure Layer
              ↓
      Database Layer
```

**Project Structure for This Feature:**

```
[source root]/
  ├─ [api/entrypoint layer]/[ControllerName]
  ├─ [application layer]/[ServiceName]
  ├─ [domain layer]/[EntityName]
  ├─ [infrastructure layer]/[RepositoryName]
  └─ [migrations layer]/[MigrationFile]
```

---

**✅ Implementation Plan Complete - Ready for Coder**

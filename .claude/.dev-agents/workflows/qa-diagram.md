# QA Orchestrator Workflow - Visual Diagram

**Version 1.1.0** | Complete E2E Test Implementation Flow

---

```mermaid
flowchart TD
    Start([🚀 START<br/>QA Workflow]) --> Phase1Entry

    %% ========== PHASE 1: PLANNING ==========
    subgraph Phase1[" ⭐ PHASE 1: Requirement Analysis & Planning "]
        Phase1Entry{{"Start Phase 1"}} --> Step1_1[📄 1.1: Load Requirement<br/>Agent: Orchestrator<br/>Validate BRD content]

        Step1_1 -->|✅ Success| Step1_2[🎯 1.2: Generate Test Plan<br/>Agent: E2E_Plan<br/>Create comprehensive plan]
        Step1_1 -->|❌ Failure| Err1_1[Store: phase=1<br/>reason=Load failed]

        Step1_2 -->|✅ Success| Step1_3[💾 1.3: Save Test Plan<br/>Agent: Orchestrator<br/>docs/test-suites/]
        Step1_2 -->|❌ Failure<br/>Retry x1| Err1_2[Store: phase=1<br/>reason=Planning failed]

        Step1_3 -->|✅ Success| Step1_4[📊 1.4: Planning Report<br/>Display progress]
        Step1_3 -->|❌ Failure| Err1_3[Store: phase=1<br/>save_failed=true]

        Step1_4 --> Phase1Exit{{"End Phase 1"}}
    end

    Err1_1 --> Phase4Entry
    Err1_2 --> Phase4Entry
    Err1_3 --> Phase4Entry
    Phase1Exit --> Phase2Entry

    %% ========== PHASE 2: IMPLEMENTATION ==========
    subgraph Phase2[" ⭐ PHASE 2: Test Implementation "]
        Phase2Entry{{"Start Phase 2"}} --> Step2_0[✔️ 2.0: Validate Prerequisites<br/>🆕 NEW STEP<br/>Check: test_plan_content<br/>test_cases_list<br/>feature_name]

        Step2_0 -->|✅ Valid| Step2_1[💻 2.1: Generate Test Code<br/>Agent: E2E_Generate<br/>Create E2E tests]
        Step2_0 -->|❌ Invalid| Err2_0[Store: phase=2<br/>Validation failed]

        Step2_1 -->|✅ Success| Step2_2[💾 2.2: Save Test File<br/>Agent: Orchestrator<br/>[e2e-tests-dir]/]
        Step2_1 -->|❌ Failure<br/>Retry x1| Err2_1[Store: phase=2<br/>reason=Generation failed]

        Step2_2 -->|✅ Success| Step2_3[📊 2.3: Implementation Report<br/>Display progress]
        Step2_2 -->|❌ Failure| Err2_2[Store: phase=2<br/>save_failed=true]

        Step2_3 --> Phase2Exit{{"End Phase 2"}}
    end

    Err2_0 --> Phase4Entry
    Err2_1 --> Phase4Entry
    Err2_2 --> Phase4Entry
    Phase2Exit --> Phase3Entry

    %% ========== PHASE 3: EXECUTION & CORRECTION ==========
    subgraph Phase3[" ⭐ PHASE 3: Test Execution & Correction Loop 🔄 Max 3 Iterations "]
        Phase3Entry{{"Start Phase 3"}} --> Init3[Initialize:<br/>iteration_counter = 0]
        Init3 --> Step3_1[▶️ 3.1: Execute Test<br/>Agent: QA_Executor<br/>Run E2E tests<br/>Capture feedback]

        Step3_1 -->|✅ Success| Step3_2{🔍 3.2: Evaluate Result<br/>PASS or FAIL?}
        Step3_1 -->|❌ Failure<br/>Retry x1| Err3_1[Store: phase=3<br/>test_marked_as_skip=true<br/>tests_skipped_count=1]

        Step3_2 -->|🟢 TEST PASSED| Success3_2[✔️ Set Flags<br/>test_execution_success=true]

        Step3_2 -->|🔴 FAILED<br/>iter < 3| Inc3_2[➕ Increment Counter<br/>iteration_counter++]
        Inc3_2 --> Step3_3[🔧 3.3: Correct Test<br/>Agent: E2E_Heal<br/>🆕 Enhanced Error Handling<br/>Analyze & fix failures]

        Step3_2 -->|🔴 FAILED<br/>iter >= 3| MaxRetries[⏭️ Max Retries Reached<br/>test_marked_as_skip=true<br/>tests_skipped_count=1]

        Step3_3 -->|✅ Success| Step3_4[💾 3.4: Save Corrected Test<br/>🆕 Retry Policy x2<br/>Update file with fix]
        Step3_3 -->|❌ Failure| Err3_3[🆕 Store Flags:<br/>test_marked_as_skip=true<br/>correction_failed=true<br/>tests_skipped_count=1]

        Step3_4 -->|✅ Success| Step3_5[📊 3.5: Correction Report<br/>Display attempt info<br/>🆕 Safety Check]
        Step3_4 -->|❌ Failure<br/>After retries| Err3_4[🆕 Store:<br/>save_failed=true<br/>unsaved_corrections=content<br/>test_marked_as_skip=true]

        Step3_5 --> SafetyCheck{🛡️ Safety Check<br/>iter < max?}
        SafetyCheck -->|✅ Yes| LoopBack[🔄 Loop Back<br/>Re-run test]
        SafetyCheck -->|❌ No<br/>Force Exit| ForceExit[⚠️ Force Exit Loop<br/>test_marked_as_skip=true]

        LoopBack --> Step3_1
        Success3_2 --> Phase3Exit{{"End Phase 3"}}
    end

    Err3_1 --> Phase4Entry
    MaxRetries --> Phase4Entry
    Err3_3 --> Phase4Entry
    Err3_4 --> Phase4Entry
    ForceExit --> Phase4Entry
    Phase3Exit --> Phase4Entry

    %% ========== PHASE 4: FINALIZATION ==========
    subgraph Phase4[" ⭐ PHASE 4: Finalization & Reporting "]
        Phase4Entry{{"Start Phase 4"}} --> Step4_1{🏷️ 4.1: Mark as Skip?<br/>🆕 Expanded Condition<br/>skip OR correction_failed<br/>OR save_failed?}

        Step4_1 -->|✅ Yes| MarkSkip[⏭️ Add test.skip<br/>Add comments<br/>Save file]
        Step4_1 -->|❌ No| Step4_2[📝 4.2: Generate Final Report<br/>Agent: Orchestrator<br/>Compile all phases<br/>Create markdown]
        MarkSkip --> Step4_2

        Step4_2 --> Step4_3[📊 4.3: Display Final Summary<br/>🆕 Enhanced Report<br/>Shows partial results<br/>Error details<br/>Warnings]

        Step4_3 --> Phase4Exit{{"End Phase 4"}}
    end

    Phase4Exit --> End([🏁 END WORKFLOW<br/>✅ Report Generated])

    %% ========== STYLING ==========
    classDef phaseStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:4px,color:#000,font-weight:bold
    classDef stepStyle fill:#f1f8e9,stroke:#689f38,stroke-width:2px,color:#000
    classDef agentStyle fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000,font-weight:bold
    classDef decisionStyle fill:#fff9c4,stroke:#f57c00,stroke-width:3px,color:#000
    classDef errorStyle fill:#ffcdd2,stroke:#d32f2f,stroke-width:2px,color:#000
    classDef successStyle fill:#a5d6a7,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef loopStyle fill:#ce93d8,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef newStyle fill:#ffe0b2,stroke:#ff6f00,stroke-width:3px,color:#000

    class Phase1,Phase2,Phase3,Phase4 phaseStyle
    class Step1_2,Step2_1,Step3_1,Step3_3 agentStyle
    class Step1_1,Step1_3,Step1_4,Step2_2,Step2_3,Step3_4,Step3_5,Step4_2,Step4_3 stepStyle
    class Step3_2,Step4_1,SafetyCheck decisionStyle
    class Err1_1,Err1_2,Err1_3,Err2_0,Err2_1,Err2_2,Err3_1,Err3_3,Err3_4 errorStyle
    class Success3_2,MarkSkip successStyle
    class Inc3_2,Init3,MaxRetries,LoopBack,ForceExit loopStyle
    class Step2_0,Err2_0,Err3_3,Err3_4 newStyle
```

---

## 🔑 Diagram Legend

### Node Types

| Symbol      | Type               | Description                |
| ----------- | ------------------ | -------------------------- |
| ⭐          | **Phase**          | Major workflow phase (1-4) |
| 📄 🎯 💻 ▶️ | **Action Step**    | Specific task to execute   |
| 🔍          | **Decision Point** | Conditional branching      |
| 🆕          | **New/Enhanced**   | Version 1.1.0 improvements |
| ✔️          | **Validation**     | Prerequisites check        |
| 🛡️          | **Safety Check**   | Loop protection            |
| 🔧          | **Correction**     | Test healing               |
| ⏭️          | **Skip Marker**    | Test marked as skip        |

### Color Coding

- 🔵 **Blue boxes** - Workflow phases
- 🟢 **Green boxes** - Agent actions
- 🟡 **Yellow diamonds** - Decision points
- 🔴 **Red boxes** - Error handling
- 🟣 **Purple boxes** - Loop operations
- 🟠 **Orange boxes** - New features (v1.1.0)

### Flow Paths

- **Solid lines** → Normal execution flow
- **✅ Success** → Operation completed successfully
- **❌ Failure** → Operation failed, error handling triggered
- **🔄 Loop** → Return to previous step for retry

---

## 📊 Key Features (Version 1.1.0)

### ✅ Fixed Blind Spots

1. **Step 2.0**: Prerequisites validation BEFORE implementation
2. **Step 3.3**: Enhanced error handling with flag storage
3. **Step 3.4**: Retry policy (max 2 retries) for file save
4. **Step 3.5**: Safety check prevents infinite loops
5. **Step 4.1**: Expanded condition catches all failure scenarios
6. **All Errors**: Now go to Phase 4 for reporting (no abrupt exits)

### 🔄 Loop Protection

```
Phase 3 Loop Flow:
1. Execute (3.1)
2. Evaluate (3.2)
3. If FAIL & iter < 3:
   - Heal (3.3)
   - Save (3.4)
   - Report (3.5)
   - Safety Check
   - Loop back to Execute
4. If FAIL & iter >= 3:
   - Mark as skip
   - Go to Phase 4
```

### 🚨 Error Recovery Strategy

**All critical failures:**

- Store error details in variables
- Set appropriate flags
- Proceed to Phase 4 (no abrupt termination)
- Generate comprehensive report with partial results

---

## 🎯 Workflow States

| State                  | Condition                       | Next Action                            |
| ---------------------- | ------------------------------- | -------------------------------------- |
| ✅ **Success**         | All tests passing               | Complete with success report           |
| ⚠️ **Partial Success** | Some tests skipped              | Complete with warnings                 |
| 🔄 **In Correction**   | Test failed, healing            | Loop back (max 3 times)                |
| ❌ **Failed**          | Critical error in Phase 1-2     | Skip to Phase 4, generate error report |
| 🛑 **Max Retries**     | 3 correction attempts exhausted | Mark as skip, complete workflow        |

---

## 📈 Metrics Tracked

Throughout the workflow, these variables are tracked:

- `tests_created_count` - Number of tests implemented
- `tests_passed_count` - Tests that passed execution
- `tests_skipped_count` - Tests marked as skip
- `test_correction_attempts` - Number of healing attempts
- `execution_iteration_counter` - Current loop iteration
- `workflow_failed_at_phase` - Phase where failure occurred (if any)

---

**Source:** `workflow-executable-qa.yaml` v1.1.0  
**Last Updated:** 2026-02-13  
**Status:** ✅ All blind spots fixed

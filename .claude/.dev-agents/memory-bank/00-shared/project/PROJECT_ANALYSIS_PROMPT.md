# Project Analysis and Documentation Generation Prompt

## 🎯 Objective

Analyze the specified project component within the solution and generate/update comprehensive documentation in the `.dev-agents/memory-bank/00-shared/project/` folder.

**Target Component:** `{PROJECT_PATH}` (e.g., the backend entry point, background-processing layer, application layer)

## 📋 Analysis Requirements

### Phase 1: Project Structure Analysis

1. **Project Files Analysis:**
   - Examine the build manifest (e.g., `*.csproj`, `package.json`, `pyproject.toml`, or equivalent) for dependencies, packages, and project references
   - Identify entry points (main module, startup file, function triggers)
   - Analyze configuration files (app settings, host config, etc.)
   - Map folder structure and key files

2. **Code Architecture Analysis:**
   - Identify architectural patterns (MVC, CQRS, Clean Architecture layers, etc.)
   - Map controllers/handlers, services, repositories, and processors
   - Document dependency injection registrations
   - Analyze middleware, filters, and custom attributes

3. **Integration Points Analysis:**
   - Database contexts and entity mappings
   - External service integrations (cloud services, APIs)
   - Background processing patterns (queues, timers, event-driven)
   - Authentication/authorization mechanisms

### Phase 2: Documentation Generation

#### 📄 Create/Update Component-Specific Documentation File

1. **Create dedicated component documentation file** (if it doesn't exist):
   - `{PROJECT_NAME}_Documentation.md` (e.g., `API_Documentation.md`, `Application_Documentation.md`)
   - Include comprehensive component analysis in this dedicated file
   - Document all component-specific patterns, architecture, and implementation details

2. **Component Documentation Content Structure:**

   ```markdown
   # {PROJECT_NAME} Documentation

   ## Overview

   - Component purpose and role in the solution
   - Key responsibilities and boundaries
   - Integration points with other components

   ## Architecture & Patterns

   - [Component-specific architectural patterns]
   - [Implementation examples with actual code]
   - [Key classes/modules and their responsibilities]

   ## Dependencies & Integrations

   - [External dependencies and packages]
   - [Inter-component references and communication]
   - [Database contexts and data access patterns]
   ```

#### 📄 Update Project_info.md with Cross-References

Add reference to the new component documentation:

```markdown
## Related Documentation

- **[{PROJECT_NAME} Documentation](./{PROJECT_NAME}_Documentation.md)**: Comprehensive documentation for the {PROJECT_DESCRIPTION}.
```

#### 📄 Update Shared Documentation Files (Add Component-Specific Examples)

1. **Architecture_layers_and_examples.md**:
   - **ADD** real code examples from the analyzed component (don't replace existing examples)
   - Include component name/context for each example: `## Example: {PROJECT_NAME} - {COMPONENT_NAME}`
   - Reference the component's dedicated documentation file
   - Show how this component implements the architecture layers

2. **Appendix_Patterns_and_lessons.md**:
   - **ADD** patterns discovered in the analyzed component
   - Include component context: `### Pattern Found in {PROJECT_NAME}`
   - Cross-reference the component's documentation file
   - Maintain consistency with patterns from other components

3. **Quick_Reference.md** and other shared files:
   - **ADD** component-specific quick references
   - Ensure consistency with the complete solution
   - Include cross-references to component documentation

### Phase 3: Solution-Wide Consistency and Integration

#### 📄 Cross-Component Integration Analysis

1. **Solution Dependencies Mapping:**
   - Document how the analyzed component integrates with the rest of the solution
   - Update cross-references in other component documentation files
   - Ensure consistent terminology and patterns across all docs

2. **Shared Patterns Consistency:**
   - Verify the component follows established solution patterns
   - Document any new patterns that could benefit other components
   - Update shared documentation to reflect solution-wide consistency

3. **Integration Points Documentation:**
   - Map data flow between components (entry point → application → infrastructure → background processing)
   - Document shared interfaces and contracts
   - Identify communication patterns (direct calls, queues, events, databases)

#### 📄 Solution-Wide Documentation Updates

1. **Project_info.md Updates:**
   - Add the new component reference to the "Related Documentation" section
   - Ensure all component cross-references are current and complete
   - Maintain consistency in component descriptions and purposes

2. **Shared Reference Files Updates:**
   - Update files like `References.md` to include the new component documentation
   - Ensure `Quick_Reference.md` includes component-specific quick references
   - Maintain architectural consistency across all documentation

3. **Validation of Existing Documentation:**
   - Review existing component documentation for outdated cross-references
   - Ensure new component patterns are consistent with established practices
   - Update any conflicting or outdated information in shared files

## 🔧 Technical Analysis Checklist

### Code Quality Metrics

- [ ] Dependency injection usage patterns
- [ ] Logging implementation consistency
- [ ] Error handling strategies
- [ ] Validation approaches
- [ ] Testing coverage and patterns

### Performance Considerations

- [ ] Database query patterns
- [ ] Caching strategies
- [ ] Async usage
- [ ] Resource management (disposables, connections)

### Security Analysis

- [ ] Input validation
- [ ] Output encoding
- [ ] Authentication mechanisms
- [ ] Authorization patterns
- [ ] Sensitive data handling

## 📝 Documentation Standards

### Format Requirements

- **Language:** English
- **Format:** Markdown with proper headers and code blocks
- **Code Examples:** Use actual project code, not pseudo-code
- **Cross-References:** Link related documentation files

### Content Guidelines

1. **Be Specific:** Include actual class/module names, methods, and file paths
2. **Include Examples:** Show real code snippets from the project
3. **Document Patterns:** Explain why certain approaches were chosen
4. **Update References:** Ensure all cross-references are current
5. **Maintain Consistency:** Follow existing documentation structure

### File Organization

- Update existing files rather than creating duplicates
- Use consistent naming conventions
- Group related information logically
- Include table of contents for large files

## 🚀 Expected Deliverables

1. **Updated Project_info.md** with comprehensive component section
2. **Component-specific documentation** in appropriate reference files
3. **Architecture examples** with real code from the analyzed component
4. **Integration documentation** showing component relationships
5. **Technical reference guides** for component-specific patterns

## ⚡ Execution Instructions

1. Start with a semantic search to understand component scope
2. Read key project files systematically
3. Map project/component structure completely
4. Update documentation files efficiently
5. Verify all cross-references and links are working

**Success Criteria:** Agents should have complete understanding of the component's architecture, patterns, integration points, and be able to generate consistent code following established patterns.

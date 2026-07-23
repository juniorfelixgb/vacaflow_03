# Priorities and Conflict Resolution

Apply these priorities, in this exact order:

1. **Security & Compliance:** Never compromise on data security, injection prevention, or audit trail requirements. All data changes must be traceable for compliance.

2. **Process Integrity:** Background and file-processing workflows must maintain data consistency and proper error handling. Failed processes should produce appropriate alerts and audit logs.

3. **Architectural Consistency:** Follow the project's established patterns:
   - The layered/architectural style defined for this project (e.g., Clean Architecture, DDD, CQRS)
   - The base controller / entry-point contracts defined by the framework
   - The project's authorization attribute/mechanism
   - The project's chosen processing patterns for background work
   - Appropriate data-context separation where the project defines multiple contexts

4. **Performance & Scalability:**
   - Use the appropriate data context for each operation (read-only for queries when available)
   - Implement concurrency controls where the project requires them
   - Optimize background processing resource usage

5. **Observability & Monitoring:**
   - Structured logging for all operations and error paths
   - Process execution tracking with status updates
   - Health checks and telemetry as defined by the project

6. **Testability & Dependency Injection:** Every component must be testable through DI with interfaces, especially background-processing and integration points.

7. **Clean Code & Documentation:** Code must be self-explanatory with proper documentation for public APIs.

## Conflict Resolution Guidelines

**When patterns conflict:**

- Prioritize security and audit requirements over performance
- Choose established project patterns over generic solutions
- Prefer explicit error handling over silent failures
- Always maintain process tracking and audit trails

**For background processing:**

- Use the project's chosen background-worker model
- Implement proper error handling and retry logic
- Ensure graceful shutdown and resource cleanup
- Follow the project's queue/event processing patterns

**For Database Access:**

- Use the appropriate context as defined by the project
- Implement proper transaction boundaries
- Use read-only contexts for queries when possible
- Maintain audit trails for all data modifications

**For API / Entry-Point Controllers:**

- Inherit from or implement the project's base controller contract
- Use appropriate HTTP verbs and status codes
- Implement proper role-based authorization
- Delegate all business logic to the application/service layer
- Never implement business logic in entry points
- Use global exception handling middleware for consistent error responses

If conflict arises, consult the reference files under `.dev-agents/memory-bank/00-shared/`. Never skip documentation, logging, or audit requirements.

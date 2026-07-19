---
name: architecture-plan
description: Convert an approved feature specification into a minimal, reversible technical plan grounded in the existing repository. Use before editing application code.
---

# Architecture plan

Read the specification and trace the existing code paths. Do not design from memory.

Produce:

1. Current architecture and relevant data flow.
2. Proposed thin end-to-end slice.
3. Exact files to add or change and the responsibility of each change.
4. API or type changes, including failure behavior.
5. UI state model and data dependencies.
6. Tests at the cheapest meaningful layer.
7. Risks, rollback, and deliberate non-goals.
8. Ordered implementation steps with verification after each meaningful step.

Prefer existing dependencies and patterns. If the plan requires a new library, explain why the current stack cannot satisfy the requirement.

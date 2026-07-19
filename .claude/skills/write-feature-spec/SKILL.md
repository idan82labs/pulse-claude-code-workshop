---
name: write-feature-spec
description: Turn an ambiguous product request into an evidence-driven feature specification by consulting product, architecture, design, and QA experts, then synthesizing their perspectives. Use before planning or coding a new feature.
---

# Write a feature specification from all angles

## Process

1. Read `CLAUDE.md`, the feature brief, the specification canvas, and the relevant product code.
2. State the current request without embedding a solution.
3. Ask focused questions only when missing information would materially change the feature.
4. Consult these project agents one at a time to conserve Claude Pro usage:
   - `product-expert`
   - `architecture-expert`
   - `design-expert`
   - `qa-expert`
5. Treat their responses as advice. Resolve conflicts explicitly in the main session.
6. Produce one coherent specification at `workshop-output/FEATURE_SPEC.md`.

## Required specification

- Context and observed problem
- Target user and decision
- User and business outcome
- Goal, non-goals, and assumptions
- Proposed experience
- System/data implications
- Acceptance criteria written as observable behavior
- Loading, empty, error, partial, and recovery states
- Accessibility, security, privacy, and operational constraints
- Verification plan and evidence
- Open decisions and tradeoffs

Do not proceed to implementation until the user approves the specification and the file-level plan.

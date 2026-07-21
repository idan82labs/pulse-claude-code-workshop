---
name: write-feature-spec
description: Turn an ambiguous product request into an evidence-driven feature specification by fanning out focused product, architecture, design and QA reviews, adding security when a trust-boundary trigger applies, then fanning their perspectives into one decision. Use before planning or coding a new feature.
---

# Write a feature specification from all angles

## Process

1. Read `CLAUDE.md`, the feature brief, the specification canvas, and the relevant product code.
2. State the current request without embedding a solution.
3. Ask focused questions only when missing information would materially change the feature.
4. Fan out independent, read-only questions to these project agents. Run them sequentially in the workshop to conserve usage; parallel execution is appropriate only when budget allows and the branches do not depend on one another:
   - `product-expert`
   - `architecture-expert`
   - `design-expert`
   - `qa-expert`
   - `security-expert` only when the change touches authentication, authorization, sensitive data, external input, dependencies, MCP, CLI, browser, SSH or deployment. Otherwise record `SECURITY NOT TRIGGERED` and why.
5. Fan in the responses: remove duplicates, resolve conflicts explicitly, record rejected options and keep the main session as owner.
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

Each expert returns two recommendations, one risk, one unresolved question and exact source files when relevant. Do not concatenate expert memos into the specification.

Do not proceed to implementation until the user approves the specification and the file-level plan.

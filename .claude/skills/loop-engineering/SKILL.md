---
name: loop-engineering
description: Execute a feature through a bounded build-test-review-repair loop with explicit evidence and stop conditions. Use only after the specification and implementation plan are approved.
---

# Bounded execution loop

## Inputs

- Approved goal and non-goals
- Observable acceptance criteria
- Approved file-level plan
- Verification commands and expected evidence
- Maximum of three repair cycles

## Loop

1. Implement the smallest end-to-end slice in the approved plan.
2. Run the narrowest relevant check.
3. Run `npm run verify` before claiming completion.
4. Ask `change-reviewer` for an independent review.
5. Map every failure or finding to an acceptance criterion or engineering boundary.
6. Repair blockers and repeat verification.
7. Stop after three repair cycles or when all criteria pass.

## Stop rules

- Never delete or weaken a test to create a pass.
- Never change the goal silently.
- Never widen scope during a repair cycle.
- If the same blocker survives three cycles, stop and document the blocker, evidence, and next decision needed.

## Completion report

Report what changed, evidence for every criterion, commands executed, reviewer findings resolved, remaining risks, and the recommended next step.

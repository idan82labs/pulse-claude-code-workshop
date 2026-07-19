# Pulse project instructions

## Product purpose

Pulse gives delivery leads a shared view of projects, progress, constraints, and recent movement. The workshop challenge asks participants to help a lead identify project risk early and decide what to do next. Do not assume that this request implies a particular dashboard, score, alert, or algorithm.

## Before implementation

1. Read `workshop/01-PROJECT-BRIEF-HE.md` and `workshop/03-SPEC-CANVAS-HE.md`.
2. Explore the current product and API before proposing changes.
3. Write an explicit goal, non-goals, acceptance criteria, constraints, and verification plan.
4. Ask the product, architecture, design, and QA experts for focused perspectives.
5. Synthesize their advice into one coherent feature specification. Experts advise; they do not decide.
6. Present the plan before editing application code.

## Engineering boundaries

- Keep the project runnable with `npm run dev` and verifiable with `npm run verify`.
- Do not add external APIs, secrets, paid services, or authentication.
- Preserve accessibility: keyboard operation, visible focus, semantic structure, text labels, and non-color status cues.
- Prefer a thin end-to-end slice over many unfinished surfaces.
- Do not rewrite unrelated areas or change seeded data merely to make a feature appear successful.
- Never weaken or delete a test to satisfy the verification loop.

## Definition of done

A feature is complete only when:

- It solves the stated user and business problem.
- Every acceptance criterion has visible evidence.
- Loading, empty, error, and success states are considered where relevant.
- `npm run verify` passes.
- The current git diff has received an independent review.
- The participant can explain the decision, tradeoffs, and remaining risks.

## Useful commands

```bash
npm run dev
npm run typecheck
npm test
npm run build
npm run verify
```

Use `/clear` between unrelated exercises, `/context` to inspect context use, `/usage` to monitor the Claude plan, and `/rewind` when an implementation direction is wrong.

# Pulse — Claude Code Workshop

Pulse is the shared full-stack product for a four-hour Claude Code workshop about autonomous execution, goal definition, expert delegation, packaged expertise, and bounded verification loops.

The application is intentionally complete enough to feel like a real product and intentionally missing the workshop feature. Every participant receives the same business request and develops a different, defensible interpretation.

This repository is the clean participant baseline. The workshop feature is deliberately not implemented.

## Run the project

Requirements: Node.js 20 or newer and an active Claude Pro subscription.

```bash
git clone https://github.com/idan82labs/pulse-claude-code-workshop.git
cd pulse-claude-code-workshop
npm install
npm run dev
```

Open:

- Product: http://localhost:4310
- Packaged-expertise comparison: http://localhost:4310/design-demo
- API health: http://localhost:4311/api/health

## Verify the baseline

```bash
npm run verify
```

The command type-checks, tests, and builds both the frontend and backend.

## Workshop materials

- [`workshop/01-PROJECT-BRIEF-HE.md`](workshop/01-PROJECT-BRIEF-HE.md) — the deliberately open feature request
- [`workshop/02-PARTICIPANT-GUIDE-HE.md`](workshop/02-PARTICIPANT-GUIDE-HE.md) — participant flow and checkpoints
- [`workshop/03-SPEC-CANVAS-HE.md`](workshop/03-SPEC-CANVAS-HE.md) — specification template
- [`workshop/05-HOMEWORK-HE.md`](workshop/05-HOMEWORK-HE.md) — post-workshop assignment

## Repository map

```text
src/client/               React product UI
src/server/               Express API and seeded portfolio data
src/shared/               Shared domain types
.claude/agents/           Product, architecture, design, QA and review experts
.claude/skills/           Reusable specification, design and loop workflows
workshop/                 Participant brief, canvas, guide and homework
examples/plugin/          The same idea packaged as a shareable Claude Code plugin
```

## Workshop boundary

The application does not call an AI API. Claude Code is the development environment, not a runtime dependency of Pulse. Participants should not add secrets or paid services during the session.

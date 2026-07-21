# Pulse — Claude Code Workshop

Pulse is the shared full-stack product for a four-hour Claude Code workshop about autonomous execution, goal definition, expert delegation, packaged expertise, and bounded verification loops.

The application is intentionally complete enough to feel like a real product and intentionally missing the workshop feature. Every participant receives the same business request and develops a different, defensible interpretation.

This repository is the clean participant baseline. The workshop feature is deliberately not implemented.

## Quick start

Requirements: git, Node.js 20 or newer, npm, and Claude Code installed. Copy
and run this one command — Claude Code loads the `82labs-workshop` plugin for
the session and runs its bootstrap skill, which checks prerequisites, clones
or safely reuses this repository, installs dependencies, verifies the
workshop assets are present, runs `npm run verify`, and prints the exact
command to enter the project and start Claude:

```bash
claude --plugin-url https://raw.githubusercontent.com/idan82labs/pulse-claude-code-workshop/main/dist/82labs-workshop-plugin.zip "/82labs-workshop:bootstrap"
```

The cloned project already includes a best-practice `CLAUDE.md`, reusable
project skills, expert subagents, and the spec/goal/plan/evidence templates
used during the workshop — nothing else to set up.

Prefer to install the plugin persistently instead of loading it per-session?
See [Persistent install](#persistent-install) below.

## Run the project manually

Requirements: Node.js 20 or newer and Claude Code installed.

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

## Persistent install

Advanced users who want the bootstrap plugin available across sessions,
instead of loading it once with `--plugin-url`, can install it from this
repository's marketplace manifest:

```bash
claude plugin marketplace add idan82labs/pulse-claude-code-workshop
claude plugin install 82labs-workshop@82labs-workshop-marketplace
```

Then run `/82labs-workshop:bootstrap` from any session.

## Workshop materials

- [`workshop/01-PROJECT-BRIEF-HE.md`](workshop/01-PROJECT-BRIEF-HE.md) — the deliberately open feature request
- [`workshop/02-PARTICIPANT-GUIDE-HE.md`](workshop/02-PARTICIPANT-GUIDE-HE.md) — participant flow and checkpoints
- [`workshop/03-SPEC-CANVAS-HE.md`](workshop/03-SPEC-CANVAS-HE.md) — specification template
- [`workshop/05-HOMEWORK-HE.md`](workshop/05-HOMEWORK-HE.md) — post-workshop assignment
- [`workshop/06-EXECUTION-LOOPS-HE.md`](workshop/06-EXECUTION-LOOPS-HE.md) — practical loop, access, model-routing and context runbook
- [`workshop/templates/my-skill/SKILL.md`](workshop/templates/my-skill/SKILL.md) — starter template for the packaged-expertise exercise
- [`workshop-output/README.md`](workshop-output/README.md) — the artifact chain participants build during the session

## Repository map

```text
src/client/               React product UI
src/server/               Express API and seeded portfolio data
src/shared/               Shared domain types
.claude/agents/           Product, architecture, design, QA and review experts
.claude/skills/           Reusable specification, design and loop workflows
workshop/                 Participant brief, canvas, guide and homework
examples/plugin/          A different example: packaging project skills as a plugin
plugin/82labs-workshop/   The one-command workshop bootstrap plugin (Quick start above)
.claude-plugin/           Marketplace manifest listing plugin/82labs-workshop
```

## Workshop boundary

The application does not call an AI API. Claude Code is the development environment, not a runtime dependency of Pulse. Participants should not add secrets or external runtime dependencies during the session.

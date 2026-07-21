---
description: Bootstraps the 82Labs Pulse Claude Code workshop on this machine — checks prerequisites (git, Node >= 20, npm, the claude CLI), clones or safely reuses github.com/idan82labs/pulse-claude-code-workshop, installs dependencies, verifies the workshop assets are present, runs npm run verify, and prints the next command to start working. Use when the user asks to set up, bootstrap, install, or start the Pulse Claude Code workshop.
---

# 82Labs Pulse workshop bootstrap

Run `${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap.sh` with the Bash tool to set up the
workshop project. The script is deterministic and does all of the work itself —
do not reimplement its steps by hand.

## What the script does

1. Checks that `git`, `node` (>= 20), `npm`, and `claude` are on `PATH`.
2. Clones `https://github.com/idan82labs/pulse-claude-code-workshop.git` into the
   target directory (`./pulse-claude-code-workshop` by default).
3. If the target directory already exists, it is only reused when it is a git
   checkout whose `origin` remote matches the workshop repository. Anything
   else — an unrelated directory, a non-empty non-git folder, a checkout of a
   different remote — is left untouched and the script exits with an error
   instead of overwriting it.
4. Verifies the checkout actually contains `CLAUDE.md`, `.claude/skills`,
   `.claude/agents`, the conditional security expert, the audit contract,
   `workshop/templates`, and `workshop-output`.
5. Runs `npm install` and then `npm run verify` (both can be skipped).
6. Prints the exact command to `cd` into the project and start Claude Code.

## How to invoke it

Translate the user's request into flags and run the script, quoting arguments
that come from the user:

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap.sh" [--target <dir>] [--dry-run] [--skip-install] [--skip-verify]
```

- Default target directory: `./pulse-claude-code-workshop` (relative to the
  user's current working directory). Use `--target` if the user names a
  different location.
- Use `--dry-run` first if the user seems unsure, or if they explicitly ask
  to preview the plan before it runs.
- Only pass `--skip-install` or `--skip-verify` if the user explicitly asks
  to skip that step.

Report the script's own output to the user rather than summarizing around it —
it already explains what happened and prints the next command.

## After bootstrap succeeds

Tell the user the cloned project already ships with everything needed for the
workshop, so there is nothing left to scaffold:

- A best-practice `CLAUDE.md` with the project's engineering boundaries.
- Reusable project skills under `.claude/skills/`.
- Expert subagents under `.claude/agents/` (product, architecture, design, QA,
  conditional security, and change review).
- Spec, goal, plan, audit, and evidence templates under `workshop/templates/` and
  `workshop-output/`.
- The Pulse product itself (`src/`), runnable with `npm run dev` and
  verifiable with `npm run verify`.

Do not copy or duplicate any of those assets from this plugin — they already
exist in the cloned repository. This plugin's only job is getting that
repository checked out, installed, and verified.

# 82labs-workshop

A self-contained Claude Code plugin that bootstraps the 82Labs Pulse Claude
Code workshop with one command. It does not contain the workshop content
itself — the cloned project already ships a best-practice `CLAUDE.md`,
project Skills, expert subagents, a product-direction template, and the workbooks. This
plugin's only job is getting that project checked out, installed, and
verified.

## Contents

- `.claude-plugin/plugin.json` — plugin manifest.
- `skills/bootstrap/SKILL.md` — the skill Claude uses to run the bootstrap.
- `scripts/bootstrap.sh` — the deterministic bootstrap logic (see its
  `--help` for flags).
- `scripts/preflight-test.sh` — a non-destructive test of `bootstrap.sh` that
  runs entirely against a local fixture repo, with no network access.

## Try it locally

```bash
claude --plugin-dir ./plugin/82labs-workshop
```

Then run `/82labs-workshop:bootstrap`.

## Run the preflight test

```bash
./plugin/82labs-workshop/scripts/preflight-test.sh
```

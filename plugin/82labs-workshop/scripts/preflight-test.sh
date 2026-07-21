#!/usr/bin/env bash
# Non-destructive test of bootstrap.sh. Runs entirely inside a temp directory
# against a local fixture "remote" — no network access, nothing outside
# $TMPROOT is ever touched. Exercises the actual bootstrap.sh script.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BOOTSTRAP="$SCRIPT_DIR/bootstrap.sh"
if [ ! -x "$BOOTSTRAP" ]; then
  echo "preflight-test.sh: bootstrap.sh not found or not executable at $BOOTSTRAP" >&2
  exit 1
fi

TMPROOT="$(mktemp -d "${TMPDIR:-/tmp}/pulse-workshop-preflight.XXXXXX")"
cleanup() { rm -rf "$TMPROOT"; }
trap cleanup EXIT

PASS=0
FAIL=0

pass() { PASS=$((PASS + 1)); printf 'PASS: %s\n' "$*"; }
fail() { FAIL=$((FAIL + 1)); printf 'FAIL: %s\n' "$*"; }

assert_success() {
  local desc="$1"; shift
  if "$@" >"$TMPROOT/last.log" 2>&1; then
    pass "$desc"
  else
    fail "$desc (exit $?, log below)"
    sed 's/^/    /' "$TMPROOT/last.log"
  fi
}

assert_failure() {
  local desc="$1"; shift
  if "$@" >"$TMPROOT/last.log" 2>&1; then
    fail "$desc (expected non-zero exit, got 0)"
    sed 's/^/    /' "$TMPROOT/last.log"
  else
    pass "$desc"
  fi
}

assert_path_exists() {
  local desc="$1" path="$2"
  if [ -e "$path" ]; then pass "$desc"; else fail "$desc (missing: $path)"; fi
}

assert_path_missing() {
  local desc="$1" path="$2"
  if [ ! -e "$path" ]; then pass "$desc"; else fail "$desc (unexpectedly exists: $path)"; fi
}

# --- Build a fixture "remote" repository -----------------------------------
# A minimal but structurally faithful stand-in for the real workshop repo:
# the same required paths, plus an install/verify that need no network.

FIXTURE="$TMPROOT/fixture-remote"
mkdir -p "$FIXTURE"/.claude/skills "$FIXTURE"/.claude/agents \
         "$FIXTURE"/workshop/templates "$FIXTURE"/workshop-output

cat > "$FIXTURE/CLAUDE.md" <<'EOF'
# Fixture project instructions
EOF
: > "$FIXTURE/.claude/skills/.gitkeep"
: > "$FIXTURE/.claude/agents/.gitkeep"
: > "$FIXTURE/.claude/agents/security-expert.md"
: > "$FIXTURE/workshop/templates/.gitkeep"
: > "$FIXTURE/workshop/templates/AUDIT-CONTRACT.md"
: > "$FIXTURE/workshop-output/.gitkeep"

cat > "$FIXTURE/package.json" <<'EOF'
{
  "name": "fixture-workshop",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "verify": "node -e \"require('fs').writeFileSync('.verify-ran', 'ok')\""
  }
}
EOF

(
  cd "$FIXTURE"
  git init --quiet -b main
  git config user.email "fixture@example.com"
  git config user.name "Fixture"
  git add -A
  git commit --quiet -m "fixture commit"
)

export PULSE_WORKSHOP_REPO_URL="$FIXTURE"

WORKSPACE="$TMPROOT/workspace"
mkdir -p "$WORKSPACE"

# --- 1. Fresh clone, install and verify skipped for speed -------------------
CHECKOUT1="$WORKSPACE/checkout1"
assert_success "fresh clone with install/verify skipped" \
  "$BOOTSTRAP" --target "$CHECKOUT1" --skip-install --skip-verify
assert_path_exists "clone contains CLAUDE.md" "$CHECKOUT1/CLAUDE.md"
assert_path_exists "clone contains .claude/skills" "$CHECKOUT1/.claude/skills"
assert_path_exists "clone contains security expert" "$CHECKOUT1/.claude/agents/security-expert.md"
assert_path_exists "clone contains audit contract" "$CHECKOUT1/workshop/templates/AUDIT-CONTRACT.md"
assert_path_exists "clone contains workshop-output" "$CHECKOUT1/workshop-output"
assert_path_missing "skip-install left package-lock.json absent" "$CHECKOUT1/package-lock.json"
assert_path_missing "skip-verify left no verify marker" "$CHECKOUT1/.verify-ran"

# --- 2. Re-running against the same target reuses it (does not error) ------
assert_success "re-running against the same checkout reuses it" \
  "$BOOTSTRAP" --target "$CHECKOUT1" --skip-install --skip-verify

# --- 3. install + verify actually run when not skipped ----------------------
CHECKOUT2="$WORKSPACE/checkout2"
assert_success "clone with install and verify" \
  "$BOOTSTRAP" --target "$CHECKOUT2"
assert_path_exists "npm install ran (package-lock.json present)" "$CHECKOUT2/package-lock.json"
assert_path_exists "npm run verify ran (marker present)" "$CHECKOUT2/.verify-ran"

# --- 4. Refuses to overwrite a non-empty, unrelated directory --------------
CHECKOUT3="$WORKSPACE/checkout3"
mkdir -p "$CHECKOUT3"
echo "do not touch me" > "$CHECKOUT3/unrelated.txt"
assert_failure "refuses to touch a non-empty non-git directory" \
  "$BOOTSTRAP" --target "$CHECKOUT3"
assert_path_exists "unrelated file was left alone" "$CHECKOUT3/unrelated.txt"
if [ "$(cat "$CHECKOUT3/unrelated.txt")" = "do not touch me" ]; then
  pass "unrelated file content is unchanged"
else
  fail "unrelated file content was modified"
fi

# --- 5. Refuses to reuse a git checkout with a different remote ------------
CHECKOUT4="$WORKSPACE/checkout4"
mkdir -p "$CHECKOUT4"
(
  cd "$CHECKOUT4"
  git init --quiet -b main
  git config user.email "other@example.com"
  git config user.name "Other"
  git remote add origin "https://example.com/some-other-repo.git"
)
assert_failure "refuses a checkout pointed at a different remote" \
  "$BOOTSTRAP" --target "$CHECKOUT4"
assert_path_missing "did not create a verify marker in the wrong repo" "$CHECKOUT4/.verify-ran"

# --- 6. --dry-run performs no mutation --------------------------------------
CHECKOUT5="$WORKSPACE/checkout5-does-not-exist"
assert_success "dry run against a not-yet-cloned target" \
  "$BOOTSTRAP" --target "$CHECKOUT5" --dry-run
assert_path_missing "dry run did not create the target directory" "$CHECKOUT5"

echo
echo "----------------------------------------"
echo "preflight-test.sh: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]

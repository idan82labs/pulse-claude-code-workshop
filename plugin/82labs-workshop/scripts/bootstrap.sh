#!/usr/bin/env bash
# Deterministic bootstrap for the 82Labs Pulse Claude Code workshop.
# macOS / Linux only. No curl-pipe-bash. Safe to re-run.
set -euo pipefail

DEFAULT_REPO_URL="https://github.com/idan82labs/pulse-claude-code-workshop.git"
REPO_URL="${PULSE_WORKSHOP_REPO_URL:-$DEFAULT_REPO_URL}"
TARGET_DIR="./pulse-claude-code-workshop"
DRY_RUN=0
SKIP_INSTALL=0
SKIP_VERIFY=0
MIN_NODE_MAJOR=20

# Paths that must exist in a genuine workshop checkout.
REQUIRED_PATHS=(
  "CLAUDE.md"
  ".claude/skills"
  ".claude/agents"
  "workshop/templates"
  "workshop-output"
)

log()  { printf '[bootstrap] %s\n' "$*"; }
err()  { printf '[bootstrap] error: %s\n' "$*" >&2; }
die()  { err "$*"; exit 1; }

usage() {
  cat <<'EOF'
Usage: bootstrap.sh [options]

Options:
  --target <dir>   Directory to clone/reuse the workshop project in
                    (default: ./pulse-claude-code-workshop)
  --dry-run        Print the plan without cloning, installing, or verifying
  --skip-install   Skip "npm install"
  --skip-verify    Skip "npm run verify"
  -h, --help       Show this help
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --target)
      [ "$#" -ge 2 ] || die "--target requires a value"
      TARGET_DIR="$2"
      shift 2
      ;;
    --target=*)
      TARGET_DIR="${1#--target=}"
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --skip-install)
      SKIP_INSTALL=1
      shift
      ;;
    --skip-verify)
      SKIP_VERIFY=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1 (see --help)"
      ;;
  esac
done

[ -n "$TARGET_DIR" ] || die "--target must not be empty"

normalize_remote() {
  # Strip a trailing ".git" and any trailing slash for comparison purposes.
  local url="$1"
  url="${url%/}"
  url="${url%.git}"
  printf '%s' "$url"
}

check_platform() {
  local os
  os="$(uname -s)"
  case "$os" in
    Darwin|Linux) ;;
    *) die "unsupported platform '$os': this script supports macOS and Linux only" ;;
  esac
}

check_prereqs() {
  local missing=0

  if ! command -v git >/dev/null 2>&1; then
    err "git is required but was not found on PATH"
    missing=1
  fi

  if ! command -v node >/dev/null 2>&1; then
    err "node (>= ${MIN_NODE_MAJOR}) is required but was not found on PATH"
    missing=1
  else
    local node_major
    node_major="$(node -e 'process.stdout.write(String(process.versions.node.split(".")[0]))')"
    if [ "$node_major" -lt "$MIN_NODE_MAJOR" ]; then
      err "node >= ${MIN_NODE_MAJOR} is required, found $(node --version)"
      missing=1
    fi
  fi

  if ! command -v npm >/dev/null 2>&1; then
    err "npm is required but was not found on PATH"
    missing=1
  fi

  if ! command -v claude >/dev/null 2>&1; then
    err "the claude CLI is required but was not found on PATH"
    missing=1
  fi

  [ "$missing" -eq 0 ] || die "missing prerequisites, see errors above"
  log "prerequisites OK (git, node $(node --version 2>/dev/null || true), npm, claude)"
}

# Resolve to an absolute path without requiring GNU readlink -f.
abspath() {
  local target="$1"
  if [ -d "$target" ]; then
    (cd "$target" && pwd)
  else
    local dir base
    dir="$(dirname -- "$target")"
    base="$(basename -- "$target")"
    printf '%s/%s' "$(cd "$dir" && pwd)" "$base"
  fi
}

dir_is_empty() {
  local dir="$1"
  [ -z "$(ls -A "$dir" 2>/dev/null)" ]
}

# Decide how to obtain the checkout: clone fresh, reuse a matching one, or
# refuse to touch something unrelated. Never deletes or overwrites anything.
plan_checkout() {
  if [ -e "$TARGET_DIR" ] && [ ! -d "$TARGET_DIR" ]; then
    die "target '$TARGET_DIR' exists and is not a directory; choose a different --target"
  fi

  if [ -d "$TARGET_DIR/.git" ]; then
    local existing_remote normalized_existing normalized_expected
    existing_remote="$(git -C "$TARGET_DIR" remote get-url origin 2>/dev/null || true)"
    normalized_existing="$(normalize_remote "$existing_remote")"
    normalized_expected="$(normalize_remote "$REPO_URL")"

    if [ -z "$existing_remote" ]; then
      die "target '$TARGET_DIR' is a git checkout with no 'origin' remote; refusing to reuse or overwrite it. Choose a different --target."
    fi

    if [ "$normalized_existing" != "$normalized_expected" ]; then
      die "target '$TARGET_DIR' is a git checkout of '$existing_remote', not '$REPO_URL'; refusing to overwrite unrelated work. Choose a different --target."
    fi

    ACTION="reuse"
    return
  fi

  if [ -d "$TARGET_DIR" ] && ! dir_is_empty "$TARGET_DIR"; then
    die "target '$TARGET_DIR' already exists, is not empty, and is not a checkout of '$REPO_URL'; refusing to overwrite it. Choose a different --target."
  fi

  ACTION="clone"
}

do_clone() {
  log "cloning $REPO_URL into $TARGET_DIR"
  if [ "$DRY_RUN" -eq 1 ]; then
    log "(dry run) would run: git clone \"$REPO_URL\" \"$TARGET_DIR\""
    return
  fi
  git clone "$REPO_URL" "$TARGET_DIR"
}

do_reuse() {
  log "reusing existing checkout at $TARGET_DIR (remote already matches)"
  if [ "$DRY_RUN" -eq 1 ]; then
    log "(dry run) would fast-forward update if the working tree is clean"
    return
  fi
  if [ -n "$(git -C "$TARGET_DIR" status --porcelain 2>/dev/null)" ]; then
    log "working tree has local changes; leaving it as-is (not pulling)"
    return
  fi
  git -C "$TARGET_DIR" fetch --quiet origin || log "fetch failed; continuing with existing checkout"
  git -C "$TARGET_DIR" merge --ff-only '@{upstream}' --quiet 2>/dev/null || log "no fast-forward available; continuing with existing checkout"
}

verify_assets() {
  if [ ! -d "$TARGET_DIR" ]; then
    log "(dry run) would verify required workshop assets are present"
    return
  fi

  local missing=()
  local path
  for path in "${REQUIRED_PATHS[@]}"; do
    if [ ! -e "$TARGET_DIR/$path" ]; then
      missing+=("$path")
    fi
  done

  if [ "${#missing[@]}" -gt 0 ]; then
    die "checkout at '$TARGET_DIR' is missing expected workshop assets: ${missing[*]}"
  fi
  log "workshop assets verified: ${REQUIRED_PATHS[*]}"
}

install_deps() {
  if [ "$SKIP_INSTALL" -eq 1 ]; then
    log "skipping npm install (--skip-install)"
    return
  fi
  log "installing dependencies"
  if [ "$DRY_RUN" -eq 1 ]; then
    log "(dry run) would run: npm install (in $TARGET_DIR)"
    return
  fi
  (cd "$TARGET_DIR" && npm install)
}

run_verify() {
  if [ "$SKIP_VERIFY" -eq 1 ]; then
    log "skipping npm run verify (--skip-verify)"
    return
  fi
  log "running npm run verify"
  if [ "$DRY_RUN" -eq 1 ]; then
    log "(dry run) would run: npm run verify (in $TARGET_DIR)"
    return
  fi
  (cd "$TARGET_DIR" && npm run verify)
}

main() {
  check_platform
  check_prereqs
  plan_checkout

  if [ "$ACTION" = "clone" ]; then
    do_clone
  else
    do_reuse
  fi

  verify_assets
  install_deps
  run_verify

  local abs_target
  if [ "$DRY_RUN" -eq 1 ] && [ ! -e "$TARGET_DIR" ]; then
    abs_target="$TARGET_DIR"
  else
    abs_target="$(abspath "$TARGET_DIR")"
  fi

  log "done"
  printf '\nNext command:\n  cd "%s" && claude\n' "$abs_target"
}

main "$@"

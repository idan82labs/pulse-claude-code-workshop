#!/usr/bin/env bash
# Packages plugin/82labs-workshop into dist/82labs-workshop-plugin.zip
# for --plugin-dir/--plugin-url distribution.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="$ROOT_DIR/plugin/82labs-workshop"
OUT_DIR="$ROOT_DIR/dist"
OUT_ZIP="$OUT_DIR/82labs-workshop-plugin.zip"

[ -d "$PLUGIN_DIR" ] || { echo "plugin directory not found: $PLUGIN_DIR" >&2; exit 1; }

mkdir -p "$OUT_DIR"
rm -f "$OUT_ZIP"

(
  cd "$PLUGIN_DIR"
  zip -r -X -q "$OUT_ZIP" . -x "*.DS_Store"
)

echo "wrote $OUT_ZIP"

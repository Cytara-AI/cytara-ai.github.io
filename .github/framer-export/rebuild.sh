#!/usr/bin/env bash
# Re-exports the live Framer site into this repo as static files for GitHub Pages.
# Usage: .github/framer-export/rebuild.sh [source-url]
#   source-url defaults to https://cytara.ai. Once DNS points at GitHub Pages, pass the
#   Framer staging URL instead (e.g. https://<project>.framer.website), since cytara.ai
#   will then serve this repo.
set -euo pipefail

SOURCE_URL="${1:-https://cytara.ai}"
ORIGIN="https://$(cat "$(git rev-parse --show-toplevel)/CNAME")"
TOOL_REPO="https://github.com/haroonjamil/framer-to-static.git"
TOOL_COMMIT="b5c9bdfecf7d110ce9938f3efede4bd257419108"

ROOT="$(git rev-parse --show-toplevel)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

git clone --quiet "$TOOL_REPO" "$WORK/tool"
git -C "$WORK/tool" checkout --quiet "$TOOL_COMMIT"
(cd "$WORK/tool" && npm ci --no-audit --no-fund --silent)
(cd "$WORK/tool" && node scripts/export-site.js "$SOURCE_URL" --static)

node "$ROOT/.github/framer-export/postprocess.mjs" "$WORK/tool/dist" "$ROOT" "$ORIGIN"

# Rewrite absolute links to the export source (e.g. a .framer.website URL) to the real domain.
SOURCE_ORIGIN="$(node -e 'console.log(new URL(process.argv[1]).origin)' "$SOURCE_URL")"
if [ "$SOURCE_ORIGIN" != "$ORIGIN" ]; then
  grep -rlF "$SOURCE_ORIGIN" "$ROOT" --include='*.html' --include='*.xml' --include='*.txt' --include='*.mjs' \
    | while read -r f; do sed -i '' "s#${SOURCE_ORIGIN}#${ORIGIN}#g" "$f"; done
fi

echo "Done. Review with: git -C \"$ROOT\" status"

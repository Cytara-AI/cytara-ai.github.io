#!/usr/bin/env bash
# Re-exports the live Framer site into this repo as static files for GitHub Pages.
# Usage: .github/framer-export/rebuild.sh <framer-url>
#   framer-url is the Framer project's own domain, e.g. https://<project>.framer.website
#   (cytara.ai serves this repo, so exporting it would just copy GitHub Pages).
#   With --local, skips the export and re-runs post-processing on the committed files.
set -euo pipefail

if [ "${1:-}" = "--local" ]; then
  ROOT="$(git rev-parse --show-toplevel)"
  ORIGIN="https://$(cat "$ROOT/CNAME")"
  COPY="$(mktemp -d)"
  trap 'rm -rf "$COPY"' EXIT
  rsync -a --exclude .git --exclude .github "$ROOT/" "$COPY/"
  node "$ROOT/.github/framer-export/postprocess.mjs" "$COPY" "$ROOT" "$ORIGIN"
  exit 0
fi

SOURCE_URL="${1:?usage: rebuild.sh <https://project.framer.website> | --local}"
if curl -sI "$SOURCE_URL" | grep -qi '^server: GitHub.com'; then
  echo "error: $SOURCE_URL is served by GitHub Pages, not Framer. Pass the *.framer.website URL." >&2
  exit 1
fi
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

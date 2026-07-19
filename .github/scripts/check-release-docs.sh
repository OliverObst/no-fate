#!/usr/bin/env bash

set -euo pipefail

require_text() {
  local file="$1"
  local text="$2"
  if ! grep -Fq -- "$text" "$file"; then
    echo "Missing release-documentation marker in ${file}: ${text}" >&2
    exit 1
  fi
}

test -f docs/migration.md
test -f docs/page-modes.md
test -f RELEASE.md

require_text docs/migration.md "Current URL"
require_text docs/migration.md '`keep`'
require_text docs/migration.md '`revise`'
require_text docs/migration.md '`merge`'
require_text docs/migration.md '`redirect`'
require_text docs/migration.md '`remove`'
require_text docs/migration.md "/essays/example-argument/"
require_text docs/migration.md "aliases:"
require_text docs/migration.md "lastmod"
require_text docs/migration.md "rights:"
require_text docs/migration.md "public-content boundary"
require_text docs/migration.md "## Rollback"

require_text RELEASE.md "minimum Standard Hugo version"
require_text RELEASE.md "extended = false"
require_text RELEASE.md "check-release-docs.sh"
require_text RELEASE.md "VoiceOver"
require_text RELEASE.md "Lighthouse"
require_text RELEASE.md "images/screenshot.png"
require_text RELEASE.md "images/tn.png"
require_text RELEASE.md 'git tag -s "$version"'
require_text RELEASE.md "## Rollback and correction"

require_text docs/page-modes.md "Content format is not page mode"
require_text docs/page-modes.md "## Editorial mode"
require_text docs/page-modes.md "## Poster mode"
require_text docs/page-modes.md "## Archive mode"
require_text docs/page-modes.md "## Record mode"
require_text docs/page-modes.md "data-page-mode"
require_text docs/page-modes.md "--panicOnWarning"
require_text docs/page-modes.md "## Responsive behaviour"
require_text docs/page-modes.md "## Accessibility contract"
require_text docs/page-modes.md "## Print contract"
require_text docs/page-modes.md "## Downstream extension"

require_text README.md "docs/migration.md"
require_text README.md "RELEASE.md"
require_text CONTRIBUTING.md "docs/migration.md"
require_text CONTRIBUTING.md "RELEASE.md"

node .github/scripts/check-markdown-links.mjs

echo "Release documentation checks passed."

#!/usr/bin/env bash
set -euo pipefail

public_dir="${1:-exampleSite/public}"
home="${public_dir}/index.html"
components="${public_dir}/fixtures/structural-components/index.html"
archives="${public_dir}/archives/index.html"
record="${public_dir}/record/register-of-useful-misplacements/index.html"

require_text() {
  local file="$1"
  local text="$2"
  if ! grep -Fq -- "$text" "$file"; then
    echo "Missing expected editorial framework marker in ${file}: ${text}" >&2
    exit 1
  fi
}

require_text assets/css/10-tokens.css "--nf-font-display"
require_text assets/css/10-tokens.css "[data-page-mode=\"poster\"]"
require_text assets/css/10-tokens.css ":root[data-theme=\"dark\"]"
require_text assets/css/40-typography.css "font-family: var(--nf-font-meta)"

require_text "$home" "nf-home-module--argument"
require_text "$home" "nf-home-module--visual"
require_text "$home" "nf-home-module--questions"
require_text "$home" "data-count=1"
require_text "$home" "nf-home-module--record"

for component in poster question aside pullquote image-spread contact-sheet artefact timeline proposition; do
  require_text "$components" "nf-${component}"
done
require_text "$components" "type=image/webp"
require_text "$components" "srcset="
require_text "$components" "width=900 height=600"
require_text "$components" "nf-theme-image__dark"
require_text "$components" "data-nf-sortable"

require_text "$archives" "data-nf-section-filters"
require_text "$archives" "data-nf-filter-place=\"North Quay\""
require_text "$archives" "Tide-room cabinet B"
require_text "$archives" "North Quay open miscellany licence"
require_text "$archives" "nf-entry--lead"
require_text "$record" "data-nf-sortable"

if grep -RiqE --include='*.html' 'coming soon|does not exist|fictional register|demonstrating No Fate' "$public_dir"; then
  echo "Rendered demonstration copy contains a placeholder or self-conscious fixture phrase." >&2
  exit 1
fi

test -f docs/editorial-components.md
test -f docs/homepage-and-sections.md

echo "Editorial framework checks passed."

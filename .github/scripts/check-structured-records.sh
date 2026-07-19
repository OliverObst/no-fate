#!/usr/bin/env bash

set -euo pipefail

public_dir="${1:-exampleSite/public}"
record_page="${public_dir}/record/index.html"
fixture="exampleSite/data/record.yaml"

require_text() {
  local file="$1"
  local text="$2"
  if ! grep -Fq -- "$text" "$file"; then
    echo "Missing expected structured-record marker in ${file}: ${text}" >&2
    exit 1
  fi
}

node .github/scripts/generate-record-fixture.mjs --check
node -e 'JSON.parse(require("node:fs").readFileSync("schemas/structured-record.schema.json", "utf8"))'

entry_count="$(grep -o 'data-nf-record-complete' "$record_page" | wc -l | tr -d ' ')"
if [[ "$entry_count" != "200" ]]; then
  echo "Expected 200 complete structured-record entries, found ${entry_count}." >&2
  exit 1
fi

require_text "$record_page" 'data-nf-record-count=200'
require_text "$record_page" 'nf-structured-record__selected'
require_text "$record_page" 'nf-record-list--complete'
require_text "$record_page" 'data-nf-filter-year='
require_text "$record_page" 'data-nf-filter-type='
require_text "$record_page" 'data-nf-filter-topic='
require_text "$record_page" 'nf-record-entry__creator--highlighted'
require_text "$record_page" 'nf-record-link--source'
require_text "$record_page" 'nf-record-link--bibtex'
require_text "$record_page" 'itemtype=https://schema.org/CreativeWork'
require_text assets/css/80-record.css '.nf-structured-record__filters'
require_text assets/css/80-record.css 'break-inside: avoid'
require_text docs/structured-records.md 'Real records stay in the downstream'
require_text schemas/structured-record.schema.json '"required": ['

fixture_entries="$(grep -c '^- id:' "$fixture")"
demo_entries="$(grep -c '^  demo: true$' "$fixture")"
if [[ "$fixture_entries" != "200" || "$demo_entries" != "200" ]]; then
  echo "Every one of the 200 fixture records must declare demo: true." >&2
  exit 1
fi

echo "Structured-record checks passed."

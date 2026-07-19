#!/usr/bin/env bash

set -euo pipefail

public_dir="${1:-exampleSite/public}"
home="${public_dir}/index.html"
essay="${public_dir}/essays/maintenance-is-a-design-material/index.html"
fixture="${public_dir}/fixtures/structural-components/index.html"
archives="${public_dir}/archives/index.html"
record="${public_dir}/record/index.html"
search="${public_dir}/search/index.html"

require_text() {
  local file="$1"
  local text="$2"
  if ! grep -Fq -- "$text" "$file"; then
    echo "Missing release-hardening marker in ${file}: ${text}" >&2
    exit 1
  fi
}

node .github/scripts/audit-rendered-html.mjs "$public_dir"

require_text "$fixture" "nf-article__hero"
require_text "$fixture" "fetchpriority=high"
require_text "$fixture" "type=image/webp"
require_text "$fixture" "width=900 height=600"
require_text "$fixture" "duotone"
require_text "$fixture" "Creator: North Quay duplication room"
require_text "$fixture" "Licence: Open workshop copy licence"
if grep -RiqE 'cupboard seven|blue pencil|do not publish' "$public_dir"; then
  echo "Private image permission metadata leaked into rendered output." >&2
  exit 1
fi

require_text "$essay" "nf-menu__primary active"
require_text "$essay" "nf-menu__secondary"
require_text "$essay" "aria-hidden=true"
require_text "$search" "data-index-url=/index.json"
require_text "$search" "id=searchStatus"
require_text "$search" "aria-describedby=searchStatus"

node -e '
const fs = require("node:fs");
const index = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const titles = new Set(index.map((entry) => entry.title));
for (const excluded of ["Search", "A Cabinet of Small Mechanisms", "The Department of Tiny Alarms"]) {
  if (titles.has(excluded)) throw new Error(`Search index contains excluded page: ${excluded}`);
}
const record = index.find((entry) => entry.type === "record");
if (!record || record.content !== "") throw new Error("Record search entries must omit duplicate body content.");
' "${public_dir}/index.json"

test -f "${public_dir}/topics/index.html"
test -f "${public_dir}/essays/index.xml"
test -f "${public_dir}/archives/index.xml"
test -f "${public_dir}/404.html"
test -f "${public_dir}/sitemap.xml"
test -f "${public_dir}/robots.txt"
require_text "${public_dir}/essays/index.xml" "Maintenance Is a Design Material"
require_text "${public_dir}/archives/index.xml" "The Tide-Room Ledgers"
require_text "${public_dir}/sitemap.xml" "<urlset"
require_text "${public_dir}/robots.txt" "Sitemap:"
require_text "$essay" 'property="og:title"'
require_text "$essay" "twitter:title"
require_text "$essay" "rel=canonical"
require_text "$essay" "application/ld+json"
require_text layouts/archives.html 'GroupByPublishDate "2006"'

require_text "$home" "no-fate-theme-navigation"
require_text "$fixture" "no-fate-theme-navigation-gallery-table-copy"
require_text "$archives" "no-fate-theme-navigation-filters"
require_text "$record" "no-fate-theme-navigation-filters"
if grep -Fq "no-fate-theme-navigation-gallery" "$home"; then
  echo "Homepage loaded a page-specific gallery enhancement." >&2
  exit 1
fi
if grep -Fq 'rel=preload' "$search"; then
  echo "Search page contains an unnecessary preload." >&2
  exit 1
fi
if grep -RiqE '<script[^>]+src=https?://|fonts\\.(googleapis|gstatic)\\.com' "$public_dir"; then
  echo "Rendered site contains a remote runtime, font, or script dependency." >&2
  exit 1
fi

require_text "$essay" "nf-print-metadata"
require_text "$essay" "The Night Shift Committee"
require_text "$essay" "Canonical URL"
require_text "$record" "nf-print-canonical"
require_text assets/js/navigation.js 'target.focus({ preventScroll: true })'
require_text assets/css/99-utilities.css "size: A4"
require_text assets/css/99-utilities.css "details::details-content"
require_text assets/css/00-reset.css "min-width: 0"

echo "Sections 15–20 release-hardening checks passed."

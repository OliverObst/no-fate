#!/usr/bin/env bash

set -euo pipefail

public_dir="${1:?Usage: check-downstream-smoke-tests.sh PUBLIC_DIR [LABEL]}"
label="${2:-downstream site}"

if [[ ! -d "$public_dir" ]]; then
  echo "${label}: rendered public directory does not exist: ${public_dir}" >&2
  exit 1
fi

article="$public_dir/essays/temporary-installation/index.html"
if [[ ! -f "$article" ]]; then
  echo "${label}: downstream article was not rendered" >&2
  exit 1
fi

if ! grep -Eq \
  '<meta name="?no-fate-installation-test"? content="downstream override">' \
  "$article"; then
  echo "${label}: downstream head-end override did not replace the theme hook" >&2
  exit 1
fi

echo "Downstream-override smoke test (${label}): passed"

demo_markers=(
  "What we make for ourselves"
  "The Night Shift Committee"
  "Twenty Plates from the Kettle Observatory"
  "The Arithmetic of Borrowed Umbrellas"
  "Maintenance Is a Design Material"
)

for marker in "${demo_markers[@]}"; do
  if grep -R -Fq --include="*.html" "$marker" "$public_dir"; then
    echo "${label}: demonstration marker leaked into output: ${marker}" >&2
    exit 1
  fi
done

demo_routes=(
  "archives"
  "fixtures"
  "projects"
  "questions"
  "record"
)

for route in "${demo_routes[@]}"; do
  if [[ -e "$public_dir/$route" ]]; then
    echo "${label}: demonstration route leaked into output: /${route}/" >&2
    exit 1
  fi
done

echo "Demo-removal smoke test (${label}): passed"

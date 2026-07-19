#!/usr/bin/env bash

set -euo pipefail

missing_demo=0

while IFS= read -r -d '' fixture; do
  if ! grep --extended-regexp --quiet '^demo:[[:space:]]*true[[:space:]]*$' "${fixture}"; then
    echo "::error file=${fixture}::Example content must declare demo: true."
    missing_demo=1
  fi
done < <(find exampleSite/content -type f -name '*.md' -print0)

if [[ "${missing_demo}" -ne 0 ]]; then
  exit 1
fi

if ! grep --ignore-case --quiet 'fictional' exampleSite/README.md; then
  echo "::error file=exampleSite/README.md::The maintainer documentation must explain the fictional fixture boundary."
  exit 1
fi

if ! grep --extended-regexp --quiet 'demo:[[:space:]]*true' exampleSite/data/no-fate/propositions.yaml; then
  echo "::error file=exampleSite/data/no-fate/propositions.yaml::Demonstration propositions must be marked as demo data."
  exit 1
fi

echo "Demonstration boundary checks passed."

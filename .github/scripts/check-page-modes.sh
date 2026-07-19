#!/usr/bin/env bash

set -euo pipefail

public_dir="${1:-exampleSite/public}"

check_mode() {
  local relative_path="$1"
  local expected_mode="$2"
  local output="${public_dir}/${relative_path}/index.html"

  if [[ ! -f "${output}" ]]; then
    echo "::error file=${output}::Missing rendered ${expected_mode} mode fixture."
    return 1
  fi

  if ! grep --extended-regexp --quiet "data-page-mode=['\"]?${expected_mode}['\"]?" "${output}"; then
    echo "::error file=${output}::Expected data-page-mode=${expected_mode}."
    return 1
  fi

  if ! grep --quiet 'nf-article__opening' "${output}" ||
     ! grep --quiet 'nf-article__body' "${output}" ||
     ! grep --quiet 'nf-article__footer' "${output}"; then
    echo "::error file=${output}::The shared semantic article shell is incomplete."
    return 1
  fi

  if ! grep --quiet 'data-headline-scale' "${output}" ||
     ! grep --quiet 'data-opening-alignment' "${output}" ||
     ! grep --quiet 'data-opening-inverted' "${output}"; then
    echo "::error file=${output}::The shared opening controls are incomplete."
    return 1
  fi
}

check_mode "essays/maintenance-is-a-design-material" "editorial"
check_mode "questions/what-are-we-optimising" "poster"
check_mode "archives/tide-room-ledgers" "archive"
check_mode "record/register-of-useful-misplacements" "record"

archive_output="${public_dir}/archives/tide-room-ledgers/index.html"
record_output="${public_dir}/record/register-of-useful-misplacements/index.html"
poster_output="${public_dir}/questions/what-are-we-optimising/index.html"

grep --quiet 'nf-article__facts--archive' "${archive_output}"
grep --quiet 'nf-article__facts--record' "${record_output}"
grep --quiet 'scope=col' "${record_output}"
grep --extended-regexp --quiet "data-opening-inverted=['\"]?true['\"]?" "${poster_output}"

echo "Page mode checks passed."

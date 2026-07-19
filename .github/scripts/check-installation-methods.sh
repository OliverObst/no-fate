#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd -P)"
fixture_root="${repo_root}/.github/fixtures/install-site"
work_root="$(mktemp -d "${TMPDIR:-/tmp}/no-fate-installation.XXXXXX")"

cleanup() {
  if [[ -n "${work_root:-}" && -d "$work_root" ]]; then
    chmod -R u+w "$work_root" 2>/dev/null || true
    rm -rf -- "$work_root"
  fi
}
trap cleanup EXIT

for command in git go hugo; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Temporary installation tests require ${command}." >&2
    exit 1
  fi
done

prepare_site() {
  local method="$1"
  local site="$work_root/$method-site"

  mkdir -p "$site"
  cp -R "$fixture_root/common/." "$site/"
  cp "$fixture_root/${method}-hugo.toml" "$site/hugo.toml"
  printf '%s\n' "$site"
}

verify_site() {
  local site="$1"
  local method="$2"
  local home="$site/public/index.html"
  local article="$site/public/essays/temporary-installation/index.html"
  local alias="$site/public/old-temporary-installation/index.html"

  hugo \
    --source "$site" \
    --minify \
    --panicOnWarning \
    --gc \
    --cleanDestinationDir

  for output in "$home" "$article" "$alias"; do
    if [[ ! -f "$output" ]]; then
      echo "${method}: missing rendered output ${output#"$site/"}" >&2
      exit 1
    fi
  done

  grep -Fq "data-nf-style=clean" "$home"
  grep -Fq "A Theme Arrived with No Demonstration Luggage" "$article"
  grep -Fq "/essays/temporary-installation/" "$alias"

  bash "$repo_root/.github/scripts/check-downstream-smoke-tests.sh" \
    "$site/public" \
    "$method"

  echo "Temporary ${method} installation: production build verified"
}

create_theme_snapshot() {
  local snapshot="$work_root/theme-snapshot"

  mkdir -p "$snapshot"
  while IFS= read -r -d '' source_path; do
    if [[ -e "$repo_root/$source_path" || -L "$repo_root/$source_path" ]]; then
      mkdir -p "$snapshot/$(dirname "$source_path")"
      cp -pP "$repo_root/$source_path" "$snapshot/$source_path"
    fi
  done < <(
    git -C "$repo_root" ls-files \
      --cached \
      --others \
      --exclude-standard \
      -z
  )

  git -C "$snapshot" init --quiet
  git -C "$snapshot" add --all
  git -C "$snapshot" \
    -c user.name="No Fate installation test" \
    -c user.email="installation-test@example.invalid" \
    commit --quiet --message="Temporary theme snapshot"

  printf '%s\n' "$snapshot"
}

module_site="$(prepare_site module)"
(
  cd "$module_site"
  hugo mod init example.invalid/no-fate-module-installation
  go mod edit \
    "-replace=github.com/OliverObst/no-fate=${repo_root}"
  hugo mod tidy
  go list -m -f '{{ with .Replace }}{{ .Dir }}{{ end }}' \
    github.com/OliverObst/no-fate | grep -Fqx "$repo_root"
)
verify_site "$module_site" "Hugo Module"

theme_snapshot="$(create_theme_snapshot)"
submodule_site="$(prepare_site submodule)"
git -C "$submodule_site" init --quiet
git -C "$submodule_site" \
  -c protocol.file.allow=always \
  submodule add --quiet "$theme_snapshot" themes/no-fate

test -f "$submodule_site/.gitmodules"
test -n "$(git -C "$submodule_site" submodule status themes/no-fate)"
test "$(
  git -C "$submodule_site/themes/no-fate" rev-parse HEAD
)" = "$(
  git -C "$theme_snapshot" rev-parse HEAD
)"
verify_site "$submodule_site" "Git submodule"

echo "Temporary installation methods passed."

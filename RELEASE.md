# No Fate release checklist

This checklist is the release gate for a tagged No Fate version. Required items
must be complete before the tag is pushed. Record deliberate exceptions in the
release notes rather than silently skipping a check.

The first public release should use a pre-1.0 version while the public content
contract is still settling. Follow Semantic Versioning and treat changes to
front matter, template hooks, CSS extension points, data schemas and minimum
Hugo versions as compatibility decisions.

## 1. Define the release

- [ ] Choose the version and intended release date.
- [ ] Confirm the working tree is clean and `main` is synchronised with
  `origin/main`.
- [ ] Review every commit since the previous tag.
- [ ] Move relevant `CHANGELOG.md` entries from `Unreleased` into a dated
  version section.
- [ ] Mark breaking changes and link to the exact migration instructions.
- [ ] Confirm the README status and installation examples match the release.
- [ ] Confirm no required work is being deferred without an issue or release
  note.

Useful review commands:

```sh
git status --short
git log --oneline LAST_TAG..HEAD
git diff --check
```

For the first release, replace `LAST_TAG` with the initial imported revision or
review the complete repository history.

## 2. Verify compatibility metadata

- [ ] `theme.toml` contains the correct name, repository, licence, features and
  tested `min_version`.
- [ ] `hugo.toml` declares the same minimum under `module.hugoVersion`.
- [ ] `extended = false` remains correct; do not require Hugo Extended unless a
  tested feature genuinely needs it.
- [ ] CI tests the minimum Standard Hugo version, the current Standard version
  and the current Extended version.
- [ ] Module and submodule installation examples use the release tag rather
  than `main`.
- [ ] The release builds without Node.js.

The minimum version is evidence, not a guess. Build the complete example site
with that exact Standard binary before changing either metadata file.
The Hugo builds and every downstream site must work without Node.js. Node.js
is used only by this repository's maintainer-side fixture and audit scripts.

## 3. Check licence and provenance

- [ ] `LICENSE` retains all required MIT notices.
- [ ] `UPSTREAM.md` names the imported PaperMod revision and update policy.
- [ ] Any newly adopted upstream code is identified in `UPSTREAM.md` or the
  changelog.
- [ ] No third-party asset, font, icon or fixture lacks an appropriate licence.
- [ ] The README's PaperMod relationship and substantial differences remain
  accurate.
- [ ] `theme.toml` author and original-theme fields remain accurate.

## 4. Check the public-content boundary

- [ ] Every page under `exampleSite/content/` declares `demo: true`.
- [ ] Every demonstration structured-record entry declares `demo: true`.
- [ ] Names, organisations, projects, publications, events and identifiers in
  fixtures are invented.
- [ ] Invented external links use `example.invalid`; maintainer and dependency
  links are clearly real.
- [ ] Screenshots show only fictional demonstration content.
- [ ] Fixture images are original, public-domain or appropriately licensed and
  carry public attribution.
- [ ] Private `rights.permission` notes do not appear in HTML, search or feeds.
- [ ] Public copy does not identify No Fate through imitation of a named
  publication, website, designer or style.
- [ ] Removing `exampleSite/content/` and example data would not break the
  reusable theme.

## 5. Run the automated release suite

Run the draft and production builds from the repository root:

```sh
hugo \
  --source exampleSite \
  --themesDir ../.. \
  --buildDrafts \
  --panicOnWarning \
  --gc \
  --cleanDestinationDir

hugo \
  --source exampleSite \
  --themesDir ../.. \
  --minify \
  --panicOnWarning \
  --gc \
  --cleanDestinationDir
```

Then run the repository checks:

```sh
bash .github/scripts/check-demo-boundary.sh
bash .github/scripts/check-page-modes.sh exampleSite/public
bash .github/scripts/check-editorial-framework.sh exampleSite/public
bash .github/scripts/check-structured-records.sh exampleSite/public
bash .github/scripts/check-release-hardening.sh exampleSite/public
bash .github/scripts/check-release-docs.sh
npm ci
npx playwright install chromium
npm run test:quality
```

- [ ] All local commands pass.
- [ ] Rendered local links and fragments pass.
- [ ] Every generated HTML document passes the configured standards validator.
- [ ] Axe passes representative light, dark, filtered and narrow states.
- [ ] Lighthouse accessibility scores are at least 95 on all configured pages.
- [ ] Linux Chromium visual baselines pass without an unexplained update.
- [ ] The generated 200-entry fixture is current.
- [ ] The GitHub Actions matrix passes for the release commit.
- [ ] Generated HTML contains no duplicate IDs, malformed JSON-LD or missing
  image alternatives.
- [ ] Search exclusions, section feeds, sitemap, robots, 404 and yearly archive
  support are present.
- [ ] No remote font, icon, framework or runtime dependency appears.
- [ ] Page-specific scripts are absent from pages that do not need them.

## 6. Perform manual accessibility checks

Test the home page, search, one page in each mode, the structural component
fixture and the 200-entry record.

- [ ] Complete a keyboard-only pass, beginning with the skip link.
- [ ] Confirm focus remains visible in light, dark and inverse surfaces.
- [ ] Confirm primary navigation names remain concise in a screen reader and
  secondary phrases are not announced.
- [ ] Complete a VoiceOver spot check of headings, landmarks, lists, figures,
  filters and search status.
- [ ] Test 200 per cent browser zoom without lost content or horizontal page
  scrolling.
- [ ] Test a 320-pixel viewport and practical touch targets.
- [ ] Test reduced motion and a forced-colour or high-contrast mode.
- [ ] Run axe or an equivalent WCAG 2.2 AA audit in light and dark modes.
- [ ] Confirm posters remain selectable, zoomable text rather than images of
  text.

The automated coverage and visual-baseline update policy are documented in
[Automated quality testing](docs/testing.md). Do not replace these manual checks
with a passing automated score.

## 7. Verify performance and media

- [ ] Run Lighthouse on the home, poster, search and full structured-record
  pages.
- [ ] Performance and accessibility scores are at least 95 on representative
  production pages.
- [ ] Test production compression; the 200-entry fixture should not be measured
  over an intentionally uncompressed development server.
- [ ] Confirm responsive images have source sets and intrinsic dimensions.
- [ ] Confirm genuine heroes are eager and high priority while below-fold
  images remain lazy.
- [ ] Confirm video and audio never autoplay.
- [ ] Confirm no speculative preload exists for an absent asset.
- [ ] Confirm cumulative layout shift remains acceptably low.

## 8. Verify print output

- [ ] Print or save an editorial essay, poster, archive and full structured
  record.
- [ ] Output is A4 with a light background and useful margins.
- [ ] Navigation, filters, search, media controls and decorative treatments are
  absent.
- [ ] Title, author, date, canonical URL and body remain.
- [ ] Figures retain captions and public attribution.
- [ ] Artefact numbers and sources remain real text.
- [ ] External link destinations are useful on paper.
- [ ] Tables and record entries avoid poor page breaks where the browser
  permits.

## 9. Review visual fixtures and gallery assets

- [ ] Check `clean` and `wild` styles at desktop and mobile widths.
- [ ] Check light and dark colour modes.
- [ ] Review the homepage, every page mode, search, filters, contact sheet and
  404 page.
- [ ] `images/screenshot.png` is a current 3:2 image at least 1500 by 1000.
- [ ] `images/tn.png` is a current 3:2 image at least 900 by 600.
- [ ] Both images show the current fictional example and contain no private
  browser or desktop material.
- [ ] Intentional irregularity remains legible and does not obscure focus,
  source order or controls.

## 10. Smoke-test downstream installation

Use temporary, empty Hugo sites rather than the theme's own example.

- [ ] Install the tag as a Hugo Module and run a production build.
- [ ] Confirm `go.mod` and `go.sum` resolve the intended tag.
- [ ] Install the same tag as a Git submodule and run a production build.
- [ ] Confirm a minimal site works with `clean`, one section and one article.
- [ ] Confirm all demonstration content can be omitted.
- [ ] Confirm a downstream override in `layouts/_partials/hooks/head-end.html`
  works without editing theme source.
- [ ] Confirm the migration guide's alias example generates its old route.

## 11. Create the tag and GitHub release

Only continue after the release commit and CI matrix pass.

```sh
version=v0.1.0
git tag -s "$version" -m "No Fate $version"
git push origin "$version"
gh release create "$version" \
  --title "No Fate $version" \
  --notes-from-tag \
  --verify-tag
```

- [ ] The tag is signed by an authorised maintainer.
- [ ] The GitHub release targets the reviewed commit.
- [ ] Release notes summarise user impact, compatibility and migration needs.
- [ ] Links in the release notes resolve publicly.
- [ ] No generated site, cache, local report or secret is attached.

If the maintainer cannot sign tags, document the approved alternative before
creating the release. Do not silently substitute an unsigned tag.

## 12. Verify the published release

- [ ] The release is visible on GitHub and the tag can be fetched anonymously.
- [ ] `hugo mod get github.com/OliverObst/no-fate@VERSION` resolves the new
  version.
- [ ] A clean production build works from the fetched tag.
- [ ] README links, screenshots and raw image URLs work at the tag.
- [ ] Theme-gallery metadata remains valid.
- [ ] Open or update the public theme submission only after these checks pass.
- [ ] Record any post-release defect and its workaround in an issue.

## Rollback and correction

Do not move or replace a published tag. If a release is defective:

1. mark it clearly in the GitHub release notes;
2. restore documentation or installation guidance if users are at risk;
3. fix the defect on `main`;
4. run this checklist again;
5. publish a new patch version.

For a compromised or legally unsafe artefact, follow GitHub's security and
legal process in addition to publishing a corrected version.

# Automated quality testing

No Fate keeps its published output static while using a pinned, test-only
Node.js toolchain to inspect that output. Hugo users do not need Node.js,
Playwright or Docker to install or build the theme.

The automated suite covers:

- local page, fragment, image, stylesheet, script and generated-resource links;
- standards-based validation of every rendered HTML document;
- structural enforcement of the Section 27.2 stress fixtures;
- disposable downstream builds installed through both Hugo Modules and a real
  Git submodule;
- axe WCAG A and AA checks on representative pages and interactive states;
- Lighthouse accessibility and performance scores, plus cumulative layout
  shift, on the home, poster, search, full record and 20-image archive pages;
- Linux Chromium screenshot comparison for desktop, mobile, light, dark,
  interactive and print-media states.

These checks complement rather than replace the manual keyboard, VoiceOver,
zoom, forced-colour, touch-target and paginated print checks in
[the release checklist](../RELEASE.md).

## Prerequisites

The theme itself supports Hugo 0.158.0 and later. The quality tools additionally
require:

- Node.js 22.19 or later;
- npm;
- Git and Go for the temporary installation tests;
- Chromium installed through Playwright for local axe and Lighthouse tests;
- Docker when running visual tests from macOS or Windows.

Install the pinned dependencies and local browser:

```sh
npm ci
npx playwright install chromium
```

GitHub Actions uses the matching Playwright container, so it does not download a
second browser during each run.

## Run the complete suite

From the repository root:

```sh
npm run test:quality
```

This command:

1. builds the example with the reserved `https://no-fate.test/` origin;
2. checks rendered local links and fragments;
3. validates every generated HTML file;
4. proves that the 20-image archive, 60-row table, maths/code/footnotes article,
   PDF download and long English/German titles are complete;
5. runs axe across representative pages and states;
6. compares the visual baselines;
7. requires Lighthouse accessibility and performance scores of at least 95,
   with cumulative layout shift no greater than 0.1, on five release pages.

Lighthouse uses a 1440 × 900 desktop viewport and `provided` throttling against
the local minified Hugo server. This makes the gate a repeatable theme/build
regression baseline and avoids treating simulated network conditions as
template work. Production compression and field performance remain separate
release checks.

The generated theme still builds without Node.js. The existing Hugo-only
release checks remain available independently.

## Run one layer

```sh
npm run build:test
npm run test:links
npm run test:html
npm run test:fixtures
npm run test:installation
npm run test:accessibility
npm run test:visual
npm run test:lighthouse
```

`test:links` checks references that belong to the generated site. It does not
request third-party URLs: the fixture intentionally contains `example.invalid`
links, and external network availability must not make CI non-deterministic.

`test:html` uses `html-validate:recommended`. Its small configuration exception
list covers formatting choices in generated markup, Hugo’s head-only alias
redirect documents, minified doctype casing, HTML5 numeric IDs,
scrollable-table regions and change-driven filter forms without submit
buttons. Semantic, ARIA, duplicate class and document-structure rules remain
active.

## Temporary downstream installation

Run:

```sh
npm run test:installation
```

The command creates two empty sites below the operating system’s temporary
directory and removes them on exit. Both receive the same minimal downstream
home page, section, article, alias and `head-end` override.

The Hugo Module site imports `github.com/OliverObst/no-fate` and uses a temporary
Go `replace` directive pointing at the current checkout. The Git submodule site
installs a temporary Git snapshot of the current working tree at
`themes/no-fate`; this deliberately includes uncommitted tracked and untracked
work that is not ignored. The test therefore exercises the changes under
review, not merely the last commit.

Each path must produce a minified production build with content-model
validation enabled. Explicit downstream-override checks require the consumer's
`head-end` marker in the rendered article. Explicit demo-removal checks reject
the demonstration title, people, fixture titles and routes. They prove that
`exampleSite/` may remain in the theme repository without becoming downstream
content. The test performs no remote fetch, so release-tag resolution remains
an explicit release-checklist step.

`test:accessibility` runs axe on:

- the homepage;
- all four page modes;
- the full 200-entry structured record;
- the editorial-component fixture;
- all six Section 27.2 stress fixtures;
- search;
- dark mode;
- an active record filter;
- 320-pixel reflow viewports for structural components, both long titles and
  the long record table.

It also rejects document-level horizontal overflow in the narrow reflow case.

## Visual baselines

The committed PNGs under `tests/visual-snapshots/` are produced by Chromium in
`mcr.microsoft.com/playwright:v1.61.1-noble`. Linux uses that browser directly.
On macOS or Windows, the wrapper runs the same container so platform font
rendering does not create false differences.

The suite records:

- desktop and mobile homepages;
- editorial, poster, archive and record modes;
- light and dark colour themes;
- wide and narrow navigation;
- an active structured-record filter;
- the contact sheet;
- the 20-image archive, 60-row table, maths article and PDF artefact;
- long English and German titles at mobile width;
- print-media rendering of an editorial article.

No Fate’s narrow navigation is a visible wrapping menu, not a collapsible
drawer, so it has no artificial open/closed state. If a drawer is introduced,
its closed and open states must both be added before that change is accepted.

To accept an intentional visual change:

```sh
npm run test:update-snapshots
npm run test:visual
git diff -- tests/visual-snapshots
```

Review every changed image. Do not update baselines merely to make a failing
test green. Screenshots must continue to contain only generic fictional
demonstration content.

## Failure diagnostics

Playwright writes screenshots, diffs, traces and its HTML report below
`test-results/`. Lighthouse writes one full JSON report per route plus a compact
threshold summary below `test-results/lighthouse/`. These paths are ignored
locally. GitHub Actions uploads them for 14 days when the quality job fails.

The visual comparison permits a 0.2 per cent pixel difference to absorb minor
anti-aliasing noise. Layout shifts, type reflow, colour changes and missing
content exceed that threshold and fail the build.

## CI structure

The existing Hugo matrix verifies minimum/current Standard Hugo and current
Extended Hugo. Both Standard members also run both disposable downstream
installation paths. A separate quality job runs once in the pinned browser
container because browser behaviour does not need to be repeated for every Hugo
edition. Both jobs must pass for a release.

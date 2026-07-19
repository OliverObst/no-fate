# Automated quality testing

No Fate keeps its published output static while using a pinned, test-only
Node.js toolchain to inspect that output. Hugo users do not need Node.js,
Playwright or Docker to install or build the theme.

The automated suite covers:

- local page, fragment, image, stylesheet, script and generated-resource links;
- standards-based validation of every rendered HTML document;
- axe WCAG A and AA checks on representative pages and interactive states;
- Lighthouse accessibility scores on the home, poster, search and full record
  pages;
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
4. runs axe across representative pages and states;
5. compares the visual baselines;
6. requires a Lighthouse accessibility score of at least 95 on four release
   pages.

The generated theme still builds without Node.js. The existing Hugo-only
release checks remain available independently.

## Run one layer

```sh
npm run build:test
npm run test:links
npm run test:html
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

`test:accessibility` runs axe on:

- the homepage;
- all four page modes;
- the full 200-entry structured record;
- the editorial-component fixture;
- search;
- dark mode;
- an active record filter;
- a 320-pixel reflow viewport.

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
`test-results/`. Lighthouse writes JSON reports below
`test-results/lighthouse/`. These paths are ignored locally. GitHub Actions
uploads them for 14 days when the quality job fails.

The visual comparison permits a 0.2 per cent pixel difference to absorb minor
anti-aliasing noise. Layout shifts, type reflow, colour changes and missing
content exceed that threshold and fail the build.

## CI structure

The existing Hugo matrix verifies minimum/current Standard Hugo and current
Extended Hugo. A separate quality job runs once in the pinned browser container
because browser behaviour does not need to be repeated for every Hugo edition.
Both jobs must pass for a release.

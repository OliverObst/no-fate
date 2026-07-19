# No Fate

No Fate is a reusable Hugo theme for sites that combine an editorial voice
with structured records, archives, projects, and long-form writing.

It is designed for personal publications, independent journals, portfolios,
research or project archives, and small editorial organisations. It does not
assume a particular author, institution, subject area, domain, navigation
structure, or editorial position.

![No Fate wild style preview](https://raw.githubusercontent.com/OliverObst/no-fate/main/images/screenshot.png)

> Development status: No Fate is in foundation development and has not yet
> published its first tagged release. The repository currently establishes the
> public theme contract and retains selected infrastructure from its pinned
> PaperMod foundation. See [UPSTREAM.md](UPSTREAM.md) for exact provenance.

## Principles

- Hugo-native templates and asset processing
- No Node.js, Tailwind, webpack, or JavaScript framework
- Semantic HTML and readable content without JavaScript
- Accessible light and dark modes
- Generic configuration under `params.noFate`
- Fictional, removable demonstration content
- Site content and identity kept outside the theme

## Relationship to PaperMod

No Fate is an independent derivative of
[Hugo PaperMod](https://github.com/adityatelange/hugo-PaperMod). It retains
selected, proven infrastructure for search, RSS, social metadata, syntax
highlighting, responsive cover images and theme-preference handling. The
upstream MIT notices remain in [LICENSE](LICENSE), and [UPSTREAM.md](UPSTREAM.md)
records the exact source revision and update policy.

No Fate is not a colour variant or CSS reskin of PaperMod. Its public contract,
content architecture and presentation have diverged in substantial ways:

- PaperMod's Profile and Home-Info modes are removed from the active theme
  architecture. No Fate instead provides `editorial`, `poster`, `archive` and
  `record` page modes through a shared semantic article shell.
- A namespaced content model covers editorial metadata, visual treatment,
  archive records and SEO. Build-time validation catches invalid modes,
  incomplete hero metadata, unsuitable bundle structures and broken
  proposition references.
- The homepage is modular and publication-oriented, with propositions,
  questions, recent notes, current work and formal-record modules rather than
  PaperMod's homepage models.
- Section-independent mode inheritance, structured record views, archival
  components and reusable editorial shortcodes support publications that are
  not organised as conventional blogs.
- The CSS architecture is an ordered semantic system with separate `clean` and
  `wild` presentation layers. The wild layer adds its own editorial grid,
  masthead, display typography, signal blocks and print surface; both layers
  share the same accessible content behaviour.
- Configuration lives under `params.noFate`, with No Fate data defaults and
  stable downstream extension hooks. The demonstration site is a purpose-built
  fictional publication and content-model fixture.

These differences are documented for the
[Hugo theme acceptance criteria](https://github.com/gohugoio/hugoThemesSiteBuilder#criteria-for-acceptance-of-a-theme),
which require derivative themes to be notably different from their source.

## Requirements

- Hugo 0.158.0 or later, standard or Extended
- Git
- Go when installing the theme as a Hugo Module

The build matrix checks standard Hugo at 0.158.0 and the current supported
version recorded in CI, plus the current Hugo Extended release.

## Installation

Pin a released tag. Do not make a production site follow the theme's `main`
branch.

### Hugo Module

Initialise modules in the downstream site if needed:

```sh
hugo mod init github.com/example/site
```

Add the import to the downstream site's `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/OliverObst/no-fate"
```

Pin the release in the downstream site's module graph:

```sh
hugo mod get github.com/OliverObst/no-fate@v0.1.0
```

Before a release exists, evaluators may use an exact commit SHA. Released sites
should use a semantic version tag.

### Git submodule

```sh
git submodule add https://github.com/OliverObst/no-fate.git themes/no-fate
git -C themes/no-fate checkout v0.1.0
```

Then select the theme:

```toml
theme = "no-fate"
```

Do not edit files in `themes/no-fate`. Override templates and assets from the
downstream site so theme updates remain possible.

## Basic configuration

All No Fate-specific settings live below `params.noFate`:

```toml
baseURL = "https://example.invalid/"
title = "Example publication"

[params.noFate]
  style = "clean"
  defaultMode = "editorial"
  defaultAccent = "signal"
  showThemeToggle = true
  showSearch = true
  showReadingTime = true
  showPropositions = true
  enableImageProcessing = true
  validateContentModel = true
  strictHomeSelections = false

[params.noFate.home]
  modules = ["opening", "featured_argument", "questions", "featured_archive", "selected_writing", "visual_interruption", "current_work", "formal_record"]
  featuredProposition = ""

[params.noFate.archive]
  showArtefactNumbers = true
  showRights = true

[params.noFate.images]
  widths = [480, 800, 1200, 1600]
  webpQuality = 82

[params.noFate.record]
  dataFile = "record"
  enableClientFilters = true
  selectedGroupBy = "collection"
  filterFields = ["year", "type", "topic"]
  highlightCreators = []
  showAbstracts = false
```

The namespace is deliberately compact. Prefer consistent defaults and page
front matter to large collections of one-off switches.

`strictHomeSelections` makes a production build fail when an explicitly
selected homepage path is missing or unpublished. Development builds omit the
missing item so drafts can move around without replacing sections with
placeholder cards.

## Visual styles

No Fate ships with two presentation layers:

| Style | Character |
| --- | --- |
| `clean` | Quiet, spacious and typographically direct. This is the default. |
| `wild` | Dense editorial grids, black-and-signal colour blocks, oversized type and a lightly worn print surface. |

Choose one site-wide:

```toml
[params.noFate]
  style = "wild"
```

The style setting changes presentation only. Content types, page modes,
accessibility behaviour and downstream extension points remain the same.
Unrecognised values fall back to `clean` with a build warning.

The optional wild masthead labels are ordinary site configuration:

```toml
[params.noFate.wild]
  masthead = "Independent notes / practical disturbances"
  issue = "Issue 01"
```

Homepage authors may provide deliberate display-line breaks without changing
the accessible page title:

```yaml
visual:
  wild_title_lines:
    - "What we"
    - "make"
    - "for ourselves"
  wild_reference: "Ref. 01 / Built by hand"
```

## Page modes

Every substantive page selects one of four modes. These names form the public
content contract. A shared resolver and semantic article shell preserve the
same document structure while mode-specific openings, metadata, width rules,
components and print behaviour change the presentation.

| Mode | Intended use |
| --- | --- |
| `editorial` | Essays, histories, and substantial notes. This is the default. |
| `poster` | Major arguments, questions, and short declarative pieces. |
| `archive` | Image-led histories, collections, and evidence-rich narratives. |
| `record` | Publications, formal indexes, bibliographies, and dense tables. |

Set a mode in page front matter:

```yaml
---
title: "What are we optimising?"
date: 2026-06-18
summary: "A fictional question used to demonstrate the poster mode."
demo: true

content:
  format: "question"

visual:
  mode: "poster"
  accent: "signal"
---
```

Resolution order is page `visual.mode`, then the current section's
`visual.mode`, then `params.noFate.defaultMode`. The current section may have
any name and may be nested. Unsupported values produce a build warning and
fall back to the configured default. See [Page modes](docs/page-modes.md) for
the complete behaviour, front matter options and authoring constraints.

## Repository architecture

The theme follows Hugo's modern root-level lookup structure:

```text
archetypes/                 Generic content starters
assets/css/                 Ordered No Fate foundations and mode layers
assets/js/                  Progressive theme, navigation, search, and gallery scripts
data/no-fate/               Generic defaults and component definitions
images/                     Hugo theme-gallery screenshot and thumbnail
layouts/_markup/            Markdown render hooks
layouts/_partials/          Shared article, home, mode, record, and extension partials
layouts/_shortcodes/        Semantic editorial components
schemas/                    Machine-readable downstream data contracts
exampleSite/                Clearly fictional build and behaviour fixtures
hugo.toml                   Theme defaults
theme.toml                  Public theme metadata
```

The numbered stylesheets run from reset and semantic tokens through shell,
typography, components, articles, homepage, record, mode, and utility layers.
Downstream styles in `assets/css/extended/` continue to load last.

`single.html` is shared by every page mode. Mode-specific partials control the
opening and body boundary without duplicating the complete page template.

The `hooks/head-start.html`, `hooks/head-end.html`, and `hooks/body-end.html`
partials are stable downstream extension points. Override them from the
downstream site instead of editing the theme.

## Content structure

Section names are not fixed. The demonstration site uses Essays, Questions,
Notes, Archives, Projects, Record, and About only as examples. A downstream
site may rename or remove all of them without changing the theme.

Use leaf bundles for substantive pages and their media. The content validator
checks this convention for essays, questions, notes, histories, projects, and
artefacts:

```text
content/
└── archives/
    └── tide-room-ledgers/
        ├── index.md
        ├── feature.jpg
        ├── ledger-01.jpg
        └── source-note.pdf
```

When a hero image is present, provide meaningful alternative text:

```yaml
visual:
  mode: "archive"
  hero: "feature.jpg"
  hero_alt: "Fictional ledger pages arranged beside a tide gauge"
  hero_treatment: "raw"
```

The stable front matter contract uses the `content`, `editorial`, `visual`,
`archive`, and `seo` namespaces. Published pages are checked for required
fields, recognised modes and image treatments, hero alternative text, bundle
structure, and proposition references. See
[Content model](docs/content-model.md) for the complete schema, inheritance
rules, supported values, proposition behaviour, and migration fallbacks.

Reusable posters, questions, asides, quotations, image groups, contact sheets,
artefacts and timelines are documented in
[Editorial components](docs/editorial-components.md). Responsive images,
typed quotations, anchored headings, external links and sortable tables are
implemented as Markdown render hooks or progressive enhancements.

The image pipeline, prepared treatment derivatives and public/private rights
boundary are documented in [Images and rights](docs/images-and-rights.md).

Homepage order, selected-content validation, section densities and generic
front matter-driven filters are documented in
[Homepage and sections](docs/homepage-and-sections.md).

Primary and secondary menu labels, local search-index rules, section RSS and
discovery metadata are documented in
[Navigation, search and feeds](docs/navigation-search-and-feeds.md).

The optional data-driven publications, talks, exhibitions, releases, datasets,
and other outputs system is documented in
[Structured records](docs/structured-records.md). It provides selected groups,
a complete chronological list, progressive year/type/topic filters, creator
highlighting, source and export links, machine-readable entries, and
print-specific behaviour without requiring JavaScript.

The release standards for keyboard and assistive-technology use, static-first
asset delivery, Lighthouse budgets and A4 output are documented in
[Accessibility, performance and print](docs/accessibility-performance-and-print.md).

Sites moving from another theme or publishing system should follow the
[migration guide](docs/migration.md). It covers content inventory, page-mode
mapping, leaf bundles, redirects, public-content review, staged cut-over and
rollback.

## Demonstration site

The material in `exampleSite/` is a removable publication fixture rather than
starter identity. The rendered copy stays in character; maintainer notes about
the fixture live in `exampleSite/README.md`.

Run the development site from the theme repository root:

```sh
hugo server \
  --source exampleSite \
  --themesDir ../.. \
  --buildDrafts
```

Run the production smoke test:

```sh
hugo \
  --source exampleSite \
  --themesDir ../.. \
  --minify
```

The unpublished example uses `https://example.invalid/` as its base URL.

The hidden `fixtures/structural-components/` page exercises the Sections 10–11
render hooks and baseline shortcodes without adding those fixtures to the
demonstration navigation. The Section 27.2 fixture set adds a 20-image archive,
a 60-row table, maths/code/footnotes, a downloadable PDF and long English and
German titles.

## Automated quality tests

The repository includes test-only tooling for rendered links, HTML validation,
fixture integrity, axe, Lighthouse accessibility/performance/CLS thresholds and
Linux Chromium visual regression. Install it and run the rendered-site suite
with:

```sh
npm ci
npx playwright install chromium
npm run test:quality
```

The repository also creates and destroys minimal downstream sites to verify
both supported installation paths:

```sh
npm run test:installation
```

This checks a Hugo Module import and a real `themes/no-fate` Git submodule
without publishing or modifying the current repository.

Visual checks automatically use the pinned Playwright Linux container on
macOS or Windows. The committed baselines cover desktop and mobile homepages,
all page modes, both colour themes, wide and narrow navigation, record
filtering, Section 27.2 stress fixtures, contact sheets and print-media output.
See
[Automated quality testing](docs/testing.md) for individual commands, baseline
updates, deliberate validator exceptions and CI behaviour.

## Compatibility

No Fate supports standard and Extended Hugo 0.158.0 and later. Module
installation and its repository test require Go. Installing and building the
theme does not require Node.js or a JavaScript build tool; Node.js is used only
by the optional repository quality suite.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.
Contributions must remain generic, use fictional fixtures, preserve
accessibility and publishing behaviour, and include the relevant build checks.

Changes are developed through reviewed pull requests. Breaking front matter,
template, and CSS changes must be recorded in [CHANGELOG.md](CHANGELOG.md).
Maintainers preparing a tag must complete the
[release checklist](RELEASE.md).

## Licence and provenance

No Fate is distributed under the MIT Licence. Copyright notices from PaperMod
and its own upstream foundation remain in [LICENSE](LICENSE). The exact source
revision and update policy are recorded in [UPSTREAM.md](UPSTREAM.md).

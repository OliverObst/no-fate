# No Fate

No Fate is a reusable Hugo theme for sites that combine an editorial voice
with structured records, archives, projects, and long-form writing.

It is designed for personal publications, independent journals, portfolios,
research or project archives, and small editorial organisations. It does not
assume a particular author, institution, subject area, domain, navigation
structure, or editorial position.

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

## Requirements

- Hugo Extended 0.158.0 or later
- Git
- Go when installing the theme as a Hugo Module

The build matrix checks Hugo Extended 0.158.0 and the current supported version
recorded in CI.

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

After the first No Fate release, pin it in the downstream site's module graph:

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
  defaultMode = "editorial"
  defaultAccent = "signal"
  showThemeToggle = true
  showSearch = true
  showReadingTime = true
  showPropositions = true
  enableImageProcessing = true

[params.noFate.home]
  showFormalRecord = true
  showRecentNotes = true

[params.noFate.archive]
  showArtefactNumbers = true
  showRights = true

[params.noFate.record]
  dataFile = "record"
  enableClientFilters = true
```

The namespace is deliberately compact. Prefer consistent defaults and page
front matter to large collections of one-off switches.

## Page modes

Every substantive page selects one of four modes. These names form the public
content contract. The repository now includes a shared resolver, semantic
article shell, and mode-specific opening and body partials. Full mode behaviour
and final presentation remain later implementation work.

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

Resolution order is page `visual.mode`, then a section default, then
`params.noFate.defaultMode`.

## Repository architecture

The theme follows Hugo's modern root-level lookup structure:

```text
archetypes/                 Generic content starters
assets/css/                 Ordered No Fate foundations and mode layers
assets/js/                  Progressive theme, navigation, search, and gallery scripts
data/no-fate/               Generic defaults and component definitions
layouts/_markup/            Markdown render hooks
layouts/_partials/          Shared article, home, mode, record, and extension partials
layouts/_shortcodes/        Semantic editorial components
exampleSite/                Clearly fictional build and behaviour fixtures
hugo.toml                   Theme defaults
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

Use leaf bundles for substantive pages and their media:

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
```

## Demonstration site

Every name, organisation, project, publication, event, and proposition in
`exampleSite/` is invented. The notice is displayed throughout the example
site. The fixtures are safe to remove and must never be treated as starter
identity or downstream content.

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

The hidden `fixtures/structural-components/` page exercises the Section 5
render hooks and baseline shortcodes without adding those fixtures to the
demonstration navigation.

## Compatibility

No Fate supports Hugo Extended 0.158.0 and later. Module installation requires
Go. Ordinary theme development does not require Node.js or a JavaScript build
tool.

Search, RSS, taxonomies, archives, social metadata, syntax highlighting,
responsive cover-image infrastructure, and theme preference handling originate
from the pinned PaperMod foundation and will be retained or adapted as the
independent design is implemented.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.
Contributions must remain generic, use fictional fixtures, preserve
accessibility and publishing behaviour, and include the relevant build checks.

Changes are developed through reviewed pull requests. Breaking front matter,
template, and CSS changes must be recorded in [CHANGELOG.md](CHANGELOG.md).

## Licence and provenance

No Fate is distributed under the MIT Licence. Copyright notices from PaperMod
and its own upstream foundation remain in [LICENSE](LICENSE). The exact source
revision and update policy are recorded in [UPSTREAM.md](UPSTREAM.md).

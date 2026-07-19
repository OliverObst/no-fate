# Structured records

No Fate includes an optional data-driven record for publications, talks,
exhibitions, releases, datasets, software, performances, catalogues, or any
other output that benefits from consistent metadata. The visible section name
is entirely controlled by the downstream site: `Record`, `Works`,
`Bibliography`, `Outputs`, and more specific names all use the same renderer.

This subsystem is separate from the `record` visual mode. The mode can style
ordinary content pages; the data-driven renderer reads a complete collection
from one configurable data file.

## Activate a section

Set the site-wide data source under the No Fate namespace:

```toml
[params.noFate.record]
  dataFile = "record"
  enableClientFilters = true
  selectedGroupBy = "collection"
  filterFields = ["year", "type", "topic"]
  highlightCreators = ["Alex Rowan"]
  showAbstracts = false
```

`dataFile` resolves from the downstream site's `data/` directory. Both a
top-level name such as `record` and a nested path such as
`catalogues/outputs` are supported. Real records stay in the downstream
repository; the theme contains templates and documentation only.

Opt a section into the renderer from its `_index.md`:

```yaml
---
title: "Works"
description: "Selected work and complete chronological record."

content:
  format: "record"

visual:
  mode: "record"

record:
  data_driven: true
  selected_group_by: "collection"
  enable_filters: true
  filter_fields:
    - "year"
    - "type"
    - "topic"
  highlight_creators:
    - "Alex Rowan"
  show_abstracts: false
  labels:
    selected: "Selected work"
    complete: "Complete record"
    filter_year: "Year"
    filter_type: "Type"
    filter_topic: "Topic"
---
```

Page settings override their site-wide equivalents. Labels and section
content remain local to the downstream site, so the theme inserts no
academic vocabulary of its own.

## Data schema

The initial format is a YAML sequence in `data/record.yaml`. A map containing
an `entries` sequence is also accepted when a site needs to keep its own
file-level metadata. A machine-readable JSON Schema is available at
[`schemas/structured-record.schema.json`](../schemas/structured-record.schema.json).

```yaml
- id: "rowan-2026-example"
  title: "Measuring the Maintenance of Shared Instruments"
  year: 2026
  authors:
    - "Alex Rowan"
    - "Mira Chen"
  venue: "Journal of Fictional Field Methods"
  type: "article"
  topics:
    - "systems"
    - "maintenance"
  collection: "example"
  selected: false
  doi: ""
  url: "https://example.invalid/record/rowan-2026-example/"
  source: ""
  catalogue: ""
  pdf: ""
  bibtex: ""
  download: ""
  abstract: "A fabricated abstract used only to demonstrate the renderer."
```

Required fields:

| Field | Purpose |
| --- | --- |
| `id` | Stable, unique record identifier and HTML fragment. |
| `title` | Record title. |
| `year` | Publication, presentation, release, or event year. |
| `type` | User-defined kind such as `article`, `talk`, or `dataset`. |

Optional fields:

| Field | Purpose |
| --- | --- |
| `authors` or `creators` | Ordered list of people or credited entities. |
| `venue` | Journal, event, gallery, publisher, platform, or other context. |
| `topics` | Values exposed by the optional topic filter. |
| `collection` | Default grouping for selected entries. |
| `selected` | Includes the entry in the selected renderer when `true`. |
| `doi` | DOI value or complete DOI URL. Bare values link through `doi.org`. |
| `url` or `canonical` | Canonical record URL; `canonical` takes precedence. |
| `source` | Source URL. |
| `catalogue` | Catalogue URL. |
| `pdf` | PDF URL. |
| `bibtex` or `bibtex_url` | BibTeX URL, or inline BibTeX beginning with `@`. |
| `download` | Dataset, release, archive, or other download URL. |
| `abstract` | Optional summary; selected entries show it, and `showAbstracts` adds it to the complete list. |

Additional fields are preserved in the data and ignored by the initial
renderer. This permits a downstream schema to grow without forking the theme.
Every entry is checked at build time for required fields and duplicate IDs.
The schema describes field types while the renderer performs the uniqueness
check that JSON Schema cannot express for a property inside each array item.

## Rendering and filtering

Selected entries are grouped by the field named by `selectedGroupBy` or
`selected_group_by`; `collection` is the default. The complete list is sorted
by descending year and then title. It is always present as a semantic ordered
list.

Year, type, and topic filters are progressive enhancement. Their form is
hidden until the client script is ready, and filtering only hides entries
already rendered in the complete list. With JavaScript disabled, all entries
remain readable and every source or download link remains available.

Creator highlighting is an exact, case-insensitive name match. Highlighted
names use both weight and an underline, so colour is not the only signal.
Selected entries include their abstracts when supplied; `showAbstracts` or
`show_abstracts` controls whether those abstracts are repeated in the complete
chronological list.

Each entry uses `CreativeWork` microdata with machine-readable identifier,
date, title, creators, venue, topics, canonical URL, and abstract where
available. The renderer does not generate individual record pages; a future
content adapter may add those without changing this schema.

## Print

Filters are removed in print. Entries avoid splitting where the browser can
honour the request, colours collapse to ink on paper, and external link
destinations are printed beside their labels. The selected and complete
sections remain present so a printout retains the same editorial hierarchy as
the screen version.

## Demonstration fixture

`exampleSite/data/record.yaml` contains exactly 200 generated entries. Every
person, venue, title, DOI, and URL in it is invented or uses the reserved
`example.invalid` domain. Regenerate it deterministically with:

```sh
node .github/scripts/generate-record-fixture.mjs
```

CI runs the generator in check mode and verifies the rendered count, selected
groups, filters, source and BibTeX links, microdata, and the JavaScript-free
complete list.

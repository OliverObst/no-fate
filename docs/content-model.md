# No Fate content model

No Fate content model version 1 keeps publishing metadata in five stable
namespaces. It does not depend on section names, subject matter, author type, or
site identity.

## Complete page record

Use this record for a substantive published page:

```yaml
---
title: "What problem is this system actually solving?"
subtitle: "A technically impressive design can still begin from the wrong premise."
date: 2026-09-12
lastmod: 2026-09-12
summary: "A fictional demonstration article showing the poster page mode."
demo: true

content:
  format: "question"
  status: "published"
  original_date: null
  media_type: ""
  collection: ""

editorial:
  proposition:
    - "example-question-the-premise"
  series: null
  issue: null
  featured: true

visual:
  mode: "poster"
  accent: "signal"
  headline_scale: "large"
  opening_alignment: "left"
  hero: "feature.jpg"
  hero_alt: "Fictional prototype assembled on a workbench"
  hero_treatment: "high-contrast"
  invert_opening: true

archive:
  start_year: null
  end_year: null
  locations: []
  people: []
  source: ""
  rights: ""

seo:
  description: ""
  image: "feature.jpg"
  canonical: ""
---
```

The six archetypes in `archetypes/` provide format-specific versions of this
record.

## Required fields

Every published regular page requires:

- `title`
- `date`
- `summary` or `subtitle`
- `content.format`
- `visual.mode`, either on the page or its current section

If `visual.hero` is set, `visual.hero_alt` is also required.

Archive-mode pages also require a period, at least one location, a source and a
rights statement. `content.media_type` and `content.collection` are optional
generic values that sections may expose as filters.

Draft pages may remain incomplete while they are being written. Branch pages,
taxonomy pages, and generated pages are not treated as regular content records.

## Section independence

A mode may be declared directly on a page:

```yaml
visual:
  mode: "poster"
```

If it is omitted, No Fate reads `visual.mode` from the page's current section.
The section is determined by Hugo's content hierarchy, not by its directory
name:

```text
content/
└── dispatches/
    ├── _index.md
    └── first-dispatch/
        └── index.md
```

```yaml
# content/dispatches/_index.md
visual:
  mode: "archive"
```

`first-dispatch` resolves to `archive` without a mode in its own front matter.
If neither page nor section declares a mode, the resolver uses
`params.noFate.defaultMode`. The validator still reports the missing page or
section declaration so the content contract remains explicit.

## Leaf page bundles

Substantive formats must use leaf bundles:

```text
content/
└── archives/
    └── fictional-ledgers/
        ├── index.md
        ├── feature.jpg
        ├── ledger-01.jpg
        └── source-note.pdf
```

No Fate checks the bundle convention for these formats:

- `artefact`
- `essay`
- `history`
- `note`
- `project`
- `question`

Media, captions, downloads, and source material then travel with the page and
are available through Hugo page resources.

## Page modes and image treatments

Supported page modes:

- `editorial`
- `poster`
- `archive`
- `record`

See [Page modes](page-modes.md) for resolution, presentation, accessibility,
print behaviour and mode-specific authoring constraints.

Supported `visual.hero_treatment` values:

- `raw`
- `monochrome`
- `high-contrast`
- `halftone`
- `photocopy`
- `technical`
- `duotone`

The treatment name describes presentation intent. Prepared source derivatives
are required for true halftone and photocopy effects. See
[Images and rights](images-and-rights.md) for responsive-width configuration,
resource derivatives and structured public rights metadata.

## Editorial propositions

Propositions belong to the downstream site:

```yaml
# data/no-fate/propositions.yaml
propositions:
  - id: "example-question-the-premise"
    title: "Good work begins by questioning the premise."
    demo: true
```

Associate one or more IDs with a page:

```yaml
editorial:
  proposition:
    - "example-question-the-premise"
```

No Fate renders defined propositions with the page and finds other content that
shares an ID. Unknown IDs produce a build warning.

A proposition data entry may define a downstream `url`. No Fate links to that
landing page only after at least two regular pages use the proposition. The
theme does not generate proposition landing pages, so a single item never
creates a thin or broken landing page automatically.

The homepage featured module normally uses `editorial.featured`. A downstream
site may instead select the newest page associated with one proposition:

```toml
[params.noFate.home]
  featuredProposition = "example-question-the-premise"
```

## Validation

Content validation is enabled by default:

```toml
[params.noFate]
  validateContentModel = true
```

Warnings cover:

- missing required fields
- unsupported page modes
- unsupported accents, headline scales, or opening alignments
- missing hero alternative text
- unsupported hero treatments
- missing archive period or location metadata
- missing archive source or rights metadata
- excessive poster interruptions or poster components in record mode
- substantive content outside leaf bundles
- malformed or unknown proposition references

Use `--panicOnWarning` in continuous integration to make these warnings fail a
build. A legacy site may temporarily disable validation during migration, but
new content should use the namespaced contract.

For migration only, No Fate still reads legacy `canonicalURL`, `images`, and
cover image values where the namespaced equivalents are absent. New pages
should use `seo.canonical`, `seo.image`, and `visual.hero`.

## Demonstration boundary

The example site marks its pages and propositions with `demo: true`. Every
name, organisation, project, publication, record, date, event, and proposition
there is invented and safe to delete.

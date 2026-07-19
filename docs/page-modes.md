# No Fate page modes

No Fate uses one semantic article shell for every regular single page. A page
mode changes composition and emphasis without changing content order or
requiring a different content section.

The four supported modes are:

- `editorial`;
- `poster`;
- `archive`;
- `record`.

Modes are an editorial control, not four unrelated templates. Every mode keeps
the same broad sequence: opening, optional hero and table of contents, body,
propositions or related material, taxonomies and page navigation.

## Content format is not page mode

`content.format` describes what a page is. `visual.mode` describes how it
should be presented.

```yaml
content:
  format: "essay"

visual:
  mode: "editorial"
```

The distinction allows an essay to receive an archive treatment when it is
evidence-led, or a project page to use record mode when it is primarily a
formal index. No Fate does not infer the mode from a section name.

`content.format` also drives validation and the opening kicker. Substantive
formats such as `essay`, `history`, `note`, `project`, `question` and
`artefact` are expected to use leaf page bundles.

## Choosing a mode

Start with the reading task:

| Mode | Primary task | Character | Body measure | Strong matches | Avoid |
| --- | --- | --- | --- | --- | --- |
| `editorial` | sustained reading | measured, spacious | 68ch | essays, notes, reflective projects | forcing every paragraph into a display block |
| `poster` | encounter one strong proposition | large, declarative | 68ch after the opening | questions, short arguments, manifestos | long directories, dense tables, repeated poster interruptions |
| `archive` | inspect narrative and evidence together | wide, annotated | 72ch narrative within a wider shell | histories, image collections, annotated documents | decorative damage that obscures source material |
| `record` | scan formal facts and entries | compact, tabular | up to 90ch | indexes, policies, bibliographies, profile records | oversized display components and ornamental metadata |

Do not select a mode merely to obtain a larger heading. Use
`visual.headline_scale` within the mode that matches the page's purpose.

## Resolution and inheritance

The active mode is resolved in this order:

1. `visual.mode` on the page;
2. `visual.mode` on the page's current section;
3. `params.noFate.defaultMode`;
4. the built-in `editorial` fallback.

Section inheritance follows Hugo's current-section model. Sections may be
renamed or nested:

```text
content/
└── field-notes/
    ├── _index.md
    └── first-ledger/
        ├── index.md
        └── feature.jpg
```

The section can establish the mode:

```yaml
# content/field-notes/_index.md
title: "Field notes"

visual:
  mode: "archive"
```

`first-ledger/index.md` then inherits `archive` without repeating the mode.
Other page-level visual fields remain page-controlled.

Set the site fallback in configuration:

```toml
[params.noFate]
  defaultMode = "editorial"
```

The selected value appears on the article:

```html
<article class="nf-article post-single" data-page-mode="archive">
```

Unsupported page or configuration values produce a build warning, name the
allowed values and fall back safely. A production build with
`--panicOnWarning` turns the warning into a failed build.

## Shared page contract

Every published regular page requires:

- `title`;
- `date`;
- either `summary` or `subtitle`;
- `content.format`;
- `visual.mode` on the page or its current section.

The stable namespaces are:

| Namespace | Responsibility |
| --- | --- |
| `content` | format, status, original date, media type and collection |
| `editorial` | propositions, series, issue and featured state |
| `visual` | mode, opening, hero and treatment |
| `archive` | period, locations, people, source and rights |
| `seo` | description, social image and canonical URL |

See the [content model](content-model.md) for the complete field contract.

## Shared visual options

```yaml
visual:
  mode: "editorial"
  accent: "signal"
  headline_scale: "medium"
  opening_alignment: "left"
  hero: ""
  hero_alt: ""
  hero_treatment: "raw"
  invert_opening: false
```

### `accent`

Accepted values are:

- `signal`: use the configured signal colour for emphasis;
- `quiet`: use a muted accent where the page should recede.

Accent changes emphasis. It must not be the only indication of state or
meaning.

### `headline_scale`

Accepted values are `small`, `medium` and `large`. Scale changes the opening
headline inside mode-specific limits. It does not turn body text into display
type.

### `opening_alignment`

Accepted values are `left` and `centre`. Centring affects the opening only;
long-form body content keeps its readable alignment.

### Hero fields

When `visual.hero` is present, meaningful `visual.hero_alt` is required.
Supported treatments are:

- `raw`;
- `monochrome`;
- `high-contrast`;
- `halftone`;
- `photocopy`;
- `technical`;
- `duotone`.

True halftone and photocopy effects should use prepared derivatives. See
[Images and rights](images-and-rights.md) for processing, attribution and
private permission metadata.

### `invert_opening`

An inverted opening uses a solid high-contrast surface. Essential text is not
placed over the hero image. The print layer removes the inverse background.

## Editorial mode

Use `editorial` for sustained arguments, essays, substantial notes and
reflective project writing. It is the default mode.

### Behaviour

- controlled opening and headline;
- 68-character reading measure;
- generous section spacing;
- wide figures remain available without widening ordinary paragraphs;
- pull quotes and occasional poster components can extend beyond the reading
  column;
- signal colour remains an accent rather than a continuous surface.

### Authoring guidance

Lead with an argument or observation, then let headings carry the structure.
Use ordinary Markdown for ordinary prose. Use asides for genuinely parallel
context and pull quotes only when the quotation merits a second visual rhythm.

Poster interruptions are permitted but should remain scarce. The validator
warns when any regular page contains more than three.

### Example

```yaml
---
title: "Maintenance belongs in the first sketch"
subtitle: "A fictional workshop note about designing for repair."
date: 2026-04-11
lastmod: 2026-04-11
summary: "A fictional argument about repairable shared instruments."

content:
  format: "essay"
  status: "published"
  original_date: null

editorial:
  proposition: []
  series: null
  issue: null
  featured: false

visual:
  mode: "editorial"
  accent: "signal"
  headline_scale: "medium"
  opening_alignment: "left"
  hero: ""
  hero_alt: ""
  hero_treatment: "raw"
  invert_opening: false

seo:
  description: "A fictional argument about repairable shared instruments."
  image: ""
  canonical: ""
---
```

### Do not use editorial mode to

- hide a dense formal index inside essay typography;
- present a photographic collection without source and rights context;
- make a short proposition feel substantial through length alone.

## Poster mode

Use `poster` for one major question, proposition or short declarative argument.
The opening may occupy most of the first viewport, but the body remains normal
selectable text.

### Behaviour

- large, tightly set headline;
- stronger deck and optional inverse opening;
- two-column opening on wide screens;
- conventional 68-character body after the opening;
- enlarged poster components without distressed body typography;
- ordinary document flow on narrow screens.

### Authoring guidance

A poster page should be understandable from its heading, deck and first short
passage. Prefer one central claim to a collection of unrelated slogans.
Headings still need a logical hierarchy, even when the opening is visually
large.

Do not simulate a poster with a flattened image of text. Text must remain
selectable, zoomable, translatable and available to assistive technology.

### Example

```yaml
---
title: "Who repairs the convenient thing?"
subtitle: "A fictional question for systems that have misplaced their seams."
date: 2026-05-22
summary: "A fictional question about the maintenance hidden by convenience."

content:
  format: "question"
  status: "published"
  original_date: null

editorial:
  proposition: []
  featured: true

visual:
  mode: "poster"
  accent: "signal"
  headline_scale: "large"
  opening_alignment: "left"
  hero: ""
  hero_alt: ""
  hero_treatment: "high-contrast"
  invert_opening: true

seo:
  description: "A fictional question about hidden maintenance."
  image: ""
  canonical: ""
---
```

### Do not use poster mode for

- a publication list, CV or table-led page;
- long text that depends on a quiet opening;
- repeated flashing, inversion, marquee or animation effects;
- more visual interruption than the claim can support.

## Archive mode

Use `archive` for histories, photographic collections, annotated documents,
artefact narratives and evidence-rich project retrospectives.

### Required metadata

Published archive pages require:

- at least one of `archive.start_year` or `archive.end_year`;
- at least one `archive.locations` value;
- `archive.source`;
- `archive.rights`.

The period and locations appear as opening facts. Source and rights remain
available to archive components and the content model even when the prose also
explains them.

### Behaviour

- wider shell with a 72-character narrative measure;
- opening facts alongside the heading on wide screens;
- full-width contact sheets, image spreads and timelines;
- monospaced tabular metadata and captions;
- artefact numbering as real text;
- ordinary narrative paragraphs remain constrained;
- one-column opening on narrow screens.

### Authoring guidance

Treat images and files as evidence. Keep alt text descriptive, captions
contextual and rights metadata separate. Use `raw` or `technical` treatment
when a decorative filter would obscure details. Permit crops only for
thumbnails whose content remains intelligible.

Use a leaf bundle so source material, public attribution and downloads move
with the page.

### Example

```yaml
---
title: "The example harbour notebooks"
subtitle: "Annotations, repairs and weather from an invented instrument room."
date: 2026-02-03
summary: "A fictional archive of annotated maintenance notebooks."

resources:
  - src: "feature.jpg"
    params:
      alt: "Open notebooks beside a labelled fictional gauge"
      caption: "The notebooks after cataloguing."
      rights:
        creator: "Example Instrument Room"
        source: "Cabinet C"
        licence: "Example open archive licence"
        permission: "Private accession reference"

content:
  format: "history"
  status: "published"
  media_type: "photographs and notebooks"
  collection: "example harbour records"

editorial:
  proposition: []
  featured: false

visual:
  mode: "archive"
  accent: "signal"
  headline_scale: "large"
  opening_alignment: "left"
  hero: "feature.jpg"
  hero_alt: "Open notebooks beside a labelled fictional gauge"
  hero_treatment: "raw"
  invert_opening: false

archive:
  start_year: 1987
  end_year: 1994
  locations:
    - "Example Harbour"
  people: []
  source: "Example Instrument Room, Cabinet C"
  rights: "Example open archive licence"

seo:
  description: "A fictional archive of annotated maintenance notebooks."
  image: "feature.jpg"
  canonical: ""
---
```

### Do not use archive mode to

- make unattributed media appear authoritative;
- apply simulated age or damage to every historical image;
- publish private administrative permission notes;
- widen ordinary prose simply because the screen has room.

## Record mode

Use `record` for formal indexes, policy or disclosure pages, selected outputs,
bibliographies, compact profiles and table-led reference material.

Record mode also provides the visual frame for the optional data-driven
structured-record subsystem. A normal record-mode page and the generated
200-entry record are related but distinct: one is authored Markdown, the other
is rendered from a configured data file.

### Optional opening facts

Record mode displays these fields when present:

- `content.status`;
- `content.original_date`;
- `editorial.series`;
- `editorial.issue`.

They appear in a semantic description list, not a decorative badge row.

### Behaviour

- compact headline and restrained opening;
- full-width shell and up to 90-character reading measure;
- monospaced metadata with stable numeric alignment;
- dense, semantic tables;
- repeated table headers and row-break protection in print;
- oversized poster components are neutralised;
- client filters enhance server-rendered content rather than replacing it.

The validator does not permit poster shortcode interruptions in record mode.

### Example

```yaml
---
title: "Register of example workshop outputs"
subtitle: "The official version, such as it is."
date: 2026-07-01
summary: "A fictional formal index of workshop outputs."

content:
  format: "record"
  status: "current"
  original_date: 2024-01-15

editorial:
  proposition: []
  series: "Example registers"
  issue: "R-04"
  featured: false

visual:
  mode: "record"
  accent: "quiet"
  headline_scale: "small"
  opening_alignment: "left"
  hero: ""
  hero_alt: ""
  hero_treatment: "technical"
  invert_opening: false

seo:
  description: "A fictional formal index of workshop outputs."
  image: ""
  canonical: ""
---
```

### Do not use record mode to

- make a long essay appear more authoritative through denser type;
- hide information behind client-only filters;
- remove table headers or semantic list structure for compactness;
- duplicate a structured data set manually in Markdown.

## Responsive behaviour

At 48rem and below, multi-column poster, archive and record openings collapse
to one column. Navigation keeps primary labels first and hides optional
secondary phrases. Wide components scroll or stack according to their content;
the page itself must not require horizontal scrolling.

Test at 320 pixels and at 200 per cent browser zoom. Mode-specific display
choices never justify clipping controls, captions, code or table content.

## Accessibility contract

Every mode:

- uses one `h1`;
- retains visible keyboard focus and the skip link;
- keeps captions separate from alt text;
- exposes opening facts as a description list;
- preserves semantic lists, table headers and document order;
- respects reduced-motion preferences;
- uses text, weight, rules or labels in addition to colour;
- keeps poster text selectable and zoomable;
- avoids essential content created only with CSS pseudo-elements.

The visual size of a headline does not determine its heading level. Shortcodes
must fit the page's logical heading hierarchy.

## Print contract

All modes print on A4 with a light background. Print output removes navigation,
filters, search, media controls and decorative transforms while retaining:

- title;
- author when configured;
- date;
- canonical URL;
- body;
- figure captions and public attribution;
- artefact numbers and sources;
- useful external link destinations.

Editorial and poster bodies return to a comfortable print measure. Archive
figures and record entries avoid splitting where the browser permits. Record
tables repeat headers.

## Downstream extension

Prefer front matter and CSS overrides to template forks. Downstream CSS in
`assets/css/extended/` loads after the mode and style layers.

Useful structural selectors include:

```css
.nf-article[data-page-mode="editorial"] {}
.nf-article[data-page-mode="poster"] {}
.nf-article[data-page-mode="archive"] {}
.nf-article[data-page-mode="record"] {}
```

Override a mode partial only when the semantic structure genuinely needs to
change. The shared opening and article shell protect accessibility, metadata,
print and downstream compatibility; copying them casually makes future theme
updates harder.

Stable hook partials are available at:

```text
layouts/_partials/hooks/head-start.html
layouts/_partials/hooks/head-end.html
layouts/_partials/hooks/body-end.html
```

## Validation and troubleshooting

Run production builds with warnings promoted to failures:

```sh
hugo \
  --source exampleSite \
  --themesDir ../.. \
  --minify \
  --panicOnWarning
```

Common warnings mean:

| Warning | Resolution |
| --- | --- |
| missing `visual.mode` | declare it on the page or current section |
| unsupported mode | use `editorial`, `poster`, `archive` or `record` |
| missing hero alt | add a meaningful `visual.hero_alt` or remove the hero |
| unsupported treatment | choose a documented hero treatment |
| archive period, location, source or rights missing | complete the archive record before publishing |
| substantive content is not a leaf bundle | move it to `section/slug/index.md` |
| too many poster interruptions | remove or combine display components |
| poster interruption in record mode | use ordinary headings, asides or table structure |

Do not disable `params.noFate.validateContentModel` merely to publish an
incomplete new page. Temporary disablement is intended only for a controlled
legacy migration.

## Reference fixtures

The example site supplies one single-page fixture for each mode:

| Mode | Fixture |
| --- | --- |
| `editorial` | `exampleSite/content/essays/maintenance-is-a-design-material/index.md` |
| `poster` | `exampleSite/content/questions/what-are-we-optimising/index.md` |
| `archive` | `exampleSite/content/archives/tide-room-ledgers/index.md` |
| `record` | `exampleSite/content/record/register-of-useful-misplacements/index.md` |

The structured-record index at `exampleSite/content/record/_index.md` exercises
the separate data-driven renderer with 200 fictional entries. CI verifies the
resolved mode, shared shell and release constraints.

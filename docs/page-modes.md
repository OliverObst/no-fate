# No Fate page modes

No Fate uses one semantic article shell for every single page. A page mode
changes the opening composition, headline scale, reading measure, metadata
density, component treatment and print behaviour without changing the content
order or requiring a separate page template.

## Resolution

The active mode is resolved in this order:

1. `visual.mode` on the page;
2. `visual.mode` on the page's current section;
3. `params.noFate.defaultMode`;
4. `editorial`.

Section inheritance follows Hugo's current-section model, so sections may be
renamed or nested. The selected value is exposed on the article:

```html
<article class="nf-article post-single" data-page-mode="poster">
```

Supported values are `editorial`, `poster`, `archive` and `record`.
Unsupported values produce a build warning, name the allowed values, and fall
back to the configured default. With `--panicOnWarning`, an unsupported mode
fails the build.

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

`headline_scale` accepts `small`, `medium` or `large`.
`opening_alignment` accepts `left` or `centre`. `invert_opening` creates a
solid, high-contrast opening; it never places essential text directly over an
image.

## `editorial`

Use `editorial` for essays, reflective histories and substantial notes. It is
the default mode.

- controlled opening and headline;
- 68-character reading measure;
- generous section spacing;
- wide figures and editorial interruptions remain available;
- pull quotes and poster components can extend beyond the reading column;
- signal colour is used as an accent rather than a continuous surface.

The print treatment retains the comfortable reading measure and prevents
figures, tables and editorial components from splitting unnecessarily.

## `poster`

Use `poster` for major arguments, prominent questions and short declarative
pieces.

- opening may occupy most of the first viewport;
- large, tightly set headline and stronger deck;
- optional solid inverse opening;
- conventional 68-character article body after the opening;
- poster interruptions are enlarged without changing body typography;
- mobile layout returns to normal document flow.

Keep poster interruptions scarce. A normal article should contain no more than
three. Do not use motion, marquees or distressed body type. Reduced-motion
preferences are honoured globally.

## `archive`

Use `archive` for histories, photographic collections, annotated documents and
project retrospectives.

- visible period and location metadata;
- wider body for contact sheets, image spreads and timelines;
- monospaced, tabular metadata and captions;
- automatically numbered artefact components;
- conventional narrative text remains constrained to a readable measure;
- chronological and collection-style content use the same shell.

Published archive pages must provide at least one of `archive.start_year` or
`archive.end_year`, plus at least one `archive.locations` value.

## `record`

Use `record` for formal indexes, publications, bibliographies, career records
and contact or affiliation pages.

- compact headline and restrained opening;
- status, original date, series and issue shown as structured facts when set;
- dense tabular layout with stable numeric alignment;
- full-width tables and a wider reading measure;
- oversized poster components are deliberately neutralised;
- repeated table headers and row-break protection in print.

Record content remains complete without JavaScript. Client-side filters may
enhance a record but must not be the only way to reach an entry.

## Accessibility and print

Every mode retains the same source order: breadcrumbs, heading, deck, optional
facts, page metadata, body and article footer. Each page has one `h1`; mode
facts use a description list; tables retain column scopes through the Markdown
render hook.

All modes:

- retain visible keyboard focus;
- respect reduced-motion preferences;
- collapse multi-column openings at narrow widths;
- preserve readable contrast in light, dark and inverse openings;
- remove decorative surfaces and transformations in print;
- avoid breaking figures, artefacts, tables and preformatted blocks across
  printed pages where possible.

The example site contains one published single-page fixture for every mode,
and CI verifies the resolved mode plus the shared semantic shell in generated
HTML.
